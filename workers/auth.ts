import type { D1Database } from '@cloudflare/workers-types'
import { findUserByEmail, createUser, findUserById, markEmailVerified } from './db'
import * as crypto from './crypto'

/** 注册 */
export async function handleRegister(
  db: D1Database,
  jwtSecret: string,
  body: { email: string; password: string; nickname?: string }
): Promise<Response> {
  const { email, password } = body

  // 校验
  if (!email || !password) {
    return json({ error: '邮箱和密码不能为空' }, 400)
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: '邮箱格式不正确' }, 400)
  }
  if (password.length < 6) {
    return json({ error: '密码至少 6 位' }, 400)
  }

  // 检查是否已注册
  const existing = await findUserByEmail(db, email)
  if (existing) {
    return json({ error: '该邮箱已被注册' }, 409)
  }

  // 创建用户
  const hash = await crypto.hashPassword(password)
  const user = await createUser(db, email, hash, body.nickname)

  // 小体量项目，暂时自动验证邮箱（后续可接入 MailChannels / Resend 发送验证邮件）
  await markEmailVerified(db, user.id)
  user.email_verified = 1

  // 签发 JWT
  const token = await crypto.signJWT(jwtSecret, { sub: String(user.id), email: user.email })

  return withAuthCookie(
    json({ user: sanitizeUser(user), token }),
    token
  )
}

/** 登录 */
export async function handleLogin(
  db: D1Database,
  jwtSecret: string,
  body: { email: string; password: string }
): Promise<Response> {
  const { email, password } = body

  if (!email || !password) {
    return json({ error: '邮箱和密码不能为空' }, 400)
  }

  const user = await findUserByEmail(db, email)
  if (!user) {
    return json({ error: '邮箱或密码错误' }, 401)
  }

  const valid = await crypto.verifyPassword(password, user.password_hash)
  if (!valid) {
    return json({ error: '邮箱或密码错误' }, 401)
  }

  const token = await crypto.signJWT(jwtSecret, { sub: String(user.id), email: user.email })

  return withAuthCookie(
    json({ user: sanitizeUser(user), token }),
    token
  )
}

/** 登出 */
export function handleLogout(): Response {
  const body = JSON.stringify({ ok: true })
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'auth_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
    },
  })
}

/** 获取当前登录用户信息 */
export async function handleMe(
  db: D1Database,
  jwtSecret: string,
  request: Request
): Promise<Response> {
  const token = extractToken(request)
  if (!token) {
    return json({ user: null })
  }

  const payload = await crypto.verifyJWT(jwtSecret, token)
  if (!payload) {
    return json({ user: null })
  }

  const user = await findUserById(db, Number(payload.sub))
  if (!user) {
    return json({ user: null })
  }

  return json({ user: sanitizeUser(user) })
}

// ── helpers ──

function sanitizeUser(user: { id: number; email: string; nickname: string; avatar_url: string; email_verified: number; created_at: string }) {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatarUrl: user.avatar_url,
    emailVerified: user.email_verified === 1,
    createdAt: user.created_at,
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function withAuthCookie(response: Response, token: string): Response {
  response.headers.set(
    'Set-Cookie',
    `auth_token=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`
  )
  return response
}

function extractToken(request: Request): string | null {
  // 优先从 Cookie 取
  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/)
  if (match) return match[1]
  // 其次从 Authorization header 取
  const auth = request.headers.get('Authorization') || ''
  const bearerMatch = auth.match(/^Bearer\s+(.+)$/i)
  if (bearerMatch) return bearerMatch[1]
  return null
}

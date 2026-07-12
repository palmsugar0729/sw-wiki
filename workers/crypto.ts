/**
 * 密码哈希和 JWT 工具
 * 全部基于 Web Crypto API，Worker 内置，零依赖
 */

const JWT_ALG = { name: 'HMAC', hash: 'SHA-256' }
const PBKDF2_ALG = { name: 'PBKDF2', hash: 'SHA-256' }
const PBKDF2_ITER = 100_000
const PBKDF2_KEY_LEN = 256 // bits

// ── 密码 ──

/** PBKDF2 哈希密码，返回 "salt:hash" 格式的字符串 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await deriveKey(password, salt)
  const hash = await crypto.subtle.exportKey('raw', key)
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(hash)))
  const saltB64 = btoa(String.fromCharCode(...salt))
  return `${saltB64}:${hashB64}`
}

/** 验证密码 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(':')
  if (!saltB64 || !hashB64) return false
  const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0))
  const key = await deriveKey(password, salt)
  const hash = await crypto.subtle.exportKey('raw', key)
  const newHashB64 = btoa(String.fromCharCode(...new Uint8Array(hash)))
  return newHashB64 === hashB64
}

async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const enc = new TextEncoder().encode(password)
  const keyMaterial = await crypto.subtle.importKey('raw', enc, 'PBKDF2', false, [
    'deriveKey',
  ])
  return crypto.subtle.deriveKey(
    { ...PBKDF2_ALG, salt, iterations: PBKDF2_ITER },
    keyMaterial,
    { name: 'HMAC', hash: 'SHA-256', length: PBKDF2_KEY_LEN },
    true,
    ['sign']
  )
}

// ── JWT ──

interface JWTPayload {
  sub: string
  email: string
  iat?: number
  exp?: number
}

/** 签发 JWT，默认 7 天过期 */
export async function signJWT(
  secret: string,
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  expiresInSeconds = 60 * 60 * 24 * 7
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const p: JWTPayload = { ...payload, iat: now, exp: now + expiresInSeconds }

  const headerB64 = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  const payloadB64 = btoa(JSON.stringify(p))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  const key = await importSigningKey(secret)
  const sig = await crypto.subtle.sign(
    JWT_ALG,
    key,
    new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  )
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${headerB64}.${payloadB64}.${sigB64}`
}

/** 验证 JWT，有效返回 payload，无效返回 null */
export async function verifyJWT(
  secret: string,
  token: string
): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerB64, payloadB64, sigB64] = parts
    const key = await importSigningKey(secret)
    const sig = Uint8Array.from(
      atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    )

    const valid = await crypto.subtle.verify(
      JWT_ALG,
      key,
      sig,
      new TextEncoder().encode(`${headerB64}.${payloadB64}`)
    )
    if (!valid) return null

    const payload: JWTPayload = JSON.parse(
      atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
    )

    // 检查过期
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

async function importSigningKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder().encode(secret)
  return crypto.subtle.importKey('raw', enc, JWT_ALG, false, ['sign', 'verify'])
}

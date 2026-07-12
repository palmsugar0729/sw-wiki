/**
 * Cloudflare Pages Function — 接管所有 /api/* 请求
 */
import { handleRegister, handleLogin, handleLogout, handleMe } from '../../workers/auth'
import type { EventContext } from '@cloudflare/workers-types'
import type { D1Database } from '@cloudflare/workers-types'

interface Env {
  DB: D1Database
  JWT_SECRET: string
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context
  const url = new URL(request.url)
  const path = url.pathname.replace(/\/+$/, '') // 去掉尾部斜杠

  const db = env.DB
  const jwtSecret = env.JWT_SECRET || 'dev-secret-change-in-production'

  // CORS 预检
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    })
  }

  let response: Response

  try {
    switch (`${request.method} ${path}`) {
      case 'POST /api/auth/register': {
        response = await handleRegister(db, jwtSecret, await request.json())
        break
      }
      case 'POST /api/auth/login': {
        response = await handleLogin(db, jwtSecret, await request.json())
        break
      }
      case 'POST /api/auth/logout': {
        response = handleLogout()
        break
      }
      case 'GET /api/auth/me': {
        response = await handleMe(db, jwtSecret, request)
        break
      }
      case 'POST /api/auth/verify-email': {
        // 预留：邮箱验证端点（当前注册已自动验证，后续接入邮件服务后使用）
        response = new Response(JSON.stringify({ ok: true, message: '当前版本注册即自动验证，无需手动操作' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
        break
      }
      default:
        response = new Response(JSON.stringify({ error: 'Not Found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
    }
  } catch (err: any) {
    response = new Response(JSON.stringify({ error: err.message || 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 所有响应加 CORS
  Object.entries(corsHeaders()).forEach(([k, v]) => {
    if (!response.headers.has(k)) response.headers.set(k, v)
  })
  return response
}

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }
}

import type { D1Database } from '@cloudflare/workers-types'

export interface User {
  id: number
  email: string
  password_hash: string
  nickname: string
  avatar_url: string
  email_verified: number
  created_at: string
  updated_at: string
}

/** 根据邮箱查找用户，找不到返回 null */
export async function findUserByEmail(
  db: D1Database,
  email: string
): Promise<User | null> {
  const row = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email.toLowerCase().trim())
    .first<User>()
  return row ?? null
}

/** 根据 ID 查找用户 */
export async function findUserById(
  db: D1Database,
  id: number
): Promise<User | null> {
  const row = await db
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first<User>()
  return row ?? null
}

/** 创建用户，返回新建的 user 对象 */
export async function createUser(
  db: D1Database,
  email: string,
  passwordHash: string,
  nickname?: string
): Promise<User> {
  const info = await db
    .prepare(
      `INSERT INTO users (email, password_hash, nickname)
       VALUES (?1, ?2, ?3)`
    )
    .bind(email.toLowerCase().trim(), passwordHash, nickname?.trim() || '')
    .run()

  if (!info.success) {
    throw new Error('创建用户失败')
  }

  // D1 的 lastRowId 是 number | null，需要处理
  const user = await findUserById(db, info.meta.last_row_id as number)
  if (!user) throw new Error('创建用户后查询失败')
  return user
}

/** 将用户标记为邮箱已验证 */
export async function markEmailVerified(
  db: D1Database,
  userId: number
): Promise<void> {
  await db
    .prepare(
      `UPDATE users SET email_verified = 1, updated_at = datetime('now') WHERE id = ?`
    )
    .bind(userId)
    .run()
}

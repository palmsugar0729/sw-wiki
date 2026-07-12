import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AuthUser {
  id: number
  email: string
  nickname: string
  avatarUrl: string
  emailVerified: boolean
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref('')

  const isLoggedIn = computed(() => !!user.value)

  /** 页面初始化时调用，从 cookie 恢复登录态 */
  async function fetchMe() {
    loading.value = true
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      const data = await res.json()
      user.value = data.user
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  /** 登录 */
  async function login(email: string, password: string) {
    error.value = ''
    loading.value = true
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        error.value = data.error || '登录失败'
        return false
      }
      user.value = data.user
      return true
    } catch {
      error.value = '网络错误'
      return false
    } finally {
      loading.value = false
    }
  }

  /** 注册 */
  async function register(email: string, password: string, nickname?: string) {
    error.value = ''
    loading.value = true
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, nickname }),
      })
      const data = await res.json()
      if (!res.ok) {
        error.value = data.error || '注册失败'
        return false
      }
      user.value = data.user
      return true
    } catch {
      error.value = '网络错误'
      return false
    } finally {
      loading.value = false
    }
  }

  /** 登出 */
  async function logout() {
    error.value = ''
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // ignore
    } finally {
      user.value = null
    }
  }

  /** 清除错误 */
  function clearError() {
    error.value = ''
  }

  return { user, loading, error, isLoggedIn, fetchMe, login, register, logout, clearError }
})

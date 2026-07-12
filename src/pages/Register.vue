<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>注册</h1>
      <form @submit.prevent="handleSubmit">
        <label>
          <span>昵称（选填）</span>
          <input v-model="nickname" type="text" autocomplete="name" />
        </label>
        <label>
          <span>邮箱</span>
          <input v-model="email" type="email" required autocomplete="email" />
        </label>
        <label>
          <span>密码（至少 6 位）</span>
          <input v-model="password" type="password" required autocomplete="new-password" />
        </label>
        <p v-if="store.error" class="auth-error">{{ store.error }}</p>
        <button type="submit" :disabled="store.loading">
          {{ store.loading ? '注册中...' : '注册' }}
        </button>
      </form>
      <p class="auth-switch">
        已有账号？
        <router-link to="/login">去登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const store = useAuthStore()
const router = useRouter()

const nickname = ref('')
const email = ref('')
const password = ref('')

store.clearError()

async function handleSubmit() {
  const ok = await store.register(email.value, password.value, nickname.value || undefined)
  if (ok) {
    router.push('/')
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-secondary, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 2rem;

  h1 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    text-align: center;
  }

  label {
    display: block;
    margin-bottom: 1rem;

    span {
      display: block;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
      color: var(--text-secondary, #666);
    }

    input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-color, #ccc);
      border-radius: 4px;
      font-size: 1rem;
      background: var(--bg-primary, #fff);
      color: var(--text-primary, #333);

      &:focus {
        outline: none;
        border-color: var(--accent, #1a73e8);
        box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
      }
    }
  }

  button {
    width: 100%;
    padding: 0.6rem;
    border: none;
    border-radius: 4px;
    background: var(--accent, #1a73e8);
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 0.5rem;

    &:hover { opacity: 0.9; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  .auth-error {
    color: #d32f2f;
    font-size: 0.85rem;
    margin: 0 0 0.5rem;
  }

  .auth-switch {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: var(--text-secondary, #666);
  }
}
</style>

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/data/mockData'
import { mockUser } from '@/data/mockData'

export const useAppStore = defineStore('app', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === '123456') {
      user.value = mockUser
      isLoggedIn.value = true
      return true
    }
    return false
  }

  const logout = () => {
    user.value = null
    isLoggedIn.value = false
  }

  return {
    user,
    isLoggedIn,
    login,
    logout
  }
})

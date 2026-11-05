import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as api from '../services/api'

// Vem är inloggad? Sessionen i sessionStorage avgör – storen är det appen tittar på.
export const useAuthStore = defineStore('auth', () => {
  const saved = api.getSession()
  const token = ref(saved?.token || null)
  const name = ref(saved?.name || null)
  const memberNo = ref(saved?.memberNo || null)

  const isAuthenticated = computed(() => Boolean(token.value))

  const login = async (email, password) => {
    const data = await api.login(email, password)
    token.value = data.token
    name.value = data.name
    memberNo.value = data.memberNo
  }

  const logout = () => {
    api.logout()
    token.value = null
    name.value = null
    memberNo.value = null
  }

  return { name, memberNo, isAuthenticated, login, logout }
})

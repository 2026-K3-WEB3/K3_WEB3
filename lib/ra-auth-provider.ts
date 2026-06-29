import type { AuthProvider } from 'react-admin'

const API_URL = '/api'

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const res = await fetch(`${API_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    })
    if (!res.ok) {
      throw new Error('Email ou mot de passe incorrect')
    }
    const { token, user } = await res.json()
    localStorage.setItem('ra-token', token)
    localStorage.setItem('ra-user', JSON.stringify(user))
  },

  logout: async () => {
    localStorage.removeItem('ra-token')
    localStorage.removeItem('ra-user')
  },

  checkAuth: async () => {
    const token = localStorage.getItem('ra-token')
    if (!token) throw new Error('Not authenticated')
  },

  checkError: async (error) => {
    if (error?.status === 401 || error?.status === 403) {
      localStorage.removeItem('ra-token')
      localStorage.removeItem('ra-user')
      throw new Error('Session expired')
    }
  },

  getPermissions: async () => {
    const user = localStorage.getItem('ra-user')
    if (!user) return null
    return JSON.parse(user).role
  },

  getIdentity: async () => {
    const user = localStorage.getItem('ra-user')
    if (!user) throw new Error('No identity')
    const parsed = JSON.parse(user)
    return { id: parsed.id, fullName: parsed.email }
  },
}

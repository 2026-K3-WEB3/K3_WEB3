import type { AuthProvider } from 'react-admin'

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const csrfRes = await fetch('/api/auth/csrf')
    const { csrfToken } = await csrfRes.json()

    const res = await fetch('/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
        csrfToken,
        json: 'true',
        callbackUrl: '/ra-admin',
        redirect: 'false',
      }),
    })

    if (!res.ok) {
      throw new Error('Identifiants incorrects')
    }

    const data = await res.json()
    if (data.url && data.url.includes('error=')) {
      throw new Error('Identifiants incorrects')
    }
  },

  logout: async () => {
    const csrfRes = await fetch('/api/auth/csrf')
    const { csrfToken } = await csrfRes.json()

    await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        csrfToken,
        json: 'true',
        callbackUrl: '/',
        redirect: 'false',
      }),
    })
  },

  checkAuth: async () => {
    const res = await fetch('/api/auth/session')
    if (!res.ok) throw new Error('Not authenticated')
    const session = await res.json()
    if (!session || !session.user) {
      throw new Error('Not authenticated')
    }
  },

  checkError: async (error) => {
    if (error?.status === 401 || error?.status === 403) {
      throw new Error('Session expirée')
    }
  },

  getPermissions: async () => {
    const res = await fetch('/api/auth/session')
    if (!res.ok) return null
    const session = await res.json()
    return session?.user?.role ?? null
  },

  getIdentity: async () => {
    const res = await fetch('/api/auth/session')
    if (!res.ok) throw new Error('No identity')
    const session = await res.json()
    if (!session || !session.user) throw new Error('No identity')
    return {
      id: session.user.email ?? 'admin',
      fullName: session.user.email ?? 'Admin',
    }
  },
}

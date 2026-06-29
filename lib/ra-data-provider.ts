import type { DataProvider } from 'react-admin'

const API_URL = '/api'

const getHeaders = () => {
  const token = localStorage.getItem('ra-token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const resourceMap: Record<string, string> = {
  events: 'events',
  sessions: 'sessions',
  speakers: 'speakers',
  rooms: 'rooms',
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const res = await fetch(`${API_URL}/${endpoint}`, { headers: getHeaders() })
    if (!res.ok) throw new Error(`Failed to fetch ${resource}`)
    const raw = await res.json()
    const data = Array.isArray(raw) ? raw : raw.data ?? []

    const { page = 1, perPage = 25 } = params.pagination ?? {}
    const { field = 'id', order = 'ASC' } = params.sort ?? {}

    const sorted = [...data].sort((a, b) => {
      const va = a[field] ?? ''
      const vb = b[field] ?? ''
      if (va < vb) return order === 'ASC' ? -1 : 1
      if (va > vb) return order === 'ASC' ? 1 : -1
      return 0
    })

    const start = (page - 1) * perPage
    const paginated = sorted.slice(start, start + perPage)

    return { data: paginated, total: data.length }
  },

  getOne: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const res = await fetch(`${API_URL}/${endpoint}/${params.id}`, { headers: getHeaders() })
    if (!res.ok) throw new Error(`Failed to fetch ${resource}/${params.id}`)
    const data = await res.json()
    return { data }
  },

  getMany: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const results = await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${endpoint}/${id}`, { headers: getHeaders() }).then((r) => r.json())
      )
    )
    return { data: results }
  },

  getManyReference: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const res = await fetch(`${API_URL}/${endpoint}`, { headers: getHeaders() })
    if (!res.ok) throw new Error(`Failed to fetch ${resource}`)
    const raw = await res.json()
    const data = Array.isArray(raw) ? raw : raw.data ?? []
    const filtered = data.filter((item: Record<string, unknown>) => item[params.target] === params.id)
    return { data: filtered, total: filtered.length }
  },

  create: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params.data),
    })
    if (!res.ok) throw new Error(`Failed to create ${resource}`)
    const data = await res.json()
    return { data }
  },

  update: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const res = await fetch(`${API_URL}/${endpoint}/${params.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(params.data),
    })
    if (!res.ok) throw new Error(`Failed to update ${resource}/${params.id}`)
    const data = await res.json()
    return { data }
  },

  updateMany: async (resource, params) => {
    const endpoint = resourceMap[resource]
    await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${endpoint}/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(params.data),
        })
      )
    )
    return { data: params.ids }
  },

  delete: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const res = await fetch(`${API_URL}/${endpoint}/${params.id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    if (!res.ok) throw new Error(`Failed to delete ${resource}/${params.id}`)
    return { data: { id: params.id } as { id: string } }
  },

  deleteMany: async (resource, params) => {
    const endpoint = resourceMap[resource]
    await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${endpoint}/${id}`, {
          method: 'DELETE',
          headers: getHeaders(),
        })
      )
    )
    return { data: params.ids }
  },
}

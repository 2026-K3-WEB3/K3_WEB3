import type { DataProvider } from 'react-admin'

const API_URL = '/api'

const resourceMap: Record<string, string> = {
  events: 'events',
  sessions: 'sessions',
  speakers: 'speakers',
  rooms: 'rooms',
}

const cleanData = (resource: string, data: Record<string, any>) => {
  const cleaned = { ...data }
  delete cleaned.id
  delete cleaned.createdAt
  delete cleaned.sessions
  delete cleaned.speakers
  delete cleaned.questions
  delete cleaned.event
  delete cleaned.room

  if (resource === 'sessions') {
    if (cleaned.capacity) {
      cleaned.capacity = Number(cleaned.capacity)
    }
  }

  return cleaned
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const res = await fetch(`${API_URL}/${endpoint}`)
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
    const res = await fetch(`${API_URL}/${endpoint}/${params.id}`)
    if (!res.ok) throw new Error(`Failed to fetch ${resource}/${params.id}`)
    const data = await res.json()
    return { data }
  },

  getMany: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const results = await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${endpoint}/${id}`).then((r) => r.json())
      )
    )
    return { data: results }
  },

  getManyReference: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const res = await fetch(`${API_URL}/${endpoint}`)
    if (!res.ok) throw new Error(`Failed to fetch ${resource}`)
    const raw = await res.json()
    const data = Array.isArray(raw) ? raw : raw.data ?? []
    const filtered = data.filter((item: Record<string, unknown>) => item[params.target] === params.id)
    return { data: filtered, total: filtered.length }
  },

  create: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const payload = cleanData(resource, params.data)
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Failed to create ${resource}`)
    const data = await res.json()
    return { data }
  },

  update: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const payload = cleanData(resource, params.data)
    const res = await fetch(`${API_URL}/${endpoint}/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Failed to update ${resource}/${params.id}`)
    const data = await res.json()
    return { data }
  },

  updateMany: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const payload = cleanData(resource, params.data)
    await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${endpoint}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      )
    )
    return { data: params.ids as any }
  },

  delete: async (resource, params) => {
    const endpoint = resourceMap[resource]
    const res = await fetch(`${API_URL}/${endpoint}/${params.id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error(`Failed to delete ${resource}/${params.id}`)
    return { data: { id: params.id } as any }
  },

  deleteMany: async (resource, params) => {
    const endpoint = resourceMap[resource]
    await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${endpoint}/${id}`, {
          method: 'DELETE',
        })
      )
    )
    return { data: params.ids as any }
  },
}

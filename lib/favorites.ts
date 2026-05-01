export interface FavoriteSession {
    sessionId: string
    addedAt: string
}

const FAVORITES_KEY = 'eventsync_favorites'

export const getFavorites = (): FavoriteSession[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
}

export const addFavorite = (sessionId: string): void => {
    const favorites = getFavorites()
    if (!favorites.some(f => f.sessionId === sessionId)) {
        favorites.push({ sessionId, addedAt: new Date().toISOString() })
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
}

export const removeFavorite = (sessionId: string): void => {
    const favorites = getFavorites()
    const filtered = favorites.filter(f => f.sessionId !== sessionId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
}

export const isFavorite = (sessionId: string): boolean => {
    return getFavorites().some(f => f.sessionId === sessionId)
}

export const toggleFavorite = (sessionId: string): boolean => {
    if (isFavorite(sessionId)) {
        removeFavorite(sessionId)
        return false
    } else {
        addFavorite(sessionId)
        return true
    }
}
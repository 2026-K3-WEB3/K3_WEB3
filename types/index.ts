export interface Event {
    id: string
    title: string
    description: string | null
    startDate: string
    endDate: string
    location: string | null
    sessions: Session[]
}

export interface Session {
    id: string
    title: string
    description: string | null
    startTime: string
    endTime: string
    room: Room | null
    capacity: number | null
    eventId: string
    event?: Event
    speakers: SessionSpeaker[]
    questions: Question[]
    isLive?: boolean
}

export interface Room {
    id: string
    name: string
    sessions?: Session[]
}

export interface Speaker {
    id: string
    name: string
    photoUrl: string | null
    bio: string | null
    linkedin: string | null
    twitter: string | null
    website: string | null
    sessions: SessionSpeaker[]
}

export interface SessionSpeaker {
    sessionId: string
    speakerId: string
    session: Session
    speaker: Speaker
}

export interface Question {
    id: string
    content: string
    authorName: string | null
    upvotes: number
    sessionId: string
    createdAt: string
}

export interface FavoriteSession {
    sessionId: string
    addedAt: string
}
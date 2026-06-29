import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'sangy@event-sync.mg' },
        update: {},
        create: {
            email: 'sangy@event-sync.mg',
            password: hashedPassword,
            role: 'admin',
        },
    })
    console.log('Admin user created:', admin.email)

    // Rooms
    const roomA = await prisma.room.upsert({
        where: { id: 'room-a' },
        update: {},
        create: { id: 'room-a', name: 'Salle Amphi A' },
    })
    const roomB = await prisma.room.upsert({
        where: { id: 'room-b' },
        update: {},
        create: { id: 'room-b', name: 'Salle Innovation B' },
    })
    const roomC = await prisma.room.upsert({
        where: { id: 'room-c' },
        update: {},
        create: { id: 'room-c', name: 'Atelier C' },
    })
    console.log('Rooms created')

    // Speakers
    const speaker1 = await prisma.speaker.upsert({
        where: { id: 'speaker-1' },
        update: {},
        create: {
            id: 'speaker-1',
            name: 'Marie Dupont',
            bio: 'Experte React et architecte frontend avec 10 ans d\'expérience dans le développement web moderne.',
            photo: null,
            links: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
        },
    })
    const speaker2 = await prisma.speaker.upsert({
        where: { id: 'speaker-2' },
        update: {},
        create: {
            id: 'speaker-2',
            name: 'Jean-Pierre Martin',
            bio: 'Ingénieur cloud spécialisé Kubernetes et DevOps. Contributeur open source.',
            photo: null,
            links: { github: 'https://github.com' },
        },
    })
    const speaker3 = await prisma.speaker.upsert({
        where: { id: 'speaker-3' },
        update: {},
        create: {
            id: 'speaker-3',
            name: 'Amina Kone',
            bio: 'Data scientist et ML engineer. Passionnée par l\'IA appliquée aux problèmes réels.',
            photo: null,
            links: { linkedin: 'https://linkedin.com' },
        },
    })
    const speaker4 = await prisma.speaker.upsert({
        where: { id: 'speaker-4' },
        update: {},
        create: {
            id: 'speaker-4',
            name: 'Luc Bernard',
            bio: 'Expert sécurité web et OWASP. Formateur certifié en cybersécurité.',
            photo: null,
            links: {},
        },
    })
    console.log('Speakers created')

    // Today for live demo
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // Event 1 - Main event (today for live demo)
    const event1 = await prisma.event.upsert({
        where: { id: 'event-1' },
        update: {},
        create: {
            id: 'event-1',
            title: 'DevConf 2026 — Journée des Développeurs',
            description: 'La grande conférence annuelle dédiée aux développeurs. Retrouvez des experts du web, du cloud, de l\'IA et de la sécurité pour une journée intense de conférences et d\'ateliers.',
            startDate: new Date(`${todayStr}T08:00:00Z`),
            endDate: new Date(`${todayStr}T18:00:00Z`),
            location: 'Centre de Conférences TechHub, Paris',
        },
    })

    // Event 2 - Future event
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekStr = nextWeek.toISOString().split('T')[0]

    const event2 = await prisma.event.upsert({
        where: { id: 'event-2' },
        update: {},
        create: {
            id: 'event-2',
            title: 'Workshop IA & Data Science',
            description: 'Un workshop pratique sur l\'intelligence artificielle et la data science pour les professionnels.',
            startDate: new Date(`${nextWeekStr}T09:00:00Z`),
            endDate: new Date(`${nextWeekStr}T17:00:00Z`),
            location: 'Campus Numérique, Lyon',
        },
    })
    console.log('Events created')

    // Sessions for event 1 (today — some live, some past)
    const nowHour = today.getUTCHours()

    // Session 1: Live right now
    const session1 = await prisma.session.upsert({
        where: { id: 'session-1' },
        update: {},
        create: {
            id: 'session-1',
            title: 'React 19 — Les nouvelles fonctionnalités',
            description: 'Découvrez les Server Components, les nouvelles hooks, et les améliorations de performance de React 19. Une session incontournable pour tout développeur frontend.',
            startTime: new Date(`${todayStr}T${String(Math.max(nowHour - 1, 8)).padStart(2, '0')}:00:00Z`),
            endTime: new Date(`${todayStr}T${String(Math.min(nowHour + 1, 23)).padStart(2, '0')}:00:00Z`),
            capacity: 150,
            eventId: 'event-1',
            roomId: 'room-a',
        },
    })

    // Session 2: Past session
    const session2 = await prisma.session.upsert({
        where: { id: 'session-2' },
        update: {},
        create: {
            id: 'session-2',
            title: 'Kubernetes en production — Retour d\'expérience',
            description: 'Comment migrer une application monolithique vers des microservices sur Kubernetes. Erreurs à éviter et bonnes pratiques.',
            startTime: new Date(`${todayStr}T08:00:00Z`),
            endTime: new Date(`${todayStr}T09:30:00Z`),
            capacity: 80,
            eventId: 'event-1',
            roomId: 'room-b',
        },
    })

    // Session 3: Future session today
    const session3 = await prisma.session.upsert({
        where: { id: 'session-3' },
        update: {},
        create: {
            id: 'session-3',
            title: 'Machine Learning avec Python — Atelier pratique',
            description: 'Construisez votre premier modèle de prédiction avec scikit-learn et TensorFlow. Apportez votre laptop !',
            startTime: new Date(`${todayStr}T${String(Math.min(nowHour + 2, 20)).padStart(2, '0')}:00:00Z`),
            endTime: new Date(`${todayStr}T${String(Math.min(nowHour + 4, 22)).padStart(2, '0')}:00:00Z`),
            capacity: 30,
            eventId: 'event-1',
            roomId: 'room-c',
        },
    })

    // Session 4: Parallel to session 1
    const session4 = await prisma.session.upsert({
        where: { id: 'session-4' },
        update: {},
        create: {
            id: 'session-4',
            title: 'Sécurité Web — Les 10 vulnérabilités OWASP',
            description: 'Tour d\'horizon des 10 vulnérabilités les plus critiques selon l\'OWASP. Démonstrations live et contre-mesures.',
            startTime: new Date(`${todayStr}T${String(Math.max(nowHour - 1, 8)).padStart(2, '0')}:00:00Z`),
            endTime: new Date(`${todayStr}T${String(Math.min(nowHour + 1, 23)).padStart(2, '0')}:00:00Z`),
            capacity: 100,
            eventId: 'event-1',
            roomId: 'room-b',
        },
    })

    // Session for event 2
    const session5 = await prisma.session.upsert({
        where: { id: 'session-5' },
        update: {},
        create: {
            id: 'session-5',
            title: 'Introduction au Deep Learning',
            description: 'Les fondamentaux des réseaux de neurones et comment les appliquer à des cas concrets.',
            startTime: new Date(`${nextWeekStr}T09:30:00Z`),
            endTime: new Date(`${nextWeekStr}T11:00:00Z`),
            capacity: 60,
            eventId: 'event-2',
            roomId: 'room-a',
        },
    })
    console.log('Sessions created')

    // SessionSpeakers
    const sessionSpeakers = [
        { sessionId: 'session-1', speakerId: 'speaker-1' },
        { sessionId: 'session-2', speakerId: 'speaker-2' },
        { sessionId: 'session-3', speakerId: 'speaker-3' },
        { sessionId: 'session-4', speakerId: 'speaker-4' },
        { sessionId: 'session-5', speakerId: 'speaker-3' },
        { sessionId: 'session-1', speakerId: 'speaker-4' }, // session 1 has 2 speakers
    ]

    for (const ss of sessionSpeakers) {
        await prisma.sessionSpeaker.upsert({
            where: { sessionId_speakerId: ss },
            update: {},
            create: ss,
        })
    }
    console.log('Session speakers linked')

    // Questions for the live session
    await prisma.question.upsert({
        where: { id: 'q-1' },
        update: {},
        create: {
            id: 'q-1',
            content: 'Quand est-ce que React 19 sera officiellement stable pour la production ?',
            author: 'Paul',
            upvotes: 12,
            sessionId: 'session-1',
        },
    })
    await prisma.question.upsert({
        where: { id: 'q-2' },
        update: {},
        create: {
            id: 'q-2',
            content: 'Les Server Components sont-ils compatibles avec toutes les versions de Next.js ?',
            author: null,
            upvotes: 7,
            sessionId: 'session-1',
        },
    })
    await prisma.question.upsert({
        where: { id: 'q-3' },
        update: {},
        create: {
            id: 'q-3',
            content: 'Y a-t-il des benchmarks de performance comparant React 18 et React 19 ?',
            author: 'Sophie',
            upvotes: 4,
            sessionId: 'session-1',
        },
    })
    console.log('Questions created')

    console.log('\n Seed terminé avec succès !')
    console.log('\n Compte admin: sangy@event-sync.mg / admin123')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

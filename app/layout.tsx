import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'EventSync — Gestion d\'événements en temps réel',
  description: 'Plateforme de gestion d\'événements et d\'engagement des participants en temps réel.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

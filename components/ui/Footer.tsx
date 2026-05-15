import Link from 'next/link'
import { Calendar } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-800">EventSync</span>
            <span className="text-gray-400">·</span>
            <span className="text-sm">Gestion d&apos;événements en temps réel</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-800 transition-colors">Accueil</Link>
            <Link href="/speakers" className="hover:text-gray-800 transition-colors">Intervenants</Link>
            <Link href="/favorites" className="hover:text-gray-800 transition-colors">Favoris</Link>
          </nav>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} EventSync. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

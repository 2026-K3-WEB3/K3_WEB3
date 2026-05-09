'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Home, Users, Star } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/speakers', label: 'Intervenants', icon: Users },
    { href: '/favorites', label: 'Favoris', icon: Star },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors">
            <Calendar className="w-6 h-6" />
            <span>EventSync</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Admin */}
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Admin
          </Link>

          {/* Mobile nav */}
          <nav className="flex md:hidden items-center gap-2">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={`p-2 rounded-lg transition-all ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Calendar, Users, MapPin, Activity,
  LayoutDashboard, LogOut, Home, ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Événements', icon: Calendar },
  { href: '/admin/sessions', label: 'Sessions', icon: Activity },
  { href: '/admin/speakers', label: 'Intervenants', icon: Users },
  { href: '/admin/rooms', label: 'Salles', icon: MapPin },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  if (pathname === '/admin/login') {
    return null
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shadow-xl flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center justify-center shadow-sm">
            <Calendar className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">EventSync</p>
            <p className="text-xs text-yellow-500/80">Administration</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
              <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-yellow-500 text-slate-900 shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <Home className="w-4 h-4" />
          Voir le site public
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, CreditCard, Tag, BarChart2, X, Menu, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/entries', label: 'Lançamentos', icon: CreditCard },
  { href: '/classifications', label: 'Classificações', icon: Tag },
  { href: '/reports', label: 'Relatórios', icon: BarChart2 },
  { href: '/subscription', label: 'Assinatura', icon: Crown },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarContent = (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-blue-600/30 to-violet-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'
            )}
          >
            <Icon size={18} className={isActive ? 'text-blue-400' : ''} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-900 border-r border-slate-800 h-screen">
        <div className="px-4 py-5 border-b border-slate-800">
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            💰 Gestor
          </h2>
        </div>
        {sidebarContent}
      </aside>

      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg shadow-lg border border-slate-700 text-slate-300"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex flex-col w-56 bg-slate-900 shadow-2xl border-r border-slate-800">
            <div className="px-4 py-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                💰 Gestor
              </h2>
              <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu" className="text-slate-400 hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}

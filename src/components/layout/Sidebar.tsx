'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, CreditCard, Tag, BarChart2, X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/entries', label: 'Lançamentos', icon: CreditCard },
  { href: '/classifications', label: 'Classificações', icon: Tag },
  { href: '/reports', label: 'Relatórios', icon: BarChart2 },
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
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 h-screen">
        <div className="px-4 py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">💰 Gestor</h2>
        </div>
        {sidebarContent}
      </aside>

      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow border border-gray-200"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex flex-col w-56 bg-white shadow-xl">
            <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">💰 Gestor</h2>
              <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu">
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

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, TrendingUp } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/10 shadow-lg shadow-cyan-500/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Gestor Financeiro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('funcionalidades')}
              className="text-slate-300 hover:text-cyan-300 transition-colors text-sm font-medium"
            >
              Funcionalidades
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-slate-300 hover:text-cyan-300 transition-colors text-sm font-medium"
            >
              Planos
            </button>
            <button
              onClick={() => scrollToSection('depoimentos')}
              className="text-slate-300 hover:text-cyan-300 transition-colors text-sm font-medium"
            >
              Depoimentos
            </button>
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="relative group px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              Promoção R$ 1,00
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 mt-2 p-4 space-y-3 animate-fade-in">
            <button
              onClick={() => scrollToSection('funcionalidades')}
              className="block w-full text-left text-slate-300 hover:text-cyan-300 transition-colors py-2 text-sm font-medium"
            >
              Funcionalidades
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left text-slate-300 hover:text-cyan-300 transition-colors py-2 text-sm font-medium"
            >
              Planos
            </button>
            <button
              onClick={() => scrollToSection('depoimentos')}
              className="block w-full text-left text-slate-300 hover:text-cyan-300 transition-colors py-2 text-sm font-medium"
            >
              Depoimentos
            </button>
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/50">
              <Link
                href="/login"
                className="text-center text-slate-300 hover:text-white transition-colors py-2 text-sm font-medium"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="text-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 transition-all duration-300"
              >
                Promoção R$ 1,00
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

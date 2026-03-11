'use client'

import Link from 'next/link'
import { TrendingUp, Github, Twitter, Linkedin } from 'lucide-react'

export default function FooterSection() {
  return (
    <footer className="relative border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Gestor Financeiro
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              A plataforma inteligente para gerenciar suas finanças pessoais com tecnologia de ponta
              e design inovador.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => document.getElementById('funcionalidades')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  Funcionalidades
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  Planos
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('depoimentos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  Depoimentos
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-slate-500">Sobre nós</span>
              </li>
              <li>
                <span className="text-sm text-slate-500">Blog</span>
              </li>
              <li>
                <span className="text-sm text-slate-500">Contato</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Conta</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  Criar conta
                </Link>
              </li>
              <li>
                <Link
                  href="/reset-password"
                  className="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  Recuperar senha
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Gestor Financeiro. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-700 hover:text-slate-500 transition-colors cursor-pointer">
              <Github className="w-4 h-4" />
            </span>
            <span className="text-slate-700 hover:text-slate-500 transition-colors cursor-pointer">
              <Twitter className="w-4 h-4" />
            </span>
            <span className="text-slate-700 hover:text-slate-500 transition-colors cursor-pointer">
              <Linkedin className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

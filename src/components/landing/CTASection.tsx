'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 sm:p-12 md:p-16">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-cyan-500/25">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            Pronto para transformar{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              suas finanças?
            </span>
          </h2>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Junte-se a milhares de pessoas que já estão no controle do seu dinheiro. Comece
            hoje mesmo por apenas R$ 1,00 e veja a diferença.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 transition-all duration-300 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 flex items-center justify-center gap-2"
            >
              Assinar por R$ 1,00
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl text-base font-semibold text-slate-300 border border-slate-600 hover:border-cyan-500/50 hover:text-white transition-all duration-300 hover:bg-slate-800/50"
            >
              Já sou usuário
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-700/30">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                10k+
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Usuários ativos</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent">
                R$ 2M+
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Gerenciados por mês</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">
                4.9★
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Avaliação média</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

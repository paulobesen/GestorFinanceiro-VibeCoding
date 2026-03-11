'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px]" />
        
        {/* Floating Particles */}
        <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-cyan-400 rounded-full animate-pulse-glow" />
        <div className="absolute top-[40%] right-[20%] w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse-glow-delayed" />
        <div className="absolute bottom-[30%] left-[25%] w-1 h-1 bg-blue-400 rounded-full animate-pulse-glow" />
        <div className="absolute top-[60%] right-[35%] w-1 h-1 bg-cyan-300 rounded-full animate-pulse-glow-delayed" />
        <div className="absolute bottom-[20%] right-[15%] w-1.5 h-1.5 bg-violet-300 rounded-full animate-pulse-glow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-300 text-sm font-medium">A revolução na gestão financeira pessoal</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
          <span className="text-white">Controle suas</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            finanças do futuro
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up-delayed leading-relaxed">
          Tecnologia inteligente para organizar suas receitas, despesas e investimentos. 
          Tome decisões financeiras com clareza e confiança.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up-delayed-2">
          <Link
            href="/register"
            className="group relative px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 transition-all duration-300 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 flex items-center gap-2"
          >
            Comece por R$ 1,00
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-2xl text-base font-semibold text-slate-300 border border-slate-600 hover:border-cyan-500/50 hover:text-white transition-all duration-300 hover:bg-slate-800/50"
          >
            Já tenho conta
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center animate-fade-in-up-delayed-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <span>Dados protegidos</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-violet-400" />
            </div>
            <span>Tempo real</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <span>Inteligência financeira</span>
          </div>
        </div>

        {/* Dashboard Preview Mock */}
        <div className="mt-20 relative max-w-4xl mx-auto animate-fade-in-up-delayed-2">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-cyan-500/5">
            {/* Mock Dashboard Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 bg-slate-800 rounded-lg h-7 flex items-center px-3">
                <span className="text-[10px] text-slate-500">gestorfinanceiro.app/dashboard</span>
              </div>
            </div>
            {/* Mock Dashboard Content */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-slate-800/60 rounded-xl p-3 sm:p-4 border border-slate-700/30">
                <p className="text-[10px] sm:text-xs text-slate-500 mb-1">Receitas</p>
                <p className="text-sm sm:text-lg font-bold text-emerald-400">R$ 8.450</p>
                <div className="mt-2 h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3 sm:p-4 border border-slate-700/30">
                <p className="text-[10px] sm:text-xs text-slate-500 mb-1">Despesas</p>
                <p className="text-sm sm:text-lg font-bold text-rose-400">R$ 5.230</p>
                <div className="mt-2 h-1.5 bg-rose-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/5 bg-gradient-to-r from-rose-500 to-rose-400 rounded-full" />
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3 sm:p-4 border border-slate-700/30">
                <p className="text-[10px] sm:text-xs text-slate-500 mb-1">Saldo</p>
                <p className="text-sm sm:text-lg font-bold text-cyan-400">R$ 3.220</p>
                <div className="mt-2 h-1.5 bg-cyan-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" />
                </div>
              </div>
            </div>
            {/* Mock Chart Area */}
            <div className="bg-slate-800/40 rounded-xl p-4 sm:p-6 border border-slate-700/20">
              <div className="flex items-end gap-1.5 sm:gap-2 h-24 sm:h-32 justify-between px-2">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-cyan-500 to-violet-500 opacity-70 transition-all duration-500"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

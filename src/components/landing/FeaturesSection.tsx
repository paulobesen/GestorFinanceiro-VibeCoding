'use client'

import {
  BarChart3,
  PieChart,
  Wallet,
  TrendingUp,
  Bell,
  Lock,
  Repeat,
  FileText,
  Smartphone,
} from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard Inteligente',
    description:
      'Visualize suas finanças com gráficos interativos e indicadores em tempo real. Saiba exatamente para onde seu dinheiro vai.',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    bgGlow: 'bg-cyan-500/10',
    borderGlow: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/15',
    textColor: 'text-cyan-400',
  },
  {
    icon: PieChart,
    title: 'Relatórios Detalhados',
    description:
      'Relatórios completos por categoria, período e tipo. Entenda seus padrões de gasto e encontre oportunidades de economia.',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',
    bgGlow: 'bg-violet-500/10',
    borderGlow: 'border-violet-500/20',
    iconBg: 'bg-violet-500/15',
    textColor: 'text-violet-400',
  },
  {
    icon: Wallet,
    title: 'Controle de Receitas e Despesas',
    description:
      'Registre todas as suas movimentações financeiras de forma simples e organizada. Categorize cada centavo com facilidade.',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-500',
    bgGlow: 'bg-emerald-500/10',
    borderGlow: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    textColor: 'text-emerald-400',
  },
  {
    icon: TrendingUp,
    title: 'Evolução Mensal',
    description:
      'Acompanhe a evolução do seu saldo mês a mês. Identifique tendências e progresso em direção às suas metas financeiras.',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    bgGlow: 'bg-blue-500/10',
    borderGlow: 'border-blue-500/20',
    iconBg: 'bg-blue-500/15',
    textColor: 'text-blue-400',
  },
  {
    icon: Repeat,
    title: 'Lançamentos Recorrentes',
    description:
      'Automatize receitas e despesas fixas. Configure uma vez e deixe o sistema trabalhar por você, sem esquecer nenhuma conta.',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    bgGlow: 'bg-amber-500/10',
    borderGlow: 'border-amber-500/20',
    iconBg: 'bg-amber-500/15',
    textColor: 'text-amber-400',
  },
  {
    icon: FileText,
    title: 'Classificações Personalizadas',
    description:
      'Crie suas próprias categorias de receita e despesa. Organize suas finanças do seu jeito, com total flexibilidade.',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500',
    bgGlow: 'bg-rose-500/10',
    borderGlow: 'border-rose-500/20',
    iconBg: 'bg-rose-500/15',
    textColor: 'text-rose-400',
  },
  {
    icon: Bell,
    title: 'Notificações Inteligentes',
    description:
      'Receba alertas sobre vencimentos, metas atingidas e variações no seu orçamento. Nunca perca um prazo importante.',
    color: 'sky',
    gradient: 'from-sky-500 to-cyan-500',
    bgGlow: 'bg-sky-500/10',
    borderGlow: 'border-sky-500/20',
    iconBg: 'bg-sky-500/15',
    textColor: 'text-sky-400',
  },
  {
    icon: Lock,
    title: 'Fechamento Mensal',
    description:
      'Feche seus meses e proteja seus dados históricos. Mantenha a integridade dos seus registros financeiros ao longo do tempo.',
    color: 'indigo',
    gradient: 'from-indigo-500 to-violet-500',
    bgGlow: 'bg-indigo-500/10',
    borderGlow: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/15',
    textColor: 'text-indigo-400',
  },
  {
    icon: Smartphone,
    title: '100% Responsivo',
    description:
      'Acesse de qualquer dispositivo — celular, tablet ou computador. Suas finanças sempre na palma da mão, onde você estiver.',
    color: 'fuchsia',
    gradient: 'from-fuchsia-500 to-pink-500',
    bgGlow: 'bg-fuchsia-500/10',
    borderGlow: 'border-fuchsia-500/20',
    iconBg: 'bg-fuchsia-500/15',
    textColor: 'text-fuchsia-400',
  },
]

export default function FeaturesSection() {
  return (
    <section id="funcionalidades" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <span className="text-violet-300 text-sm font-medium">Funcionalidades</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            Tudo que você precisa para{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              dominar suas finanças
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Ferramentas poderosas e intuitivas para transformar a forma como você gerencia seu
            dinheiro. Simples, rápido e eficiente.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`group relative bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 sm:p-8 hover:border-slate-600/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl`}
              >
                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 ${feature.bgGlow} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-6 h-6 ${feature.textColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { Check, Star, Zap, Crown } from 'lucide-react'

const plans = [
  {
    name: 'Básico',
    icon: Star,
    price: 'Grátis',
    priceDetail: 'para sempre',
    description: 'Ideal para começar a organizar suas finanças pessoais.',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    borderColor: 'border-slate-700/30',
    bgHighlight: '',
    features: [
      'Dashboard com resumo financeiro',
      'Até 50 lançamentos por mês',
      '5 classificações personalizadas',
      'Relatórios básicos mensais',
      'Acesso via celular e desktop',
    ],
    cta: 'Começar Grátis',
    ctaStyle:
      'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-cyan-500/30',
    popular: false,
  },
  {
    name: 'Profissional',
    icon: Zap,
    price: 'R$ 19,90',
    priceDetail: '/mês',
    description: 'Para quem leva a sério o controle financeiro e quer resultados.',
    color: 'violet',
    gradient: 'from-cyan-500 to-violet-500',
    borderColor: 'border-cyan-500/30',
    bgHighlight: 'ring-2 ring-cyan-500/20',
    features: [
      'Tudo do plano Básico',
      'Lançamentos ilimitados',
      'Classificações ilimitadas',
      'Lançamentos recorrentes',
      'Relatórios avançados',
      'Fechamento mensal',
      'Gráficos de evolução',
      'Suporte prioritário por email',
    ],
    cta: 'Assinar Agora',
    ctaStyle:
      'bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40',
    popular: true,
  },
  {
    name: 'Empresarial',
    icon: Crown,
    price: 'R$ 49,90',
    priceDetail: '/mês',
    description: 'Solução completa para profissionais e pequenos negócios.',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    borderColor: 'border-slate-700/30',
    bgHighlight: '',
    features: [
      'Tudo do plano Profissional',
      'Múltiplas contas financeiras',
      'Relatórios personalizados',
      'Exportação de dados (PDF, Excel)',
      'API de integração',
      'Suporte prioritário 24/7',
      'Consultoria financeira mensal',
      'Backup automático de dados',
    ],
    cta: 'Falar com Vendas',
    ctaStyle:
      'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-amber-500/30',
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Planos & Preços</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            Escolha o plano{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              perfeito para você
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Comece gratuitamente e evolua conforme suas necessidades. Sem surpresas, sem taxas
            escondidas.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={index}
                className={`relative group bg-slate-900/60 backdrop-blur-sm border ${plan.borderColor} rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${plan.bgHighlight}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-cyan-500/25">
                      MAIS POPULAR
                    </div>
                  </div>
                )}

                {/* Plan Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-sm text-slate-400">{plan.priceDetail}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-700/50 my-6" />

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href="/register"
                  className={`block w-full text-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Cancele a qualquer momento · Sem compromisso · Garantia de 30 dias
          </p>
        </div>
      </div>
    </section>
  )
}

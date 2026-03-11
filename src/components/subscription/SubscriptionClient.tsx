'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  CreditCard,
  Crown,
  Zap,
  Star,
  Check,
  ExternalLink,
  AlertCircle,
  Loader2,
  Receipt,
  Calendar,
  ArrowRight,
  Sparkles,
  Shield,
} from 'lucide-react'
import type { Subscription, PaymentHistory } from '@/lib/types'

const PLANS = [
  {
    id: 'promo',
    name: 'Promoção',
    icon: Star,
    price: 'R$ 1,00',
    priceDetail: '/30 dias',
    description: 'Oferta especial por tempo limitado! Acesso completo à plataforma.',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-500/30',
    bgHighlight: 'ring-2 ring-cyan-500/20',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PROMO_PRICE_ID || '',
    features: [
      'Dashboard completo com gráficos',
      'Lançamentos ilimitados',
      'Classificações ilimitadas',
      'Lançamentos recorrentes',
      'Relatórios avançados',
      'Fechamento mensal',
      'Gráficos de evolução',
    ],
    popular: true,
  },
  {
    id: 'profissional',
    name: 'Profissional',
    icon: Zap,
    price: 'R$ 19,90',
    priceDetail: '/mês',
    description: 'Para quem leva a sério o controle financeiro e quer resultados.',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',
    borderColor: 'border-slate-700/30',
    bgHighlight: '',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    features: [
      'Tudo da Promoção',
      'Suporte prioritário por email',
      'Exportação de relatórios',
      'Múltiplas classificações avançadas',
    ],
    popular: false,
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    icon: Crown,
    price: 'R$ 49,90',
    priceDetail: '/mês',
    description: 'Solução completa para profissionais e pequenos negócios.',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    borderColor: 'border-slate-700/30',
    bgHighlight: '',
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || '',
    features: [
      'Tudo do Profissional',
      'Múltiplas contas financeiras',
      'API de integração',
      'Suporte prioritário 24/7',
      'Consultoria financeira mensal',
    ],
    popular: false,
  },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatCurrency(amount: number, currency: string = 'brl') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    trialing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    canceled: 'bg-red-500/10 text-red-400 border-red-500/20',
    past_due: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    inactive: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    refunded: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }

  const labels: Record<string, string> = {
    active: 'Ativa',
    trialing: 'Período de teste',
    canceled: 'Cancelada',
    past_due: 'Pagamento pendente',
    inactive: 'Inativa',
    paid: 'Pago',
    failed: 'Falhou',
    pending: 'Pendente',
    refunded: 'Reembolsado',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.inactive}`}>
      {labels[status] || status}
    </span>
  )
}

function getPlanDisplayName(planName: string) {
  const names: Record<string, string> = {
    promo: 'Promoção',
    profissional: 'Profissional',
    empresarial: 'Empresarial',
  }
  return names[planName] || planName
}

export default function SubscriptionClient() {
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<PaymentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  const fetchSubscriptionData = useCallback(async () => {
    try {
      const res = await fetch('/api/subscription')
      if (res.ok) {
        const data = await res.json()
        setSubscription(data.subscription)
        setPayments(data.payments)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscriptionData()
  }, [fetchSubscriptionData])

  useEffect(() => {
    if (success) {
      setNotification({ type: 'success', message: 'Assinatura realizada com sucesso! Bem-vindo(a)!' })
    } else if (canceled) {
      setNotification({ type: 'error', message: 'Pagamento cancelado. Tente novamente quando quiser.' })
    }
  }, [success, canceled])

  async function handleCheckout(priceId: string, planId: string) {
    setCheckoutLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setNotification({ type: 'error', message: data.error || 'Erro ao iniciar checkout' })
      }
    } catch {
      setNotification({ type: 'error', message: 'Erro ao conectar com servidor de pagamentos' })
    } finally {
      setCheckoutLoading(null)
    }
  }

  async function handleManageSubscription() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setNotification({ type: 'error', message: data.error || 'Erro ao abrir portal' })
      }
    } catch {
      setNotification({ type: 'error', message: 'Erro ao conectar com servidor' })
    } finally {
      setPortalLoading(false)
    }
  }

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          notification.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
            : 'bg-red-500/10 border-red-500/20 text-red-300'
        }`}>
          {notification.type === 'success' ? (
            <Check className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm">{notification.message}</p>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-slate-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          Minha Assinatura
        </h1>
        <p className="text-slate-400 mt-2">Gerencie seu plano, veja seu histórico de pagamentos e altere sua assinatura.</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Plano Atual</h2>
        </div>

        {isActive ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{getPlanDisplayName(subscription!.plan_name)}</h3>
                  {getStatusBadge(subscription!.status)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:ml-auto">
                {subscription?.current_period_end && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {subscription.cancel_at_period_end
                        ? `Expira em ${formatDate(subscription.current_period_end)}`
                        : `Renova em ${formatDate(subscription.current_period_end)}`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>

            {subscription?.cancel_at_period_end && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-300 font-medium">Assinatura será cancelada</p>
                  <p className="text-xs text-amber-400/70 mt-1">
                    Seu acesso continua até {formatDate(subscription.current_period_end!)}.
                    Você pode reativar a qualquer momento.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 border border-slate-600 hover:border-cyan-500/30 disabled:opacity-50"
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              Gerenciar Assinatura no Stripe
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum plano ativo</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Escolha um plano abaixo para ter acesso completo a todas as funcionalidades do Gestor Financeiro.
            </p>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            {isActive ? 'Alterar Plano' : 'Escolha seu Plano'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = isActive && subscription?.plan_name === plan.id
            return (
              <div
                key={plan.id}
                className={`relative group bg-slate-900/60 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                  plan.popular ? 'border-cyan-500/30 ring-2 ring-cyan-500/20' : 'border-slate-700/30'
                } ${isCurrentPlan ? 'ring-2 ring-emerald-500/30 border-emerald-500/30' : ''}`}
              >
                {/* Badge */}
                {plan.popular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-cyan-500/25">
                      🔥 PROMOÇÃO
                    </div>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      ✓ PLANO ATUAL
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-sm text-slate-400">{plan.priceDetail}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                </div>

                <div className="h-px bg-slate-700/50 my-5" />

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrentPlan ? (
                  <div className="w-full text-center px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Plano Atual
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.priceId, plan.id)}
                    disabled={!!checkoutLoading}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-cyan-500/30'
                    }`}
                  >
                    {checkoutLoading === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {isActive ? 'Trocar para este plano' : 'Assinar Agora'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Receipt className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Histórico de Pagamentos</h2>
        </div>

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 pr-4">Data</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 pr-4">Plano</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 pr-4">Valor</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3 pr-4">Status</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider pb-3">Recibo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pr-4 text-sm text-slate-300">{formatDate(payment.created_at)}</td>
                    <td className="py-3 pr-4 text-sm text-slate-300">{getPlanDisplayName(payment.plan_name)}</td>
                    <td className="py-3 pr-4 text-sm font-medium text-white">{formatCurrency(payment.amount, payment.currency)}</td>
                    <td className="py-3 pr-4">{getStatusBadge(payment.status)}</td>
                    <td className="py-3">
                      {payment.invoice_url ? (
                        <a
                          href={payment.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Ver <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Nenhum pagamento registrado ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { formatCurrency } from '@/lib/formatters'
import { MonthSummary } from '@/lib/types'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface SummaryCardsProps {
  summary: MonthSummary
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const { totalIncome, totalExpense, balance } = summary

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 rounded-xl border border-emerald-700/30 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400">Total Receitas</span>
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
      </div>

      <div className="bg-gradient-to-br from-rose-900/40 to-rose-800/20 rounded-xl border border-rose-700/30 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400">Total Despesas</span>
          <div className="p-2 bg-rose-500/20 rounded-lg">
            <TrendingDown size={18} className="text-rose-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-rose-400">{formatCurrency(totalExpense)}</p>
      </div>

      <div className={`bg-gradient-to-br rounded-xl border p-5 shadow-lg ${
        balance >= 0
          ? 'from-blue-900/40 to-blue-800/20 border-blue-700/30'
          : 'from-rose-900/40 to-rose-800/20 border-rose-700/30'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400">Saldo</span>
          <div className={`p-2 rounded-lg ${balance >= 0 ? 'bg-blue-500/20' : 'bg-rose-500/20'}`}>
            <Wallet size={18} className={balance >= 0 ? 'text-blue-400' : 'text-rose-400'} />
          </div>
        </div>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  )
}

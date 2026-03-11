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
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500">Total Receitas</span>
          <div className="p-2 bg-green-50 rounded-lg">
            <TrendingUp size={18} className="text-green-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500">Total Despesas</span>
          <div className="p-2 bg-red-50 rounded-lg">
            <TrendingDown size={18} className="text-red-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500">Saldo</span>
          <div className={`p-2 rounded-lg ${balance >= 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
            <Wallet size={18} className={balance >= 0 ? 'text-blue-600' : 'text-red-600'} />
          </div>
        </div>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  )
}

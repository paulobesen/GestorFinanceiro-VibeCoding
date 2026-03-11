'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/formatters'

interface MonthlyData {
  month: string
  income: number
  expense: number
  balance: number
}

interface MonthlyEvolutionChartProps {
  data: MonthlyData[]
}

export default function MonthlyEvolutionChart({ data }: MonthlyEvolutionChartProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Evolução Mensal (12 meses)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) =>
              new Intl.NumberFormat('pt-BR', { notation: 'compact', currency: 'BRL' }).format(v)
            }
          />
          <Tooltip
            formatter={(value, name) => {
              const labels: Record<string, string> = {
                income: 'Receitas',
                expense: 'Despesas',
                balance: 'Saldo',
              }
              return [formatCurrency(Number(value ?? 0)), labels[String(name)] ?? String(name)]
            }}
          />
          <Legend
            formatter={(value) => {
              const labels: Record<string, string> = {
                income: 'Receitas',
                expense: 'Despesas',
                balance: 'Saldo',
              }
              return labels[value] ?? value
            }}
          />
          <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

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
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Evolução Mensal (12 meses)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
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
              return [formatCurrency(value !== undefined && value !== null ? Number(value) : 0), labels[String(name)] ?? String(name)]
            }}
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
          />
          <Legend
            formatter={(value) => {
              const labels: Record<string, string> = {
                income: 'Receitas',
                expense: 'Despesas',
                balance: 'Saldo',
              }
              return <span style={{ color: '#94a3b8', fontSize: 12 }}>{labels[value] ?? value}</span>
            }}
          />
          <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 3, fill: '#3B82F6' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

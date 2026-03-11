'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ClassificationSummary } from '@/lib/types'
import { formatCurrency } from '@/lib/formatters'

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

interface ExpenseDonutChartProps {
  data: ClassificationSummary[]
}

export default function ExpenseDonutChart({ data }: ExpenseDonutChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Despesas por Classificação</h3>
        <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
          Nenhuma despesa neste mês
        </div>
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item.classification.name,
    value: item.total,
  }))

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Despesas por Classificação</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value ?? 0))}
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
          />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-slate-400">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

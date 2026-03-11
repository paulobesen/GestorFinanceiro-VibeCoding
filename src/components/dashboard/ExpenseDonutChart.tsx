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
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Despesas por Classificação</h3>
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
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
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Despesas por Classificação</h3>
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
          <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

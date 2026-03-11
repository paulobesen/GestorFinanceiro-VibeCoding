'use client'

import { Classification } from '@/lib/types'

interface EntryFiltersProps {
  year: number
  month: number
  onMonthChange: (year: number, month: number) => void
  filterType: 'all' | 'income' | 'expense'
  onFilterTypeChange: (type: 'all' | 'income' | 'expense') => void
  filterClassification: string
  onFilterClassificationChange: (id: string) => void
  classifications: Classification[]
}

export default function EntryFilters({
  filterType,
  onFilterTypeChange,
  filterClassification,
  onFilterClassificationChange,
  classifications,
}: EntryFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as 'all' | 'income' | 'expense')}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Classificação</label>
        <select
          value={filterClassification}
          onChange={(e) => onFilterClassificationChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas</option>
          {classifications.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

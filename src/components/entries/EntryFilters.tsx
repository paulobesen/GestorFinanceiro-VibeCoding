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
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 flex flex-wrap gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Tipo</label>
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as 'all' | 'income' | 'expense')}
          className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Classificação</label>
        <select
          value={filterClassification}
          onChange={(e) => onFilterClassificationChange(e.target.value)}
          className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

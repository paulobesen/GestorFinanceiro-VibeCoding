import { Classification } from '@/lib/types'
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

interface ClassificationListProps {
  classifications: Classification[]
  onEdit: (classification: Classification) => void
  onDelete: (classification: Classification) => void
}

export default function ClassificationList({
  classifications,
  onEdit,
  onDelete,
}: ClassificationListProps) {
  const incomeClassifications = classifications.filter((c) => c.type === 'income')
  const expenseClassifications = classifications.filter((c) => c.type === 'expense')

  function renderGroup(items: Classification[], type: 'income' | 'expense') {
    if (items.length === 0) return (
      <p className="text-sm text-slate-500 py-4 px-4">Nenhuma classificação cadastrada.</p>
    )
    return (
      <div className="divide-y divide-slate-700/50">
        {items.map((classification) => (
          <div key={classification.id} className="flex items-center justify-between py-3 px-4 hover:bg-slate-700/30 transition-colors">
            <div className="flex items-center gap-3">
              {type === 'income' ? (
                <TrendingUp size={16} className="text-emerald-500" />
              ) : (
                <TrendingDown size={16} className="text-rose-500" />
              )}
              <span className="text-sm font-medium text-slate-200">{classification.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(classification)}
                className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                aria-label="Editar"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(classification)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                aria-label="Excluir"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-4 py-3 bg-emerald-500/10 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
            <TrendingUp size={16} />
            Receitas ({incomeClassifications.length})
          </h3>
        </div>
        {renderGroup(incomeClassifications, 'income')}
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-4 py-3 bg-rose-500/10 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
            <TrendingDown size={16} />
            Despesas ({expenseClassifications.length})
          </h3>
        </div>
        {renderGroup(expenseClassifications, 'expense')}
      </div>
    </div>
  )
}

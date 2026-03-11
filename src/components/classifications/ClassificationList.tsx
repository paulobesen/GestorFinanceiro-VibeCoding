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
      <p className="text-sm text-gray-400 py-3">Nenhuma classificação cadastrada.</p>
    )
    return (
      <div className="divide-y divide-gray-100">
        {items.map((classification) => (
          <div key={classification.id} className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-3">
              {type === 'income' ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span className="text-sm font-medium text-gray-800">{classification.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(classification)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="Editar"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(classification)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-green-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-green-700 flex items-center gap-2">
            <TrendingUp size={16} />
            Receitas ({incomeClassifications.length})
          </h3>
        </div>
        {renderGroup(incomeClassifications, 'income')}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-red-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-red-700 flex items-center gap-2">
            <TrendingDown size={16} />
            Despesas ({expenseClassifications.length})
          </h3>
        </div>
        {renderGroup(expenseClassifications, 'expense')}
      </div>
    </div>
  )
}

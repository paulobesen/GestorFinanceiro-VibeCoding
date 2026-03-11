import { ClassificationSummary } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/formatters'

interface EntriesByClassificationProps {
  data: ClassificationSummary[]
  type: 'income' | 'expense'
}

export default function EntriesByClassification({ data, type }: EntriesByClassificationProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm">
        Nenhum {type === 'income' ? 'receita' : 'despesa'} neste mês
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.classification.id} className="border border-gray-100 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">{item.classification.name}</span>
            <span className={`text-sm font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(item.total)}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {item.entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-gray-400 shrink-0">{formatDate(entry.date)}</span>
                  <span className="text-sm text-gray-600 truncate">
                    {entry.description || '—'}
                  </span>
                </div>
                <span className={`text-sm font-medium shrink-0 ml-2 ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(entry.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

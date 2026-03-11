import { ClassificationSummary } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/formatters'

interface EntriesByClassificationProps {
  data: ClassificationSummary[]
  type: 'income' | 'expense'
}

export default function EntriesByClassification({ data, type }: EntriesByClassificationProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        Nenhum {type === 'income' ? 'receita' : 'despesa'} neste mês
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.classification.id} className="border border-slate-700/50 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-700/30 border-b border-slate-700/50">
            <span className="text-sm font-semibold text-slate-200">{item.classification.name}</span>
            <span className={`text-sm font-bold ${type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(item.total)}
            </span>
          </div>
          <div className="divide-y divide-slate-700/30">
            {item.entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-slate-500 shrink-0">{formatDate(entry.date)}</span>
                  <span className="text-sm text-slate-400 truncate">
                    {entry.description || '—'}
                  </span>
                </div>
                <span className={`text-sm font-medium shrink-0 ml-2 ${type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
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

import { Entry } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Pencil, Trash2, RefreshCw, Lock } from 'lucide-react'

interface EntryListProps {
  entries: Entry[]
  isMonthClosed: boolean
  onEdit: (entry: Entry) => void
  onDelete: (entry: Entry) => void
}

export default function EntryList({ entries, isMonthClosed, onEdit, onDelete }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 py-12 text-center">
        <p className="text-slate-500 text-sm">Nenhum lançamento neste mês.</p>
        {isMonthClosed && (
          <p className="text-amber-500 text-xs mt-2 flex items-center justify-center gap-1">
            <Lock size={12} /> Mês encerrado
          </p>
        )}
      </div>
    )
  }

  // Group by date
  const grouped = entries.reduce<Record<string, Entry[]>>((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = []
    acc[entry.date].push(entry)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="space-y-4">
      {isMonthClosed && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-lg">
          <Lock size={12} />
          Este mês está encerrado. Edições não são permitidas.
        </div>
      )}
      {sortedDates.map((date) => (
        <div key={date} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-4 py-2 bg-slate-700/30 border-b border-slate-700/50">
            <span className="text-xs font-semibold text-slate-400">{formatDate(date)}</span>
          </div>
          <div className="divide-y divide-slate-700/30">
            {grouped[date].map((entry) => (
              <div key={entry.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      entry.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {entry.classification?.name ?? '—'}
                    </p>
                    {entry.description && (
                      <p className="text-xs text-slate-500 truncate">{entry.description}</p>
                    )}
                  </div>
                  {entry.is_recurring && (
                    <RefreshCw size={12} className="text-blue-400 shrink-0" aria-label="Recorrente" />
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span
                    className={`text-sm font-semibold ${
                      entry.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                  </span>
                  {!isMonthClosed && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(entry)}
                        className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(entry)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        aria-label="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

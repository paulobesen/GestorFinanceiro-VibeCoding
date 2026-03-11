'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Entry, Classification, ClosedMonth } from '@/lib/types'
import EntryFilters from './EntryFilters'
import EntryList from './EntryList'
import EntryForm from './EntryForm'
import MonthSelector from '@/components/dashboard/MonthSelector'
import { Plus } from 'lucide-react'
import { formatMonthYear } from '@/lib/formatters'

interface EntriesClientProps {
  userId: string
}

export default function EntriesClient({ userId }: EntriesClientProps) {
  const supabase = useMemo(() => createClient(), [])
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [entries, setEntries] = useState<Entry[]>([])
  const [classifications, setClassifications] = useState<Classification[]>([])
  const [closedMonths, setClosedMonths] = useState<ClosedMonth[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterClassification, setFilterClassification] = useState<string>('all')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function showNotification(type: 'success' | 'error', message: string) {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const isMonthClosed = closedMonths.some((cm) => cm.year === year && cm.month === month)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

      const [entriesRes, classificationsRes, closedMonthsRes] = await Promise.all([
        supabase
          .from('entries')
          .select('*, classification:classifications(*)')
          .eq('user_id', userId)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false }),
        supabase
          .from('classifications')
          .select('*')
          .eq('user_id', userId)
          .order('name'),
        supabase
          .from('closed_months')
          .select('*')
          .eq('user_id', userId),
      ])

      if (entriesRes.data) setEntries(entriesRes.data)
      if (classificationsRes.data) setClassifications(classificationsRes.data)
      if (closedMonthsRes.data) setClosedMonths(closedMonthsRes.data)
    } finally {
      setLoading(false)
    }
  }, [userId, year, month, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleDelete(entry: Entry) {
    // Check if month is closed
    const entryDate = new Date(entry.date + 'T00:00:00')
    const closedCheck = closedMonths.find(
      (cm) => cm.year === entryDate.getFullYear() && cm.month === entryDate.getMonth() + 1
    )
    if (closedCheck) {
      showNotification('error', 'Este mês está encerrado. Não é possível excluir lançamentos.')
      return
    }

    const { error } = await supabase.from('entries').delete().eq('id', entry.id)
    if (error) {
      showNotification('error', 'Erro ao excluir lançamento.')
      return
    }
    showNotification('success', 'Lançamento excluído com sucesso!')
    fetchData()
  }

  function handleEdit(entry: Entry) {
    setEditingEntry(entry)
    setShowForm(true)
  }

  function handleAdd() {
    setEditingEntry(null)
    setShowForm(true)
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditingEntry(null)
    fetchData()
    showNotification('success', editingEntry ? 'Lançamento atualizado!' : 'Lançamento criado!')
  }

  const filteredEntries = entries.filter((e) => {
    if (filterType !== 'all' && e.type !== filterType) return false
    if (filterClassification !== 'all' && e.classification_id !== filterClassification) return false
    return true
  })

  return (
    <div className="space-y-5">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg text-white z-50 shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Lançamentos</h1>
          <span className="text-sm text-gray-400 capitalize">{formatMonthYear(year, month)}</span>
        </div>
        <div className="flex items-center gap-3">
          <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m) }} />
          {!isMonthClosed && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Novo
            </button>
          )}
        </div>
      </div>

      <EntryFilters
        year={year}
        month={month}
        onMonthChange={(y, m) => { setYear(y); setMonth(m) }}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterClassification={filterClassification}
        onFilterClassificationChange={setFilterClassification}
        classifications={classifications}
      />

      {loading ? (
        <div className="text-center py-10 text-gray-400 text-sm">Carregando...</div>
      ) : (
        <EntryList
          entries={filteredEntries}
          isMonthClosed={isMonthClosed}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <EntryForm
          userId={userId}
          entry={editingEntry}
          initialYear={year}
          initialMonth={month}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditingEntry(null) }}
        />
      )}
    </div>
  )
}

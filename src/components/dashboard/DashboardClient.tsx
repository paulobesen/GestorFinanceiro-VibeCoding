'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Entry, Classification, ClassificationSummary, ClosedMonth } from '@/lib/types'
import MonthSelector from './MonthSelector'
import SummaryCards from './SummaryCards'
import ExpenseDonutChart from './ExpenseDonutChart'
import MonthlyEvolutionChart from './MonthlyEvolutionChart'
import EntriesByClassification from './EntriesByClassification'
import { Lock, Unlock } from 'lucide-react'
import { formatMonthYear } from '@/lib/formatters'

interface DashboardClientProps {
  userId: string
}

interface MonthlyChartData {
  month: string
  income: number
  expense: number
  balance: number
}

export default function DashboardClient({ userId }: DashboardClientProps) {
  const supabase = useMemo(() => createClient(), [])
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [entries, setEntries] = useState<Entry[]>([])
  const [classifications, setClassifications] = useState<Classification[]>([])
  const [closedMonths, setClosedMonths] = useState<ClosedMonth[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function showNotification(type: 'success' | 'error', message: string) {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const isMonthClosed = closedMonths.some(
    (cm) => cm.year === year && cm.month === month
  )

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const endDate = new Date(year, month, 0)
      const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

      const [entriesRes, classificationsRes, closedMonthsRes] = await Promise.all([
        supabase
          .from('entries')
          .select('*, classification:classifications(*)')
          .eq('user_id', userId)
          .gte('date', startDate)
          .lte('date', endDateStr)
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

      // Fetch last 12 months data for the evolution chart
      const chartData: MonthlyChartData[] = []
      for (let i = 11; i >= 0; i--) {
        const d = new Date(year, month - 1 - i, 1)
        const y = d.getFullYear()
        const m = d.getMonth() + 1
        const start = `${y}-${String(m).padStart(2, '0')}-01`
        const lastDay = new Date(y, m, 0).getDate()
        const end = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

        const { data: mEntries } = await supabase
          .from('entries')
          .select('type, amount')
          .eq('user_id', userId)
          .gte('date', start)
          .lte('date', end)

        const income = (mEntries || []).filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0)
        const expense = (mEntries || []).filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0)
        chartData.push({
          month: `${String(m).padStart(2, '0')}/${y}`,
          income,
          expense,
          balance: income - expense,
        })
      }
      setMonthlyData(chartData)
    } finally {
      setLoading(false)
    }
  }, [userId, year, month, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalIncome = entries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0)
  const totalExpense = entries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0)

  // Build classification summaries
  function buildSummaries(type: 'income' | 'expense'): ClassificationSummary[] {
    const typeEntries = entries.filter((e) => e.type === type)
    const map = new Map<string, ClassificationSummary>()
    for (const entry of typeEntries) {
      const cls = entry.classification || classifications.find((c) => c.id === entry.classification_id)
      if (!cls) continue
      if (!map.has(cls.id)) {
        map.set(cls.id, { classification: cls, total: 0, entries: [] })
      }
      const item = map.get(cls.id)!
      item.total += entry.amount
      item.entries.push(entry)
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total)
  }

  const expenseSummaries = buildSummaries('expense')
  const incomeSummaries = buildSummaries('income')

  async function handleCloseMonth() {
    if (isMonthClosed) return
    try {
      const { error } = await supabase.from('closed_months').insert({
        user_id: userId,
        year,
        month,
      })
      if (error) {
        showNotification('error', 'Erro ao encerrar mês.')
        return
      }
      showNotification('success', `${formatMonthYear(year, month)} encerrado com sucesso!`)
      fetchData()
    } catch {
      showNotification('error', 'Erro ao encerrar mês.')
    }
  }

  async function handleReopenMonth() {
    const closed = closedMonths.find((cm) => cm.year === year && cm.month === month)
    if (!closed) return
    try {
      const { error } = await supabase.from('closed_months').delete().eq('id', closed.id)
      if (error) {
        showNotification('error', 'Erro ao reabrir mês.')
        return
      }
      showNotification('success', `${formatMonthYear(year, month)} reaberto com sucesso!`)
      fetchData()
    } catch {
      showNotification('error', 'Erro ao reabrir mês.')
    }
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg text-white z-50 shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m) }} />
          {isMonthClosed && (
            <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full">
              <Lock size={12} />
              Mês encerrado
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {isMonthClosed ? (
            <button
              onClick={handleReopenMonth}
              className="flex items-center gap-2 text-sm bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <Unlock size={14} />
              Reabrir Mês
            </button>
          ) : (
            <button
              onClick={handleCloseMonth}
              className="flex items-center gap-2 text-sm bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Lock size={14} />
              Encerrar Mês
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          Carregando...
        </div>
      ) : (
        <>
          <SummaryCards
            summary={{ totalIncome, totalExpense, balance: totalIncome - totalExpense }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseDonutChart data={expenseSummaries} />
            <MonthlyEvolutionChart data={monthlyData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Receitas por Classificação</h3>
              <EntriesByClassification data={incomeSummaries} type="income" />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Despesas por Classificação</h3>
              <EntriesByClassification data={expenseSummaries} type="expense" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

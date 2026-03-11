'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Entry, Classification } from '@/lib/types'
import { formatCurrency, formatDate, formatMonthYear } from '@/lib/formatters'
import MonthSelector from './MonthSelector'

interface ReportsClientProps {
  userId: string
}

export default function ReportsClient({ userId }: ReportsClientProps) {
  const supabase = useMemo(() => createClient(), [])
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [entries, setEntries] = useState<Entry[]>([])
  const [classifications, setClassifications] = useState<Classification[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterClassification, setFilterClassification] = useState<string>('all')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

      const [entriesRes, classificationsRes] = await Promise.all([
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
      ])

      if (entriesRes.data) setEntries(entriesRes.data)
      if (classificationsRes.data) setClassifications(classificationsRes.data)
    } finally {
      setLoading(false)
    }
  }, [userId, year, month, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filtered = entries.filter((e) => {
    if (filterType !== 'all' && e.type !== filterType) return false
    if (filterClassification !== 'all' && e.classification_id !== filterClassification) return false
    return true
  })

  const totalIncome = filtered.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0)
  const totalExpense = filtered.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900">Relatórios</h1>
        <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m) }} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
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
            onChange={(e) => setFilterClassification(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            {classifications.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-600 font-medium mb-1">Receitas</p>
          <p className="text-lg font-bold text-green-700">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs text-red-600 font-medium mb-1">Despesas</p>
          <p className="text-lg font-bold text-red-700">{formatCurrency(totalExpense)}</p>
        </div>
        <div className={`border rounded-xl p-4 ${totalIncome - totalExpense >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-xs font-medium mb-1 ${totalIncome - totalExpense >= 0 ? 'text-blue-600' : 'text-red-600'}`}>Saldo</p>
          <p className={`text-lg font-bold ${totalIncome - totalExpense >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            {formatCurrency(totalIncome - totalExpense)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700">
            Lançamentos de {formatMonthYear(year, month)} ({filtered.length})
          </h2>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">Nenhum lançamento encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-2 text-xs font-medium text-gray-500">Data</th>
                  <th className="text-left px-5 py-2 text-xs font-medium text-gray-500">Classificação</th>
                  <th className="text-left px-5 py-2 text-xs font-medium text-gray-500">Descrição</th>
                  <th className="text-left px-5 py-2 text-xs font-medium text-gray-500">Tipo</th>
                  <th className="text-right px-5 py-2 text-xs font-medium text-gray-500">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-5 py-2 text-gray-600">{formatDate(entry.date)}</td>
                    <td className="px-5 py-2 text-gray-700">
                      {entry.classification?.name ?? '—'}
                    </td>
                    <td className="px-5 py-2 text-gray-600">{entry.description || '—'}</td>
                    <td className="px-5 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          entry.type === 'income'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {entry.type === 'income' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-2 text-right font-medium ${
                        entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(entry.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

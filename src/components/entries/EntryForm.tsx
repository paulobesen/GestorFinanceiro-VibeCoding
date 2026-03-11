'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Classification, Entry } from '@/lib/types'
import { X } from 'lucide-react'
import type { SupabaseClient } from '@supabase/supabase-js'

const entrySchema = z.object({
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, 'Data é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório').refine(
    (v) => !isNaN(parseFloat(v.replace(',', '.'))) && parseFloat(v.replace(',', '.')) > 0,
    'Valor deve ser maior que zero'
  ),
  classification_id: z.string().min(1, 'Classificação é obrigatória'),
  description: z.string().optional(),
  is_recurring: z.boolean(),
  recurrence_end_date: z.string().optional(),
  edit_scope: z.enum(['single', 'future']).optional(),
})

type EntryFormData = z.infer<typeof entrySchema>

interface EntryFormProps {
  userId: string
  entry?: Entry | null
  initialYear: number
  initialMonth: number
  onSuccess: () => void
  onClose: () => void
}

async function createRecurringEntries(
  data: EntryFormData,
  userId: string,
  supabase: SupabaseClient
) {
  const groupId = crypto.randomUUID()
  const entriesInsert = []
  const startDate = new Date(data.date + 'T00:00:00')
  const endDate = data.recurrence_end_date
    ? new Date(data.recurrence_end_date + 'T00:00:00')
    : null
  const maxMonths = endDate ? null : 12
  const amount = parseFloat(data.amount.replace(',', '.'))

  let monthIdx = 0
  let current = new Date(startDate)

  while (true) {
    if (maxMonths !== null && monthIdx >= maxMonths) break
    if (endDate && current > endDate) break

    entriesInsert.push({
      user_id: userId,
      classification_id: data.classification_id,
      type: data.type,
      amount,
      date: current.toISOString().split('T')[0],
      description: data.description || null,
      is_recurring: true,
      recurrence_group_id: groupId,
      recurrence_end_date: data.recurrence_end_date || null,
    })

    current = new Date(current.getFullYear(), current.getMonth() + 1, current.getDate())
    monthIdx++
  }

  return supabase.from('entries').insert(entriesInsert)
}

export default function EntryForm({
  userId,
  entry,
  initialYear,
  initialMonth,
  onSuccess,
  onClose,
}: EntryFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [classifications, setClassifications] = useState<Classification[]>([])

  const defaultDate = entry?.date ?? `${initialYear}-${String(initialMonth).padStart(2, '0')}-01`

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      type: entry?.type ?? 'expense',
      date: defaultDate,
      amount: entry ? String(entry.amount) : '',
      classification_id: entry?.classification_id ?? '',
      description: entry?.description ?? '',
      is_recurring: entry?.is_recurring ?? false,
      recurrence_end_date: entry?.recurrence_end_date ?? '',
      edit_scope: 'single',
    },
  })

  const supabase = useMemo(() => createClient(), [])

  const watchType = watch('type')
  const watchIsRecurring = watch('is_recurring')

  useEffect(() => {
    async function fetchClassifications() {
      const { data } = await supabase
        .from('classifications')
        .select('*')
        .eq('user_id', userId)
        .order('name')
      if (data) setClassifications(data)
    }
    fetchClassifications()
  }, [userId, supabase])

  const filteredClassifications = classifications.filter((c) => c.type === watchType)

  async function onSubmit(data: EntryFormData) {
    setLoading(true)
    setError(null)

    try {
      // Check if month is closed
      const entryDate = new Date(data.date + 'T00:00:00')
      const entryYear = entryDate.getFullYear()
      const entryMonth = entryDate.getMonth() + 1

      const { data: closedMonth } = await supabase
        .from('closed_months')
        .select('id')
        .eq('user_id', userId)
        .eq('year', entryYear)
        .eq('month', entryMonth)
        .maybeSingle()

      if (closedMonth) {
        setError('Este mês está encerrado. Não é possível adicionar ou editar lançamentos.')
        return
      }

      const amount = parseFloat(data.amount.replace(',', '.'))

      if (entry) {
        // Editing
        if (entry.is_recurring && data.edit_scope === 'future' && entry.recurrence_group_id) {
          // Update current and all future entries in the recurrence group
          const { error: updateError } = await supabase
            .from('entries')
            .update({
              classification_id: data.classification_id,
              type: data.type,
              amount,
              description: data.description || null,
            })
            .eq('recurrence_group_id', entry.recurrence_group_id)
            .gte('date', entry.date)
          if (updateError) throw updateError
        } else {
          // Update single entry
          const { error: updateError } = await supabase
            .from('entries')
            .update({
              classification_id: data.classification_id,
              type: data.type,
              amount,
              date: data.date,
              description: data.description || null,
            })
            .eq('id', entry.id)
          if (updateError) throw updateError
        }
        onSuccess()
        return
      }

      // Creating
      if (data.is_recurring) {
        const { error: insertError } = await createRecurringEntries(data, userId, supabase)
        if (insertError) throw insertError
      } else {
        const { error: insertError } = await supabase.from('entries').insert({
          user_id: userId,
          classification_id: data.classification_id,
          type: data.type,
          amount,
          date: data.date,
          description: data.description || null,
          is_recurring: false,
          recurrence_group_id: null,
          recurrence_end_date: null,
        })
        if (insertError) throw insertError
      }

      onSuccess()
    } catch {
      setError('Erro ao salvar lançamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 sticky top-0 bg-slate-800 rounded-t-xl">
          <h2 className="text-base font-semibold text-slate-100">
            {entry ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="income" {...register('type')} className="accent-emerald-500" />
                <span className="text-sm text-emerald-400 font-medium">Receita</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="expense" {...register('type')} className="accent-rose-500" />
                <span className="text-sm text-rose-400 font-medium">Despesa</span>
              </label>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Data</label>
            <input
              type="date"
              {...register('date')}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors [color-scheme:dark]"
            />
            {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Valor (R$)</label>
            <input
              type="text"
              {...register('amount')}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0,00"
            />
            {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount.message}</p>}
          </div>

          {/* Classification */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Classificação</label>
            <select
              {...register('classification_id')}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Selecione...</option>
              {filteredClassifications.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.classification_id && (
              <p className="mt-1 text-xs text-red-400">{errors.classification_id.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Descrição <span className="text-slate-500 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              {...register('description')}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Ex: Mercado, Aluguel..."
            />
          </div>

          {/* Recurring (only on create) */}
          {!entry && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_recurring"
                  {...register('is_recurring')}
                  className="rounded border-slate-600 bg-slate-900 accent-blue-500"
                />
                <label htmlFor="is_recurring" className="text-sm font-medium text-slate-300 cursor-pointer">
                  Lançamento recorrente (mensal)
                </label>
              </div>

              {watchIsRecurring && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Data de fim da recorrência <span className="text-slate-500 font-normal">(opcional — padrão: 12 meses)</span>
                  </label>
                  <input
                    type="date"
                    {...register('recurrence_end_date')}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors [color-scheme:dark]"
                  />
                </div>
              )}
            </>
          )}

          {/* Edit scope for recurring entries */}
          {entry?.is_recurring && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Aplicar alteração a:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="single" {...register('edit_scope')} className="accent-blue-500" />
                  <span className="text-sm text-slate-300">Apenas este</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="future" {...register('edit_scope')} className="accent-blue-500" />
                  <span className="text-sm text-slate-300">Este e futuros</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-600 text-slate-300 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

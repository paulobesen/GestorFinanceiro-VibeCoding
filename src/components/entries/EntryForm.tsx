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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-900">
            {entry ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="income" {...register('type')} />
                <span className="text-sm text-green-700 font-medium">Receita</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="expense" {...register('type')} />
                <span className="text-sm text-red-700 font-medium">Despesa</span>
              </label>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              {...register('date')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
            <input
              type="text"
              {...register('amount')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0,00"
            />
            {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
          </div>

          {/* Classification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Classificação</label>
            <select
              {...register('classification_id')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {filteredClassifications.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.classification_id && (
              <p className="mt-1 text-xs text-red-600">{errors.classification_id.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              {...register('description')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="rounded border-gray-300"
                />
                <label htmlFor="is_recurring" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Lançamento recorrente (mensal)
                </label>
              </div>

              {watchIsRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de fim da recorrência <span className="text-gray-400 font-normal">(opcional — padrão: 12 meses)</span>
                  </label>
                  <input
                    type="date"
                    {...register('recurrence_end_date')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </>
          )}

          {/* Edit scope for recurring entries */}
          {entry?.is_recurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aplicar alteração a:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="single" {...register('edit_scope')} />
                  <span className="text-sm">Apenas este</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="future" {...register('edit_scope')} />
                  <span className="text-sm">Este e futuros</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

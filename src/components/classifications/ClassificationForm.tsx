'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Classification } from '@/lib/types'
import { X } from 'lucide-react'

const classificationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  type: z.enum(['income', 'expense']),
})

type ClassificationFormData = z.infer<typeof classificationSchema>

interface ClassificationFormProps {
  userId: string
  classification?: Classification | null
  onSuccess: () => void
  onClose: () => void
}

export default function ClassificationForm({
  userId,
  classification,
  onSuccess,
  onClose,
}: ClassificationFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassificationFormData>({
    resolver: zodResolver(classificationSchema),
    defaultValues: {
      name: classification?.name ?? '',
      type: classification?.type ?? 'expense',
    },
  })

  async function onSubmit(data: ClassificationFormData) {
    setLoading(true)
    setError(null)
    let succeeded = false
    try {
      if (classification) {
        const { error } = await supabase
          .from('classifications')
          .update({ name: data.name, type: data.type })
          .eq('id', classification.id)
          .eq('user_id', userId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('classifications').insert({
          user_id: userId,
          name: data.name,
          type: data.type,
        })
        if (error) throw error
      }
      succeeded = true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar classificação. Tente novamente.'
      setError(message)
    } finally {
      setLoading(false)
    }
    if (succeeded) onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-t-xl">
          <h2 className="text-base font-semibold text-slate-100">
            {classification ? 'Editar Classificação' : 'Nova Classificação'}
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
            <input
              type="text"
              {...register('name')}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Ex: Alimentação, Salário..."
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
            <select
              {...register('type')}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-400">{errors.type.message}</p>
            )}
          </div>

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

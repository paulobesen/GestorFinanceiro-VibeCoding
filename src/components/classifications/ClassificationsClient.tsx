'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Classification } from '@/lib/types'
import ClassificationList from './ClassificationList'
import ClassificationForm from './ClassificationForm'
import { Plus } from 'lucide-react'

interface ClassificationsClientProps {
  userId: string
}

export default function ClassificationsClient({ userId }: ClassificationsClientProps) {
  const supabase = useMemo(() => createClient(), [])
  const [classifications, setClassifications] = useState<Classification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Classification | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function showNotification(type: 'success' | 'error', message: string) {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const fetchClassifications = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('classifications')
        .select('*')
        .eq('user_id', userId)
        .order('name')
      if (data) setClassifications(data)
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  useEffect(() => {
    fetchClassifications()
  }, [fetchClassifications])

  function handleAdd() {
    setEditing(null)
    setShowForm(true)
  }

  function handleEdit(classification: Classification) {
    setEditing(classification)
    setShowForm(true)
  }

  async function handleDelete(classification: Classification) {
    // Check if classification is used by any entries
    const { count } = await supabase
      .from('entries')
      .select('id', { count: 'exact', head: true })
      .eq('classification_id', classification.id)

    if (count && count > 0) {
      showNotification('error', `Não é possível excluir: existem ${count} lançamento(s) com esta classificação.`)
      return
    }

    const { error } = await supabase.from('classifications').delete().eq('id', classification.id)
    if (error) {
      showNotification('error', 'Erro ao excluir classificação.')
      return
    }
    showNotification('success', 'Classificação excluída com sucesso!')
    fetchClassifications()
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditing(null)
    fetchClassifications()
    showNotification('success', editing ? 'Classificação atualizada!' : 'Classificação criada!')
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg text-white z-50 shadow-xl border ${
            notification.type === 'success'
              ? 'bg-emerald-600 border-emerald-500'
              : 'bg-red-600 border-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100">Classificações</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          Nova Classificação
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">Carregando classificações...</span>
          </div>
        </div>
      ) : (
        <ClassificationList
          classifications={classifications}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <ClassificationForm
          userId={userId}
          classification={editing}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}

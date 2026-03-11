import { createClient } from '@/lib/supabase/server'
import ReportsClient from '@/components/dashboard/ReportsClient'

export default async function ReportsPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  return <ReportsClient userId={session.user.id} />
}

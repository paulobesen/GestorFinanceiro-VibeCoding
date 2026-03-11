import { createClient } from '@/lib/supabase/server'
import ClassificationsClient from '@/components/classifications/ClassificationsClient'

export default async function ClassificationsPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  return <ClassificationsClient userId={session.user.id} />
}

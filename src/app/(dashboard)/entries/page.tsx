import { createClient } from '@/lib/supabase/server'
import EntriesClient from '@/components/entries/EntriesClient'

export default async function EntriesPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  return <EntriesClient userId={session.user.id} />
}

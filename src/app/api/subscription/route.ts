import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Get subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    // Get payment history
    const { data: payments } = await supabase
      .from('payment_history')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      subscription: subscription || null,
      payments: payments || [],
    })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados da assinatura' },
      { status: 500 }
    )
  }
}

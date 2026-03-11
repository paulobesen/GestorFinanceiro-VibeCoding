import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Use service role key for webhook handling (bypasses RLS)
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function getPlanName(priceId: string): string {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PROMO_PRICE_ID) return 'promo'
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) return 'profissional'
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID) return 'empresarial'
  return 'promo'
}

async function handleSubscriptionEvent(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.supabase_user_id
  if (!userId) return

  const supabase = getSupabaseAdmin()
  const item = subscription.items.data[0]
  const priceId = typeof item?.price === 'string' ? item.price : item?.price?.id
  const planName = priceId ? getPlanName(priceId) : 'promo'

  // current_period_start and current_period_end are on the subscription item
  const periodStart = item?.current_period_start
    ? new Date(item.current_period_start * 1000).toISOString()
    : new Date().toISOString()
  const periodEnd = item?.current_period_end
    ? new Date(item.current_period_end * 1000).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id,
      stripe_subscription_id: subscription.id,
      plan_name: planName,
      status: subscription.status === 'active' || subscription.status === 'trialing'
        ? subscription.status
        : subscription.status === 'canceled'
          ? 'canceled'
          : subscription.status === 'past_due'
            ? 'past_due'
            : 'inactive',
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    })

  if (error) {
    console.error('Error upserting subscription:', error)
  }
}

async function handleInvoicePayment(invoice: Stripe.Invoice) {
  // In newer Stripe API, subscription is in parent.subscription_details
  const subscriptionRef = invoice.parent?.subscription_details?.subscription
  const subscriptionId = typeof subscriptionRef === 'string'
    ? subscriptionRef
    : subscriptionRef?.id

  if (!subscriptionId) return

  const stripe = getStripeServer()
  const supabase = getSupabaseAdmin()

  // Get subscription to find user_id
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const userId = subscription.metadata.supabase_user_id
  if (!userId) return

  const item = subscription.items.data[0]
  const priceId = typeof item?.price === 'string' ? item.price : item?.price?.id
  const planName = priceId ? getPlanName(priceId) : 'promo'

  const { error } = await supabase
    .from('payment_history')
    .upsert({
      user_id: userId,
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: null,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status === 'paid' ? 'paid' : 'failed',
      plan_name: planName,
      invoice_url: invoice.hosted_invoice_url || null,
    }, {
      onConflict: 'stripe_invoice_id',
    })

  if (error) {
    console.error('Error recording payment:', error)
  }
}

export async function POST(request: NextRequest) {
  const stripe = getStripeServer()
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionEvent(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePayment(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await handleInvoicePayment(event.data.object as Stripe.Invoice)
        break
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

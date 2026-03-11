export type Profile = {
  id: string
  email: string
  created_at: string
}

export type ClassificationType = 'income' | 'expense'

export type Classification = {
  id: string
  user_id: string
  name: string
  type: ClassificationType
  created_at: string
}

export type Entry = {
  id: string
  user_id: string
  classification_id: string
  type: ClassificationType
  amount: number
  date: string
  description: string | null
  is_recurring: boolean
  recurrence_group_id: string | null
  recurrence_end_date: string | null
  created_at: string
  classification?: Classification
}

export type ClosedMonth = {
  id: string
  user_id: string
  year: number
  month: number
  closed_at: string
}

export type MonthSummary = {
  totalIncome: number
  totalExpense: number
  balance: number
}

export type ClassificationSummary = {
  classification: Classification
  total: number
  entries: Entry[]
}

export type SubscriptionStatus = 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing'

export type Subscription = {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string | null
  plan_name: string
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export type PaymentHistory = {
  id: string
  user_id: string
  stripe_invoice_id: string | null
  stripe_payment_intent_id: string | null
  amount: number
  currency: string
  status: 'paid' | 'failed' | 'pending' | 'refunded'
  plan_name: string
  invoice_url: string | null
  created_at: string
}

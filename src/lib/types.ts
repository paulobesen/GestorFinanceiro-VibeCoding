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

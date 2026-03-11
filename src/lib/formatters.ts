export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) return date ?? ''
  const [year, month, day] = date.split('T')[0].split('-')
  return `${day}/${month}/${year}`
}

export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMonthYear } from '@/lib/formatters'

interface MonthSelectorProps {
  year: number
  month: number
  onChange: (year: number, month: number) => void
}

export default function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  function handlePrev() {
    if (month === 1) {
      onChange(year - 1, 12)
    } else {
      onChange(year, month - 1)
    }
  }

  function handleNext() {
    if (month === 12) {
      onChange(year + 1, 1)
    } else {
      onChange(year, month + 1)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePrev}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Mês anterior"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-base font-semibold text-gray-800 min-w-40 text-center capitalize">
        {formatMonthYear(year, month)}
      </span>
      <button
        onClick={handleNext}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Próximo mês"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

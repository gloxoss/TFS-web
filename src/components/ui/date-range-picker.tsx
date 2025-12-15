/**
 * DateRangePicker Component
 * 
 * A styled date range picker for rental period selection.
 * Uses native HTML date inputs for reliability.
 * 
 * Design Archetype: Dark Cinema
 */
'use client'

import { useState, useEffect } from 'react'
import { Calendar, ArrowRight } from 'lucide-react'
import { format, addDays, differenceInDays, parseISO, isValid } from 'date-fns'
import { cn } from '@/lib/utils'

export interface DateRange {
  start: string // ISO date string (YYYY-MM-DD)
  end: string   // ISO date string (YYYY-MM-DD)
}

interface DateRangePickerProps {
  value?: DateRange | null
  onChange: (range: DateRange | null) => void
  minDate?: string
  maxDays?: number
  className?: string
  error?: string
}

export function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDays = 365,
  className,
  error,
}: DateRangePickerProps) {
  const today = new Date().toISOString().split('T')[0]
  const minDateValue = minDate || today

  const [startDate, setStartDate] = useState(value?.start || '')
  const [endDate, setEndDate] = useState(value?.end || '')

  // Sync internal state with external value
  useEffect(() => {
    if (value) {
      setStartDate(value.start)
      setEndDate(value.end)
    }
  }, [value])

  // Calculate rental days
  const rentalDays = startDate && endDate
    ? differenceInDays(parseISO(endDate), parseISO(startDate)) + 1
    : 0

  // Handle start date change
  const handleStartChange = (newStart: string) => {
    setStartDate(newStart)
    
    // If end date is before start, reset it
    if (endDate && newStart > endDate) {
      const newEnd = newStart
      setEndDate(newEnd)
      onChange({ start: newStart, end: newEnd })
    } else if (endDate) {
      onChange({ start: newStart, end: endDate })
    } else {
      // Auto-set end date to same day if not set
      setEndDate(newStart)
      onChange({ start: newStart, end: newStart })
    }
  }

  // Handle end date change
  const handleEndChange = (newEnd: string) => {
    setEndDate(newEnd)
    if (startDate) {
      onChange({ start: startDate, end: newEnd })
    }
  }

  // Quick select options
  const quickSelects = [
    { label: '1 Day', days: 1 },
    { label: '3 Days', days: 3 },
    { label: '1 Week', days: 7 },
    { label: '2 Weeks', days: 14 },
  ]

  const handleQuickSelect = (days: number) => {
    const start = startDate || today
    const end = format(addDays(parseISO(start), days - 1), 'yyyy-MM-dd')
    setStartDate(start)
    setEndDate(end)
    onChange({ start, end })
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Date Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1.5" />
            Pickup Date *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartChange(e.target.value)}
            min={minDateValue}
            className={cn(
              'w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white',
              'focus:outline-none focus:ring-2 focus:ring-white/20',
              'appearance-none cursor-pointer',
              '[&::-webkit-calendar-picker-indicator]:filter',
              '[&::-webkit-calendar-picker-indicator]:invert',
              error ? 'border-red-500' : 'border-zinc-700'
            )}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1.5" />
            Return Date *
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndChange(e.target.value)}
            min={startDate || minDateValue}
            className={cn(
              'w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white',
              'focus:outline-none focus:ring-2 focus:ring-white/20',
              'appearance-none cursor-pointer',
              '[&::-webkit-calendar-picker-indicator]:filter',
              '[&::-webkit-calendar-picker-indicator]:invert',
              error ? 'border-red-500' : 'border-zinc-700'
            )}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Quick Select Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-zinc-500 self-center mr-2">Quick select:</span>
        {quickSelects.map((option) => (
          <button
            key={option.days}
            type="button"
            onClick={() => handleQuickSelect(option.days)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
              rentalDays === option.days
                ? 'bg-white text-black'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Duration Display */}
      {rentalDays > 0 && (
        <div className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <span className="font-medium">
              {startDate && format(parseISO(startDate), 'MMM d, yyyy')}
            </span>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
            <span className="font-medium">
              {endDate && format(parseISO(endDate), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="ml-auto">
            <span className="px-3 py-1 bg-white/10 text-white text-sm font-semibold rounded-full">
              {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Calculate rental days from a date range
 */
export function calculateRentalDays(range: DateRange | null): number {
  if (!range || !range.start || !range.end) return 0
  try {
    const start = parseISO(range.start)
    const end = parseISO(range.end)
    if (!isValid(start) || !isValid(end)) return 0
    return Math.max(1, differenceInDays(end, start) + 1)
  } catch {
    return 0
  }
}

/**
 * Format a date range for display
 */
export function formatDateRange(range: DateRange | null): string {
  if (!range || !range.start || !range.end) return 'Not selected'
  try {
    const start = parseISO(range.start)
    const end = parseISO(range.end)
    if (!isValid(start) || !isValid(end)) return 'Invalid dates'
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
  } catch {
    return 'Invalid dates'
  }
}

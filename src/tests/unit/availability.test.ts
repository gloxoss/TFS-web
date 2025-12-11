/**
 * Availability Domain Logic Tests
 * TDD: Tests written FIRST before implementation
 * 
 * Domain: Cinema Equipment Rental
 * Requirements: Validate date ranges, check stock availability
 */
import { describe, it, expect } from 'vitest'
import {
  isDateRangeValid,
  isDateInFuture,
  doDateRangesOverlap,
  checkStockAvailability,
  getAvailableQuantity,
  type DateRange,
  type StockCheck,
  type ExistingBooking,
} from '@/lib/domain/availability'

describe('isDateRangeValid', () => {
  it('returns true for valid same-day range', () => {
    const range: DateRange = {
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-15'),
    }
    expect(isDateRangeValid(range)).toBe(true)
  })

  it('returns true for valid multi-day range', () => {
    const range: DateRange = {
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-20'),
    }
    expect(isDateRangeValid(range)).toBe(true)
  })

  it('returns false when end date is before start date', () => {
    const range: DateRange = {
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-01-15'),
    }
    expect(isDateRangeValid(range)).toBe(false)
  })

  it('handles string date inputs', () => {
    expect(isDateRangeValid({ startDate: '2025-01-15', endDate: '2025-01-20' })).toBe(true)
    expect(isDateRangeValid({ startDate: '2025-01-20', endDate: '2025-01-15' })).toBe(false)
  })
})

describe('isDateInFuture', () => {
  it('returns true for future date', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    expect(isDateInFuture(futureDate)).toBe(true)
  })

  it('returns true for today (same day is allowed)', () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    expect(isDateInFuture(today)).toBe(true)
  })

  it('returns false for past date', () => {
    const pastDate = new Date('2020-01-01')
    expect(isDateInFuture(pastDate)).toBe(false)
  })
})

describe('doDateRangesOverlap', () => {
  it('returns true for overlapping ranges', () => {
    const range1: DateRange = { startDate: new Date('2025-01-10'), endDate: new Date('2025-01-20') }
    const range2: DateRange = { startDate: new Date('2025-01-15'), endDate: new Date('2025-01-25') }
    expect(doDateRangesOverlap(range1, range2)).toBe(true)
  })

  it('returns true when one range contains another', () => {
    const range1: DateRange = { startDate: new Date('2025-01-01'), endDate: new Date('2025-01-31') }
    const range2: DateRange = { startDate: new Date('2025-01-10'), endDate: new Date('2025-01-20') }
    expect(doDateRangesOverlap(range1, range2)).toBe(true)
  })

  it('returns false for non-overlapping ranges', () => {
    const range1: DateRange = { startDate: new Date('2025-01-01'), endDate: new Date('2025-01-10') }
    const range2: DateRange = { startDate: new Date('2025-01-15'), endDate: new Date('2025-01-25') }
    expect(doDateRangesOverlap(range1, range2)).toBe(false)
  })

  it('returns false for adjacent ranges (end = start)', () => {
    // If rental ends on Jan 10, next rental can start Jan 11
    const range1: DateRange = { startDate: new Date('2025-01-01'), endDate: new Date('2025-01-10') }
    const range2: DateRange = { startDate: new Date('2025-01-11'), endDate: new Date('2025-01-20') }
    expect(doDateRangesOverlap(range1, range2)).toBe(false)
  })

  it('returns true for touching ranges (same day end/start)', () => {
    // Same day overlap - equipment returns and rents same day counts as overlap
    const range1: DateRange = { startDate: new Date('2025-01-01'), endDate: new Date('2025-01-10') }
    const range2: DateRange = { startDate: new Date('2025-01-10'), endDate: new Date('2025-01-20') }
    expect(doDateRangesOverlap(range1, range2)).toBe(true)
  })
})

describe('checkStockAvailability', () => {
  it('returns available when no existing bookings', () => {
    const check: StockCheck = {
      totalStock: 5,
      requestedQuantity: 2,
      requestedRange: { startDate: new Date('2025-01-15'), endDate: new Date('2025-01-20') },
      existingBookings: [],
    }
    const result = checkStockAvailability(check)
    expect(result.available).toBe(true)
    expect(result.availableQuantity).toBe(5)
  })

  it('returns available when enough stock despite bookings', () => {
    const check: StockCheck = {
      totalStock: 5,
      requestedQuantity: 2,
      requestedRange: { startDate: new Date('2025-01-15'), endDate: new Date('2025-01-20') },
      existingBookings: [
        { startDate: new Date('2025-01-15'), endDate: new Date('2025-01-20'), quantity: 2 },
      ],
    }
    const result = checkStockAvailability(check)
    expect(result.available).toBe(true)
    expect(result.availableQuantity).toBe(3)
  })

  it('returns unavailable when stock exhausted', () => {
    const check: StockCheck = {
      totalStock: 3,
      requestedQuantity: 2,
      requestedRange: { startDate: new Date('2025-01-15'), endDate: new Date('2025-01-20') },
      existingBookings: [
        { startDate: new Date('2025-01-15'), endDate: new Date('2025-01-20'), quantity: 3 },
      ],
    }
    const result = checkStockAvailability(check)
    expect(result.available).toBe(false)
    expect(result.availableQuantity).toBe(0)
  })

  it('ignores bookings that do not overlap', () => {
    const check: StockCheck = {
      totalStock: 3,
      requestedQuantity: 3,
      requestedRange: { startDate: new Date('2025-01-15'), endDate: new Date('2025-01-20') },
      existingBookings: [
        { startDate: new Date('2025-01-01'), endDate: new Date('2025-01-10'), quantity: 3 },
      ],
    }
    const result = checkStockAvailability(check)
    expect(result.available).toBe(true)
    expect(result.availableQuantity).toBe(3)
  })
})

describe('getAvailableQuantity', () => {
  it('returns full stock when no bookings', () => {
    expect(getAvailableQuantity(10, [], { 
      startDate: new Date('2025-01-15'), 
      endDate: new Date('2025-01-20') 
    })).toBe(10)
  })

  it('subtracts overlapping booking quantities', () => {
    const bookings: ExistingBooking[] = [
      { startDate: new Date('2025-01-15'), endDate: new Date('2025-01-18'), quantity: 3 },
      { startDate: new Date('2025-01-17'), endDate: new Date('2025-01-22'), quantity: 2 },
    ]
    // Both bookings overlap with 15-20, so 5 units reserved
    expect(getAvailableQuantity(10, bookings, {
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-20'),
    })).toBe(5)
  })

  it('returns 0 when stock is fully booked', () => {
    const bookings: ExistingBooking[] = [
      { startDate: new Date('2025-01-15'), endDate: new Date('2025-01-20'), quantity: 10 },
    ]
    expect(getAvailableQuantity(10, bookings, {
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-20'),
    })).toBe(0)
  })
})

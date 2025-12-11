/**
 * Pricing Domain Logic Tests
 * TDD: Tests written FIRST before implementation
 * 
 * Domain: Cinema Equipment Rental
 * Requirements: Calculate rental prices based on daily rate, rental days, quantity
 */
import { describe, it, expect } from 'vitest'
import {
  calculateRentalDays,
  calculateRentalPrice,
  calculateLineTotal,
  applyDurationDiscount,
  type RentalPriceInput,
} from '@/lib/domain/pricing'

describe('calculateRentalDays', () => {
  it('returns 1 for same-day rental', () => {
    const start = new Date('2025-01-15')
    const end = new Date('2025-01-15')
    expect(calculateRentalDays(start, end)).toBe(1)
  })

  it('returns 2 for consecutive days', () => {
    const start = new Date('2025-01-15')
    const end = new Date('2025-01-16')
    expect(calculateRentalDays(start, end)).toBe(2)
  })

  it('returns correct days for week-long rental', () => {
    const start = new Date('2025-01-01')
    const end = new Date('2025-01-07')
    expect(calculateRentalDays(start, end)).toBe(7)
  })

  it('returns correct days for month-crossing rental', () => {
    const start = new Date('2025-01-30')
    const end = new Date('2025-02-02')
    expect(calculateRentalDays(start, end)).toBe(4)
  })

  it('returns 0 if end date is before start date', () => {
    const start = new Date('2025-01-15')
    const end = new Date('2025-01-10')
    expect(calculateRentalDays(start, end)).toBe(0)
  })

  it('handles string date inputs', () => {
    expect(calculateRentalDays('2025-01-15', '2025-01-17')).toBe(3)
  })
})

describe('calculateRentalPrice', () => {
  it('calculates price for single day, single item', () => {
    const input: RentalPriceInput = { dailyRate: 100, days: 1, quantity: 1 }
    expect(calculateRentalPrice(input)).toBe(100)
  })

  it('calculates price for multi-day rental', () => {
    const input: RentalPriceInput = { dailyRate: 100, days: 5, quantity: 1 }
    expect(calculateRentalPrice(input)).toBe(500)
  })

  it('calculates price for multiple items', () => {
    const input: RentalPriceInput = { dailyRate: 100, days: 5, quantity: 2 }
    expect(calculateRentalPrice(input)).toBe(1000)
  })

  it('returns 0 for zero days', () => {
    const input: RentalPriceInput = { dailyRate: 100, days: 0, quantity: 1 }
    expect(calculateRentalPrice(input)).toBe(0)
  })

  it('returns 0 for zero quantity', () => {
    const input: RentalPriceInput = { dailyRate: 100, days: 5, quantity: 0 }
    expect(calculateRentalPrice(input)).toBe(0)
  })

  it('handles decimal daily rates', () => {
    const input: RentalPriceInput = { dailyRate: 49.99, days: 3, quantity: 1 }
    expect(calculateRentalPrice(input)).toBeCloseTo(149.97, 2)
  })
})

describe('calculateLineTotal', () => {
  it('calculates line total from start/end dates', () => {
    const result = calculateLineTotal({
      dailyRate: 100,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-17'),
      quantity: 1,
    })
    expect(result).toBe(300) // 3 days * 100
  })

  it('calculates line total with quantity', () => {
    const result = calculateLineTotal({
      dailyRate: 50,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-16'),
      quantity: 3,
    })
    expect(result).toBe(300) // 2 days * 50 * 3
  })
})

describe('applyDurationDiscount', () => {
  it('returns full price for rentals under 7 days', () => {
    expect(applyDurationDiscount(600, 6)).toBe(600)
  })

  it('applies 10% discount for 7-day rental (weekly)', () => {
    // 7 days = 10% off
    expect(applyDurationDiscount(700, 7)).toBe(630)
  })

  it('applies 10% discount for 13-day rental', () => {
    expect(applyDurationDiscount(1300, 13)).toBe(1170)
  })

  it('applies 20% discount for 14+ day rental (bi-weekly)', () => {
    expect(applyDurationDiscount(1400, 14)).toBe(1120)
  })

  it('applies 30% discount for 30+ day rental (monthly)', () => {
    expect(applyDurationDiscount(3000, 30)).toBe(2100)
  })
})

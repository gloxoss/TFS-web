/**
 * CartItem Component
 * 
 * Individual cart line item with quantity controls.
 * Used in CartDrawer and Cart page.
 * 
 * BLIND QUOTE MODE:
 * - NO prices displayed
 * - Shows product, dates (if set), quantity
 * - Pricing is provided by admin quote only
 * 
 * Design: Dark cinema theme, compact layout
 */
'use client'

import { memo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Calendar } from 'lucide-react'
import { CartItem as CartItemType, CartItemDates, useCartStore } from '@/stores'
import { calculateRentalDays } from '@/lib/domain/pricing'
import { cn } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
  lng: string
  compact?: boolean
  className?: string
}

export const CartItemComponent = memo(function CartItemComponent({
  item,
  lng,
  compact = false,
  className,
}: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const updateItemDates = useCartStore((state) => state.updateItemDates)
  const removeItem = useCartStore((state) => state.removeItem)

  const { product, quantity, dates } = item

  // Only show rental days if dates are actually set (not placeholder)
  const hasDates = dates.start && dates.end && dates.start !== '' && dates.end !== ''
  const rentalDays = hasDates ? calculateRentalDays(dates.start, dates.end) : 0

  const handleQuantityChange = useCallback(
    (newQty: number) => {
      if (newQty <= 0) {
        removeItem(item.id)
      } else {
        updateQuantity(item.id, newQty)
      }
    },
    [item.id, updateQuantity, removeItem]
  )

  const handleDateChange = useCallback(
    (newDates: Partial<CartItemDates>) => {
      updateItemDates(item.id, { ...dates, ...newDates })
    },
    [item.id, dates, updateItemDates]
  )

  const handleRemove = useCallback(() => {
    removeItem(item.id)
  }, [item.id, removeItem])

  const productUrl = `/${lng}/equipment/${product.slug}`

  if (compact) {
    return (
      <div className={cn('flex gap-3 py-3', className)}>
        {/* Thumbnail */}
        <Link href={productUrl} className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link href={productUrl} className="text-sm font-medium text-zinc-100 hover:text-white line-clamp-1">
            {product.name}
          </Link>
          <p className="text-xs text-zinc-500 mt-0.5">
            {hasDates ? (
              <>{rentalDays} day{rentalDays !== 1 ? 's' : ''} × {quantity}</>
            ) : (
              <>Qty: {quantity}</>
            )}
          </p>
          {/* BLIND QUOTE: No price shown */}
          <p className="text-xs text-zinc-400 mt-1 italic">
            Price on quote
          </p>
        </div>

        {/* Remove */}
        <button
          onClick={handleRemove}
          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className={cn('flex gap-4 py-4 border-b border-zinc-800', className)}>
      {/* Image */}
      <Link href={productUrl} className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link href={productUrl} className="text-base font-medium text-zinc-100 hover:text-white line-clamp-2">
            {product.name}
          </Link>
          <button
            onClick={handleRemove}
            className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors flex-shrink-0"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Date Display - only show if dates are set */}
        {hasDates ? (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dates.start} → {dates.end}</span>
            <span className="text-zinc-600">({rentalDays} day{rentalDays !== 1 ? 's' : ''})</span>
          </div>
        ) : (
          <p className="mt-2 text-xs text-zinc-500 italic">
            Dates to be selected at checkout
          </p>
        )}

        {/* Quantity Controls - No price shown (BLIND QUOTE) */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-7 h-7 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded text-zinc-300 hover:bg-zinc-700 text-sm"
            >
              −
            </button>
            <span className="w-8 text-center text-sm text-zinc-100">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded text-zinc-300 hover:bg-zinc-700 text-sm"
            >
              +
            </button>
          </div>

          {/* BLIND QUOTE: No price, just a note */}
          <div className="text-right">
            <p className="text-xs text-zinc-500 italic">Price on quote</p>
          </div>
        </div>
      </div>
    </div>
  )
})

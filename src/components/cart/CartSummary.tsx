/**
 * CartSummary Component
 * 
 * Shows cart summary for the "Blind Quote" flow.
 * Per spec: NO total price calculation shown to client.
 * Only item counts and rental period info.
 * 
 * Design: Dark cinema theme
 */
'use client'

import { useMemo } from 'react'
import { CartItem, useCartStore } from '@/stores'
import { calculateRentalDays } from '@/lib/domain/pricing'
import { useTranslation } from '@/app/i18n/client'
import { cn } from '@/lib/utils'

interface CartSummaryProps {
  items?: CartItem[]
  showDetails?: boolean
  className?: string
  lng?: string
}

export function CartSummary({ items: propItems, showDetails = true, className, lng = 'en' }: CartSummaryProps) {
  const { t } = useTranslation(lng, 'cart')
  const storeItems = useCartStore((state) => state.items)
  const items = propItems ?? storeItems

  const { totalDays, totalItems, kitCount } = useMemo(() => {
    let totalDays = 0
    let totalItems = 0
    let kitCount = 0

    for (const item of items) {
      const days = calculateRentalDays(item.dates.start, item.dates.end)
      totalDays += days * item.quantity
      totalItems += item.quantity
      if (item.kitSelections && Object.keys(item.kitSelections).length > 0) {
        kitCount++
      }
    }

    return {
      totalDays,
      totalItems,
      kitCount,
    }
  }, [items])

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      {showDetails && (
        <>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">{t('items.title')}</span>
            <span className="text-zinc-300">{totalItems} {totalItems !== 1 ? 'items' : 'item'}</span>
          </div>
          {kitCount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">{lng === 'fr' ? 'Kits configurés' : 'Configured Kits'}</span>
              <span className="text-zinc-300">{kitCount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">{lng === 'fr' ? 'Jours de location' : 'Total Rental Days'}</span>
            <span className="text-zinc-300">{totalDays} {lng === 'fr' ? 'jours' : 'days'}</span>
          </div>
        </>
      )}

      {/* Blind Quote: No total shown */}
      <div className="pt-3 border-t border-zinc-700">
        <div className="flex justify-between text-lg font-semibold">
          <span className="text-white">{t('summary.total')}</span>
          <span className="text-amber-400">
            {lng === 'fr' ? 'Sur devis' : 'To Be Quoted'}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-2 text-center">
          {lng === 'fr' 
            ? 'Le prix final sera communiqué après validation de votre demande.'
            : 'Final pricing will be provided after we review your request.'
          }
        </p>
      </div>
    </div>
  )
}

/**
 * Cart Page (Client Component)
 * 
 * Full-page cart view with detailed item editing.
 * 
 * Design Archetype: Dark Cinema
 */
'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'
import { useCartStore } from '@/stores'
import { CartItemComponent } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { useTranslation } from '@/app/i18n/client'
import { cn } from '@/lib/utils'

export default function CartPage() {
  const params = useParams()
  const lng = (params?.lng as string) || 'en'
  const { t } = useTranslation(lng, 'cart')
  
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)

  const isEmpty = items.length === 0

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/${lng}/equipment`}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('continueShopping')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-zinc-400" />
            {t('title')}
          </h1>
          <p className="text-zinc-400 mt-2">
            {t('description')}
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-zinc-500" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-300 mb-2">
              {t('empty.title')}
            </h2>
            <p className="text-zinc-500 max-w-sm mb-8">
              {t('empty.description')}
            </p>
            <Link
              href={`/${lng}/equipment`}
              className="px-6 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
            >
              {t('empty.browseEquipment')}
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <h2 className="font-semibold text-zinc-200">
                    {t('items.title')} ({items.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('items.clearAll')}
                  </button>
                </div>

                <div className="px-4">
                  {items.map((item) => (
                    <CartItemComponent
                      key={item.id}
                      item={item}
                      lng={lng}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 sticky top-24">
                <h2 className="font-semibold text-zinc-200 mb-4">{t('summary.title')}</h2>

                <CartSummary showDetails lng={lng} />

                <Link
                  href={`/${lng}/quote`}
                  className={cn(
                    'w-full mt-6 py-3 px-4 flex items-center justify-center gap-2 rounded-lg font-semibold',
                    'bg-white text-zinc-900 hover:bg-zinc-200 transition-colors'
                  )}
                >
                  {t('summary.proceedToQuote')}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-xs text-zinc-500 text-center mt-4">
                  {t('summary.note')}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

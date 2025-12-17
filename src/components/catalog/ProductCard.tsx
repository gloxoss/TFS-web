/**
 * ProductCard Component
 * 
 * Displays a product in the equipment catalog grid.
 * Cinema-grade visual design with hover animations.
 * 
 * Design Archetype: Luxury/Editorial + Dark Cinema
 * Primary Font: System (inherits from layout)
 * Palette: Dark backgrounds, warm accents, subtle gradients
 */
'use client'

import { useState, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Product } from '@/services/products/types'
import { cn } from '@/lib/utils'
import { useCartStore, useUIStore } from '@/stores'
import { useSiteSettings } from '@/components/providers/site-settings-provider'

interface ProductCardProps {
  product: Product
  lng: string
  className?: string
}

export function ProductCard({ product, lng, className }: ProductCardProps) {
  const {
    name,
    slug,
    imageUrl,
    category,
    isAvailable,
  } = product

  const { settings } = useSiteSettings();
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useUIStore((state) => state.openCartDrawer)
  const globalDates = useCartStore((state) => state.globalDates)

  const productUrl = `/${lng}/equipment/${slug}`

  // Show price if enabled in settings and price exists in product data
  const showPrice = settings?.show_prices && product.price;

  // Best-effort check for "Camera" since category relation might be missing
  // Enhanced camera detection to ensure all cinema cameras prompt for kit configuration using "View Details"
  const cameraKeywords = [
    'camera', 'caméra',
    'arri', 'alexa', 'amira',
    'red', 'raptor', 'komodo', 'ranger', 'v-raptor',
    'sony fx', 'sony a7', 'sony venice', 'burano',
    'blackmagic', 'ursa', 'bmpcc', 'pocket cinema',
    'canon c', 'c70', 'c300', 'c500',
    'panasonic', 'varicam', 'eva1'
  ];

  const lowerName = name.toLowerCase();
  const lowerSlug = slug.toLowerCase();
  const lowerCatName = category?.name?.toLowerCase() || '';
  const lowerCatSlug = category?.slug?.toLowerCase() || '';

  const isCamera =
    lowerCatSlug === 'cameras' ||
    lowerCatName.includes('camera') ||
    cameraKeywords.some(keyword =>
      lowerName.includes(keyword) ||
      lowerSlug.includes(keyword)
    );

  // Show Quick Add for non-cameras (lights, grip, lenses, etc.)
  const showQuickAdd = !isCamera && isAvailable

  const handleQuantityChange = (e: MouseEvent, delta: number) => {
    e.preventDefault()
    e.stopPropagation()
    const newQty = Math.max(1, quantity + delta)
    setQuantity(newQty)
  }

  const handleQuickAdd = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Use global dates if set, otherwise default to today + 3 days
    const dates = globalDates || {
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    }

    addItem(product, quantity, dates)
    openCart()
    setQuantity(1)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl',
        'bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50',
        'transition-colors duration-300 hover:border-zinc-700/80',
        className
      )}
    >
      {/* Image Container */}
      <Link href={productUrl} className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent z-10" />

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Category Badge - Only shows if category data present */}
        {category && (
          <span className="absolute top-3 left-3 z-20 px-2.5 py-1 text-xs font-medium bg-zinc-900/80 backdrop-blur-sm text-zinc-300 rounded-md border border-zinc-700/50">
            {category.name}
          </span>
        )}

        {/* Availability Badge */}
        <span
          className={cn(
            'absolute top-3 right-3 z-20 px-2.5 py-1 text-xs font-medium rounded-md border',
            isAvailable
              ? 'bg-emerald-900/80 text-emerald-300 border-emerald-700/50'
              : 'bg-red-900/80 text-red-300 border-red-700/50'
          )}
        >
          {isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={productUrl}>
          <h3 className="font-semibold text-zinc-100 line-clamp-2 group-hover:text-white transition-colors">
            {name}
          </h3>
        </Link>

        {/* Pricing/Quote */}
        <div className="mt-1 mb-4">
          {showPrice ? (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-[#D00000]">{product.price}</span>
              <span className="text-sm text-zinc-400">MDH / {lng === 'fr' ? 'jour' : 'day'}</span>
            </div>
          ) : (
            <p className="text-xs text-zinc-500">
              Request a quote for pricing
            </p>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          {/* Quick Add Actions */}
          {showQuickAdd ? (
            <div className="flex items-center gap-2 w-full bg-zinc-800/50 p-1 rounded-lg border border-zinc-800">
              {/* Quantity Control */}
              <div className="flex items-center bg-zinc-900 rounded-md border border-zinc-800">
                <button
                  onClick={(e) => handleQuantityChange(e, -1)}
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-white">{quantity}</span>
                <button
                  onClick={(e) => handleQuantityChange(e, 1)}
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleQuickAdd}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white text-zinc-950 text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          ) : (
            <Link
              href={productUrl}
              className={cn(
                'ml-auto px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white',
                'border border-zinc-700'
              )}
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  )
}

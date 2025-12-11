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

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/services/products/types'
import { cn } from '@/lib/utils'

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

  const productUrl = `/${lng}/equipment/${slug}`

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

        {/* Category Badge */}
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

        {/* Blind Quote: No stock numbers or prices shown */}
        <p className="mt-1 text-xs text-zinc-500">
          Request a quote for pricing
        </p>

        <div className="mt-auto pt-3 flex items-center justify-end">
          <Link
            href={productUrl}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              'bg-white text-zinc-900 hover:bg-zinc-200',
              'border border-zinc-200'
            )}
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

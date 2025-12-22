/**
 * ProductGrid Component
 * 
 * Responsive grid layout for product cards with Framer Motion animations.
 * 
 * Design: Staggered fade-in, responsive columns
 */
'use client'

import { motion } from 'framer-motion'
import { Product } from '@/services/products/types'
import { ProductCard } from './ProductCard'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
  lng: string
  isLoading?: boolean
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export function ProductGrid({
  products,
  lng,
  isLoading = false,
  className,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid gap-6', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-300 mb-1">No equipment found</h3>
        <p className="text-zinc-500 max-w-sm">
          Try adjusting your filters or search terms to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} lng={lng} />
      ))}
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-zinc-800 rounded w-3/4" />
        <div className="h-4 bg-zinc-800 rounded w-1/4" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-zinc-800 rounded w-20" />
          <div className="h-8 bg-zinc-800 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

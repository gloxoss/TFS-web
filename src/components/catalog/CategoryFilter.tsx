/**
 * CategoryFilter Component
 * 
 * Filter products by category with pill/button selection.
 * 
 * Design: Dark cinema theme with subtle hover effects
 */
'use client'

import { motion } from 'framer-motion'
import { Category } from '@/services/products/types'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (categorySlug: string | null) => void
  className?: string
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {/* All Categories Button */}
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          'border',
          selectedCategory === null
            ? 'bg-white text-zinc-900 border-white'
            : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200'
        )}
      >
        All Equipment
      </button>

      {/* Category Buttons */}
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onCategoryChange(category.slug)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
            'border',
            selectedCategory === category.slug
              ? 'bg-white text-zinc-900 border-white'
              : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200'
          )}
        >
          {category.name}
          {category.productCount !== undefined && (
            <span className="ml-1.5 text-xs opacity-60">
              ({category.productCount})
            </span>
          )}
        </motion.button>
      ))}
    </div>
  )
}

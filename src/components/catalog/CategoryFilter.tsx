/**
 * Enhanced CategoryFilter Component
 * 
 * Cinema-grade category filtering with:
 * - Icon-based visual identity
 * - Gradient accents
 * - Product counts
 * - Priority sorting
 * - Smooth animations
 * 
 * Layout: Horizontal pills with wrapping
 * Design: Dark cinema theme with vibrant category colors
 */
'use client'

import { motion } from 'framer-motion'
import { Category } from '@/services/products/types'
import { cn } from '@/lib/utils'
import { getCategoryConfig, sortCategoriesByPriority } from '@/lib/productCategories'
import { Layers } from 'lucide-react'

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
  // Sort categories by priority
  const sortedCategories = sortCategoriesByPriority(categories)

  // Calculate total products count
  const totalCount = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {/* All Categories Pill */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => onCategoryChange(null)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300',
          'border overflow-hidden',
          selectedCategory === null
            ? 'bg-gradient-to-r from-white/10 to-white/5 border-white/20 shadow-lg shadow-white/10'
            : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/70'
        )}
      >
        {/* Background gradient */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300',
          selectedCategory === null ? 'opacity-100' : 'group-hover:opacity-50'
        )} />

        {/* Icon */}
        <Layers className={cn(
          'w-4 h-4 transition-colors relative z-10',
          selectedCategory === null ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'
        )} />

        {/* Label */}
        <span className={cn(
          'text-sm font-semibold transition-colors relative z-10 whitespace-nowrap',
          selectedCategory === null ? 'text-white' : 'text-zinc-300 group-hover:text-white'
        )}>
          All Equipment
        </span>

        {/* Count Badge */}
        <span className={cn(
          'relative z-10 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300',
          selectedCategory === null
            ? 'bg-white/20 text-white'
            : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-300'
        )}>
          {totalCount}
        </span>
      </motion.button>

      {/* Category Pills */}
      {sortedCategories.map((category, index) => {
        const config = getCategoryConfig(category.slug)
        const Icon = config.icon
        const isActive = selectedCategory === category.slug

        return (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            onClick={() => onCategoryChange(category.slug)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300',
              'border overflow-hidden',
              isActive
                ? cn(
                  'bg-gradient-to-r border-opacity-40 shadow-lg',
                  config.gradient,
                  config.borderColor,
                  config.hoverGlow
                )
                : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/70'
            )}
          >
            {/* Background gradient */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300',
              config.gradient,
              isActive ? 'opacity-100' : 'group-hover:opacity-30'
            )} />

            {/* Icon */}
            <Icon className={cn(
              'w-4 h-4 transition-colors relative z-10',
              isActive ? config.textColor : 'text-zinc-400 group-hover:text-zinc-300'
            )} />

            {/* Label */}
            <span className={cn(
              'text-sm font-semibold transition-colors relative z-10 whitespace-nowrap',
              isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'
            )}>
              {category.name}
            </span>

            {/* Count Badge */}
            {category.productCount !== undefined && (
              <span className={cn(
                'relative z-10 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300',
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-300'
              )}>
                {category.productCount}
              </span>
            )}

            {/* Glow effect on hover/active */}
            {isActive && (
              <div className={cn(
                'absolute inset-0 rounded-xl blur-xl opacity-50',
                config.hoverGlow
              )} />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

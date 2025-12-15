/**
 * Equipment Catalog Client Component
 * 
 * Handles interactive filtering, search, and pagination.
 * Uses URL state for shareable filter states.
 * 
 * Design Archetype: Dark Cinema / Luxury Editorial
 */
'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Product, Category } from '@/services/products/types'
import { ProductGrid, CategoryFilter, SearchBar } from '@/components/catalog'
import { useTranslation } from '@/app/i18n/client'
import { cn } from '@/lib/utils'

interface EquipmentCatalogClientProps {
  lng: string
  initialProducts: Product[]
  initialPagination: {
    page: number
    totalPages: number
    totalItems: number
  }
  categories: Category[]
  initialCategory: string | null
  initialSearch: string
}

export function EquipmentCatalogClient({
  lng,
  initialProducts,
  initialPagination,
  categories,
  initialCategory,
  initialSearch,
}: EquipmentCatalogClientProps) {
  const { t } = useTranslation(lng, 'catalog')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  // Update URL with filters
  const updateFilters = useCallback(
    (updates: { category?: string | null; search?: string; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString())

      if (updates.category !== undefined) {
        if (updates.category) {
          params.set('category', updates.category)
        } else {
          params.delete('category')
        }
      }

      if (updates.search !== undefined) {
        if (updates.search) {
          params.set('search', updates.search)
        } else {
          params.delete('search')
        }
      }

      if (updates.page !== undefined && updates.page > 1) {
        params.set('page', updates.page.toString())
      } else {
        params.delete('page')
      }

      startTransition(() => {
        router.push(`/${lng}/equipment?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams, lng]
  )

  const handleCategoryChange = useCallback(
    (categorySlug: string | null) => {
      setSelectedCategory(categorySlug)
      updateFilters({ category: categorySlug, page: 1 })
    },
    [updateFilters]
  )

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query)
      updateFilters({ search: query, page: 1 })
    },
    [updateFilters]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [updateFilters]
  )

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category Pills */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              className="order-2 md:order-1"
            />

            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full md:w-72 order-1 md:order-2"
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-zinc-500">
              {initialPagination.totalItems} {t('pagination.results')}
              {selectedCategory && (
                <span className="ml-1">
                  in <span className="text-zinc-300">{categories.find(c => c.slug === selectedCategory)?.name}</span>
                </span>
              )}
              {searchQuery && (
                <span className="ml-1">
                  matching &ldquo;<span className="text-zinc-300">{searchQuery}</span>&rdquo;
                </span>
              )}
            </p>

            {isPending && (
              <span className="text-sm text-zinc-500 flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading...
              </span>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={initialProducts}
            lng={lng}
            isLoading={isPending}
          />

          {/* Pagination */}
          {initialPagination.totalPages > 1 && (
            <Pagination
              currentPage={initialPagination.page}
              totalPages={initialPagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </div>
  )
}

// Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = generatePageNumbers(currentPage, totalPages)

  return (
    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'px-3 py-2 text-sm rounded-lg transition-colors',
          currentPage <= 1
            ? 'text-zinc-600 cursor-not-allowed'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        )}
      >
        Previous
      </button>

      {pages.map((page, i) => (
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-zinc-600">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={cn(
              'px-3 py-2 text-sm rounded-lg transition-colors',
              currentPage === page
                ? 'bg-white text-zinc-900 font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            )}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'px-3 py-2 text-sm rounded-lg transition-colors',
          currentPage >= totalPages
            ? 'text-zinc-600 cursor-not-allowed'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        )}
      >
        Next
      </button>
    </nav>
  )
}

function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= 3) {
    return [1, 2, 3, 4, 5, '...', total]
  }

  if (current >= total - 2) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, '...', current - 1, current, current + 1, '...', total]
}

/**
 * Equipment Catalog Client Component
 * 
 * Handles interactive filtering, search, and pagination.
 * Uses URL state for shareable filter states.
 * 
 * Design Archetype: Dark Cinema / Luxury Editorial
 */
'use client'

import { useState, useCallback, useTransition, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Product, Category } from '@/services/products/types'
import { ProductGrid, CategoryFilter, SearchBar, BrandFilter, SortDropdown, SortOption } from '@/components/catalog'
import { Pagination } from '@/components/ui/pagination'
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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('name')

  // Extract unique brands from products
  const availableBrands = Array.from(
    new Set(initialProducts.map(p => p.brand).filter(Boolean))
  ).sort() as string[]

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

  // Robust client-side filtering
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts]

    // Brand filtering - Normalized for robustness
    if (selectedBrands.length > 0) {
      const normalizedSelectedBrands = selectedBrands.map(b => b.toLowerCase().trim())
      result = result.filter(product => {
        if (!product.brand) return false
        const pBrand = product.brand.toLowerCase().trim()
        // Check if product brand matches ANY of the selected brands
        return normalizedSelectedBrands.includes(pBrand)
      })
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'featured':
          // Featured first, then name
          return (Number(b.isFeatured) - Number(a.isFeatured)) || a.name.localeCompare(b.name)
        case 'category':
          // By category name, then product name
          const catA = a.category?.name || ''
          const catB = b.category?.name || ''
          return catA.localeCompare(catB) || a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return result
  }, [initialProducts, selectedBrands, sortBy])

  const totalFilteredCount = filteredProducts.length

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

      {/* Sticky Tabs Header - Floating Boxed Design */}
      <div className="sticky top-24 z-30 transition-transform duration-300 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl ring-1 ring-white/5">

          {/* Primary Tabs - Elegant Horizontal Scroll */}
          <div className="relative border-b border-white/5">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950/90 to-transparent z-10 pointer-events-none" />
            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950/90 to-transparent z-10 pointer-events-none" />

            <div
              className="flex overflow-x-auto px-6 py-1 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <TabItem
                label={t('categories.all')}
                active={selectedCategory === null}
                onClick={() => handleCategoryChange(null)}
              />
              {categories.map(cat => (
                <TabItem
                  key={cat.id}
                  label={cat.name}
                  active={selectedCategory === cat.slug}
                  count={cat.productCount}
                  onClick={() => handleCategoryChange(cat.slug)}
                />
              ))}
            </div>
          </div>

          {/* Secondary Toolbar */}
          <div className="py-3 px-4 sm:px-6">
            {/* Desktop: Single row. Mobile: Stack */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

              {/* Left Side: Brand Filters + Item Count */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-xs text-zinc-500 shrink-0">
                  {totalFilteredCount} items
                </span>

                {/* Brand Filters - Horizontal scroll with fade */}
                {availableBrands.length > 0 && (
                  <div className="relative flex-1 min-w-0">
                    {/* Left fade */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-zinc-950/90 to-transparent z-10 pointer-events-none" />
                    {/* Right fade */}
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-zinc-950/90 to-transparent z-10 pointer-events-none" />

                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap px-1">
                      <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest shrink-0">
                        Brand:
                      </span>
                      <BrandFilter
                        brands={availableBrands}
                        selectedBrands={selectedBrands}
                        onBrandToggle={(brand) => {
                          setSelectedBrands(prev => {
                            const isIncluded = prev.some(b => b.toLowerCase() === brand.toLowerCase())
                            if (isIncluded) {
                              return prev.filter(b => b.toLowerCase() !== brand.toLowerCase())
                            } else {
                              return [...prev, brand]
                            }
                          })
                        }}
                      />
                      {selectedBrands.length > 0 && (
                        <button
                          onClick={() => setSelectedBrands([])}
                          className="text-xs text-zinc-500 hover:text-white shrink-0 ml-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Sort & Search */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative z-50">
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                </div>
                <SearchBar
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-40 md:w-48"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Results Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Apply client-side filtering and sorting */}
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-zinc-500">
              {totalFilteredCount} {t('pagination.results')}
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
              {selectedBrands.length > 0 && (
                <span className="ml-1">
                  · <span className="text-indigo-400">{selectedBrands.join(', ')}</span>
                </span>
              )}
            </p>

            {isPending && (
              <span className="text-sm text-zinc-500 flex items-center gap-2">
                Loading...
              </span>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            lng={lng}
            isLoading={isPending}
          />

          {/* Pagination - Only show if NO client-side filters are active */}
          {initialPagination.totalPages > 1 && selectedBrands.length === 0 && (
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

function TabItem({ label, count, active, onClick }: { label: string, count?: number, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors",
        active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
      )}
    >
      {label}
      {count !== undefined && <span className="ml-2 text-xs opacity-50">{count}</span>}

      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  )
}


/**
 * Equipment Catalog Client Component
 * 
 * Hybrid Filter System:
 * - Desktop: Top sticky bar with category pills + brand dropdown
 * - Mobile: FAB button + bottom sheet modal
 * 
 * No price filters - equipment rental catalog mode
 * 
 * Design Archetype: Dark Cinema / Luxury Editorial
 */
'use client'

import { useState, useCallback, useTransition, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Product, Category } from '@/services/products/types'
import { ProductGrid, HybridFilterBar, SortDropdown, SortOption } from '@/components/catalog'
import { Pagination } from '@/components/ui/pagination'
import { useTranslation } from '@/app/i18n/client'

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

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedMounts, setSelectedMounts] = useState<string[]>([])
  const [selectedSensorSizes, setSelectedSensorSizes] = useState<string[]>([])
  const [selectedResolutions, setSelectedResolutions] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Extract unique brands from products
  const availableBrands = useMemo(() => {
    return Array.from(
      new Set(initialProducts.map(p => p.brand).filter(Boolean))
    ).sort() as string[]
  }, [initialProducts])

  // Extract unique types from products (check both type field and specs)
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    initialProducts.forEach(p => {
      if (p.type) types.add(p.type);
      if (p.specs?.type) types.add(String(p.specs.type));
    });
    return Array.from(types).filter(Boolean).sort();
  }, [initialProducts])

  // Extract unique mounts from products (check both mount field and specs)
  const availableMounts = useMemo(() => {
    const mounts = new Set<string>();
    initialProducts.forEach(p => {
      if (p.mount) mounts.add(p.mount);
      if (p.specs?.mount) mounts.add(String(p.specs.mount));
      if (p.specs?.lens_mount) mounts.add(String(p.specs.lens_mount));
    });
    return Array.from(mounts).filter(Boolean).sort();
  }, [initialProducts])

  // Extract unique sensor sizes from products (check both field and specs)
  const availableSensorSizes = useMemo(() => {
    const sizes = new Set<string>();
    initialProducts.forEach(p => {
      if (p.sensorSize) sizes.add(p.sensorSize);
      if (p.specs?.sensor_size) sizes.add(String(p.specs.sensor_size));
      if (p.specs?.coverage) sizes.add(String(p.specs.coverage));
      if (p.specs?.sensor) sizes.add(String(p.specs.sensor));
    });
    return Array.from(sizes).filter(Boolean).sort();
  }, [initialProducts])

  // Extract unique resolutions from products (check both field and specs)
  const availableResolutions = useMemo(() => {
    const resolutions = new Set<string>();
    initialProducts.forEach(p => {
      if (p.resolution) resolutions.add(p.resolution);
      if (p.specs?.resolution) resolutions.add(String(p.specs.resolution));
      if (p.specs?.max_resolution) resolutions.add(String(p.specs.max_resolution));
    });
    return Array.from(resolutions).filter(Boolean).sort();
  }, [initialProducts])

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

  // Handlers
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

  const handleBrandToggle = useCallback((brand: string) => {
    setSelectedBrands(prev => {
      const isIncluded = prev.some(b => b.toLowerCase() === brand.toLowerCase())
      if (isIncluded) {
        return prev.filter(b => b.toLowerCase() !== brand.toLowerCase())
      } else {
        return [...prev, brand]
      }
    })
  }, [])

  const handleBrandsChange = useCallback((brands: string[]) => {
    setSelectedBrands(brands)
  }, [])

  const handleTypeToggle = useCallback((type: string) => {
    setSelectedTypes(prev => {
      const isIncluded = prev.some(t => t.toLowerCase() === type.toLowerCase())
      if (isIncluded) {
        return prev.filter(t => t.toLowerCase() !== type.toLowerCase())
      } else {
        return [...prev, type]
      }
    })
  }, [])

  const handleTypesChange = useCallback((types: string[]) => {
    setSelectedTypes(types)
  }, [])

  const handleMountToggle = useCallback((mount: string) => {
    setSelectedMounts(prev => {
      const isIncluded = prev.some(m => m.toLowerCase() === mount.toLowerCase())
      return isIncluded ? prev.filter(m => m.toLowerCase() !== mount.toLowerCase()) : [...prev, mount]
    })
  }, [])

  const handleMountsChange = useCallback((mounts: string[]) => {
    setSelectedMounts(mounts)
  }, [])

  const handleSensorToggle = useCallback((size: string) => {
    setSelectedSensorSizes(prev => {
      const isIncluded = prev.some(s => s.toLowerCase() === size.toLowerCase())
      return isIncluded ? prev.filter(s => s.toLowerCase() !== size.toLowerCase()) : [...prev, size]
    })
  }, [])

  const handleSensorsChange = useCallback((sizes: string[]) => {
    setSelectedSensorSizes(sizes)
  }, [])

  const handleResolutionToggle = useCallback((res: string) => {
    setSelectedResolutions(prev => {
      const isIncluded = prev.some(r => r.toLowerCase() === res.toLowerCase())
      return isIncluded ? prev.filter(r => r.toLowerCase() !== res.toLowerCase()) : [...prev, res]
    })
  }, [])

  const handleResolutionsChange = useCallback((resolutions: string[]) => {
    setSelectedResolutions(resolutions)
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [updateFilters]
  )

  // Client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts]

    // Brand filtering
    if (selectedBrands.length > 0) {
      const normalizedSelectedBrands = selectedBrands.map(b => b.toLowerCase().trim())
      result = result.filter(product => {
        if (!product.brand) return false
        const pBrand = product.brand.toLowerCase().trim()
        return normalizedSelectedBrands.includes(pBrand)
      })
    }

    // Type filtering (check both type field and specs)
    if (selectedTypes.length > 0) {
      const normalizedSelectedTypes = selectedTypes.map(t => t.toLowerCase().trim())
      result = result.filter(product => {
        const pType = product.type?.toLowerCase().trim();
        const specsType = (product.specs?.type as string)?.toLowerCase().trim();
        return (pType && normalizedSelectedTypes.includes(pType)) ||
          (specsType && normalizedSelectedTypes.includes(specsType));
      })
    }

    // Mount filtering (check both mount field and specs)
    if (selectedMounts.length > 0) {
      const normalizedSelectedMounts = selectedMounts.map(m => m.toLowerCase().trim())
      result = result.filter(product => {
        const pMount = product.mount?.toLowerCase().trim();
        const specsMount = (product.specs?.mount as string)?.toLowerCase().trim();
        const specsLensMount = (product.specs?.lens_mount as string)?.toLowerCase().trim();
        return (pMount && normalizedSelectedMounts.includes(pMount)) ||
          (specsMount && normalizedSelectedMounts.includes(specsMount)) ||
          (specsLensMount && normalizedSelectedMounts.includes(specsLensMount));
      })
    }

    // Sensor filtering (check both sensorSize field and specs)
    if (selectedSensorSizes.length > 0) {
      const normalizedSelectedSensors = selectedSensorSizes.map(s => s.toLowerCase().trim())
      result = result.filter(product => {
        const pSensor = product.sensorSize?.toLowerCase().trim();
        const specsSensor = (product.specs?.sensor_size as string)?.toLowerCase().trim();
        const specsCoverage = (product.specs?.coverage as string)?.toLowerCase().trim();
        return (pSensor && normalizedSelectedSensors.includes(pSensor)) ||
          (specsSensor && normalizedSelectedSensors.includes(specsSensor)) ||
          (specsCoverage && normalizedSelectedSensors.includes(specsCoverage));
      })
    }

    // Resolution filtering (check both resolution field and specs)
    if (selectedResolutions.length > 0) {
      const normalizedSelectedResolutions = selectedResolutions.map(r => r.toLowerCase().trim())
      result = result.filter(product => {
        const pResolution = product.resolution?.toLowerCase().trim();
        const specsRes = (product.specs?.resolution as string)?.toLowerCase().trim();
        const specsMaxRes = (product.specs?.max_resolution as string)?.toLowerCase().trim();
        return (pResolution && normalizedSelectedResolutions.includes(pResolution)) ||
          (specsRes && normalizedSelectedResolutions.includes(specsRes)) ||
          (specsMaxRes && normalizedSelectedResolutions.includes(specsMaxRes));
      })
    }

    // Search filtering (if URL search is active, server already filtered, this is for additional client-side)
    if (searchQuery && !initialSearch) {
      const query = searchQuery.toLowerCase()
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category?.name.toLowerCase().includes(query)
      )
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'featured':
          return (Number(b.isFeatured) - Number(a.isFeatured)) || a.name.localeCompare(b.name)
        case 'category':
          const catA = a.category?.name || ''
          const catB = b.category?.name || ''
          return catA.localeCompare(catB) || a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return result
  }, [initialProducts, selectedBrands, sortBy, searchQuery, initialSearch])

  const totalFilteredCount = filteredProducts.length

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950" />

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-red-700/15 text-red-400 rounded-full text-sm font-medium mb-6">
              {t('hero.pill')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Hybrid Filter Bar */}
      <HybridFilterBar
        categories={categories}
        brands={availableBrands}
        types={availableTypes}
        selectedCategory={selectedCategory}
        selectedBrands={selectedBrands}
        selectedTypes={selectedTypes}
        searchQuery={searchQuery}
        totalCount={totalFilteredCount}
        onCategoryChange={handleCategoryChange}
        onBrandToggle={handleBrandToggle}
        onBrandsChange={handleBrandsChange}
        onTypeToggle={handleTypeToggle}
        onTypesChange={handleTypesChange}
        mounts={availableMounts}
        selectedMounts={selectedMounts}
        onMountToggle={handleMountToggle}
        onMountsChange={handleMountsChange}
        sensorSizes={availableSensorSizes}
        selectedSensorSizes={selectedSensorSizes}
        onSensorToggle={handleSensorToggle}
        onSensorsChange={handleSensorsChange}
        resolutions={availableResolutions}
        selectedResolutions={selectedResolutions}
        onResolutionToggle={handleResolutionToggle}
        onResolutionsChange={handleResolutionsChange}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        t={t}
      />

      {/* Results Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header - Desktop Only (mobile shows in HybridFilterBar) */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <p className="text-sm text-zinc-500">
                <span className="text-white font-medium">{totalFilteredCount}</span> {t('pagination.results')}
                {selectedCategory && (
                  <span className="ml-1">
                    in <span className="text-red-400">{categories.find(c => c.slug === selectedCategory)?.name}</span>
                  </span>
                )}
                {selectedBrands.length > 0 && (
                  <span className="ml-1">
                    · <span className="text-red-400">{selectedBrands.join(', ')}</span>
                  </span>
                )}
              </p>

              {isPending && (
                <span className="text-sm text-zinc-500 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-zinc-600 border-t-red-500 rounded-full animate-spin" />
                  Loading...
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            lng={lng}
            isLoading={isPending}
          />

          {/* Pagination - Only show if NO client-side filters are active */}
          {initialPagination.totalPages > 1 && selectedBrands.length === 0 && (
            <div className="mt-12">
              <Pagination
                currentPage={initialPagination.page}
                totalPages={initialPagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

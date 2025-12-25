/**
 * Hybrid Filter Bar Component
 * 
 * Desktop: Top sticky bar with pill filters (category + brand)
 * Mobile: FAB button + bottom sheet modal
 * 
 * No price filters - equipment rental catalog mode
 */
'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Filter,
    X,
    ChevronDown,
    Check,
    SlidersHorizontal,
    Search,
    LayoutGrid,
    List,
    Camera,
    Lightbulb,
    Mic,
    Video,
    Package,
    Sparkles,
    Aperture,
    Scan,
    Maximize,
    CircleDot
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Category } from '@/services/products/types'

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ElementType> = {
    'cameras': Camera,
    'camera': Camera,
    'lighting': Lightbulb,
    'lights': Lightbulb,
    'audio': Mic,
    'sound': Mic,
    'lenses': Video,
    'lens': Video,
    'grip': Package,
    'support': Package,
    'accessories': Sparkles,
    'default': Package
}

function getCategoryIcon(slug: string): React.ElementType {
    const normalized = slug.toLowerCase()
    for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
        if (normalized.includes(key)) return icon
    }
    return CATEGORY_ICONS.default
}

interface HybridFilterBarProps {
    categories: Category[]
    brands: string[]
    types: string[]
    selectedCategory: string | null
    selectedBrands: string[]
    selectedTypes: string[]
    mounts?: string[]
    selectedMounts?: string[]
    sensorSizes?: string[]
    selectedSensorSizes?: string[]
    resolutions?: string[]
    selectedResolutions?: string[]
    searchQuery: string
    totalCount: number
    onCategoryChange: (category: string | null) => void
    onBrandToggle: (brand: string) => void
    onBrandsChange: (brands: string[]) => void
    onTypeToggle: (type: string) => void
    onTypesChange: (types: string[]) => void
    onMountToggle?: (mount: string) => void
    onMountsChange?: (mounts: string[]) => void
    onSensorToggle?: (size: string) => void
    onSensorsChange?: (sizes: string[]) => void
    onResolutionToggle?: (res: string) => void
    onResolutionsChange?: (resolutions: string[]) => void
    onSearchChange: (query: string) => void
    viewMode?: 'grid' | 'list'
    onViewModeChange?: (mode: 'grid' | 'list') => void
    t: (key: string) => string
}

export function HybridFilterBar({
    categories,
    brands,
    types,
    selectedCategory,
    selectedBrands,
    selectedTypes,
    searchQuery,
    totalCount,
    onCategoryChange,
    onBrandToggle,
    onBrandsChange,
    onTypeToggle,
    onTypesChange,
    mounts = [],
    selectedMounts = [],
    onMountToggle,
    onMountsChange,
    sensorSizes = [],
    selectedSensorSizes = [],
    onSensorToggle,
    onSensorsChange,
    resolutions = [],
    selectedResolutions = [],
    onResolutionToggle,
    onResolutionsChange,
    onSearchChange,
    viewMode = 'grid',
    onViewModeChange,
    t
}: HybridFilterBarProps) {
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
    const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
    const [mountDropdownOpen, setMountDropdownOpen] = useState(false)
    const [sensorDropdownOpen, setSensorDropdownOpen] = useState(false)
    const [resDropdownOpen, setResDropdownOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)



    // Close logic 
    useEffect(() => {
        if (!mobileSheetOpen) {
            setMobileSheetOpen(false)
        }
    }, [mobileSheetOpen])
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return
        setIsDragging(true)
        setStartX(e.pageX - scrollRef.current.offsetLeft)
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return
        e.preventDefault()
        const x = e.pageX - scrollRef.current.offsetLeft
        const walk = (x - startX) * 2 // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk
    }

    const activeFilterCount = (selectedCategory ? 1 : 0) + selectedBrands.length + selectedTypes.length

    const clearAllFilters = useCallback(() => {
        onCategoryChange(null)
        onBrandsChange([])
        onTypesChange([])
        onSearchChange('')
    }, [onCategoryChange, onBrandsChange, onTypesChange, onSearchChange])

    return (
        <>
            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {/* DESKTOP: Top Sticky Filter Bar */}
            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div className="hidden md:block sticky top-20 z-40 px-4 sm:px-6 lg:px-8 mb-8">
                <div className="max-w-7xl mx-auto bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">

                    {/* Primary Row: Category Pills - Drag to Scroll */}
                    <div className="relative border-b border-white/5">
                        {/* Fade gradients */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-900/95 to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-900/95 to-transparent z-10 pointer-events-none" />

                        <div
                            ref={scrollRef}
                            className={cn(
                                "flex overflow-x-auto px-6 py-2 scrollbar-hide select-none",
                                isDragging ? "cursor-grabbing" : "cursor-grab"
                            )}
                            style={{ scrollbarWidth: 'none' }}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            {/* All Equipment */}
                            <CategoryPill
                                label={t('categories.all')}
                                icon={Package}
                                active={selectedCategory === null}
                                onClick={() => !isDragging && onCategoryChange(null)}
                            />

                            {/* Category Pills */}
                            {categories.map((cat) => (
                                <CategoryPill
                                    key={cat.id}
                                    label={cat.name}
                                    icon={getCategoryIcon(cat.slug)}
                                    count={cat.productCount}
                                    active={selectedCategory === cat.slug}
                                    onClick={() => !isDragging && onCategoryChange(cat.slug)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Secondary Row: Brand Filter, Search, View Toggle */}
                    <div className="flex items-center justify-between px-6 py-3 gap-4">
                        {/* Left: Item count + Brand filter */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <span className="text-xs text-zinc-500 shrink-0 font-medium">
                                {totalCount} {t('filters.items')}
                            </span>

                            {/* Brand Dropdown */}
                            {brands.length > 0 && (
                                <div className="relative">
                                    <button
                                        onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                            selectedBrands.length > 0
                                                ? "bg-emerald-700/20 text-emerald-400 border border-emerald-700/30"
                                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-transparent"
                                        )}
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        {t('filters.brand.label')}
                                        {selectedBrands.length > 0 && (
                                            <span className="w-5 h-5 bg-emerald-700 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                                {selectedBrands.length}
                                            </span>
                                        )}
                                        <ChevronDown className={cn(
                                            "w-4 h-4 transition-transform",
                                            brandDropdownOpen && "rotate-180"
                                        )} />
                                    </button>

                                    <AnimatePresence>
                                        {brandDropdownOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setBrandDropdownOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                >
                                                    <div className="p-2 border-b border-zinc-800 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">
                                                            {t('filters.brand.title')}
                                                        </span>
                                                        {selectedBrands.length > 0 && (
                                                            <button
                                                                onClick={() => onBrandsChange([])}
                                                                className="text-xs text-zinc-500 hover:text-white px-2"
                                                            >
                                                                {t('filters.clear')}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="max-h-64 overflow-y-auto p-2">
                                                        {brands.map(brand => (
                                                            <button
                                                                key={brand}
                                                                onClick={() => onBrandToggle(brand)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                                                    selectedBrands.includes(brand)
                                                                        ? "bg-emerald-700/20 text-emerald-400"
                                                                        : "hover:bg-zinc-800 text-zinc-300"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                                                                    selectedBrands.includes(brand)
                                                                        ? "bg-emerald-700 border-emerald-700"
                                                                        : "border-zinc-600"
                                                                )}>
                                                                    {selectedBrands.includes(brand) && (
                                                                        <Check className="w-3 h-3 text-zinc-900" />
                                                                    )}
                                                                </div>
                                                                <span className="text-sm font-medium">{brand}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Type Dropdown */}
                            {types.length > 0 && (
                                <div className="relative">
                                    <button
                                        onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                            selectedTypes.length > 0
                                                ? "bg-blue-700/20 text-blue-400 border border-blue-700/30"
                                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-transparent"
                                        )}
                                    >
                                        <Video className="w-4 h-4" />
                                        {t('filters.type.label')}
                                        {selectedTypes.length > 0 && (
                                            <span className="w-5 h-5 bg-blue-700 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                                {selectedTypes.length}
                                            </span>
                                        )}
                                        <ChevronDown className={cn(
                                            "w-4 h-4 transition-transform",
                                            typeDropdownOpen && "rotate-180"
                                        )} />
                                    </button>

                                    <AnimatePresence>
                                        {typeDropdownOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setTypeDropdownOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                >
                                                    <div className="p-2 border-b border-zinc-800 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">
                                                            {t('filters.type.title')}
                                                        </span>
                                                        {selectedTypes.length > 0 && (
                                                            <button
                                                                onClick={() => onTypesChange([])}
                                                                className="text-xs text-zinc-500 hover:text-white px-2"
                                                            >
                                                                {t('filters.clear')}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="max-h-64 overflow-y-auto p-2">
                                                        {types.map(type => (
                                                            <button
                                                                key={type}
                                                                onClick={() => onTypeToggle(type)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                                                    selectedTypes.includes(type)
                                                                        ? "bg-blue-700/20 text-blue-400"
                                                                        : "hover:bg-zinc-800 text-zinc-300"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                                                                    selectedTypes.includes(type)
                                                                        ? "bg-blue-700 border-blue-700"
                                                                        : "border-zinc-600"
                                                                )}>
                                                                    {selectedTypes.includes(type) && (
                                                                        <Check className="w-3 h-3 text-zinc-900" />
                                                                    )}
                                                                </div>
                                                                <span className="text-sm font-medium">{type}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Mount Dropdown */}
                            {mounts.length > 0 && onMountToggle && onMountsChange && (
                                <div className="relative">
                                    <button
                                        onClick={() => setMountDropdownOpen(!mountDropdownOpen)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                            selectedMounts.length > 0
                                                ? "bg-purple-700/20 text-purple-400 border border-purple-700/30"
                                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-transparent"
                                        )}
                                    >
                                        <CircleDot className="w-4 h-4" />
                                        {t('filters.mount.label')}
                                        {selectedMounts.length > 0 && (
                                            <span className="w-5 h-5 bg-purple-700 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                                {selectedMounts.length}
                                            </span>
                                        )}
                                        <ChevronDown className={cn("w-4 h-4 transition-transform", mountDropdownOpen && "rotate-180")} />
                                    </button>

                                    <AnimatePresence>
                                        {mountDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setMountDropdownOpen(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                >
                                                    <div className="p-2 border-b border-zinc-800 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">{t('filters.mount.title')}</span>
                                                        {selectedMounts.length > 0 && (
                                                            <button onClick={() => onMountsChange([])} className="text-xs text-zinc-500 hover:text-white px-2">{t('filters.clear')}</button>
                                                        )}
                                                    </div>
                                                    <div className="max-h-64 overflow-y-auto p-2">
                                                        {mounts.map(mount => (
                                                            <button
                                                                key={mount}
                                                                onClick={() => onMountToggle(mount)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                                                    selectedMounts.includes(mount) ? "bg-purple-700/20 text-purple-400" : "hover:bg-zinc-800 text-zinc-300"
                                                                )}
                                                            >
                                                                <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0", selectedMounts.includes(mount) ? "bg-purple-700 border-purple-700" : "border-zinc-600")}>
                                                                    {selectedMounts.includes(mount) && <Check className="w-3 h-3 text-zinc-900" />}
                                                                </div>
                                                                <span className="text-sm font-medium">{mount}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Sensor Dropdown */}
                            {sensorSizes.length > 0 && onSensorToggle && onSensorsChange && (
                                <div className="relative">
                                    <button
                                        onClick={() => setSensorDropdownOpen(!sensorDropdownOpen)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                            selectedSensorSizes.length > 0
                                                ? "bg-amber-700/20 text-amber-400 border border-amber-700/30"
                                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-transparent"
                                        )}
                                    >
                                        <Scan className="w-4 h-4" />
                                        {t('filters.sensor.label')}
                                        {selectedSensorSizes.length > 0 && (
                                            <span className="w-5 h-5 bg-amber-700 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                                {selectedSensorSizes.length}
                                            </span>
                                        )}
                                        <ChevronDown className={cn("w-4 h-4 transition-transform", sensorDropdownOpen && "rotate-180")} />
                                    </button>
                                    <AnimatePresence>
                                        {sensorDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setSensorDropdownOpen(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                >
                                                    <div className="p-2 border-b border-zinc-800 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">{t('filters.sensor.title')}</span>
                                                        {selectedSensorSizes.length > 0 && (
                                                            <button onClick={() => onSensorsChange([])} className="text-xs text-zinc-500 hover:text-white px-2">{t('filters.clear')}</button>
                                                        )}
                                                    </div>
                                                    <div className="max-h-64 overflow-y-auto p-2">
                                                        {sensorSizes.map(size => (
                                                            <button
                                                                key={size}
                                                                onClick={() => onSensorToggle(size)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                                                    selectedSensorSizes.includes(size) ? "bg-amber-700/20 text-amber-400" : "hover:bg-zinc-800 text-zinc-300"
                                                                )}
                                                            >
                                                                <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0", selectedSensorSizes.includes(size) ? "bg-amber-700 border-amber-700" : "border-zinc-600")}>
                                                                    {selectedSensorSizes.includes(size) && <Check className="w-3 h-3 text-zinc-900" />}
                                                                </div>
                                                                <span className="text-sm font-medium">{size}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Resolution Dropdown */}
                            {resolutions.length > 0 && onResolutionToggle && onResolutionsChange && (
                                <div className="relative">
                                    <button
                                        onClick={() => setResDropdownOpen(!resDropdownOpen)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                            selectedResolutions.length > 0
                                                ? "bg-red-700/20 text-red-400 border border-red-700/30"
                                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-transparent"
                                        )}
                                    >
                                        <Maximize className="w-4 h-4" />
                                        {t('filters.resolution.label')}
                                        {selectedResolutions.length > 0 && (
                                            <span className="w-5 h-5 bg-red-700 text-white rounded-full text-xs flex items-center justify-center font-bold">
                                                {selectedResolutions.length}
                                            </span>
                                        )}
                                        <ChevronDown className={cn("w-4 h-4 transition-transform", resDropdownOpen && "rotate-180")} />
                                    </button>
                                    <AnimatePresence>
                                        {resDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setResDropdownOpen(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                >
                                                    <div className="p-2 border-b border-zinc-800 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">{t('filters.resolution.title')}</span>
                                                        {selectedResolutions.length > 0 && (
                                                            <button onClick={() => onResolutionsChange([])} className="text-xs text-zinc-500 hover:text-white px-2">{t('filters.clear')}</button>
                                                        )}
                                                    </div>
                                                    <div className="max-h-64 overflow-y-auto p-2">
                                                        {resolutions.map(res => (
                                                            <button
                                                                key={res}
                                                                onClick={() => onResolutionToggle(res)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                                                    selectedResolutions.includes(res) ? "bg-red-700/20 text-red-400" : "hover:bg-zinc-800 text-zinc-300"
                                                                )}
                                                            >
                                                                <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0", selectedResolutions.includes(res) ? "bg-red-700 border-red-700" : "border-zinc-600")}>
                                                                    {selectedResolutions.includes(res) && <Check className="w-3 h-3 text-zinc-900" />}
                                                                </div>
                                                                <span className="text-sm font-medium">{res}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Active filter tags */}
                            <div className="flex gap-2 overflow-hidden">
                                {selectedBrands.slice(0, 2).map(brand => (
                                    <span
                                        key={brand}
                                        className="px-3 py-1 bg-zinc-800 rounded-full text-xs flex items-center gap-1.5 text-zinc-300"
                                    >
                                        {brand}
                                        <X
                                            className="w-3 h-3 cursor-pointer hover:text-red-400"
                                            onClick={() => onBrandToggle(brand)}
                                        />
                                    </span>
                                ))}
                                {selectedTypes.slice(0, 2).map(type => (
                                    <span
                                        key={type}
                                        className="px-3 py-1 bg-blue-900/60 rounded-full text-xs flex items-center gap-1.5 text-blue-300"
                                    >
                                        {type}
                                        <X
                                            className="w-3 h-3 cursor-pointer hover:text-red-400"
                                            onClick={() => onTypeToggle(type)}
                                        />
                                    </span>
                                ))}
                                {(selectedBrands.length + selectedTypes.length) > 4 && (
                                    <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-500">
                                        +{(selectedBrands.length + selectedTypes.length) - 4} {t('filters.more')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right: Search + View Toggle */}
                        <div className="flex items-center gap-3 shrink-0">
                            {/* Animated Search */}
                            <div className="relative flex items-center">
                                <AnimatePresence mode="wait">
                                    {searchOpen ? (
                                        <motion.div
                                            key="search-input"
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 220, opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                            className="flex items-center gap-2 overflow-hidden"
                                        >
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: -20, opacity: 0 }}
                                                transition={{ delay: 0.1, duration: 0.2 }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => onSearchChange(e.target.value)}
                                                        placeholder={t('search.placeholder')}
                                                        autoFocus
                                                        className="w-44 pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-red-500 text-white placeholder-zinc-500"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSearchOpen(false)
                                                        onSearchChange('')
                                                    }}
                                                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <motion.button
                                            key="search-button"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            onClick={() => setSearchOpen(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm text-zinc-300 transition-colors"
                                        >
                                            <Search className="w-4 h-4" />
                                            {t('search.label')}
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* View Toggle */}
                            {onViewModeChange && (
                                <div className="flex items-center bg-zinc-800 rounded-lg p-1">
                                    <button
                                        onClick={() => onViewModeChange('grid')}
                                        className={cn(
                                            "p-2 rounded-md transition-all",
                                            viewMode === 'grid'
                                                ? "bg-red-700 text-white"
                                                : "text-zinc-400 hover:text-white"
                                        )}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onViewModeChange('list')}
                                        className={cn(
                                            "p-2 rounded-md transition-all",
                                            viewMode === 'list'
                                                ? "bg-red-700 text-white"
                                                : "text-zinc-400 hover:text-white"
                                        )}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Clear All */}
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-1 px-3 py-2 text-zinc-400 hover:text-white text-sm"
                                >
                                    <X className="w-4 h-4" />
                                    {t('filters.clearAll')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {/* MOBILE: Compact Header + FAB */}
            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div className="md:hidden">
                {/* Compact Mobile Header */}
                <div className="sticky top-16 z-30 px-4 mb-4">
                    <div className="flex items-center justify-between gap-3 py-3">
                        <span className="text-sm text-zinc-400">
                            {totalCount} {t('filters.items')}
                            {selectedCategory && (
                                <span className="text-zinc-500"> {t('filters.in')} <span className="text-white">{categories.find(c => c.slug === selectedCategory)?.name}</span></span>
                            )}
                        </span>

                        {/* Active filter badges */}
                        {activeFilterCount > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-red-700/20 text-red-400 rounded-full text-xs font-medium">
                                    {activeFilterCount} {t('filters.active')}
                                </span>
                                <button onClick={clearAllFilters} className="text-zinc-500">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* FAB Button */}
                <button
                    onClick={() => setMobileSheetOpen(true)}
                    className={cn(
                        "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all",
                        activeFilterCount > 0
                            ? "bg-red-700 shadow-red-700/30"
                            : "bg-white shadow-white/20"
                    )}
                >
                    <Filter className={cn(
                        "w-6 h-6",
                        activeFilterCount > 0 ? "text-zinc-900" : "text-zinc-900"
                    )} />
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-zinc-900 rounded-full text-xs font-bold flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Mobile Bottom Sheet */}
                <AnimatePresence>
                    {mobileSheetOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                                onClick={() => setMobileSheetOpen(false)}
                            />

                            {/* Sheet */}
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 rounded-t-3xl z-50 max-h-[85vh] overflow-hidden flex flex-col"
                            >
                                {/* Handle */}
                                <div className="flex justify-center py-3">
                                    <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
                                </div>

                                {/* Header */}
                                <div className="flex items-center justify-between px-6 pb-4 border-b border-zinc-800">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{t('filters.title')}</h3>
                                        <p className="text-sm text-zinc-500">{totalCount} {t('filters.items')}</p>
                                    </div>
                                    <button
                                        onClick={() => setMobileSheetOpen(false)}
                                        className="p-2 rounded-full bg-zinc-800 text-zinc-400"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                                    {/* Search */}
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">
                                            {t('search.label')}
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => onSearchChange(e.target.value)}
                                                placeholder={t('search.placeholder')}
                                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-2xl text-base focus:outline-none focus:border-red-500 text-white placeholder-zinc-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">
                                            {t('sort.options.category')}
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <MobileCategoryButton
                                                label={t('filters.all')}
                                                icon={Package}
                                                active={selectedCategory === null}
                                                onClick={() => onCategoryChange(null)}
                                            />
                                            {categories.map(cat => (
                                                <MobileCategoryButton
                                                    key={cat.id}
                                                    label={cat.name}
                                                    icon={getCategoryIcon(cat.slug)}
                                                    count={cat.productCount}
                                                    active={selectedCategory === cat.slug}
                                                    onClick={() => onCategoryChange(cat.slug)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Brands */}
                                    {brands.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                                    {t('filters.brand.label')}
                                                </label>
                                                {selectedBrands.length > 0 && (
                                                    <button
                                                        onClick={() => onBrandsChange([])}
                                                        className="text-xs text-zinc-500 hover:text-white"
                                                    >
                                                        {t('filters.clear')}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {brands.map(brand => (
                                                    <button
                                                        key={brand}
                                                        onClick={() => onBrandToggle(brand)}
                                                        className={cn(
                                                            "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                            selectedBrands.includes(brand)
                                                                ? "bg-emerald-700 text-white"
                                                                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                                                        )}
                                                    >
                                                        {brand}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Types */}
                                    {types.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                                    {t('filters.type.label')}
                                                </label>
                                                {selectedTypes.length > 0 && (
                                                    <button
                                                        onClick={() => onTypesChange([])}
                                                        className="text-xs text-zinc-500 hover:text-white"
                                                    >
                                                        {t('filters.clear')}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {types.map(type => (
                                                    <button
                                                        key={type}
                                                        onClick={() => onTypeToggle(type)}
                                                        className={cn(
                                                            "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                            selectedTypes.includes(type)
                                                                ? "bg-blue-700 text-white"
                                                                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                                                        )}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Mobile Mounts */}
                                    {mounts.length > 0 && onMountToggle && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('filters.mount.label')}</label>
                                                {selectedMounts.length > 0 && onMountsChange && (
                                                    <button onClick={() => onMountsChange([])} className="text-xs text-zinc-500 hover:text-white">{t('filters.clear')}</button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {mounts.map(mount => (
                                                    <button
                                                        key={mount}
                                                        onClick={() => onMountToggle(mount)}
                                                        className={cn(
                                                            "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                            selectedMounts.includes(mount) ? "bg-purple-700 text-white" : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                                                        )}
                                                    >
                                                        {mount}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Mobile Sensors */}
                                    {sensorSizes.length > 0 && onSensorToggle && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('filters.sensor.label')}</label>
                                                {selectedSensorSizes.length > 0 && onSensorsChange && (
                                                    <button onClick={() => onSensorsChange([])} className="text-xs text-zinc-500 hover:text-white">{t('filters.clear')}</button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {sensorSizes.map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => onSensorToggle(size)}
                                                        className={cn(
                                                            "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                            selectedSensorSizes.includes(size) ? "bg-amber-700 text-white" : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                                                        )}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Mobile Resolutions */}
                                    {resolutions.length > 0 && onResolutionToggle && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('filters.resolution.label')}</label>
                                                {selectedResolutions.length > 0 && onResolutionsChange && (
                                                    <button onClick={() => onResolutionsChange([])} className="text-xs text-zinc-500 hover:text-white">{t('filters.clear')}</button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {resolutions.map(res => (
                                                    <button
                                                        key={res}
                                                        onClick={() => onResolutionToggle(res)}
                                                        className={cn(
                                                            "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                                                            selectedResolutions.includes(res) ? "bg-red-700 text-white" : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                                                        )}
                                                    >
                                                        {res}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 border-t border-zinc-800 bg-zinc-900 space-y-3">
                                    <button
                                        onClick={() => setMobileSheetOpen(false)}
                                        className="w-full py-4 bg-red-700 text-white font-bold rounded-2xl text-lg"
                                    >
                                        {t('filters.showResults', { count: totalCount })}
                                    </button>
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="w-full py-3 bg-zinc-800 text-zinc-300 font-medium rounded-2xl"
                                        >
                                            {t('filters.clearAll')}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}

// Desktop Category Pill
function CategoryPill({
    label,
    icon: Icon,
    count,
    active,
    onClick
}: {
    label: string
    icon: React.ElementType
    count?: number
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 mx-1",
                active
                    ? "bg-red-700 text-white shadow-lg shadow-red-700/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
            {count !== undefined && (
                <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-xs",
                    active ? "bg-zinc-900/30 text-zinc-900" : "bg-zinc-800 text-zinc-500"
                )}>
                    {count}
                </span>
            )}
        </button>
    )
}

// Mobile Category Button
function MobileCategoryButton({
    label,
    icon: Icon,
    count,
    active,
    onClick
}: {
    label: string
    icon: React.ElementType
    count?: number
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all",
                active
                    ? "bg-red-700 text-white"
                    : "bg-zinc-800 text-zinc-300 border border-zinc-700"
            )}
        >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium text-center leading-tight">{label}</span>
            {count !== undefined && (
                <span className={cn(
                    "text-[10px]",
                    active ? "text-zinc-900/70" : "text-zinc-500"
                )}>
                    {count}
                </span>
            )}
        </button>
    )
}

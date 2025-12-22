/**
 * Advanced Filter Panel
 * 
 * Expandable filter sidebar with:
 * - Brand filtering
 * - Availability filtering  
 * - Type filtering (based on product specs)
 * 
 * Inspired by Panavision's filter system
 */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FilterOptions {
    brands: string[]
    availability: 'all' | 'available'
    types: string[]
}

interface FilterGroup {
    id: string
    label: string
    options: { value: string; label: string; count?: number }[]
}

interface AdvancedFiltersProps {
    availableBrands: { brand: string; count: number }[]
    selectedFilters: FilterOptions
    onFilterChange: (filters: FilterOptions) => void
    className?: string
}

export function AdvancedFilters({
    availableBrands,
    selectedFilters,
    onFilterChange,
    className,
}: AdvancedFiltersProps) {
    const [expandedGroups, setExpandedGroups] = useState<string[]>(['brands'])
    const [isOpen, setIsOpen] = useState(false)

    const toggleGroup = (groupId: string) => {
        setExpandedGroups((prev) =>
            prev.includes(groupId)
                ? prev.filter((id) => id !== groupId)
                : [...prev, groupId]
        )
    }

    const toggleBrand = (brand: string) => {
        const newBrands = selectedFilters.brands.includes(brand)
            ? selectedFilters.brands.filter((b) => b !== brand)
            : [...selectedFilters.brands, brand]

        onFilterChange({ ...selectedFilters, brands: newBrands })
    }

    const setAvailability = (availability: 'all' | 'available') => {
        onFilterChange({ ...selectedFilters, availability })
    }

    const clearFilters = () => {
        onFilterChange({ brands: [], availability: 'all', types: [] })
    }

    const hasActiveFilters =
        selectedFilters.brands.length > 0 ||
        selectedFilters.availability !== 'all' ||
        selectedFilters.types.length > 0

    const filterGroups: FilterGroup[] = [
        {
            id: 'brands',
            label: 'Manufacturer',
            options: availableBrands.map(({ brand, count }) => ({
                value: brand,
                label: brand,
                count,
            })),
        },
        {
            id: 'availability',
            label: 'Availability',
            options: [
                { value: 'all', label: 'All Equipment' },
                { value: 'available', label: 'Available Now' },
            ],
        },
    ]

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl',
                    'bg-zinc-900/50 border border-zinc-800/50',
                    'text-zinc-300 font-medium text-sm',
                    'hover:bg-zinc-900/70 hover:border-zinc-700',
                    'transition-all duration-200',
                    className
                )}
            >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                        {selectedFilters.brands.length}
                    </span>
                )}
            </button>

            {/* Desktop Filters + Mobile Drawer */}
            <AnimatePresence>
                {(isOpen || typeof window === 'undefined') && (
                    <>
                        {/* Mobile Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/50 z-40"
                        />

                        {/* Filter Panel */}
                        <motion.div
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={cn(
                                'fixed md:relative inset-y-0 left-0 z-50',
                                'w-80 md:w-auto',
                                'bg-zinc-950 md:bg-transparent',
                                'border-r md:border-none border-zinc-800',
                                'overflow-y-auto',
                                'p-6 md:p-0',
                                className
                            )}
                        >
                            {/* Mobile Header */}
                            <div className="md:hidden flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white">Filters</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-zinc-900 transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            {/* Filter Groups */}
                            <div className="space-y-4">
                                {filterGroups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden"
                                    >
                                        {/* Group Header */}
                                        <button
                                            onClick={() => toggleGroup(group.id)}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-900/70 transition-colors"
                                        >
                                            <span className="text-sm font-semibold text-white">
                                                {group.label}
                                            </span>
                                            <motion.div
                                                animate={{ rotate: expandedGroups.includes(group.id) ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDown className="w-4 h-4 text-zinc-400" />
                                            </motion.div>
                                        </button>

                                        {/* Group Options */}
                                        <AnimatePresence>
                                            {expandedGroups.includes(group.id) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="border-t border-zinc-800/50"
                                                >
                                                    <div className="p-3 space-y-2">
                                                        {group.id === 'brands' ? (
                                                            // Brand checkboxes
                                                            group.options.map((option) => (
                                                                <label
                                                                    key={option.value}
                                                                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer group transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedFilters.brands.includes(option.value)}
                                                                            onChange={() => toggleBrand(option.value)}
                                                                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                                                        />
                                                                        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                                                            {option.label}
                                                                        </span>
                                                                    </div>
                                                                    {option.count !== undefined && (
                                                                        <span className="text-xs text-zinc-500">
                                                                            {option.count}
                                                                        </span>
                                                                    )}
                                                                </label>
                                                            ))
                                                        ) : group.id === 'availability' ? (
                                                            // Availability radio buttons
                                                            group.options.map((option) => (
                                                                <label
                                                                    key={option.value}
                                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer group transition-colors"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name="availability"
                                                                        value={option.value}
                                                                        checked={selectedFilters.availability === option.value}
                                                                        onChange={() => setAvailability(option.value as 'all' | 'available')}
                                                                        className="w-4 h-4 border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                                                    />
                                                                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                                                        {option.label}
                                                                    </span>
                                                                </label>
                                                            ))
                                                        ) : null}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <motion.button
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={clearFilters}
                                    className={cn(
                                        'mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl',
                                        'bg-zinc-900/50 border border-zinc-800/50',
                                        'text-zinc-300 font-medium text-sm',
                                        'hover:bg-zinc-900/70 hover:border-zinc-700 hover:text-white',
                                        'transition-all duration-200'
                                    )}
                                >
                                    <X className="w-4 h-4" />
                                    Clear All Filters
                                </motion.button>
                            )}

                            {/* Mobile Apply Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'md:hidden mt-6 w-full px-4 py-3 rounded-xl',
                                    'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
                                    'border border-purple-500/30',
                                    'text-white font-semibold',
                                    'hover:from-purple-500/30 hover:to-pink-500/30',
                                    'transition-all duration-200'
                                )}
                            >
                                Apply Filters
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

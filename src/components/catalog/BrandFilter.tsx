/**
 * Brand Filter Component
 * 
 * Quick brand filter chips for common manufacturers
 */
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BrandFilterProps {
    brands: string[]
    selectedBrands: string[]
    onBrandToggle: (brand: string) => void
    className?: string
}

export function BrandFilter({
    brands,
    selectedBrands,
    onBrandToggle,
    className,
}: BrandFilterProps) {
    if (brands.length === 0) return null

    return (
        <div className={cn('flex flex-nowrap gap-2', className)}>
            {brands.map((brand) => {
                const isSelected = selectedBrands.includes(brand)

                return (
                    <motion.button
                        key={brand}
                        onClick={() => onBrandToggle(brand)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            'px-2 py-1 text-sm font-medium transition-all duration-200',
                            isSelected
                                ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                                : 'text-zinc-500 hover:text-zinc-300'
                        )}
                    >
                        {brand}
                    </motion.button>
                )
            })}
        </div >
    )
}

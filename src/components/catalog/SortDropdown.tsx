/**
 * Sort Dropdown Component
 * 
 * Allows users to sort products by:
 * - Name (A-Z)
 * - Featured first
 * - Category
 */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SortOption = 'name' | 'featured' | 'category'

interface SortDropdownProps {
    value: SortOption
    onChange: (value: SortOption) => void
    className?: string
    t: (key: string) => string
}

export function SortDropdown({ value, onChange, className, t }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)

    const sortOptions = [
        { value: 'name' as const, label: t('sort.options.name') },
        { value: 'featured' as const, label: t('sort.options.featured') },
        { value: 'category' as const, label: t('sort.options.category') },
    ]

    const currentOption = sortOptions.find(opt => opt.value === value)

    return (
        <div className={cn('relative', className)}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap',
                    'bg-zinc-900/50 border border-zinc-800/50',
                    'text-zinc-300 font-medium text-sm',
                    'hover:bg-zinc-900/70 hover:border-zinc-700 hover:text-white',
                    'transition-all duration-200',
                    isOpen && 'bg-zinc-900/70 border-zinc-700'
                )}
            >
                <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[8rem] truncate">{currentOption?.label}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                >
                    <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className={cn(
                                'absolute right-0 top-full mt-2 z-[100]',
                                'w-48 py-2 rounded-lg',
                                'bg-zinc-900/95 backdrop-blur-xl',
                                'border border-zinc-800/50',
                                'shadow-2xl'
                            )}
                        >
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={cn(
                                        'w-full px-4 py-2.5 text-left text-sm',
                                        'transition-colors duration-150',
                                        value === option.value
                                            ? 'bg-purple-500/10 text-white font-semibold'
                                            : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

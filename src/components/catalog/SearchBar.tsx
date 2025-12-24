/**
 * Enhanced SearchBar Component
 * 
 * Refined search with:
 * - Larger, more prominent design
 * - Better focus states
 * - Animated search icon
 * - Clear button with animation
 * 
 * Design: Cinema-grade with attention to detail
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search equipment...',
  debounceMs = 300,
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounced onChange
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, value, onChange, debounceMs])

  const handleClear = useCallback(() => {
    setLocalValue('')
    onChange('')
  }, [onChange])

  return (
    <div className={cn('relative group', className)}>
      {/* Search Icon - Animated */}
      <motion.div
        animate={{
          scale: isFocused ? 1.1 : 1,
          rotate: isFocused ? 90 : 0
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
      >
        <Search className={cn(
          'w-5 h-5 transition-colors duration-200',
          isFocused || localValue
            ? 'text-zinc-300'
            : 'text-zinc-500 group-hover:text-zinc-400'
        )} />
      </motion.div>

      {/* Input Field */}
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          'w-full py-3.5 pl-12 pr-12 text-sm font-medium',
          'bg-zinc-900/50 border rounded-lg',
          'text-zinc-100 placeholder:text-zinc-500',
          'transition-all duration-300',
          // Default state
          'border-zinc-800/50',
          // Hover state
          'hover:bg-zinc-900/70 hover:border-zinc-700',
          // Focus state
          'focus:outline-none focus:bg-zinc-900 focus:border-zinc-600',
          'focus:ring-2 focus:ring-zinc-600/20',
          // With value
          localValue && 'bg-zinc-900/70 border-zinc-700'
        )}
      />

      {/* Focus Ring Effect */}
      <div className={cn(
        'absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300',
        'bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5',
        isFocused ? 'opacity-100' : 'opacity-0'
      )} />

      {/* Clear Button - Animated */}
      <AnimatePresence>
        {localValue && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            transition={{ duration: 0.2 }}
            onClick={handleClear}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 z-10',
              'p-1.5 rounded-lg',
              'bg-zinc-800/50 hover:bg-zinc-700',
              'text-zinc-400 hover:text-zinc-200',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-zinc-600'
            )}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

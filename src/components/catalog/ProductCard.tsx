/**
 * ProductCard Component
 * 
 * Displays a product in the equipment catalog grid.
 * Cinema-grade visual design with hover animations.
 * 
 * CLIENT REQUIREMENT: ALL products must show Quantity + Add button.
 * Cameras and kits additionally show Gear icon for builder/accessories.
 * 
 * Design Archetype: Luxury/Editorial + Dark Cinema
 * Primary Font: System (inherits from layout)
 * Palette: Dark backgrounds, warm accents, subtle gradients
 */
'use client'

import { useState, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ShoppingCart, Pencil, Package } from 'lucide-react'
import { Product } from '@/services/products/types'
import { cn } from '@/lib/utils'
import { useCartStore, useUIStore } from '@/stores'

interface ProductCardProps {
  product: Product
  lng: string
  className?: string
}

const fadeInBlur = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  }
}

export function ProductCard({ product, lng, className }: ProductCardProps) {
  const {
    name,
    slug,
    imageUrl,
    category,
  } = product

  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useUIStore((state) => state.addToast)

  const productUrl = `/${lng}/equipment/${slug}`

  // Enhanced camera detection
  const cameraKeywords = [
    'camera', 'caméra',
    'arri', 'alexa', 'amira',
    'red', 'raptor', 'komodo', 'ranger', 'v-raptor',
    'sony fx', 'sony a7', 'sony venice', 'burano',
    'blackmagic', 'ursa', 'bmpcc', 'pocket cinema',
    'canon c', 'c70', 'c300', 'c500',
    'panasonic', 'varicam', 'eva1'
  ];

  const lowerName = name.toLowerCase();
  const lowerSlug = slug.toLowerCase();
  const lowerCatName = category?.name?.toLowerCase() || '';
  const lowerCatSlug = category?.slug?.toLowerCase() || '';

  const isCamera =
    lowerCatSlug === 'cameras' ||
    lowerCatName.includes('camera') ||
    cameraKeywords.some(keyword =>
      lowerName.includes(keyword) ||
      lowerSlug.includes(keyword)
    );

  // Show Builder/Accessories button for cameras and kits only
  const showBuilderButton =
    isCamera ||
    product.is_kit === true ||
    category?.slug === 'cameras'

  const handleQuantityChange = (e: MouseEvent, delta: number) => {
    e.preventDefault()
    e.stopPropagation()
    const newQty = Math.max(1, quantity + delta)
    setQuantity(newQty)
  }

  const handleQuickAdd = async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)

    // Placeholder dates - will be set at checkout
    const placeholderDates = { start: '', end: '' }
    addItem(product, quantity, placeholderDates)

    addToast({
      type: 'success',
      message: `${product.name} added to quote`,
    })

    setTimeout(() => setIsAdding(false), 300)
  }

  return (
    <Link href={productUrl} className="group block h-full">
      <motion.div
        variants={fadeInBlur}
        initial="hidden"
        animate="visible"
        className={cn(
          'relative h-full flex flex-col bg-zinc-900/50 rounded-2xl border border-zinc-800',
          'hover:border-zinc-700 transition-all duration-300',
          'overflow-hidden',
          className
        )}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-zinc-900">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={false}
              unoptimized={imageUrl.includes('127.0.0.1') || imageUrl.includes('localhost')}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center">
                <Package className="w-10 h-10 text-zinc-600" />
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Category */}
          {category && (
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              {category.name}
            </span>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-white line-clamp-2 leading-tight min-h-[3rem]">
            {name}
          </h3>

          {/* Brand (if available) */}
          {product.brand && (
            <p className="text-sm text-zinc-400">
              {product.brand}
            </p>
          )}

          {/* Actions - ALL PRODUCTS get Quantity + Add */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 w-full">
              {/* Quantity Control */}
              <div className="flex items-center bg-zinc-900 rounded-md border border-zinc-800">
                <button
                  onClick={(e) => handleQuantityChange(e, -1)}
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-white">{quantity}</span>
                <button
                  onClick={(e) => handleQuantityChange(e, 1)}
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleQuickAdd}
                disabled={isAdding}
                className={cn(
                  'flex items-center justify-center gap-1.5 px-3 py-2 rounded-md transition-colors flex-1',
                  'bg-white text-zinc-950 text-sm font-medium hover:bg-zinc-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                title="Add to cart"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </button>

              {/* Accessories/Builder Button - Only for cameras/kits */}
              {showBuilderButton && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.location.href = `${productUrl}?view=builder`
                  }}
                  className={cn(
                    'flex items-center justify-center p-2 rounded-md transition-colors',
                    'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white',
                    'border border-zinc-700'
                  )}
                  title="Build kit with accessories"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

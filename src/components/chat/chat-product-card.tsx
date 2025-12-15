/**
 * Chat Product Card
 * 
 * Compact product card for display in chat responses.
 * Shows product info with quick actions.
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, ExternalLink, Check } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/stores'

interface ChatProduct {
    id: string
    name: string
    slug: string
    category?: string
    description?: string
    imageUrl?: string
    isAvailable?: boolean
}

interface ChatProductCardProps {
    product: ChatProduct
    lng?: string
}

export function ChatProductCard({ product, lng = 'en' }: ChatProductCardProps) {
    const [added, setAdded] = useState(false)
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        // Create a minimal Product-compatible object
        // We cast via unknown since we don't have all Product fields from the chat
        const productData = {
            id: product.id,
            name: product.name,
            nameEn: product.name,
            nameFr: product.name,
            slug: product.slug,
            description: product.description || '',
            descriptionEn: product.description || '',
            descriptionFr: product.description || '',
            category: product.category || '',
            categoryId: '', // Chat doesn't have this - will be resolved on product page
            imageUrl: product.imageUrl || '',
            isAvailable: product.isAvailable ?? true,
        }

        // Empty dates - user will set in quote flow
        const defaultDates = {
            start: '',
            end: '',
        }

        // Cast through unknown to allow partial Product
        addItem(productData as unknown as Parameters<typeof addItem>[0], 1, defaultDates)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:bg-zinc-800 transition-colors"
        >
            {/* Product Image */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
                {product.category && (
                    <p className="text-xs text-zinc-400 truncate">{product.category}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                    {product.isAvailable ? (
                        <span className="text-xs text-green-400">● In Stock</span>
                    ) : (
                        <span className="text-xs text-amber-400">● Check Availability</span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Link
                    href={`/${lng}/equipment/${product.slug}`}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                    title="View Details"
                >
                    <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`p-2 rounded-lg transition-all ${added
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        }`}
                    title={added ? 'Added!' : 'Add to Quote'}
                >
                    {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
            </div>
        </motion.div>
    )
}

// Carousel for multiple products
interface ChatProductCarouselProps {
    products: ChatProduct[]
    lng?: string
}

export function ChatProductCarousel({ products, lng }: ChatProductCarouselProps) {
    if (products.length === 0) {
        return (
            <div className="p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-lg text-center">
                <p className="text-sm text-zinc-400">No equipment found. Try a different search term.</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {products.slice(0, 4).map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <ChatProductCard product={product} lng={lng} />
                </motion.div>
            ))}
            {products.length > 4 && (
                <p className="text-xs text-center text-zinc-500 pt-1">
                    +{products.length - 4} more results
                </p>
            )}
        </div>
    )
}

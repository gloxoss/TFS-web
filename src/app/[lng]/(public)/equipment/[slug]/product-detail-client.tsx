/**
 * Product Detail Client Component - DUAL LAYOUT
 * 
 * Two distinct layouts based on whether product triggers a kit:
 * 
 * 1. STANDARD LAYOUT: Simple products (tripods, accessories)
 *    - Image + Description + Specs + Add to Quote
 * 
 * 2. KIT LAYOUT: Camera packages with configurable components
 *    - Hero section with camera image
 *    - EQUIPMENT MANIFEST table as main focus
 *    - Each slot shows: Name, Selected Item(s), Edit/Add More button
 *    - Compact Add to Quote section
 * 
 * CATALOG MODE: No pricing, no dates, no stock numbers.
 * 
 * Design Archetype: Dark Cinema / Luxury Editorial
 * Fonts: Space Grotesk headings, neutral body
 * Palette: zinc-950 base, amber accents for kits
 */
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  AlertCircle,
  Package,
  Camera,
  Layers,
  Edit3,
  Plus,
  X,
  Search,
  LayoutGrid,
  List,
  Minus,
  ExternalLink,
  Info,
  Trash2
} from 'lucide-react'
import { Product } from '@/services/products/types'
import { ResolvedKit } from '@/types/commerce'
import { useCartStore, useUIStore, KitDetailItem, useKitStore } from '@/stores'
import { cn } from '@/lib/utils'
import { resolveKit } from '@/lib/actions/cart'

// ============================================================================
// ANIMATION VARIANTS - Staggered fade-in with blur
// ============================================================================

const fadeInBlur = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
}

const fadeInBlurFast = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 12 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }
  }
}

// ============================================================================
// TYPES
// ============================================================================




// Mock kit data for cameras when DB returns empty
interface MockKitItem {
  id: string
  name: string
  category?: string
  imageUrl?: string
}

interface MockKitSlot {
  slotName: string
  selectionMode: 'single' | 'multi'
  items: MockKitItem[]
  defaultSelected: string[]
}

// ============================================================================
// MOCK DATA (fallback when kit_templates empty)
// ============================================================================

const MOCK_CAMERA_KIT: MockKitSlot[] = [
  {
    slotName: 'Lens Mount',
    selectionMode: 'single',
    items: [
      { id: 'lens-1', name: 'Sony 24-70mm f/2.8 GM II', category: 'Zoom', imageUrl: '/images/equipment/lens-24-70.jpg' },
      { id: 'lens-2', name: 'Sony 70-200mm f/2.8 GM II', category: 'Telephoto', imageUrl: '/images/equipment/lens-70-200.jpg' },
      { id: 'lens-3', name: 'Sony 50mm f/1.2 GM', category: 'Prime', imageUrl: '/images/equipment/lens-50.jpg' },
    ],
    defaultSelected: ['lens-1'],
  },
  {
    slotName: 'Power Solution',
    selectionMode: 'multi',
    items: [
      { id: 'bat-1', name: 'V-Mount Battery 150Wh', category: 'Battery', imageUrl: '/images/equipment/v-mount.jpg' },
      { id: 'bat-2', name: 'BP-A60 Battery Pack (×2)', category: 'Battery', imageUrl: '/images/equipment/bp-a60.jpg' },
      { id: 'bat-3', name: 'D-Tap Power Cable', category: 'Accessory', imageUrl: '/images/equipment/d-tap.jpg' },
    ],
    defaultSelected: ['bat-1', 'bat-3'],
  },
  {
    slotName: 'Media & Storage',
    selectionMode: 'multi',
    items: [
      { id: 'media-1', name: 'CFexpress Type B 512GB (×2)', category: 'Media', imageUrl: '/images/equipment/cfexpress.jpg' },
      { id: 'media-2', name: 'CFexpress Card Reader', category: 'Accessory', imageUrl: '/images/equipment/card-reader.jpg' },
    ],
    defaultSelected: ['media-1', 'media-2'],
  },
  {
    slotName: 'Monitoring',
    selectionMode: 'single',
    items: [
      { id: 'mon-1', name: 'SmallHD Cine 7" Monitor', category: 'Monitor', imageUrl: '/images/equipment/smallhd-7.jpg' },
      { id: 'mon-2', name: 'Atomos Ninja V+ 5"', category: 'Monitor/Recorder', imageUrl: '/images/equipment/atomos-ninja.jpg' },
    ],
    defaultSelected: ['mon-1'],
  },
  {
    slotName: 'Support & Rigging',
    selectionMode: 'multi',
    items: [
      { id: 'rig-1', name: 'Wooden Camera Base Kit', category: 'Cage', imageUrl: '/images/equipment/wooden-cage.jpg' },
      { id: 'rig-2', name: 'Top Handle with NATO Rail', category: 'Handle', imageUrl: '/images/equipment/top-handle.jpg' },
      { id: 'rig-3', name: 'Follow Focus System', category: 'Focus', imageUrl: '/images/equipment/follow-focus.jpg' },
    ],
    defaultSelected: ['rig-1', 'rig-2'],
  },
]

// ============================================================================
// HELPER: Check if product is camera category
// ============================================================================

function isCameraProduct(product: Product): boolean {
  const categorySlug = product.category?.slug?.toLowerCase() || ''
  const categoryName = product.category?.name?.toLowerCase() || ''
  const productName = product.name.toLowerCase()

  // Exclude non-camera categories explicitly
  const excludedCategories = ['lighting', 'light', 'grip', 'audio', 'accessories', 'support', 'monitor']
  const isExcludedCategory = excludedCategories.some(cat =>
    categorySlug.includes(cat) || categoryName.includes(cat)
  )

  if (isExcludedCategory) {
    return false
  }

  // Check for camera-specific terms
  const isCameraCategory = categorySlug.includes('camera') || categoryName.includes('camera')

  // Check for specific camera model names (more precise matching)
  const cameraModelPatterns = [
    'camera',
    // Sony cameras
    'fx6', 'fx3', 'fx30', 'fx9',  // Sony FX series
    'a7s', 'a7r', 'a7 iii', 'a7 iv', 'a7c', 'a9', 'a1', 'a6', // Sony Alpha series
    'venice', 'burano',  // Sony Cinema Line
    // RED cameras
    'komodo', 'red v-raptor', 'red ranger', 'red dsmc',
    // ARRI cameras (not ARRI lights)
    'alexa', 'amira', 'arri 35', 'arriflex',
    // Canon Cinema EOS
    'c70', 'c300', 'c500', 'c200', 'eos r5 c', 'eos r3',
    // Blackmagic cameras
    'bmpcc', 'blackmagic pocket', 'ursa',
    // Panasonic cinema cameras
    'varicam', 'eva1', 'gh6', 'gh5s',
  ]

  const matchesCameraModel = cameraModelPatterns.some(pattern => productName.includes(pattern))

  return isCameraCategory || matchesCameraModel
}

// ============================================================================
// LOADING SKELETON COMPONENT
// ============================================================================

function ProductDetailSkeleton({ isKit = false }: { isKit?: boolean }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-700/5 via-transparent to-zinc-900/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back link skeleton */}
        <div className="h-5 w-32 bg-zinc-800/50 rounded animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className={cn(
          "grid gap-8 items-start",
          isKit ? "lg:grid-cols-5" : "lg:grid-cols-2"
        )}>
          {/* Image skeleton */}
          <div className={isKit ? "lg:col-span-2" : ""}>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/30 to-transparent skeleton-shimmer" />
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-24 h-24 text-zinc-800 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className={cn("flex flex-col gap-4", isKit ? "lg:col-span-3" : "")}>
            <div className="h-10 w-3/4 bg-zinc-800/50 rounded-lg animate-pulse" />
            <div className="h-6 w-1/2 bg-zinc-800/30 rounded animate-pulse" />
            <div className="space-y-2 mt-4">
              <div className="h-4 w-full bg-zinc-800/30 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-zinc-800/30 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-zinc-800/30 rounded animate-pulse" />
            </div>

            {isKit && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
                    <div className="w-6 h-6 bg-zinc-800/50 rounded mx-auto mb-2 animate-pulse" />
                    <div className="h-8 w-12 bg-zinc-800/50 rounded mx-auto mb-1 animate-pulse" />
                    <div className="h-3 w-16 bg-zinc-800/30 rounded mx-auto animate-pulse" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isKit && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-zinc-800/30 rounded-lg">
              <Layers className="w-6 h-6 text-zinc-700" />
            </div>
            <div>
              <div className="h-7 w-48 bg-zinc-800/50 rounded animate-pulse" />
              <div className="h-4 w-64 bg-zinc-800/30 rounded mt-1 animate-pulse" />
            </div>
          </div>

          {/* Slot skeletons */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900/30 rounded-2xl border border-zinc-800 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/50 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 animate-pulse" />
                    <div>
                      <div className="h-5 w-32 bg-zinc-800/50 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-zinc-800/30 rounded mt-1 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-9 w-20 bg-zinc-800/50 rounded-lg animate-pulse" />
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[1, 2].map((j) => (
                    <div key={j} className="bg-zinc-800/30 rounded-xl aspect-square animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-full px-6 py-3 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-zinc-600 border-t-red-500 rounded-full animate-spin" />
        <span className="text-sm text-zinc-400">Loading equipment details...</span>
      </div>

      {/* Shimmer animation style */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// TYPES
// ============================================================================

export interface SlotDisplayData {
  slotName: string
  selectionMode: 'single' | 'multi'
  items: {
    id: string
    name: string
    slug?: string
    category?: string
    imageUrl?: string
  }[]
  selectedIds: string[]
}

interface ProductDetailClientProps {
  product: Product
  lng: string
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

// Main Component
export function ProductDetailClient({ product, lng }: ProductDetailClientProps) {
  const addItem = useCartStore((state) => state.addItem)
  const openCartDrawer = useUIStore((state) => state.openCartDrawer)
  const addToast = useUIStore((state) => state.addToast)

  // Kit Store Hook
  const { selections, setSelections, updateSlotSelection, clearSelections, viewPreference, setViewPreference } = useKitStore()

  // Get selections for this specific product or empty object
  const kitSelections = selections[product.id] || {}

  // Page ready state - prevents 404 flicker
  const [isPageReady, setIsPageReady] = useState(false)

  // Simple state - no dates (dates are set at checkout)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  // Kit state - Resolved Template
  const [resolvedKit, setResolvedKit] = useState<ResolvedKit | null>(null)
  const [isLoadingKit, setIsLoadingKit] = useState(true)

  // Mock kit state (fallback for cameras)
  const [useMockKit, setUseMockKit] = useState(false)
  const [mockSelections, setMockSelections] = useState<Record<string, string[]>>({})

  // Slot editing modal state
  const [editingSlot, setEditingSlot] = useState<string | null>(null)

  // Check for kit on mount
  useEffect(() => {
    async function loadKit() {
      try {
        console.log('[KIT DEBUG] Loading kit for product:', product.id, product.name);
        const result = await resolveKit(product.id)

        if (result.success && result.kit && result.kit.slots.length > 0) {
          console.log('[KIT DEBUG] Setting resolvedKit with', result.kit.slots.length, 'slots');
          setResolvedKit(result.kit)

          // Only initialize defaults if NO persisted selections exist in store
          if (!selections[product.id] || Object.keys(selections[product.id]).length === 0) {
            const defaultSelections: Record<string, string[]> = {}
            for (const slot of result.kit.slots) {
              // KitItem has product_id, not id
              defaultSelections[slot.slotName] = slot.defaultItems.map(item => item.product_id)
            }
            // Save defaults to global store
            setSelections(product.id, defaultSelections)
          }
        }
      } catch (error) {
        console.error('Failed to load kit:', error)
      } finally {
        setIsLoadingKit(false)
        setTimeout(() => setIsPageReady(true), 100)
      }
    }
    loadKit()
  }, [product.id, product, setSelections, selections]) // Removed kitSelections from dep to prevent loop

  // Handle add to cart - UNBUNDLED VERSION
  const handleAddToCart = useCallback(async () => {
    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const placeholderDates = { start: '', end: '' }

    // 1. Add the MAIN PRODUCT (Camera Body)
    // We add it first as the "anchor" of the kit
    addItem(product, quantity, placeholderDates)

    // Use stored selections
    const selectionsToUse = resolvedKit ? kitSelections : (useMockKit ? mockSelections : undefined)

    if (resolvedKit && selectionsToUse) {
      // REAL KIT: Iterate through all slots and find selected items
      resolvedKit.slots.forEach(slot => {
        const selectedIds = selectionsToUse[slot.slotName] || []

        // Count occurrences of each ID to handle quantity
        // e.g. ['bat-1', 'bat-1', 'bat-2'] -> { 'bat-1': 2, 'bat-2': 1 }
        const idCounts: Record<string, number> = {}
        selectedIds.forEach(id => {
          idCounts[id] = (idCounts[id] || 0) + 1
        })

        // Iterate unique IDs and add them to cart with calculated quantity
        Object.entries(idCounts).forEach(([id, count]) => {
          // Find the full Product option
          const itemProduct = slot.availableOptions.find(opt => opt.id === id) || slot.defaultItems.find(def => def.product_id === id)

          if (itemProduct) {
            // Add accessory as individual item
            // Multiply by main kit quantity (e.g. 2 Cameras -> 2 sets of accessories)
            const totalQuantity = count * quantity
            addItem(itemProduct, totalQuantity, placeholderDates)
          }
        })
      })
    } else if (useMockKit && selectionsToUse) {
      // MOCK KIT: Fallback logic for demo
      MOCK_CAMERA_KIT.forEach(slot => {
        const selectedIds = selectionsToUse[slot.slotName] || []

        const idCounts: Record<string, number> = {}
        selectedIds.forEach(id => {
          idCounts[id] = (idCounts[id] || 0) + 1
        })

        Object.entries(idCounts).forEach(([id, count]) => {
          const item = slot.items.find(i => i.id === id)

          if (item) {
            // Construct a "fake" Product object for the mock item
            const mockProduct: Product = {
              id: item.id,
              name: item.name,
              // Fallback values for required Product fields
              nameEn: item.name,
              nameFr: item.name,
              slug: item.id, // Mock items don't have real slugs usually
              categoryId: 'mock-category',
              category: { id: 'mock', name: item.category || 'Accessory', slug: 'accessory' },
              isAvailable: true,
              imageUrl: item.imageUrl
            }

            const totalQuantity = count * quantity
            addItem(mockProduct, totalQuantity, placeholderDates)
          }
        })
      })
    }

    // Client Requirement: "The application MUST preserve the state... (on navigation)"
    // But usually on "Add to Cart", reset is standard. However, allow re-adding same config? 
    // Let's keep it for now to be safe, user can manually change if they want another kit.
    clearSelections(product.id)

    const itemLabel = (resolvedKit || useMockKit) ? `${product.name} + Accessories` : product.name
    addToast({
      type: 'success',
      message: `${itemLabel} added to your quote request`,
    })

    setIsAdding(false)
    openCartDrawer()
  }, [product, quantity, addItem, addToast, openCartDrawer, resolvedKit, kitSelections, useMockKit, mockSelections, clearSelections])

  // ... (isCameraProduct helper usage)
  const hasKit = resolvedKit || useMockKit
  const isCamera = isCameraProduct(product)

  // ... (SlotDisplayItem types)

  // Get current slot data (either from real kit or mock)
  const getSlotData = useCallback((): SlotDisplayData[] => {
    if (resolvedKit) {
      return resolvedKit.slots.map(slot => ({
        slotName: slot.slotName,
        selectionMode: slot.allowMultiple ? 'multi' as const : 'single' as const,
        items: slot.availableOptions.map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category?.name,
          imageUrl: product.imageUrl
        })),
        // Read from STORE selections
        selectedIds: kitSelections[slot.slotName] || [], // Default to empty if logic hasn't run yet
      }))
    }
    if (useMockKit) {
      return MOCK_CAMERA_KIT.map(slot => ({
        slotName: slot.slotName,
        selectionMode: slot.selectionMode,
        items: slot.items,
        selectedIds: mockSelections[slot.slotName] || slot.defaultSelected,
      }))
    }
    return []
  }, [resolvedKit, useMockKit, kitSelections, mockSelections])

  // ... (getItemDetails)

  // Helper to get item details for display
  const getItemDetails = useCallback((slotName: string, itemId: string) => {
    if (resolvedKit) {
      const slot = resolvedKit.slots.find(s => s.slotName === slotName)
      if (!slot) return null
      // Try finding in available options first (full product data)
      const option = slot.availableOptions.find(opt => opt.id === itemId)
      if (option) return option

      // Fallback to default items if not found (though defaults should be options)
      // Note: defaultItems might be lighter objects, but for now returned undefined if not in options
      return null
    }
    if (useMockKit) {
      const slot = MOCK_CAMERA_KIT.find(s => s.slotName === slotName)
      if (!slot) return null
      return slot.items.find(i => i.id === itemId)
    }
    return null
  }, [resolvedKit, useMockKit])

  // Handle slot selection update VIA STORE
  const handleSlotUpdate = useCallback((slotName: string, selectedIds: string[]) => {
    if (resolvedKit) {
      // Update global store
      updateSlotSelection(product.id, slotName, selectedIds)
    } else if (useMockKit) {
      setMockSelections(prev => ({ ...prev, [slotName]: selectedIds }))
    }
    setEditingSlot(null)
  }, [resolvedKit, useMockKit, product.id, updateSlotSelection])

  // Navigation Confirmation State
  const { skipNavigationConfirm, setSkipNavigationConfirm } = useKitStore()
  const [navConfirmUrl, setNavConfirmUrl] = useState<string | null>(null)
  const [dontAskAgain, setDontAskAgain] = useState(false)

  // Handle Item Navigation Click
  const handleItemNavClick = (url: string) => {
    if (skipNavigationConfirm) {
      window.location.href = url
    } else {
      setNavConfirmUrl(url)
      setDontAskAgain(false)
    }
  }

  const handleConfirmNav = () => {
    if (dontAskAgain) {
      setSkipNavigationConfirm(true)
    }
    if (navConfirmUrl) {
      window.location.href = navConfirmUrl
    }
    setNavConfirmUrl(null)
  }

  // Handle Quantity Change for Kit Item
  const handleItemQuantity = (slotName: string, itemId: string, change: number, currentSelectedIds: string[]) => {
    let newSelectedIds = [...currentSelectedIds]

    if (change > 0) {
      // Add one more of this ID
      newSelectedIds.push(itemId)
    } else {
      // Remove one instance of this ID
      // Find the LAST instance to remove (arbitrary, but standard)
      const index = newSelectedIds.lastIndexOf(itemId)
      if (index > -1) {
        newSelectedIds.splice(index, 1)
      }
    }

    // Update store
    if (resolvedKit) {
      updateSlotSelection(product.id, slotName, newSelectedIds)
    } else if (useMockKit) {
      setMockSelections(prev => ({ ...prev, [slotName]: newSelectedIds }))
    }
  }

  // ============================================================================
  // RENDER: KIT LAYOUT (Cameras / Complex Products)
  // ============================================================================

  if (hasKit || isCamera) {
    const slotData = getSlotData()

    // Show loading skeleton until page is ready
    if (!isPageReady) {
      return <ProductDetailSkeleton isKit={true} />
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="kit-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-zinc-950"
        >
          {/* Navigation Confirmation Dialog */}
          {navConfirmUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Leave Kit Builder?</h3>
                </div>

                <p className="text-zinc-400 mb-6 leading-relaxed">
                  You are about to navigate to the product page. This will not clear your current kit selections, but you will leave this builder view.
                </p>

                <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setDontAskAgain(!dontAskAgain)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${dontAskAgain ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600 bg-zinc-800'}`}>
                    {dontAskAgain && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-sm text-zinc-300 select-none">Don't show this again</span>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setNavConfirmUrl(null)}
                    className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmNav}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
                  >
                    Continue to Product
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back Navigation */}
          <motion.div
            variants={fadeInBlur}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6"
          >
            <Link
              href={`/${lng}/equipment`}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </Link>
          </motion.div>

          {/* Hero Section - Camera + Title */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid lg:grid-cols-5 gap-8 items-start"
            >
              {/* Camera Image - Dynamic sizing */}
              <motion.div variants={fadeInBlur} className="lg:col-span-2 flex justify-center">
                <div className="relative inline-block rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="block h-auto max-h-[400px] max-w-full object-contain"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center">
                      <Camera className="w-24 h-24 text-zinc-700" />
                    </div>
                  )}
                  {/* Category Badge */}
                  {product.category && (
                    <span className="absolute top-4 left-4 px-3 py-1.5 text-sm font-medium bg-zinc-900/80 backdrop-blur-sm text-zinc-300 rounded-lg border border-zinc-700/50">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Title + Description + Quick Info */}
              <motion.div variants={fadeInBlur} className="lg:col-span-3 flex flex-col">
                <div className="mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {product.name}
                  </h1>
                  <p className="text-zinc-400 text-lg">
                    {resolvedKit?.template.name || 'Complete Cinema Package'}
                  </p>
                </div>

                {product.description && (
                  <p className="text-zinc-400 leading-relaxed mb-6">
                    {product.description.replace(/<[^>]*>/g, '')}
                  </p>
                )}

                {/* Camera Specifications */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="mt-6"
                >
                  <motion.div variants={fadeInBlurFast} className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-5">
                    <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">Camera Specifications</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {product.specifications && Object.entries(product.specifications).slice(0, 8).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-zinc-800/50 pb-2">
                          <span className="text-xs text-zinc-500 capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-xs text-zinc-200 font-medium">{String(value)}</span>
                        </div>
                      ))}
                      {(!product.specifications || Object.keys(product.specifications).length === 0) && (
                        <>
                          <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                            <span className="text-xs text-zinc-500">Sensor</span>
                            <span className="text-xs text-zinc-200 font-medium">Full Frame</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                            <span className="text-xs text-zinc-500">Resolution</span>
                            <span className="text-xs text-zinc-200 font-medium">4K/6K</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                            <span className="text-xs text-zinc-500">Mount</span>
                            <span className="text-xs text-zinc-200 font-medium">PL / E-Mount</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                            <span className="text-xs text-zinc-500">Recording</span>
                            <span className="text-xs text-zinc-200 font-medium">RAW / ProRes</span>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* EQUIPMENT MANIFEST - Main Focus - Only show when there's kit data */}
          {slotData.length > 0 && (
            <motion.div
              variants={fadeInBlur}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-700/20 rounded-lg">
                      <Layers className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Accessories</h2>
                      <p className="text-zinc-500 text-sm">Configure the components included with your kit</p>
                    </div>
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1 border border-zinc-700/50">
                    <button
                      onClick={() => setViewPreference('grid')}
                      className={cn(
                        'p-2 rounded-md transition-all',
                        viewPreference === 'grid'
                          ? 'bg-red-700 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                      )}
                      title="Grid view"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewPreference('list')}
                      className={cn(
                        'p-2 rounded-md transition-all',
                        viewPreference === 'list'
                          ? 'bg-red-700 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                      )}
                      title="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isLoadingKit ? (
                  <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-zinc-600 border-t-red-500 rounded-full mx-auto mb-4" />
                    <p className="text-zinc-400">Loading kit configuration...</p>
                  </div>
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    {slotData.map((slot) => (
                      <motion.div
                        key={slot.slotName}
                        variants={fadeInBlurFast}
                        className="bg-zinc-900/30 rounded-2xl border border-zinc-800 overflow-hidden"
                      >
                        {/* Slot Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/50 border-b border-zinc-800">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <div>
                              <h3 className="font-semibold text-white">{slot.slotName}</h3>
                              <span className="text-xs text-zinc-500">
                                {slot.selectionMode === 'single' ? 'Select one' : 'Select multiple'} • {slot.selectedIds.length} selected
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setEditingSlot(slot.slotName)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg text-sm font-medium text-zinc-200 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            Models
                          </button>
                        </div>

                        {/* Selected Items - Grid or List View */}
                        <div className="p-4">
                          {slot.selectedIds.length > 0 ? (
                            viewPreference === 'grid' ? (
                              /* Grid View */
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {/* Group IDs to show quantities */}
                                {(() => {
                                  const idCounts: Record<string, number> = {}
                                  slot.selectedIds.forEach(id => { idCounts[id] = (idCounts[id] || 0) + 1 })

                                  return Object.entries(idCounts).map(([id, count]) => {
                                    const itemDetails = getItemDetails(slot.slotName, id)
                                    if (!itemDetails) return null

                                    const slug = 'slug' in itemDetails ? itemDetails.slug : undefined
                                    // Make sure we have a valid slug fallback if undefined
                                    const targetUrl = `/${lng}/equipment/${slug || id}`

                                    return (

                                      <div
                                        key={id}
                                        className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all"
                                      >
                                        {/* Clickable Area for Navigation */}
                                        <div
                                          className="cursor-pointer"
                                          onClick={() => handleItemNavClick(targetUrl)}
                                        >
                                          {/* Item Image */}
                                          <div className="relative aspect-square bg-zinc-950">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleItemNavClick(targetUrl)
                                              }}
                                              className="absolute top-2 left-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                              <Info className="w-4 h-4" />
                                            </button>
                                            {itemDetails.imageUrl ? (
                                              <Image
                                                src={itemDetails.imageUrl}
                                                alt={itemDetails.name}
                                                fill
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-10 h-10 text-zinc-800" />
                                              </div>
                                            )}

                                            {/* Quantity Overlay - Clean & Minimal */}
                                            {slot.selectionMode === 'multi' && (
                                              <div
                                                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-full border border-white/10 p-1 shadow-xl z-10"
                                                onClick={(e) => e.stopPropagation()} // Prevent nav
                                              >
                                                <button
                                                  onClick={() => handleItemQuantity(slot.slotName, id, -1, slot.selectedIds)}
                                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
                                                >
                                                  <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-semibold text-white tabular-nums">{count}</span>
                                                <button
                                                  onClick={() => handleItemQuantity(slot.slotName, id, 1, slot.selectedIds)}
                                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
                                                >
                                                  <Plus className="w-3 h-3" />
                                                </button>
                                              </div>
                                            )}
                                          </div>

                                          {/* Item Info */}
                                          <div className="p-3">
                                            <p className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors line-clamp-1">
                                              {itemDetails.name}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )

                                  })
                                })()}
                              </div>
                            ) : (
                              /* List View */
                              <div className="space-y-2">
                                {(() => {
                                  const idCounts: Record<string, number> = {}
                                  slot.selectedIds.forEach(id => { idCounts[id] = (idCounts[id] || 0) + 1 })

                                  return Object.entries(idCounts).map(([id, count]) => {
                                    const itemDetails = getItemDetails(slot.slotName, id)
                                    if (!itemDetails) return null

                                    const slug = 'slug' in itemDetails ? itemDetails.slug : undefined
                                    const targetUrl = `/${lng}/equipment/${slug || id}`
                                    const categoryName = typeof itemDetails.category === 'object' && itemDetails.category ? itemDetails.category.name : itemDetails.category

                                    return (
                                      <div
                                        key={id}
                                        className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-amber-500/50 hover:bg-zinc-800 transition-all group"
                                      >
                                        {/* Clickable Area */}
                                        <div
                                          className="flex items-center gap-4 flex-1 cursor-pointer min-w-0"
                                          onClick={() => handleItemNavClick(targetUrl)}
                                        >
                                          {/* Item Image */}
                                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900">
                                            {itemDetails.imageUrl ? (
                                              <Image
                                                src={itemDetails.imageUrl}
                                                alt={itemDetails.name}
                                                fill
                                                sizes="64px"
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-zinc-700" />
                                              </div>
                                            )}
                                          </div>
                                          {/* Item Info */}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-amber-400 transition-colors">
                                                {itemDetails.name}
                                              </p>
                                              <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                            {categoryName && (
                                              <p className="text-xs text-zinc-500 mt-0.5">{String(categoryName)}</p>
                                            )}
                                          </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        {slot.selectionMode === 'multi' ? (
                                          <div className="flex items-center gap-3 bg-zinc-900/50 rounded-lg p-1.5 border border-zinc-800">
                                            <button
                                              onClick={() => handleItemQuantity(slot.slotName, id, -1, slot.selectedIds)}
                                              className="w-7 h-7 flex items-center justify-center hover:bg-zinc-800 rounded bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors"
                                            >
                                              <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="text-sm font-medium text-white w-4 text-center">{count}</span>
                                            <button
                                              onClick={() => handleItemQuantity(slot.slotName, id, 1, slot.selectedIds)}
                                              className="w-7 h-7 flex items-center justify-center hover:bg-zinc-800 rounded bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors"
                                            >
                                              <Plus className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="px-4 text-xs text-zinc-500 font-medium bg-zinc-900/50 py-1.5 rounded-full border border-zinc-800">
                                            1x
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })
                                })()}
                              </div>
                            )
                          ) : (
                            /* Empty State with Background Image */
                            <div className="relative w-full h-48 overflow-hidden rounded-xl">
                              {/* Background Image (First Item) */}
                              {(() => {
                                // Try to find a representative image from the first available option
                                const repImage = slot.items.find(i => i.imageUrl)?.imageUrl

                                if (repImage) {
                                  return (
                                    <div className="absolute inset-0 opacity-10 grayscale">
                                      <Image
                                        src={repImage}
                                        alt="background"
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                                    </div>
                                  )
                                }
                                return null
                              })()}

                              {/* Content Overlay */}
                              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                                <Package className="w-10 h-10 text-zinc-600 mb-3" />
                                <p className="text-zinc-500 text-sm font-medium">No items selected</p>
                                <button
                                  onClick={() => setEditingSlot(slot.slotName)}
                                  className="mt-3 text-red-500 hover:text-red-400 text-sm font-semibold transition-colors flex items-center gap-1 group"
                                >
                                  Add items
                                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Add to Quote Section - Sticky Bottom on Mobile */}
          <motion.div
            variants={fadeInBlur}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
          >
            <div
              className="bg-gradient-to-r from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left: Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-zinc-400" />
                    Ready to Request Quote?
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Rental dates & pricing will be provided after submission
                  </p>
                </div>

                {/* Center: Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-400">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      max={99}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 px-2 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-center text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    />
                    <button
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      className="w-9 h-9 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Right: Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || isAdding}
                  className={cn(
                    'px-8 py-3 flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
                    product.isAvailable
                      ? 'bg-red-700 text-white hover:bg-red-600'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  )}
                >
                  {isAdding ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add Kit to Quote
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Slot Editing Modal */}
          <AnimatePresence>
            {editingSlot && (
              <SlotEditModal
                slotName={editingSlot}
                slotData={getSlotData().find(s => s.slotName === editingSlot)!}
                onClose={() => setEditingSlot(null)}
                onSave={(selectedIds) => handleSlotUpdate(editingSlot, selectedIds)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    )
  }

  // ============================================================================
  // RENDER: STANDARD LAYOUT (Simple Products)
  // ============================================================================

  // Show loading skeleton until page is ready
  if (!isPageReady) {
    return <ProductDetailSkeleton isKit={false} />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="standard-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-zinc-950"
      >
        {/* Back Navigation */}
        <motion.div
          variants={fadeInBlur}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6"
        >
          <Link
            href={`/${lng}/equipment`}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>
        </motion.div>

        {/* Product Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Image Gallery - Container fits exactly to image */}
            <motion.div variants={fadeInBlur} className="flex justify-center">
              <div className="relative w-fit h-fit rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="block max-h-[500px] max-w-full object-contain"
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center">
                    <Package className="w-24 h-24 text-zinc-700" />
                  </div>
                )}

                {/* Category Badge */}
                {product.category && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 text-sm font-medium bg-zinc-900/80 backdrop-blur-sm text-zinc-300 rounded-lg border border-zinc-700/50">
                    {product.category.name}
                  </span>
                )}
              </div>

              {/* Thumbnail Strip (if multiple images) */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-zinc-700 hover:border-zinc-500 transition-colors"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - Image ${i + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              variants={fadeInBlur}
              className="flex flex-col"
            >
              {/* Title */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {product.name}
                </h1>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-zinc-400 leading-relaxed mb-8">
                  {product.description.replace(/<[^>]*>/g, '')}
                </p>
              )}

              {/* Specs - Modern Minimalist */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">
                    Specifications
                  </h3>
                  <div className="space-y-0">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-3 border-b border-zinc-800/60 last:border-b-0"
                      >
                        <span className="text-sm text-zinc-500 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-sm text-white font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Quote */}
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 mt-auto">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-zinc-400" />
                  Add to Quote
                </h3>

                <div className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm text-zinc-400 mb-1.5">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        min={1}
                        max={99}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-center text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                      />
                      <button
                        onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                        className="w-10 h-10 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Quote Summary */}
                  <div className="pt-4 border-t border-zinc-700 space-y-2">
                    {quantity > 1 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Quantity</span>
                        <span className="text-zinc-300">×{quantity}</span>
                      </div>
                    )}
                    <div className="bg-zinc-800/50 rounded-lg p-3 mt-2">
                      <p className="text-sm text-zinc-300 text-center">
                        Rental dates & pricing provided after quote submission
                      </p>
                    </div>
                  </div>

                  {/* Add to Quote Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.isAvailable || isAdding}
                    className={cn(
                      'w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200',
                      product.isAvailable
                        ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    )}
                  >
                    {isAdding ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Quote Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// SLOT EDIT MODAL COMPONENT
// ============================================================================

interface SlotEditModalProps {
  slotName: string
  slotData: {
    slotName: string
    selectionMode: 'single' | 'multi'
    items: { id: string; name: string; category?: string; imageUrl?: string }[]
    selectedIds: string[]
  }
  onClose: () => void
  onSave: (selectedIds: string[]) => void
}

function SlotEditModal({ slotName, slotData, onClose, onSave }: SlotEditModalProps) {
  const [localSelection, setLocalSelection] = useState<string[]>(slotData.selectedIds)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalViewMode, setModalViewMode] = useState<'grid' | 'list'>('grid')
  const modalContentRef = useRef<HTMLDivElement>(null)

  // Handle wheel events manually to ensure scroll works in modal
  const handleModalWheel = (e: React.WheelEvent) => {
    e.stopPropagation()
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop += e.deltaY
      e.preventDefault()
    }
  }

  // Filter items based on search
  const filteredItems = slotData.items.filter(item => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    )
  })

  // Helper to get count of an item in selection
  const getItemCount = (itemId: string) => localSelection.filter(id => id === itemId).length

  // Helper to change quantity
  const handleQuantity = (itemId: string, delta: number) => {
    if (slotData.selectionMode === 'single') {
      // Single mode: delta > 0 sets this item as unique selection
      if (delta > 0) setLocalSelection([itemId])
      return
    }

    setLocalSelection(prev => {
      const currentCount = prev.filter(id => id === itemId).length
      const others = prev.filter(id => id !== itemId)

      let newCount = currentCount + delta
      if (newCount < 0) newCount = 0

      // Reconstruct array: others + newCount * itemId
      return [...others, ...Array(newCount).fill(itemId)]
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-white">{slotName}</h3>
            <p className="text-sm text-zinc-500">
              {slotData.selectionMode === 'single' ? 'Select one item' : 'Adjust quantities'} • {localSelection.length} total items
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1 border border-zinc-700/50">
              <button
                onClick={() => setModalViewMode('grid')}
                className={cn(
                  'p-1.5 rounded-md transition-all',
                  modalViewMode === 'grid'
                    ? 'bg-amber-500 text-zinc-900'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                )}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModalViewMode('list')}
                className={cn(
                  'p-1.5 rounded-md transition-all',
                  modalViewMode === 'list'
                    ? 'bg-amber-500 text-zinc-900'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                )}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-zinc-800/50 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Items - Grid or List View */}
        <div
          ref={modalContentRef}
          onWheel={handleModalWheel}
          className="flex-1 min-h-0 overflow-y-auto p-4"
        >
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No items match &quot;{searchQuery}&quot;</p>
            </div>
          ) : modalViewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredItems.map((item) => {
                const count = getItemCount(item.id)
                const isSelected = count > 0
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'group relative rounded-xl border overflow-hidden transition-all text-left flex flex-col',
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30'
                        : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50 hover:border-zinc-600'
                    )}
                  >
                    {/* Image Area - Click to Increment or Select */}
                    <button
                      onClick={() => handleQuantity(item.id, 1)}
                      className="relative w-full aspect-square bg-zinc-900 block"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className={cn(
                            "object-cover transition-all",
                            isSelected ? "brightness-100" : "brightness-90 group-hover:brightness-100"
                          )}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-zinc-700" />
                        </div>
                      )}

                      {/* Selection Badge if Single Mode or just Indicator */}
                      {isSelected && slotData.selectionMode === 'single' && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-zinc-900" />
                        </div>
                      )}
                    </button>

                    {/* Info Area & Controls */}
                    <div className="p-3 flex items-end justify-between gap-2 mt-auto">
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          "text-sm font-medium line-clamp-2 leading-tight transition-colors",
                          isSelected ? "text-white" : "text-zinc-300"
                        )}>
                          {item.name}
                        </p>
                        {item.category && (
                          <p className="text-xs text-zinc-500 mt-1">{item.category}</p>
                        )}
                      </div>

                      {/* Quantity Controls (Only Multi) */}
                      {slotData.selectionMode === 'multi' && (
                        <div className="flex items-center gap-1 bg-zinc-900/80 rounded-lg p-0.5 border border-zinc-700">
                          {count > 0 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleQuantity(item.id, -count) }} // Remove all
                              className="w-7 h-7 flex items-center justify-center rounded-md text-red-500 hover:bg-zinc-700 hover:text-red-400 transition-colors mr-1"
                              title="Remove all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleQuantity(item.id, -1) }}
                            className={cn(
                              "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
                              count > 0 ? "text-zinc-300 hover:bg-zinc-700 hover:text-white" : "text-zinc-600 cursor-default"
                            )}
                          >
                            −
                          </button>
                          <span className={cn("w-6 text-center text-sm font-medium", count > 0 ? "text-amber-500" : "text-zinc-600")}>
                            {count}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleQuantity(item.id, 1) }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const count = getItemCount(item.id)
                const isSelected = count > 0
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'w-full flex items-center gap-4 p-3 rounded-xl border transition-all',
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30'
                        : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50 hover:border-zinc-600'
                    )}
                  >
                    {/* Image */}
                    <button
                      onClick={() => handleQuantity(item.id, 1)}
                      className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-zinc-700" />
                        </div>
                      )}
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate transition-colors",
                        isSelected ? "text-white" : "text-zinc-300"
                      )}>
                        {item.name}
                      </p>
                      {item.category && (
                        <p className="text-xs text-zinc-500 mt-0.5">{item.category}</p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    {slotData.selectionMode === 'multi' ? (
                      <div className="flex items-center gap-1 bg-zinc-900/50 rounded-lg p-1 border border-zinc-700">
                        {count > 0 && (
                          <button
                            onClick={() => handleQuantity(item.id, -count)}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-zinc-700 hover:text-red-400 transition-colors mr-1"
                            title="Remove all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleQuantity(item.id, -1)}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
                            count > 0 ? "text-zinc-300 hover:bg-zinc-700" : "text-zinc-600"
                          )}
                        >
                          −
                        </button>
                        <span className={cn("w-8 text-center text-sm font-medium", count > 0 ? "text-amber-500" : "text-zinc-600")}>
                          {count}
                        </span>
                        <button
                          onClick={() => handleQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-300 hover:bg-zinc-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      // Single Mode - Just Checkmark
                      isSelected && (
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 text-zinc-900" />
                        </div>
                      )
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-zinc-800 bg-zinc-900/80 flex-shrink-0">
          <p className="text-sm text-zinc-500">
            {localSelection.length} total items selected
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setLocalSelection([])} // Clear Selection
              className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors mr-auto"
            >
              Clear
            </button>
            <button
              onClick={() => onSave(localSelection)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold rounded-xl transition-colors"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
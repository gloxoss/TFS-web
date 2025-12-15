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

import { useState, useCallback, useEffect } from 'react'
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
  List
} from 'lucide-react'
import { Product } from '@/services/products/types'
import { ResolvedKit } from '@/types/commerce'
import { useCartStore, useUIStore } from '@/stores'
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


interface ProductDetailClientProps {
  product: Product
  lng: string
}

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
    'fx6', 'fx3', 'fx30', 'fx9',  // Sony FX series
    'komodo', 'red v-raptor', 'red ranger', 'red dsmc',  // RED cameras (not just "red")
    'alexa', 'amira', 'arri 35', 'arriflex',  // ARRI cameras (not ARRI lights like M18, SkyPanel)
    'c70', 'c300', 'c500', 'c200',  // Canon Cinema EOS
    'bmpcc', 'blackmagic pocket', 'ursa',  // Blackmagic cameras
    'varicam', 'eva1',  // Panasonic cinema cameras
    'venice',  // Sony Venice
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
      <div className="fixed inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-zinc-900/50 pointer-events-none" />
      
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
        <div className="w-5 h-5 border-2 border-zinc-600 border-t-amber-400 rounded-full animate-spin" />
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
// MAIN COMPONENT
// ============================================================================

export function ProductDetailClient({ product, lng }: ProductDetailClientProps) {
  const addItem = useCartStore((state) => state.addItem)
  const openCartDrawer = useUIStore((state) => state.openCartDrawer)
  const addToast = useUIStore((state) => state.addToast)

  // Page ready state - prevents 404 flicker
  const [isPageReady, setIsPageReady] = useState(false)

  // Simple state - no dates (dates are set at checkout)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  // Kit state
  const [resolvedKit, setResolvedKit] = useState<ResolvedKit | null>(null)
  const [kitSelections, setKitSelections] = useState<KitSelections>({})
  const [isLoadingKit, setIsLoadingKit] = useState(true)
  
  // Mock kit state (fallback for cameras)
  const [useMockKit, setUseMockKit] = useState(false)
  const [mockSelections, setMockSelections] = useState<Record<string, string[]>>({})
  
  // Slot editing modal state
  const [editingSlot, setEditingSlot] = useState<string | null>(null)
  
  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Check for kit on mount
  useEffect(() => {
    async function loadKit() {
      try {
        // Use server action for kit resolution
        const result = await resolveKit(product.id)

        if (result.success && result.kit && result.kit.slots.length > 0) {
          setResolvedKit(result.kit)
          // Initialize default selections from resolved kit
          const defaultSelections: KitSelections = {}
          for (const slot of result.kit.slots) {
            defaultSelections[slot.slotName] = slot.defaultItems.map(item =>
              typeof item === 'string' ? item : item.id
            )
          }
          setKitSelections(defaultSelections)
        } else if (isCameraProduct(product)) {
          // Camera with no kit in DB - use mock data
          setUseMockKit(true)
          const defaultMock: Record<string, string[]> = {}
          for (const slot of MOCK_CAMERA_KIT) {
            defaultMock[slot.slotName] = slot.defaultSelected
          }
          setMockSelections(defaultMock)
        }
      } catch (error) {
        console.error('Failed to load kit:', error)
        // Fallback to mock for cameras
        if (isCameraProduct(product)) {
          setUseMockKit(true)
          const defaultMock: Record<string, string[]> = {}
          for (const slot of MOCK_CAMERA_KIT) {
            defaultMock[slot.slotName] = slot.defaultSelected
          }
          setMockSelections(defaultMock)
        }
      } finally {
        setIsLoadingKit(false)
        // Small delay to ensure smooth transition
        setTimeout(() => setIsPageReady(true), 100)
      }
    }
    loadKit()
  }, [product.id, product])

  // Handle add to cart - dates will be set at checkout
  const handleAddToCart = useCallback(async () => {
    setIsAdding(true)

    // Brief delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Add item without dates - they'll be set at checkout
    const placeholderDates = { start: '', end: '' }
    
    // Use real kit selections or mock selections
    const selectionsToUse = resolvedKit ? kitSelections : (useMockKit ? mockSelections : undefined)
    addItem(product, quantity, placeholderDates, selectionsToUse)

    const itemLabel = (resolvedKit || useMockKit) ? `${product.name} (Kit)` : product.name
    addToast({
      type: 'success',
      message: `${itemLabel} added to your quote request`,
    })

    setIsAdding(false)
    openCartDrawer()
  }, [product, quantity, addItem, addToast, openCartDrawer, resolvedKit, kitSelections, useMockKit, mockSelections])

  // Determine which layout to use
  const hasKit = resolvedKit || useMockKit
  const isCamera = isCameraProduct(product)
  
  // Unified slot data type
  type SlotDisplayItem = {
    id: string
    name: string
    category?: string
    imageUrl?: string
  }
  
  type SlotDisplayData = {
    slotName: string
    selectionMode: 'single' | 'multi'
    items: SlotDisplayItem[]
    selectedIds: string[]
  }
  
  // Get current slot data (either from real kit or mock)
  const getSlotData = useCallback((): SlotDisplayData[] => {
    if (resolvedKit) {
      return resolvedKit.slots.map(slot => ({
        slotName: slot.slotName,
        selectionMode: slot.allowMultiple ? 'multi' as const : 'single' as const,
        items: slot.availableOptions.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category?.name,
          imageUrl: product.imageUrl
        })),
        selectedIds: kitSelections[slot.slotName] || slot.defaultItems.map(item => item.product_id),
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
  
  // Get item details by id
  const getItemDetails = useCallback((slotName: string, itemId: string): SlotDisplayItem | null => {
    const slots = getSlotData()
    const slot = slots.find(s => s.slotName === slotName)
    if (!slot) return null
    return slot.items.find((i) => i.id === itemId) || null
  }, [getSlotData])
  
  // Handle slot selection update
  const handleSlotUpdate = useCallback((slotName: string, selectedIds: string[]) => {
    if (resolvedKit) {
      setKitSelections(prev => ({ ...prev, [slotName]: selectedIds }))
    } else if (useMockKit) {
      setMockSelections(prev => ({ ...prev, [slotName]: selectedIds }))
    }
    setEditingSlot(null)
  }, [resolvedKit, useMockKit])

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
          {/* Back Navigation */}
          <motion.div 
            variants={fadeInBlur}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
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
              {/* Camera Image - Smaller for kit layout */}
              <motion.div variants={fadeInBlur} className="lg:col-span-2">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
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
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {product.name}
                    </h1>
                    <p className="text-zinc-400 text-lg">
                      {resolvedKit?.template.name || 'Complete Cinema Package'}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full',
                      product.isAvailable
                        ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
                        : 'bg-red-900/50 text-red-300 border border-red-700/50'
                    )}
                >
                  {product.isAvailable ? (
                    <>
                      <Check className="w-4 h-4" />
                      Available
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Unavailable
                    </>
                  )}
                </span>
              </div>

              {product.description && (
                <p className="text-zinc-400 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Quick Stats */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-3 gap-4 mt-auto"
              >
                <motion.div variants={fadeInBlurFast} className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 text-center">
                  <Layers className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{slotData.length}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wide">Categories</div>
                </motion.div>
                <motion.div variants={fadeInBlurFast} className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 text-center">
                  <Package className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {slotData.reduce((sum, s) => sum + s.selectedIds.length, 0)}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wide">Items Selected</div>
                </motion.div>
                <motion.div variants={fadeInBlurFast} className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 text-center">
                  <Camera className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">1</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wide">Camera Body</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* EQUIPMENT MANIFEST - Main Focus */}
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
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Layers className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Equipment Manifest</h2>
                  <p className="text-zinc-500 text-sm">Configure the components included with your kit</p>
                </div>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1 border border-zinc-700/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-md transition-all',
                    viewMode === 'grid' 
                      ? 'bg-amber-500 text-zinc-900' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                  )}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-md transition-all',
                    viewMode === 'list' 
                      ? 'bg-amber-500 text-zinc-900' 
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
                <div className="animate-spin w-8 h-8 border-2 border-zinc-600 border-t-amber-400 rounded-full mx-auto mb-4" />
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
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
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
                        {slot.selectionMode === 'single' ? (
                          <>
                            <Edit3 className="w-4 h-4" />
                            Swap
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Edit
                          </>
                        )}
                      </button>
                    </div>

                    {/* Selected Items - Grid or List View */}
                    <div className="p-4">
                      {slot.selectedIds.length > 0 ? (
                        viewMode === 'grid' ? (
                          /* Grid View */
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {slot.selectedIds.map(id => {
                              const itemDetails = getItemDetails(slot.slotName, id)
                              if (!itemDetails) return null
                              return (
                                <div
                                  key={id}
                                  className="group relative bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden"
                                >
                                  {/* Item Image */}
                                  <div className="relative aspect-square bg-zinc-900">
                                    {itemDetails.imageUrl ? (
                                      <Image
                                        src={itemDetails.imageUrl}
                                        alt={itemDetails.name}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-10 h-10 text-zinc-700" />
                                      </div>
                                    )}
                                    {/* Selection Badge */}
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                      <Check className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                  {/* Item Info */}
                                  <div className="p-3">
                                    <p className="text-sm font-medium text-zinc-200 line-clamp-2 leading-tight">
                                      {itemDetails.name}
                                    </p>
                                    {itemDetails.category && (
                                      <p className="text-xs text-zinc-500 mt-1">{itemDetails.category}</p>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          /* List View */
                          <div className="space-y-2">
                            {slot.selectedIds.map(id => {
                              const itemDetails = getItemDetails(slot.slotName, id)
                              if (!itemDetails) return null
                              return (
                                <div
                                  key={id}
                                  className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                                >
                                  {/* Item Image */}
                                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900">
                                    {itemDetails.imageUrl ? (
                                      <Image
                                        src={itemDetails.imageUrl}
                                        alt={itemDetails.name}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-6 h-6 text-zinc-700" />
                                      </div>
                                    )}
                                  </div>
                                  {/* Item Info */}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-200 truncate">
                                      {itemDetails.name}
                                    </p>
                                    {itemDetails.category && (
                                      <p className="text-xs text-zinc-500 mt-0.5">{itemDetails.category}</p>
                                    )}
                                  </div>
                                  {/* Selection Badge */}
                                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      ) : (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                          <p className="text-zinc-500 text-sm">No items selected</p>
                          <button
                            onClick={() => setEditingSlot(slot.slotName)}
                            className="mt-3 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                          >
                            Add items →
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

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
                    className="w-14 px-2 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-center text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
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
                    ? 'bg-amber-500 text-zinc-900 hover:bg-amber-400'
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
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
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
          {/* Image Gallery */}
          <motion.div variants={fadeInBlur}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
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
            {/* Title & Availability */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full',
                    product.isAvailable
                      ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
                      : 'bg-red-900/50 text-red-300 border border-red-700/50'
                  )}
                >
                  {product.isAvailable ? (
                    <>
                      <Check className="w-4 h-4" />
                      Available
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Unavailable
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-zinc-400 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                  Specifications
                </h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-zinc-800">
                      <dt className="text-zinc-500">{key}</dt>
                      <dd className="text-zinc-300 font-medium">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
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

  // Filter items based on search
  const filteredItems = slotData.items.filter(item => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    )
  })

  const handleToggle = (itemId: string) => {
    if (slotData.selectionMode === 'single') {
      setLocalSelection([itemId])
    } else {
      setLocalSelection(prev => 
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    }
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
              {slotData.selectionMode === 'single' ? 'Select one item' : 'Select multiple items'} • {localSelection.length} selected
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
        <div className="flex-1 overflow-y-auto p-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">No items match &quot;{searchQuery}&quot;</p>
            </div>
          ) : modalViewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredItems.map((item) => {
                const isSelected = localSelection.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggle(item.id)}
                    className={cn(
                      'group relative rounded-xl border overflow-hidden transition-all text-left',
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/30'
                        : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50 hover:border-zinc-600'
                    )}
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-zinc-900">
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
                      
                      {/* Selection Indicator */}
                      <div className={cn(
                        'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all',
                        isSelected
                          ? 'bg-amber-500 scale-100'
                          : 'bg-zinc-800/80 border border-zinc-600 scale-90 group-hover:scale-100'
                      )}>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-zinc-900" />
                        ) : (
                          <Plus className="w-4 h-4 text-zinc-400" />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
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
                  </button>
                )
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const isSelected = localSelection.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggle(item.id)}
                    className={cn(
                      'w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left',
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/30'
                        : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50 hover:border-zinc-600'
                    )}
                  >
                    {/* Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900">
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
                    </div>

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

                    {/* Selection Indicator */}
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                      isSelected
                        ? 'bg-amber-500'
                        : 'bg-zinc-800/80 border border-zinc-600'
                    )}>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-zinc-900" />
                      ) : (
                        <Plus className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-zinc-800 bg-zinc-900/80 flex-shrink-0">
          <p className="text-sm text-zinc-500">
            {localSelection.length} of {slotData.items.length} items selected
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
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
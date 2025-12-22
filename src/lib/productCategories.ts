/**
 * Product Category Configuration
 * 
 * Defines icons, colors, and metadata for each equipment category.
 * Used across the catalog for consistent categorization and visual identity.
 */

import {
    Camera,
    Focus,
    Lightbulb,
    Move,
    Mic,
    Package2,
    Layers,
    LucideIcon
} from 'lucide-react'

export interface CategoryConfig {
    icon: LucideIcon
    gradient: string
    textColor: string
    borderColor: string
    hoverGlow: string
    priority: number
    keywords: string[]
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    cameras: {
        icon: Camera,
        gradient: 'from-purple-500/20 via-pink-500/20 to-purple-500/20',
        textColor: 'text-purple-300',
        borderColor: 'border-purple-500/30',
        hoverGlow: 'hover:shadow-purple-500/20',
        priority: 1,
        keywords: ['camera', 'caméra', 'body', 'cinema']
    },
    lenses: {
        icon: Focus,
        gradient: 'from-blue-500/20 via-cyan-500/20 to-blue-500/20',
        textColor: 'text-blue-300',
        borderColor: 'border-blue-500/30',
        hoverGlow: 'hover:shadow-blue-500/20',
        priority: 2,
        keywords: ['lens', 'objectif', 'prime', 'zoom']
    },
    lighting: {
        icon: Lightbulb,
        gradient: 'from-amber-500/20 via-orange-500/20 to-amber-500/20',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-500/30',
        hoverGlow: 'hover:shadow-amber-500/20',
        priority: 3,
        keywords: ['light', 'éclairage', 'led', 'hmi', 'tungsten']
    },
    grip: {
        icon: Move,
        gradient: 'from-green-500/20 via-emerald-500/20 to-green-500/20',
        textColor: 'text-green-300',
        borderColor: 'border-green-500/30',
        hoverGlow: 'hover:shadow-green-500/20',
        priority: 4,
        keywords: ['grip', 'support', 'tripod', 'dolly', 'crane']
    },
    audio: {
        icon: Mic,
        gradient: 'from-red-500/20 via-rose-500/20 to-red-500/20',
        textColor: 'text-red-300',
        borderColor: 'border-red-500/30',
        hoverGlow: 'hover:shadow-red-500/20',
        priority: 5,
        keywords: ['audio', 'mic', 'microphone', 'sound', 'recorder']
    },
    accessories: {
        icon: Package2,
        gradient: 'from-zinc-500/20 via-gray-500/20 to-zinc-500/20',
        textColor: 'text-zinc-300',
        borderColor: 'border-zinc-500/30',
        hoverGlow: 'hover:shadow-zinc-500/20',
        priority: 6,
        keywords: ['accessory', 'accessoire', 'cable', 'battery', 'case']
    },
    kits: {
        icon: Layers,
        gradient: 'from-indigo-500/20 via-violet-500/20 to-indigo-500/20',
        textColor: 'text-indigo-300',
        borderColor: 'border-indigo-500/30',
        hoverGlow: 'hover:shadow-indigo-500/20',
        priority: 0, // Highest priority
        keywords: ['kit', 'package', 'bundle']
    }
}

/**
 * Get category configuration by slug
 */
export function getCategoryConfig(slug?: string): CategoryConfig {
    if (!slug) {
        return {
            icon: Package2,
            gradient: 'from-zinc-500/20 via-gray-500/20 to-zinc-500/20',
            textColor: 'text-zinc-400',
            borderColor: 'border-zinc-700',
            hoverGlow: 'hover:shadow-zinc-500/20',
            priority: 999,
            keywords: []
        }
    }

    const normalizedSlug = slug.toLowerCase()

    // Direct match
    if (CATEGORY_CONFIG[normalizedSlug]) {
        return CATEGORY_CONFIG[normalizedSlug]
    }

    // Fuzzy match by keywords
    for (const [key, config] of Object.entries(CATEGORY_CONFIG)) {
        if (config.keywords.some(keyword => normalizedSlug.includes(keyword))) {
            return config
        }
    }

    // Default fallback
    return getCategoryConfig()
}

/**
 * Sort categories by priority
 */
export function sortCategoriesByPriority<T extends { slug: string }>(categories: T[]): T[] {
    return [...categories].sort((a, b) => {
        const configA = getCategoryConfig(a.slug)
        const configB = getCategoryConfig(b.slug)
        return configA.priority - configB.priority
    })
}

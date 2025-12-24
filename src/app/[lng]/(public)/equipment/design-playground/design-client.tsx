/**
 * Design Playground Client Component
 * 
 * Allows user to switch between 3 layout options:
 * 1. Sidebar (Vertical)
 * 2. Dropdown (Compact)
 * 3. Tabs (Horizontal)
 */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Layout,
    ChevronDown,
    Search,
    Filter,
    Grid2X2,
    List,
    PanelLeft,
    Menu,
    X
} from 'lucide-react'
import { Product, Category } from '@/services/products/types'
import { ProductGrid } from '@/components/catalog'
import { cn } from '@/lib/utils'
import { getCategoryConfig } from '@/lib/productCategories'

type LayoutOption = 'sidebar' | 'dropdown' | 'tabs'

interface DesignPlaygroundProps {
    lng: string
    products: Product[]
    categories: Category[]
}

export function DesignPlaygroundClient({ lng, products, categories }: DesignPlaygroundProps) {
    const [currentLayout, setCurrentLayout] = useState<LayoutOption>('sidebar')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-20">
            {/* ---------------------------------------------------------------------------
          PLAYGROUND CONTROLS (Top Bar)
          --------------------------------------------------------------------------- */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl flex gap-1">
                <LayoutButton
                    active={currentLayout === 'sidebar'}
                    onClick={() => setCurrentLayout('sidebar')}
                    icon={PanelLeft}
                    label="Sidebar"
                />
                <LayoutButton
                    active={currentLayout === 'dropdown'}
                    onClick={() => setCurrentLayout('dropdown')}
                    icon={ChevronDown}
                    label="Dropdown"
                />
                <LayoutButton
                    active={currentLayout === 'tabs'}
                    onClick={() => setCurrentLayout('tabs')}
                    icon={List}
                    label="Tabs"
                />
            </div>

            {/* Spacer for fixed controls */}
            <div className="h-32" />

            <LayoutDescription layout={currentLayout} />

            {/* ---------------------------------------------------------------------------
          LAYOUT IMPLEMENTATIONS
          --------------------------------------------------------------------------- */}

            <div className="max-w-[1600px] mx-auto px-4 md:px-8">

                {/* === OPTION 1: SIDEBAR LAYOUT === */}
                {currentLayout === 'sidebar' && (
                    <div className="flex gap-8 items-start">
                        {/* Left Sidebar */}
                        <aside className="w-64 shrink-0 sticky top-32 space-y-1">
                            <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                Categories
                            </div>
                            <SidebarItem
                                label="All Equipment"
                                count={products.length}
                                active={selectedCategory === null}
                                onClick={() => setSelectedCategory(null)}
                            />
                            {categories.map(cat => {
                                const config = getCategoryConfig(cat.slug)
                                const Icon = config.icon
                                return (
                                    <SidebarItem
                                        key={cat.id}
                                        icon={Icon}
                                        label={cat.name}
                                        count={cat.productCount}
                                        active={selectedCategory === cat.slug}
                                        onClick={() => setSelectedCategory(cat.slug)}
                                    />
                                )
                            })}
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Top Bar (Search/Sort) */}
                            <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xl font-bold">
                                    {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'All Equipment'}
                                </div>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                        <input className="bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-purple-500 transition-colors" placeholder="Search..." />
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-800">
                                        Sort by <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <ProductGrid products={products} lng={lng} />
                        </div>
                    </div>
                )}


                {/* === OPTION 2: DROPDOWN LAYOUT === */}
                {currentLayout === 'dropdown' && (
                    <div className="space-y-8">
                        {/* Compact Top Bar */}
                        <div className="sticky top-24 z-30">
                            <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-6">

                                {/* Category Dropdown */}
                                <div className="relative group">
                                    <button className="flex items-center gap-3 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-purple-500/20">
                                        <Grid2X2 className="w-5 h-5" />
                                        <span>{selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'All Categories'}</span>
                                        <ChevronDown className="w-4 h-4 ml-2" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                                        <button
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm font-medium transition-colors"
                                            onClick={() => setSelectedCategory(null)}
                                        >
                                            All Equipment
                                        </button>
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors flex justify-between"
                                                onClick={() => setSelectedCategory(cat.slug)}
                                            >
                                                <span>{cat.name}</span>
                                                <span className="text-zinc-600 text-xs">{cat.productCount}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Chips (Brands) */}
                                <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
                                    {['ARRI', 'Sony', 'RED', 'Canon', 'Blackmagic'].map(brand => (
                                        <button key={brand} className="px-4 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700/50 text-sm font-medium text-zinc-300 whitespace-nowrap transition-colors">
                                            {brand}
                                        </button>
                                    ))}
                                </div>

                                {/* Search */}
                                <div className="w-64 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" placeholder="Search products..." />
                                </div>

                            </div>
                        </div>

                        <ProductGrid products={products} lng={lng} />
                    </div>
                )}


                {/* === OPTION 3: TABS LAYOUT === */}
                {currentLayout === 'tabs' && (
                    <div className="space-y-6">
                        {/* Sticky Tabs Header */}
                        <div className="sticky top-24 z-30 flex flex-col gap-0">
                            {/* Primary Tabs */}
                            <div className="bg-zinc-900/90 backdrop-blur-md border-b border-white/5">
                                <div className="max-w-[1600px] mx-auto">
                                    <div className="flex overflow-x-auto no-scrollbar">
                                        <TabItem
                                            label="Overview"
                                            active={selectedCategory === null}
                                            onClick={() => setSelectedCategory(null)}
                                        />
                                        {categories.map(cat => (
                                            <TabItem
                                                key={cat.id}
                                                label={cat.name}
                                                active={selectedCategory === cat.slug}
                                                count={cat.productCount}
                                                onClick={() => setSelectedCategory(cat.slug)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Toolbar */}
                            <div className="bg-zinc-950/90 backdrop-blur-md border-b border-white/5 py-3">
                                <div className="max-w-[1600px] mx-auto px-4 flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mr-2 py-1.5">Brand:</span>
                                        {['ARRI', 'Sony', 'RED'].map(brand => (
                                            <button key={brand} className="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:border-zinc-500 hover:text-white transition-all">
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1">
                                            <Layout className="w-3 h-3" /> Grid
                                        </button>
                                        <button className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1">
                                            <List className="w-3 h-3" /> List
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <ProductGrid products={products} lng={lng} />
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

/* ---------------------------------------------------------------------------
   HELPER COMPONENTS
   --------------------------------------------------------------------------- */

function LayoutButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                active
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    )
}

function SidebarItem({ label, count, active, onClick, icon: Icon }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                active
                    ? "bg-purple-500/10 text-purple-300 font-medium border border-purple-500/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon className={cn("w-4 h-4", active ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300")} />}
                <span>{label}</span>
            </div>
            {count !== undefined && (
                <span className={cn("text-xs", active ? "text-purple-400/70" : "text-zinc-600")}>
                    {count}
                </span>
            )}
        </button>
    )
}

function TabItem({ label, count, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors",
                active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
        >
            {label}
            {count !== undefined && <span className="ml-2 text-xs opacity-50">{count}</span>}

            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500"
                />
            )}
        </button>
    )
}

function LayoutDescription({ layout }: { layout: LayoutOption }) {
    const details = {
        sidebar: { title: 'Sidebar Layout', desc: 'Vertical navigation for maximum scalability. Best for large catalogs.' },
        dropdown: { title: 'Dropdown Layout', desc: 'Minimalist header with collapsible categories. Maximizes screen space.' },
        tabs: { title: 'Tabs Layout', desc: 'Horizontal scrollable tabs. Modern, app-like feel.' },
    }
    return (
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">{details[layout].title}</h2>
            <p className="text-zinc-400">{details[layout].desc}</p>
        </div>
    )
}

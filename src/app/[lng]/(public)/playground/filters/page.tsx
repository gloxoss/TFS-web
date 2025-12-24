"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Filter,
    X,
    ChevronDown,
    ChevronUp,
    SlidersHorizontal,
    LayoutGrid,
    List,
    Search,
    Check,
    Camera,
    Lightbulb,
    Mic,
    Video,
    Package
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock categories for demo
const CATEGORIES = [
    { id: '1', name: 'Cameras', slug: 'cameras', icon: Camera, count: 24 },
    { id: '2', name: 'Lighting', slug: 'lighting', icon: Lightbulb, count: 18 },
    { id: '3', name: 'Audio', slug: 'audio', icon: Mic, count: 12 },
    { id: '4', name: 'Lenses', slug: 'lenses', icon: Video, count: 32 },
    { id: '5', name: 'Grip', slug: 'grip', icon: Package, count: 15 },
];

const BRANDS = ['Sony', 'ARRI', 'RED', 'Canon', 'Blackmagic', 'Zeiss'];

export default function FilterPlayground() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['cameras']);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [activeDemo, setActiveDemo] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

    const toggleCategory = (slug: string) => {
        setSelectedCategories(prev =>
            prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
        );
    };

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-3xl font-bold">Filter Widget Playground</h1>
                    <p className="text-zinc-400 mt-2">Explore different filter UI patterns for your equipment catalog</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* OPTION 1: Top Sticky Pill Filters */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-semibold">Option 1</span>
                        <h2 className="text-2xl font-bold">Top Sticky Pill Filters ⭐ Recommended</h2>
                    </div>
                    <p className="text-zinc-500">Horizontal scrollable pills that stick to the top. Clean, modern, mobile-friendly.</p>

                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                        {/* Sticky Filter Bar */}
                        <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 p-4">
                            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {/* All Filter Button */}
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    All Filters
                                </button>

                                {/* Category Pills */}
                                {CATEGORIES.map((cat) => {
                                    const isActive = selectedCategories.includes(cat.slug);
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleCategory(cat.slug)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                                                isActive
                                                    ? "bg-amber-500 text-zinc-900"
                                                    : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 border border-zinc-700/50"
                                            )}
                                        >
                                            <cat.icon className="w-4 h-4" />
                                            {cat.name}
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded-full text-xs",
                                                isActive ? "bg-zinc-900/30" : "bg-zinc-700"
                                            )}>
                                                {cat.count}
                                            </span>
                                        </button>
                                    );
                                })}

                                {/* Clear All */}
                                {selectedCategories.length > 0 && (
                                    <button
                                        onClick={() => setSelectedCategories([])}
                                        className="flex items-center gap-1 px-3 py-2.5 text-zinc-400 hover:text-white text-sm whitespace-nowrap"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content Grid Preview */}
                        <div className="p-6 grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="aspect-square bg-zinc-800/50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* OPTION 2: Fixed Sidebar with Collapsible Sections */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold">Option 2</span>
                        <h2 className="text-2xl font-bold">Fixed Sidebar with Collapsible Sections</h2>
                    </div>
                    <p className="text-zinc-500">Classic sidebar that stays fixed. Good for desktop with many filter options.</p>

                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                        <div className="flex">
                            {/* Sidebar */}
                            <div className={cn(
                                "border-r border-zinc-800 transition-all duration-300",
                                sidebarOpen ? "w-72" : "w-16"
                            )}>
                                <div className="sticky top-0 p-4">
                                    {/* Toggle Button */}
                                    <button
                                        onClick={() => setSidebarOpen(!sidebarOpen)}
                                        className="w-full flex items-center justify-between p-3 bg-zinc-800 rounded-xl mb-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-5 h-5 text-amber-400" />
                                            {sidebarOpen && <span className="font-semibold">Filters</span>}
                                        </div>
                                        {sidebarOpen && <ChevronDown className="w-4 h-4" />}
                                    </button>

                                    {sidebarOpen && (
                                        <div className="space-y-4">
                                            {/* Categories Section */}
                                            <FilterSection title="Categories">
                                                {CATEGORIES.map(cat => (
                                                    <label key={cat.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer">
                                                        <div className={cn(
                                                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                                            selectedCategories.includes(cat.slug)
                                                                ? "bg-amber-500 border-amber-500"
                                                                : "border-zinc-600"
                                                        )}>
                                                            {selectedCategories.includes(cat.slug) && (
                                                                <Check className="w-3 h-3 text-zinc-900" />
                                                            )}
                                                        </div>
                                                        <span className="flex-1">{cat.name}</span>
                                                        <span className="text-xs text-zinc-500">{cat.count}</span>
                                                    </label>
                                                ))}
                                            </FilterSection>

                                            {/* Brands Section */}
                                            <FilterSection title="Brands">
                                                {BRANDS.map(brand => (
                                                    <label key={brand} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer">
                                                        <div className={cn(
                                                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                                            selectedBrands.includes(brand)
                                                                ? "bg-emerald-500 border-emerald-500"
                                                                : "border-zinc-600"
                                                        )}>
                                                            {selectedBrands.includes(brand) && (
                                                                <Check className="w-3 h-3 text-zinc-900" />
                                                            )}
                                                        </div>
                                                        <span>{brand}</span>
                                                    </label>
                                                ))}
                                            </FilterSection>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6">
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="aspect-square bg-zinc-800/50 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* OPTION 3: Dropdown Mega Filter Panel */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">Option 3</span>
                        <h2 className="text-2xl font-bold">Dropdown Mega Filter Panel</h2>
                    </div>
                    <p className="text-zinc-500">Full-width dropdown panel that expands on click. Great for complex filtering.</p>

                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden relative">
                        {/* Top Bar */}
                        <div className="border-b border-zinc-800 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveDemo(activeDemo === 'mega' ? null : 'mega')}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all",
                                        activeDemo === 'mega'
                                            ? "bg-amber-500 text-zinc-900"
                                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                                    )}
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                    <ChevronDown className={cn(
                                        "w-4 h-4 transition-transform",
                                        activeDemo === 'mega' && "rotate-180"
                                    )} />
                                </button>

                                {/* Active Filter Tags */}
                                <div className="flex gap-2">
                                    {selectedCategories.slice(0, 2).map(slug => (
                                        <span key={slug} className="px-3 py-1.5 bg-zinc-800 rounded-full text-sm flex items-center gap-2">
                                            {CATEGORIES.find(c => c.slug === slug)?.name}
                                            <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => toggleCategory(slug)} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2.5 bg-zinc-800 rounded-lg hover:bg-zinc-700">
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 bg-zinc-800/50 rounded-lg hover:bg-zinc-700">
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Mega Panel */}
                        <AnimatePresence>
                            {activeDemo === 'mega' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-b border-zinc-800 overflow-hidden"
                                >
                                    <div className="p-6 grid grid-cols-4 gap-8">
                                        {/* Categories */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Category</h3>
                                            <div className="space-y-2">
                                                {CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => toggleCategory(cat.slug)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                                                            selectedCategories.includes(cat.slug)
                                                                ? "bg-amber-500/20 text-amber-400"
                                                                : "hover:bg-zinc-800"
                                                        )}
                                                    >
                                                        <cat.icon className="w-5 h-5" />
                                                        <span className="flex-1">{cat.name}</span>
                                                        <span className="text-xs text-zinc-500">{cat.count}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Brands */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Brand</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {BRANDS.map(brand => (
                                                    <button
                                                        key={brand}
                                                        onClick={() => toggleBrand(brand)}
                                                        className={cn(
                                                            "px-3 py-2 rounded-lg text-sm transition-colors",
                                                            selectedBrands.includes(brand)
                                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                                                                : "bg-zinc-800 hover:bg-zinc-700 border border-transparent"
                                                        )}
                                                    >
                                                        {brand}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Search */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Search</h3>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Search equipment..."
                                                    className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col justify-end gap-3">
                                            <button className="px-6 py-3 bg-amber-500 text-zinc-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors">
                                                Apply Filters
                                            </button>
                                            <button className="px-6 py-3 bg-zinc-800 text-zinc-300 font-medium rounded-xl hover:bg-zinc-700 transition-colors">
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Content */}
                        <div className="p-6 grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="aspect-square bg-zinc-800/50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* OPTION 4: Floating Action Button + Bottom Sheet (Mobile-First) */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">Option 4</span>
                        <h2 className="text-2xl font-bold">Floating Action Button + Bottom Sheet</h2>
                    </div>
                    <p className="text-zinc-500">Mobile-first design with FAB and bottom sheet. Perfect for touch devices.</p>

                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden relative h-[500px]">
                        {/* Content */}
                        <div className="p-6 grid grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                <div key={i} className="aspect-square bg-zinc-800/50 rounded-xl animate-pulse" />
                            ))}
                        </div>

                        {/* FAB Button */}
                        <button
                            onClick={() => setMobileSheetOpen(!mobileSheetOpen)}
                            className="absolute bottom-6 right-6 w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-colors"
                        >
                            <Filter className="w-6 h-6 text-zinc-900" />
                        </button>

                        {/* Active Filters Chip */}
                        {selectedCategories.length > 0 && (
                            <div className="absolute bottom-6 left-6 px-4 py-2 bg-zinc-800 rounded-full text-sm flex items-center gap-2">
                                <span className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs text-zinc-900 font-bold">
                                    {selectedCategories.length}
                                </span>
                                filters active
                            </div>
                        )}

                        {/* Bottom Sheet */}
                        <AnimatePresence>
                            {mobileSheetOpen && (
                                <>
                                    {/* Backdrop */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                        onClick={() => setMobileSheetOpen(false)}
                                    />

                                    {/* Sheet */}
                                    <motion.div
                                        initial={{ y: '100%' }}
                                        animate={{ y: 0 }}
                                        exit={{ y: '100%' }}
                                        transition={{ type: 'spring', damping: 25 }}
                                        className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 rounded-t-3xl p-6 z-10"
                                    >
                                        {/* Handle */}
                                        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-6" />

                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold">Filters</h3>
                                            <button onClick={() => setMobileSheetOpen(false)}>
                                                <X className="w-6 h-6 text-zinc-400" />
                                            </button>
                                        </div>

                                        {/* Category Grid */}
                                        <div className="grid grid-cols-3 gap-3 mb-6">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => toggleCategory(cat.slug)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all",
                                                        selectedCategories.includes(cat.slug)
                                                            ? "bg-amber-500 text-zinc-900"
                                                            : "bg-zinc-800 hover:bg-zinc-700"
                                                    )}
                                                >
                                                    <cat.icon className="w-6 h-6" />
                                                    <span className="text-sm font-medium">{cat.name}</span>
                                                </button>
                                            ))}
                                        </div>

                                        <button className="w-full py-4 bg-amber-500 text-zinc-900 font-bold rounded-2xl">
                                            Show {selectedCategories.length > 0 ? `${selectedCategories.length * 12}` : 'All'} Results
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* OPTION 5: Inline Tag Cloud */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-semibold">Option 5</span>
                        <h2 className="text-2xl font-bold">Inline Tag Cloud</h2>
                    </div>
                    <p className="text-zinc-500">Tags embedded directly with content. Minimal, distraction-free browsing.</p>

                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
                        {/* Hero */}
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold mb-2">Equipment Catalog</h3>
                            <p className="text-zinc-500 mb-6">Find the perfect gear for your production</p>

                            {/* Tag Cloud */}
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-4 py-2 bg-amber-500 text-zinc-900 rounded-full text-sm font-medium">All Equipment</span>
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.slug)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                            selectedCategories.includes(cat.slug)
                                                ? "bg-white text-zinc-900"
                                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                        )}
                                    >
                                        {cat.name} ({cat.count})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="aspect-square bg-zinc-800/50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* RECOMMENDATION */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="bg-gradient-to-r from-amber-500/10 to-transparent rounded-2xl border border-amber-500/20 p-8">
                    <h2 className="text-2xl font-bold mb-4">💡 Recommendation</h2>
                    <div className="space-y-4 text-zinc-300">
                        <p>For your equipment catalog, I recommend:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong className="text-amber-400">Option 1 (Top Sticky Pills)</strong> - Best for mobile + desktop, clean and modern</li>
                            <li><strong className="text-zinc-300">Option 3 (Mega Panel)</strong> - Good if you have many filter options</li>
                            <li><strong className="text-zinc-300">Hybrid approach</strong> - Top pills on desktop, FAB + bottom sheet on mobile</li>
                        </ul>
                        <p className="mt-4 text-zinc-500">Which style do you prefer? I can implement it in the actual equipment page.</p>
                    </div>
                </section>

            </div>
        </div>
    );
}

// Helper Component: Collapsible Filter Section
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-zinc-800 pb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-2 text-sm font-semibold text-zinc-300"
            >
                {title}
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2 space-y-1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

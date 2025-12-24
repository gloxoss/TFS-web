"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Package, Truck, FileCheck, Users, MapPin, Utensils, Hotel, Car, UserCheck, Camera, Film, Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getServicesForNav, type ServiceItem } from "@/lib/actions/services";

// Icon mapping for services
const SERVICE_ICONS: Record<string, React.ElementType> = {
    'equipment-hire': Package,
    'film-shipping': Truck,
    'film-permits': FileCheck,
    'crewing': Users,
    'scouting': MapPin,
    'catering': Utensils,
    'accommodation': Hotel,
    'transportation': Car,
    'casting': UserCheck,
    'cameras': Camera,
    'production': Film,
    'default': Clapperboard,
};

export default function HeaderPlayground() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        getServicesForNav().then(setServices);
    }, []);

    // Categorize services for mega menu
    const categories = {
        "Production": services.filter(s => ['crewing', 'casting', 'scouting'].includes(s.slug)),
        "Equipment & Logistics": services.filter(s => ['equipment-hire', 'film-shipping', 'transportation'].includes(s.slug)),
        "Support Services": services.filter(s => ['catering', 'accommodation', 'film-permits'].includes(s.slug)),
        "Other": services.filter(s => !['crewing', 'casting', 'scouting', 'equipment-hire', 'film-shipping', 'transportation', 'catering', 'accommodation', 'film-permits'].includes(s.slug)),
    };

    const getIcon = (slug: string) => SERVICE_ICONS[slug] || SERVICE_ICONS['default'];

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">Header Dropdown Playground</h1>
                    <p className="text-zinc-400">
                        You have <span className="text-red-500 font-bold">{services.length} services</span> in your database.
                        Explore different dropdown layouts below.
                    </p>
                </div>

                {/* Option 1: Current Simple List */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-2">
                        Option 1: Simple List (Current)
                    </h2>
                    <p className="text-zinc-500 text-sm">Good for 3-5 items. Gets too long with more.</p>

                    <div className="flex justify-center">
                        <div className="relative">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'simple' ? null : 'simple')}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white"
                            >
                                Services
                                <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === 'simple' && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === 'simple' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="absolute top-full left-0 mt-2 w-72 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl z-10"
                                    >
                                        {services.map((service) => {
                                            const Icon = getIcon(service.slug);
                                            return (
                                                <div key={service.id} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-zinc-300">
                                                    <Icon className="w-4 h-4 text-zinc-500" />
                                                    <span className="text-sm">{service.title}</span>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* Option 2: Two-Column Grid */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-2">
                        Option 2: Two-Column Grid
                    </h2>
                    <p className="text-zinc-500 text-sm">Compact layout, good for 6-12 items. More scannable.</p>

                    <div className="flex justify-center">
                        <div className="relative">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'grid2' ? null : 'grid2')}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white"
                            >
                                Services
                                <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === 'grid2' && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === 'grid2' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[400px] bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl z-10"
                                    >
                                        <div className="grid grid-cols-2 gap-1">
                                            {services.map((service) => {
                                                const Icon = getIcon(service.slug);
                                                return (
                                                    <div key={service.id} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 text-zinc-300 group cursor-pointer">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-red-500/20">
                                                            <Icon className="w-4 h-4 text-zinc-500 group-hover:text-red-400" />
                                                        </div>
                                                        <span className="text-sm truncate">{service.title}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* Option 3: Mega Menu with Categories */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-2">
                        Option 3: Mega Menu with Categories ⭐ Recommended
                    </h2>
                    <p className="text-zinc-500 text-sm">Professional look, organized by category. Best for 8+ items.</p>

                    <div className="flex justify-center">
                        <div className="relative">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'mega' ? null : 'mega')}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white"
                            >
                                Services
                                <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === 'mega' && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === 'mega' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl z-10"
                                    >
                                        <div className="grid grid-cols-3 gap-6">
                                            {Object.entries(categories).map(([category, items]) => (
                                                items.length > 0 && (
                                                    <div key={category}>
                                                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{category}</h3>
                                                        <div className="space-y-1">
                                                            {items.map((service) => {
                                                                const Icon = getIcon(service.slug);
                                                                return (
                                                                    <div key={service.id} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 text-zinc-300 group cursor-pointer">
                                                                        <Icon className="w-4 h-4 text-zinc-500 group-hover:text-red-400" />
                                                                        <span className="text-sm">{service.title}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                        </div>

                                        {/* Featured CTA */}
                                        <div className="mt-6 pt-4 border-t border-white/10">
                                            <div className="flex items-center justify-between bg-gradient-to-r from-red-500/20 to-transparent p-4 rounded-xl">
                                                <div>
                                                    <p className="font-semibold text-white">Need a custom solution?</p>
                                                    <p className="text-sm text-zinc-400">Contact us for tailored production services</p>
                                                </div>
                                                <button className="px-4 py-2 bg-red-600 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                                                    Get Quote
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* Option 4: Compact Icon Grid */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-2">
                        Option 4: Compact Icon Grid
                    </h2>
                    <p className="text-zinc-500 text-sm">Minimal text, icon-focused. Modern and clean.</p>

                    <div className="flex justify-center">
                        <div className="relative">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'icons' ? null : 'icons')}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white"
                            >
                                Services
                                <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === 'icons' && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === 'icons' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[320px] bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl z-10"
                                    >
                                        <div className="grid grid-cols-4 gap-2">
                                            {services.slice(0, 8).map((service) => {
                                                const Icon = getIcon(service.slug);
                                                return (
                                                    <div
                                                        key={service.id}
                                                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white group cursor-pointer transition-colors"
                                                        title={service.title}
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-red-500/20">
                                                            <Icon className="w-5 h-5 group-hover:text-red-400" />
                                                        </div>
                                                        <span className="text-[10px] text-center leading-tight truncate w-full">{service.title.split(' ')[0]}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {services.length > 8 && (
                                            <div className="mt-3 pt-3 border-t border-white/10 text-center">
                                                <button className="text-sm text-red-400 hover:text-red-300">
                                                    View all {services.length} services →
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* Option 5: Full-width Panel */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold border-b border-zinc-800 pb-2">
                        Option 5: Full-width Panel (Below Header)
                    </h2>
                    <p className="text-zinc-500 text-sm">Takes full width, shows everything at once. Great for content-rich sites.</p>

                    <div className="flex justify-center">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'fullwidth' ? null : 'fullwidth')}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white"
                        >
                            Services
                            <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === 'fullwidth' && "rotate-180")} />
                        </button>
                    </div>

                    <AnimatePresence>
                        {activeDropdown === 'fullwidth' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
                            >
                                <div className="grid grid-cols-5 gap-6">
                                    {services.map((service) => {
                                        const Icon = getIcon(service.slug);
                                        return (
                                            <div key={service.id} className="group cursor-pointer">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-red-500/20 transition-colors">
                                                    <Icon className="w-6 h-6 text-zinc-400 group-hover:text-red-400" />
                                                </div>
                                                <h4 className="font-medium text-white group-hover:text-red-400 transition-colors">{service.title}</h4>
                                                <p className="text-xs text-zinc-500 mt-1">Professional service</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Summary */}
                <section className="bg-zinc-900/50 rounded-2xl p-8 border border-white/10">
                    <h2 className="text-xl font-semibold mb-4">Recommendation</h2>
                    <div className="space-y-3 text-zinc-400">
                        <p>For <strong className="text-white">10 services</strong>, I recommend:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong className="text-red-400">Option 3 (Mega Menu)</strong> - Best for categorizing services logically</li>
                            <li><strong className="text-zinc-300">Option 2 (Two-Column)</strong> - Good if you don't want categories</li>
                        </ul>
                        <p className="mt-4">Which style do you prefer? I can implement it in the actual navbar.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Package, Truck, FileCheck, Users, MapPin, Utensils, Hotel, Car, UserCheck, ArrowRight, Palette, Shirt, Box, Paintbrush, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getServicesForNav, type ServiceItem } from "@/lib/actions/services";

interface ServicesDropdownProps {
    lng: string;
    label: string;
}

// Core TFS services - only these will be shown
const CORE_SERVICE_SLUGS = [
    'equipment-hire',
    'film-shipping',
    'film-permits',
    'crewing',
    'scouting',
    'catering',
    'accommodation',
    'transportation',
    'casting'
];

// Categories for mega menu
// Categories for mega menu
const SERVICE_CATEGORIES: Record<string, { label: { en: string; fr: string }; slugs: string[] }> = {
    production: {
        label: { en: 'Production Services', fr: 'Services de Production' },
        slugs: ['crewing', 'casting', 'security-management']
    },
    equipment: {
        label: { en: 'Equipment & Logistics', fr: 'Équipement & Logistique' },
        slugs: ['equipment-hire', 'film-shipping', 'transportation', 'accommodation']
    },
    art: {
        label: { en: 'Art & Design', fr: 'Art & Design' },
        slugs: ['production-design', 'props-set-dressing', 'costume-wardrobe', 'makeup-hair']
    },
    locations: {
        label: { en: 'Locations & Support', fr: 'Lieux & Support' },
        slugs: ['scouting', 'film-permits', 'catering']
    }
};

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
    'makeup-hair': Palette,
    'costume-wardrobe': Shirt,
    'props-set-dressing': Box,
    'production-design': Paintbrush,
    'security-management': ShieldAlert,
};

export function ServicesMegaMenu({ lng, label }: ServicesDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();

    // Fetch services on mount using server action
    useEffect(() => {
        async function fetchServices() {
            try {
                const allServices = await getServicesForNav();
                // Show ALL active services, do not filter by hardcoded list
                setServices(allServices);
            } catch (error) {
                console.error('Failed to fetch services:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchServices();
    }, []);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
    };

    // Check if any service page is active
    const isServicesActive = pathname.includes(`/${lng}/services`) || pathname === `/${lng}/equipment`;

    // Get service link
    const getServiceHref = (slug: string) => {
        if (slug === 'equipment-hire') {
            return `/${lng}/equipment`;
        }
        return `/${lng}/services/${slug}`;
    };

    // Get localized title
    const getTitle = (service: ServiceItem) => {
        if (lng === 'fr' && service.title_fr) {
            return service.title_fr;
        }
        return service.title;
    };

    // Get services by category with fallbacks
    const getCategorizedServices = () => {
        const categorized: Record<string, ServiceItem[]> = {
            production: [],
            equipment: [],
            support: [],
            other: []
        };

        const usedIds = new Set<string>();

        // Fill known categories
        Object.entries(SERVICE_CATEGORIES).forEach(([catKey, catDef]) => {
            const found = services.filter(s => catDef.slugs.includes(s.slug));
            found.forEach(s => usedIds.add(s.id));
            categorized[catKey] = found;
        });

        // Find uncategorized
        const others = services.filter(s => !usedIds.has(s.id));
        if (others.length > 0) {
            categorized.other = others;
        }

        return categorized;
    };

    const categorizedServices = getCategorizedServices();
    const hasOther = categorizedServices.other.length > 0;

    const t = lng === 'fr' ? {
        allServices: 'Tous les services',
        needCustom: 'Besoin d\'une solution sur mesure?',
        contactUs: 'Contactez-nous pour des services personnalisés',
        getQuote: 'Obtenir un devis',
        other: 'Autres Services'
    } : {
        allServices: 'All Services',
        needCustom: 'Need a custom solution?',
        contactUs: 'Contact us for tailored production services',
        getQuote: 'Get Quote',
        other: 'Other Services'
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger Button */}
            <button
                className={cn(
                    "flex items-center gap-1.5 px-6 py-2 rounded-full text-sm font-medium transition-colors font-sans",
                    isServicesActive
                        ? "bg-white text-black shadow-sm"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                )}
            >
                {label}
                <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            {/* Mega Menu Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[850px] bg-zinc-900/98 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
                    >
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 border-l border-t border-white/10 rotate-45" />

                        {/* Content */}
                        <div className="relative z-10">
                            {isLoading ? (
                                <div className="p-8 text-center text-zinc-500 text-sm">
                                    Loading...
                                </div>
                            ) : (
                                <>
                                    {/* Categories Grid - Adaptive Columns */}
                                    <div className="grid grid-cols-4 gap-8">
                                        {/* Standard Categories */}
                                        {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => {
                                            const items = categorizedServices[key];
                                            // Render even if empty to maintain grid structure? Or hide? 
                                            // Maintaining structure is usually better for layout stability
                                            if (items.length === 0 && !hasOther) return null;

                                            return (
                                                <div key={key}>
                                                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                                                        {category.label[lng as 'en' | 'fr'] || category.label.en}
                                                    </h3>
                                                    <div className="space-y-1">
                                                        {items.map((service) => {
                                                            const href = getServiceHref(service.slug);
                                                            const isActive = pathname === href || pathname.startsWith(`${href}/`);
                                                            const Icon = SERVICE_ICONS[service.slug] || Package; // Fallback icon

                                                            return (
                                                                <Link
                                                                    key={service.id}
                                                                    href={href}
                                                                    className={cn(
                                                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                                                                        isActive
                                                                            ? "bg-white/10 text-white"
                                                                            : "text-zinc-300 hover:bg-white/5 hover:text-white"
                                                                    )}
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    <span className={cn(
                                                                        "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                                                                        isActive
                                                                            ? "bg-[#D00000]/20 text-[#D00000]"
                                                                            : "bg-white/5 text-zinc-400 group-hover:bg-[#D00000]/10 group-hover:text-[#D00000]"
                                                                    )}>
                                                                        <Icon className="w-4 h-4" />
                                                                    </span>
                                                                    <span className="text-sm font-medium line-clamp-1">
                                                                        {getTitle(service)}
                                                                    </span>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Other Services - Only if exists */}
                                        {hasOther && (
                                            <div>
                                                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                                                    {t.other}
                                                </h3>
                                                <div className="space-y-1">
                                                    {categorizedServices.other.map((service) => {
                                                        const href = getServiceHref(service.slug);
                                                        const isActive = pathname === href || pathname.startsWith(`${href}/`);
                                                        const Icon = SERVICE_ICONS[service.slug] || Package;

                                                        return (
                                                            <Link
                                                                key={service.id}
                                                                href={href}
                                                                className={cn(
                                                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                                                                    isActive
                                                                        ? "bg-white/10 text-white"
                                                                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                                                                )}
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                <span className={cn(
                                                                    "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                                                                    isActive
                                                                        ? "bg-[#D00000]/20 text-[#D00000]"
                                                                        : "bg-white/5 text-zinc-400 group-hover:bg-[#D00000]/10 group-hover:text-[#D00000]"
                                                                )}>
                                                                    <Icon className="w-4 h-4" />
                                                                </span>
                                                                <span className="text-sm font-medium line-clamp-1">
                                                                    {getTitle(service)}
                                                                </span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom CTA */}
                                    <div className="mt-6 pt-5 border-t border-white/10">
                                        <div className="flex items-center justify-between bg-gradient-to-r from-[#D00000]/10 via-[#D00000]/5 to-transparent p-4 rounded-xl">
                                            <div>
                                                <p className="font-semibold text-white">{t.needCustom}</p>
                                                <p className="text-sm text-zinc-400 mt-0.5">{t.contactUs}</p>
                                            </div>
                                            <Link
                                                href={`/${lng}/contact`}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-[#D00000] rounded-lg text-sm font-semibold hover:bg-[#B00000] transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {t.getQuote}
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

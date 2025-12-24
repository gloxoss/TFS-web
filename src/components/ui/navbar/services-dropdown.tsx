"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Package, Truck, FileCheck, Users, MapPin, Utensils, Hotel, Car, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getServicesForNav, type ServiceItem } from "@/lib/actions/services";

interface ServicesDropdownProps {
    lng: string;
    label: string;
}

// Icon mapping for services
const SERVICE_ICONS: Record<string, React.ReactNode> = {
    'equipment-hire': <Package className="w-4 h-4" />,
    'film-shipping': <Truck className="w-4 h-4" />,
    'film-permits': <FileCheck className="w-4 h-4" />,
    'crewing': <Users className="w-4 h-4" />,
    'scouting': <MapPin className="w-4 h-4" />,
    'catering': <Utensils className="w-4 h-4" />,
    'accommodation': <Hotel className="w-4 h-4" />,
    'transportation': <Car className="w-4 h-4" />,
    'casting': <UserCheck className="w-4 h-4" />,
};

export function ServicesDropdown({ lng, label }: ServicesDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();

    // Fetch services on mount using server action
    useEffect(() => {
        async function fetchServices() {
            try {
                const data = await getServicesForNav();
                setServices(data);
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
        timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
    };

    // Check if any service page is active
    const isServicesActive = pathname.includes(`/${lng}/services`) || pathname === `/${lng}/equipment`;

    // Get service link - equipment-hire goes to /equipment, others to /services/[slug]
    const getServiceHref = (slug: string) => {
        if (slug === 'equipment-hire') {
            return `/${lng}/equipment`;
        }
        return `/${lng}/services/${slug}`;
    };

    // Get localized title (using snake_case field names from PocketBase)
    const getTitle = (service: Service) => {
        if (lng === 'fr' && service.title_fr) {
            return service.title_fr;
        }
        return service.title;
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

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl"
                    >
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900/95 border-l border-t border-white/10 rotate-45" />

                        {/* Services List */}
                        <div className="relative z-10">
                            {isLoading ? (
                                <div className="p-4 text-center text-zinc-500 text-sm">
                                    Loading...
                                </div>
                            ) : services.length === 0 ? (
                                <div className="p-4 text-center text-zinc-500 text-sm">
                                    No services available
                                </div>
                            ) : (
                                services.map((service) => {
                                    const href = getServiceHref(service.slug);
                                    const isActive = pathname === href || pathname.startsWith(`${href}/`);
                                    const Icon = SERVICE_ICONS[service.slug];

                                    return (
                                        <Link
                                            key={service.id}
                                            href={href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group",
                                                isActive
                                                    ? "bg-white/10 text-white"
                                                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className={cn(
                                                "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                isActive
                                                    ? "bg-[#D00000]/20 text-[#D00000]"
                                                    : "bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-white"
                                            )}>
                                                {Icon || <Package className="w-4 h-4" />}
                                            </span>
                                            <span className="text-sm font-medium">
                                                {getTitle(service)}
                                            </span>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

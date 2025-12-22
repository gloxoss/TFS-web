'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Clapperboard, Tv, Radio, MonitorPlay, Mic2, Camera, Video, Settings, LayoutGrid, HardDrive } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { EvervaultCard, Icon } from "@/components/ui/evervault-card"

const SERVICES = [
    {
        id: 1,
        slug: 'sporting-events',
        title: 'Sporting Events',
        description: 'Dynamic and immersive broadcasts for major competitions (CAN, World Cup).',
        icon: <TrophyIcon className="w-6 h-6" />,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe436cd9?q=80&w=2600&auto=format&fit=crop'
    },
    {
        id: 2,
        slug: 'film-production',
        title: 'Film Production',
        description: 'Executive production services with state-of-the-art camera and lighting fleets.',
        icon: <Clapperboard className="w-6 h-6" />,
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2559&auto=format&fit=crop'
    },
    {
        id: 3,
        slug: 'tv-recording',
        title: 'TV Recording',
        description: 'High-quality capabilities for television works, sitcoms, and series.',
        icon: <Tv className="w-6 h-6" />,
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2070'
    },
    {
        id: 4,
        slug: 'live-events',
        title: 'Live Events & Festivals',
        description: 'Visual expertise for cultural events like Mawazine and live performances.',
        icon: <Mic2 className="w-6 h-6" />,
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: 5,
        slug: 'studio-infrastructure',
        title: 'Studio Infrastructure',
        description: 'Fully equipped TV studio with soundproofing and innovative decor services.',
        icon: <LayoutGrid className="w-6 h-6" />,
        image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=2670&auto=format&fit=crop'
    },
    // Row 2
    {
        id: 6,
        slug: 'ob-vans',
        title: 'OB Vans & Mobile Units',
        description: 'Mobile recording setups offering maximum flexibility for any event.',
        icon: <Radio className="w-6 h-6" />,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2528&auto=format&fit=crop'
    },
    {
        id: 7,
        slug: 'consulting-design',
        title: 'Consulting & Design',
        description: 'Technical consulting and audiovisual design for complex projects.',
        icon: <Settings className="w-6 h-6" />,
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: 8,
        slug: 'post-production',
        title: 'Post-Production',
        description: 'Advanced solutions for editing, color grading, and enhancement.',
        icon: <MonitorPlay className="w-6 h-6" />,
        image: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?q=80&w=2664&auto=format&fit=crop'
    },
    {
        id: 9,
        slug: 'equipment-rental',
        title: 'Equipment Rental',
        description: 'The largest technical fleet in the region: cameras, lenses, and lighting.',
        icon: <Camera className="w-6 h-6" />,
        image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: 10,
        slug: 'digital-storage',
        title: 'Digital & Storage',
        description: 'Secure storage and digital transmission solutions for large-scale media.',
        icon: <HardDrive className="w-6 h-6" />,
        image: 'https://images.unsplash.com/photo-1558494949-ef526b01201b?q=80&w=2670&auto=format&fit=crop'
    }
]

function TrophyIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}

function ExpandingCardRow({ items, startIndex, lng }: { items: typeof SERVICES, startIndex: number, lng: string }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [centeredIndex, setCenteredIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Check if mobile on mount and resize
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // On mobile ONLY, detect which card is centered in viewport
    useEffect(() => {
        if (typeof window === 'undefined' || !isMobile) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                        const index = cardRefs.current.findIndex(ref => ref === entry.target);
                        if (index !== -1) {
                            setCenteredIndex(index);
                        }
                    }
                });
            },
            { threshold: [0.6], rootMargin: "-20% 0px -20% 0px" }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [items, isMobile]);

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full h-[800px] md:h-[500px]">
            {items.map((item, index) => {
                // Desktop: hover ONLY. Mobile: centered (scroll) detection
                const isHovered = hoveredIndex === index;
                const isCentered = isMobile && centeredIndex === index;
                const isActive = isHovered || isCentered;

                return (
                    <Link
                        key={item.id}
                        href={`/${lng}/services/${item.slug}`}
                        className="contents"
                    >
                        <motion.div
                            ref={(el: HTMLDivElement | null) => { cardRefs.current[index] = el; }}
                            onHoverStart={() => setHoveredIndex(index)}
                            onHoverEnd={() => setHoveredIndex(null)}
                            className={cn(
                                "relative overflow-hidden rounded-2xl cursor-pointer border border-white/10 group transition-all duration-700 ease-out",
                                "flex flex-col justify-end p-6",
                            )}
                            initial={{ flex: 1 }}
                            animate={{
                                flex: isActive ? 3 : 1,
                            }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Background Image */}
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className={cn(
                                    "object-cover absolute inset-0 z-0 transition-transform duration-700",
                                    isActive ? "scale-110 blur-[1px]" : "grayscale scale-100"
                                )}
                            />
                            <div className={cn("absolute inset-0 bg-black/40 z-10 transition-opacity duration-500", isActive ? "opacity-60" : "opacity-30")} />

                            {/* Evervault Effect Overlay (Only on active) */}
                            <div className={cn(
                                "absolute inset-0 z-20 opacity-0 transition-opacity duration-300 pointer-events-none mix-blend-screen",
                                isActive ? "opacity-100" : ""
                            )}>
                                <EvervaultCard className="w-full h-full" />
                            </div>

                            {/* Corner Icons (Decorative) */}
                            <Icon className="absolute h-6 w-6 top-3 left-3 text-white/50 z-30" />
                            <Icon className="absolute h-6 w-6 bottom-3 left-3 text-white/50 z-30" />
                            <Icon className="absolute h-6 w-6 top-3 right-3 text-white/50 z-30" />
                            <Icon className="absolute h-6 w-6 bottom-3 right-3 text-white/50 z-30" />

                            {/* Content */}
                            <div className="relative z-30">
                                <motion.h3
                                    layout
                                    className="text-xl md:text-2xl font-bold font-display uppercase tracking-wider text-white drop-shadow-lg leading-tight mb-2"
                                >
                                    {item.title}
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-sm text-zinc-300 font-medium overflow-hidden"
                                >
                                    {item.description}
                                </motion.p>
                            </div>
                        </motion.div>
                    </Link>
                )
            })}
        </div>
    )
}

// Translations
const translations = {
    en: {
        title: 'Our Areas of Intervention',
        subtitle: 'We handle the filming and production of events with proven technical expertise.',
        viewAll: 'View all capabilities'
    },
    fr: {
        title: 'Nos Domaines d\'Intervention',
        subtitle: 'Nous gérons le tournage et la production d\'événements avec une expertise technique éprouvée.',
        viewAll: 'Voir toutes nos capacités'
    }
}

export function ProductionServices({ lng = 'en' }: { lng?: string }) {
    // Split into 2 rows of 5
    const row1 = SERVICES.slice(0, 5);
    const row2 = SERVICES.slice(5, 10);

    const t = translations[lng as keyof typeof translations] || translations.en;

    return (
        <section className="py-24 bg-black relative overflow-hidden px-4 md:px-0">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-900/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t.title}</h2>
                        <p className="text-zinc-400 text-lg">
                            {t.subtitle}
                        </p>
                    </div>
                    <Link
                        href={`/${lng}/services`}
                        className="hidden md:flex items-center gap-2 text-white border-b border-white pb-1 hover:text-purple-400 hover:border-purple-400 transition-colors"
                    >
                        {t.viewAll}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="flex flex-col gap-6">
                    <ExpandingCardRow items={row1} startIndex={0} lng={lng} />
                    <ExpandingCardRow items={row2} startIndex={5} lng={lng} />
                </div>
            </div>
        </section>
    )
}

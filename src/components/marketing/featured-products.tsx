"use client";

import * as React from "react"
import { Product } from "@/services/products/types"
import { ProductCard } from "@/components/catalog/ProductCard"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export const FEATURED_PRODUCTS_MOCK: Product[] = [
    {
        id: "p1",
        nameEn: "ARRI Alexa 35",
        nameFr: "ARRI Alexa 35",
        name: "ARRI Alexa 35",
        slug: "arri-alexa-35",
        categoryId: "cam",
        category: { id: "cam", name: "Cameras", slug: "cameras" },
        imageUrl: "https://images.unsplash.com/photo-1542204165-6b8c9a807d96?q=80&w=2670&auto=format&fit=crop",
        isAvailable: true,
        isFeatured: true
    },
    {
        id: "p2",
        nameEn: "Cooke Anamorphic /i SF",
        nameFr: "Cooke Anamorphic /i SF",
        name: "Cooke Anamorphic /i SF",
        slug: "cooke-anamorphic-sf",
        categoryId: "lens",
        category: { id: "lens", name: "Lenses", slug: "lenses" },
        imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop",
        isAvailable: true,
        isFeatured: true
    },
    {
        id: "p3",
        nameEn: "RED V-Raptor XL",
        nameFr: "RED V-Raptor XL",
        name: "RED V-Raptor XL",
        slug: "red-v-raptor-xl",
        categoryId: "cam",
        category: { id: "cam", name: "Cameras", slug: "cameras" },
        imageUrl: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=2676&auto=format&fit=crop",
        isAvailable: false,
        isFeatured: true
    },
    {
        id: "p4",
        nameEn: "Angenieux Optimo Ultra 12x",
        nameFr: "Angenieux Optimo Ultra 12x",
        name: "Angenieux Optimo Ultra 12x",
        slug: "angenieux-optimo-ultra",
        categoryId: "lens",
        category: { id: "lens", name: "Lenses", slug: "lenses" },
        imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2528&auto=format&fit=crop",
        isAvailable: true,
        isFeatured: true
    },
    {
        id: "p5",
        nameEn: "ARRI SkyPanel S60-C",
        nameFr: "ARRI SkyPanel S60-C",
        name: "ARRI SkyPanel S60-C",
        slug: "arri-skypanel-s60",
        categoryId: "light",
        category: { id: "light", name: "Lighting", slug: "lighting" },
        imageUrl: "https://images.unsplash.com/photo-1588693850125-964205f242aa?q=80&w=2672&auto=format&fit=crop",
        isAvailable: true,
        isFeatured: true
    }
];

interface FeaturedProductsProps {
    title: string;
    subtitle: string;
    lng: string; // Needed for links
}

export default function FeaturedProducts({ title, subtitle, lng }: FeaturedProductsProps) {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Decoration: INTENSIFIED RED GLOW */}
            {/* Center Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[500px] bg-[#D00000]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Secondary Accent Glow (Bottom Right) */}
            <div className="absolute bottom-0 right-[-20%] w-[600px] h-[600px] bg-[#D00000]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-tight text-white mb-2">
                            {title}
                        </h2>
                        <p className="text-zinc-400 max-w-xl">
                            {subtitle}
                        </p>
                    </div>
                    {/* Could add a 'View All' link here */}
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {/* Mobile: basis-[75%] shows ~1.3 cards to indicate scrollable content */}
                        {FEATURED_PRODUCTS_MOCK.map((product) => (
                            <CarouselItem key={product.id} className="pl-4 basis-[75%] sm:basis-[60%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <ProductCard
                                    product={product}
                                    lng={lng}
                                    className="h-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#D00000]/50 transition-colors duration-300"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="hidden md:block">
                        <CarouselPrevious className="left-[-20px] bg-black/50 border-white/10 hover:bg-[#D00000] hover:border-[#D00000] text-white" />
                        <CarouselNext className="right-[-20px] bg-black/50 border-white/10 hover:bg-[#D00000] hover:border-[#D00000] text-white" />
                    </div>
                </Carousel>
            </div>
        </section >
    );
}

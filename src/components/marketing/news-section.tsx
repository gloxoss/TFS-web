"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

interface NewsSectionProps {
    title: string;
    lng?: string;
    items: {
        category: string;
        title: string;
        slug?: string;
        image?: string;
    }[];
}

export default function NewsSection({ title, items, lng = 'en' }: NewsSectionProps) {
    // Map items to the format expected by InfiniteMovingCards
    const cardItems = items.map(item => ({
        quote: item.title,
        name: item.category,
        title: "Read More",
        image: item.image,
        href: item.slug ? `/${lng}/blog/${item.slug}` : undefined,
    }));

    return (
        <div className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
            {/* Vignette */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h2 className="text-sm font-bold tracking-widest text-white/50 font-mono uppercase text-center">{title}</h2>
            </div>

            <InfiniteMovingCards
                items={cardItems}
                direction="right"
                speed="slow"
            />
        </div>
    );
}

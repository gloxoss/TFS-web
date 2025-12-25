"use client";

import React from "react";
import { useTranslation } from "@/app/i18n/client";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import dynamic from "next/dynamic";
const Globe = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-neutral-900 animate-pulse rounded-xl" />
});
import type { GlobeConfig } from "@/components/ui/globe";
import { motion } from "framer-motion";
import {
    IconGlobe,
    IconBuildingSkyscraper,
    IconTruckDelivery,
    IconUsersGroup,
    IconCertificate
} from "@tabler/icons-react";
import Image from "next/image";

interface GlobalOperationsGridProps {
    lng: string;
}

export default function GlobalOperationsGrid({ lng }: GlobalOperationsGridProps) {
    const { t } = useTranslation(lng, "about");

    // Globe Configuration
    const globeConfig: GlobeConfig = {
        pointSize: 4,
        globeColor: "#0D0D0D",
        showAtmosphere: true,
        atmosphereColor: "#FFFFFF",
        atmosphereAltitude: 0.1,
        emissive: "#111111",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: "rgba(255,255,255,0.7)",
        ambientLight: "#38bdf8",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 1500,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 31.7917, lng: -7.0926 }, // Morocco
        autoRotate: true,
        autoRotateSpeed: 0.5,
    };

    // Arcs & Rings Data
    const casablanca = { lat: 33.5731, lng: -7.5898 };
    const arcs = [
        { startLat: 34.0522, startLng: -118.2437, endLat: casablanca.lat, endLng: casablanca.lng, arcAlt: 0.3, color: "#D00000", order: 1 }, // LA
        { startLat: 51.5074, startLng: -0.1278, endLat: casablanca.lat, endLng: casablanca.lng, arcAlt: 0.1, color: "#D00000", order: 2 }, // London
        { startLat: 48.8566, startLng: 2.3522, endLat: casablanca.lat, endLng: casablanca.lng, arcAlt: 0.1, color: "#D00000", order: 3 }, // Paris
        { startLat: 25.2048, startLng: 55.2708, endLat: casablanca.lat, endLng: casablanca.lng, arcAlt: 0.2, color: "#D00000", order: 4 }, // Dubai
        { startLat: -33.9249, startLng: 18.4241, endLat: casablanca.lat, endLng: casablanca.lng, arcAlt: 0.3, color: "#D00000", order: 5 }, // Cape Town
        { startLat: 35.6762, startLng: 139.6503, endLat: casablanca.lat, endLng: casablanca.lng, arcAlt: 0.5, color: "#D00000", order: 6 }, // Tokyo
        { startLat: 40.7128, startLng: -74.0060, endLat: casablanca.lat, endLng: casablanca.lng, arcAlt: 0.2, color: "#D00000", order: 7 }, // NYC
    ];
    const rings = [{ lat: casablanca.lat, lng: casablanca.lng, color: "#D00000" }];

    const items = [
        // 1. Main Global Reach Card (Span 2 columns) - The Globe
        {
            title: t("international.title"),
            description: t("international.description"),
            header: (
                <div className="flex flex-1 w-full h-full min-h-[12rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 relative overflow-hidden group/globe">
                    {/* Globe Wrapper */}
                    <div className="absolute inset-0 z-0 opacity-80 group-hover/globe:opacity-100 transition-opacity duration-500 scale-150 translate-y-12 md:translate-y-8 -translate-x-12">
                        <Globe globeConfig={globeConfig} data={arcs} rings={rings} />
                    </div>
                </div>
            ),
            className: "md:col-span-1", // Square card
            icon: <IconGlobe className="h-4 w-4 text-neutral-500" />,
        },
        // 2. Casablanca Hub (The specific "One Big Dot" context in text)
        {
            title: t("operations.cards.hq.title"),
            description: t("operations.cards.hq.description"),
            header: <SkeletonOne />,
            className: "md:col-span-1",
            icon: <IconBuildingSkyscraper className="h-4 w-4 text-neutral-500" />,
        },
        // 3. Logistics & Customs
        {
            title: t("operations.cards.logistics.title"),
            description: t("operations.cards.logistics.description"),
            header: <SkeletonTwo />,
            className: "md:col-span-1",
            icon: <IconTruckDelivery className="h-4 w-4 text-neutral-500" />,
        },
        // 4. Crew & Talent
        {
            title: t("operations.cards.crew.title"),
            description: t("operations.cards.crew.description"),
            header: <SkeletonThree />,
            className: "md:col-span-3", // Full width
            icon: <IconUsersGroup className="h-4 w-4 text-neutral-500" />,
        },
    ];

    return (
        <section className="py-20 bg-black">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <span className="text-[#D00000] font-medium tracking-widest uppercase text-sm mb-2 block">
                        {t("international.label")}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display text-white mb-4">
                        International Standard, Local Soul
                    </h2>
                    <p className="text-zinc-400">
                        Bridging the gap for international filmmakers ensuring a seamless production experience in Morocco.
                    </p>
                </div>

                <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[25rem]">
                    {items.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            className={item.className}
                            icon={item.icon}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}

// Placeholder Skeletons for Bento Cards

const SkeletonOne = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-xs text-white font-mono">HUB: CMN</span>
        </div>
    </div>
);

const SkeletonTwo = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#D00000]/10 animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#D00000]/20" />
            </div>
        </div>
    </div>
);

const SkeletonThree = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4 opacity-50 group-hover:opacity-80 transition-opacity">
            <div className="bg-zinc-800 rounded-lg h-full w-full animate-pulse delay-75" />
            <div className="bg-zinc-800 rounded-lg h-full w-full animate-pulse delay-150" />
        </div>
    </div>
);

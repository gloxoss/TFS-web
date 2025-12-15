"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { motion } from "framer-motion";
import { Youtube, Search, Zap, Globe as GlobeIcon } from "lucide-react";
import Image from "next/image";

export default function GlobalOperationsGrid() {
    const features = [
        {
            title: "Real-time Asset Tracking",
            description:
                "Track every lens, camera, and battery in your production package with our live dashboard.",
            skeleton: <SkeletonOne />,
            className:
                "col-span-1 lg:col-span-4 border-b lg:border-r border-white/10",
        },
        {
            title: "Quality Controlled",
            description:
                "Every piece of gear is tested and verified before it leaves our warehouse.",
            skeleton: <SkeletonTwo />,
            className: "border-b col-span-1 lg:col-span-2 border-white/10",
        },
        {
            title: "Expert Support",
            description:
                "Watch our masterclasses or get live support from our technicians.",
            skeleton: <SkeletonThree />,
            className:
                "col-span-1 lg:col-span-3 lg:border-r border-white/10",
        },
        {
            title: "International Partnerships",
            description:
                "We collaborate with world-class production companies across the globe.",
            skeleton: <SkeletonFour />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-none border-white/10",
        },
    ];
    return (
        <div className="relative z-20 w-full overflow-hidden">
            {/* Background Decoration: INTENSIFIED RED GLOW - FULL WIDTH */}
            {/* Center Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1500px] h-[800px] bg-[#D00000]/10 rounded-full blur-[140px] pointer-events-none" />

            {/* Secondary Accent Glow (Bottom Right) */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#D00000]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 relative z-10">
                <div className="px-8 mb-12 relative z-10">
                    <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold font-display uppercase text-white">
                        Operations Excellence
                    </h4>

                    <p className="text-sm lg:text-xl max-w-2xl my-4 mx-auto text-zinc-400 text-center font-light">
                        From local shoots to international blockbusters, our infrastructure scales with you.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-3xl border-white/10 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
                        {features.map((feature) => (
                            <FeatureCard key={feature.title} className={feature.className}>
                                <FeatureTitle>{feature.title}</FeatureTitle>
                                <FeatureDescription>{feature.description}</FeatureDescription>
                                <div className=" h-full w-full">{feature.skeleton}</div>
                            </FeatureCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const FeatureCard = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
            {children}
        </div>
    );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl font-display font-bold uppercase">
            {children}
        </p>
    );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base max-w-4xl text-left mx-auto",
                "text-zinc-400 font-light",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
        >
            {children}
        </p>
    );
};

export const SkeletonOne = () => {
    return (
        <div className="relative flex py-8 px-2 gap-10 h-full">
            <div className="w-full p-5 mx-auto bg-zinc-900 shadow-2xl group h-full rounded-xl border border-white/5">
                <div className="flex flex-1 w-full h-full flex-col space-y-2 relative overflow-hidden rounded-lg">
                    <Image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
                        alt="Dashboard"
                        fill
                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                </div>
            </div>
        </div>
    );
};

export const SkeletonThree = () => {
    return (
        <div className="relative flex gap-10 h-full group/image pt-8">
            <div className="w-full mx-auto bg-transparent group h-full relative rounded-xl overflow-hidden border border-white/10">
                <div className="flex flex-1 w-full h-full flex-col space-y-2 relative">
                    <Youtube className="h-20 w-20 absolute z-10 inset-0 text-red-600 m-auto drop-shadow-lg" />
                    <Image
                        src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2671&auto=format&fit=crop"
                        alt="Youtube"
                        fill
                        className="object-cover opacity-60 group-hover/image:opacity-80 transition-opacity"
                    />
                </div>
            </div>
        </div>
    );
};

export const SkeletonTwo = () => {
    const images = [
        "https://images.unsplash.com/photo-1542204165-6b8c9a807d96?q=80&w=2670&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=2676&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2528&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1588693850125-964205f242aa?q=80&w=2672&auto=format&fit=crop",
    ];

    const imageVariants = {
        whileHover: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
        whileTap: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
    };
    return (
        <div className="relative flex flex-col items-start gap-10 h-full overflow-hidden -mx-8 mt-4">
            <div className="flex flex-row -ml-20">
                {images.map((image, idx) => (
                    <motion.div
                        variants={imageVariants}
                        key={"images-first" + idx}
                        style={{
                            rotate: Math.random() * 20 - 10,
                        }}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="rounded-xl -mr-4 mt-4 p-1 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden"
                    >
                        <div className="relative h-20 w-20 md:h-40 md:w-40 rounded-lg overflow-hidden">
                            <Image
                                src={image}
                                alt="Gear"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
            {/* Gradient Overlays */}
            <div className="absolute left-0 z-10 inset-y-0 w-20 bg-gradient-to-r from-zinc-950 to-transparent h-full pointer-events-none" />
            <div className="absolute right-0 z-10 inset-y-0 w-20 bg-gradient-to-l from-zinc-950 to-transparent h-full pointer-events-none" />
        </div>
    );
};

export const SkeletonFour = () => {
    return (
        <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent mt-10">
            <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
        </div>
    );
};

export const Globe = ({ className }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.1, 0.1, 0.1],
            markerColor: [0.6, 0.6, 0.6], // Gray markers as requested
            glowColor: [0.2, 0.2, 0.2],
            markers: [
                { location: [31.7917, -7.0926], size: 0.15 }, // Morocco (Bigger to take attention)
                { location: [34.0522, -118.2437], size: 0.05 }, // LA
                { location: [51.5072, -0.1276], size: 0.05 }, // London
                { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
                { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
                { location: [25.2048, 55.2708], size: 0.05 }, // Dubai
            ],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            className={className}
        />
    );
};

"use client";

import React from "react";
import BentoFeatures from "@/components/marketing/bento-features";
import { Globe, Cpu, BarChart3, Layers, MonitorPlay } from "lucide-react";

// --- Sample Data for Playground ---
const PLAYGROUND_BENTO_ITEMS = [
    {
        title: "Global Edge Network",
        description: "Your content delivered from 200+ cities worldwide with <50ms latency.",
        icon: Globe,
        className: "md:col-span-2",
        theme: "light" as const,
    },
    {
        title: "Real-time Encoding",
        description: "Process 8K video streams on the fly with our distributed GPU cluster.",
        icon: Cpu,
        theme: "dark" as const,
    },
    {
        title: "Cinematic Color Science",
        description: "Proprietary LUTs and color pipelines.",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2825&auto=format&fit=crop",
        theme: "image" as const,
        className: "md:col-span-1 md:row-span-2",
    },
    {
        title: "Instant Analytics",
        description: "Track engagement, heatmaps, and drop-off rates.",
        icon: BarChart3,
        stat: "99.9%",
        className: "md:col-span-1",
    },
    {
        title: "Asset Optimization",
        description: "Automatic compression and format selection (AVIF/WebP).",
        icon: Layers,
        className: "md:col-span-1",
    },
];

export default function HomepagePlayground() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold font-display">Homepage Components Playground</h1>
                    <p className="text-gray-500">Prototyping sections step by step.</p>
                </div>

                {/* Section 1: Bento Grid Features */}
                <section>
                    <div className="mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Component: BentoFeatures</span>
                    </div>

                    <div className="border border-dashed border-gray-300 rounded-lg overflow-hidden">
                        <BentoFeatures
                            title="The Platform"
                            subtitle="Built for Mass Impact"
                            description="Prototype of the features section."
                            items={PLAYGROUND_BENTO_ITEMS}
                        />
                    </div>
                </section>

                {/* Placeholder for Next Sections */}
                <section className="opacity-50">
                    <div className="mb-4">
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Coming Soon: Testimonials</span>
                    </div>
                    <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                        <p className="text-gray-400">Social Proof Component will go here</p>
                    </div>
                </section>

            </div>
        </div>
    );
}

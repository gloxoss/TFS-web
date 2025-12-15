"use client";
import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
    ssr: false,
});

export default function GlobeDemo() {
    const globeConfig = {
        pointSize: 4,
        globeColor: "#000000", // Black globe for current theme
        showAtmosphere: true,
        atmosphereColor: "#FFFFFF",
        atmosphereAltitude: 0.1,
        emissive: "#062056",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: "rgba(255,255,255,0.7)",
        ambientLight: "#38bdf8",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 1000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 31.7917, lng: -7.0926 }, // Center on Morocco
        autoRotate: true,
        autoRotateSpeed: 0.5,
    };
    const colors = ["#D00000", "#3b82f6", "#6366f1"]; // Using Red, Blue, Indigo

    // Custom Arcs centered on Morocco (Lat: 31.79, Lng: -7.09)
    const sampleArcs = [
        // Morocco -> Los Angeles
        {
            order: 1,
            startLat: 31.7917,
            startLng: -7.0926,
            endLat: 34.0522,
            endLng: -118.2437,
            arcAlt: 0.3,
            color: colors[0],
        },
        // Morocco -> New York
        {
            order: 1,
            startLat: 31.7917,
            startLng: -7.0926,
            endLat: 40.7128,
            endLng: -74.006,
            arcAlt: 0.2,
            color: colors[0],
        },
        // Morocco -> London
        {
            order: 1,
            startLat: 31.7917,
            startLng: -7.0926,
            endLat: 51.5072,
            endLng: -0.1276,
            arcAlt: 0.1,
            color: colors[1],
        },
        // Morocco -> Paris
        {
            order: 2,
            startLat: 31.7917,
            startLng: -7.0926,
            endLat: 48.8566,
            endLng: -2.3522,
            arcAlt: 0.1,
            color: colors[1],
        },
        // Morocco -> Dubai
        {
            order: 2,
            startLat: 31.7917,
            startLng: -7.0926,
            endLat: 25.2048,
            endLng: 55.2708,
            arcAlt: 0.3,
            color: colors[2],
        },
        // Morocco -> Cape Town
        {
            order: 2,
            startLat: 31.7917,
            startLng: -7.0926,
            endLat: -33.9249,
            endLng: 18.4241,
            arcAlt: 0.4,
            color: colors[2],
        },
        // Morocco -> Tokyo
        {
            order: 3,
            startLat: 31.7917,
            startLng: -7.0926,
            endLat: 35.6762,
            endLng: 139.6503,
            arcAlt: 0.5,
            color: colors[1],
        },
        // Morocco -> Sydney
        {
            order: 3,
            startLat: 31.7917,
            startLng: -7.0926,
            endLat: -33.8688,
            endLng: 151.2093,
            arcAlt: 0.6,
            color: colors[0],
        },
        // Morocco -> Rio
        {
            order: 4,
            startLat: 31.7917,
            startLng: -7.0926,
            endLat: -22.9068,
            endLng: -43.1729,
            arcAlt: 0.4,
            color: colors[2],
        },
    ];

    return (
        <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto bg-black relative w-full">
            <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 1,
                    }}
                    className="div text-center z-10 relative"
                >
                    <h2 className="text-center text-xl md:text-3xl font-bold text-white font-display uppercase tracking-widest">
                        Based in Morocco
                    </h2>
                    <p className="text-center text-base md:text-lg font-light text-neutral-400 max-w-md mt-2 mx-auto">
                        Connecting Productions Worldwide
                    </p>
                </motion.div>
                {/* Gradients */}
                <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent to-black z-40" />
                <div className="absolute w-full -bottom-20 h-72 md:h-full z-10">
                    <World data={sampleArcs} globeConfig={globeConfig} />
                </div>
            </div>
        </div>
    );
}

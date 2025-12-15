"use client";

import { motion } from "framer-motion";

const CLIENTS = [
    "NETFLIX",
    "HBO",
    "SONY PICTURES",
    "UNIVERSAL",
    "WARNER BROS",
    "DISNEY+",
    "APPLE TV+",
    "PARAMOUNT",
    "AMAZON STUDIOS"
];

export default function SocialProof() {
    return (
        <div className="w-full bg-black py-12 border-y border-white/5 relative overflow-hidden z-20">
            {/* Vignette for Fade In/Out */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

            <div className="flex overflow-hidden relative">
                <motion.div
                    className="flex gap-16 md:gap-32 whitespace-nowrap px-16"
                    animate={{
                        x: [0, -1000]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30, // Slow, cinematic ease
                            ease: "linear",
                        },
                    }}
                >
                    {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                        <span
                            key={i}
                            className="text-2xl md:text-3xl font-display font-bold text-white/20 select-none hover:text-white/60 transition-colors duration-500 cursor-default"
                        >
                            {client}
                        </span>
                    ))}
                </motion.div>

                {/* Second layer for seamless loop if needed, but the triple array above usually covers it for CSS infinite */}
            </div>
        </div>
    );
}

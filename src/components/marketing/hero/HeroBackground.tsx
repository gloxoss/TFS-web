// src/components/marketing/hero/HeroBackground.tsx
"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

// Using a distinct interface allows us to swap image sources easily later (e.g., from CMS)
interface HeroBackgroundProps {
  images: string[];
}

export default function HeroBackground({ images }: HeroBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // LOGIC: Scroll-based Zoom (optimized)
  // Reduced update frequency and added will-change for better performance
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]); // Reduced scale range

  // LOGIC: Auto-Rotate Slider (optimized - longer interval)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 8000); // Increased from 5000ms to 8000ms
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden bg-black">
      {/* ANIMATION STRATEGY: 
         We animate the container div for the scroll zoom,
         and the inner images for the fade transitions.
      */}
      <motion.div 
        style={{ scale }} 
        className="relative h-full w-full will-change-transform"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }} // Reduced from 1.5s
            className="absolute inset-0 will-change-opacity"
          >
            <Image
              src={images[currentIndex]}
              alt="Background"
              fill
              className="object-cover grayscale" // "Congra" style uses B&W images under color
              priority={currentIndex === 0} // Performance optimization for LCP
            />
          </motion.div>
        </AnimatePresence>
        
        {/* OPTIMIZED GRADIENT OVERLAYS - Proper bottom-up gradient */}
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-purple-900/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent" />
        
        {/* LIGHTER NOISE TEXTURE - Reduced opacity and simplified pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      </motion.div>
    </div>
  );
}
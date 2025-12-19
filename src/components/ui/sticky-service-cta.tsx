/**
 * Sticky Service CTA
 * 
 * A scroll-triggered "Rent Equipment" button that appears
 * after the user scrolls past the hero section.
 * 
 * Positioned in the top-right corner, below the main navbar.
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface StickyServiceCTAProps {
    lng?: string
    scrollThreshold?: number
}

export function StickyServiceCTA({
    lng = 'en',
    scrollThreshold = 300
}: StickyServiceCTAProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > scrollThreshold) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [scrollThreshold])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed top-24 right-4 z-50"
                >
                    <Link
                        href={`/${lng}/equipment`}
                        className="flex items-center gap-2 bg-[#D00000] text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:bg-[#D00000]/90 transition-all font-semibold text-sm tracking-wide border border-white/10 backdrop-blur-sm"
                    >
                        <span>Rent Equipment</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

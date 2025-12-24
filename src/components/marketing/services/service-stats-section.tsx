"use client"

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import type { ServiceStat } from '@/services/services/interface'

interface ServiceStatsSectionProps {
    stats: ServiceStat[]
    lng: string
}

function AnimatedNumber({ value, duration = 2 }: { value: string; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true })
    const [displayValue, setDisplayValue] = useState('0')

    useEffect(() => {
        if (!isInView) return

        // Extract numeric part and suffix (e.g., "100%" -> 100, "%")
        const numericMatch = value.match(/^([+-]?)(\d+)(.*)$/)
        if (!numericMatch) {
            setDisplayValue(value)
            return
        }

        const prefix = numericMatch[1]
        const targetNumber = parseInt(numericMatch[2], 10)
        const suffix = numericMatch[3]

        let start = 0
        const increment = targetNumber / (duration * 60) // 60fps

        const animate = () => {
            start += increment
            if (start >= targetNumber) {
                setDisplayValue(`${prefix}${targetNumber}${suffix}`)
            } else {
                setDisplayValue(`${prefix}${Math.floor(start)}${suffix}`)
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [isInView, value, duration])

    return <span ref={ref}>{displayValue}</span>
}

export default function ServiceStatsSection({ stats, lng }: ServiceStatsSectionProps) {
    if (!stats || stats.length === 0) return null

    return (
        <section className="py-10 md:py-16 bg-black/80 backdrop-blur-xl border-y border-white/5">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-wrap justify-center gap-12 md:gap-16 lg:gap-24">
                    {stats.map((stat, index) => {
                        const label = lng === 'fr' && stat.labelFr ? stat.labelFr : stat.label

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-5xl md:text-7xl font-display font-bold text-white mb-2">
                                    <AnimatedNumber value={stat.value} />
                                </div>
                                <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-widest">
                                    {label}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

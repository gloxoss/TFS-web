"use client"

import { motion } from 'framer-motion'

interface ServiceTagsSectionProps {
    tags: string[]
}

export default function ServiceTagsSection({ tags }: ServiceTagsSectionProps) {
    if (!tags || tags.length === 0) return null

    return (
        <div className="py-8 bg-black">
            <div className="container mx-auto px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-wrap justify-center gap-2"
                >
                    {tags.map((tag, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            className="px-4 py-1.5 text-xs uppercase tracking-widest text-zinc-500 font-medium"
                        >
                            {tag}
                        </motion.span>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react'

export function ExpertSection() {
    return (
        <section className="py-24 bg-black relative">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Col: Expertise Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Recognized Expertise</h2>
                            <div className="w-20 h-1 bg-purple-500 rounded-full mb-8" />
                        </div>

                        <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                            <p>
                                The expertise of our teams, combined with a high-tech equipment fleet, ensures our mastery of the entire audiovisual production chain, allowing us to meet our clients capabilities effectively.
                            </p>
                            <p>
                                Our know-how is now recognized in Morocco, in Africa, and in the Middle East for major audiovisual events: sports, entertainment, live performances, and the production of television works (fiction, films, TV series, sitcoms).
                            </p>
                            <p>
                                To complete our range of services, TFS has equipped a TV studio within its facilities that meets the highest requirements in terms of audiovisual equipment, soundproofing, and innovative decor services.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            {['International Standards', 'High-Tech Fleet', 'Expert Teams', 'Complete Mastery'].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-white font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Col: Contact/Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl transform rotate-1 opacity-20 blur-lg" />
                        <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 space-y-8">

                            <h3 className="text-2xl font-bold text-white">Contact Us</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 text-sm">Headquarters</p>
                                        <p className="text-white font-medium">55-57 Rue Souleimane El Farissi</p>
                                        <p className="text-white">Ain Borja, 20320 Casablanca - Maroc</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 text-sm">Phone</p>
                                        <p className="text-white font-medium">+212 522 246 372</p>
                                        <p className="text-white">+212 522 241 396</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 text-sm">Email</p>
                                        <a href="mailto:info@tfs.ma" className="text-white font-medium hover:text-purple-400 transition-colors">info@tfs.ma</a>
                                        <p className="text-zinc-500 text-sm mt-1">www.tfs.ma</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-zinc-800">
                                <div className="flex justify-between items-center text-center">
                                    <div>
                                        <p className="text-3xl font-bold text-white">21+</p>
                                        <p className="text-xs text-zinc-500 uppercase tracking-widest">Years</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-white">500+</p>
                                        <p className="text-xs text-zinc-500 uppercase tracking-widest">Projects</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-white">100%</p>
                                        <p className="text-xs text-zinc-500 uppercase tracking-widest">Reliability</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

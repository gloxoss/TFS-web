import React from "react"
import { PlusCard } from "@/components/ui/plus-card"
import { MapPin, Phone, Mail, Trophy, Briefcase, ShieldCheck } from "lucide-react"
import { homePage, t } from "@/data/site-content"

export function ExpertiseBento({ lng = 'en' }: { lng?: string }) {
    // Access expertBento content from homePage
    // If not found (due to cache/updates), fallback to empty structure or error handle
    const content = homePage.expertBento || {
        title: { en: "Global Expertise", fr: "Expertise" },
        mainTitle: { en: "EXPERTISE", fr: "EXPERTISE" },
        mainDescription: { en: [], fr: [] },
        stats: {
            stat1: { title: { en: "", fr: "" }, desc: { en: "", fr: "" } },
            stat2: { title: { en: "", fr: "" }, desc: { en: "", fr: "" } },
            fact1: { title: { en: "", fr: "" }, desc: { en: "", fr: "" } },
            fact2: { title: { en: "", fr: "" }, desc: { en: "", fr: "" } },
            fact3: { title: { en: "", fr: "" }, desc: { en: "", fr: "" } },
        }
    }

    // Helper to get localized string array
    const getList = (c: { en: string[], fr: string[] }) => c[lng as keyof typeof c] || c.en

    return (
        <section className="bg-black py-24 relative overflow-hidden">
            {/* Background Elements matching "Cinema" vibe */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D00000]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto container max-w-7xl px-4 relative z-10">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold font-display uppercase tracking-tight text-white mb-4">
                        {t(content.title, lng)}
                    </h2>
                    <div className="w-24 h-1 bg-[#D00000]" />
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(180px,auto)] gap-4">

                    {/* Main Text Card */}
                    <PlusCard
                        title={t(content.mainTitle, lng)}
                        description={
                            <div className="space-y-4 mt-4 text-base md:text-lg">
                                {getList(content.mainDescription).map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                        }
                        className="lg:col-span-4 lg:row-span-2 bg-zinc-900/80"
                    />

                    {/* Stat 1 */}
                    <PlusCard
                        title={t(content.stats.stat1.title, lng)}
                        description={t(content.stats.stat1.desc, lng)}
                        icon={<Trophy className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Stat 2 */}
                    <PlusCard
                        title={t(content.stats.stat2.title, lng)}
                        description={t(content.stats.stat2.desc, lng)}
                        icon={<Briefcase className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Fact 1 */}
                    <PlusCard
                        title={t(content.stats.fact1.title, lng)}
                        description={t(content.stats.fact1.desc, lng)}
                        icon={<ShieldCheck className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Fact 2 */}
                    <PlusCard
                        title={t(content.stats.fact2.title, lng)}
                        description={t(content.stats.fact2.desc, lng)}
                        icon={<Briefcase className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Fact 3 */}
                    <PlusCard
                        title={t(content.stats.fact3.title, lng)}
                        description={t(content.stats.fact3.desc, lng)}
                        icon={<Trophy className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                </div>
            </div>
        </section>
    )
}


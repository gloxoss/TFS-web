'use client'

import React from "react"
import { PlusCard } from "@/components/ui/plus-card"
import { MapPin, Phone, Mail, Trophy, Briefcase, ShieldCheck } from "lucide-react"

const translations = {
    en: {
        title: 'Global Expertise',
        mainTitle: 'RECOGNIZED EXPERTISE',
        mainDescription: [
            'The expertise of our teams, combined with a high-tech equipment fleet, ensures our mastery of the entire audiovisual production chain.',
            'Our know-how is now recognized in Morocco, Africa, and the Middle East for major audiovisual events: sports, entertainment, live performances, and TV production.',
            'TFS has equipped a TV studio within its facilities that meets the highest requirements in terms of audiovisual equipment and soundproofing.'
        ],
        stat1Title: '21+ YEARS',
        stat1Desc: 'Leading the industry since 2003 with consistent excellence.',
        stat2Title: '500+ PROJECTS',
        stat2Desc: 'Successfully delivered major events across the region.',
        fact1Title: 'INTERNATIONAL STANDARDS',
        fact1Desc: 'Production quality meeting strict global broadcast requirements.',
        fact2Title: 'HIGH-TECH FLEET',
        fact2Desc: 'State-of-the-art OB Vans and cameras.',
        fact3Title: 'EXPERT TEAMS',
        fact3Desc: 'Highly trained technical staff.'
    },
    fr: {
        title: 'Expertise Mondiale',
        mainTitle: 'EXPERTISE RECONNUE',
        mainDescription: [
            'L\'expertise de nos équipes, combinée à une flotte d\'équipements de haute technologie, garantit notre maîtrise de toute la chaîne de production audiovisuelle.',
            'Notre savoir-faire est désormais reconnu au Maroc, en Afrique et au Moyen-Orient pour les grands événements audiovisuels : sport, divertissement, spectacles vivants et production TV.',
            'TFS a équipé un studio TV dans ses locaux répondant aux plus hautes exigences en matière d\'équipement audiovisuel et d\'insonorisation.'
        ],
        stat1Title: '21+ ANS',
        stat1Desc: 'Leader du secteur depuis 2003 avec une excellence constante.',
        stat2Title: '500+ PROJETS',
        stat2Desc: 'Événements majeurs livrés avec succès dans la région.',
        fact1Title: 'NORMES INTERNATIONALES',
        fact1Desc: 'Qualité de production répondant aux exigences strictes de diffusion mondiale.',
        fact2Title: 'FLOTTE HIGH-TECH',
        fact2Desc: 'Cars OB et caméras à la pointe de la technologie.',
        fact3Title: 'ÉQUIPES EXPERTES',
        fact3Desc: 'Personnel technique hautement qualifié.'
    }
}

export function ExpertiseBento({ lng = 'en' }: { lng?: string }) {
    const t = translations[lng as keyof typeof translations] || translations.en;

    return (
        <section className="bg-black py-24 relative overflow-hidden">
            {/* Background Elements matching "Cinema" vibe */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D00000]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto container max-w-7xl px-4 relative z-10">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold font-display uppercase tracking-tight text-white mb-4">
                        {t.title}
                    </h2>
                    <div className="w-24 h-1 bg-[#D00000]" />
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(180px,auto)] gap-4">

                    {/* Main Text Card */}
                    <PlusCard
                        title={t.mainTitle}
                        description={
                            <div className="space-y-4 mt-4 text-base md:text-lg">
                                {t.mainDescription.map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                        }
                        className="lg:col-span-4 lg:row-span-2 bg-zinc-900/80"
                    />

                    {/* Stat 1 */}
                    <PlusCard
                        title={t.stat1Title}
                        description={t.stat1Desc}
                        icon={<Trophy className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Stat 2 */}
                    <PlusCard
                        title={t.stat2Title}
                        description={t.stat2Desc}
                        icon={<Briefcase className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Fact 1 */}
                    <PlusCard
                        title={t.fact1Title}
                        description={t.fact1Desc}
                        icon={<ShieldCheck className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Fact 2 */}
                    <PlusCard
                        title={t.fact2Title}
                        description={t.fact2Desc}
                        icon={<Briefcase className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                    {/* Fact 3 */}
                    <PlusCard
                        title={t.fact3Title}
                        description={t.fact3Desc}
                        icon={<Trophy className="w-6 h-6" />}
                        className="lg:col-span-2 lg:row-span-1"
                    />

                </div>
            </div>
        </section>
    )
}


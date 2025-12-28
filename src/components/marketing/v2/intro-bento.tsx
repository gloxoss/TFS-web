'use client'

import { Lightbulb, ShieldCheck, Users, Trophy, Star } from 'lucide-react'
import BentoFeatures from "@/components/marketing/bento-features";

const translations = {
    en: {
        title: 'WHO ARE WE?',
        subtitle: 'The Standard of Excellence',
        description: 'We combine technical mastery with logistical power to bring your vision to life.',
        items: [
            {
                title: "A RELIABLE PARTNER",
                description: "We are the technical backbone of the Moroccan audiovisual industry, providing comprehensive solutions from consulting to storage for productions of all scales.",
                stat: "Trusted",
            },
            {
                title: "EXCELLENCE MODEL",
                description: "TFS has built its business model around three fundamental values that form the foundation of its corporate culture.",
            },
            {
                title: "Innovation",
                description: "Every service we deliver is unique. We design specialized solutions with our partners to meet the highest standards.",
            },
            {
                title: "Technical Quality",
                description: "Guaranteed by the expertise of our teams and the reliability of our equipment, devices, and IT/digital solutions.",
            },
            {
                title: "Customer Service",
                description: "We guarantee compliance with deadlines thanks to the professionalism of our teams and efficient operational processes.",
            },
        ]
    },
    fr: {
        title: 'QUI SOMMES-NOUS ?',
        subtitle: 'Le Standard d\'Excellence',
        description: 'Nous combinons maîtrise technique et puissance logistique pour donner vie à votre vision.',
        items: [
            {
                title: "UN PARTENAIRE FIABLE",
                description: "Nous sommes l'épine dorsale technique de l'industrie audiovisuelle marocaine, offrant des solutions complètes du conseil au stockage pour des productions de toutes tailles.",
                stat: "Confiance",
            },
            {
                title: "MODÈLE D'EXCELLENCE",
                description: "TFS a construit son modèle économique autour de trois valeurs fondamentales qui constituent le socle de sa culture d'entreprise.",
            },
            {
                title: "Innovation",
                description: "Chaque service que nous fournissons est unique. Nous concevons des solutions spécialisées avec nos partenaires pour répondre aux plus hauts standards.",
            },
            {
                title: "Qualité Technique",
                description: "Garantie par l'expertise de nos équipes et la fiabilité de nos équipements, appareils et solutions IT/numériques.",
            },
            {
                title: "Service Client",
                description: "Nous garantissons le respect des délais grâce au professionnalisme de nos équipes et à des processus opérationnels efficaces.",
            },
        ]
    }
}

export function IntroBento({ lng = 'en' }: { lng?: string }) {
    const t = translations[lng as keyof typeof translations] || translations.en;

    const items = t.items.map((item, index) => ({
        ...item,
        icon: [<Trophy key={0} />, <Star key={1} />, <Lightbulb key={2} />, <ShieldCheck key={3} />, <Users key={4} />][index],
        className: ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-1", "md:col-span-1"][index],
    }));

    return (
        <BentoFeatures
            title={t.title}
            subtitle={t.subtitle}
            description={t.description}
            items={items}
        />
    )
}


'use client'

import { Lightbulb, ShieldCheck, Users, Trophy, Star } from 'lucide-react'
import BentoFeatures from "@/components/marketing/bento-features";
import { useTranslation } from "@/app/i18n/client";

export function IntroBento({ lng = 'en' }: { lng?: string }) {
    const { t } = useTranslation(lng, 'home');

    const items = [0, 1, 2, 3, 4].map((index) => ({
        title: t(`intro.items.${index}.title`),
        description: t(`intro.items.${index}.description`),
        stat: index === 0 ? t(`intro.items.${index}.stat`) : undefined,
        icon: [<Trophy key={0} />, <Star key={1} />, <Lightbulb key={2} />, <ShieldCheck key={3} />, <Users key={4} />][index],
        className: ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-1", "md:col-span-1"][index],
    }));

    return (
        <BentoFeatures
            title={t('intro.title')}
            subtitle={t('intro.subtitle')}
            description={t('intro.description')}
            items={items}
        />
    )
}


"use client";

import { TextRevealByWord } from "@/components/ui/text-reveal";
import { useTranslation } from "@/app/i18n/client";

interface AboutDescriptionSectionProps {
    lng: string;
}

export default function AboutDescriptionSection({ lng }: AboutDescriptionSectionProps) {
    const { t } = useTranslation(lng, "about");

    return (
        <section className="bg-black relative">
            {/* Background Decoration to blend with Hero */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/0 to-black pointer-events-none" />

            <div className="flex items-center justify-center rounded-lg bg-black dark:bg-black">
                <TextRevealByWord text={t("description_reveal.text")} />
            </div>
        </section>
    );
}

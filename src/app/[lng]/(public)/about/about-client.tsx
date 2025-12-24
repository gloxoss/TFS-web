'use client';

import { useTranslation } from "@/app/i18n/client";
import { motion } from "framer-motion";
import { Shield, Zap, Wrench } from "lucide-react";
import { BackgroundCircles } from "@/components/ui/background-circles";
import AboutDescriptionSection from "@/components/marketing/about/about-description";
import AboutStorySection from "@/components/marketing/about/about-story-section";
import GlobalOperationsGrid from "@/components/marketing/global-operations-grid";
import TeamSection from "@/components/marketing/about/team-section";
import CTASection from "@/components/marketing/cta-section";
import Image from "next/image";

export function AboutClient({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, 'about');

  // Values using Bento Structure
  const VALUES_ITEMS = [
    {
      title: t('values.items.reliability.title'),
      description: t('values.items.reliability.description'),
      icon: <Shield />,
      className: "md:col-span-2",
    },
    {
      title: t('values.items.speed.title'),
      description: t('values.items.speed.description'),
      icon: <Zap />,
    },
    {
      title: t('values.items.innovation.title'),
      description: t('values.items.innovation.description'),
      icon: <Wrench />,
      className: "md:col-span-3", // Full width or large
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white overflow-hidden">

      {/* 1. Hero Section */}
      <div className="relative h-[80vh] w-full mb-60">
        <BackgroundCircles
          title={t('hero.title')}
          description={t('hero.subtitle')}
          variant="primary"
          className="h-full bg-black"
        />
      </div>

      {/* 2. Text Reveal Description */}
      <AboutDescriptionSection lng={lng} />

      {/* 3. Story Section */}
      <AboutStorySection lng={lng} />

      {/* 4. Global Operations (Bento Grid) */}
      <GlobalOperationsGrid lng={lng} />

      {/* 5. Team Section */}
      <TeamSection lng={lng} />

      {/* 5. CTA */}
      <CTASection
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        buttonText={t('cta.button')}
        href={`/${lng}/contact`}
      />

    </main>
  );
}
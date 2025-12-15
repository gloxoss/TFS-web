'use client';

import { useTranslation } from "@/app/i18n/client";
import { motion } from "framer-motion";
import { Shield, Zap, Wrench } from "lucide-react";
import CTASection from "@/components/marketing/cta-section";
import Image from "next/image";
import GlobalOperationsGrid from "@/components/marketing/global-operations-grid";

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
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Decoration: Red Nebula */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[500px] bg-[#D00000]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter leading-[0.85] mb-6"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* 2. Story Section */}
      <section className="py-24 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-sm font-mono text-[#D00000] tracking-widest uppercase mb-4">
              {t('story.title')}
            </h2>
            <p className="text-xl md:text-2xl font-light text-zinc-200 leading-relaxed">
              {t('story.p1')}
            </p>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {t('story.p2')}
            </p>

            {/* Simple Stats Grid */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-display font-bold text-white">10+</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">{t('stats.years')}</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-white">12k+</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">{t('stats.projects')}</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-white">200+</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">{t('stats.countries')}</div>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 group">
            <Image
              src="https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2698&auto=format&fit=crop"
              alt="Production Set"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>
        </div>
      </section>

      {/* 3. Global Operations (Bento Grid with Globe) */}
      <GlobalOperationsGrid />

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
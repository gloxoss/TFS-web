import { createServerClient } from "@/lib/pocketbase/server";
import { Globe, Cpu, BarChart3, Layers, Lock, Headphones } from "lucide-react";
import Link from "next/link";
import HeroImpact from "@/components/marketing/hero-impact";
import BentoFeatures from "@/components/marketing/bento-features";
import { useTranslation } from "@/app/i18n";
import SocialProof from "@/components/marketing/social-proof";
import CTASection from "@/components/marketing/cta-section";


import NewsSection from "@/components/marketing/news-section";
import CategorySection from "@/components/marketing/category-section";
import FeaturedProducts from "@/components/marketing/featured-products";

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;
  const client = await createServerClient();
  const { t } = await useTranslation(lng, 'home');

  // Dynamic Section Data
  const BENTO_ITEMS = [
    {
      title: t('bento.cards.logistics.title'),
      description: t('bento.cards.logistics.description'),
      icon: <Globe />,
      className: "md:col-span-2",
    },
    {
      title: t('bento.cards.kits.title'),
      description: t('bento.cards.kits.description'),
      icon: <Cpu />,
    },
    {
      title: t('bento.cards.manifest.title'),
      description: t('bento.cards.manifest.description'),
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2825&auto=format&fit=crop",
      theme: "image" as const,
      className: "md:col-span-1 md:row-span-2",
      href: "/equipment",
    },
    {
      title: t('bento.cards.quotes.title'),
      description: t('bento.cards.quotes.description'),
      icon: <Lock />,
      stat: t('bento.cards.quotes.stat'),
      className: "md:col-span-2",
    },
    {
      title: t('bento.cards.support.title'),
      description: t('bento.cards.support.description'),
      icon: <Headphones />,
      className: "md:col-span-2",
    },
  ];

  const NEWS_ITEMS = [
    { category: t('news.items.0.category'), title: t('news.items.0.title'), image: t('news.items.0.image') },
    { category: t('news.items.1.category'), title: t('news.items.1.title'), image: t('news.items.1.image') },
    { category: t('news.items.2.category'), title: t('news.items.2.title'), image: t('news.items.2.image') },
    { category: t('news.items.3.category'), title: t('news.items.3.title'), image: t('news.items.3.image') },
  ];

  const CATEGORY_ITEMS = [
    { id: 'camera', title: t('categories.items.0.title'), image: t('categories.items.0.image') },
    { id: 'machinery', title: t('categories.items.1.title'), image: t('categories.items.1.image') },
    { id: 'lighting', title: t('categories.items.2.title'), image: t('categories.items.2.image') },
    { id: 'filters', title: t('categories.items.3.title'), image: t('categories.items.3.image') },
    { id: 'studios', title: t('categories.items.4.title'), image: t('categories.items.4.image') },
    { id: 'post', title: t('categories.items.5.title'), image: t('categories.items.5.image') },
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section - Full Screen */}
      <HeroImpact />

      {/* Social Proof - Infinite Marquee (Between Hero and Bento) */}
      <SocialProof />

      {/* Features Section */}
      <BentoFeatures
        title={t('bento.platform.title')}
        subtitle={t('bento.platform.subtitle')}
        description={t('bento.platform.description')}
        items={BENTO_ITEMS}
      />

      {/* Categories Section (Expanding Strips) */}
      <CategorySection
        title={t('categories.title')}
        subtitle={t('categories.subtitle')}
        items={CATEGORY_ITEMS}
      />

      {/* Featured Products (Carousel) */}
      <FeaturedProducts
        title={t('featured.title')}
        subtitle={t('featured.subtitle')}
        lng={lng}
      />

      {/* News / Blog Section */}
      <NewsSection
        title={t('news.title')}
        items={NEWS_ITEMS}
      />

      {/* Final CTA with Aurora Background */}
      <CTASection
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        buttonText={t('cta.button')}
      />


    </main>
  );
}
/*
 * -----------------------------------------------------------------------------
 * PROJECT:   TFS Digital Transformation
 * ENGINEER:  Oussama Zaki
 * AGENCY:    Epioso (https://epioso.tech)
 * -----------------------------------------------------------------------------
 * COPYRIGHT NOTICE:
 * 
 * 1. CLIENT OWNERSHIP: 
 * TFS (The Client) retains full ownership of all specific content, 
 * branding, client data, and UI design elements created for this instance.
 *
 * 2. DEVELOPER OWNERSHIP (Background Technology):
 * The underlying software architecture, "Kit Builder" logic, database schemas,
 * and generic code libraries remain the exclusive Intellectual Property 
 * of Oussama Zaki (Epioso). 
 *
 * 3. LICENSE GRANT:
 * Upon full payment, the Client is granted a perpetual, non-exclusive, 
 * royalty-free license to use, modify, and maintain this software for 
 * their own business operations.
 *
 * 4. REUSE RIGHTS:
 * The Developer (Epioso) reserves the right to reuse the underlying 
 * technical architecture and logic for other projects.
 * -----------------------------------------------------------------------------
 */

import { createServerClient } from "@/lib/pocketbase/server";
import { useTranslation } from "@/app/i18n";
import { getBlogService, getServicesService } from "@/services";
import HeroImpact from "@/components/marketing/hero-impact";
import SocialProof from "@/components/marketing/social-proof";
import CTASection from "@/components/marketing/cta-section";
import NewsSection from "@/components/marketing/news-section";
import { IntroBento } from "@/components/marketing/v2/intro-bento";
import { ProductionServices } from "@/components/marketing/v2/production-services";
import { ExpertiseBento } from "@/components/marketing/v2/expert-bento";

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;
  const client = await createServerClient();
  const { t } = await useTranslation(lng, 'home');

  // Fetch services from PocketBase
  const servicesService = getServicesService(client);
  const services = await servicesService.getServices();

  // Fetch blog posts
  const blogService = getBlogService(client);
  const blogPosts = await blogService.getLatestPosts(4, lng);

  // Map blog posts to NewsSection format
  const NEWS_ITEMS = blogPosts.length > 0
    ? blogPosts.map((post) => ({
      category: post.category || 'news',
      title: post.title,
      slug: post.slug,
      image: post.coverImage,
    }))
    : [
      { category: t('news.items.0.category'), title: t('news.items.0.title'), image: t('news.items.0.image') },
      { category: t('news.items.1.category'), title: t('news.items.1.title'), image: t('news.items.1.image') },
      { category: t('news.items.2.category'), title: t('news.items.2.title'), image: t('news.items.2.image') },
      { category: t('news.items.3.category'), title: t('news.items.3.title'), image: t('news.items.3.image') },
    ];

  return (
    <main className="min-h-screen bg-black">
      {/* 1. Hero Section */}
      <HeroImpact lng={lng} />

      {/* 2. Partners Slider */}
      <SocialProof />

      {/* 3. Expertise (Moved Up) */}
      <ExpertiseBento lng={lng} />

      {/* 4. Production Services */}
      <ProductionServices lng={lng} services={services} />

      {/* 5. Intro / Value Section (Moved Down) */}
      <IntroBento lng={lng} />

      {/* 6. Blog / News Section */}
      <NewsSection
        title={t('news.title')}
        items={NEWS_ITEMS}
        lng={lng}
      />

      {/* 7. CTA */}
      <CTASection
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        buttonText={t('cta.button')}
      />
    </main>
  );
}
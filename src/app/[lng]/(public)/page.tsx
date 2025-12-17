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
import { getProductService, getBlogService } from "@/services";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;
  const client = await createServerClient();
  const { t } = await useTranslation(lng, 'home');

  // Initialize services with PocketBase client
  const productService = getProductService(client);
  const blogService = getBlogService(client);

  // Fetch real data from PocketBase
  const [categoriesData, featuredProducts, blogPosts] = await Promise.all([
    productService.getCategories(),
    productService.getFeaturedProducts(),
    blogService.getLatestPosts(4, lng),
  ]);

  // Map categories to component format with DB images
  const CATEGORY_ITEMS = categoriesData.map((cat) => ({
    id: cat.slug,
    title: lng === 'fr' ? (cat.name || cat.slug) : (cat.name || cat.slug),
    image: cat.thumbnail
      ? `${PB_URL}/api/files/categories/${cat.id}/${cat.thumbnail}`
      : 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2528&auto=format&fit=crop',
  })).slice(0, 5); // Max 5 categories

  // Map blog posts to NewsSection format
  const NEWS_ITEMS = blogPosts.length > 0
    ? blogPosts.map((post) => ({
      category: post.category || 'news',
      title: post.title,
      slug: post.slug,
      image: post.coverImage,
    }))
    : [
      // Fallback static data if no posts exist yet
      { category: t('news.items.0.category'), title: t('news.items.0.title'), image: t('news.items.0.image') },
      { category: t('news.items.1.category'), title: t('news.items.1.title'), image: t('news.items.1.image') },
      { category: t('news.items.2.category'), title: t('news.items.2.title'), image: t('news.items.2.image') },
      { category: t('news.items.3.category'), title: t('news.items.3.title'), image: t('news.items.3.image') },
    ];

  // Dynamic Section Data (still using translations for UI text)
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

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section - Full Screen */}
      <HeroImpact lng={lng} />

      {/* Social Proof - Infinite Marquee (Between Hero and Bento) */}
      <SocialProof />

      {/* Features Section */}
      <BentoFeatures
        title={t('bento.platform.title')}
        subtitle={t('bento.platform.subtitle')}
        description={t('bento.platform.description')}
        items={BENTO_ITEMS}
      />

      {/* Categories Section - Real Data from DB */}
      <CategorySection
        title={t('categories.title')}
        subtitle={t('categories.subtitle')}
        items={CATEGORY_ITEMS.length > 0 ? CATEGORY_ITEMS : [
          { id: 'cameras', title: 'Cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2528&auto=format&fit=crop' },
          { id: 'lighting', title: 'Lighting', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2070' },
          { id: 'audio', title: 'Audio', image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=2670&auto=format&fit=crop' },
        ]}
      />

      {/* Featured Products - Real Data from DB */}
      <FeaturedProducts
        title={t('featured.title')}
        subtitle={t('featured.subtitle')}
        lng={lng}
        products={featuredProducts}
      />

      {/* News / Blog Section - Real Data from DB */}
      <NewsSection
        title={t('news.title')}
        items={NEWS_ITEMS}
        lng={lng}
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
import { createServerClient } from "@/lib/pocketbase/server";
import { Globe, Cpu, Lock, Headphones, BarChart3 } from "lucide-react";
import HeroImpact from "@/components/marketing/hero-impact";
import BentoFeatures from "@/components/marketing/bento-features";
import { useTranslation } from "@/app/i18n";
import SocialProof from "@/components/marketing/social-proof";
import CTASection from "@/components/marketing/cta-section";
import NewsSection from "@/components/marketing/news-section";
import CategorySection from "@/components/marketing/category-section";
import { getBlogService, getServicesService } from "@/services";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export default async function HomeOldPage({ params }: { params: Promise<{ lng: string }> }) {
    const { lng } = await params;
    const client = await createServerClient();
    const { t } = await useTranslation(lng, 'home');

    // Initialize services with PocketBase client
    const blogService = getBlogService(client);
    const servicesService = getServicesService(client);

    // Fetch real data from PocketBase
    const [servicesData, blogPosts] = await Promise.all([
        servicesService.getServices(),
        blogService.getLatestPosts(4, lng),
    ]);

    // Map services to CategorySection format with links
    // First row: 5 items with equipment links
    // Second row: 5 items with service page links
    const allServiceItems = servicesData.map((svc) => ({
        id: svc.slug,
        title: lng === 'fr' ? (svc.titleFr || svc.title) : svc.title,
        image: svc.icon
            ? `${PB_URL}/api/files/services/${svc.id}/${svc.icon}`
            : 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2528&auto=format&fit=crop',
        href: svc.type === 'internal_link' && svc.targetUrl
            ? `/${lng}${svc.targetUrl}`
            : `/${lng}/services/${svc.slug}`,
    }));

    // First row: items 1-5, Second row: items 6-10
    const ROW_1_SERVICES = allServiceItems.slice(0, 5);
    const ROW_2_SERVICES = allServiceItems.slice(5, 10);

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

    // Original Bento items - 5 cards for balanced layout
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
            href: `/${lng}/equipment`,
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

            {/* Social Proof - Infinite Marquee */}
            <SocialProof />

            {/* Services Section Row 1 - RIGHT AFTER HERO (as requested) */}
            <CategorySection
                title={lng === 'fr' ? 'Nos Services' : 'Our Services'}
                subtitle={lng === 'fr' ? 'Ce que nous offrons' : 'What We Offer'}
                items={ROW_1_SERVICES.length > 0 ? ROW_1_SERVICES : [
                    { id: 'cameras', title: 'Camera Rental', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2528&auto=format&fit=crop', href: `/${lng}/equipment?category=cameras` },
                    { id: 'lighting', title: 'Lighting', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2070', href: `/${lng}/equipment?category=lighting` },
                    { id: 'audio', title: 'Audio', image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=2670&auto=format&fit=crop', href: `/${lng}/equipment?category=audio` },
                    { id: 'grip', title: 'Grip', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2559&auto=format&fit=crop', href: `/${lng}/equipment?category=grip` },
                    { id: 'lenses', title: 'Lenses', image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=2670&auto=format&fit=crop', href: `/${lng}/equipment?category=lenses` },
                ]}
            />

            {/* Services Section Row 2 - Production Services */}
            {ROW_2_SERVICES.length > 0 && (
                <CategorySection
                    title={lng === 'fr' ? 'Services de Production' : 'Production Services'}
                    subtitle={lng === 'fr' ? 'Solutions complètes pour votre tournage' : 'Complete solutions for your shoot'}
                    items={ROW_2_SERVICES}
                />
            )}

            {/* Features Section - ORIGINAL Bento with 5 cards */}
            <BentoFeatures
                title={t('bento.platform.title')}
                subtitle={t('bento.platform.subtitle')}
                description={t('bento.platform.description')}
                items={BENTO_ITEMS}
            />

            {/* News / Blog Section */}
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

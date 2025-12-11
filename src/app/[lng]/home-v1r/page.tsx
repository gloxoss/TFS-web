"use client";

import HeroCinematic from "@/components/marketing/hero-cinematic";
import BentoFeatures from "@/components/marketing/bento-features";
import StatsSimple from "@/components/marketing/stats-simple";
import Testimonials from "@/components/marketing/testimonials";
import CtaCentered from "@/components/marketing/cta-centered";
import FaqCentered from "@/components/marketing/faq-centered";
import { Play, Camera, Film, Monitor, Mic, Battery } from "lucide-react";

export default function HomeV1R() {
    return (
        <main>
            {/* 1. Cinematic Hybrid Hero */}
            <HeroCinematic
                title="Unleash Your Vision."
                subtitle="Rent the world's most advanced cinema cameras, lenses, and lighting equipment. Delivering Hollywood-grade gear to your set."
                images={[
                    "https://images.unsplash.com/photo-1533560906634-887cd79560b3?q=80&w=2070&auto=format&fit=crop", // Cinema Camera Set (Dark)
                    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2910&auto=format&fit=crop", // Nature/Production
                    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2070", // Studio Lights
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=2000" // Camera Lens
                ]}
                megaText="CINEMA"
                primaryAction={{ label: "View Catalog", href: "/en/catalog" }}
                mission={{
                    title: "Our Mission",
                    text: "To empower filmmakers with innovative tools and technology that enhance creativity and efficiency.",
                    href: "/en/about"
                }}
            />

            {/* 2. Stats Section */}
            <StatsSimple />

            {/* 3. Bento Grid Features */}
            <BentoFeatures
                title="Professional Equipment"
                subtitle="Everything needed for masterpiece."
                description="From industry-standard cameras to precision lensing and grip gear. We have it all."
                items={[
                    {
                        title: "Camera Systems",
                        description: "ARRI, RED, Sony. The best sensors in the business ready for your next production.",
                        icon: Camera,
                        href: "/en/catalog/cameras",
                        theme: "dark",
                        className: "md:col-span-2",
                        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000"
                    },
                    {
                        title: "Premium Optics",
                        description: "Anamorphic, Spherical, Vintage. Choose the perfect look.",
                        icon: Film,
                        href: "/en/catalog/lenses",
                        theme: "light",
                    },
                    {
                        title: "Production Monitors",
                        description: "Color accurate monitoring for DITs and Directors.",
                        icon: Monitor,
                        stat: "4K HDR",
                        theme: "light",
                    },
                    {
                        title: "Audio & Grip",
                        description: "Complete sound packages and support systems.",
                        icon: Mic,
                        theme: "image",
                        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1000",
                        className: "md:col-span-2" // Span 2 if desired, or keep 1
                    },
                    {
                        title: "Power & Media",
                        description: "Never run out of juice or space.",
                        icon: Battery,
                        theme: "light",
                    },
                ]}
            />

            {/* 4. Social Proof */}
            <Testimonials />

            {/* 5. FAQ */}
            <FaqCentered />

            {/* 6. CTA */}
            <CtaCentered />
        </main>
    )
}

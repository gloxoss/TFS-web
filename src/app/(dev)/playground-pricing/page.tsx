"use client";

import BasicPricing from "@/components/marketing/pricing/BasicPricing";
import PricingWithBlurredBackground from "@/components/marketing/pricing/PricingWithBlurredBackground";
import PricingWithFeaturedTier from "@/components/marketing/pricing/PricingWithFeaturedTier";
import PricingWithFeaturedTierFilled from "@/components/marketing/pricing/PricingWithFeaturedTierFilled";
import PricingWithMostPopularTier from "@/components/marketing/pricing/PricingWithMostPopularTier";
import PricingWithMostPopularTierFilled from "@/components/marketing/pricing/PricingWithMostPopularTierFilled";
import PricingWithMostPopularTierHighlighted from "@/components/marketing/pricing/PricingWithMostPopularTierHighlighted";
import SimplePricingSelector from "@/components/marketing/pricing/SimplePricingSelector";
import { Button } from "@heroui/react";
import { useState } from "react";

export default function PricingPlayground() {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);

    const components = {
        "Basic": BasicPricing,
        "Blurred": PricingWithBlurredBackground,
        "Featured Tier": PricingWithFeaturedTier,
        "Featured Tier Filled": PricingWithFeaturedTierFilled,
        "Most Popular": PricingWithMostPopularTier,
        "Most Popular Filled": PricingWithMostPopularTierFilled,
        "Most Popular Highlighted": PricingWithMostPopularTierHighlighted,
        "Simple Selector": SimplePricingSelector,
    };

    const ActiveComponent = activeComponent ? components[activeComponent as keyof typeof components] : null;

    return (
        <div className="min-h-screen p-8 pb-32">
            <h1 className="text-2xl font-bold mb-8">Pricing Playground</h1>
            <p className="mb-8 text-default-500">
                Click a button below to view the pricing variant.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
                <Button
                    color={activeComponent === null ? "primary" : "default"}
                    onPress={() => setActiveComponent(null)}
                >
                    Hide All
                </Button>
                {Object.keys(components).map((name) => (
                    <Button
                        key={name}
                        variant={activeComponent === name ? "solid" : "bordered"}
                        color={activeComponent === name ? "primary" : "default"}
                        onPress={() => setActiveComponent(name)}
                    >
                        {name}
                    </Button>
                ))}
            </div>

            <div className="border border-dashed border-default-300 rounded-lg p-4 min-h-[400px]">
                {ActiveComponent ? <ActiveComponent /> : <div className="h-full flex items-center justify-center text-default-400">Select a component to preview</div>}
            </div>
        </div>
    );
}

"use client";

import BasicPricingComparison from "@/components/marketing/pricing-comparison/BasicPricingComparison";
import PricingComparisonWithBlurredBackground from "@/components/marketing/pricing-comparison/PricingComparisonWithBlurredBackground";
import PricingComparisonWithFeaturedTier from "@/components/marketing/pricing-comparison/PricingComparisonWithFeaturedTier";
import PricingComparisonWithFeaturedTierFilled from "@/components/marketing/pricing-comparison/PricingComparisonWithFeaturedTierFilled";
import PricingComparisonWithHighlightedTier from "@/components/marketing/pricing-comparison/PricingComparisonWithHighlightedTier";
import PricingComparisonWithMostPopularTier from "@/components/marketing/pricing-comparison/PricingComparisonWithMostPopularTier";
import PricingComparisonWithMostPopularTierSoft from "@/components/marketing/pricing-comparison/PricingComparisonWithMostPopularTierSoft";
import PricingComparisonWithStickyHeader from "@/components/marketing/pricing-comparison/PricingComparisonWithStickyHeader";
import { Button } from "@heroui/react";
import { useState } from "react";

export default function PricingComparisonPlayground() {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);

    const components = {
        "Basic": BasicPricingComparison,
        "Blurred": PricingComparisonWithBlurredBackground,
        "Featured Tier": PricingComparisonWithFeaturedTier,
        "Featured Tier Filled": PricingComparisonWithFeaturedTierFilled,
        "Highlighted Tier": PricingComparisonWithHighlightedTier,
        "Most Popular": PricingComparisonWithMostPopularTier,
        "Most Popular Soft": PricingComparisonWithMostPopularTierSoft,
        "Sticky Header": PricingComparisonWithStickyHeader,
    };

    const ActiveComponent = activeComponent ? components[activeComponent as keyof typeof components] : null;

    return (
        <div className="min-h-screen p-8 pb-32">
            <h1 className="text-2xl font-bold mb-8">Pricing Comparison Playground</h1>
            <p className="mb-8 text-default-500">
                Click a button below to view the pricing comparison variant.
                <br />
                <span className="text-sm font-semibold text-warning">Note: View on large screens to see the table view. Small screens show cards.</span>
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

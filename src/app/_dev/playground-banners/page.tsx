"use client";

import BasicBanner from "@/components/marketing/banners/BasicBanner";
import BetweenJustifiedBanner from "@/components/marketing/banners/BetweenJustifiedBanner";
import BrandColorsBanner from "@/components/marketing/banners/BrandColorsBanner";
import FloatingBottomCenteredBanner from "@/components/marketing/banners/FloatingBottomCenteredBanner";
import FloatingBottomBanner from "@/components/marketing/banners/FloatingBottomBanner";
import FloatingBanner from "@/components/marketing/banners/FloatingBanner";
import GradientBanner from "@/components/marketing/banners/GradientBanner";
import InvertedBanner from "@/components/marketing/banners/InvertedBanner";

export default function BannersPlayground() {
    return (
        <div className="min-h-screen bg-background p-8 pb-32">
            <h1 className="mb-8 text-2xl font-bold">Banners Playground</h1>

            <div className="flex flex-col gap-12">
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Basic Banner</h2>
                    <div className="relative border rounded-lg overflow-hidden min-h-[100px] flex items-center">
                        <BasicBanner />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Between Justified Banner</h2>
                    <div className="relative border rounded-lg overflow-hidden min-h-[100px] flex items-center">
                        <BetweenJustifiedBanner />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Brand Colors Banner</h2>
                    <div className="relative border rounded-lg overflow-hidden min-h-[100px] flex items-center">
                        <BrandColorsBanner />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Gradient Banner</h2>
                    <div className="relative border rounded-lg overflow-hidden min-h-[100px] flex items-center">
                        <GradientBanner />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Inverted Banner</h2>
                    <div className="relative border rounded-lg overflow-hidden min-h-[100px] flex items-center">
                        <InvertedBanner />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Floating Banner</h2>
                    <div className="relative border rounded-lg overflow-hidden min-h-[150px] bg-default-100 p-4">
                        <p className="mb-4">Content behind the banner...</p>
                        <FloatingBanner />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Floating Bottom Banner</h2>
                    <div className="relative border rounded-lg overflow-hidden min-h-[200px] bg-default-100 p-4 transform scale-95 border-dashed">
                        <p className="text-sm text-default-500 mb-4">Note: This component is fixed to viewport bottom. In this preview it might stick to the page bottom.</p>
                        {/* Rendered conditionally or it will stick to screen bottom */}
                        <FloatingBottomBanner />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Floating Bottom Centered Banner</h2>
                    <div className="relative border rounded-lg overflow-hidden min-h-[200px] bg-default-100 p-4 transform scale-95 border-dashed">
                        <p className="text-sm text-default-500 mb-4">Note: This component is fixed to viewport bottom. In this preview it might stick to the page bottom.</p>
                        {/* Rendered conditionally or it will stick to screen bottom */}
                        <FloatingBottomCenteredBanner />
                    </div>
                </section>
            </div>
        </div>
    );
}

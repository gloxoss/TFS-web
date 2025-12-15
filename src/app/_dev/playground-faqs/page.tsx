"use client";

import BasicFaqs from "@/components/marketing/faqs/BasicFaqs";
import CenteredFaqs from "@/components/marketing/faqs/CenteredFaqs";
import FaqsWithDivider from "@/components/marketing/faqs/FaqsWithDivider";
import TwoColumnsFaqs from "@/components/marketing/faqs/TwoColumnsFaqs";

export default function FaqsPlayground() {
    return (
        <div className="min-h-screen p-8 pb-32 space-y-24">
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">FAQs Playground</h1>
                <p className="text-default-500">Scroll down to see diferent FAQ styles.</p>
            </div>

            <section className="border-t pt-12">
                <h2 className="text-xl font-semibold mb-4">Basic FAQs</h2>
                <BasicFaqs />
            </section>

            <section className="border-t pt-12">
                <h2 className="text-xl font-semibold mb-4">Centered FAQs</h2>
                <CenteredFaqs />
            </section>

            <section className="border-t pt-12">
                <h2 className="text-xl font-semibold mb-4">FAQs with Divider</h2>
                <FaqsWithDivider />
            </section>

            <section className="border-t pt-12">
                <h2 className="text-xl font-semibold mb-4">Two Columns FAQs</h2>
                <TwoColumnsFaqs />
            </section>
        </div>
    );
}

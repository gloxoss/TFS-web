"use client";

import BasicFooter from "@/components/marketing/footers/BasicFooter";
import CenteredFooter from "@/components/marketing/footers/CenteredFooter";
import FooterWithColumns from "@/components/marketing/footers/FooterWithColumns";
import FooterWithColumnsNewsletter from "@/components/marketing/footers/FooterWithColumnsNewsletter";

export default function FootersPlayground() {
    return (
        <div className="min-h-screen p-8 pb-32 space-y-24">
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Footers Playground</h1>
                <p className="text-default-500">Scroll down to see deferent Footer styles.</p>
            </div>

            <section className="border-t pt-12">
                <h2 className="text-xl font-semibold mb-4">Basic Footer</h2>
                <BasicFooter />
            </section>

            <section className="border-t pt-12">
                <h2 className="text-xl font-semibold mb-4">Centered Footer</h2>
                <CenteredFooter />
            </section>

            <section className="border-t pt-12">
                <h2 className="text-xl font-semibold mb-4">Footer with Columns</h2>
                <FooterWithColumns />
            </section>

            <section className="border-t pt-12">
                <h2 className="text-xl font-semibold mb-4">Footer with Columns & Newsletter</h2>
                <FooterWithColumnsNewsletter />
            </section>
        </div>
    );
}

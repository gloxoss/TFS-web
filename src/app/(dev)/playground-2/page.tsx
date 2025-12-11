import HeroBasic from "@/components/marketing/hero-basic/HeroBasic";
import HeroBottomApp from "@/components/marketing/hero-bottom-app/HeroBottomApp";
import HeroSkewed from "@/components/marketing/hero-skewed/HeroSkewed";
import HeroCentered from "@/components/marketing/hero-centered/HeroCentered";

export const metadata = {
    title: "HeroUI Migration Playground",
};

export default function PlaygroundPage() {
    return (
        <div className="flex flex-col gap-20 p-10 bg-background text-foreground">
            <section>
                <h2 className="text-2xl font-bold mb-4">Hero Basic</h2>
                <div className="border rounded-xl overflow-hidden h-[800px] relative">
                    <HeroBasic />
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Hero Bottom App</h2>
                <div className="border rounded-xl overflow-hidden h-[1000px] relative">
                    <HeroBottomApp />
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Hero Skewed</h2>
                <div className="border rounded-xl overflow-hidden h-[1000px] relative">
                    <HeroSkewed />
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Hero Centered</h2>
                <div className="border rounded-xl overflow-hidden h-[1200px] relative">
                    <HeroCentered />
                </div>
            </section>
        </div>
    );
}

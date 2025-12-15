
import { Navbar } from "@/components/ui/navbar";
import FooterWithColumns from "@/components/marketing/footers/FooterWithColumns";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ProgressiveBlur from "@/components/ui/ProgressiveBlur";
import { EffectsLayer } from "@/components/ui/effects-layer";

interface PublicLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        lng: string;
    }>;
}

export default async function PublicLayout({
    children,
    params,
}: PublicLayoutProps) {
    const { lng } = await params;

    return (
        <SmoothScroll>
            <div className="cursor-none md:cursor-none">
                <CustomCursor />
                <ProgressiveBlur />
                <EffectsLayer />
                {/* Global Cinematic Noise */}
                <div className="noise-overlay" />
                <Navbar lng={lng} />
                <main className="grow bg-zinc-950">
                    {children}
                </main>
                <FooterWithColumns lng={lng} />
            </div>
        </SmoothScroll>
    );
}


import { Navbar } from "@/components/ui/navbar";
import FooterWithColumns from "@/components/marketing/footers/FooterWithColumns";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ProgressiveBlur from "@/components/ui/ProgressiveBlur";
import { EffectsLayer } from "@/components/ui/effects-layer";
import { LazyComponents } from "@/components/lazy-components";
import { getSettings } from "@/lib/actions/settings";
import { SiteSettingsProvider } from "@/components/providers/site-settings-provider";
import { verifyAdminAccess } from "@/services/auth/access-control";
import { Wrench } from "lucide-react";

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
    const { settings } = await getSettings();
    const isAdmin = await verifyAdminAccess();

    // Maintenance Mode Check
    if (settings?.maintenance_mode && !isAdmin) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
                <div className="z-10 text-center space-y-6 px-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D00000]/10 text-[#D00000] mb-4">
                        <Wrench className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter">
                        Under Maintenance
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-md mx-auto">
                        We are currently improving our services. Please check back shortly.
                    </p>
                    <p className="text-sm text-zinc-600 mt-8">
                        {settings.company_name}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <SiteSettingsProvider settings={settings}>
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
                <LazyComponents lng={lng} />
            </SmoothScroll>
        </SiteSettingsProvider>
    );
}

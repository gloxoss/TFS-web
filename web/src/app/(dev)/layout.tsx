import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";
import { Providers } from "../providers";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ProgressiveBlur from "@/components/ui/ProgressiveBlur";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
    variable: "--font-cormorant",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

export const metadata = {
    title: "PB-Next Root",
    description: "Root layout for dev tools",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={cn(
                geistSans.variable,
                geistMono.variable,
                cormorant.variable,
                "antialiased h-full dark"
            )}
            suppressHydrationWarning
        >
            <body className="min-h-screen bg-background font-sans antialiased">
                <Providers>
                    <SmoothScroll>
                        <CustomCursor />
                        <ProgressiveBlur />
                        {children}
                    </SmoothScroll>
                </Providers>
            </body>
        </html>
    );
}

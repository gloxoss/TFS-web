"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // The navigate prop allows HeroUI components (like Links) to use Next.js client-side routing
    // instead of full page reloads.
    return (
        <HeroUIProvider navigate={router.push}>
            {children}
        </HeroUIProvider>
    );
}


import { PocketBaseProvider } from "@/components/pocketbase-provider";
import { createServerClient, getCurrentUser } from "@/lib/pocketbase/server";
import { cn } from "@/lib/utils";
import { dir } from 'i18next';
import { languages } from '../i18n/settings';
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import type { Metadata } from "next";
import { I18nProvider } from '@/components/providers/i18n-client-provider'
import "../globals.css";
import { Providers } from "@/app/providers";

import AuthListener from "@/components/auth/auth-listener";
import { CartMergeHandler } from "@/components/cart/cart-merge-handler";
import { CartSyncProvider } from "@/components/cart/cart-sync-provider";

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

export const metadata: Metadata = {
  title: "PB-Next",
  description: "A simple example of PocketBase + Next.js",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lng: string;
  }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { lng } = await params
  const client = await createServerClient()
  const user = await getCurrentUser()

  return (
    <html
      lang={lng}
      dir={dir(lng)}
      className={cn(
        geistSans.variable,
        geistMono.variable,
        cormorant.variable,
        "antialiased h-full dark"
      )}
      suppressHydrationWarning
    >
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <I18nProvider lng={lng} namespaces={['common']}>
          <PocketBaseProvider
            initialToken={client.authStore.token}
            initialUser={client.authStore.record}
          >
            <Providers>
              <AuthListener initialUser={user} />
              <CartMergeHandler />
              <CartSyncProvider />
              {children}
            </Providers>
          </PocketBaseProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
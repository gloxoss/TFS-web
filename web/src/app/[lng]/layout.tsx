/*
 * -----------------------------------------------------------------------------
 * PROJECT:   TFS Digital Transformation
 * ENGINEER:  Oussama Zaki
 * AGENCY:    Epioso (https://epioso.tech)
 * -----------------------------------------------------------------------------
 * COPYRIGHT NOTICE:
 * 
 * 1. CLIENT OWNERSHIP: 
 * TFS (The Client) retains full ownership of all specific content, 
 * branding, client data, and UI design elements created for this instance.
 *
 * 2. DEVELOPER OWNERSHIP (Background Technology):
 * The underlying software architecture, "Kit Builder" logic, database schemas,
 * and generic code libraries remain the exclusive Intellectual Property 
 * of Oussama Zaki (Epioso). 
 *
 * 3. LICENSE GRANT:
 * Upon full payment, the Client is granted a perpetual, non-exclusive, 
 * royalty-free license to use, modify, and maintain this software for 
 * their own business operations.
 *
 * 4. REUSE RIGHTS:
 * The Developer (Epioso) reserves the right to reuse the underlying 
 * technical architecture and logic for other projects.
 * -----------------------------------------------------------------------------
 */

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
import { ConsoleCredit } from "@/components/layout/console-credit";

import { ENABLE_CLIENT_PORTAL } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
              <ConsoleCredit />
              {ENABLE_CLIENT_PORTAL && <CartMergeHandler />}
              {ENABLE_CLIENT_PORTAL && <CartSyncProvider />}

              {children}
            </Providers>
          </PocketBaseProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
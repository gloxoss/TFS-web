import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { PocketBaseProvider } from "@/components/pocketbase-provider";
import { createServerClient } from "@/lib/pocketbase/server";
import { cn } from "@/lib/utils";
import { dir } from 'i18next';
import { languages } from '../i18n/settings';
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { I18nProvider } from '@/components/providers/i18n-client-provider'
import "../globals.css";
import { Providers } from "@/app/providers";
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

  return (
    <html
      lang={lng}
      dir={dir(lng)}
      className={cn(
        geistSans.variable,
        geistMono.variable,
        "antialiased h-full dark"
      )}
      suppressHydrationWarning
    >
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body className="min-h-screen flex flex-col cursor-none md:cursor-none" suppressHydrationWarning>
        <I18nProvider lng={lng} namespaces={['common']}>
          <PocketBaseProvider
            initialToken={client.authStore.token}
            initialUser={client.authStore.record}
          >
            <Providers>
              <SmoothScroll>
                <CustomCursor />
                <ProgressiveBlur />
                <Navbar lng={lng} />
                <main className="grow">
                  {children}
                </main>
                <Footer lng={lng} />
              </SmoothScroll>
            </Providers>
          </PocketBaseProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
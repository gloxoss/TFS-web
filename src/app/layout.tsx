// app/layout.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PocketBaseProvider } from "@/components/pocketbase-provider";
import { createServerClient } from "@/lib/pocketbase/server";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = await createServerClient();

  return (
    <html
      lang="en"
      className={cn(geistSans.variable, geistMono.variable, "antialiased h-full")}
      data-theme="lofi" // Default theme
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-base-100">
        <PocketBaseProvider
          initialToken={client.authStore.token}
          initialUser={client.authStore.record}
        >
          <Navbar />
          <main className="flex-grow">
            <div className="mx-auto max-w-7xl px-4 py-12">{children}</div>
          </main>
          <Footer />
        </PocketBaseProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme') || 'lofi';
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {}
          `
        }} />
      </body>
    </html>
  );
}
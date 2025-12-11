"use client";

import { Facebook, Github, Instagram, Twitter, Linkedin, Youtube, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/app/i18n/client";
import { ClientWrapper } from "./client-wrapper";

export function Footer({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, 'common');

  const navigation = {
    solutions: [
      { name: 'Catalog', href: `/${lng}/catalog` },
      { name: 'Kits', href: `/${lng}/kits` },
      { name: 'Lenses', href: `/${lng}/catalog/lenses` },
      { name: 'Cameras', href: `/${lng}/catalog/cameras` },
    ],
    support: [
      { name: 'Contact Us', href: `/${lng}/contact` },
      { name: 'FAQ', href: `/${lng}/faq` },
      { name: 'Terms of Service', href: `/${lng}/terms` },
      { name: 'Privacy Policy', href: `/${lng}/privacy` },
    ],
    company: [
      { name: 'About Us', href: `/${lng}/about` },
      { name: 'Blog', href: `/${lng}/blog` },
      { name: 'Careers', href: `/${lng}/careers` },
    ],
    social: [
      { name: 'Facebook', href: '#', icon: Facebook },
      { name: 'Instagram', href: '#', icon: Instagram },
      { name: 'X', href: '#', icon: Twitter },
      { name: 'GitHub', href: 'https://github.com/shadowchess-org', icon: Github },
      { name: 'YouTube', href: '#', icon: Youtube },
    ],
  };

  return (
    <ClientWrapper>
      <footer className="bg-gray-900 text-gray-300" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <Link href={`/${lng}`} className="flex items-center gap-2 text-white">
                <span className="text-2xl font-bold font-display tracking-tight">Horizon Courts</span>
              </Link>
              <p className="text-sm leading-6 text-gray-400">
                Unleash your potential with professional-grade equipment and facilities.
                Designed for champions, available for everyone.
              </p>
              <div className="flex space-x-6">
                {navigation.social.map((item) => (
                  <Link key={item.name} href={item.href} className="text-gray-500 hover:text-white transition-colors">
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Products</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.solutions.map((item) => (
                      <li key={item.name}>
                        <Link href={item.href} className="text-sm leading-6 hover:text-white transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.support.map((item) => (
                      <li key={item.name}>
                        <Link href={item.href} className="text-sm leading-6 hover:text-white transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.company.map((item) => (
                      <li key={item.name}>
                        <Link href={item.href} className="text-sm leading-6 hover:text-white transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  {/* Extra column or Newsletter could go here */}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-gray-400">
              &copy; {new Date().getFullYear()} Horizon Courts / PB-Next. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </ClientWrapper>
  );
}
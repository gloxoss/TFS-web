"use client";

import { Facebook, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { t } from "@/data/site-content"; // Keep 't' helper, but data comes from hook
import { ClientWrapper } from "./client-wrapper";
import { useSiteSettings } from "@/components/providers/site-settings-provider";

export function Footer({ lng }: { lng: string }) {
  const { company, footer: footerContent } = useSiteSettings();

  const navigation = {
    services: [
      { name: t({ en: "Camera Rentals", fr: "Location Caméras" }, lng), href: `/${lng}/equipment?category=cameras` },
      { name: t({ en: "Lighting Equipment", fr: "Équipement Éclairage" }, lng), href: `/${lng}/equipment?category=lighting` },
      { name: t({ en: "Audio Gear", fr: "Matériel Audio" }, lng), href: `/${lng}/equipment?category=audio` },
      { name: t({ en: "Grip & Support", fr: "Grip & Support" }, lng), href: `/${lng}/equipment?category=grip` },
    ],
    support: [
      { name: t({ en: "Equipment Care", fr: "Entretien Équipement" }, lng), href: `/${lng}/care` },
      { name: t({ en: "Contact Us", fr: "Nous Contacter" }, lng), href: `/${lng}/contact` },
    ],
    company: [
      { name: t({ en: "About Us", fr: "À Propos" }, lng), href: `/${lng}/about` },
      { name: t({ en: "Our Equipment", fr: "Notre Équipement" }, lng), href: `/${lng}/equipment` },
    ],
    legal: [
      { name: t({ en: "Terms of Service", fr: "Conditions d'Utilisation" }, lng), href: `/${lng}/terms` },
      { name: t({ en: "Privacy Policy", fr: "Politique de Confidentialité" }, lng), href: `/${lng}/privacy` },
    ],
  };

  return (
    <ClientWrapper>
      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-20 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link href={`/${lng}`} className="flex items-center gap-2 text-white">
                <span className="text-2xl font-bold tracking-tight">
                  {company.name}
                  <span className="text-primary">.</span>
                </span>
              </Link>
              <p className="text-sm leading-6">
                {t(company.tagline, lng)}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                  <span>{company.address.street}<br />{company.address.city} {company.address.postalCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${company.phone.link}`} className="hover:text-white transition-colors">
                    {company.phone.display}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${company.email}`} className="hover:text-white transition-colors">
                    {company.email}
                  </a>
                </div>
              </div>

              {/* Social Links (shown only if urls provided) */}
              <div className="flex space-x-4">
                {company.social.facebook && (
                  <a href={company.social.facebook} className="hover:text-white transition-colors" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {company.social.instagram && (
                  <a href={company.social.instagram} className="hover:text-white transition-colors" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {company.social.linkedin && (
                  <a href={company.social.linkedin} className="hover:text-white transition-colors" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Links Columns */}
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {t({ en: "Services", fr: "Services" }, lng)}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.services.map((item) => (
                      <li key={item.name}>
                        <Link href={item.href} className="text-sm leading-6 hover:text-white transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {t({ en: "Support", fr: "Support" }, lng)}
                  </h3>
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
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {t({ en: "Company", fr: "Entreprise" }, lng)}
                  </h3>
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
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    {t({ en: "Legal", fr: "Légal" }, lng)}
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.legal.map((item) => (
                      <li key={item.name}>
                        <Link href={item.href} className="text-sm leading-6 hover:text-white transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 border-t border-zinc-800 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-zinc-500">
              {t(footerContent.copyright, lng)}
            </p>
          </div>
        </div>
      </footer>
    </ClientWrapper>
  );
}
"use client";

import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { t as translate } from "@/data/site-content";

interface FooterProps {
    lng: string;
}

export default function FooterWithColumns({ lng }: FooterProps) {
    const { t } = useTranslation(lng, "common");
    const { company } = useSiteSettings();

    return (
        <footer className="bg-black border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold text-white mb-4">{company.name}</h3>
                        <p className="text-zinc-400 text-sm max-w-sm">
                            {translate(company.tagline, lng)}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href={`/${lng}/equipment`} className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    Equipment
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lng}/services`} className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lng}/about`} className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lng}/contact`} className="text-zinc-400 hover:text-white text-sm transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-zinc-400 text-sm">
                            <li>{company.email}</li>
                            <li>{company.phone.display}</li>
                            <li>{company.address.street} {company.address.city}</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright & Credits */}
                <div className="border-t border-zinc-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-zinc-500 text-sm">
                            © {new Date().getFullYear()} TV Film Solutions. All rights reserved.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-zinc-600">
                            <span>Platform Engineering by{' '}
                                <a
                                    href="https://epioso.tech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-500 hover:text-amber-500 transition-colors"
                                >
                                    Epioso
                                </a>
                            </span>
                            <span className="text-zinc-700">|</span>
                            <span>v1.0.0 • Build {process.env.NEXT_PUBLIC_BUILD_ID || 'release'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

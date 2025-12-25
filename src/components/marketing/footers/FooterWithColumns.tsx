"use client";

import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";

interface FooterProps {
    lng: string;
}

export default function FooterWithColumns({ lng }: FooterProps) {
    const { t } = useTranslation(lng, "common");

    return (
        <footer className="bg-black border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold text-white mb-4">TFS</h3>
                        <p className="text-zinc-400 text-sm max-w-sm">
                            TV Film Solutions - Professional cinema equipment rental for productions of all sizes.
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
                            <li>contact@tfs.ma</li>
                            <li>+212 5XX-XXXXXX</li>
                            <li>Casablanca, Morocco</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
                    <p className="text-zinc-500 text-sm">
                        © {new Date().getFullYear()} TFS. All rights reserved.
                    </p>
                    <p className="text-zinc-700 text-xs mt-2">
                        v1.0.0 • Build {process.env.NEXT_PUBLIC_BUILD_ID || 'release'}
                    </p>
                </div>
            </div>
        </footer>
    );
}

"use client";

import React from "react";
import { Divider, Link } from "@heroui/react";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { t } from "@/data/site-content";
import { useSiteSettings } from "@/components/providers/site-settings-provider";

interface FooterWithColumnsProps {
    lng: string;
}

export default function FooterWithColumns({ lng }: FooterWithColumnsProps) {
    const { company, footer } = useSiteSettings();

    const renderList = React.useCallback(
        ({ title, items }: { title: string; items: { href: string; label: { en: string; fr: string } }[] }) => (
            <div>
                <h3 className="text-small font-semibold text-default-600">{title}</h3>
                <ul className="mt-6 space-y-4">
                    {items.map((item) => (
                        <li key={item.href}>
                            <Link className="text-default-400" href={`/${lng}${item.href}`} size="sm">
                                {t(item.label, lng)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        ),
        [lng],
    );

    return (
        <footer className="flex w-full flex-col bg-background pb-12">
            <div className="max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 md:pr-8">
                        {/* Logo */}
                        <div className="flex items-center justify-start">
                            <span className="text-2xl font-bold font-display tracking-tight text-foreground">
                                {company.name}<span className="text-primary">.</span>
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-small text-default-500">
                            {t(footer.description, lng)}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 text-small text-default-500">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                <span>
                                    {company.address.street}<br />
                                    {company.address.city} {company.address.postalCode}, {lng === 'fr' ? company.address.countryFr : company.address.country}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <a href={`tel:${company.phone.link}`} className="hover:text-foreground transition-colors">
                                    {company.phone.display}
                                </a>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-6">
                            {company.social.facebook && (
                                <Link isExternal className="text-default-400 hover:text-foreground" href={company.social.facebook}>
                                    <span className="sr-only">Facebook</span>
                                    <Facebook aria-hidden="true" className="w-5 h-5" />
                                </Link>
                            )}
                            {company.social.instagram && (
                                <Link isExternal className="text-default-400 hover:text-foreground" href={company.social.instagram}>
                                    <span className="sr-only">Instagram</span>
                                    <Instagram aria-hidden="true" className="w-5 h-5" />
                                </Link>
                            )}
                            {company.social.linkedin && (
                                <Link isExternal className="text-default-400 hover:text-foreground" href={company.social.linkedin}>
                                    <span className="sr-only">LinkedIn</span>
                                    <Linkedin aria-hidden="true" className="w-5 h-5" />
                                </Link>
                            )}
                            <Link className="text-default-400 hover:text-foreground" href={`mailto:${company.email}`}>
                                <span className="sr-only">Email</span>
                                <Mail aria-hidden="true" className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>{renderList({ title: t(footer.sections.services, lng), items: footer.services })}</div>
                            <div className="mt-10 md:mt-0">
                                {renderList({ title: t(footer.sections.support, lng), items: footer.support })}
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>{renderList({ title: t(footer.sections.company, lng), items: footer.companyLinks })}</div>
                            <div className="mt-10 md:mt-0">
                                {renderList({ title: t(footer.sections.legal, lng), items: footer.legal })}
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className="mt-16 sm:mt-20 lg:mt-24" />

                {/* Copyright */}
                <div className="flex flex-wrap justify-between gap-2 pt-8">
                    <p className="text-small text-default-400">
                        {t(footer.copyright, lng)}
                    </p>
                </div>
            </div>
        </footer>
    );
}

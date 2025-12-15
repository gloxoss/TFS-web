"use client";

import React from "react";
import { Divider, Link } from "@heroui/react";
import { footerNavigation } from "./data";
import { useTranslation } from "@/app/i18n/client";

interface FooterWithColumnsProps {
    lng: string;
}

export default function FooterWithColumns({ lng }: FooterWithColumnsProps) {
    const { t } = useTranslation(lng, 'common');

    const renderList = React.useCallback(
        ({ title, items }: { title: string; items: { name: string; href: string }[] }) => (
            <div>
                <h3 className="text-small font-semibold text-default-600">{title}</h3>
                <ul className="mt-6 space-y-4">
                    {items.map((item) => (
                        <li key={item.name}>
                            <Link className="text-default-400" href={`/${lng}${item.href}`} size="sm">
                                {item.name}
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
                        <div className="flex items-center justify-start">
                            <span className="text-2xl font-bold font-display tracking-tight text-foreground">
                                Tv - film - solution
                            </span>
                        </div>
                        <p className="text-small text-default-500">
                            Professional cinema equipment rental for filmmakers, production companies, and content creators.
                            Access the latest cameras, lighting, audio gear, and grip equipment for your next project.
                        </p>
                        <div className="flex space-x-6">
                            {footerNavigation.social.map((item) => (
                                <Link key={item.name} isExternal className="text-default-400" href={item.href}>
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon aria-hidden="true" className="w-6 h-6" />
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>{renderList({ title: "Services", items: footerNavigation.services })}</div>
                            <div className="mt-10 md:mt-0">
                                {renderList({ title: "Support", items: footerNavigation.supportOptions })}
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>{renderList({ title: "About Us", items: footerNavigation.aboutUs })}</div>
                            <div className="mt-10 md:mt-0">
                                {renderList({ title: "Legal", items: footerNavigation.legal })}
                            </div>
                        </div>
                    </div>
                </div>
                <Divider className="mt-16 sm:mt-20 lg:mt-24" />
                <div className="flex flex-wrap justify-between gap-2 pt-8">
                    <p className="text-small text-default-400">
                        &copy; 2024 Tv - film - solution. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

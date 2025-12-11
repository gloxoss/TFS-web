"use client";

import React from "react";
import { Button, Input, Link } from "@heroui/react";
import { Mail, Moon, Sun } from "lucide-react";
import { AcmeIcon } from "@/components/marketing/hero-centered/Icons";
import { footerNavigation } from "./data";

export default function FooterWithColumnsNewsletter() {
    const renderList = React.useCallback(
        ({ title, items }: { title: string; items: { name: string; href: string }[] }) => (
            <div>
                <h3 className="text-small font-semibold text-default-600">{title}</h3>
                <ul className="mt-6 space-y-4">
                    {items.map((item) => (
                        <li key={item.name}>
                            <Link className="text-default-400" href={item.href} size="sm">
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        ),
        [],
    );

    return (
        <footer className="flex w-full flex-col">
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 md:pr-8">
                        <div className="flex items-center justify-start">
                            <AcmeIcon />
                            <span className="text-medium font-medium ml-2">ACME</span>
                        </div>
                        <p className="text-small text-default-500">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique
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

                <div className="my-10 rounded-medium bg-default-200/20 p-4 sm:my-14 sm:p-8 lg:my-16 lg:flex lg:items-center lg:justify-between lg:gap-2">
                    <div>
                        <h3 className="text-small font-semibold text-default-600">
                            Subscribe to our newsletter
                        </h3>
                        <p className="mt-2 text-small text-default-400">
                            Receive weekly updates with the newest insights, trends, and tools, straight to your
                            email.
                        </p>
                    </div>
                    <form className="mt-6 sm:flex sm:max-w-md lg:mt-0">
                        <Input
                            isRequired
                            aria-label="Email"
                            autoComplete="email"
                            id="email-address"
                            labelPlacement="outside"
                            name="email-address"
                            placeholder="johndoe@email.com"
                            startContent={<Mail className="text-default-500" />}
                            type="email"
                        />
                        <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                            <Button color="primary" type="submit">
                                Subscribe
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="flex flex-wrap justify-between gap-2 pt-8">
                    <p className="text-small text-default-400">&copy; 2024 Acme Inc. All rights reserved.</p>
                    <div className="flex items-center gap-2 border p-1 rounded-full">
                        <Sun className="w-4 h-4 text-default-500" />
                        <Moon className="w-4 h-4 text-default-500" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

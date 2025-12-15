"use client";

import React from "react";
import { Link, Spacer } from "@heroui/react";
import { AcmeIcon } from "@/components/marketing/hero-centered/Icons";
import { Facebook, Instagram, Twitter, Github, Youtube } from "lucide-react";

const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#" },
    { name: "Services", href: "#" },
    { name: "Projects", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
];

const socialItems = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "GitHub", href: "#", icon: Github },
    { name: "YouTube", href: "#", icon: Youtube },
];

export default function CenteredFooter() {
    return (
        <footer className="flex w-full flex-col">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8">
                <div className="flex items-center justify-center">
                    <AcmeIcon />
                    <span className="text-medium font-medium ml-2">ACME</span>
                </div>
                <Spacer y={4} />
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            isExternal
                            className="text-default-500"
                            href={item.href}
                            size="sm"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <Spacer y={6} />
                <div className="flex justify-center gap-x-4">
                    {socialItems.map((item) => (
                        <Link key={item.name} isExternal className="text-default-400" href={item.href}>
                            <span className="sr-only">{item.name}</span>
                            <item.icon aria-hidden="true" className="w-5 h-5" />
                        </Link>
                    ))}
                </div>
                <Spacer y={4} />
                <p className="mt-1 text-center text-small text-default-400">
                    &copy; 2024 Acme Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

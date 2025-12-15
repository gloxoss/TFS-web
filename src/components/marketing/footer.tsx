import { Facebook, Github, Instagram, Twitter, Linkedin, Youtube, LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterLink {
    name: string;
    href: string;
}

interface SocialLink {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface FooterNavigation {
    solutions: FooterLink[];
    support: FooterLink[];
    company: FooterLink[];
    legal: FooterLink[];
    social: SocialLink[];
}

const defaultNavigation: FooterNavigation = {
    solutions: [
        { name: 'Marketing', href: '#' },
        { name: 'Analytics', href: '#' },
        { name: 'Automation', href: '#' },
        { name: 'Commerce', href: '#' },
        { name: 'Insights', href: '#' },
    ],
    support: [
        { name: 'Submit ticket', href: '#' },
        { name: 'Documentation', href: '#' },
        { name: 'Guides', href: '#' },
    ],
    company: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Jobs', href: '#' },
        { name: 'Press', href: '#' },
    ],
    legal: [
        { name: 'Terms of service', href: '#' },
        { name: 'Privacy policy', href: '#' },
        { name: 'License', href: '#' },
    ],
    social: [
        { name: 'Facebook', href: '#', icon: Facebook },
        { name: 'Instagram', href: '#', icon: Instagram },
        { name: 'X', href: '#', icon: Twitter },
        { name: 'GitHub', href: '#', icon: Github },
        { name: 'YouTube', href: '#', icon: Youtube },
    ],
};

export default function Footer({ className }: { className?: string }) {
    return (
        <footer className={cn("bg-gray-900", className)}>
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Image
                            alt="Company name"
                            src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                            width={36}
                            height={36}
                            className="h-9 w-auto"
                        />
                        <p className="text-sm/6 text-balance text-gray-300">
                            Making the world a better place through constructing elegant hierarchies.
                        </p>
                        <div className="flex gap-x-6">
                            {defaultNavigation.social.map((item) => (
                                <Link key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon aria-hidden="true" className="size-6" />
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm/6 font-semibold text-white">Solutions</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {defaultNavigation.solutions.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm/6 text-gray-400 hover:text-white">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm/6 font-semibold text-white">Support</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {defaultNavigation.support.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm/6 text-gray-400 hover:text-white">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm/6 font-semibold text-white">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {defaultNavigation.company.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm/6 text-gray-400 hover:text-white">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm/6 font-semibold text-white">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {defaultNavigation.legal.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm/6 text-gray-400 hover:text-white">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-sm/6 text-gray-400">&copy; 2024 Your Company, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeroAction {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
}

interface HeroSplitWithImageProps {
    title?: string;
    description?: string;
    badge?: string;
    badgeLink?: {
        label: string;
        href: string;
    };
    primaryAction?: HeroAction;
    secondaryAction?: HeroAction;
    image?: {
        src: string;
        alt: string;
    };
    className?: string;
}

/**
 * HeroSplitWithImage
 * 
 * A split layout hero section with text on the left and a full-height image on the right (on large screens).
 * Migrated from Tailwind UI "Split with image".
 */
export default function HeroSplitWithImage({
    title = "Data to enrich your business",
    description = "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.",
    badge = "Anim aute id magna aliqua ad ad non deserunt sunt.",
    badgeLink = { label: "Read more", href: "#" },
    primaryAction = { label: "Get started", href: "#", variant: "primary" },
    secondaryAction = { label: "Learn more", href: "#", variant: "secondary" },
    image = {
        src: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2102&q=80",
        alt: "Hero Image"
    },
    className
}: HeroSplitWithImageProps) {
    return (
        <div className={cn("relative bg-white dark:bg-gray-900", className)}>
            <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
                <div className="px-6 pt-10 pb-24 sm:pb-32 lg:col-span-7 lg:px-0 lg:pt-40 lg:pb-48 xl:col-span-6">
                    <div className="mx-auto max-w-lg lg:mx-0">
                        {/* Logo */}
                        <div className="relative h-11 w-auto">
                            <Image
                                alt="Your Company"
                                src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                height={44}
                                width={44}
                                className="h-11 w-auto"
                            />
                        </div>

                        <div className="hidden sm:mt-32 sm:flex lg:mt-16">
                            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-400 dark:ring-gray-700 dark:hover:ring-gray-600">
                                {badge}{' '}
                                <Link href={badgeLink.href} className="font-semibold whitespace-nowrap text-indigo-600 dark:text-indigo-400">
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    {badgeLink.label} <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>

                        <h1 className="mt-24 text-5xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:mt-10 sm:text-7xl">
                            {title}
                        </h1>

                        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 dark:text-gray-400 sm:text-xl/8">
                            {description}
                        </p>

                        <div className="mt-10 flex items-center gap-x-6">
                            <Link
                                href={primaryAction.href}
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {primaryAction.label}
                            </Link>
                            <Link href={secondaryAction.href} className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                {secondaryAction.label} <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
                    <div className="relative aspect-3/2 w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
                        <Image
                            alt={image.alt}
                            src={image.src}
                            fill
                            className="bg-gray-50 object-cover dark:bg-gray-800"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

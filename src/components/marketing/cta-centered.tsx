import Link from "next/link";
import { cn } from "@/lib/utils";

interface CtaProps {
    title?: string;
    description?: string;
    buttons?: {
        primary?: {
            label: string;
            href: string;
        };
        secondary?: {
            label: string;
            href: string;
        };
    };
    className?: string; // For background overrides
}

export default function CtaCentered({
    title = "Boost your productivity. Start using our app today.",
    description = "Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.",
    buttons = {
        primary: { label: "Get started", href: "#" },
        secondary: { label: "Learn more", href: "#" },
    },
    className,
}: CtaProps) {
    return (
        <div className={cn("relative isolate overflow-hidden bg-gray-900", className)}>
            <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
                        {title}
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-300">
                        {description}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        {buttons.primary && (
                            <Link
                                href={buttons.primary.href}
                                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                {buttons.primary.label}
                            </Link>
                        )}
                        {buttons.secondary && (
                            <Link href={buttons.secondary.href} className="text-sm/6 font-semibold text-white">
                                {buttons.secondary.label} <span aria-hidden="true">→</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <svg
                viewBox="0 0 1024 1024"
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            >
                <circle r={512} cx={512} cy={512} fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" fillOpacity="0.7" />
                <defs>
                    <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                        <stop stopColor="#7775D6" />
                        <stop offset={1} stopColor="#E935C1" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    )
}

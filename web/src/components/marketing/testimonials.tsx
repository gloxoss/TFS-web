import Image from "next/image";
import { cn } from "@/lib/utils";

interface Testimonial {
    body: string;
    author: {
        name: string;
        handle: string; // or role
        imageUrl: string;
    };
    logoUrl?: string; // Optional company logo above the quote
}

interface TestimonialsProps {
    testimonials?: Testimonial[];
    className?: string; // Allow customizing the background
}

const defaultTestimonials: Testimonial[] = [
    {
        body: "Amet amet eget scelerisque tellus sit neque faucibus non eleifend. Integer eu praesent at a. Ornare arcu gravida natoque erat et cursus tortor consequat at. Vulputate gravida sociis enim nullam ultricies habitant malesuada lorem ac.",
        author: {
            name: "Judith Black",
            handle: "CEO of Tuple",
            imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        logoUrl: "https://tailwindui.com/plus-assets/img/logos/tuple-logo-white.svg",
    },
    {
        body: "Excepteur veniam labore ullamco eiusmod. Pariatur consequat proident duis dolore nulla veniam reprehenderit nisi officia voluptate incididunt exercitation exercitation elit. Nostrud veniam sint dolor nisi ullamco.",
        author: {
            name: "Joseph Rodriguez",
            handle: "CEO of Reform",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        logoUrl: "https://tailwindui.com/plus-assets/img/logos/reform-logo-white.svg",
    },
];

export default function Testimonials({ testimonials = defaultTestimonials, className }: TestimonialsProps) {
    return (
        <section className={cn("bg-gray-900 py-24 sm:py-32", className)}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex flex-col pb-10 sm:pb-16 lg:pb-0 lg:pr-8 xl:pr-20",
                                index === 1 && "border-t border-white/10 pt-10 sm:pt-16 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 xl:pl-20"
                            )}
                        >
                            {testimonial.logoUrl && (
                                <img
                                    alt="Company Logo"
                                    src={testimonial.logoUrl}
                                    className="h-12 self-start"
                                />
                            )}
                            <figure className="mt-10 flex flex-auto flex-col justify-between">
                                <blockquote className="text-lg/8 text-white">
                                    <p>“{testimonial.body}”</p>
                                </blockquote>
                                <figcaption className="mt-10 flex items-center gap-x-6">
                                    <img
                                        alt={testimonial.author.name}
                                        src={testimonial.author.imageUrl}
                                        className="size-14 rounded-full bg-gray-800"
                                    />
                                    <div className="text-base">
                                        <div className="font-semibold text-white">{testimonial.author.name}</div>
                                        <div className="mt-1 text-gray-400">{testimonial.author.handle}</div>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

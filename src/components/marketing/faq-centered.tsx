"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Minus, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqProps {
    title?: string;
    faqs?: FaqItem[];
    className?: string;
}

const defaultFaqs: FaqItem[] = [
    {
        question: "What's the best thing about Switzerland?",
        answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat."
    },
    {
        question: "How do you make holy water?",
        answer: "You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam aut tempora vitae odio inventore fuga aliquam."
    },
    {
        question: "What do you call someone with no body and no nose?",
        answer: "Nobody knows. Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa recusandae totam ipsum."
    },
    {
        question: "Why do you never see elephants hiding in trees?",
        answer: "Because they're so good at it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, harum."
    },
];

export default function FaqCentered({
    title = "Frequently asked questions",
    faqs = defaultFaqs,
    className
}: FaqProps) {
    return (
        <div className={cn("bg-gray-900", className)}>
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
                    <dl className="mt-16 divide-y divide-white/10">
                        {faqs.map((faq) => (
                            <Disclosure key={faq.question} as="div" className="py-6 first:pt-0 last:pb-0">
                                <dt>
                                    <DisclosureButton className="group flex w-full items-start justify-between text-left text-white">
                                        <span className="text-base/7 font-semibold">{faq.question}</span>
                                        <span className="ml-6 flex h-7 items-center">
                                            <Plus aria-hidden="true" className="size-6 group-data-open:hidden" />
                                            <Minus aria-hidden="true" className="size-6 group-not-data-open:hidden" />
                                        </span>
                                    </DisclosureButton>
                                </dt>
                                <DisclosurePanel as="dd" className="mt-2 pr-12">
                                    <p className="text-base/7 text-gray-300">{faq.answer}</p>
                                </DisclosurePanel>
                            </Disclosure>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}

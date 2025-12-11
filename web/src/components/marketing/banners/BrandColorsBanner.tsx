"use client";

import React from "react";
import { Button, Link } from "@heroui/react";
import { ArrowRight, X } from "lucide-react";

export default function BrandColorsBanner() {
    return (
        <div className="flex w-full items-center gap-x-3 border-b-1 border-divider bg-primary px-6 py-2 sm:px-3.5 sm:before:flex-1">
            <p className="text-small text-primary-foreground">
                <Link className="text-inherit" href="#">
                    The Winter 2024 Release is here: new editor, analytics API, and so much more.&nbsp;
                </Link>
            </p>
            <Button
                as={Link}
                className="group relative h-9 overflow-hidden bg-primary-foreground text-small font-medium text-primary"
                color="default"
                endContent={
                    <ArrowRight
                        className="flex-none outline-none transition-transform group-data-[hover=true]:translate-x-0.5"
                        size={16}
                        strokeWidth={2}
                    />
                }
                href="#"
                radius="full"
            >
                Explore
            </Button>
            <div className="flex flex-1 justify-end">
                <Button isIconOnly aria-label="Close Banner" className="-m-1" size="sm" variant="light">
                    <X aria-hidden="true" className="text-primary-foreground" size={20} />
                </Button>
            </div>
        </div>
    );
}

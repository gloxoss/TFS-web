"use client";

import React from "react";
import { Button, Link } from "@heroui/react";
import { ArrowRight, X } from "lucide-react";

export default function FloatingBanner() {
    return (
        <div className="mx-1 my-2 flex w-full items-center justify-between rounded-large border-1 border-divider bg-gradient-to-r from-default-100 via-danger-100 to-secondary-100 px-6 py-2 sm:mx-2 sm:px-3.5 md:mx-4 shadow-small">
            <div className="flex w-full items-center gap-x-3">
                <p className="text-small text-foreground">
                    <Link className="text-inherit" href="#">
                        The Winter 2024 Release is here: new editor, analytics API, and so much more.&nbsp;
                    </Link>
                </p>
                <Button
                    as={Link}
                    className="group relative h-9 overflow-hidden bg-transparent text-small font-normal"
                    color="default"
                    endContent={
                        <ArrowRight
                            className="flex-none outline-none transition-transform group-data-[hover=true]:translate-x-0.5"
                            size={16}
                            strokeWidth={2}
                        />
                    }
                    href="#"
                    style={{
                        border: "solid 2px transparent",
                        backgroundImage: `linear-gradient(hsl(var(--heroui-danger-50)), hsl(var(--heroui-danger-50))), linear-gradient(to right, #F871A0, #9353D3)`,
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                    }}
                    variant="bordered"
                >
                    Explore
                </Button>
            </div>
            <div className="flex flex-1 justify-end">
                <Button isIconOnly aria-label="Close Banner" className="-m-1" size="sm" variant="light">
                    <X aria-hidden="true" className="text-default-500" size={20} />
                </Button>
            </div>
        </div>
    );
}

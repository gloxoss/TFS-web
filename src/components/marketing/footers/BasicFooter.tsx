"use client";

import React from "react";
import { Chip, Divider } from "@heroui/react";
import { AcmeIcon } from "@/components/marketing/hero-centered/Icons";
// Assuming a ThemeSwitch exists or we mock it. Using a placeholder button for now if not found easily, 
// but usually it's better to just omit or use a simple toggle if the user context doesn't specify one.
// The source used a local file. I'll omit it for now or replace with a simple icon toggle if needed.
// For migration purity, I will comment it out or substitute with a non-functional UI element if critical.
import { Moon, Sun } from "lucide-react";

export default function BasicFooter() {
    return (
        <footer className="flex w-full flex-col">
            <div className="mx-auto w-full max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex flex-col items-center justify-center gap-2 md:order-2 md:items-end">
                    {/* ThemeSwitch placeholder */}
                    <div className="flex items-center gap-2 border p-1 rounded-full">
                        <Sun className="w-4 h-4 text-default-500" />
                        <Moon className="w-4 h-4 text-default-500" />
                    </div>
                </div>
                <div className="mt-4 md:order-1 md:mt-0">
                    <div className="flex items-center justify-center gap-3 md:justify-start">
                        <div className="flex items-center">
                            <AcmeIcon />
                            <span className="text-small font-medium ml-2">ACME</span>
                        </div>
                        <Divider className="h-4" orientation="vertical" />
                        <Chip className="border-none px-0 text-default-500" color="success" variant="dot">
                            All systems operational
                        </Chip>
                    </div>
                    <p className="mt-2 text-center text-tiny text-default-400 md:text-start">
                        &copy; 2024 Acme Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

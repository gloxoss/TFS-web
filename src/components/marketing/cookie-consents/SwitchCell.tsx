"use client";

import React from "react";
import { Switch, SwitchProps, cn } from "@heroui/react";

export type SwitchCellProps = SwitchProps & {
    label: string;
    description: string;
    classNames?: SwitchProps["classNames"] & {
        description?: string;
    };
};

const SwitchCell = React.forwardRef<HTMLInputElement, SwitchCellProps>(
    ({ label, description, classNames, ...props }, ref) => (
        <Switch
            ref={ref}
            classNames={{
                ...classNames,
                base: cn(
                    "inline-flex bg-content2 flex-row-reverse w-full max-w-full items-center justify-between cursor-pointer rounded-medium gap-2 p-4 border-2 border-transparent data-[selected=true]:border-primary",
                    classNames?.base,
                ),
            }}
            {...props}
        >
            <div className="flex flex-col">
                <p className={cn("text-medium", classNames?.label)}>{label}</p>
                <p className={cn("text-tiny text-default-500", classNames?.description)}>{description}</p>
            </div>
        </Switch>
    ),
);

SwitchCell.displayName = "SwitchCell";

export default SwitchCell;

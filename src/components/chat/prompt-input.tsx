"use client";

import React from "react";
import { Button, Tooltip, Textarea } from "@heroui/react";
import { cn } from "@heroui/react";
import { Send, Loader2 } from "lucide-react";

export interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
}

const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
    ({ value, onChange, onSubmit, isLoading, placeholder = "Type a message...", className }, ref) => {
        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if ((value || '').trim() && !isLoading) {
                    onSubmit();
                }
            }
        };


        return (
            <div className={cn("flex w-full items-end gap-2", className)}>
                <div className="relative w-full group">
                    <Textarea
                        ref={ref}
                        aria-label="Message input"
                        classNames={{
                            base: "flex-1",
                            inputWrapper: cn(
                                "bg-zinc-950/30 backdrop-blur-md shadow-inner !border-none ring-1 ring-white/5 group-hover:ring-white/10 transition-all duration-300",
                                "!bg-zinc-950/30",
                                "data-[focus=true]:!bg-black/40 data-[focus=true]:ring-white/10"
                            ),
                            input: "text-sm text-zinc-300 placeholder:text-zinc-600 font-light tracking-wide",
                        }}
                        minRows={1}
                        maxRows={4}
                        placeholder={placeholder}
                        radius="lg"
                        value={value}
                        variant="flat"
                        onKeyDown={handleKeyDown}
                        onValueChange={onChange}
                    />
                    <div className="absolute right-2 bottom-2">
                        <Tooltip content={isLoading ? "Sending..." : "Send message"} className="bg-zinc-900 border border-white/5 text-zinc-400">
                            <Button
                                isIconOnly
                                className={cn(
                                    "min-w-8 h-8 transition-all duration-300",
                                    (value || '').trim()
                                        ? "bg-[#D00000] text-white shadow-[0_0_15px_rgba(208,0,0,0.4)]"
                                        : "bg-transparent text-zinc-700"
                                )}
                                isDisabled={!(value || '').trim() || isLoading}
                                isLoading={isLoading}
                                radius="full"
                                size="sm"
                                spinner={<Loader2 className="w-3 h-3 animate-spin text-white" />}
                                onPress={onSubmit}
                            >
                                {!isLoading && <Send className={cn("w-3 h-3", (value || '').trim() ? "ml-0.5" : "")} />}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        );
    }
);

PromptInput.displayName = "PromptInput";

export default PromptInput;

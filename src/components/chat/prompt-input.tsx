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
                if (value.trim() && !isLoading) {
                    onSubmit();
                }
            }
        };

        return (
            <div className={cn("flex w-full items-end gap-2", className)}>
                <Textarea
                    ref={ref}
                    aria-label="Message input"
                    classNames={{
                        base: "flex-1",
                        inputWrapper: cn(
                            "bg-content2 border-default-200 hover:border-default-400",
                            "data-[focus=true]:border-primary"
                        ),
                        input: "text-small text-default-600 placeholder:text-default-400",
                    }}
                    minRows={1}
                    maxRows={4}
                    placeholder={placeholder}
                    radius="lg"
                    value={value}
                    variant="bordered"
                    onKeyDown={handleKeyDown}
                    onValueChange={onChange}
                    endContent={
                        <div className="flex items-center">
                            <Tooltip content={isLoading ? "Sending..." : "Send message"}>
                                <Button
                                    isIconOnly
                                    className={cn(
                                        "min-w-8 h-8",
                                        value.trim() ? "bg-primary text-primary-foreground" : "bg-default-100 text-default-400"
                                    )}
                                    isDisabled={!value.trim() || isLoading}
                                    isLoading={isLoading}
                                    radius="full"
                                    size="sm"
                                    spinner={<Loader2 className="w-4 h-4 animate-spin" />}
                                    onPress={onSubmit}
                                >
                                    {!isLoading && <Send className="w-4 h-4" />}
                                </Button>
                            </Tooltip>
                        </div>
                    }
                />
            </div>
        );
    }
);

PromptInput.displayName = "PromptInput";

export default PromptInput;

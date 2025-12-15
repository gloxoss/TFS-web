"use client";

import React from "react";
import { Avatar, Button, Tooltip } from "@heroui/react";
import { cn } from "@heroui/react";
import { Copy, Check, ThumbsUp, ThumbsDown, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export type MessageCardProps = React.HTMLAttributes<HTMLDivElement> & {
    role: "user" | "assistant";
    message: React.ReactNode;
    isLoading?: boolean;
    showFeedback?: boolean;
    onMessageCopy?: (content: string) => void;
    onFeedback?: (feedback: "like" | "dislike") => void;
};

const MessageCard = React.forwardRef<HTMLDivElement, MessageCardProps>(
    (
        {
            role,
            message,
            isLoading,
            showFeedback = false,
            onMessageCopy,
            onFeedback,
            className,
            ...props
        },
        ref
    ) => {
        const [feedback, setFeedback] = React.useState<"like" | "dislike">();
        const [copied, setCopied] = React.useState(false);
        const messageRef = React.useRef<HTMLDivElement>(null);

        const isUser = role === "user";
        const hasContent = Boolean(message && (typeof message === 'string' ? message.trim() : true));

        const handleCopy = React.useCallback(() => {
            const valueToCopy = messageRef.current?.textContent || "";
            navigator.clipboard.writeText(valueToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            onMessageCopy?.(valueToCopy);
        }, [onMessageCopy]);

        const handleFeedback = React.useCallback(
            (liked: boolean) => {
                const newFeedback = liked ? "like" : "dislike";
                setFeedback(newFeedback);
                onFeedback?.(newFeedback);
            },
            [onFeedback]
        );

        // Render message content with Markdown support for assistant messages
        const renderContent = () => {
            if (typeof message !== 'string') {
                return message;
            }

            // For assistant messages, render Markdown to support deep links
            if (!isUser) {
                return (
                    <ReactMarkdown
                        components={{
                            // Style links to be visible and use Next.js Link for internal navigation
                            a: ({ href, children }) => {
                                const isInternal = href?.startsWith('/');
                                if (isInternal && href) {
                                    return (
                                        <Link
                                            href={href}
                                            className="text-primary hover:text-primary-600 underline underline-offset-2 font-medium"
                                        >
                                            {children}
                                        </Link>
                                    );
                                }
                                return (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary-600 underline underline-offset-2 font-medium"
                                    >
                                        {children}
                                    </a>
                                );
                            },
                            // Remove paragraph margins for inline text
                            p: ({ children }) => <span>{children}</span>,
                            // Style lists
                            ul: ({ children }) => <ul className="list-disc list-inside mt-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mt-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="ml-2">{children}</li>,
                            // Style code
                            code: ({ children }) => (
                                <code className="bg-content3 px-1.5 py-0.5 rounded text-tiny font-mono">
                                    {children}
                                </code>
                            ),
                            // Bold text
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        }}
                    >
                        {message}
                    </ReactMarkdown>
                );
            }

            // For user messages, render as plain text
            return message;
        };

        return (
            <div
                {...props}
                ref={ref}
                className={cn(
                    "flex gap-3",
                    isUser ? "flex-row-reverse" : "flex-row",
                    className
                )}
            >
                {/* Avatar */}
                <div className="relative flex-none">
                    <Avatar
                        classNames={{
                            base: cn(
                                "w-8 h-8",
                                isUser ? "bg-primary" : "bg-default-100"
                            ),
                            icon: "text-default-500",
                        }}
                        icon={isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        size="sm"
                    />
                </div>

                {/* Message Content */}
                <div className={cn("flex flex-col gap-1.5 max-w-[80%]", isUser ? "items-end" : "items-start")}>
                    {/* Message Bubble */}
                    <div
                        className={cn(
                            "rounded-medium px-4 py-3 text-small",
                            isUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-content2 text-default-600"
                        )}
                    >
                        <div ref={messageRef} className="whitespace-pre-wrap">
                            {isLoading ? (
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            ) : (
                                renderContent()
                            )}
                        </div>
                    </div>

                    {/* Feedback Actions - Now BELOW the message, only when content exists */}
                    {showFeedback && !isUser && !isLoading && hasContent && (
                        <div className="flex items-center gap-0.5 rounded-full bg-content3/50 backdrop-blur-sm px-1">
                            <Tooltip content={copied ? "Copied!" : "Copy"}>
                                <Button
                                    isIconOnly
                                    radius="full"
                                    size="sm"
                                    variant="light"
                                    onPress={handleCopy}
                                    className="w-7 h-7 min-w-7"
                                >
                                    {copied ? (
                                        <Check className="w-3 h-3 text-success" />
                                    ) : (
                                        <Copy className="w-3 h-3 text-default-500" />
                                    )}
                                </Button>
                            </Tooltip>
                            <Tooltip content="Good response">
                                <Button
                                    isIconOnly
                                    radius="full"
                                    size="sm"
                                    variant="light"
                                    onPress={() => handleFeedback(true)}
                                    className="w-7 h-7 min-w-7"
                                >
                                    <ThumbsUp
                                        className={cn(
                                            "w-3 h-3",
                                            feedback === "like" ? "text-success fill-success" : "text-default-500"
                                        )}
                                    />
                                </Button>
                            </Tooltip>
                            <Tooltip content="Bad response">
                                <Button
                                    isIconOnly
                                    radius="full"
                                    size="sm"
                                    variant="light"
                                    onPress={() => handleFeedback(false)}
                                    className="w-7 h-7 min-w-7"
                                >
                                    <ThumbsDown
                                        className={cn(
                                            "w-3 h-3",
                                            feedback === "dislike" ? "text-danger fill-danger" : "text-default-500"
                                        )}
                                    />
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

MessageCard.displayName = "MessageCard";

export default MessageCard;

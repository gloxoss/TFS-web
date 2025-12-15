/**
 * Chat Widget
 * 
 * Floating AI chatbot interface for equipment recommendations.
 * Uses Vercel AI SDK v4 useChat hook for streaming.
 * Styled with HeroUI components for consistency.
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardBody, CardHeader, CardFooter, Chip } from '@heroui/react'
import { cn } from '@heroui/react'
import {
    MessageCircle,
    X,
    Sparkles,
    Camera,
    Lightbulb,
    Search,
    Bot,
} from 'lucide-react'
import { ChatProductCarousel } from './chat-product-card'
import MessageCard from './message-card'
import PromptInput from './prompt-input'
import { StoreInfoCard, StoreInfoData } from './store-info-card'
import { NavigationCard, NavigationCardData } from './navigation-card'

// Starter suggestions
const STARTER_CHIPS = [
    { icon: Camera, text: '🎥 Recommend a Camera Kit', query: 'I need a camera kit for a commercial shoot' },
    { icon: Lightbulb, text: '💡 Lighting Package', query: 'What lighting do you recommend for an interview setup?' },
    { icon: Search, text: '📍 Location & Hours', query: 'Where are you located and what are your opening hours?' },
]

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const params = useParams()
    const lng = (params?.lng as string) || 'en'

    // AI SDK v4 useChat hook
    const {
        messages,
        input,
        setInput,
        handleSubmit,
        isLoading,
        append,
        error,
    } = useChat({
        api: '/api/chat',
        id: 'rental-concierge',
    })

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const handleStarterClick = (query: string) => {
        setHasInteracted(true)
        append({ role: 'user', content: query })
    }

    const onSubmit = () => {
        if (!input.trim()) return
        setHasInteracted(true)
        handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>)
    }

    return (
        <>
            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-6 z-40"
                    >
                        <Button
                            isIconOnly
                            className="w-14 h-14 bg-primary shadow-lg shadow-primary/30 hover:shadow-primary/50"
                            radius="full"
                            size="lg"
                            onPress={() => setIsOpen(true)}
                            aria-label="Open chat"
                        >
                            <MessageCircle className="w-6 h-6" />
                        </Button>
                        {/* Online indicator */}
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 z-40 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)]"
                    >
                        <Card className="h-full bg-content1/95 backdrop-blur-xl border border-default-200 shadow-2xl">
                            {/* Header */}
                            <CardHeader className="flex items-center justify-between px-4 py-3 border-b border-default-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-small font-semibold text-foreground">Rental Concierge</h3>
                                        <p className="text-tiny text-default-500">Powered by AI</p>
                                    </div>
                                </div>
                                <Button
                                    isIconOnly
                                    radius="lg"
                                    size="sm"
                                    variant="light"
                                    onPress={() => setIsOpen(false)}
                                >
                                    <X className="w-5 h-5 text-default-500" />
                                </Button>
                            </CardHeader>

                            {/* Messages Area - overscroll-contain prevents page scroll when chat is scrolled */}
                            <CardBody
                                className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain"
                                style={{ overscrollBehavior: 'contain' }}
                            >
                                {/* Empty State - Starter Chips */}
                                {messages.length === 0 && !hasInteracted && (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center mb-4">
                                            <Bot className="w-8 h-8 text-primary" />
                                        </div>
                                        <h4 className="text-large font-semibold text-foreground mb-2">
                                            Welcome to TFS Film Equipment
                                        </h4>
                                        <p className="text-small text-default-500 mb-6">
                                            I can help you find the perfect gear for your shoot.
                                        </p>
                                        <div className="space-y-2 w-full max-w-xs">
                                            {STARTER_CHIPS.map((chip, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Chip
                                                        as="button"
                                                        className="w-full h-auto py-3 px-4 cursor-pointer"
                                                        classNames={{
                                                            base: "bg-content2 hover:bg-content3 border border-default-200",
                                                            content: "text-small text-default-600 text-left",
                                                        }}
                                                        radius="lg"
                                                        variant="flat"
                                                        onClick={() => handleStarterClick(chip.query)}
                                                    >
                                                        {chip.text}
                                                    </Chip>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Message Thread */}
                                {messages.map((message) => {
                                    // Skip rendering empty assistant messages (happens during tool calls)
                                    const hasContent: boolean = Boolean(message.content && message.content.trim().length > 0);
                                    const isAssistant = message.role === 'assistant';

                                    return (
                                        <div key={message.id} className="space-y-3">
                                            {/* Only render MessageCard if there's content, or it's a user message */}
                                            {(hasContent || !isAssistant) && (
                                                <MessageCard
                                                    role={message.role as 'user' | 'assistant'}
                                                    message={message.content}
                                                    showFeedback={isAssistant && Boolean(hasContent)}
                                                />
                                            )}

                                            {/* Tool invocations - Generative UI */}
                                            {message.role === 'assistant' && message.toolInvocations?.map((tool) => {
                                                if (tool.state === 'result') {
                                                    // Handle equipment lookup
                                                    if (tool.toolName === 'lookup_equipment') {
                                                        const result = tool.result as { equipment?: Array<{ id: string; name: string; slug: string; category?: string; description?: string; imageUrl?: string; isAvailable?: boolean }> }
                                                        if (result.equipment && result.equipment.length > 0) {
                                                            return (
                                                                <div key={tool.toolCallId} className="ml-11">
                                                                    <ChatProductCarousel
                                                                        products={result.equipment}
                                                                        lng={lng}
                                                                    />
                                                                </div>
                                                            )
                                                        }
                                                    }
                                                    // Handle store info
                                                    if (tool.toolName === 'get_store_info') {
                                                        const result = tool.result as StoreInfoData
                                                        return (
                                                            <div key={tool.toolCallId} className="ml-11">
                                                                <StoreInfoCard data={result} />
                                                            </div>
                                                        )
                                                    }
                                                    // Handle site navigation
                                                    if (tool.toolName === 'navigate_site') {
                                                        const result = tool.result as NavigationCardData
                                                        return (
                                                            <div key={tool.toolCallId} className="ml-11">
                                                                <NavigationCard data={result} />
                                                            </div>
                                                        )
                                                    }
                                                }
                                                return null
                                            })}
                                        </div>
                                    );
                                })}

                                {/* Loading indicator */}
                                {isLoading && (
                                    <MessageCard
                                        role="assistant"
                                        message=""
                                        isLoading={true}
                                    />
                                )}

                                {/* Error state */}
                                {error && (
                                    <div className="px-4 py-3 bg-danger/10 border border-danger/30 rounded-medium">
                                        <p className="text-small text-danger">
                                            Something went wrong. Please try again.
                                        </p>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </CardBody>

                            {/* Input Area */}
                            <CardFooter className="flex-col gap-2 p-4 border-t border-default-200">
                                <PromptInput
                                    ref={inputRef}
                                    value={input}
                                    onChange={setInput}
                                    onSubmit={onSubmit}
                                    isLoading={isLoading}
                                    placeholder="Ask about equipment..."
                                />
                                <p className="text-tiny text-default-400 text-center">
                                    AI can make mistakes. Verify important info.
                                </p>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

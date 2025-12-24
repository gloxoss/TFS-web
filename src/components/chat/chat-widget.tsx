/**
 * Chat Widget
 * 
 * Floating AI chatbot interface for equipment recommendations.
 * Uses Vercel AI SDK v5 useChat hook with DefaultChatTransport for streaming.
 * Styled with HeroUI components for consistency.
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
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
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const params = useParams()
    const lng = (params?.lng as string) || 'en'

    // AI SDK v5 useChat hook with transport-based architecture
    const {
        messages,
        sendMessage,
        status,
        error,
    } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
        id: 'rental-concierge',
        onError: (error) => {
            console.error('Chat error:', error)
        },
    })

    // Derive loading state from status
    const isLoading = status === 'streaming' || status === 'submitted'

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
        sendMessage({ text: query })
    }

    const onSubmit = () => {
        if (!input.trim()) return
        setHasInteracted(true)
        sendMessage({ text: input })
        setInput('')
    }

    // Helper to extract text from message parts
    const getMessageText = (message: typeof messages[0]): string => {
        if ('content' in message && typeof message.content === 'string') {
            return message.content
        }
        if ('parts' in message && Array.isArray(message.parts)) {
            return message.parts
                .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
                .map(part => part.text)
                .join('')
        }
        return ''
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
                        className="fixed bottom-6 right-6 z-40 group"
                    >
                        <Button
                            isIconOnly
                            className="w-14 h-14 bg-black/80 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(208,0,0,0.4)] hover:border-[#D00000]/50 transition-all duration-500"
                            radius="lg"
                            size="lg"
                            onPress={() => setIsOpen(true)}
                            aria-label="Open chat"
                        >
                            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                        </Button>
                        {/* Online indicator */}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#D00000] rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_#D00000]" />
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
                        <Card className="h-full bg-zinc-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
                            {/* Header */}
                            <CardHeader className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-transparent">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-[#D00000]" />
                                    <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase font-display">TFS Intelligence</h3>
                                </div>
                                <Button
                                    isIconOnly
                                    radius="full"
                                    size="sm"
                                    variant="light"
                                    className="hover:bg-white/5 text-zinc-500 hover:text-white"
                                    onPress={() => setIsOpen(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </CardHeader>

                            {/* Messages Area - overscroll-contain prevents page scroll when chat is scrolled */}
                            <CardBody
                                className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain"
                                style={{ overscrollBehavior: 'contain' }}
                            >
                                {/* Empty State - Starter Chips */}
                                {messages.length === 0 && !hasInteracted && (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                        <div className="relative mb-8 group">
                                            <div className="absolute inset-0 bg-[#D00000] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
                                            <Bot className="relative w-10 h-10 text-white/90" />
                                        </div>
                                        <h4 className="text-lg font-light text-white/80 mb-3 tracking-wide font-display">
                                            How can we visualize your story?
                                        </h4>
                                        <p className="text-xs text-zinc-500 mb-8 max-w-[200px] leading-relaxed">
                                            Expert equipment recommendations for your production needs.
                                        </p>
                                        <div className="space-y-2 w-full max-w-[280px]">
                                            {STARTER_CHIPS.map((chip, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <button
                                                        onClick={() => handleStarterClick(chip.query)}
                                                        className="w-full text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 group"
                                                    >
                                                        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                                            {chip.text}
                                                        </span>
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Message Thread */}
                                {messages.map((message) => {
                                    const messageText = getMessageText(message)
                                    const hasContent: boolean = Boolean(messageText && messageText.trim().length > 0);
                                    const isAssistant = message.role === 'assistant';

                                    return (
                                        <div key={message.id} className="space-y-3">
                                            {/* Only render MessageCard if there's content, or it's a user message */}
                                            {(hasContent || !isAssistant) && (
                                                <MessageCard
                                                    role={message.role as 'user' | 'assistant'}
                                                    message={messageText}
                                                    showFeedback={isAssistant && Boolean(hasContent)}
                                                />
                                            )}

                                            {/* Tool invocations - Generative UI */}
                                            {message.role === 'assistant' && 'parts' in message && Array.isArray(message.parts) && message.parts.map((part, partIndex) => {
                                                if (part.type === 'tool-invocation' && part.toolInvocation?.state === 'result') {
                                                    const tool = part.toolInvocation
                                                    // Handle equipment lookup
                                                    if (tool.toolName === 'lookup_equipment') {
                                                        const result = tool.result as { equipment?: Array<{ id: string; name: string; slug: string; category?: string; description?: string; imageUrl?: string; isAvailable?: boolean }> }
                                                        if (result.equipment && result.equipment.length > 0) {
                                                            return (
                                                                <div key={`${message.id}-${partIndex}`} className="ml-11">
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
                                                            <div key={`${message.id}-${partIndex}`} className="ml-11">
                                                                <StoreInfoCard data={result} />
                                                            </div>
                                                        )
                                                    }
                                                    // Handle site navigation
                                                    if (tool.toolName === 'navigate_site') {
                                                        const result = tool.result as NavigationCardData
                                                        return (
                                                            <div key={`${message.id}-${partIndex}`} className="ml-11">
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
            </AnimatePresence >
        </>
    )
}

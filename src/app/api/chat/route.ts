/**
 * Chat API Route Handler
 * 
 * Streaming chat endpoint.
 * Tools temporarily disabled to test Groq API connection.
 */

import { streamText, convertToModelMessages, UIMessage } from 'ai'
import { getAIModel, CONCIERGE_SYSTEM_PROMPT, AI_MODEL } from '@/lib/ai/config'

// POST /api/chat
export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json()
        const recentMessages = messages.slice(-10)

        console.log('Chat API called - using model:', AI_MODEL)
        console.log('Provider:', process.env.AI_PROVIDER || 'openrouter (default)')

        // Check if API key is configured
        const hasGroqKey = Boolean(process.env.GROQ_API_KEY)
        const hasOpenRouterKey = Boolean(process.env.OPENROUTER_API_KEY)
        console.log('API Keys configured - Groq:', hasGroqKey, 'OpenRouter:', hasOpenRouterKey)

        if (!hasGroqKey && !hasOpenRouterKey) {
            console.error('No AI API key configured! Set OPENROUTER_API_KEY or GROQ_API_KEY in .env')
            return new Response(
                JSON.stringify({ error: 'No AI API key configured' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const result = await streamText({
            model: getAIModel(),
            system: CONCIERGE_SYSTEM_PROMPT,
            messages: convertToModelMessages(recentMessages),
        })

        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.error('Chat API error:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to process chat request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

/**
 * Chat API Route Handler
 * 
 * Streaming chat endpoint.
 * Tools temporarily disabled to test Groq API connection.
 */

import { streamText } from 'ai'
import { getAIModel, CONCIERGE_SYSTEM_PROMPT } from '@/lib/ai/config'

// POST /api/chat
export async function POST(req: Request) {
    try {
        const { messages } = await req.json()
        const recentMessages = messages.slice(-10)

        console.log('Using AI model, provider configured')

        const result = streamText({
            model: getAIModel(),
            system: CONCIERGE_SYSTEM_PROMPT,
            messages: recentMessages,
        })

        return result.toDataStreamResponse()
    } catch (error) {
        console.error('Chat API error:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to process chat request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

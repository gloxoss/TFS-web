/**
 * Chat API Route Handler
 * 
 * Purely textual chatbot - no tool calls.
 * Links to category pages instead of individual products.
 */

// Rate Limiter (Simple In-Memory for VPS/Serverless)
const RATE_LIMIT = new Map<string, { count: number; lastReset: number }>();
const LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15; // 15 messages per minute

import { streamText, convertToModelMessages, UIMessage } from 'ai'
import { getAIModel, CONCIERGE_SYSTEM_PROMPT, AI_MODEL } from '@/lib/ai/config'

// POST /api/chat
export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json()

        // 1. Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        const userLimit = RATE_LIMIT.get(ip) || { count: 0, lastReset: now };
        if (now - userLimit.lastReset > LIMIT_WINDOW) { userLimit.count = 0; userLimit.lastReset = now; }
        if (userLimit.count >= MAX_REQUESTS) {
            return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), { status: 429 });
        }
        userLimit.count++;
        RATE_LIMIT.set(ip, userLimit);

        // 2. Prepare Context (last 10 messages)
        const recentMessages = messages.slice(-10)

        console.log(`[Chat] IP:${ip} Model:${AI_MODEL} Mode:TextOnly`);

        // 3. Stream Text (NO TOOLS - pure text response)
        const result = await streamText({
            model: getAIModel(),
            system: CONCIERGE_SYSTEM_PROMPT,
            messages: convertToModelMessages(recentMessages),
        })

        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.error('Chat API error:', error)
        return new Response(JSON.stringify({ error: 'Failed to process request' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
}


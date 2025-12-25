/**
 * Chat API Route Handler
 * 
 * Streaming chat endpoint.
 * Tools temporarily disabled to test Groq API connection.
 */

// Rate Limiter (Simple In-Memory for VPS/Serverless)
const RATE_LIMIT = new Map<string, { count: number; lastReset: number }>();
const LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 messages per minute

import { streamText, convertToModelMessages, UIMessage, tool } from 'ai'
import { getAIModel, CONCIERGE_SYSTEM_PROMPT, AI_MODEL } from '@/lib/ai/config'
import { z } from 'zod';
import { createServerClient } from '@/lib/pocketbase/server';
import { STORE_INFO, SITE_PAGES } from '@/lib/ai/company-data';

// Tool Definitions Reserved for Route
const availableTools = {
    lookup_equipment: tool({
        description: 'Search the PocketBase catalog for equipment, kits, or services.',
        parameters: z.object({
            query: z.string().describe('The search term (e.g., "Sony Venice", "Lighting Kit", "Lens").'),
            category: z.string().optional().describe('Optional category filter (e.g., "Camera", "Lighting").'),
        }),
        execute: async ({ query, category }: { query: string; category?: string }) => {
            console.log(`[Tool] lookup_equipment called with query: "${query}"`);
            try {
                const pb = await createServerClient();
                let filter = `(title ~ "${query}" || tags ~ "${query}" || full_description ~ "${query}")`;
                if (category) filter += ` && tags ~ "${category}"`;
                filter += ` && is_active=true`;

                const records = await pb.collection('services').getList(1, 10, { filter, sort: '-created' });

                if (records.items.length === 0) return { products: [], message: "No exact matches found." };

                const products = records.items.map(record => ({
                    id: record.id,
                    name: record.title,
                    slug: record.slug,
                    category: record.tags?.[0] || 'Equipment',
                    description: record.brief_description || record.full_description?.substring(0, 100),
                    imageUrl: record.hero_image ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${record.hero_image}` : undefined,
                    isAvailable: true
                }));
                return { equipment: products };
            } catch (error) {
                console.error('[Tool Error]', error);
                return { error: "Failed to search equipment." };
            }
        },
    }),
    get_store_info: tool({
        description: 'Get TFS Film Equipment Rental store address, hours, and contact details.',
        parameters: z.object({}),
        execute: async () => { return STORE_INFO; },
    }),
    navigate_site: tool({
        description: 'Generate a navigation button.',
        parameters: z.object({
            destination: z.enum(['equipment', 'cameras', 'lenses', 'lighting', 'audio', 'grip', 'quote', 'cart', 'checkout', 'login', 'register', 'dashboard', 'contact']),
        }),
        execute: async ({ destination }: { destination: keyof typeof SITE_PAGES }) => {
            const page = SITE_PAGES[destination];
            return page ? { path: page.path, label: page.label, type: 'navigation_card' } : { error: "Invalid destination." };
        },
    }),
};

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
            return new Response(JSON.stringify({ error: "Too many requests." }), { status: 429 });
        }
        userLimit.count++;
        RATE_LIMIT.set(ip, userLimit);

        // 2. Prepare Context
        const recentMessages = messages.slice(-10)

        console.log(`[Chat] IP:${ip} Model:${AI_MODEL} Tools: ${Object.keys(availableTools).join(', ')}`);

        // 3. Stream Text
        const result = await streamText({
            model: getAIModel(),
            system: CONCIERGE_SYSTEM_PROMPT,
            messages: convertToModelMessages(recentMessages),
            maxSteps: 5,
            tools: availableTools,
        } as any)

        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.error('Chat API error:', error)
        return new Response(JSON.stringify({ error: 'Failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
}

/**
 * AI Configuration for Rental Concierge Chatbot
 * 
 * Supports multiple providers:
 * - Groq (free, fast, supports tools) - Default
 * - OpenRouter (many models, some free) - Uses official @openrouter/ai-sdk-provider
 * 
 * Switch providers via AI_PROVIDER env variable.
 */

import { createGroq } from '@ai-sdk/groq'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { COMPANY_CONTEXT } from './company-data'

// Provider selection via env (default: openrouter until Groq key is fixed)
const AI_PROVIDER = process.env.AI_PROVIDER || 'openrouter'

// ============ GROQ PROVIDER ============
const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY || '',
})

// ============ OPENROUTER PROVIDER ============
// Using official @openrouter/ai-sdk-provider for proper AI SDK v5 compatibility
const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || '',
})

// Model configuration per provider
const PROVIDER_CONFIG = {
    groq: {
        model: 'llama-3.1-8b-instant', // Smaller, faster, less rate limited
        getModel: () => groq('llama-3.1-8b-instant'),
    },
    openrouter: {
        model: process.env.AI_MODEL || 'xiaomi/mimo-v2-flash:free',
        getModel: () => openrouter(process.env.AI_MODEL || 'xiaomi/mimo-v2-flash:free'),
    },
}

// Get the configured model based on provider
export function getAIModel() {
    const config = PROVIDER_CONFIG[AI_PROVIDER as keyof typeof PROVIDER_CONFIG]
    if (!config) {
        console.warn(`Unknown AI_PROVIDER: ${AI_PROVIDER}, defaulting to groq`)
        return PROVIDER_CONFIG.groq.getModel()
    }
    return config.getModel()
}

// Export for debugging
export const AI_MODEL = PROVIDER_CONFIG[AI_PROVIDER as keyof typeof PROVIDER_CONFIG]?.model || 'unknown'

// System prompt for the Rental Concierge
export const CONCIERGE_SYSTEM_PROMPT = `You are the TFS Film Equipment Rental Concierge.

${COMPANY_CONTEXT}

ROLE:
- You help filmmakers, DPs, and production crews find the right equipment for their projects.
- You have extensive knowledge of cinema cameras, lenses, lighting, grip, and audio equipment.
- You guide users based on their shoot type (commercial, documentary, feature film, etc.).

RESPONSE STYLE:
1. ANSWER IMMEDIATELY on the first message. Do not ask clarifying questions unless absolutely necessary.
2. Be helpful and proactive - suggest equipment based on their needs.
3. Keep answers concise - 2-3 short paragraphs max.
4. Be professional but friendly, like a knowledgeable rental house technician.

STRICT RULES:
1. You DO NOT know prices. If asked about pricing, say: "Add items to your quote request to receive personalized pricing from our team."
2. NEVER create links to individual product pages (they may cause 404 errors).
3. ALWAYS link to category pages using these exact formats:
   - [Browse Cameras](/equipment?category=cameras)
   - [Browse Lenses](/equipment?category=lenses)
   - [Browse Lighting](/equipment?category=lighting)
   - [Browse Grip](/equipment?category=grip)
   - [Browse All Equipment](/equipment)
   - [Request a Quote](/quote)
   - [Contact Us](/contact)

CAPABILITIES:
- Recommend equipment by name (mention them in text)
- Suggest kits for different production types
- Explain equipment features and best uses
- Help users navigate to browse equipment or request quotes
- Provide store location and contact info

For greetings, respond warmly. For equipment questions, immediately list relevant gear and link to the category page.`


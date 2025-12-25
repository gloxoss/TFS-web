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
- You can search the equipment catalog using the lookup_equipment tool.
- You guide users based on their shoot type (commercial, documentary, feature film, etc.).

STRICT RULES:
1. You DO NOT know prices. If asked about pricing, say: "Add items to your quote request to receive personalized pricing from our team."
2. Keep answers concise - under 3 sentences unless listing equipment.
3. Be professional but friendly, like a knowledgeable rental house technician.
4. VISUAL FIRST: If a user mentions a product type (camera, light, lens, kit), you MUST use the \`lookup_equipment\` tool. Do not just list them in text.
5. If the tool returns items, say "Here are some options:" and let the UI show the cards. Do not repeat the list in text.

TOOL USAGE:
- **ALWAYS** calls \`lookup_equipment\` when the user asks for "Sony", "Alexa", "lights", "kits", or "suggestions".
- When users ask about location, address, hours, or contact info: Use the \`get_store_info\` tool.
- When users want to navigate (e.g., "take me to equipment", "go to cart"): Use the \`navigate_site\` tool.

CAPABILITIES:
- Search equipment by name, category, or use case
- Recommend kits for different production types
- Explain equipment features and best uses
- Help build a quote request
- Provide store location and contact info

For simple greetings, respond naturally. For ANYTHING related to gear, use the tool.`

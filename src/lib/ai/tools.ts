import { z } from 'zod';
import { createServerClient } from '@/lib/pocketbase/server';
import { STORE_INFO, SITE_PAGES } from './company-data';

// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

export const tools = {
    lookup_equipment: {
        description: 'Search the PocketBase catalog for equipment, kits, or services.',
        parameters: z.object({
            query: z.string().describe('The search term (e.g., "Sony Venice", "Lighting Kit", "Lens").'),
            category: z.string().optional().describe('Optional category filter (e.g., "Camera", "Lighting").'),
        }),
        execute: async ({ query, category }: { query: string; category?: string }) => {
            console.log(`[Tool] lookup_equipment called with query: "${query}"`);
            try {
                const pb = await createServerClient();

                // Build filter
                // We search in 'title', 'tags', and 'description'
                let filter = `(title ~ "${query}" || tags ~ "${query}" || full_description ~ "${query}")`;

                if (category) {
                    filter += ` && tags ~ "${category}"`;
                }

                // Only show active items
                filter += ` && is_active=true`;

                const records = await pb.collection('services').getList(1, 10, {
                    filter,
                    sort: '-created',
                });

                if (records.items.length === 0) {
                    return {
                        products: [],
                        message: "No exact matches found. Try a broader search term like 'Camera' or 'Lighting'."
                    };
                }

                // Map PocketBase Application records to ChatProduct format
                const products = records.items.map(record => ({
                    id: record.id,
                    name: record.title, // 'services' uses 'title'
                    slug: record.slug,
                    category: record.tags?.[0] || 'Equipment', // Use first tag as category
                    description: record.brief_description || record.full_description?.substring(0, 100),
                    imageUrl: record.hero_image
                        ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${record.hero_image}`
                        : undefined,
                    isAvailable: true // Assume active services are available
                }));

                return { equipment: products };
            } catch (error) {
                console.error('[Tool Error] lookup_equipment:', error);
                return { error: "Failed to search equipment catalog." };
            }
        },
    },

    get_store_info: {
        description: 'Get TFS Film Equipment Rental store address, hours, and contact details.',
        parameters: z.object({}),
        execute: async () => {
            console.log('[Tool] get_store_info called');
            return STORE_INFO;
        },
    },

    navigate_site: {
        description: 'Generate a navigation button to take the user to a specific page on the website.',
        parameters: z.object({
            destination: z.enum([
                'equipment', 'cameras', 'lenses', 'lighting', 'audio', 'grip',
                'quote', 'cart', 'checkout', 'login', 'register', 'dashboard', 'contact'
            ]).describe('The logical destination ID.'),
        }),
        execute: async ({ destination }: { destination: keyof typeof SITE_PAGES }) => {
            console.log(`[Tool] navigate_site called for: ${destination}`);
            const page = SITE_PAGES[destination];
            if (!page) {
                return { error: "Invalid destination." };
            }
            return {
                path: page.path,
                label: page.label,
                type: 'navigation_card' // Frontend triggers NavigationCard
            };
        },
    },
};

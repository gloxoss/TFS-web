/**
 * Blog Post Types
 * 
 * Bilingual blog posts with SEO-friendly fields.
 */

export interface BlogPost {
    id: string
    // Bilingual fields
    titleEn: string
    titleFr: string
    // Computed based on current language
    title: string
    slug: string
    excerptEn?: string
    excerptFr?: string
    excerpt?: string
    contentEn?: string
    contentFr?: string
    content?: string
    coverImage?: string
    category?: 'news' | 'tips' | 'industry' | 'behind-the-scenes'
    published: boolean
    publishedAt?: string
    created: string
    updated: string
}

export interface BlogFilters {
    category?: string
    published?: boolean
}

/**
 * Blog Service
 * 
 * Fetches blog posts from PocketBase with bilingual support.
 * 
 * Note: The posts collection has listRule = "published = true" so we don't
 * need to filter by published in our queries - PocketBase handles it.
 */

import PocketBase, { RecordModel } from 'pocketbase'
import { BlogPost, BlogFilters } from './types'

const PB_URL_RAW = process.env.NEXT_PUBLIC_POCKETBASE_URL;
if (!PB_URL_RAW && process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_POCKETBASE_URL is not defined');
}
const PB_URL = PB_URL_RAW || 'http://127.0.0.1:8090';

/**
 * Map PocketBase record to BlogPost
 */
function mapRecordToPost(record: RecordModel, lang: string = 'en'): BlogPost {
    const isEn = lang === 'en'

    // Build cover image URL
    let coverImage: string | undefined
    if (record.cover_image) {
        coverImage = `${PB_URL}/api/files/${record.collectionId}/${record.id}/${record.cover_image}`
    }

    return {
        id: record.id,
        titleEn: record.title_en || '',
        titleFr: record.title_fr || '',
        title: isEn ? (record.title_en || record.title_fr) : (record.title_fr || record.title_en),
        slug: record.slug || '',
        excerptEn: record.excerpt_en,
        excerptFr: record.excerpt_fr,
        excerpt: isEn ? (record.excerpt_en || record.excerpt_fr) : (record.excerpt_fr || record.excerpt_en),
        contentEn: record.content_en,
        contentFr: record.content_fr,
        content: isEn ? (record.content_en || record.content_fr) : (record.content_fr || record.content_en),
        coverImage,
        category: record.category,
        published: record.published || false,
        publishedAt: record.published_at,
        created: record.created,
        updated: record.updated
    }
}

export class BlogService {
    private pb: PocketBase

    constructor(pbClient: PocketBase) {
        this.pb = pbClient
    }

    /**
     * Get latest published posts for home page
     * Note: listRule already filters to published = true
     */
    async getLatestPosts(limit: number = 4, lang: string = 'en'): Promise<BlogPost[]> {
        try {
            const result = await this.pb.collection('posts').getList(1, limit)
            return result.items.map(record => mapRecordToPost(record, lang))
        } catch (error: any) {
            // Don't log 404 errors (collection might not exist yet)
            if (error?.status !== 404) {
                console.error('[BlogService] Error fetching latest posts:', error?.message || error)
            }
            return []
        }
    }

    /**
     * Get all published posts
     * Note: listRule already filters to published = true
     */
    async getAllPosts(lang: string = 'en', filters?: BlogFilters): Promise<BlogPost[]> {
        try {
            const options: any = {}

            // Only add filter if category is specified
            if (filters?.category) {
                options.filter = `category = "${filters.category}"`
            }

            const result = await this.pb.collection('posts').getList(1, 50, options)
            return result.items.map(record => mapRecordToPost(record, lang))
        } catch (error: any) {
            // Don't log 404 errors (collection might not exist yet)
            if (error?.status !== 404) {
                console.error('[BlogService] Error fetching posts:', error?.message || error)
            }
            return []
        }
    }

    /**
     * Get single post by slug
     * Note: viewRule already filters to published = true
     */
    async getPostBySlug(slug: string, lang: string = 'en'): Promise<BlogPost | null> {
        try {
            const result = await this.pb.collection('posts').getFirstListItem(
                `slug = "${slug}"`
            )
            return mapRecordToPost(result, lang)
        } catch (error: any) {
            // 404 is expected when post doesn't exist
            if (error?.status !== 404) {
                console.error('[BlogService] Error fetching post:', error?.message || error)
            }
            return null
        }
    }

    /**
     * Get posts by category
     */
    async getPostsByCategory(category: string, lang: string = 'en'): Promise<BlogPost[]> {
        return this.getAllPosts(lang, { category })
    }
}

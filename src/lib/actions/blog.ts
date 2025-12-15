'use server'

import { createServerClient } from "@/lib/pocketbase/server"
import { revalidatePath } from "next/cache"
import { slugify } from "@/lib/utils/slugify"

export type BlogActionResult = {
    success: boolean
    error?: string
    data?: any
}

export async function createPost(formData: FormData): Promise<BlogActionResult> {
    try {
        const pb = await createServerClient()

        // Basic validation
        const title = formData.get('title')
        const content = formData.get('content')

        if (!title) {
            return { success: false, error: "Title is required" }
        }

        // Ensure slug exists
        let slug = formData.get('slug')?.toString()
        if (!slug) {
            slug = slugify(title.toString())
        }

        // Construct clean data object
        const data: Record<string, any> = {
            title,
            slug,
            content: content || '',
            excerpt: formData.get('excerpt') || '',
            published: formData.get('published') === 'true',
        }

        // Handle cover image separately
        const coverImage = formData.get('cover_image')
        if (coverImage && coverImage instanceof File && coverImage.size > 0) {
            data.cover_image = coverImage
        }

        console.log('[BlogAction] Creating post:', { ...data, cover_image: data.cover_image ? 'File present' : 'No file' })

        // Create record
        const record = await pb.collection('posts').create(data)

        // Revalidate admin dashboard and blog pages
        revalidatePath('/[lng]/admin/admin/blog', 'page')
        revalidatePath('/[lng]/blog', 'layout')

        return { success: true, data: record }

    } catch (error: any) {
        console.error('[BlogAction] Error creating post:', error)

        let errorMessage = "Failed to create post"
        if (error?.response?.data) {
            // Format detailed validation errors
            const details = Object.entries(error.response.data)
                .map(([key, val]: [string, any]) => `${key}: ${val.message}`)
                .join(', ')
            if (details) errorMessage += `: ${details}`
        } else if (error?.message) {
            errorMessage += `: ${error.message}`
        }

        return { success: false, error: errorMessage }
    }
}

/**
 * Slugify Utility
 * 
 * Converts string to URL-friendly slug.
 */

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^a-z0-9-]+/g, '')  // Remove all non-word chars (strict: only a-z, 0-9, -)
        .replace(/--+/g, '-')     // Replace multiple - with single -
}

/**
 * Blog List Page
 * 
 * Displays all published blog posts with category filtering.
 */

import { createServerClient } from '@/lib/pocketbase/server'
import { getBlogService } from '@/services'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/app/i18n'
import { Calendar, ArrowRight } from 'lucide-react'

export default async function BlogPage({ params }: { params: Promise<{ lng: string }> }) {
    const { lng } = await params
    const { t } = await useTranslation(lng, 'blog')

    const pb = await createServerClient()
    const blogService = getBlogService(pb)
    const posts = await blogService.getAllPosts(lng)

    return (
        <div className="min-h-screen bg-zinc-950 pt-32 pb-24">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
                <h1 className="text-4xl md:text-6xl font-bold font-display uppercase tracking-tight text-white mb-4">
                    {t('landing.title')}
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl">
                    {t('landing.subtitle')}
                </p>
            </div>

            {/* Posts Grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/${lng}/blog/${post.slug}`}
                                className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#D00000]/50 transition-colors"
                            >
                                {/* Cover Image */}
                                <div className="relative h-48 bg-zinc-800 overflow-hidden">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#D00000]/20 to-zinc-900" />
                                    )}
                                    {post.category && (
                                        <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-medium text-white uppercase tracking-wider">
                                            {post.category}
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <h2 className="text-xl font-bold text-white group-hover:text-[#D00000] transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    {post.excerpt && (
                                        <p className="text-zinc-400 text-sm line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            <time>
                                                {post.publishedAt
                                                    ? new Date(post.publishedAt).toLocaleDateString(lng === 'fr' ? 'fr-FR' : 'en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })
                                                    : new Date(post.created).toLocaleDateString(lng === 'fr' ? 'fr-FR' : 'en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })
                                                }
                                            </time>
                                        </div>
                                        <span className="text-[#D00000] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            {t('landing.read')}
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-24">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-zinc-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {t('landing.empty.title')}
                        </h2>
                        <p className="text-zinc-400 mb-8">
                            {t('landing.empty.subtitle')}
                        </p>
                        <Link
                            href={`/${lng}/contact`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D00000] text-white rounded-full font-medium hover:bg-[#A00000] transition-colors"
                        >
                            {t('landing.empty.cta')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

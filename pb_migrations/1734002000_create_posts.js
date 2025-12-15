/**
 * Migration: Create Posts Collection
 * 
 * Creates the posts collection for the blog feature.
 * Fields: title, slug, content (rich text), excerpt, cover_image, published
 */

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = new Collection({
        name: "posts",
        type: "base",
        system: false,
        schema: [
            {
                name: "title",
                type: "text",
                required: true,
                presentable: true,
                unique: false,
                options: {
                    min: 1,
                    max: 255,
                    pattern: ""
                }
            },
            {
                name: "slug",
                type: "text",
                required: true,
                presentable: true,
                unique: true,
                options: {
                    min: 1,
                    max: 255,
                    pattern: "^[a-z0-9-]+$"
                }
            },
            {
                name: "content",
                type: "editor",  // PocketBase editor field (HTML)
                required: false,
                presentable: false,
                unique: false,
                options: {
                    convertUrls: false
                }
            },
            {
                name: "excerpt",
                type: "text",
                required: false,
                presentable: false,
                unique: false,
                options: {
                    min: 0,
                    max: 500,
                    pattern: ""
                }
            },
            {
                name: "cover_image",
                type: "file",
                required: false,
                presentable: false,
                unique: false,
                options: {
                    maxSelect: 1,
                    maxSize: 5242880, // 5MB
                    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
                    thumbs: ["480x320", "1280x720"],
                    protected: false
                }
            },
            {
                name: "published",
                type: "bool",
                required: false,
                presentable: false,
                unique: false,
                options: {}
            }
        ],
        indexes: [],
        listRule: "", // Public can list
        viewRule: "", // Public can view
        createRule: null, // Admin only
        updateRule: null, // Admin only
        deleteRule: null, // Admin only
        options: {}
    });

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("posts");
    if (collection) {
        app.delete(collection);
    }
})

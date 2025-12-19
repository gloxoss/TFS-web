/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Create Services Collection
 * 
 * Stores the 10 service items for the homepage grid.
 * Supports two types:
 * - internal_link: Links to existing pages (e.g., /equipment)
 * - content_page: Links to a dedicated service detail page
 */

migrate((app) => {
    const collection = new Collection({
        name: "services",
        type: "base",
        fields: [
            {
                name: "title",
                type: "text",
                required: true,
            },
            {
                name: "title_fr",
                type: "text",
                required: false,
            },
            {
                name: "slug",
                type: "text",
                required: true,
            },
            {
                name: "icon",
                type: "file",
                maxSelect: 1,
                maxSize: 5242880, // 5MB
                mimeTypes: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
            },
            {
                name: "brief_description",
                type: "text",
                required: false,
            },
            {
                name: "brief_description_fr",
                type: "text",
                required: false,
            },
            {
                name: "full_description",
                type: "editor",
                required: false,
            },
            {
                name: "full_description_fr",
                type: "editor",
                required: false,
            },
            {
                name: "type",
                type: "select",
                required: true,
                values: ["internal_link", "content_page"],
            },
            {
                name: "target_url",
                type: "text",
                required: false, // Only needed for internal_link type
            },
            {
                name: "images",
                type: "file",
                maxSelect: 10,
                maxSize: 10485760, // 10MB
                mimeTypes: ["image/png", "image/jpeg", "image/webp"],
            },
            {
                name: "display_order",
                type: "number",
                required: false,
            },
            {
                name: "is_active",
                type: "bool",
                required: false,
            },
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_services_slug ON services (slug)",
        ],
        listRule: "",      // Public read
        viewRule: "",      // Public read
        createRule: null,  // Admin only
        updateRule: null,  // Admin only
        deleteRule: null,  // Admin only
    });

    app.save(collection);
    console.log('[Migration] Created services collection');

}, (app) => {
    const collection = app.findCollectionByNameOrId("services");
    if (collection) {
        app.delete(collection);
        console.log('[Migration] Deleted services collection');
    }
});

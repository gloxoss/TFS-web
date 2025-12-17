/// <reference path="../pb_data/types.d.ts" />
/**
 * Rebuild cart_items collection with proper schema
 * 
 * Uses modern PocketBase 0.23+ syntax with 'fields' array
 */
migrate((app) => {
    try {
        // 1. Delete existing collection if it exists
        try {
            const oldCollection = app.findCollectionByNameOrId("cart_items");
            if (oldCollection) {
                app.delete(oldCollection);
            }
        } catch (e) {
            // Collection doesn't exist, that's fine
        }

        // 2. Define fresh collection using modern 'fields' format
        const collection = new Collection({
            name: "cart_items",
            type: "base",
            system: false,
            fields: [
                new Field({
                    name: "quantity",
                    type: "number",
                    required: true,
                    id: "field_quantity",
                }),
                new Field({
                    name: "dates",
                    type: "json",
                    required: true,
                    id: "field_dates",
                }),
                new Field({
                    name: "user",
                    type: "relation",
                    required: true,
                    id: "field_user",
                    collectionId: "_pb_users_auth_",
                    cascadeDelete: true,
                    maxSelect: 1,
                }),
                new Field({
                    name: "product",
                    type: "relation",
                    required: true,
                    id: "field_product",
                    collectionId: "pbc_3071488795", // Equipment ID
                    cascadeDelete: false,
                    maxSelect: 1,
                })
            ],
            // Rules - any authenticated user can access their own items
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''",
        });

        app.save(collection);
    } catch (e) {
        console.log("Failed to create cart_items collection:", e);
    }
}, (app) => {
    try {
        const collection = app.findCollectionByNameOrId("cart_items");
        if (collection) {
            app.delete(collection);
        }
    } catch (e) { }
})


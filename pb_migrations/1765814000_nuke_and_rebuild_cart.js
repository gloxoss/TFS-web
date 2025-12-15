/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // 1. Delete existing collection if it exists
    const oldCollection = app.findCollectionByNameOrId("cart_items");
    if (oldCollection) {
        app.delete(oldCollection);
    }

    // 2. Define fresh collection
    const collection = new Collection({
        name: "cart_items",
        type: "base",
        system: false,
        schema: [
            {
                name: "quantity",
                type: "number",
                required: true,
                present: false,
            },
            {
                name: "dates",
                type: "json",
                required: true,
                present: false,
            },
            {
                name: "user",
                type: "relation",
                required: true,
                collectionId: "_pb_users_auth_",
                cascadeDelete: true,
                maxSelect: 1,
            },
            {
                name: "product",
                type: "relation",
                required: true,
                collectionId: "pbc_3071488795", // Equipment ID
                cascadeDelete: false,
                maxSelect: 1,
            }
        ],
        // Rules
        listRule: "user = @request.auth.id",
        viewRule: "user = @request.auth.id",
        createRule: "user = @request.auth.id",
        updateRule: "user = @request.auth.id",
        deleteRule: "user = @request.auth.id",
    });

    app.save(collection);
}, (app) => {
    // Revert usually deletes it? Or tries to restore?
    // Since we nuked it, revert is hard.
    const collection = app.findCollectionByNameOrId("cart_items");
    if (collection) {
        app.delete(collection);
    }
})

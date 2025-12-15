/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("cart_items");

    // Allow users to manage their own cart items
    const rule = "user = @request.auth.id";

    collection.listRule = rule;
    collection.viewRule = rule;
    collection.createRule = rule; // Logic: User creates item, must assign 'user' to themselves.
    collection.updateRule = rule;
    collection.deleteRule = rule;

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("cart_items");

    // Revert to admin-only
    collection.listRule = null;
    collection.viewRule = null;
    collection.createRule = null;
    collection.updateRule = null;
    collection.deleteRule = null;

    app.save(collection);
})

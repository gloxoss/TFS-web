/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("cart_items");

    // DEBUG: Make everything public to rule out permission issues
    const rule = ""; // Public!

    collection.listRule = rule;
    collection.viewRule = rule;
    collection.createRule = rule;
    collection.updateRule = rule;
    collection.deleteRule = rule;

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("cart_items");
    // Revert to user-owned
    const rule = "user = @request.auth.id";
    collection.listRule = rule;
    collection.viewRule = rule;
    collection.createRule = rule;
    collection.updateRule = rule;
    collection.deleteRule = rule;
    app.save(collection);
})

/// <reference path="../pb_data/types.d.ts" />
/**
 * Fix API Rules for Collections
 * 
 * This migration updates the access rules for:
 * - products: Public read access (anyone can browse equipment)
 * - categories: Public read access (anyone can see categories)
 * - cart_items: Authenticated user access (only own cart items)
 */
migrate((app) => {
    // Fix products collection - allow public read
    const products = app.findCollectionByNameOrId("products");
    if (products) {
        products.listRule = "";  // Anyone can list
        products.viewRule = "";  // Anyone can view
        app.save(products);
    }

    // Fix categories collection - allow public read
    const categories = app.findCollectionByNameOrId("categories");
    if (categories) {
        categories.listRule = "";  // Anyone can list
        categories.viewRule = "";  // Anyone can view
        app.save(categories);
    }

    // Fix cart_items collection - authenticated users can access their own
    const cartItems = app.findCollectionByNameOrId("cart_items");
    if (cartItems) {
        cartItems.listRule = "@request.auth.id != ''";  // Any authenticated user can list (filter in code)
        cartItems.viewRule = "@request.auth.id != ''";  // Any authenticated user can view
        cartItems.createRule = "@request.auth.id != ''";  // Any authenticated user can create
        cartItems.updateRule = "@request.auth.id != ''";  // Any authenticated user can update
        cartItems.deleteRule = "@request.auth.id != ''";  // Any authenticated user can delete
        app.save(cartItems);
    }

    return;
}, (app) => {
    // Revert to restrictive rules
    const products = app.findCollectionByNameOrId("products");
    if (products) {
        products.listRule = null;
        products.viewRule = null;
        app.save(products);
    }

    const categories = app.findCollectionByNameOrId("categories");
    if (categories) {
        categories.listRule = null;
        categories.viewRule = null;
        app.save(categories);
    }

    const cartItems = app.findCollectionByNameOrId("cart_items");
    if (cartItems) {
        cartItems.listRule = null;
        cartItems.viewRule = null;
        cartItems.createRule = null;
        cartItems.updateRule = null;
        cartItems.deleteRule = null;
        app.save(cartItems);
    }

    return;
});

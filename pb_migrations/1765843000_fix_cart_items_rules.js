/// <reference path="../pb_data/types.d.ts" />
/**
 * Fix cart_items API Rules
 * 
 * Ensures cart_items collection has proper API rules for authenticated users
 */
migrate((app) => {
    try {
        const cartItems = app.findCollectionByNameOrId("cart_items");
        if (cartItems) {
            // Any authenticated user can access their own items
            // Filtering by user is done in application code
            cartItems.listRule = "@request.auth.id != ''";
            cartItems.viewRule = "@request.auth.id != ''";
            cartItems.createRule = "@request.auth.id != ''";
            cartItems.updateRule = "@request.auth.id != ''";
            cartItems.deleteRule = "@request.auth.id != ''";

            app.save(cartItems);
            console.log("Fixed cart_items API rules for authenticated users");
        } else {
            console.log("cart_items collection not found");
        }
    } catch (e) {
        console.log("Error fixing cart_items:", e);
    }

    return;
}, (app) => {
    // Rollback - make restrictive
    try {
        const cartItems = app.findCollectionByNameOrId("cart_items");
        if (cartItems) {
            cartItems.listRule = null;
            cartItems.viewRule = null;
            cartItems.createRule = null;
            cartItems.updateRule = null;
            cartItems.deleteRule = null;
            app.save(cartItems);
        }
    } catch (e) { }

    return;
});

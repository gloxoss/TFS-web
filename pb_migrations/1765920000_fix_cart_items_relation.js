/// <reference path="../pb_data/types.d.ts" />
/**
 * Fix cart_items product relation
 * 
 * The original migration used a hardcoded collection ID for the product relation.
 * This migration fixes it by dynamically finding the equipment collection.
 */
migrate((app) => {
    try {
        // Find the cart_items collection
        const cartItems = app.findCollectionByNameOrId("cart_items");
        if (!cartItems) {
            console.log("[FIX] cart_items collection not found, skipping...");
            return;
        }

        // Find the equipment collection
        const equipment = app.findCollectionByNameOrId("equipment");
        if (!equipment) {
            console.log("[FIX] equipment collection not found, skipping...");
            return;
        }

        console.log("[FIX] Found equipment collection ID:", equipment.id);

        // Find and update the product field
        const productField = cartItems.fields.find(f => f.name === "product");
        if (productField && productField.type === "relation") {
            // Update the collectionId to the actual equipment collection ID
            productField.collectionId = equipment.id;
            app.save(cartItems);
            console.log("[FIX] Updated cart_items.product relation to point to:", equipment.id);
        } else {
            console.log("[FIX] Product field not found or is not a relation");
        }
    } catch (e) {
        console.log("[FIX] Error fixing cart_items relation:", e);
    }
}, (app) => {
    // No rollback needed - this is a fix
});

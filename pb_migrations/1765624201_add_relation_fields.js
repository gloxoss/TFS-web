/// <reference path="../pb_data/types.d.ts" />
/**
 * Add Missing Relation Fields
 * 
 * This migration adds:
 * - category relation to products collection
 * - user relation to cart_items collection  
 * - product relation to cart_items collection
 */
migrate((app) => {
    // Add category relation to products
    const products = app.findCollectionByNameOrId("products");
    if (products) {
        // Check if category field already exists
        const existingField = products.fields.find(f => f.name === "category");
        if (!existingField) {
            const categoryField = new Field({
                type: "relation",
                name: "category",
                id: "relation_category",
                required: false,
                presentable: false,
                system: false,
                hidden: false,
                collectionId: "pbc_3292755704",
                cascadeDelete: false,
                minSelect: 0,
                maxSelect: 1
            });
            products.fields.add(categoryField);
            app.save(products);
        }
    }

    // Add user and product relations to cart_items
    const cartItems = app.findCollectionByNameOrId("cart_items");
    if (cartItems) {
        // Add user relation if not exists
        const existingUserField = cartItems.fields.find(f => f.name === "user");
        if (!existingUserField) {
            const userField = new Field({
                type: "relation",
                name: "user",
                id: "relation_user",
                required: true,
                presentable: false,
                system: false,
                hidden: false,
                collectionId: "_pb_users_auth_",
                cascadeDelete: true,
                minSelect: 1,
                maxSelect: 1
            });
            cartItems.fields.add(userField);
        }

        // Add product relation if not exists
        const existingProductField = cartItems.fields.find(f => f.name === "product");
        if (!existingProductField) {
            const productField = new Field({
                type: "relation",
                name: "product",
                id: "relation_product",
                required: true,
                presentable: false,
                system: false,
                hidden: false,
                collectionId: "pbc_4092854851",
                cascadeDelete: false,
                minSelect: 1,
                maxSelect: 1
            });
            cartItems.fields.add(productField);
        }

        app.save(cartItems);
    }

    return;
}, (app) => {
    // Revert - remove added fields
    const products = app.findCollectionByNameOrId("products");
    if (products) {
        const categoryField = products.fields.find(f => f.name === "category");
        if (categoryField) {
            products.fields.removeById(categoryField.id);
            app.save(products);
        }
    }

    const cartItems = app.findCollectionByNameOrId("cart_items");
    if (cartItems) {
        const userField = cartItems.fields.find(f => f.name === "user");
        if (userField) {
            cartItems.fields.removeById(userField.id);
        }
        const productField = cartItems.fields.find(f => f.name === "product");
        if (productField) {
            cartItems.fields.removeById(productField.id);
        }
        app.save(cartItems);
    }

    return;
});

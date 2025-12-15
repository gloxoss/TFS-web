/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("cart_items");

    // Nuke the potential broken field
    const oldField = collection.fields.findByName("product");
    if (oldField) {
        collection.fields.removeByName("product");
    }

    // Re-add correctly
    const productField = new Field({
        type: "relation",
        name: "product",
        required: true,
        presentable: false,
        system: false,
        hidden: false,
        collectionId: "pbc_3071488795", // Equipment ID
        cascadeDelete: false,
        minSelect: 1,
        maxSelect: 1,
        id: "relation_product_fixed" // force new ID
    });

    collection.fields.add(productField);

    // Ensure rules are open (reinforce previous fix)
    const rule = "user = @request.auth.id";
    collection.listRule = rule;
    collection.viewRule = rule;
    collection.createRule = rule;
    collection.updateRule = rule;
    collection.deleteRule = rule;

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("cart_items");
    collection.fields.removeByName("product");
    app.save(collection);
})

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // 1. Make Equipment Public - MAX PERMISSIVE
    const equipment = app.findCollectionByNameOrId("equipment");
    equipment.listRule = "id != ''";
    equipment.viewRule = "id != ''";
    app.save(equipment);

    // 2. Make Categories Public - MAX PERMISSIVE
    const categories = app.findCollectionByNameOrId("categories");
    categories.listRule = "id != ''";
    categories.viewRule = "id != ''";
    app.save(categories);

    // 3. Make Posts Public - MAX PERMISSIVE
    try {
        const posts = app.findCollectionByNameOrId("posts");
        posts.listRule = "id != ''";
        posts.viewRule = "id != ''";
        app.save(posts);
    } catch (e) {
        console.log("Posts collection might not exist yet");
    }

    // 4. Make Quotes Admin accessible - MAX PERMISSIVE for auth users
    const quotes = app.findCollectionByNameOrId("quotes");
    quotes.listRule = "id != ''";
    quotes.viewRule = "id != ''";
    app.save(quotes);

}, (app) => {
    // Revert skipped
})

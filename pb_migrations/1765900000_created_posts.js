/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = new Collection({
        "createRule": null,
        "deleteRule": null,
        "fields": [
            {
                "autogeneratePattern": "[a-z0-9]{15}",
                "hidden": false,
                "id": "text3208210256",
                "max": 15,
                "min": 15,
                "name": "id",
                "pattern": "^[a-z0-9]+$",
                "presentable": false,
                "primaryKey": true,
                "required": true,
                "system": true,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "text_title_en",
                "max": 0,
                "min": 0,
                "name": "title_en",
                "pattern": "",
                "presentable": true,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "text_title_fr",
                "max": 0,
                "min": 0,
                "name": "title_fr",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "text_slug",
                "max": 0,
                "min": 0,
                "name": "slug",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "text_excerpt_en",
                "max": 500,
                "min": 0,
                "name": "excerpt_en",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "text_excerpt_fr",
                "max": 500,
                "min": 0,
                "name": "excerpt_fr",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text"
            },
            {
                "convertURLs": false,
                "hidden": false,
                "id": "editor_content_en",
                "maxSize": 0,
                "name": "content_en",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "editor"
            },
            {
                "convertURLs": false,
                "hidden": false,
                "id": "editor_content_fr",
                "maxSize": 0,
                "name": "content_fr",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "editor"
            },
            {
                "hidden": false,
                "id": "file_cover_image",
                "maxSelect": 1,
                "maxSize": 5242880,
                "mimeTypes": ["image/jpeg", "image/png", "image/webp", "image/gif"],
                "name": "cover_image",
                "presentable": false,
                "protected": false,
                "required": false,
                "system": false,
                "thumbs": ["320x180", "640x360", "1280x720"],
                "type": "file"
            },
            {
                "hidden": false,
                "id": "select_category",
                "maxSelect": 1,
                "name": "category",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "select",
                "values": ["news", "tips", "industry", "behind-the-scenes"]
            },
            {
                "hidden": false,
                "id": "bool_published",
                "name": "published",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "bool"
            },
            {
                "hidden": false,
                "id": "date_published_at",
                "max": "",
                "min": "",
                "name": "published_at",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "date"
            }
        ],
        "id": "pbc_posts_collection",
        "indexes": [
            "CREATE UNIQUE INDEX idx_posts_slug ON posts (slug)"
        ],
        "listRule": "published = true",
        "name": "posts",
        "system": false,
        "type": "base",
        "updateRule": null,
        "viewRule": "published = true"
    });

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("pbc_posts_collection");

    return app.delete(collection);
})

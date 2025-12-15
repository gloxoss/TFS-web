/// <reference path="../pb_data/types.d.ts" />
/**
 * Add Role Field to Users Collection
 * 
 * Adds a 'role' select field to identify admin users.
 * Values: 'user' (default), 'admin', 'superadmin'
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");

    // Add role field
    collection.fields.addAt(11, new Field({
        "hidden": false,
        "id": "select_role",
        "maxSelect": 1,
        "name": "role",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": ["user", "admin", "superadmin"]
    }));

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");

    // Remove role field
    collection.fields.removeById("select_role");

    return app.save(collection);
});

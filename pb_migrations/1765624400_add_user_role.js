/// <reference path="../pb_data/types.d.ts" />
/**
 * Add Role Field to Users Collection
 * 
 * Adds a 'role' select field to identify admin users.
 * Values: 'user' (default), 'admin', 'superadmin'
 */
migrate((app) => {
    try {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");
        if (collection) {
            // Check if role field already exists
            const existingField = collection.fields.find(f => f.name === "role");
            if (!existingField) {
                collection.fields.add(new Field({
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
                app.save(collection);
            }
        }
    } catch (e) {
        console.log("Users collection not found, skipping...");
    }

    return;
}, (app) => {
    try {
        const collection = app.findCollectionByNameOrId("_pb_users_auth_");
        if (collection) {
            const roleField = collection.fields.find(f => f.name === "role");
            if (roleField) {
                collection.fields.removeById(roleField.id);
                app.save(collection);
            }
        }
    } catch (e) { }

    return;
});


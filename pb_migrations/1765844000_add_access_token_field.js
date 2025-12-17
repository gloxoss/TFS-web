/// <reference path="../pb_data/types.d.ts" />
/**
 * Add access_token field to quotes collection
 * 
 * This field is required for magic link functionality - stores the secret token
 * that clients use to access their quote securely without authentication.
 */
migrate((app) => {
    try {
        const quotes = app.findCollectionByNameOrId("quotes");
        if (quotes) {
            // Check if access_token field already exists
            const existingField = quotes.fields.find(f => f.name === "access_token");
            if (!existingField) {
                quotes.fields.add(new Field({
                    "hidden": false,
                    "id": "text_access_token",
                    "max": 0,
                    "min": 0,
                    "name": "access_token",
                    "pattern": "",
                    "presentable": false,
                    "primaryKey": false,
                    "required": false,
                    "system": false,
                    "type": "text"
                }));
                app.save(quotes);
                console.log("Added access_token field to quotes collection");
            } else {
                console.log("access_token field already exists");
            }
        }
    } catch (e) {
        console.log("Error adding access_token field:", e);
    }

    return;
}, (app) => {
    try {
        const quotes = app.findCollectionByNameOrId("quotes");
        if (quotes) {
            const field = quotes.fields.find(f => f.name === "access_token");
            if (field) {
                quotes.fields.removeById(field.id);
                app.save(quotes);
            }
        }
    } catch (e) { }

    return;
});

/// <reference path="../pb_data/types.d.ts" />
/**
 * Add quote_pdf file field to quotes collection
 * 
 * This field stores the uploaded PDF quote document that clients can download.
 */
migrate((app) => {
    try {
        const quotes = app.findCollectionByNameOrId("quotes");
        if (quotes) {
            // Check if quote_pdf field already exists
            const existingField = quotes.fields.find(f => f.name === "quote_pdf");
            if (!existingField) {
                quotes.fields.add(new Field({
                    "hidden": false,
                    "id": "file_quote_pdf",
                    "maxSelect": 1,
                    "maxSize": 52428800, // 50MB max
                    "mimeTypes": ["application/pdf"],
                    "name": "quote_pdf",
                    "presentable": false,
                    "protected": false,
                    "required": false,
                    "system": false,
                    "thumbs": [],
                    "type": "file"
                }));
                app.save(quotes);
                console.log("Added quote_pdf file field to quotes collection");
            } else {
                console.log("quote_pdf field already exists");
            }
        }
    } catch (e) {
        console.log("Error adding quote_pdf field:", e);
    }

    return;
}, (app) => {
    try {
        const quotes = app.findCollectionByNameOrId("quotes");
        if (quotes) {
            const field = quotes.fields.find(f => f.name === "quote_pdf");
            if (field) {
                quotes.fields.removeById(field.id);
                app.save(quotes);
            }
        }
    } catch (e) { }

    return;
});

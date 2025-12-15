/// <reference path="../pb_data/types.d.ts" />
/**
 * Add quoted_at Field to Quotes Collection
 * 
 * This field stores the timestamp when a quote was sent to the client.
 * Used for the 15-minute grace period editing feature.
 */
migrate((app) => {
    const quotes = app.findCollectionByNameOrId("quotes");
    if (quotes) {
        // Check if field already exists
        const existingField = quotes.fields.find(f => f.name === "quoted_at");
        if (!existingField) {
            quotes.fields.addAt(quotes.fields.length, new Field({
                "hidden": false,
                "id": "date_quoted_at",
                "max": "",
                "min": "",
                "name": "quoted_at",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "date"
            }));
            app.save(quotes);
        }
    }

    return;
}, (app) => {
    const quotes = app.findCollectionByNameOrId("quotes");
    if (quotes) {
        const field = quotes.fields.find(f => f.name === "quoted_at");
        if (field) {
            quotes.fields.removeById(field.id);
            app.save(quotes);
        }
    }

    return;
});

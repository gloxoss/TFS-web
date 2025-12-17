/// <reference path="../pb_data/types.d.ts" />
/**
 * Update Quotes Status Field Values
 * 
 * Ensures the status field has all required values:
 * - pending, reviewing, quoted, confirmed, rejected
 */
migrate((app) => {
    const quotes = app.findCollectionByNameOrId("quotes");
    if (quotes) {
        // Find the status field
        const statusField = quotes.fields.find(f => f.name === "status");
        if (statusField) {
            // Ensure all required values are present
            statusField.values = ["pending", "reviewing", "quoted", "confirmed", "rejected"];
            app.save(quotes);
            console.log("Updated quotes status field with all required values");
        }
    }

    return;
}, (app) => {
    // Rollback - restore original values (optional)
    const quotes = app.findCollectionByNameOrId("quotes");
    if (quotes) {
        const statusField = quotes.fields.find(f => f.name === "status");
        if (statusField) {
            statusField.values = ["pending", "reviewing", "quoted", "confirmed", "rejected"];
            app.save(quotes);
        }
    }

    return;
});

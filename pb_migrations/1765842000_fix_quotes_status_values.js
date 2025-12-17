/// <reference path="../pb_data/types.d.ts" />
/**
 * Fix Quotes Collection for Public Access
 * 
 * This migration:
 * 1. Allows public viewing of quotes (token verification done in app)
 * 2. Ensures 'quoted' status value exists
 * 3. Sets proper API rules for admin updates
 */
migrate((app) => {
    try {
        const quotes = app.findCollectionByNameOrId("quotes");
        if (quotes) {
            // Allow public viewing - token verification is done in app code
            quotes.viewRule = "";

            // Keep list restricted to authenticated users
            quotes.listRule = "@request.auth.id != ''";

            // Allow anyone to create (for quote requests)
            quotes.createRule = "";

            // Only admins can update
            quotes.updateRule = "@request.auth.role = 'admin' || @request.auth.role = 'superadmin'";

            // Only admins can delete
            quotes.deleteRule = "@request.auth.role = 'admin' || @request.auth.role = 'superadmin'";

            // Fix status field values
            const statusField = quotes.fields.find(f => f.name === "status");
            if (statusField) {
                statusField.values = ["pending", "reviewing", "quoted", "confirmed", "rejected"];
            }

            app.save(quotes);
            console.log("Fixed quotes collection - public view + 'quoted' status");
        }
    } catch (e) {
        console.log("Quotes collection not found:", e);
    }

    return;
}, (app) => {
    // Rollback
    try {
        const quotes = app.findCollectionByNameOrId("quotes");
        if (quotes) {
            quotes.viewRule = "@request.auth.id != ''";
            app.save(quotes);
        }
    } catch (e) { }

    return;
});

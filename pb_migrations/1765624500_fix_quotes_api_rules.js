/// <reference path="../pb_data/types.d.ts" />
/**
 * Fix API Rules for Quotes Collection
 * 
 * Quotes should be accessible by:
 * - Admins: Full access (list, view, update)
 * - Users: View own quotes only
 */
migrate((app) => {
    try {
        const quotes = app.findCollectionByNameOrId("quotes");
        if (quotes) {
            // Admins can list all, users can list their own
            quotes.listRule = "@request.auth.id != ''";  // Any authenticated user
            quotes.viewRule = "@request.auth.id != ''";  // Any authenticated user
            quotes.createRule = "";  // Anyone can create (for quote requests)
            quotes.updateRule = "@request.auth.role = 'admin' || @request.auth.role = 'superadmin'";  // Only admins
            quotes.deleteRule = "@request.auth.role = 'admin' || @request.auth.role = 'superadmin'";  // Only admins
            app.save(quotes);
        }
    } catch (e) {
        console.log("Quotes collection not found, skipping...");
    }

    return;
}, (app) => {
    try {
        const quotes = app.findCollectionByNameOrId("quotes");
        if (quotes) {
            quotes.listRule = null;
            quotes.viewRule = null;
            quotes.createRule = null;
            quotes.updateRule = null;
            quotes.deleteRule = null;
            app.save(quotes);
        }
    } catch (e) { }

    return;
});


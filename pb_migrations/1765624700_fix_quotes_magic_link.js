/// <reference path="../pb_data/types.d.ts" />
/**
 * Fix Quotes viewRule for Magic Links
 * 
 * Magic links (public quote view) need unauthenticated access.
 * Security is handled by access_token verification in code.
 * 
 * Changes:
 * - viewRule: "" (public) - access_token checked in code
 * - listRule: "@request.auth.id != ''" (authenticated only - for dashboard)
 */
migrate((app) => {
    const quotes = app.findCollectionByNameOrId("quotes");
    if (quotes) {
        // viewRule must be public for magic links to work
        // Security: access_token is verified in code before showing data
        quotes.viewRule = "";  // Public - magic links need this
        quotes.listRule = "@request.auth.id != ''";  // Authenticated for listings
        app.save(quotes);
        console.log("[Migration] Quotes viewRule set to public for magic links");
    }

    return;
}, (app) => {
    const quotes = app.findCollectionByNameOrId("quotes");
    if (quotes) {
        quotes.viewRule = "@request.auth.id != ''";
        app.save(quotes);
    }

    return;
});

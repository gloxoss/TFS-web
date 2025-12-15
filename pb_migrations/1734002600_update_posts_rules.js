/**
 * Migration: Update Posts Collection Rules
 * 
 * Allows users with role='admin' to create, update, and delete posts.
 */

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("posts");

    // Allow admins to manage posts
    collection.createRule = "@request.auth.role = 'admin'"
    collection.updateRule = "@request.auth.role = 'admin'"
    collection.deleteRule = "@request.auth.role = 'admin'"

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("posts");

    // Revert to superuser only
    collection.createRule = null
    collection.updateRule = null
    collection.deleteRule = null

    app.save(collection);
})

/**
 * Migration: Add Digital Signature Fields
 * 
 * Adds signature and signed_at fields to the quotes collection
 * for the digital signature feature.
 */

/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("quotes")
    if (!collection) {
        console.log("quotes collection not found, skipping migration")
        return
    }

    // Add signature file field
    collection.fields.add(new Field({
        name: "signature",
        type: "file",
        required: false,
        options: {
            maxSelect: 1,
            maxSize: 5242880, // 5MB
            mimeTypes: ["image/png"],
            thumbs: [],
        },
    }))

    // Add signed_at date field
    collection.fields.add(new Field({
        name: "signed_at",
        type: "date",
        required: false,
        options: {},
    }))

    app.save(collection)
    console.log("Added signature and signed_at fields to quotes collection")
}, (app) => {
    // Revert migration
    const collection = app.findCollectionByNameOrId("quotes")
    if (!collection) return

    const signatureField = collection.fields.find(f => f.name === "signature")
    if (signatureField) {
        collection.fields.remove(signatureField)
    }

    const signedAtField = collection.fields.find(f => f.name === "signed_at")
    if (signedAtField) {
        collection.fields.remove(signedAtField)
    }

    app.save(collection)
})

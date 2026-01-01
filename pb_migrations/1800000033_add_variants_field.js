/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Add 'variants' field to Equipment collection
 * 
 * NOTE: PocketBase v0.23+ requires adding fields via Admin UI.
 * This migration is a placeholder - the field should be added manually.
 * 
 * Steps:
 * 1. Go to Admin UI → Collections → Equipment
 * 2. Click "Edit Collection" (gear icon)
 * 3. Click "+ New Field"w
 * 4. Field Type: Relation
 * 5. Field Name: variants
 * 6. Collection: equipment (self-relation)
 * 7. Max Select: leave empty (unlimited)
 * 8. Save
 */

migrate((app) => {
    console.log("📝 NOTE: 'variants' field must be added via Admin UI")
    console.log("   Go to: Admin → Collections → Equipment → Edit → New Field → Relation")
    console.log("   Field name: 'variants', Collection: 'equipment', Max: unlimited")

    // Check if field already exists
    const collection = app.findCollectionByNameOrId("equipment")
    if (!collection) {
        console.log("⚠️ Equipment collection not found")
        return
    }

    const existingField = collection.fields.find(f => f.name === "variants")
    if (existingField) {
        console.log("✅ 'variants' field already exists!")
    } else {
        console.log("⚠️ 'variants' field NOT found - please add it via Admin UI")
    }

}, (app) => {
    console.log("⬇️ Rollback: No action needed (field added via Admin UI)")
})

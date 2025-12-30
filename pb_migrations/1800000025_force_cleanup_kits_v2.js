/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    console.log("[Aggressive Cleanup] Starting force cleanup of kit recommendations...");

    // Try to find collection by Name first, then ID
    let collection;
    try {
        collection = app.findCollectionByNameOrId("kit_slots");
    } catch (e) {
        console.log("[Aggressive Cleanup] Could not find 'kit_slots' by name. Trying ID 'pbc_kitslots000001'...");
        try {
            collection = app.findCollectionByNameOrId("pbc_kitslots000001");
        } catch (e2) {
            console.log("[Aggressive Cleanup] FATAL: Could not find kit_slots collection!");
            return;
        }
    }

    if (!collection) {
        console.log("[Aggressive Cleanup] No collection found.");
        return;
    }

    console.log(`[Aggressive Cleanup] Found collection: ${collection.name} (${collection.id})`);

    // Fetch ALL records in this collection
    const records = app.findRecordsByFilter(collection.id, "", "", 500, 0);
    console.log(`[Aggressive Cleanup] Found ${records.length} records to inspect.`);

    let validUpdates = 0;
    records.forEach((record) => {
        const currentRecs = record.getStringSlice("recommended_ids");
        if (currentRecs.length > 0) {
            console.log(`[Aggressive Cleanup] Clearing ${currentRecs.length} items from slot '${record.getString("slot_name")}' (${record.id})`);

            // Clear it
            record.set("recommended_ids", []);

            // Also try to clear the old 'recommended_slugs' if it exists as a field (unlikely but safe)
            try {
                record.set("recommended_slugs", []);
            } catch (e) { /* ignore */ }

            app.save(record);
            validUpdates++;
        }
    });

    console.log(`[Aggressive Cleanup] Completed. Updated ${validUpdates} records.`);

}, (app) => {
    console.log("[Aggressive Cleanup] Rollback skipped.");
});

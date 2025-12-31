/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    console.log("[Migration V3] Removing image_url from equipment specs (Force Update)...");

    const collection = app.findCollectionByNameOrId("equipment");
    const records = app.findRecordsByFilter(collection.id, "1=1", "", 1000, 0);

    let updatedCount = 0;

    records.forEach(record => {
        let changed = false;

        ["specs", "specs_en", "specs_fr"].forEach(field => {
            try {
                // Get the raw value
                const rawVal = record.get(field);

                // Ensure we work with an object
                if (rawVal && typeof rawVal === 'object' && !Array.isArray(rawVal)) {

                    // Create a shallow copy to break reference equality
                    // This ensures PocketBase detects the change
                    const newVal = JSON.parse(JSON.stringify(rawVal));

                    if (newVal["image_url"] !== undefined) {
                        delete newVal["image_url"];

                        // Set the NEW object
                        record.set(field, newVal);
                        changed = true;
                    }
                }
            } catch (e) {
                console.log(`[Warning] Error processing field ${field} for record ${record.id}: ${e}`);
            }
        });

        if (changed) {
            app.save(record);
            updatedCount++;
        }
    });

    console.log(`[Migration V3] Completed. Updated ${updatedCount} records.`);

}, (app) => {
    console.log("[Migration V3] Rollback skipped.");
});

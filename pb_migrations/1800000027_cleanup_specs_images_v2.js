/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    console.log("[Migration V2] Removing image_url from equipment specs with debug...");

    const collection = app.findCollectionByNameOrId("equipment");
    // Find ALL records
    const records = app.findRecordsByFilter(collection.id, "1=1", "", 1000, 0);
    console.log(`[Migration V2] Found ${records.length} total equipment records.`);

    let updatedCount = 0;

    records.forEach(record => {
        let changed = false;

        ["specs", "specs_en", "specs_fr"].forEach(field => {
            try {
                // record.get() usually returns the value as is. 
                // For JSON, it should be a map/object in JS realm.
                let val = record.get(field);
                let wasString = false;

                // If it's a string, try to parse it (sometimes PB returns JSON string)
                if (typeof val === 'string' && val.trim().startsWith('{')) {
                    try {
                        val = JSON.parse(val);
                        wasString = true;
                    } catch (e) { }
                }

                // Ensure it's an object
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                    if (val["image_url"] !== undefined) {
                        delete val["image_url"];

                        // If it was a string initially, we might need to stringify it back?
                        // PB record.set handles both usually, but let's stick to object if possible.
                        // However, if we modified the object reference, we often need to set it back to trigger change?
                        // Or explicit set.
                        record.set(field, val);
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
            console.log(`[Migration V2] Cleaned record: ${record.getString('name')}`);
        }
    });

    console.log(`[Migration V2] Completed. Updated ${updatedCount} records.`);

}, (app) => {
    console.log("[Migration V2] Rollback skipped.");
});

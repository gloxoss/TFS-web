/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    console.log("[Migration V4] DEBUG Cleanup Mode...");

    const collection = app.findCollectionByNameOrId("equipment");
    // Just get one record to debug deeply
    const records = app.findRecordsByFilter(collection.id, "slug != ''", "", 1, 0);

    if (records.length === 0) {
        console.log("[Migration V4] No records found.");
        return;
    }

    const record = records[0];
    console.log(`[Migration V4] analyzing record: ${record.id} (${record.getString("name")})`);

    const field = "specs";
    const val = record.get(field);

    console.log(`[Migration V4] Type of specs: ${typeof val}`);
    console.log(`[Migration V4] JSON stringify: ${JSON.stringify(val)}`);

    if (val && typeof val === 'object') {
        const hasKey = val["image_url"] !== undefined;
        console.log(`[Migration V4] Has image_url direct access: ${hasKey}`);

        if (hasKey) {
            console.log("[Migration V4] Attempting removal...");

            // Deep clone
            const newVal = JSON.parse(JSON.stringify(val));
            delete newVal["image_url"];

            console.log(`[Migration V4] New val after delete: ${JSON.stringify(newVal)}`);

            record.set(field, newVal);
            console.log("[Migration V4] Set called.");

            app.save(record);
            console.log("[Migration V4] Save called.");
        } else {
            console.log("[Migration V4] No image_url found to delete.");
        }
    }

}, (app) => {
    // Rollback
});

/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    console.log("[Debug Migration] Inspecting equipment specs...");

    try {
        const collection = app.findCollectionByNameOrId("equipment");
        const records = app.findRecordsByFilter(collection.id, "slug != ''", "", 1, 0); // Get any record
        const record = records[0];

        if (record) {
            console.log(`[Debug] Record found: ${record.getString('name')} (${record.id})`);

            const specs = record.get("specs");
            console.log(`[Debug] Raw specs type: ${typeof specs}`);
            if (specs) {
                console.log(`[Debug] Specs keys: ${Object.keys(specs).join(", ")}`);
                console.log(`[Debug] Has image_url? ${specs["image_url"] !== undefined}`);
                console.log(`[Debug] Full specs: ${JSON.stringify(specs)}`);
            } else {
                console.log("[Debug] Specs is null/undefined");
            }
        } else {
            console.log("[Debug] No equipment records found!");
        }
    } catch (e) {
        console.log(`[Debug] Error: ${e}`);
    }

}, (app) => {
    // Rollback
});

/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const ID_KIT_SLOTS = "pbc_kitslots000001";

    try {
        const slots = app.findRecordsByFilter(ID_KIT_SLOTS, "slot_name != ''", "", 100, 0);

        slots.forEach((record) => {
            // Clear the recommended_ids array
            record.set("recommended_ids", []);
            app.save(record);
        });

        console.log(`[Validation] Cleared recommendations for ${slots.length} kit slots.`);
    } catch (e) {
        console.log("[Validation] No kit slots found or error updating.", e);
    }

}, (app) => {
    // Rollback not really possible/needed as we don't know what was there before exactly
    // without a backup. This is a destructive cleanup action requested by user.
    console.log("[Validation] Rollback skipped for recommendation cleanup.");
});

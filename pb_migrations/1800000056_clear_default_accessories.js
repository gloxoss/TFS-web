/// <reference path="../pb_data/types.d.ts" />
/**
 * Clear Default Accessories from Kit Slots
 * 
 * Removes all pre-selected default accessories from kit slots
 * so users start with empty selections.
 */
migrate((app) => {
    const ID_KIT_SLOTS = "pbc_kit_slots0001";

    console.log("=".repeat(60));
    console.log("[CLEANUP] Removing default accessories from kit slots...");
    console.log("=".repeat(60));

    try {
        const allSlots = app.findRecordsByFilter(ID_KIT_SLOTS, "id != ''", "", 500, 0);
        console.log(`[Found] ${allSlots.length} kit slots`);

        let clearedCount = 0;
        allSlots.forEach(slot => {
            const name = slot.get("name") || slot.get("name_en") || "";
            const currentDefaults = slot.get("default_accessories");

            // Clear if has defaults
            if (currentDefaults && (Array.isArray(currentDefaults) ? currentDefaults.length > 0 : true)) {
                slot.set("default_accessories", []);
                app.save(slot);
                console.log(`[Cleared] ${name}`);
                clearedCount++;
            }
        });

        console.log("=".repeat(60));
        console.log(`[Complete] Cleared defaults from ${clearedCount} kit slots`);
        console.log("=".repeat(60));

    } catch (e) {
        console.log("[Error]", e);
    }

}, (app) => {
    console.log("[Rollback] Manual restore required");
});

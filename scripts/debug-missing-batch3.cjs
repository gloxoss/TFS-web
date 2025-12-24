const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

const BATCH3_SLUGS = [
    "cooke-s8-i-ff-prime-set",
    "zeiss-supreme-prime-radiance-set",
    "angenieux-optimo-45-120mm-t2-8",
    "canon-cine-servo-15-120mm-t2-95-3-9"
];

async function debug() {
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        console.log("Checking Batch 3 Items:");
        for (const slug of BATCH3_SLUGS) {
            try {
                await pb.collection('equipment').getFirstListItem(`slug="${slug}"`);
                console.log(`[OK] ${slug}`);
            } catch (e) {
                console.log(`[MISSING] ${slug}`);
            }
        }

        console.log("\nChecking UI Config Collection:");
        try {
            const cols = await pb.collections.getFullList();
            const configCol = cols.find(c => c.name === "ui_configurations");

            if (configCol) {
                console.log("[OK] Collection 'ui_configurations' exists.");
                try {
                    await pb.collection('ui_configurations').getFirstListItem('key="equipment_filters"');
                    console.log("[OK] Record 'equipment_filters' exists.");
                } catch (e) {
                    console.log("[MISSING] Record 'equipment_filters'. Attempting create...");
                    const UI_CONFIG = {
                        "filters_configuration": {
                            "brand_filter": { "label": "Filter by Brand", "type": "multiselect", "source": "taxonomies.brands", "allow_multiple": true },
                            "category_filter": { "label": "Filter by Category", "type": "select", "source": "taxonomies.categories", "allow_multiple": false },
                            "tag_filter": { "label": "Features", "type": "tags", "source": "tags", "options": ["Anamorphic", "Spherical", "Large Format", "Full Frame", "Super 35", "Zoom", "Macro", "OLED", "Recorder", "Wireless"] },
                            "mount_filter": { "label": "Lens Mount", "type": "checkbox", "options": ["PL", "LPL", "EF", "E-Mount"] },
                            "resolution_filter": { "label": "Max Resolution", "type": "range", "field": "specifications.max_resolution" }
                        }
                    };
                    try {
                        await pb.collection('ui_configurations').create({ key: "equipment_filters", value: UI_CONFIG.filters_configuration });
                        console.log("   -> Created record.");
                    } catch (e2) { console.log("   -> Failed to create record: " + e2.message); }
                }
            } else {
                console.log("[MISSING] Collection 'ui_configurations'. Attempting create...");
                try {
                    await pb.collections.create({
                        name: "ui_configurations",
                        type: "base",
                        schema: [
                            { name: "key", type: "text", required: true, options: { pattern: "^\\w+$" } },
                            { name: "value", type: "json" }
                        ],
                        indexes: ["CREATE UNIQUE INDEX idx_config_key ON ui_configurations (key)"]
                    });
                    console.log("   -> Created Collection.");

                    const UI_CONFIG = {
                        "filters_configuration": {
                            "brand_filter": { "label": "Filter by Brand", "type": "multiselect", "source": "taxonomies.brands", "allow_multiple": true },
                            "category_filter": { "label": "Filter by Category", "type": "select", "source": "taxonomies.categories", "allow_multiple": false },
                            "tag_filter": { "label": "Features", "type": "tags", "source": "tags", "options": ["Anamorphic", "Spherical", "Large Format", "Full Frame", "Super 35", "Zoom", "Macro", "OLED", "Recorder", "Wireless"] },
                            "mount_filter": { "label": "Lens Mount", "type": "checkbox", "options": ["PL", "LPL", "EF", "E-Mount"] },
                            "resolution_filter": { "label": "Max Resolution", "type": "range", "field": "specifications.max_resolution" }
                        }
                    };

                    await pb.collection('ui_configurations').create({ key: "equipment_filters", value: UI_CONFIG.filters_configuration });
                    console.log("   -> Created Record.");

                } catch (e2) { console.log("   -> Failed to create collection: " + e2.message); }
            }
        } catch (e) {
            console.log(e.message);
        }

    } catch (e) {
        console.error(e.message);
    }
}

debug();

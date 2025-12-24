/**
 * Fix Kit Mappings
 * 
 * Deletes all kit data and recreates with CORRECT product IDs based on
 * equipment names matching kit names.
 */
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

const CAMERA_PATTERNS = ['alexa', 'venice', 'fx6', 'fx9', 'fx3', 'komodo', 'v-raptor', 'raptor', 'amira', 'burano', 'c70', 'c300', 'c500', 'bmpcc', 'ursa', 'varicam', 'eva1'];

const DEFAULT_SLOTS = [
    { slotName: "Lens Set", searchTerms: ["Signature Prime", "Supreme Prime", "Cooke", "Zeiss"] },
    { slotName: "Wireless Video", searchTerms: ["Teradek", "Bolt"] },
    { slotName: "Monitor", searchTerms: ["SmallHD", "Atomos"] },
    { slotName: "Tripod/Support", searchTerms: ["Sachtler", "OConnor", "Cartoni"] }
];

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        // Get all equipment
        const allEquipment = await pb.collection('equipment').getFullList();
        console.log(`Found ${allEquipment.length} equipment items`);

        // Find actual cameras
        const cameras = allEquipment.filter(eq => {
            const name = (eq.name_en || eq.name || '').toLowerCase();
            return CAMERA_PATTERNS.some(p => name.includes(p)) &&
                !name.includes('lens') &&
                !name.includes('monitor') &&
                !name.includes('recorder');
        });

        console.log(`\nFound ${cameras.length} cameras:`);
        cameras.forEach(c => console.log(`  ${c.id} - ${c.name_en || c.name}`));

        // Helper to find equipment
        const findEquipment = (searchTerms) => {
            const results = [];
            for (const term of searchTerms) {
                const found = allEquipment.filter(eq =>
                    (eq.name_en || eq.name || '').toLowerCase().includes(term.toLowerCase())
                );
                for (const f of found) {
                    if (!results.find(r => r.id === f.id) && !cameras.find(c => c.id === f.id)) {
                        results.push(f);
                    }
                }
            }
            return results.slice(0, 4);
        };

        // Delete ALL existing kit data
        console.log("\nDeleting existing kit data...");
        const existingItems = await pb.collection('kit_items').getFullList();
        for (const item of existingItems) {
            await pb.collection('kit_items').delete(item.id);
        }
        console.log(`  Deleted ${existingItems.length} items`);

        const existingTemplates = await pb.collection('kit_templates').getFullList();
        for (const t of existingTemplates) {
            await pb.collection('kit_templates').delete(t.id);
        }
        console.log(`  Deleted ${existingTemplates.length} templates`);

        // Create kits for each camera
        console.log("\n=== Creating Kits ===\n");
        let templatesCreated = 0;
        let itemsCreated = 0;

        for (const camera of cameras) {
            const cameraName = camera.name_en || camera.name;
            const kitName = `${cameraName} Complete Package`;

            console.log(`Creating: ${kitName}`);
            console.log(`  Camera ID: ${camera.id}`);

            try {
                const template = await pb.collection('kit_templates').create({
                    name: kitName,
                    main_product_id: camera.id,  // <-- Use actual camera.id
                    base_price_modifier: -100,
                    description: `Complete cinema package with ${cameraName}`
                });
                console.log(`  Template ID: ${template.id}`);
                templatesCreated++;

                for (const slot of DEFAULT_SLOTS) {
                    const slotProducts = findEquipment(slot.searchTerms);
                    for (const prod of slotProducts) {
                        try {
                            await pb.collection('kit_items').create({
                                template_id: template.id,
                                product_id: prod.id,
                                slot_name: slot.slotName,
                                is_mandatory: false,
                                default_quantity: 1
                            });
                            itemsCreated++;
                        } catch (e) { /* skip */ }
                    }
                }
            } catch (e) {
                console.log(`  ERROR: ${e.message}`);
            }
        }

        console.log(`\n=== Done! ===`);
        console.log(`Created ${templatesCreated} templates, ${itemsCreated} items`);

        // Verify
        console.log("\n=== Verification ===");
        const kits = await pb.collection('kit_templates').getFullList();
        for (const k of kits) {
            const prod = allEquipment.find(e => e.id === k.main_product_id);
            console.log(`${k.name}`);
            console.log(`  main_product_id: ${k.main_product_id}`);
            console.log(`  Maps to: ${prod?.name_en || prod?.name || 'NOT FOUND!'}`);
        }

    } catch (e) {
        console.error("Error:", e.message);
        if (e.data) console.log("Details:", JSON.stringify(e.data, null, 2));
    }
}

main();

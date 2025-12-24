/**
 * Create Kits via PocketBase API - ALL CAMERAS
 * 
 * Uses the PocketBase API to create kit templates for all cameras.
 * Requires PocketBase to be running.
 */
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

// Default slot configurations
const DEFAULT_SLOTS = [
    { slotName: "Lens Set", searchTerms: ["Signature Prime", "Supreme Prime", "Master Prime", "Cooke", "Zeiss"] },
    { slotName: "Wireless Video", searchTerms: ["Teradek", "Bolt", "Ranger"] },
    { slotName: "Monitor", searchTerms: ["SmallHD", "Atomos", "TVLogic"] },
    { slotName: "Follow Focus", searchTerms: ["Hi-5", "WCU-4", "Cforce", "Follow Focus"] },
    { slotName: "Tripod/Support", searchTerms: ["Sachtler", "OConnor", "Cartoni", "Ronin"] }
];

// Camera name patterns to detect cameras
const CAMERA_PATTERNS = ['alexa', 'venice', 'fx6', 'fx9', 'fx3', 'komodo', 'raptor', 'red', 'amira', 'burano', 'c70', 'c300', 'c500', 'bmpcc', 'ursa', 'varicam', 'eva1', 'a7s', 'cinema'];

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        // Get all equipment
        console.log("Fetching equipment...");
        const allEquipment = await pb.collection('equipment').getFullList();
        console.log(`Found ${allEquipment.length} equipment items`);

        // Get categories
        const categories = await pb.collection('categories').getFullList();
        const cameraCat = categories.find(c =>
            c.name?.toLowerCase().includes('camera') ||
            c.slug?.toLowerCase().includes('camera')
        );
        console.log("Camera category:", cameraCat?.name || 'Not found');

        // Find all cameras
        let cameras = [];
        if (cameraCat) {
            cameras = allEquipment.filter(eq => eq.category === cameraCat.id);
        }

        // Also check by name pattern
        const camerasByName = allEquipment.filter(eq => {
            const name = (eq.name_en || eq.name || '').toLowerCase();
            return CAMERA_PATTERNS.some(p => name.includes(p));
        });

        for (const cam of camerasByName) {
            if (!cameras.find(c => c.id === cam.id)) {
                cameras.push(cam);
            }
        }

        console.log(`\nFound ${cameras.length} cameras`);
        cameras.forEach(c => console.log(`  - ${c.name_en || c.name}`));

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
            return results.slice(0, 5);
        };

        // Clear existing data
        console.log("\nClearing existing kit data...");
        const existingItems = await pb.collection('kit_items').getFullList();
        for (const item of existingItems) {
            await pb.collection('kit_items').delete(item.id);
        }
        const existingTemplates = await pb.collection('kit_templates').getFullList();
        for (const t of existingTemplates) {
            await pb.collection('kit_templates').delete(t.id);
        }
        console.log(`Deleted ${existingTemplates.length} templates, ${existingItems.length} items`);

        let templatesCreated = 0;
        let itemsCreated = 0;

        console.log("\n=== Creating Kits ===\n");

        for (const camera of cameras) {
            const cameraName = camera.name_en || camera.name;
            const kitName = `${cameraName} Complete Package`;

            // Determine discount
            let discount = -100;
            const brand = (camera.brand || cameraName).toLowerCase();
            if (brand.includes('arri')) discount = -200;
            else if (brand.includes('red')) discount = -250;
            else if (cameraName.toLowerCase().includes('venice')) discount = -300;
            else if (brand.includes('blackmagic')) discount = -50;

            console.log(`${kitName}`);

            try {
                // Create template
                const template = await pb.collection('kit_templates').create({
                    name: kitName,
                    main_product_id: camera.id,
                    base_price_modifier: discount,
                    description: `Complete cinema package with ${cameraName}`
                });
                templatesCreated++;

                // Create items for each slot
                for (const slot of DEFAULT_SLOTS) {
                    const slotProducts = findEquipment(slot.searchTerms);

                    if (slotProducts.length > 0) {
                        console.log(`  ${slot.slotName}: ${slotProducts.length} options`);

                        for (let i = 0; i < slotProducts.length; i++) {
                            const prod = slotProducts[i];
                            try {
                                await pb.collection('kit_items').create({
                                    template_id: template.id,
                                    product_id: prod.id,
                                    slot_name: slot.slotName,
                                    is_mandatory: i === 0,
                                    default_quantity: 1,
                                    swappable_category: ''
                                });
                                itemsCreated++;
                            } catch (e) {
                                // Skip failed items silently
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(`  ERROR: ${e.message}`);
            }
        }

        console.log(`\n=== Done! ===`);
        console.log(`Created ${templatesCreated} templates, ${itemsCreated} items`);

    } catch (e) {
        console.error("Error:", e.message);
        if (e.data) console.log("Details:", JSON.stringify(e.data, null, 2));
    }
}

main();

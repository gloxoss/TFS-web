/**
 * Setup Kit Collections + Seed Data
 * 
 * Creates kit_templates and kit_items collections if missing,
 * then seeds them with camera kit data.
 */
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

const CAMERA_PATTERNS = ['alexa', 'venice', 'fx6', 'fx9', 'fx3', 'komodo', 'raptor', 'red', 'amira', 'burano', 'c70', 'c300', 'c500', 'bmpcc', 'ursa', 'varicam', 'eva1', 'a7s', 'cinema'];

const DEFAULT_SLOTS = [
    { slotName: "Lens Set", searchTerms: ["Signature Prime", "Supreme Prime", "Cooke", "Zeiss"] },
    { slotName: "Wireless Video", searchTerms: ["Teradek", "Bolt"] },
    { slotName: "Monitor", searchTerms: ["SmallHD", "Atomos"] },
    { slotName: "Tripod/Support", searchTerms: ["Sachtler", "OConnor", "Cartoni"] }
];

async function main() {
    try {
        console.log("1. Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        // Get equipment collection ID for relations
        console.log("\n2. Getting equipment collection...");
        const eqCol = await pb.collections.getOne('equipment');
        console.log("   Equipment collection ID:", eqCol.id);

        // Check/create kit_templates
        console.log("\n3. Checking collections...");
        let ktCol;
        try {
            ktCol = await pb.collections.getOne('kit_templates');
            console.log("   kit_templates exists:", ktCol.id);
        } catch (e) {
            console.log("   Creating kit_templates...");
            ktCol = await pb.collections.create({
                name: 'kit_templates',
                type: 'base',
                schema: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'main_product_id', type: 'relation', required: true, options: { collectionId: eqCol.id, cascadeDelete: false, maxSelect: 1 } },
                    { name: 'base_price_modifier', type: 'number' },
                    { name: 'description', type: 'text' }
                ]
            });
            console.log("   Created kit_templates:", ktCol.id);
        }

        // Check/create kit_items
        let kiCol;
        try {
            kiCol = await pb.collections.getOne('kit_items');
            console.log("   kit_items exists:", kiCol.id);
        } catch (e) {
            console.log("   Creating kit_items...");
            kiCol = await pb.collections.create({
                name: 'kit_items',
                type: 'base',
                schema: [
                    { name: 'template_id', type: 'relation', required: true, options: { collectionId: ktCol.id, cascadeDelete: true, maxSelect: 1 } },
                    { name: 'product_id', type: 'relation', required: true, options: { collectionId: eqCol.id, cascadeDelete: false, maxSelect: 1 } },
                    { name: 'slot_name', type: 'text', required: true },
                    { name: 'is_mandatory', type: 'bool' },
                    { name: 'default_quantity', type: 'number' },
                    { name: 'swappable_category', type: 'text' }
                ]
            });
            console.log("   Created kit_items:", kiCol.id);
        }

        // Get all equipment
        console.log("\n4. Fetching equipment...");
        const allEquipment = await pb.collection('equipment').getFullList();
        console.log(`   Found ${allEquipment.length} equipment items`);

        // Find cameras
        const cameras = allEquipment.filter(eq => {
            const name = (eq.name_en || eq.name || '').toLowerCase();
            return CAMERA_PATTERNS.some(p => name.includes(p));
        });
        console.log(`   Found ${cameras.length} cameras`);

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

        // Clear existing data
        console.log("\n5. Clearing existing kit data...");
        try {
            const existingItems = await pb.collection('kit_items').getFullList();
            for (const item of existingItems) {
                await pb.collection('kit_items').delete(item.id);
            }
            console.log(`   Deleted ${existingItems.length} items`);
        } catch (e) { console.log("   No items to delete"); }

        try {
            const existingTemplates = await pb.collection('kit_templates').getFullList();
            for (const t of existingTemplates) {
                await pb.collection('kit_templates').delete(t.id);
            }
            console.log(`   Deleted ${existingTemplates.length} templates`);
        } catch (e) { console.log("   No templates to delete"); }

        // Create kits
        console.log("\n6. Creating kits...\n");
        let templatesCreated = 0;
        let itemsCreated = 0;

        for (const camera of cameras) {
            const cameraName = camera.name_en || camera.name;
            const kitName = `${cameraName} Complete Package`;

            let discount = -100;
            const nameLower = cameraName.toLowerCase();
            if (nameLower.includes('arri')) discount = -200;
            else if (nameLower.includes('red') || nameLower.includes('raptor')) discount = -250;
            else if (nameLower.includes('venice')) discount = -300;

            try {
                const template = await pb.collection('kit_templates').create({
                    name: kitName,
                    main_product_id: camera.id,
                    base_price_modifier: discount,
                    description: `Complete cinema package with ${cameraName}`
                });
                templatesCreated++;
                console.log(`✓ ${kitName}`);

                for (const slot of DEFAULT_SLOTS) {
                    const slotProducts = findEquipment(slot.searchTerms);
                    for (let i = 0; i < slotProducts.length; i++) {
                        try {
                            await pb.collection('kit_items').create({
                                template_id: template.id,
                                product_id: slotProducts[i].id,
                                slot_name: slot.slotName,
                                is_mandatory: i === 0,
                                default_quantity: 1
                            });
                            itemsCreated++;
                        } catch (e) { /* skip */ }
                    }
                }
            } catch (e) {
                console.log(`✗ ${kitName}: ${e.message}`);
            }
        }

        console.log(`\n=== Done! ===`);
        console.log(`Created ${templatesCreated} templates, ${itemsCreated} items`);

    } catch (e) {
        console.error("\nError:", e.message);
        if (e.data) console.log("Details:", JSON.stringify(e.data, null, 2));
    }
}

main();

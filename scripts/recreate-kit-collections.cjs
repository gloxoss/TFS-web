const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        // Delete existing collections
        console.log("\n1. Deleting existing collections...");
        try {
            await pb.collections.delete('kit_items');
            console.log("   Deleted kit_items");
        } catch (e) { console.log("   kit_items: " + e.message); }

        try {
            await pb.collections.delete('kit_templates');
            console.log("   Deleted kit_templates");
        } catch (e) { console.log("   kit_templates: " + e.message); }

        // Get equipment collection ID
        const eqCol = await pb.collections.getOne('equipment');
        console.log("\n2. Equipment collection ID:", eqCol.id);

        // Create kit_templates
        console.log("\n3. Creating kit_templates...");
        const ktCol = await pb.collections.create({
            name: 'kit_templates',
            type: 'base',
            fields: [
                { name: 'name', type: 'text', required: true },
                {
                    name: 'main_product_id',
                    type: 'relation',
                    required: true,
                    options: {
                        collectionId: eqCol.id,
                        cascadeDelete: false,
                        maxSelect: 1
                    }
                },
                { name: 'base_price_modifier', type: 'number' },
                { name: 'description', type: 'text' }
            ]
        });
        console.log("   Created:", ktCol.id);

        // Create kit_items
        console.log("\n4. Creating kit_items...");
        const kiCol = await pb.collections.create({
            name: 'kit_items',
            type: 'base',
            fields: [
                {
                    name: 'template_id',
                    type: 'relation',
                    required: true,
                    options: {
                        collectionId: ktCol.id,
                        cascadeDelete: true,
                        maxSelect: 1
                    }
                },
                {
                    name: 'product_id',
                    type: 'relation',
                    required: true,
                    options: {
                        collectionId: eqCol.id,
                        cascadeDelete: false,
                        maxSelect: 1
                    }
                },
                { name: 'slot_name', type: 'text', required: true },
                { name: 'is_mandatory', type: 'bool' },
                { name: 'default_quantity', type: 'number' },
                { name: 'swappable_category', type: 'text' }
            ]
        });
        console.log("   Created:", kiCol.id);

        console.log("\n=== Done! Collections recreated. ===");

    } catch (e) {
        console.error("Error:", e.message);
        if (e.data) console.log("Details:", JSON.stringify(e.data, null, 2));
    }
}

main();

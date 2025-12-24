/**
 * Complete Kit Seeding Script
 * 
 * Creates kit_templates for all cameras and populates kit_items
 * with all equipment from each category, plus brand-matched recommendations.
 */
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

// Category IDs from the database
const SLOT_CATEGORIES = {
    'Lenses': '3tipdby3o2uw3fu',
    'Lens Control': 'yoahse3y2xg0d7i',
    'Support': 'hztkll7m1ho1gln',
    'Matte Boxes': '2nenzy83gvsh6km',
    'Monitors': 'bagi9euu3e7j34z',
    'Wireless Video': '4utj6dugkcz3bjq',
    'Stabilization': 'nce66rf2l43u8li',
    'Power': '8ozukj9kan72ovw'
};

// Cameras category ID
const CAMERAS_CATEGORY_ID = '48ennr6i60ho7bd';

// Brand-based recommendations (keywords to match in equipment names)
const BRAND_RECOMMENDATIONS = {
    'ARRI': {
        'Lenses': ['Signature Prime', 'Master Prime', 'Ultra Prime'],
        'Lens Control': ['Hi-5', 'WCU-4'],
        'Matte Boxes': ['LMB 4x5', 'LMB-25'],
        'Monitors': ['SmallHD'],
        'Wireless Video': ['Teradek Bolt 6'],
        'Support': ['OConnor', 'Sachtler'],
        'Stabilization': ['Ronin 2'],
        'Power': ['bebob']
    },
    'Sony': {
        'Lenses': ['Zeiss Supreme', 'Zeiss CP.3'],
        'Lens Control': ['Hi-5', 'Nucleus'],
        'Matte Boxes': ['LMB 4x5'],
        'Monitors': ['SmallHD Cine', 'Sony PVM'],
        'Wireless Video': ['Teradek Bolt 6', 'Teradek Ranger'],
        'Support': ['Sachtler'],
        'Stabilization': ['Ronin 2', 'RS 4'],
        'Power': ['bebob']
    },
    'Panasonic': {
        'Lenses': ['Zeiss CP.2', 'Zeiss CP.3'],
        'Lens Control': ['Nucleus', 'Teradek RT'],
        'Matte Boxes': ['LMB-25'],
        'Monitors': ['SmallHD', 'TVLogic'],
        'Wireless Video': ['Teradek Bolt 6'],
        'Support': ['Sachtler', 'Cartoni'],
        'Stabilization': ['Ronin 2'],
        'Power': ['EcoFlow']
    }
};

async function main() {
    console.log('=== COMPLETE KIT SEEDING ===\n');

    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    console.log('✓ Authenticated\n');

    // Step 1: Clean up existing data
    console.log('--- Cleaning existing data ---');
    try {
        const oldItems = await pb.collection('kit_items').getFullList();
        console.log(`Deleting ${oldItems.length} kit_items...`);
        for (const item of oldItems) {
            await pb.collection('kit_items').delete(item.id);
        }
    } catch (e) { console.log('  kit_items cleanup:', e.message); }

    try {
        const oldTemplates = await pb.collection('kit_templates').getFullList();
        console.log(`Deleting ${oldTemplates.length} kit_templates...`);
        for (const t of oldTemplates) {
            await pb.collection('kit_templates').delete(t.id);
        }
    } catch (e) { console.log('  kit_templates cleanup:', e.message); }

    // Step 2: Get all equipment grouped by category
    console.log('\n--- Loading equipment ---');
    const allEquipment = await pb.collection('equipment').getFullList();
    console.log(`Total equipment: ${allEquipment.length}`);

    const equipmentByCategory = {};
    for (const [slotName, catId] of Object.entries(SLOT_CATEGORIES)) {
        equipmentByCategory[slotName] = allEquipment.filter(e => e.category === catId);
        console.log(`  ${slotName}: ${equipmentByCategory[slotName].length} items`);
    }

    // Step 3: Get all cameras from database
    console.log('\n--- Loading cameras ---');
    const cameras = allEquipment.filter(e => e.category === CAMERAS_CATEGORY_ID);
    console.log(`Found ${cameras.length} cameras`);

    // Step 4: Create kit for each camera
    console.log('\n--- Creating camera kits ---\n');
    let templatesCreated = 0;
    let itemsCreated = 0;

    for (const camera of cameras) {
        const cameraName = camera.name_en || camera.name;
        const cameraId = camera.id;
        console.log(`📷 ${cameraName}`);

        // Determine brand for recommendations
        let brand = 'Sony'; // default
        if (cameraName.includes('ARRI')) brand = 'ARRI';
        else if (cameraName.includes('Sony')) brand = 'Sony';
        else if (cameraName.includes('Panasonic')) brand = 'Panasonic';

        const recommendations = BRAND_RECOMMENDATIONS[brand] || BRAND_RECOMMENDATIONS['Sony'];

        // Create kit template
        const template = await pb.collection('kit_templates').create({
            name: `${cameraName} Complete Package`,
            main_product_id: cameraId,
            base_price_modifier: -100,
            description: `Professional cinema kit built around the ${cameraName}`
        });
        templatesCreated++;
        console.log(`   ✓ Template: ${template.id}`);

        // Create kit items for each slot/category
        for (const [slotName, items] of Object.entries(equipmentByCategory)) {
            const slotRecommendations = recommendations[slotName] || [];
            let displayOrder = 0;

            for (const item of items) {
                const itemName = item.name_en || item.name || '';

                // Check if this item matches any recommendation keywords
                const isRecommended = slotRecommendations.some(rec =>
                    itemName.toLowerCase().includes(rec.toLowerCase())
                );

                try {
                    await pb.collection('kit_items').create({
                        template_id: template.id,
                        product_id: item.id,
                        slot_name: slotName,
                        is_recommended: isRecommended,
                        display_order: isRecommended ? 0 : ++displayOrder
                    });
                    itemsCreated++;
                } catch (e) {
                    console.log(`   ✗ Failed: ${itemName} - ${e.message}`);
                }
            }

            const recCount = items.filter(i =>
                slotRecommendations.some(rec =>
                    (i.name_en || i.name || '').toLowerCase().includes(rec.toLowerCase())
                )
            ).length;
            console.log(`   ${slotName}: ${items.length} items (${recCount} recommended)`);
        }
    }

    // Step 4: Summary
    console.log('\n=== SEEDING COMPLETE ===');
    console.log(`Templates created: ${templatesCreated}`);
    console.log(`Items created: ${itemsCreated}`);

    // Verify
    console.log('\n--- Verification ---');
    const finalTemplates = await pb.collection('kit_templates').getFullList();
    const finalItems = await pb.collection('kit_items').getFullList();
    console.log(`Final count: ${finalTemplates.length} templates, ${finalItems.length} items`);

    // Check Alexa 35 specifically
    const alexaTemplate = finalTemplates.find(t => t.name.includes('Alexa 35'));
    if (alexaTemplate) {
        const alexaItems = finalItems.filter(i => i.template_id === alexaTemplate.id);
        console.log(`\nARRI Alexa 35 kit: ${alexaItems.length} items`);

        // Count by slot
        const slotCounts = {};
        alexaItems.forEach(i => {
            slotCounts[i.slot_name] = (slotCounts[i.slot_name] || 0) + 1;
        });
        Object.entries(slotCounts).forEach(([slot, count]) => {
            console.log(`  ${slot}: ${count}`);
        });
    }
}

main().catch(e => {
    console.error('\n❌ Error:', e.message);
    if (e.data) console.error('Details:', JSON.stringify(e.data, null, 2));
});

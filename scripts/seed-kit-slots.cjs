/**
 * Optimized Kit Seeding Script - Category-Based Slots
 * 
 * Creates kit_slots (80 rows) instead of kit_items (1000 rows)
 * Each slot links to a category and stores recommended product IDs as JSON
 */
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

// Category IDs
const CATEGORIES = {
    'Lenses': '3tipdby3o2uw3fu',
    'Lens Control': 'yoahse3y2xg0d7i',
    'Support': 'hztkll7m1ho1gln',
    'Matte Boxes': '2nenzy83gvsh6km',
    'Monitors': 'bagi9euu3e7j34z',
    'Wireless Video': '4utj6dugkcz3bjq',
    'Stabilization': 'nce66rf2l43u8li',
    'Power': '8ozukj9kan72ovw'
};

const CAMERAS_CATEGORY_ID = '48ennr6i60ho7bd';

// Brand-based recommendation keywords
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
    'RED': {
        'Lenses': ['Zeiss CP.3', 'Zeiss Supreme'],
        'Lens Control': ['Nucleus', 'Teradek RT'],
        'Matte Boxes': ['LMB 4x5'],
        'Monitors': ['SmallHD Cine 7 RED'],
        'Wireless Video': ['Teradek Bolt 6'],
        'Support': ['OConnor'],
        'Stabilization': ['Ronin 2'],
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
    console.log('=== OPTIMIZED KIT SEEDING ===\n');

    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    console.log('✓ Authenticated\n');

    // Step 1: Clean up existing data
    console.log('--- Cleaning existing data ---');

    try {
        const oldSlots = await pb.collection('kit_slots').getFullList();
        console.log(`Deleting ${oldSlots.length} kit_slots...`);
        for (const slot of oldSlots) {
            await pb.collection('kit_slots').delete(slot.id);
        }
    } catch (e) { console.log('  kit_slots cleanup:', e.message); }

    try {
        const oldTemplates = await pb.collection('kit_templates').getFullList();
        console.log(`Deleting ${oldTemplates.length} kit_templates...`);
        for (const t of oldTemplates) {
            await pb.collection('kit_templates').delete(t.id);
        }
    } catch (e) { console.log('  kit_templates cleanup:', e.message); }

    // Step 2: Load all equipment (for finding recommended IDs)
    console.log('\n--- Loading equipment ---');
    const allEquipment = await pb.collection('equipment').getFullList();
    console.log(`Total equipment: ${allEquipment.length}`);

    // Get cameras
    const cameras = allEquipment.filter(e => e.category === CAMERAS_CATEGORY_ID);
    console.log(`Cameras: ${cameras.length}`);

    // Step 3: Create kit for each camera
    console.log('\n--- Creating camera kits ---\n');
    let templatesCreated = 0;
    let slotsCreated = 0;

    for (const camera of cameras) {
        const cameraName = camera.name_en || camera.name;
        console.log(`📷 ${cameraName}`);

        // Determine brand for recommendations
        let brand = 'Sony'; // default
        if (cameraName.includes('ARRI')) brand = 'ARRI';
        else if (cameraName.includes('Sony')) brand = 'Sony';
        else if (cameraName.includes('RED')) brand = 'RED';
        else if (cameraName.includes('Panasonic')) brand = 'Panasonic';

        const recommendations = BRAND_RECOMMENDATIONS[brand] || BRAND_RECOMMENDATIONS['Sony'];

        // Create kit template
        const template = await pb.collection('kit_templates').create({
            name: `${cameraName} Complete Package`,
            main_product_id: camera.id,
            base_price_modifier: -100,
            description: `Professional cinema kit built around the ${cameraName}`
        });
        templatesCreated++;

        // Create one slot per category
        let displayOrder = 0;
        for (const [slotName, categoryId] of Object.entries(CATEGORIES)) {
            // Find recommended product IDs for this slot
            const slotRecommendations = recommendations[slotName] || [];
            const categoryProducts = allEquipment.filter(e => e.category === categoryId);

            const recommendedIds = categoryProducts
                .filter(p => {
                    const name = (p.name_en || p.name || '').toLowerCase();
                    return slotRecommendations.some(rec =>
                        name.includes(rec.toLowerCase())
                    );
                })
                .map(p => p.id);

            try {
                await pb.collection('kit_slots').create({
                    template_id: template.id,
                    category_id: categoryId,
                    slot_name: slotName,
                    recommended_ids: recommendedIds, // JSON array
                    display_order: ++displayOrder
                });
                slotsCreated++;
                console.log(`   ${slotName}: ${recommendedIds.length} recommended`);
            } catch (e) {
                console.log(`   ✗ ${slotName}: ${e.message}`);
            }
        }
    }

    // Summary
    console.log('\n=== SEEDING COMPLETE ===');
    console.log(`Templates: ${templatesCreated}`);
    console.log(`Slots: ${slotsCreated}`);
    console.log(`\nReduction: 1000 rows → ${slotsCreated} rows (${Math.round((1 - slotsCreated / 1000) * 100)}% smaller)`);
}

main().catch(e => {
    console.error('\n❌ Error:', e.message);
    if (e.data) console.error('Details:', JSON.stringify(e.data, null, 2));
});

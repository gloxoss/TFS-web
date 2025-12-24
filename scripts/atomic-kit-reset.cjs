/**
 * ATOMIC Kit Reset v2 - Fixed camera detection
 */
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

// More specific camera patterns (avoid matching lenses)
const CAMERA_NAMES = [
    'Alexa 35', 'Alexa Mini', 'Alexa LF',
    'Venice 2', 'Venice',
    'FX6', 'FX9', 'FX3',
    'V-Raptor', 'Komodo',
    'Amira', 'Burano',
    'VariCam', 'EVA1',
    'C70', 'C300', 'C500',
    'URSA', 'BMPCC'
];

const DEFAULT_SLOTS = [
    { slotName: "Lens Set", searchTerms: ["Prime", "Lens", "Zeiss"] },
    { slotName: "Wireless Video", searchTerms: ["Teradek", "Bolt"] },
    { slotName: "Monitor", searchTerms: ["SmallHD", "Atomos", "Monitor"] },
    { slotName: "Tripod/Support", searchTerms: ["Sachtler", "OConnor", "Tripod"] }
];

async function main() {
    console.log('=== ATOMIC KIT RESET v2 ===\n');

    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    console.log('Authenticated');

    // Delete ALL existing kit data
    console.log('\n--- Deleting existing data ---');
    const oldItems = await pb.collection('kit_items').getFullList();
    for (const item of oldItems) await pb.collection('kit_items').delete(item.id);
    console.log('Deleted', oldItems.length, 'items');

    const oldTemplates = await pb.collection('kit_templates').getFullList();
    for (const t of oldTemplates) await pb.collection('kit_templates').delete(t.id);
    console.log('Deleted', oldTemplates.length, 'templates');

    // Get all equipment
    const allEquipment = await pb.collection('equipment').getFullList();
    console.log('Total equipment:', allEquipment.length);

    // Find cameras by EXACT name matching
    const cameras = allEquipment.filter(eq => {
        const name = (eq.name_en || eq.name || '');
        return CAMERA_NAMES.some(cam => name.includes(cam));
    });
    console.log('Found', cameras.length, 'cameras');
    cameras.forEach(c => console.log('  -', c.name_en || c.name));

    // Camera IDs set for exclusion
    const cameraIds = new Set(cameras.map(c => c.id));

    // Helper to find non-camera equipment
    const findAccessories = (searchTerms) => {
        const results = [];
        for (const term of searchTerms) {
            const found = allEquipment.filter(eq => {
                if (cameraIds.has(eq.id)) return false; // Exclude cameras
                return (eq.name_en || eq.name || '').toLowerCase().includes(term.toLowerCase());
            });
            for (const f of found) {
                if (!results.find(r => r.id === f.id)) {
                    results.push(f);
                }
            }
        }
        return results.slice(0, 4);
    };

    // Test findAccessories
    console.log('\n--- Testing accessory search ---');
    for (const slot of DEFAULT_SLOTS) {
        const found = findAccessories(slot.searchTerms);
        console.log(slot.slotName + ':', found.length, 'items');
    }

    // Create templates and items
    console.log('\n--- Creating kits ---');
    let templatesCreated = 0;
    let itemsCreated = 0;

    for (const camera of cameras) {
        const cameraName = camera.name_en || camera.name;
        const kitName = `${cameraName} Complete Package`;

        const template = await pb.collection('kit_templates').create({
            name: kitName,
            main_product_id: camera.id,
            base_price_modifier: -100,
            description: `Complete cinema package with ${cameraName}`
        });
        templatesCreated++;
        console.log('✓', kitName);

        for (const slot of DEFAULT_SLOTS) {
            const accessories = findAccessories(slot.searchTerms);
            for (const acc of accessories) {
                await pb.collection('kit_items').create({
                    template_id: template.id,
                    product_id: acc.id,
                    slot_name: slot.slotName,
                    is_mandatory: false,
                    default_quantity: 1
                });
                itemsCreated++;
            }
        }
    }

    console.log('\n=== DONE ===');
    console.log('Templates:', templatesCreated);
    console.log('Items:', itemsCreated);

    // Verify Alexa 35
    console.log('\n--- Verification ---');
    const newTemplates = await pb.collection('kit_templates').getFullList();
    const newItems = await pb.collection('kit_items').getFullList();

    const alexa = newTemplates.find(t => t.name.includes('Alexa 35'));
    if (alexa) {
        const alexaItems = newItems.filter(i => i.template_id === alexa.id);
        console.log('ARRI Alexa 35:');
        console.log('  ID:', alexa.id);
        console.log('  main_product_id:', alexa.main_product_id);
        console.log('  Items:', alexaItems.length);
    }
}

main().catch(e => console.error('Error:', e.message));

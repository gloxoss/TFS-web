const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const pb = new PocketBase('http://127.0.0.1:8090');

let output = '';
const log = (msg) => { console.log(msg); output += msg + '\n'; };

async function main() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    log('Authenticated');

    const allEquipment = await pb.collection('equipment').getFullList();
    log('Total equipment: ' + allEquipment.length);

    // Test searchTerms
    const searchTerms = ["Signature Prime", "Supreme Prime", "Cooke", "Zeiss"];

    log('\n=== Testing findEquipment ===');
    for (const term of searchTerms) {
        const found = allEquipment.filter(eq =>
            (eq.name_en || eq.name || '').toLowerCase().includes(term.toLowerCase())
        );
        log(term + ': ' + found.length + ' matches');
    }

    // Find cameras
    const CAMERA_PATTERNS = ['alexa', 'venice', 'fx6', 'fx9'];
    const cameras = allEquipment.filter(eq => {
        const name = (eq.name_en || eq.name || '').toLowerCase();
        return CAMERA_PATTERNS.some(p => name.includes(p));
    });
    log('Cameras found: ' + cameras.length);

    // Test creating a single kit_item
    log('\n=== Testing single item creation ===');

    // First create a template
    const testTemplate = await pb.collection('kit_templates').create({
        name: 'TEST Template',
        main_product_id: cameras[0]?.id || allEquipment[0].id,
        base_price_modifier: 0,
        description: 'Test'
    });
    log('Created template: ' + testTemplate.id);

    // Find a lens
    const lens = allEquipment.find(eq =>
        (eq.name_en || eq.name || '').toLowerCase().includes('lens') ||
        (eq.name_en || eq.name || '').toLowerCase().includes('prime')
    );

    if (lens) {
        log('Found lens: ' + lens.id + ' ' + (lens.name_en || lens.name));

        try {
            const item = await pb.collection('kit_items').create({
                template_id: testTemplate.id,
                product_id: lens.id,
                slot_name: 'Test Slot',
                is_mandatory: false,
                default_quantity: 1
            });
            log('SUCCESS! Created item: ' + item.id);
        } catch (e) {
            log('FAILED: ' + e.message);
            log('Data: ' + JSON.stringify(e.data, null, 2));
        }
    } else {
        log('No lens found!');
    }

    // Cleanup
    await pb.collection('kit_templates').delete(testTemplate.id);
    log('Cleaned up test template');

    // Save output
    fs.writeFileSync('debug-output.txt', output);
    log('\nOutput saved to debug-output.txt');
}

main().catch(e => { log('Fatal: ' + e.message); fs.writeFileSync('debug-output.txt', output); });

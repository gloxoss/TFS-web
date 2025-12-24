const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

    const templates = await pb.collection('kit_templates').getFullList();
    const slots = await pb.collection('kit_slots').getFullList();

    console.log('=== KIT SLOTS VERIFICATION ===\n');
    console.log('Templates:', templates.length);
    console.log('Slots:', slots.length);
    console.log('\nReduction: 1000 → ' + slots.length + ' rows (' + Math.round((1 - slots.length / 1000) * 100) + '% smaller)\n');

    // Check a specific template
    const alexa = templates.find(t => t.name.includes('Alexa 35'));
    if (alexa) {
        console.log('ARRI Alexa 35 slots:');
        const alexaSlots = slots.filter(s => s.template_id === alexa.id);
        alexaSlots.forEach(s => {
            const recIds = s.recommended_ids || [];
            console.log('  -', s.slot_name + ':', recIds.length, 'recommended');
        });
    }
}

main().catch(console.error);

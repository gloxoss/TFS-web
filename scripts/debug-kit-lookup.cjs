const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

    const eq = await pb.collection('equipment').getFullList();
    const alexa35 = eq.find(e => (e.name_en || e.name || '').toLowerCase().includes('alexa 35'));

    console.log('=== ARRI Alexa 35 ===');
    console.log('ID:', alexa35?.id);

    try {
        const kit = await pb.collection('kit_templates').getFirstListItem(`main_product_id="${alexa35?.id}"`);
        console.log('\n=== Kit Found! ===');
        console.log('Kit Name:', kit.name);
        console.log('ID Match:', kit.main_product_id === alexa35?.id ? 'YES!' : 'NO');

        const items = await pb.collection('kit_items').getFullList({ filter: `template_id="${kit.id}"` });
        console.log('Items:', items.length);
        items.slice(0, 5).forEach(i => {
            const prod = eq.find(e => e.id === i.product_id);
            console.log('  -', i.slot_name, ':', prod?.name_en || prod?.name);
        });
    } catch (e) {
        console.log('\n=== NO KIT FOUND ===');
        console.log('Error:', e.message);
    }
}

main().catch(console.error);

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

    // Get all templates and items
    const templates = await pb.collection('kit_templates').getFullList();
    const items = await pb.collection('kit_items').getFullList();

    console.log('=== Templates ===');
    templates.forEach(t => {
        const itemCount = items.filter(i => i.template_id === t.id).length;
        console.log(t.id, '-', t.name);
        console.log('  main_product_id:', t.main_product_id);
        console.log('  items:', itemCount);
    });

    console.log('\n=== Items by template_id ===');
    const templateIds = [...new Set(items.map(i => i.template_id))];
    templateIds.forEach(tid => {
        const count = items.filter(i => i.template_id === tid).length;
        const template = templates.find(t => t.id === tid);
        console.log(tid, ':', count, 'items', template ? '-> ' + template.name : '-> NO TEMPLATE!');
    });

    console.log('\n=== Finding Alexa 35 ===');
    const alexa = templates.find(t => t.name.includes('Alexa 35'));
    console.log('Alexa 35 template ID:', alexa?.id);
    console.log('Items for this ID:', items.filter(i => i.template_id === alexa?.id).length);
}

main().catch(console.error);

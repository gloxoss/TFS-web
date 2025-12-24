const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

    const templates = await pb.collection('kit_templates').getFullList();
    const items = await pb.collection('kit_items').getFullList();

    let out = '=== KIT VERIFICATION ===\n\n';
    out += 'Templates: ' + templates.length + '\n';
    out += 'Items: ' + items.length + '\n\n';

    out += '=== Templates with item counts ===\n';
    templates.forEach(t => {
        const tItems = items.filter(i => i.template_id === t.id);
        out += t.name + ' (' + t.id + ')\n';
        out += '  main_product_id: ' + t.main_product_id + '\n';
        out += '  items: ' + tItems.length + '\n';
    });

    out += '\n=== Item template_ids ===\n';
    const templateIds = [...new Set(items.map(i => i.template_id))];
    templateIds.forEach(tid => {
        const count = items.filter(i => i.template_id === tid).length;
        const template = templates.find(t => t.id === tid);
        out += tid + ': ' + count + ' items -> ' + (template?.name || 'NO TEMPLATE') + '\n';
    });

    fs.writeFileSync('kit-verify.txt', out);
    console.log(out);
}

main().catch(console.error);

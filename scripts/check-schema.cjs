const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const pb = new PocketBase('http://127.0.0.1:8090');

let out = '';
const log = (msg) => { console.log(msg); out += msg + '\n'; };

async function main() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

    log('=== kit_items schema ===');
    const kiCol = await pb.collections.getOne('kit_items');
    kiCol.fields?.forEach(f => log(f.name + ' : ' + f.type + (f.required ? ' REQUIRED' : '')));

    log('\n=== Sample kit_item record ===');
    const items = await pb.collection('kit_items').getList(1, 1);
    if (items.items.length > 0) {
        log(JSON.stringify(items.items[0], null, 2));
    }

    log('\n=== kit_templates schema ===');
    const ktCol = await pb.collections.getOne('kit_templates');
    ktCol.fields?.forEach(f => log(f.name + ' : ' + f.type + (f.required ? ' REQUIRED' : '')));

    fs.writeFileSync('schema-output.txt', out);
}

main().catch(console.error);

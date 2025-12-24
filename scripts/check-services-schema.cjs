const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');
const fs = require('fs');

async function main() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

    const cols = await pb.collections.getList(1, 50);
    const services = cols.items.find(c => c.name === 'services');

    if (services) {
        console.log('Services collection schema:');
        services.schema.forEach(f => {
            console.log(`  - ${f.name} (${f.type})${f.required ? ' [required]' : ''}`);
        });
    } else {
        console.log('Services collection NOT FOUND');
    }
}

main().catch(console.error);

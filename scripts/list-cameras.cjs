const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

    // Get cameras by category
    const cameras = await pb.collection('equipment').getFullList({
        filter: 'category="48ennr6i60ho7bd"'
    });

    console.log('=== All Cameras (' + cameras.length + ') ===');
    cameras.forEach(c => {
        console.log(`'${c.name_en || c.name}': '${c.id}',`);
    });
}

main().catch(console.error);

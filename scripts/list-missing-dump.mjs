import PocketBase from 'pocketbase';
import fs from 'fs';

const pb = new PocketBase('http://127.0.0.1:8090');

async function run() {
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        const records = await pb.collection('equipment').getFullList();

        // Filter for no images or placeholder images
        const missing = records.filter(r =>
            !r.images ||
            r.images.length === 0 ||
            r.images.some(img => img.includes('placeholder'))
        );

        fs.writeFileSync('missing_dump.json', JSON.stringify(missing.map(r => ({
            name: r.name_en || r.name,
            slug: r.slug
        })), null, 2));

        console.log(`Dumped ${missing.length} items to missing_dump.json`);
    } catch (e) {
        console.error(e);
    }
}

run();

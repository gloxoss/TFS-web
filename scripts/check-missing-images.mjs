
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function checkMissing() {
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        // Get all items without sort to avoid 400 error
        const records = await pb.collection('equipment').getFullList();

        const missing = records.filter(r => !r.images || r.images.length === 0 || r.images.some(img => img.includes('placeholder')));


        console.log(`Total Checked: ${records.length}`);
        console.log(`Missing Images: ${missing.length}`);
        console.log("------------------------------------------------");

        if (missing.length > 0) {
            missing.forEach(r => {
                console.log(`MISSING: ${r.name_en || r.name} (${r.slug})`);
            });
        } else {
            console.log("All items have images!");
        }

    } catch (e) {
        console.error(e);
    }
}

checkMissing();

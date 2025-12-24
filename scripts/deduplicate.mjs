
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function deduplicate() {
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        // Get all items
        const records = await pb.collection('equipment').getFullList();
        console.log(`Initial Count: ${records.length}`);

        const slugMap = new Map();
        let deletedCount = 0;

        for (const record of records) {
            const key = record.name_en || record.name;
            if (!key) continue;

            if (slugMap.has(key)) {
                console.log(`Duplicate found: ${key} (${record.id}) - DELETING`);
                await pb.collection('equipment').delete(record.id);
                deletedCount++;
            } else {
                slugMap.set(key, record.id);
            }
        }

        console.log(`-----------------------------------`);
        console.log(`Deduplication Complete.`);
        console.log(`Deleted: ${deletedCount} records.`);
        console.log(`Final Count: ${records.length - deletedCount}`);

    } catch (e) {
        console.error(e);
    }
}

deduplicate();

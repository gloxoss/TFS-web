
import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';

async function testFetch() {
    const pb = new PocketBase(PB_URL);

    console.log('--- Testing Public Fetch ---');
    try {
        const result = await pb.collection('equipment').getList(1, 10, {
            sort: '-created'
        });
        console.log('Public fetch success:', result.totalItems, 'items');
    } catch (e: any) {
        console.log('Public fetch failed. Status:', e.status);
        console.log('Response:', JSON.stringify(e.response, null, 2));
    }

    console.log('\n--- Testing Admin Fetch ---');
    try {
        await pb.admins.authWithPassword('admin@example.com', 'adminadmin123');
        console.log('Authenticated as admin');

        const result = await pb.collection('equipment').getList(1, 10, {
            sort: '-created'
        });
        console.log('Admin fetch success:', result.totalItems, 'items');
    } catch (e: any) {
        console.log('Admin fetch failed. Status:', e.status);
        console.log('Response:', JSON.stringify(e.response, null, 2));
    }
}

testFetch();

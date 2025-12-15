import PocketBase from 'pocketbase';

async function checkId() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    try {
        const result = await pb.collection('equipment').getList(1, 1);
        if (result.items.length > 0) {
            const id = result.items[0].collectionId;
            console.log('Equipment Collection ID:', id);

            // Expected ID from migration
            const expected = 'pbc_4092854851';

            if (id === expected) {
                console.log('MATCH: Migration ID matches.');
            } else {
                console.error(`MISMATCH: Migration expects ${expected}, but actual ID is ${id}`);
            }
        } else {
            console.log('No equipment found to check ID.');
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkId();

import PocketBase from 'pocketbase';

async function inspect() {
    // Assuming localhost, but should be same as env. Using hardcoded for script.
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        console.log('--- Inspecting cart_items schema ---');
        try {
            const collection = await pb.collections.getOne('cart_items');
            console.log('Collection found:', collection.name);
            console.log('Fields:');
            collection.schema.forEach(f => {
                console.log(`- ${f.name} (${f.type}) [required:${f.required}]`);
                if (f.type === 'relation') {
                    console.log(`  -> Relation to: ${f.options.collectionId}`);
                }
            });
        } catch (e) {
            console.error('Failed to get cart_items:', e.message);
        }

        console.log('\n--- Inspecting equipment collection ---');
        try {
            const equipment = await pb.collections.getOne('equipment');
            console.log('Equipment ID:', equipment.id);
            console.log('Equipment Name:', equipment.name);
        } catch (e) {
            console.error('Equipment collection not found?', e.message);
        }

        console.log('\n--- Inspecting products collection ---');
        try {
            const products = await pb.collections.getOne('products');
            console.log('Products ID:', products.id);
            console.log('Products Name:', products.name);
        } catch (e) {
            console.error('Products collection not found?', e.message);
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

inspect();

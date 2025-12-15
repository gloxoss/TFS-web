const PocketBase = require('pocketbase');

async function inspect() {
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        console.log('--- Inspecting cart_items schema ---');
        const collection = await pb.collections.getOne('cart_items');
        console.log('Fields:', collection.schema.map(f => `${f.name} (${f.type})`).join(', '));

        const productField = collection.schema.find(f => f.name === 'product');
        if (productField) {
            console.log('Product field options:', productField.options);
        } else {
            console.error('CRITICAL: product field missing in cart_items!');
        }

        const userField = collection.schema.find(f => f.name === 'user');
        if (userField) {
            console.log('User field options:', userField.options);
        } else {
            console.error('CRITICAL: user field missing in cart_items!');
        }

        console.log('\n--- Inspecting equipment collection ---');
        try {
            const equipment = await pb.collections.getOne('equipment');
            console.log('Equipment ID:', equipment.id);
            console.log('Equipment Name:', equipment.name);

            if (productField) {
                if (productField.options.collectionId === equipment.id) {
                    console.log('MATCH: cart_items.product points to equipment collection.');
                } else {
                    console.error(`MISMATCH: cart_items.product points to ${productField.options.collectionId}, but equipment id is ${equipment.id}`);
                }
            }

        } catch (e) {
            console.error('Equipment collection not found?', e.message);
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

inspect();

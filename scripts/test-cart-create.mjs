import PocketBase from 'pocketbase';

async function test() {
    const pb = new PocketBase('http://127.0.0.1:8090');

    // 1. Get a valid product ID
    let productId;
    try {
        const result = await pb.collection('equipment').getList(1, 1);
        if (result.items.length > 0) productId = result.items[0].id;
    } catch (e) { }

    const userId = 'ykwwg96l0w449jl'; // Assumed valid

    // Helper
    async function tryCreate(payload, caseName) {
        console.log(`\n--- Test Case: ${caseName} ---`);
        try {
            await pb.collection('cart_items').create(payload);
            console.log('SUCCESS');
        } catch (e) {
            console.log(`FAILED (${e.status}). Data keys:`, Object.keys(e.response?.data || {}));
            if (Object.keys(e.response?.data || {}).length > 0) {
                console.log('Data:', JSON.stringify(e.response.data, null, 2));
            } else {
                console.log('Full Response:', e.response);
            }
        }
    }

    // A. No User (Missing required)
    await tryCreate({
        product: productId,
        quantity: 1,
        dates: {}
    }, 'Missing User');

    // B. No Product (Missing required)
    await tryCreate({
        user: userId,
        quantity: 1,
        dates: {}
    }, 'Missing Product');

    // C. No Dates (Missing required)
    await tryCreate({
        user: userId,
        product: productId,
        quantity: 1
    }, 'Missing Dates');

    // D. Valid (Should work if logic correct, but failing)
    await tryCreate({
        user: userId,
        product: productId,
        quantity: 1,
        dates: { s: 1 }
    }, 'Full Payload');
}

test();

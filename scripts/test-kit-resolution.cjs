const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    // Test WITHOUT admin auth (simulating server-side request)
    console.log('=== Testing Kit Resolution (No Auth) ===\n');

    const alexaId = '77108oucl5yw6oq';

    try {
        // Step 1: Find template
        console.log('1. Finding template for Alexa 35...');
        const template = await pb.collection('kit_templates').getFirstListItem(`main_product_id="${alexaId}"`);
        console.log('   ✓ Found:', template.name, '(', template.id, ')');

        // Step 2: Get items
        console.log('\n2. Getting kit items...');
        const items = await pb.collection('kit_items').getFullList({
            filter: `template_id="${template.id}"`
        });
        console.log('   ✓ Items:', items.length);

        // Step 3: Group by slot
        console.log('\n3. Items by slot:');
        const bySlot = {};
        items.forEach(i => {
            bySlot[i.slot_name] = (bySlot[i.slot_name] || 0) + 1;
        });
        Object.entries(bySlot).forEach(([slot, count]) => {
            console.log(`   - ${slot}: ${count}`);
        });

        // Step 4: Check recommended items
        console.log('\n4. Recommended items:');
        const recommended = items.filter(i => i.is_recommended);
        console.log('   Total recommended:', recommended.length);

        console.log('\n=== TEST PASSED ===');

    } catch (e) {
        console.log('❌ ERROR:', e.message);
        if (e.data) console.log('Details:', JSON.stringify(e.data, null, 2));
    }
}

main().catch(console.error);

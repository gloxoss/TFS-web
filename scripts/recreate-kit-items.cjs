/**
 * Recreate kit_items collection with proper schema
 */
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    console.log('=== RECREATING kit_items COLLECTION ===\n');

    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    console.log('Authenticated');

    // Get equipment and kit_templates collection IDs
    const eqCol = await pb.collections.getOne('equipment');
    const ktCol = await pb.collections.getOne('kit_templates');
    console.log('Equipment collection ID:', eqCol.id);
    console.log('kit_templates collection ID:', ktCol.id);

    // Delete existing kit_items collection
    console.log('\nDeleting old kit_items collection...');
    try {
        // First delete all records
        const oldItems = await pb.collection('kit_items').getFullList();
        console.log('Deleting', oldItems.length, 'records...');
        for (const item of oldItems) {
            await pb.collection('kit_items').delete(item.id);
        }
        // Delete the collection
        await pb.collections.delete('kit_items');
        console.log('Collection deleted');
    } catch (e) {
        console.log('Delete error:', e.message);
    }

    // Create new kit_items collection with proper schema
    console.log('\nCreating new kit_items collection...');
    const newKiCol = await pb.collections.create({
        name: 'kit_items',
        type: 'base',
        listRule: '',  // Public read
        viewRule: '',  // Public read
        createRule: null, // Admin only
        updateRule: null, // Admin only
        deleteRule: null, // Admin only
        schema: [
            { name: 'template_id', type: 'relation', required: true, options: { collectionId: ktCol.id, cascadeDelete: true, maxSelect: 1 } },
            { name: 'product_id', type: 'relation', required: true, options: { collectionId: eqCol.id, cascadeDelete: false, maxSelect: 1 } },
            { name: 'slot_name', type: 'text', required: true },
            { name: 'is_mandatory', type: 'bool' },
            { name: 'default_quantity', type: 'number' },
            { name: 'swappable_category', type: 'text' }
        ]
    });
    console.log('Created kit_items collection:', newKiCol.id);

    // Verify schema
    console.log('\nVerifying schema:');
    const verifyCol = await pb.collections.getOne('kit_items');
    verifyCol.fields?.forEach(f => console.log('  -', f.name, ':', f.type));

    console.log('\n=== DONE ===');
    console.log('Now run atomic-kit-reset.cjs to populate data');
}

main().catch(e => console.error('Error:', e.message, e.data));

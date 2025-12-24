/**
 * Settings Collection Migration Script
 * 
 * Creates the settings collection with all required fields and seeds default data.
 * Run this after deleting the settings collection from PocketBase admin.
 */
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    console.log('=== SETTINGS COLLECTION MIGRATION (DEBUG MODE) ===\n');

    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    console.log('✓ Authenticated\n');

    // Step 1: Delete existing if any
    try {
        const existing = await pb.collections.getOne('settings');
        if (existing) {
            console.log('Found existing settings, deleting...');
            await pb.collections.delete(existing.id);
            console.log('✓ Deleted');
        }
    } catch (e) {
        console.log('No existing settings found (clean slate)');
    }

    // Step 2: Create collection
    console.log('\n--- Creating settings collection ---');
    try {
        const col = await pb.collections.create({
            name: 'settings',
            type: 'base',
            listRule: '',
            viewRule: '',
            createRule: null,
            updateRule: null,
            deleteRule: null,
            fields: [
                {
                    name: 'company_name',
                    type: 'text',
                    required: false
                },
                {
                    name: 'contact_email',
                    type: 'email',
                    required: false
                },
                {
                    name: 'company_phone',
                    type: 'text',
                    required: false
                },
                {
                    name: 'company_fax',
                    type: 'text',
                    required: false
                },
                {
                    name: 'company_address',
                    type: 'text',
                    required: false
                },
                {
                    name: 'email_notifications',
                    type: 'bool',
                    required: false
                },
                {
                    name: 'new_quote_alert',
                    type: 'bool',
                    required: false
                },
                {
                    name: 'quote_status_alert',
                    type: 'bool',
                    required: false
                },
                {
                    name: 'show_prices',
                    type: 'bool',
                    required: false
                },
                {
                    name: 'maintenance_mode',
                    type: 'bool',
                    required: false
                },
                {
                    name: 'default_language',
                    type: 'text',
                    required: false
                },
                {
                    name: 'currency',
                    type: 'text',
                    required: false
                }
            ]
        });
        console.log('✓ Collection created with ID:', col.id);
        console.log('Fields count:', col.fields ? col.fields.length : (col.schema ? col.schema.length : 'UNDEFINED'));
    } catch (e) {
        console.log('✗ Creation failed:', e.message);
        if (e.data) console.log('Details:', JSON.stringify(e.data, null, 2));
        return;
    }

    // Step 3: Seed data
    console.log('\n--- Seeding data ---');
    try {
        const record = await pb.collection('settings').create({
            company_name: 'TFS - TV Film Solutions',
            contact_email: 'contact@tfs.ma',
            company_phone: '+212 522 246 372',
            company_fax: '+212 522 241 396',
            company_address: 'N°55-57, Rue Souleimane El Farissi, Ain Borja - 20330 Casablanca, Morocco',
            email_notifications: true,
            new_quote_alert: true,
            quote_status_alert: true,
            show_prices: false,
            maintenance_mode: false,
            default_language: 'en',
            currency: 'MAD'
        });
        console.log('✓ Seed record created:', record.id);

        // Verify immediately
        console.log('Record data:', JSON.stringify(record, null, 2));
    } catch (e) {
        console.log('✗ Seeding failed:', e.message);
        if (e.data) console.log('Details:', JSON.stringify(e.data, null, 2));
    }
}

main().catch(e => {
    console.error('Error:', e.message);
    if (e.data) console.error('Details:', JSON.stringify(e.data, null, 2));
});

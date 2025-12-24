/**
 * Migration Script: Cleanup Services
 * 
 * This script deactivates unwanted services and keeps only the 10 core TFS services:
 * 1. Equipment Hire
 * 2. Film Shipping
 * 3. Film Permits
 * 4. Crewing
 * 5. Scouting (Location Scouting)
 * 6. Catering
 * 7. Accommodation
 * 8. Transportation
 * 9. Casting
 * 
 * Run with: node scripts/cleanup-services.mjs
 */

const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = 'zakiossama28@gmail.com';
const ADMIN_PASSWORD = 'GloXoss123.';

// Slugs to KEEP active
const SERVICES_TO_KEEP = [
    'equipment-hire',
    'film-shipping',
    'film-permits',
    'crewing',
    'scouting',
    'catering',
    'accommodation',
    'transportation',
    'casting'
];

async function main() {
    console.log('🚀 Starting services cleanup migration...\n');

    try {
        // 1. Authenticate as admin (try both endpoints for compatibility)
        console.log('📝 Authenticating with PocketBase...');

        let token;

        // Try superusers endpoint first (PocketBase v0.23+)
        let authRes = await fetch(`${POCKETBASE_URL}/api/superusers/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!authRes.ok) {
            // Try admins endpoint (older PocketBase versions)
            authRes = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
            });
        }

        if (!authRes.ok) {
            // Try users collection auth (if admin is a user)
            authRes = await fetch(`${POCKETBASE_URL}/api/collections/users/auth-with-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD })
            });
        }

        if (!authRes.ok) {
            throw new Error(`Authentication failed: ${await authRes.text()}`);
        }

        const authData = await authRes.json();
        token = authData.token;
        console.log('✅ Authenticated successfully\n');

        // 2. Fetch all services
        console.log('📦 Fetching all services...');
        const servicesRes = await fetch(`${POCKETBASE_URL}/api/collections/services/records?perPage=100`, {
            headers: { 'Authorization': token }
        });

        if (!servicesRes.ok) {
            throw new Error(`Failed to fetch services: ${await servicesRes.text()}`);
        }

        const servicesData = await servicesRes.json();
        const services = servicesData.items;
        console.log(`📋 Found ${services.length} services\n`);

        // 3. Process each service
        let deactivated = 0;
        let kept = 0;
        const seenSlugs = new Set();

        for (const service of services) {
            const shouldKeep = SERVICES_TO_KEEP.includes(service.slug);
            const isDuplicate = seenSlugs.has(service.slug);

            if (shouldKeep && !isDuplicate) {
                // Keep this service active
                seenSlugs.add(service.slug);
                if (!service.is_active) {
                    // Activate if it was inactive
                    await updateService(token, service.id, { is_active: true });
                    console.log(`✅ ACTIVATED: ${service.title} [${service.slug}]`);
                } else {
                    console.log(`✅ KEEPING:   ${service.title} [${service.slug}]`);
                }
                kept++;
            } else {
                // Deactivate this service
                if (service.is_active) {
                    await updateService(token, service.id, { is_active: false });
                    const reason = isDuplicate ? '(duplicate)' : '(not in keep list)';
                    console.log(`❌ DEACTIVATED: ${service.title} [${service.slug}] ${reason}`);
                    deactivated++;
                } else {
                    console.log(`⏭️  ALREADY INACTIVE: ${service.title} [${service.slug}]`);
                }
            }
        }

        console.log('\n' + '═'.repeat(50));
        console.log('📊 MIGRATION COMPLETE');
        console.log('═'.repeat(50));
        console.log(`✅ Services kept active: ${kept}`);
        console.log(`❌ Services deactivated: ${deactivated}`);
        console.log('═'.repeat(50));

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

async function updateService(token, id, data) {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/services/records/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error(`Failed to update service ${id}: ${await res.text()}`);
    }

    return res.json();
}

main();

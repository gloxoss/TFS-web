'use strict';

/**
 * Seed script for Production Services
 * Run with: node scripts/seed-services.js
 */

require('dotenv').config();
const PocketBase = require('pocketbase/cjs');

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

const SERVICES = [
    {
        slug: 'sporting-events',
        title: 'Sporting Events',
        title_fr: 'Événements Sportifs',
        brief_description: 'Dynamic and immersive broadcasts for major competitions (CAN, World Cup).',
        brief_description_fr: 'Diffusions dynamiques et immersives pour les grandes compétitions (CAN, Coupe du Monde).',
        type: 'content_page',
        display_order: 1,
        is_active: true
    },
    {
        slug: 'film-production',
        title: 'Film Production',
        title_fr: 'Production Cinématographique',
        brief_description: 'Executive production services with state-of-the-art camera and lighting fleets.',
        brief_description_fr: 'Services de production exécutive avec des parcs caméras et éclairages de pointe.',
        type: 'content_page',
        display_order: 2,
        is_active: true
    },
    {
        slug: 'tv-recording',
        title: 'TV Recording',
        title_fr: 'Enregistrement TV',
        brief_description: 'High-quality capabilities for television works, sitcoms, and series.',
        brief_description_fr: 'Capacités de haute qualité pour les œuvres télévisées, sitcoms et séries.',
        type: 'content_page',
        display_order: 3,
        is_active: true
    },
    {
        slug: 'live-events',
        title: 'Live Events & Festivals',
        title_fr: 'Événements Live & Festivals',
        brief_description: 'Visual expertise for cultural events like Mawazine and live performances.',
        brief_description_fr: 'Expertise visuelle pour événements culturels comme Mawazine et spectacles live.',
        type: 'content_page',
        display_order: 4,
        is_active: true
    },
    {
        slug: 'studio-infrastructure',
        title: 'Studio Infrastructure',
        title_fr: 'Infrastructure Studio',
        brief_description: 'Fully equipped TV studio with soundproofing and innovative decor services.',
        brief_description_fr: 'Studio TV entièrement équipé avec insonorisation et services de décor innovants.',
        type: 'content_page',
        display_order: 5,
        is_active: true
    },
    {
        slug: 'ob-vans',
        title: 'OB Vans & Mobile Units',
        title_fr: 'Cars Régie & Unités Mobiles',
        brief_description: 'Mobile recording setups offering maximum flexibility for any event.',
        brief_description_fr: 'Configurations d\'enregistrement mobiles offrant une flexibilité maximale.',
        type: 'content_page',
        display_order: 6,
        is_active: true
    },
    {
        slug: 'consulting-design',
        title: 'Consulting & Design',
        title_fr: 'Conseil & Design',
        brief_description: 'Technical consulting and audiovisual design for complex projects.',
        brief_description_fr: 'Conseil technique et design audiovisuel pour projets complexes.',
        type: 'content_page',
        display_order: 7,
        is_active: true
    },
    {
        slug: 'post-production',
        title: 'Post-Production',
        title_fr: 'Post-Production',
        brief_description: 'Advanced solutions for editing, color grading, and enhancement.',
        brief_description_fr: 'Solutions avancées pour montage, étalonnage et amélioration.',
        type: 'content_page',
        display_order: 8,
        is_active: true
    },
    {
        slug: 'equipment-rental',
        title: 'Equipment Rental',
        title_fr: 'Location de Matériel',
        brief_description: 'The largest technical fleet in the region: cameras, lenses, and lighting.',
        brief_description_fr: 'Le plus grand parc technique de la région : caméras, optiques et éclairages.',
        type: 'content_page',
        display_order: 9,
        is_active: true
    },
    {
        slug: 'digital-storage',
        title: 'Digital & Storage',
        title_fr: 'Digital & Stockage',
        brief_description: 'Secure storage and digital transmission solutions for large-scale media.',
        brief_description_fr: 'Solutions de stockage sécurisé et transmission numérique pour médias à grande échelle.',
        type: 'content_page',
        display_order: 10,
        is_active: true
    }
];

async function seedServices() {
    const pb = new PocketBase(PB_URL);

    try {
        // Authenticate as admin
        console.log('Authenticating as admin...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('Authenticated successfully!');

        // Seed services
        console.log('\nSeeding services...');
        for (const service of SERVICES) {
            try {
                // Check if service already exists
                const existing = await pb.collection('services').getFirstListItem(`slug="${service.slug}"`).catch(() => null);

                if (existing) {
                    console.log(`  - Updating: ${service.title}`);
                    await pb.collection('services').update(existing.id, service);
                } else {
                    console.log(`  - Creating: ${service.title}`);
                    await pb.collection('services').create(service);
                }
            } catch (err) {
                console.error(`  ✗ Failed to create/update ${service.title}:`, err.message);
            }
        }

        console.log('\n✓ Services seeded successfully!');
    } catch (error) {
        console.error('Error seeding services:', error.message);
        process.exit(1);
    }
}

seedServices();

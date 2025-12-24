/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Seed Services Collection
 * 
 * Populates the 10 service items for the homepage grid.
 * 5 items link to /equipment, 5 items are content pages.
 */

migrate((app) => {
    console.log('[Seed] Starting services seed...');

    const servicesCollection = app.findCollectionByNameOrId('services');
    if (!servicesCollection) {
        console.log('[Seed] Services collection not found, skipping seed.');
        return;
    }

    const services = [
        // Row 1: Equipment-related services (links to /equipment)
        {
            title: 'Camera Rental',
            title_fr: 'Location de Caméras',
            slug: 'camera-rental',
            brief_description: 'Professional cinema cameras for your production',
            brief_description_fr: 'Caméras cinéma professionnelles pour votre production',
            type: 'internal_link',
            target_url: '/equipment?category=cameras',
            display_order: 1,
            is_active: true,
        },
        {
            title: 'Lighting Equipment',
            title_fr: 'Équipement d\'Éclairage',
            slug: 'lighting-equipment',
            brief_description: 'LED panels, HMIs, and professional lighting gear',
            brief_description_fr: 'Panneaux LED, HMIs et équipement d\'éclairage professionnel',
            type: 'internal_link',
            target_url: '/equipment?category=lighting',
            display_order: 2,
            is_active: true,
        },
        {
            title: 'Grip & Support',
            title_fr: 'Machinerie & Support',
            slug: 'grip-support',
            brief_description: 'Tripods, dollies, cranes and rigging solutions',
            brief_description_fr: 'Trépieds, chariots, grues et solutions de rigging',
            type: 'internal_link',
            target_url: '/equipment?category=grip',
            display_order: 3,
            is_active: true,
        },
        {
            title: 'Audio Equipment',
            title_fr: 'Équipement Audio',
            slug: 'audio-equipment',
            brief_description: 'Microphones, recorders, and wireless systems',
            brief_description_fr: 'Microphones, enregistreurs et systèmes sans fil',
            type: 'internal_link',
            target_url: '/equipment?category=audio',
            display_order: 4,
            is_active: true,
        },
        {
            title: 'Lens Collection',
            title_fr: 'Collection d\'Objectifs',
            slug: 'lens-collection',
            brief_description: 'Cinema primes, zooms, and specialty lenses',
            brief_description_fr: 'Objectifs cinéma fixes, zooms et objectifs spéciaux',
            type: 'internal_link',
            target_url: '/equipment?category=lenses',
            display_order: 5,
            is_active: true,
        },

        // Row 2: Production services (content pages)
        {
            title: 'Full Production',
            title_fr: 'Production Complète',
            slug: 'full-production',
            brief_description: 'End-to-end production services in Morocco',
            brief_description_fr: 'Services de production de A à Z au Maroc',
            full_description: '<h2>Full Production Services</h2><p>We offer comprehensive production support throughout Morocco. From pre-production planning to final delivery, our team handles every aspect of your shoot.</p>',
            full_description_fr: '<h2>Services de Production Complète</h2><p>Nous offrons un support de production complet à travers le Maroc. De la pré-production à la livraison finale, notre équipe gère tous les aspects de votre tournage.</p>',
            type: 'content_page',
            display_order: 6,
            is_active: true,
        },
        {
            title: 'Location Scouting',
            title_fr: 'Repérage de Lieux',
            slug: 'location-scouting',
            brief_description: 'Discover Morocco\'s most stunning filming locations',
            brief_description_fr: 'Découvrez les plus beaux lieux de tournage du Maroc',
            full_description: '<h2>Location Scouting</h2><p>Morocco offers diverse landscapes from ancient medinas to sweeping deserts. Our local experts will find the perfect location for your vision.</p>',
            full_description_fr: '<h2>Repérage de Lieux</h2><p>Le Maroc offre des paysages variés, des médinas anciennes aux vastes déserts. Nos experts locaux trouveront le lieu parfait pour votre vision.</p>',
            type: 'content_page',
            display_order: 7,
            is_active: true,
        },
        {
            title: 'Crew & Talent',
            title_fr: 'Équipe & Talents',
            slug: 'crew-talent',
            brief_description: 'Local crew, fixers, and production talent',
            brief_description_fr: 'Équipes locales, fixeurs et talents de production',
            full_description: '<h2>Crew & Talent Services</h2><p>Access our network of experienced Moroccan film professionals. From camera operators to production assistants, we connect you with the best talent.</p>',
            full_description_fr: '<h2>Services Équipe & Talents</h2><p>Accédez à notre réseau de professionnels du cinéma marocain. Des cadreurs aux assistants de production, nous vous connectons aux meilleurs talents.</p>',
            type: 'content_page',
            display_order: 8,
            is_active: true,
        },
        {
            title: 'Permits & Logistics',
            title_fr: 'Autorisations & Logistique',
            slug: 'permits-logistics',
            brief_description: 'Filming permits, transport, and coordination',
            brief_description_fr: 'Permis de tournage, transport et coordination',
            full_description: '<h2>Permits & Logistics</h2><p>Navigate Morocco\'s filming requirements with ease. We handle all permit applications, location agreements, and logistical coordination.</p>',
            full_description_fr: '<h2>Autorisations & Logistique</h2><p>Naviguez facilement dans les exigences de tournage au Maroc. Nous gérons toutes les demandes d\'autorisation et la coordination logistique.</p>',
            type: 'content_page',
            display_order: 9,
            is_active: true,
        },
        {
            title: 'Post-Production',
            title_fr: 'Post-Production',
            slug: 'post-production',
            brief_description: 'Editing suites, color grading, and finishing',
            brief_description_fr: 'Suites de montage, étalonnage et finition',
            full_description: '<h2>Post-Production Services</h2><p>Complete your project with our state-of-the-art editing facilities. We offer DaVinci Resolve color grading, sound design, and final delivery in any format.</p>',
            full_description_fr: '<h2>Services de Post-Production</h2><p>Terminez votre projet avec nos installations de montage de pointe. Nous offrons l\'étalonnage DaVinci Resolve, le sound design et la livraison finale.</p>',
            type: 'content_page',
            display_order: 10,
            is_active: true,
        },
    ];

    for (const service of services) {
        try {
            // Check if already exists
            let existing;
            try {
                existing = app.findRecordsByFilter(servicesCollection, `slug = "${service.slug}"`, '', 1);
            } catch {
                existing = [];
            }

            if (existing && existing.length > 0) {
                console.log(`[Seed] Service "${service.title}" already exists, skipping...`);
                continue;
            }

            const record = new Record(servicesCollection);
            record.set('title', service.title);
            record.set('title_fr', service.title_fr);
            record.set('slug', service.slug);
            record.set('brief_description', service.brief_description);
            record.set('brief_description_fr', service.brief_description_fr);
            record.set('full_description', service.full_description || '');
            record.set('full_description_fr', service.full_description_fr || '');
            record.set('type', service.type);
            record.set('target_url', service.target_url || '');
            record.set('display_order', service.display_order);
            record.set('is_active', service.is_active);

            app.save(record);
            console.log(`[Seed] Created service: ${service.title}`);
        } catch (e) {
            console.error(`[Seed] Error creating service ${service.title}:`, e);
        }
    }

    console.log('[Seed] Services seed complete!');

}, (app) => {
    // Rollback: Do nothing (preserve data)
    console.log('[Seed] Rollback - No action taken');
});

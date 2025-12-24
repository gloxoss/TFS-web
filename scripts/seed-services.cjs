/**
 * TFS Services Seed Script v2
 * 
 * Creates services for TFS with full structured content:
 * - sections (image/text blocks)
 * - stats
 * - features
 * - tags
 * 
 * Usage: POCKETBASE_URL=http://72.62.27.47:8090 node scripts/seed-services.cjs
 */
const PocketBase = require('pocketbase/cjs');
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
console.log(`Connecting to PocketBase at: ${POCKETBASE_URL}`);
const pb = new PocketBase(POCKETBASE_URL);

// Stock images for services (placeholder URLs)
const STOCK_IMAGES = {
    equipment: 'https://images.unsplash.com/photo-1540655037529-dec987208707?q=80&w=1200&auto=format&fit=crop',
    shipping: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    permits: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop',
    crew: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    scouting: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=1200&auto=format&fit=crop',
    catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
    hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    transport: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
    casting: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?q=80&w=1200&auto=format&fit=crop',
    morocco: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1200&auto=format&fit=crop',
    warehouse: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop',
    office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
};

const SERVICES = [
    {
        slug: 'equipment-hire',
        title: 'Equipment Hire',
        title_fr: 'Location d\'Équipement',
        brief_description: 'Professional cinema equipment rental including cameras, lenses, lighting, grip, and accessories from top brands like ARRI, Sony, and RED.',
        brief_description_fr: 'Location d\'équipement cinématographique professionnel incluant caméras, objectifs, éclairage et accessoires.',
        full_description: 'Access our comprehensive inventory of professional cinema equipment.',
        full_description_fr: 'Accédez à notre inventaire complet d\'équipement cinématographique professionnel.',
        type: 'internal_link',
        target_url: '/equipment',
        display_order: 1,
        is_active: true,
        stats: JSON.stringify([
            { value: '500+', label: 'Equipment Items', labelFr: 'Équipements' },
            { value: '24/7', label: 'Support', labelFr: 'Assistance' },
            { value: '15+', label: 'Years Experience', labelFr: 'Ans d\'Expérience' },
        ]),
        tags: JSON.stringify(['ARRI', 'Sony', 'RED', 'Cameras', 'Lenses', 'Lighting', 'Grip']),
        features: JSON.stringify([
            { title: 'Premium Cameras', titleFr: 'Caméras Premium', description: 'ARRI Alexa, Sony Venice, RED Komodo and more', descriptionFr: 'ARRI Alexa, Sony Venice, RED Komodo et plus' },
            { title: 'Expert Support', titleFr: 'Support Expert', description: 'Technicians available for setup and troubleshooting', descriptionFr: 'Techniciens disponibles pour l\'installation et le dépannage' },
            { title: 'Flexible Packages', titleFr: 'Forfaits Flexibles', description: 'Daily, weekly, or production-length rentals', descriptionFr: 'Locations journalières, hebdomadaires ou pour la durée de production' },
        ]),
    },
    {
        slug: 'film-shipping',
        title: 'Film Solutions (Shipping)',
        title_fr: 'Solutions Film (Expédition)',
        brief_description: 'Professional shipping and customs clearance for film equipment. Experienced coordinators handling port and airport clearance with full compliance.',
        brief_description_fr: 'Expédition professionnelle et dédouanement pour équipements de tournage.',
        full_description: 'Our production shipping division ensures your equipment arrives safely.',
        full_description_fr: 'Notre division d\'expédition garantit que votre équipement arrive en toute sécurité.',
        type: 'content_page',
        display_order: 2,
        is_active: true,
        sections: JSON.stringify([
            {
                type: 'text_image',
                layout: 'right',
                title: 'Expert Customs Handling',
                titleFr: 'Gestion Experte des Douanes',
                content: '<p>Our production shipping division is managed by experienced coordinators with strong backgrounds in servicing major international film productions.</p><p>Equipment customs clearance is handled smoothly and efficiently thanks to our specialized team that supervises the entire process.</p>',
                contentFr: '<p>Notre division d\'expédition est gérée par des coordinateurs expérimentés au service des grandes productions internationales.</p>',
                image: STOCK_IMAGES.shipping,
            },
            {
                type: 'text_image',
                layout: 'left',
                title: 'Port & Airport Clearance',
                titleFr: 'Dédouanement Portuaire & Aéroportuaire',
                content: '<p>We work closely with local governmental authorities and trusted customs clearance partners to ensure fast and secure clearance.</p><p>This includes sensitive shipments such as filming equipment, vehicles, and regulated materials.</p>',
                contentFr: '<p>Nous travaillons en étroite collaboration avec les autorités locales pour un dédouanement rapide et sécurisé.</p>',
                image: STOCK_IMAGES.warehouse,
            },
        ]),
        stats: JSON.stringify([
            { value: '100%', label: 'Clearance Rate', labelFr: 'Taux de Dédouanement' },
            { value: '48h', label: 'Average Processing', labelFr: 'Délai Moyen' },
            { value: '200+', label: 'Productions Served', labelFr: 'Productions Servies' },
        ]),
        tags: JSON.stringify(['Customs', 'ATA Carnet', 'Shipping', 'Logistics', 'Airport', 'Port']),
        features: JSON.stringify([
            { title: 'ATA Carnet Processing', titleFr: 'Traitement Carnet ATA', description: 'Full documentation and compliance handling', descriptionFr: 'Documentation complète et conformité' },
            { title: 'Door-to-Door Service', titleFr: 'Service Porte-à-Porte', description: 'From your location to set in Morocco', descriptionFr: 'De votre emplacement au plateau au Maroc' },
            { title: 'Insurance Coordination', titleFr: 'Coordination Assurance', description: 'Full coverage options for valuable equipment', descriptionFr: 'Options de couverture complète' },
            { title: 'Real-Time Tracking', titleFr: 'Suivi en Temps Réel', description: 'Know where your equipment is at all times', descriptionFr: 'Sachez où se trouve votre équipement' },
        ]),
    },
    {
        slug: 'film-permits',
        title: 'Film Permits',
        title_fr: 'Permis de Tournage',
        brief_description: 'Strong relationships with Moroccan authorities and the CCM. We ensure all permits are obtained on time.',
        brief_description_fr: 'Relations solides avec les autorités marocaines et le CCM.',
        full_description: 'Seamless permit acquisition for productions of any scale.',
        full_description_fr: 'Obtention fluide des permis pour des productions de toute taille.',
        type: 'content_page',
        display_order: 3,
        is_active: true,
        sections: JSON.stringify([
            {
                type: 'text_image',
                layout: 'right',
                title: 'CCM Partnership',
                titleFr: 'Partenariat CCM',
                content: '<p>TFS maintains strong relationships with the Centre Cinématographique Marocain (CCM), the official body responsible for regulating film production in Morocco.</p><p>The CCM facilitates filming authorizations regardless of project complexity.</p>',
                contentFr: '<p>TFS entretient des relations solides avec le Centre Cinématographique Marocain (CCM).</p>',
                image: STOCK_IMAGES.permits,
            },
            {
                type: 'text_image',
                layout: 'left',
                title: 'Proactive Coordination',
                titleFr: 'Coordination Proactive',
                content: '<p>Through constant coordination and proactive communication, TFS ensures that all permits are obtained on time, allowing productions to move forward smoothly.</p>',
                contentFr: '<p>Grâce à une coordination constante, TFS s\'assure que tous les permis sont obtenus à temps.</p>',
                image: STOCK_IMAGES.office,
            },
        ]),
        stats: JSON.stringify([
            { value: '100%', label: 'Approval Rate', labelFr: 'Taux d\'Approbation' },
            { value: '72h', label: 'Fast Track Available', labelFr: 'Option Express' },
        ]),
        tags: JSON.stringify(['CCM', 'Permits', 'Government', 'Authorization', 'Compliance']),
        features: JSON.stringify([
            { title: 'All Location Types', titleFr: 'Tous Types de Lieux', description: 'Public spaces, private property, restricted areas', descriptionFr: 'Espaces publics, propriétés privées, zones restreintes' },
            { title: 'Multi-Department Liaison', titleFr: 'Liaison Multi-Départements', description: 'Single point of contact for all approvals', descriptionFr: 'Point de contact unique pour toutes les approbations' },
            { title: 'Fast Track Processing', titleFr: 'Traitement Express', description: 'Expedited options for urgent productions', descriptionFr: 'Options accélérées pour productions urgentes' },
        ]),
    },
    {
        slug: 'crewing',
        title: 'Crewing',
        title_fr: 'Équipes Techniques',
        brief_description: 'Access to highly skilled technicians and multilingual production professionals.',
        brief_description_fr: 'Accès à des techniciens qualifiés et des professionnels multilingues.',
        full_description: 'Professional local crew for international productions.',
        full_description_fr: 'Équipes locales professionnelles pour productions internationales.',
        type: 'content_page',
        display_order: 4,
        is_active: true,
        sections: JSON.stringify([
            {
                type: 'text_image',
                layout: 'right',
                title: 'Multilingual Professionals',
                titleFr: 'Professionnels Multilingues',
                content: '<p>Our multilingual crews enable seamless collaboration in multicultural environments, ensuring clear communication on set.</p><p>We carefully select the best local talent to match each project\'s creative and technical requirements.</p>',
                contentFr: '<p>Nos équipes multilingues permettent une collaboration fluide dans des environnements multiculturels.</p>',
                image: STOCK_IMAGES.crew,
            },
        ]),
        stats: JSON.stringify([
            { value: '300+', label: 'Crew Network', labelFr: 'Réseau de Techniciens' },
            { value: '5', label: 'Languages Spoken', labelFr: 'Langues Parlées' },
        ]),
        tags: JSON.stringify(['Camera', 'Grip', 'Electric', 'Sound', 'Art Department', 'Production']),
        features: JSON.stringify([
            { title: 'Camera Department', titleFr: 'Département Caméra', description: 'DOPs, operators, assistants, DITs', descriptionFr: 'Directeurs photo, opérateurs, assistants, DITs' },
            { title: 'Grip & Electric', titleFr: 'Machino & Électrique', description: 'Gaffers, grips, rigging specialists', descriptionFr: 'Chefs électro, machinistes, spécialistes rigging' },
            { title: 'Production Staff', titleFr: 'Personnel de Production', description: 'ADs, coordinators, production managers', descriptionFr: 'ADs, coordinateurs, directeurs de production' },
        ]),
    },
    {
        slug: 'location-scouting',
        title: 'Scouting',
        title_fr: 'Repérage',
        brief_description: 'Curated location selection matching your creative vision.',
        brief_description_fr: 'Sélection de lieux correspondant à votre vision créative.',
        full_description: 'Access our comprehensive photo library of Moroccan locations.',
        full_description_fr: 'Accédez à notre bibliothèque photo complète de lieux marocains.',
        type: 'content_page',
        display_order: 5,
        is_active: true,
        sections: JSON.stringify([
            {
                type: 'text_image',
                layout: 'right',
                title: 'Extensive Location Library',
                titleFr: 'Bibliothèque Étendue de Lieux',
                content: '<p>After reviewing the screenplay and understanding the creative vision, TFS presents a curated selection of locations that best match the project\'s needs.</p><p>Access our comprehensive photo library showcasing Morocco\'s most iconic filming locations.</p>',
                contentFr: '<p>Après examen du scénario, TFS présente une sélection de lieux correspondant aux besoins du projet.</p>',
                image: STOCK_IMAGES.scouting,
            },
            {
                type: 'text_image',
                layout: 'left',
                title: 'Diverse Landscapes',
                titleFr: 'Paysages Diversifiés',
                content: '<p>From ancient medinas to modern cities, desert dunes to mountain ranges, Morocco offers unparalleled visual diversity for any production.</p>',
                contentFr: '<p>Des médinas anciennes aux villes modernes, des dunes du désert aux chaînes de montagnes.</p>',
                image: STOCK_IMAGES.morocco,
            },
        ]),
        stats: JSON.stringify([
            { value: '1000+', label: 'Locations Catalogued', labelFr: 'Lieux Catalogués' },
            { value: '12', label: 'Regions Covered', labelFr: 'Régions Couvertes' },
        ]),
        tags: JSON.stringify(['Desert', 'Medina', 'Mountains', 'Beach', 'Modern', 'Historical']),
        features: JSON.stringify([
            { title: 'Virtual Scouts', titleFr: 'Repérages Virtuels', description: 'High-res photos and video for remote review', descriptionFr: 'Photos et vidéos haute résolution pour examen à distance' },
            { title: 'Technical Reports', titleFr: 'Rapports Techniques', description: 'Power, access, permits, and logistics info', descriptionFr: 'Infos sur l\'alimentation, l\'accès, les permis et la logistique' },
            { title: 'Custom Scouting', titleFr: 'Repérage Personnalisé', description: 'On-the-ground surveys for specific needs', descriptionFr: 'Enquêtes sur le terrain pour besoins spécifiques' },
        ]),
    },
    {
        slug: 'catering',
        title: 'Catering',
        title_fr: 'Restauration',
        brief_description: 'Reliable catering led by professional chefs with focus on quality and hygiene.',
        brief_description_fr: 'Restauration fiable dirigée par des chefs professionnels.',
        full_description: 'Fresh ingredients, set menus, craft services, and customized meal plans.',
        full_description_fr: 'Ingrédients frais, menus, craft services et plans de repas personnalisés.',
        type: 'content_page',
        display_order: 6,
        is_active: true,
        sections: JSON.stringify([
            {
                type: 'text_image',
                layout: 'right',
                title: 'Professional Chefs',
                titleFr: 'Chefs Professionnels',
                content: '<p>TFS offers reliable and cost-effective catering services led by professionally trained chefs with strong focus on hygiene, food safety, and quality.</p><p>Ingredients are sourced daily from local markets to ensure fresh, natural, and high-quality meals.</p>',
                contentFr: '<p>TFS offre des services de restauration fiables dirigés par des chefs formés professionnellement.</p>',
                image: STOCK_IMAGES.catering,
            },
        ]),
        stats: JSON.stringify([
            { value: '500+', label: 'Meals Daily Capacity', labelFr: 'Capacité Repas/Jour' },
            { value: '100%', label: 'Fresh Ingredients', labelFr: 'Ingrédients Frais' },
        ]),
        tags: JSON.stringify(['Craft Services', 'Set Meals', 'Dietary Options', 'Fresh']),
        features: JSON.stringify([
            { title: 'Set Menus', titleFr: 'Menus du Jour', description: 'Breakfast, lunch, dinner options', descriptionFr: 'Options petit-déjeuner, déjeuner, dîner' },
            { title: 'Craft Services', titleFr: 'Craft Services', description: 'All-day snacks and refreshments', descriptionFr: 'Collations et rafraîchissements toute la journée' },
            { title: 'Special Diets', titleFr: 'Régimes Spéciaux', description: 'Vegetarian, vegan, halal, kosher, allergies', descriptionFr: 'Végétarien, végan, halal, casher, allergies' },
        ]),
    },
    {
        slug: 'accommodation',
        title: 'Accommodation',
        title_fr: 'Hébergement',
        brief_description: 'Hotel bookings and travel logistics with preferential rates.',
        brief_description_fr: 'Réservations d\'hôtels et logistique de voyage.',
        full_description: 'From luxury hotels to boutique guesthouses across Morocco.',
        full_description_fr: 'Des hôtels de luxe aux maisons d\'hôtes boutique.',
        type: 'content_page',
        display_order: 7,
        is_active: true,
        sections: JSON.stringify([
            {
                type: 'text_image',
                layout: 'right',
                title: 'Premium Partnerships',
                titleFr: 'Partenariats Premium',
                content: '<p>TFS arranges accommodations ranging from luxury hotels to boutique guesthouses and private villas across Morocco.</p><p>Thanks to long-standing partnerships, we secure preferential rates offering significant cost savings.</p>',
                contentFr: '<p>TFS organise des hébergements allant des hôtels de luxe aux maisons d\'hôtes boutique.</p>',
                image: STOCK_IMAGES.hotel,
            },
        ]),
        stats: JSON.stringify([
            { value: '50+', label: 'Partner Hotels', labelFr: 'Hôtels Partenaires' },
            { value: '20%', label: 'Average Savings', labelFr: 'Économies Moyennes' },
        ]),
        tags: JSON.stringify(['Luxury', 'Boutique', 'Budget', 'Villas', 'Riads']),
        features: JSON.stringify([
            { title: 'All Budget Levels', titleFr: 'Tous Budgets', description: 'From backpacker to 5-star luxury', descriptionFr: 'Du routard au luxe 5 étoiles' },
            { title: 'Group Bookings', titleFr: 'Réservations de Groupe', description: 'Block bookings for large crews', descriptionFr: 'Réservations groupées pour grandes équipes' },
            { title: 'Extended Stays', titleFr: 'Séjours Prolongés', description: 'Special rates for long productions', descriptionFr: 'Tarifs spéciaux pour productions longues' },
        ]),
    },
    {
        slug: 'transportation',
        title: 'Transportation',
        title_fr: 'Transport',
        brief_description: 'Dependable and budget-efficient transportation solutions.',
        brief_description_fr: 'Solutions de transport fiables et économiques.',
        full_description: 'Diverse vehicle fleet adapted to production needs.',
        full_description_fr: 'Flotte de véhicules diversifiée adaptée aux besoins de production.',
        type: 'content_page',
        display_order: 8,
        is_active: true,
        sections: JSON.stringify([
            {
                type: 'text_image',
                layout: 'right',
                title: 'Comprehensive Fleet',
                titleFr: 'Flotte Complète',
                content: '<p>TFS provides dependable and budget-efficient transportation solutions for film productions of all sizes.</p><p>Our experience allows us to organize ground and air transport under optimal conditions.</p>',
                contentFr: '<p>TFS fournit des solutions de transport fiables pour les productions de toutes tailles.</p>',
                image: STOCK_IMAGES.transport,
            },
        ]),
        stats: JSON.stringify([
            { value: '100+', label: 'Vehicles', labelFr: 'Véhicules' },
            { value: '24/7', label: 'Availability', labelFr: 'Disponibilité' },
        ]),
        tags: JSON.stringify(['Vans', 'Trucks', 'SUVs', 'Picture Cars', 'Airport Transfers']),
        features: JSON.stringify([
            { title: 'Crew Transport', titleFr: 'Transport Équipes', description: 'Comfortable vehicles for cast and crew', descriptionFr: 'Véhicules confortables pour acteurs et équipes' },
            { title: 'Equipment Trucks', titleFr: 'Camions Équipement', description: 'Secure transport for valuable gear', descriptionFr: 'Transport sécurisé pour équipement précieux' },
            { title: 'Picture Vehicles', titleFr: 'Véhicules de Tournage', description: 'Camera cars, process trailers, inserts', descriptionFr: 'Voitures caméra, remorques, inserts' },
        ]),
    },
    {
        slug: 'casting',
        title: 'Casting',
        title_fr: 'Casting',
        brief_description: 'Access to diverse talent pool reflecting Morocco\'s rich cultural heritage.',
        brief_description_fr: 'Accès à un vivier de talents diversifié.',
        full_description: 'Professional actors, stunt performers, models, and extras.',
        full_description_fr: 'Acteurs professionnels, cascadeurs, mannequins et figurants.',
        type: 'content_page',
        display_order: 9,
        is_active: true,
        sections: JSON.stringify([
            {
                type: 'text_image',
                layout: 'right',
                title: 'Diverse Talent Pool',
                titleFr: 'Vivier de Talents Diversifié',
                content: '<p>Morocco\'s rich history and cultural diversity make it exceptional for international casting.</p><p>The country offers a wide range of looks reflecting influences from Europe, the Middle East, Africa, and beyond.</p>',
                contentFr: '<p>L\'histoire riche du Maroc en fait une destination exceptionnelle pour le casting international.</p>',
                image: STOCK_IMAGES.casting,
            },
        ]),
        stats: JSON.stringify([
            { value: '1000+', label: 'Talent Database', labelFr: 'Base de Talents' },
            { value: '50+', label: 'Productions Cast', labelFr: 'Productions Castées' },
        ]),
        tags: JSON.stringify(['Actors', 'Extras', 'Stunt', 'Models', 'Specialty Acts']),
        features: JSON.stringify([
            { title: 'Professional Actors', titleFr: 'Acteurs Professionnels', description: 'Experienced talent for speaking roles', descriptionFr: 'Talents expérimentés pour rôles parlants' },
            { title: 'Background Artists', titleFr: 'Figurants', description: 'Large pool for crowd scenes', descriptionFr: 'Grand vivier pour scènes de foule' },
            { title: 'Specialty Performers', titleFr: 'Artistes Spécialisés', description: 'Stunt, martial arts, dance, music', descriptionFr: 'Cascades, arts martiaux, danse, musique' },
        ]),
    },
];

async function main() {
    console.log('=== TFS SERVICES SEEDING v2 ===\n');

    const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'zakiossama28@gmail.com';
    const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'GloXoss123.';

    await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
    console.log('✓ Authenticated\n');

    // Delete existing services
    console.log('--- Cleaning existing services ---');
    try {
        const existing = await pb.collection('services').getFullList();
        console.log(`Deleting ${existing.length} existing services...`);
        for (const s of existing) {
            await pb.collection('services').delete(s.id);
        }
        console.log('✓ Cleaned');
    } catch (e) {
        console.log('  Cleanup error:', e.message);
    }

    // Create new services
    console.log('\n--- Creating TFS services with structured content ---');
    let created = 0;
    for (const service of SERVICES) {
        try {
            await pb.collection('services').create(service);
            console.log(`✓ ${service.title}`);
            created++;
        } catch (e) {
            console.log(`✗ ${service.title}: ${e.message}`);
            if (e.data) console.log('  Details:', JSON.stringify(e.data, null, 2));
        }
    }

    console.log(`\n=== COMPLETE: ${created}/${SERVICES.length} services created ===`);

    // Verify
    const final = await pb.collection('services').getFullList({ sort: 'display_order' });
    console.log('\nServices in DB:');
    final.forEach(s => {
        const hasStructured = s.sections || s.stats || s.features;
        console.log(`  ${s.display_order}. ${s.title} (${s.type}) ${hasStructured ? '✓ structured' : ''}`);
    });
}

main().catch(e => {
    console.error('Error:', e.message);
    if (e.data) console.error('Details:', JSON.stringify(e.data, null, 2));
});

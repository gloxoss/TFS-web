'use strict';

/**
 * Seed script for Production Services (Updated Dec 2025)
 * Run with: node scripts/seed-services.js
 * 
 * This script seeds the local PocketBase database.
 * For hosted, change PB_URL or run with: PB_URL=https://your-hosted-url node scripts/seed-services.js
 */

require('dotenv').config();
const PocketBase = require('pocketbase/cjs');

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

const SERVICES = [
    // ===== PRODUCTION SERVICES =====
    {
        slug: 'equipment-hire',
        title: 'Equipment Hire',
        title_fr: 'Location de Matériel',
        brief_description: 'The largest technical fleet in the region: cameras, lenses, lighting, grip, and audio equipment.',
        brief_description_fr: 'Le plus grand parc technique de la région : caméras, optiques, éclairages, grip et matériel audio.',
        full_description: `TFS offers the most comprehensive equipment rental service in Morocco, featuring an extensive fleet of professional cinema and broadcast gear.

Our inventory includes industry-leading cameras from ARRI, RED, Sony, and Blackmagic, along with premium lenses from Cooke, Zeiss, and Panavision. We also provide complete lighting packages, grip equipment, audio gear, and specialized accessories for any production scale.

Whether you're shooting a feature film, commercial, documentary, or live event, our technical team ensures you have the right tools for your creative vision.`,
        full_description_fr: `TFS offre le service de location d'équipement le plus complet au Maroc, avec une flotte étendue d'équipements professionnels de cinéma et de diffusion.

Notre inventaire comprend des caméras de pointe d'ARRI, RED, Sony et Blackmagic, ainsi que des objectifs premium de Cooke, Zeiss et Panavision. Nous fournissons également des packages d'éclairage complets, du matériel grip, de l'équipement audio et des accessoires spécialisés pour toute échelle de production.

Que vous tourniez un long métrage, une publicité, un documentaire ou un événement live, notre équipe technique s'assure que vous disposez des bons outils pour votre vision créative.`,
        type: 'internal_link',
        target_url: '/equipment',
        display_order: 1,
        is_active: true
    },
    {
        slug: 'film-shipping',
        title: 'Film Shipping',
        title_fr: 'Expédition Film',
        brief_description: 'Equipment customs clearance handled smoothly by our specialized coordination team.',
        brief_description_fr: 'Dédouanement d\'équipement géré en douceur par notre équipe de coordination spécialisée.',
        full_description: `Our production shipping division is managed by highly experienced and detail-oriented coordinators with a strong background in servicing major international film productions.

At TFS, equipment customs clearance is handled smoothly and efficiently thanks to our specialized team that supervises the entire process from start to finish.

We work closely with local governmental authorities and trusted customs clearance partners to ensure fast and secure port and airport clearance. This includes sensitive shipments such as filming equipment, vehicles, and regulated materials, all handled with strict compliance and professionalism.`,
        full_description_fr: `Notre division d'expédition de production est gérée par des coordinateurs très expérimentés et soucieux du détail, avec une solide expérience dans le service des grandes productions cinématographiques internationales.

Chez TFS, le dédouanement des équipements est géré de manière fluide et efficace grâce à notre équipe spécialisée qui supervise l'ensemble du processus du début à la fin.

Nous travaillons en étroite collaboration avec les autorités gouvernementales locales et des partenaires de dédouanement de confiance pour assurer un dédouanement portuaire et aéroportuaire rapide et sécurisé. Cela inclut les envois sensibles tels que les équipements de tournage, les véhicules et les matériaux réglementés, tous traités avec une conformité stricte et un professionnalisme.`,
        type: 'content_page',
        display_order: 2,
        is_active: true
    },
    {
        slug: 'film-permits',
        title: 'Film Permits',
        title_fr: 'Permis de Tournage',
        brief_description: 'Strong relationships with Moroccan authorities for smooth filming authorizations.',
        brief_description_fr: 'Relations solides avec les autorités marocaines pour des autorisations de tournage fluides.',
        full_description: `TFS maintains strong and reliable relationships with Moroccan authorities, particularly the Centre Cinématographique Marocain (CCM), the official body responsible for regulating film production in Morocco.

The CCM acts as the main liaison between production companies and governmental departments, facilitating filming authorizations regardless of project complexity. From pre-production approvals to on-set supervision and post-production compliance, all filming activities in Morocco are overseen by this institution.

Through constant coordination and proactive communication, TFS ensures that all permits are obtained on time, allowing productions to move forward smoothly and efficiently.`,
        full_description_fr: `TFS maintient des relations solides et fiables avec les autorités marocaines, en particulier le Centre Cinématographique Marocain (CCM), l'organisme officiel responsable de la réglementation de la production cinématographique au Maroc.

Le CCM agit comme principal intermédiaire entre les sociétés de production et les départements gouvernementaux, facilitant les autorisations de tournage quelle que soit la complexité du projet. Des approbations de pré-production à la supervision sur le plateau et à la conformité post-production, toutes les activités de tournage au Maroc sont supervisées par cette institution.

Grâce à une coordination constante et une communication proactive, TFS s'assure que tous les permis sont obtenus à temps, permettant aux productions d'avancer de manière fluide et efficace.`,
        type: 'content_page',
        display_order: 3,
        is_active: true
    },
    {
        slug: 'crewing',
        title: 'Crewing',
        title_fr: 'Recrutement d\'Équipes',
        brief_description: 'Access to highly skilled technicians and production professionals with international experience.',
        brief_description_fr: 'Accès à des techniciens hautement qualifiés et des professionnels de production avec une expérience internationale.',
        full_description: `For productions filming in Morocco, TFS provides access to highly skilled technicians and experienced production professionals with extensive international project backgrounds.

Our multilingual crews enable seamless collaboration in multicultural environments, ensuring clear communication and a productive working atmosphere. We carefully select the best local talent to match each project's creative and technical requirements, minimizing misunderstandings and maximizing efficiency on set.`,
        full_description_fr: `Pour les productions tournant au Maroc, TFS offre l'accès à des techniciens hautement qualifiés et des professionnels de production expérimentés avec une vaste expérience de projets internationaux.

Nos équipes multilingues permettent une collaboration fluide dans des environnements multiculturels, assurant une communication claire et une atmosphère de travail productive. Nous sélectionnons soigneusement les meilleurs talents locaux pour correspondre aux exigences créatives et techniques de chaque projet, minimisant les malentendus et maximisant l'efficacité sur le plateau.`,
        type: 'content_page',
        display_order: 4,
        is_active: true
    },
    {
        slug: 'scouting',
        title: 'Location Scouting',
        title_fr: 'Repérage de Lieux',
        brief_description: 'Curated location selections matching your creative vision with access to our photo library.',
        brief_description_fr: 'Sélections de lieux sur mesure correspondant à votre vision créative avec accès à notre photothèque.',
        full_description: `After reviewing the screenplay and understanding the creative vision, TFS presents a curated selection of locations that best match the project's needs.

Thanks to our extensive experience, we are able to identify precise location matches quickly and efficiently. Upon request, clients can access our comprehensive photo library, showcasing a wide range of Moroccan locations, including cities and landscapes that have hosted some of the country's most iconic film productions.`,
        full_description_fr: `Après avoir examiné le scénario et compris la vision créative, TFS présente une sélection de lieux sur mesure qui correspondent le mieux aux besoins du projet.

Grâce à notre vaste expérience, nous sommes en mesure d'identifier rapidement et efficacement des correspondances de lieux précises. Sur demande, les clients peuvent accéder à notre photothèque complète, présentant une large gamme de lieux marocains, y compris des villes et des paysages qui ont accueilli certaines des productions cinématographiques les plus emblématiques du pays.`,
        type: 'content_page',
        display_order: 5,
        is_active: true
    },
    {
        slug: 'catering',
        title: 'Catering',
        title_fr: 'Restauration',
        brief_description: 'Reliable catering services with professionally trained chefs focused on quality and hygiene.',
        brief_description_fr: 'Services de restauration fiables avec des chefs formés professionnellement axés sur la qualité et l\'hygiène.',
        full_description: `TFS offers reliable and cost-effective catering services led by professionally trained chefs with a strong focus on hygiene, food safety, and quality.

Ingredients are sourced daily from local markets to ensure fresh, natural, and high-quality meals. Our catering options include set menus, all-day craft services, and customized meal plans for special requests.

Pricing is flexible and adapted to production size and budget, while maintaining excellent taste and presentation.`,
        full_description_fr: `TFS offre des services de restauration fiables et économiques dirigés par des chefs formés professionnellement avec un accent particulier sur l'hygiène, la sécurité alimentaire et la qualité.

Les ingrédients sont approvisionnés quotidiennement sur les marchés locaux pour garantir des repas frais, naturels et de haute qualité. Nos options de restauration comprennent des menus fixes, des services de craft toute la journée et des plans de repas personnalisés pour les demandes spéciales.

Les prix sont flexibles et adaptés à la taille de la production et au budget, tout en maintenant un excellent goût et une belle présentation.`,
        type: 'content_page',
        display_order: 6,
        is_active: true
    },
    {
        slug: 'accommodation',
        title: 'Accommodation',
        title_fr: 'Hébergement',
        brief_description: 'Hotel bookings and travel logistics with preferential rates through long-standing partnerships.',
        brief_description_fr: 'Réservations d\'hôtels et logistique de voyage avec des tarifs préférentiels grâce à des partenariats de longue date.',
        full_description: `Our production coordinators specialize in hotel bookings and travel logistics, including air and ground transportation.

TFS arranges accommodations ranging from luxury hotels to boutique guesthouses and private villas across Morocco. Thanks to long-standing partnerships, we are able to secure preferential rates, offering clients significant cost savings while maintaining high comfort standards suitable for any budget.`,
        full_description_fr: `Nos coordinateurs de production se spécialisent dans les réservations d'hôtels et la logistique de voyage, y compris le transport aérien et terrestre.

TFS organise des hébergements allant des hôtels de luxe aux maisons d'hôtes boutique et villas privées à travers le Maroc. Grâce à des partenariats de longue date, nous pouvons obtenir des tarifs préférentiels, offrant aux clients des économies significatives tout en maintenant des standards de confort élevés adaptés à tout budget.`,
        type: 'content_page',
        display_order: 7,
        is_active: true
    },
    {
        slug: 'transportation',
        title: 'Transportation',
        title_fr: 'Transport',
        brief_description: 'Dependable and budget-efficient transportation solutions for productions of all sizes.',
        brief_description_fr: 'Solutions de transport fiables et économiques pour les productions de toutes tailles.',
        full_description: `TFS provides dependable and budget-efficient transportation solutions for film productions of all sizes.

Our experience allows us to organize ground and air transport under optimal conditions, offering a diverse fleet of vehicles adapted to production needs. When required, we also coordinate with international suppliers to ensure specialized transportation solutions.`,
        full_description_fr: `TFS fournit des solutions de transport fiables et économiques pour les productions cinématographiques de toutes tailles.

Notre expérience nous permet d'organiser le transport terrestre et aérien dans des conditions optimales, offrant une flotte diversifiée de véhicules adaptés aux besoins de production. Si nécessaire, nous coordonnons également avec des fournisseurs internationaux pour assurer des solutions de transport spécialisées.`,
        type: 'content_page',
        display_order: 8,
        is_active: true
    },
    {
        slug: 'casting',
        title: 'Casting',
        title_fr: 'Casting',
        brief_description: 'Exceptional casting from Morocco\'s diverse talent pool with professional recordings.',
        brief_description_fr: 'Casting exceptionnel à partir du vivier de talents diversifié du Maroc avec des enregistrements professionnels.',
        full_description: `Morocco's rich history and cultural diversity make it an exceptional destination for international casting.

The country offers a wide range of looks and profiles, reflecting influences from Europe, the Middle East, Africa, and beyond. TFS works closely with casting directors to source professional actors, stunt performers, models, and extras tailored to each project.

All casting sessions are professionally recorded and photographed, with materials made available to clients upon request.`,
        full_description_fr: `La riche histoire et la diversité culturelle du Maroc en font une destination exceptionnelle pour le casting international.

Le pays offre une large gamme de looks et de profils, reflétant les influences de l'Europe, du Moyen-Orient, de l'Afrique et au-delà. TFS travaille en étroite collaboration avec les directeurs de casting pour trouver des acteurs professionnels, des cascadeurs, des mannequins et des figurants adaptés à chaque projet.

Toutes les sessions de casting sont enregistrées et photographiées professionnellement, les matériaux étant mis à disposition des clients sur demande.`,
        type: 'content_page',
        display_order: 9,
        is_active: true
    }
];

// Old services to be removed (from previous seed)
const OLD_SERVICES_TO_REMOVE = [
    'sporting-events',
    'film-production',
    'tv-recording',
    'live-events',
    'studio-infrastructure',
    'ob-vans',
    'consulting-design',
    'post-production',
    'equipment-rental',
    'digital-storage'
];

async function seedServices() {
    const pb = new PocketBase(PB_URL);

    try {
        // Authenticate as admin (PocketBase v0.34+ uses _superusers collection)
        console.log(`Connecting to PocketBase at: ${PB_URL}`);
        console.log('Authenticating as admin...');

        // Try new v0.34+ method first, fallback to legacy
        try {
            await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        } catch (e) {
            // Fallback for older PocketBase versions
            await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        }
        console.log('Authenticated successfully!');

        // PHASE 1: Remove old services
        console.log('\nRemoving old services...');
        for (const slug of OLD_SERVICES_TO_REMOVE) {
            try {
                const existing = await pb.collection('services').getFirstListItem(`slug="${slug}"`).catch(() => null);
                if (existing) {
                    await pb.collection('services').delete(existing.id);
                    console.log(`  - Removed: ${slug}`);
                }
            } catch (err) {
                // Service doesn't exist, skip
            }
        }

        // PHASE 2: Seed new services
        console.log('\nSeeding services...');
        for (const service of SERVICES) {
            try {
                // Check if service already exists
                const existing = await pb.collection('services').getFirstListItem(`slug="${service.slug}"`).catch(() => null);

                if (existing) {
                    console.log(`  ↻ Updating: ${service.title}`);
                    await pb.collection('services').update(existing.id, service);
                } else {
                    console.log(`  + Creating: ${service.title}`);
                    await pb.collection('services').create(service);
                }
            } catch (err) {
                console.error(`  ✗ Failed to create/update ${service.title}:`, err.message);
            }
        }

        console.log('\n✓ Services seeded successfully!');
        console.log(`  Total: ${SERVICES.length} services`);
    } catch (error) {
        console.error('Error seeding services:', error);
        if (error.response) {
            console.error('Response data:', JSON.stringify(error.response, null, 2));
        }
        process.exit(1);
    }
}

seedServices();

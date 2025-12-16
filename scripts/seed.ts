/**
 * Seed Script - Add demo data to PocketBase
 * 
 * Run with: npx tsx scripts/seed.ts
 */

import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';

async function seed() {
    const pb = new PocketBase(PB_URL);

    console.log('🌱 Starting seed...\n');

    // =========================================================================
    // CATEGORIES
    // =========================================================================
    console.log('📁 Creating categories...');

    const categories = [
        {
            name: 'Cameras',
            name_en: 'Cameras',
            name_fr: 'Caméras',
            slug: 'cameras',
            description: 'Professional cinema cameras',
            icon: 'camera'
        },
        {
            name: 'Lenses',
            name_en: 'Lenses',
            name_fr: 'Objectifs',
            slug: 'lenses',
            description: 'Cinema prime and zoom lenses',
            icon: 'aperture'
        },
        {
            name: 'Lighting',
            name_en: 'Lighting',
            name_fr: 'Éclairage',
            slug: 'lighting',
            description: 'LED panels, fresnels, and grip',
            icon: 'sun'
        },
        {
            name: 'Audio',
            name_en: 'Audio',
            name_fr: 'Audio',
            slug: 'audio',
            description: 'Microphones, recorders, and wireless',
            icon: 'mic'
        },
        {
            name: 'Grip & Support',
            name_en: 'Grip & Support',
            name_fr: 'Machinerie',
            slug: 'grip',
            description: 'Tripods, dollies, and stabilizers',
            icon: 'move'
        },
        {
            name: 'Monitors',
            name_en: 'Monitors',
            name_fr: 'Moniteurs',
            slug: 'monitors',
            description: 'On-set and director monitors',
            icon: 'monitor'
        }
    ];

    const categoryIds: Record<string, string> = {};

    for (const cat of categories) {
        try {
            const existing = await pb.collection('categories').getFirstListItem(`slug = "${cat.slug}"`).catch(() => null);
            if (existing) {
                console.log(`  ✓ Category "${cat.name}" already exists`);
                categoryIds[cat.slug] = existing.id;
            } else {
                const record = await pb.collection('categories').create(cat);
                console.log(`  ✅ Created category: ${cat.name}`);
                categoryIds[cat.slug] = record.id;
            }
        } catch (err: any) {
            console.error(`  ❌ Error creating category ${cat.name}:`, err.message);
        }
    }

    // =========================================================================
    // EQUIPMENT (Products)
    // =========================================================================
    console.log('\n📦 Creating equipment...');

    const equipment = [
        // Cameras
        {
            name_en: 'ARRI Alexa 35',
            name_fr: 'ARRI Alexa 35',
            slug: 'arri-alexa-35',
            category: [categoryIds['cameras']],
            brand: 'ARRI',
            description_en: '<p>The ARRI ALEXA 35 sets a new benchmark in digital cinematography with its revolutionary 4.6K Super 35 sensor.</p>',
            description_fr: '<p>L\'ARRI ALEXA 35 établit une nouvelle référence en cinématographie numérique avec son capteur Super 35 4.6K révolutionnaire.</p>',
            daily_rate: 1500,
            stock: 2,
            stock_available: 2,
            featured: true,
            visibility: true,
            availability_status: 'available'
        },
        {
            name_en: 'RED V-Raptor XL 8K',
            name_fr: 'RED V-Raptor XL 8K',
            slug: 'red-v-raptor-xl',
            category: [categoryIds['cameras']],
            brand: 'RED',
            description_en: '<p>The V-RAPTOR XL delivers stunning 8K resolution with RED\'s legendary color science.</p>',
            description_fr: '<p>Le V-RAPTOR XL offre une résolution 8K époustouflante avec la science des couleurs légendaire de RED.</p>',
            daily_rate: 1200,
            stock: 3,
            stock_available: 2,
            featured: true,
            visibility: true,
            availability_status: 'available'
        },
        {
            name_en: 'Sony Venice 2',
            name_fr: 'Sony Venice 2',
            slug: 'sony-venice-2',
            category: [categoryIds['cameras']],
            brand: 'Sony',
            description_en: '<p>Full-frame cinema camera with dual base ISO and 8.6K sensor.</p>',
            description_fr: '<p>Caméra cinéma plein format avec double ISO de base et capteur 8.6K.</p>',
            daily_rate: 1300,
            stock: 2,
            stock_available: 1,
            featured: true,
            visibility: true,
            availability_status: 'available'
        },
        // Lenses
        {
            name_en: 'Cooke S7/i Full Frame Plus Set',
            name_fr: 'Set Cooke S7/i Full Frame Plus',
            slug: 'cooke-s7i-set',
            category: [categoryIds['lenses']],
            brand: 'Cooke',
            description_en: '<p>6-lens set: 25mm, 32mm, 40mm, 50mm, 75mm, 100mm. The legendary Cooke Look.</p>',
            description_fr: '<p>Set de 6 objectifs: 25mm, 32mm, 40mm, 50mm, 75mm, 100mm. Le légendaire rendu Cooke.</p>',
            daily_rate: 800,
            stock: 2,
            stock_available: 2,
            featured: true,
            visibility: true,
            availability_status: 'available'
        },
        {
            name_en: 'ARRI Signature Prime Set',
            name_fr: 'Set ARRI Signature Prime',
            slug: 'arri-signature-prime-set',
            category: [categoryIds['lenses']],
            brand: 'ARRI',
            description_en: '<p>Premium full-frame prime lenses with beautiful bokeh and skin tones.</p>',
            description_fr: '<p>Objectifs fixes plein format premium avec un bokeh magnifique et des tons chair naturels.</p>',
            daily_rate: 900,
            stock: 2,
            stock_available: 2,
            featured: false,
            visibility: true,
            availability_status: 'available'
        },
        {
            name_en: 'Angenieux Optimo Ultra 12x',
            name_fr: 'Angenieux Optimo Ultra 12x',
            slug: 'angenieux-optimo-ultra-12x',
            category: [categoryIds['lenses']],
            brand: 'Angenieux',
            description_en: '<p>Full-frame zoom lens 24-290mm T2.8. The ultimate cinema zoom.</p>',
            description_fr: '<p>Zoom plein format 24-290mm T2.8. Le zoom cinéma ultime.</p>',
            daily_rate: 600,
            stock: 1,
            stock_available: 1,
            featured: true,
            visibility: true,
            availability_status: 'available'
        },
        // Lighting
        {
            name_en: 'ARRI SkyPanel S60-C',
            name_fr: 'ARRI SkyPanel S60-C',
            slug: 'arri-skypanel-s60c',
            category: [categoryIds['lighting']],
            brand: 'ARRI',
            description_en: '<p>Industry-standard LED soft light with full color control and high CRI.</p>',
            description_fr: '<p>Lumière LED douce de référence avec contrôle complet des couleurs et CRI élevé.</p>',
            daily_rate: 150,
            stock: 8,
            stock_available: 6,
            featured: true,
            visibility: true,
            availability_status: 'available'
        },
        {
            name_en: 'Aputure 600d Pro',
            name_fr: 'Aputure 600d Pro',
            slug: 'aputure-600d-pro',
            category: [categoryIds['lighting']],
            brand: 'Aputure',
            description_en: '<p>Powerful daylight LED with Bowens mount. Great for key lights.</p>',
            description_fr: '<p>LED lumière du jour puissante avec monture Bowens. Idéal pour les éclairages principaux.</p>',
            daily_rate: 80,
            stock: 6,
            stock_available: 6,
            featured: false,
            visibility: true,
            availability_status: 'available'
        },
        // Audio
        {
            name_en: 'Sound Devices 888',
            name_fr: 'Sound Devices 888',
            slug: 'sound-devices-888',
            category: [categoryIds['audio']],
            brand: 'Sound Devices',
            description_en: '<p>8-channel/16-track portable mixer-recorder for production sound.</p>',
            description_fr: '<p>Enregistreur-mixeur portable 8 canaux/16 pistes pour le son de production.</p>',
            daily_rate: 200,
            stock: 3,
            stock_available: 3,
            featured: false,
            visibility: true,
            availability_status: 'available'
        },
        {
            name_en: 'Sennheiser MKH 416',
            name_fr: 'Sennheiser MKH 416',
            slug: 'sennheiser-mkh-416',
            category: [categoryIds['audio']],
            brand: 'Sennheiser',
            description_en: '<p>The industry-standard shotgun microphone for film and TV.</p>',
            description_fr: '<p>Le microphone canon de référence pour le cinéma et la télévision.</p>',
            daily_rate: 35,
            stock: 10,
            stock_available: 8,
            featured: false,
            visibility: true,
            availability_status: 'available'
        },
        // Grip
        {
            name_en: 'DJI Ronin 2',
            name_fr: 'DJI Ronin 2',
            slug: 'dji-ronin-2',
            category: [categoryIds['grip']],
            brand: 'DJI',
            description_en: '<p>Professional 3-axis gimbal stabilizer for cinema cameras up to 13.6kg.</p>',
            description_fr: '<p>Stabilisateur cardan 3 axes professionnel pour caméras cinéma jusqu\'à 13.6kg.</p>',
            daily_rate: 250,
            stock: 4,
            stock_available: 3,
            featured: true,
            visibility: true,
            availability_status: 'available'
        },
        // Monitors
        {
            name_en: 'SmallHD Cine 24 4K',
            name_fr: 'SmallHD Cine 24 4K',
            slug: 'smallhd-cine-24',
            category: [categoryIds['monitors']],
            brand: 'SmallHD',
            description_en: '<p>24-inch 4K HDR production monitor with 1500 nits brightness.</p>',
            description_fr: '<p>Moniteur de production 24 pouces 4K HDR avec 1500 nits de luminosité.</p>',
            daily_rate: 180,
            stock: 4,
            stock_available: 4,
            featured: false,
            visibility: true,
            availability_status: 'available'
        }
    ];

    for (const item of equipment) {
        try {
            const existing = await pb.collection('equipment').getFirstListItem(`slug = "${item.slug}"`).catch(() => null);
            if (existing) {
                console.log(`  ✓ Equipment "${item.name_en}" already exists`);
            } else {
                await pb.collection('equipment').create(item);
                console.log(`  ✅ Created equipment: ${item.name_en}`);
            }
        } catch (err: any) {
            console.error(`  ❌ Error creating equipment ${item.name_en}:`, err.message);
        }
    }

    // =========================================================================
    // BLOG POSTS
    // =========================================================================
    console.log('\n📝 Creating blog posts...');

    const posts = [
        {
            title_en: 'Choosing the Right Cinema Camera for Your Production',
            title_fr: 'Choisir la Bonne Caméra Cinéma pour Votre Production',
            slug: 'choosing-right-cinema-camera',
            excerpt_en: 'A comprehensive guide to selecting the perfect cinema camera based on your budget, project requirements, and creative vision.',
            excerpt_fr: 'Un guide complet pour sélectionner la caméra cinéma parfaite selon votre budget, vos besoins de projet et votre vision créative.',
            content_en: `<h2>Understanding Your Needs</h2>
<p>Before diving into specific camera models, it's crucial to understand what you truly need for your production. Consider these key factors:</p>
<ul>
<li><strong>Budget</strong> - Both rental and post-production costs</li>
<li><strong>Resolution</strong> - 4K, 6K, or 8K depending on delivery requirements</li>
<li><strong>Dynamic Range</strong> - Critical for challenging lighting conditions</li>
<li><strong>Color Science</strong> - Each manufacturer has a unique look</li>
</ul>
<h2>Top Recommendations</h2>
<p>For high-end productions, we recommend the ARRI Alexa 35 for its unmatched skin tones and dynamic range. For versatility, the RED V-Raptor offers incredible resolution at a competitive price point.</p>
<p>Contact our team at TFS for personalized recommendations based on your specific project needs.</p>`,
            content_fr: `<h2>Comprendre Vos Besoins</h2>
<p>Avant de plonger dans les modèles de caméras spécifiques, il est crucial de comprendre ce dont vous avez vraiment besoin pour votre production. Considérez ces facteurs clés:</p>
<ul>
<li><strong>Budget</strong> - Coûts de location et de post-production</li>
<li><strong>Résolution</strong> - 4K, 6K ou 8K selon les exigences de livraison</li>
<li><strong>Plage Dynamique</strong> - Critique pour les conditions d'éclairage difficiles</li>
<li><strong>Science des Couleurs</strong> - Chaque fabricant a un rendu unique</li>
</ul>
<h2>Nos Recommandations</h2>
<p>Pour les productions haut de gamme, nous recommandons l'ARRI Alexa 35 pour ses tons chair inégalés et sa plage dynamique. Pour la polyvalence, le RED V-Raptor offre une résolution incroyable à un prix compétitif.</p>
<p>Contactez notre équipe chez TFS pour des recommandations personnalisées basées sur les besoins spécifiques de votre projet.</p>`,
            category: 'tips',
            published: true,
            published_at: new Date().toISOString()
        },
        {
            title_en: 'Behind the Scenes: Lighting a Desert Location in Morocco',
            title_fr: 'Dans les Coulisses: Éclairer un Tournage dans le Désert Marocain',
            slug: 'lighting-desert-morocco',
            excerpt_en: 'Our team shares insights from a recent production in Ouarzazate, managing extreme conditions while achieving cinematic lighting.',
            excerpt_fr: 'Notre équipe partage ses insights d\'une production récente à Ouarzazate, gérant des conditions extrêmes tout en obtenant un éclairage cinématographique.',
            content_en: `<h2>The Challenge</h2>
<p>Shooting in the Moroccan desert presents unique challenges: extreme heat, sand, and the harsh midday sun. For a recent historical drama, we needed to create beautiful, controllable light in these conditions.</p>
<h2>Our Approach</h2>
<p>We deployed a combination of ARRI SkyPanels for fill and Aputure 600d fixtures as key lights, all powered by portable generators. Large diffusion frames helped tame the harsh sun.</p>
<h2>Key Takeaways</h2>
<ul>
<li>Plan for equipment protection from sand and heat</li>
<li>Golden hour is your best friend in the desert</li>
<li>Bring backup power and cooling solutions</li>
</ul>`,
            content_fr: `<h2>Le Défi</h2>
<p>Tourner dans le désert marocain présente des défis uniques: chaleur extrême, sable, et un soleil de midi impitoyable. Pour un drame historique récent, nous devions créer un éclairage beau et contrôlable dans ces conditions.</p>
<h2>Notre Approche</h2>
<p>Nous avons déployé une combinaison de SkyPanels ARRI pour le fill et de fixtures Aputure 600d comme éclairages principaux, tous alimentés par des générateurs portables. De grands cadres de diffusion ont aidé à dompter le soleil dur.</p>
<h2>Points Clés</h2>
<ul>
<li>Planifiez la protection de l'équipement contre le sable et la chaleur</li>
<li>L'heure dorée est votre meilleur allié dans le désert</li>
<li>Apportez une alimentation de secours et des solutions de refroidissement</li>
</ul>`,
            category: 'behind-the-scenes',
            published: true,
            published_at: new Date(Date.now() - 86400000).toISOString() // Yesterday
        },
        {
            title_en: 'New Equipment Arrivals: Spring 2025',
            title_fr: 'Nouvelles Arrivées d\'Équipement: Printemps 2025',
            slug: 'new-equipment-spring-2025',
            excerpt_en: 'We\'ve expanded our inventory with the latest cinema technology including the Sony Venice 2 and new Cooke lenses.',
            excerpt_fr: 'Nous avons élargi notre inventaire avec les dernières technologies cinéma, notamment la Sony Venice 2 et de nouveaux objectifs Cooke.',
            content_en: `<h2>Exciting Additions to Our Fleet</h2>
<p>TFS is proud to announce major additions to our equipment inventory for 2025:</p>
<h3>Cameras</h3>
<ul>
<li>Sony Venice 2 - Full-frame with 8.6K sensor</li>
<li>ARRI Alexa 35 (additional units)</li>
</ul>
<h3>Lenses</h3>
<ul>
<li>Cooke S7/i Full Frame Plus complete set</li>
<li>Angenieux Optimo Ultra 12x zoom</li>
</ul>
<p>Contact us today to reserve this equipment for your upcoming production!</p>`,
            content_fr: `<h2>Ajouts Passionnants à Notre Flotte</h2>
<p>TFS est fier d'annoncer d'importants ajouts à notre inventaire d'équipement pour 2025:</p>
<h3>Caméras</h3>
<ul>
<li>Sony Venice 2 - Plein format avec capteur 8.6K</li>
<li>ARRI Alexa 35 (unités supplémentaires)</li>
</ul>
<h3>Objectifs</h3>
<ul>
<li>Set complet Cooke S7/i Full Frame Plus</li>
<li>Zoom Angenieux Optimo Ultra 12x</li>
</ul>
<p>Contactez-nous dès aujourd'hui pour réserver cet équipement pour votre prochaine production!</p>`,
            category: 'news',
            published: true,
            published_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
            title_en: '5 Tips for Better Audio on Set',
            title_fr: '5 Conseils pour un Meilleur Audio sur le Plateau',
            slug: '5-tips-better-audio-on-set',
            excerpt_en: 'Production sound is often overlooked. Here are essential tips to capture clean dialogue every time.',
            excerpt_fr: 'Le son de production est souvent négligé. Voici des conseils essentiels pour capturer un dialogue propre à chaque fois.',
            content_en: `<h2>Audio Matters</h2>
<p>Great visuals with poor audio will always feel amateur. Here's how to level up your production sound:</p>
<ol>
<li><strong>Use a dedicated sound mixer</strong> - Don't rely on camera audio</li>
<li><strong>Boom mic positioning</strong> - As close as possible without entering frame</li>
<li><strong>Wireless lavs as backup</strong> - Always have redundancy</li>
<li><strong>Monitor constantly</strong> - Catch issues before they become problems</li>
<li><strong>Record room tone</strong> - Essential for post-production</li>
</ol>
<p>Our Sound Devices 888 and Sennheiser microphone packages are available for your next production.</p>`,
            content_fr: `<h2>L'Audio Compte</h2>
<p>De superbes visuels avec un audio médiocre auront toujours l'air amateur. Voici comment améliorer votre son de production:</p>
<ol>
<li><strong>Utilisez un mixeur son dédié</strong> - Ne vous fiez pas à l'audio de la caméra</li>
<li><strong>Positionnement de la perche</strong> - Aussi près que possible sans entrer dans le cadre</li>
<li><strong>Micros cravate sans fil en backup</strong> - Ayez toujours une redondance</li>
<li><strong>Surveillez constamment</strong> - Détectez les problèmes avant qu'ils ne deviennent graves</li>
<li><strong>Enregistrez l'ambiance</strong> - Essentiel pour la post-production</li>
</ol>
<p>Nos packages Sound Devices 888 et microphones Sennheiser sont disponibles pour votre prochaine production.</p>`,
            category: 'tips',
            published: true,
            published_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
        }
    ];

    for (const post of posts) {
        try {
            const existing = await pb.collection('posts').getFirstListItem(`slug = "${post.slug}"`).catch(() => null);
            if (existing) {
                console.log(`  ✓ Post "${post.title_en}" already exists`);
            } else {
                await pb.collection('posts').create(post);
                console.log(`  ✅ Created post: ${post.title_en}`);
            }
        } catch (err: any) {
            console.error(`  ❌ Error creating post ${post.title_en}:`, err.message);
        }
    }

    console.log('\n✨ Seed complete!\n');
}

// Run the seed
seed().catch(console.error);

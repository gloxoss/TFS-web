/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("posts");

    const posts = [
        {
            title_en: "Introducing the ARRI Alexa 35: Now Available for Rent",
            title_fr: "Présentation de l'ARRI Alexa 35 : Maintenant disponible à la location",
            slug: "arri-alexa-35-available",
            category: "news",
            excerpt_en: "We are proud to announce the latest addition to our camera inventory: the game-changing ARRI Alexa 35.",
            excerpt_fr: "Nous sommes fiers d'annoncer le dernier ajout à notre inventaire de caméras : la révolutionnaire ARRI Alexa 35.",
            content_en: "<p>The ARRI Alexa 35 raises the bar for digital cinematography. With its new Super 35 sensor, it offers 17 stops of dynamic range, improved low light performance, and richer colors. It's the perfect tool for your next feature film or high-end commercial in Morocco.</p><p>Contact us today to check availability and book a test day.</p>",
            content_fr: "<p>L'ARRI Alexa 35 place la barre très haut pour la cinématographie numérique. Avec son nouveau capteur Super 35, elle offre 17 stops de plage dynamique, une meilleure performance en basse lumière et des couleurs plus riches. C'est l'outil parfait pour votre prochain long métrage ou publicité haut de gamme au Maroc.</p><p>Contactez-nous aujourd'hui pour vérifier la disponibilité et réserver une journée de test.</p>",
            published: true,
            published_at: "2024-05-15 10:00:00.000Z"
        },
        {
            title_en: "5 Tips for Filming in the Moroccan Desert",
            title_fr: "5 Conseils pour filmer dans le désert marocain",
            slug: "tips-filming-moroccan-desert",
            category: "tips",
            excerpt_en: "Shooting in the Sahara offers stunning visuals but comes with unique challenges. Here is how to prepare your crew and equipment.",
            excerpt_fr: "Filmer dans le Sahara offre des visuels époustouflants mais comporte des défis uniques. Voici comment préparer votre équipe et votre équipement.",
            content_en: "<p>1. <strong>Protect your Gear:</strong> Sand is the enemy. Use rain covers and filters to protect lenses and camera bodies.</p><p>2. <strong>Hydration is Key:</strong> Ensure your crew has constant access to water.</p><p>3. <strong>Light Management:</strong> The midday sun is harsh. Plan your shoots for golden hour or bring heavy diffusion.</p><p>4. <strong>Logistics:</strong> 4x4 vehicles are a must for transporting equipment to dunes.</p><p>5. <strong>Local Fixers:</strong> Always work with experienced local fixers who know the terrain.</p>",
            content_fr: "<p>1. <strong>Protégez votre matériel :</strong> Le sable est l'ennemi. Utilisez des housses de pluie et des filtres pour protéger les objectifs et les boîtiers.</p><p>2. <strong>L'hydratation est clé :</strong> assurez-vous que votre équipe a un accès constant à l'eau.</p><p>3. <strong>Gestion de la lumière :</strong> Le soleil de midi est dur. Prévoyez vos tournages pour l'heure dorée ou apportez une forte diffusion.</p><p>4. <strong>Logistique :</strong> Les véhicules 4x4 sont indispensables pour transporter l'équipement vers les dunes.</p><p>5. <strong>Fixeurs locaux :</strong> Travaillez toujours avec des fixeurs locaux expérimentés qui connaissent le terrain.</p>",
            published: true,
            published_at: "2024-06-02 09:30:00.000Z"
        },
        {
            title_en: "Understanding Morocco's 30% Tax Rebate",
            title_fr: "Comprendre le crédit d'impôt de 30% au Maroc",
            slug: "morocco-tax-rebate-explained",
            category: "industry",
            excerpt_en: "Morocco offers one of the most competitive financial incentives for international productions. Learn how to qualify.",
            excerpt_fr: "Le Maroc offre l'une des incitations financières les plus compétitives pour les productions internationales. Apprenez comment vous qualifier.",
            content_en: "<p>The Moroccan government offers a 30% cash rebate on eligible expenses incurred in Morocco. To qualify, your production must involve a minimum spend of 10 million MAD (exclude taxes) and include at least 18 days of shooting.</p><p>Eligible expenses include technical equipment rental, local crew salaries, accommodation, and transport. TV Film Solutions can help you navigate the paperwork and maximize your rebate.</p>",
            content_fr: "<p>Le gouvernement marocain offre un remboursement en espèces de 30% sur les dépenses éligibles engagées au Maroc. Pour être admissible, votre production doit impliquer une dépense minimale de 10 millions de MAD (hors taxes) et inclure au moins 18 jours de tournage.</p><p>Les dépenses éligibles comprennent la location d'équipement technique, les salaires de l'équipe locale, l'hébergement et le transport. TV Film Solutions peut vous aider à gérer la paperasse et à maximiser votre remboursement.</p>",
            published: true,
            published_at: "2024-04-20 14:15:00.000Z"
        },
        {
            title_en: "Behind the Scenes: 'Desert Mirage' Commercial",
            title_fr: "Dans les coulisses : Publicité 'Desert Mirage'",
            slug: "bts-desert-mirage-commercial",
            category: "behind-the-scenes",
            excerpt_en: "We recently supported a major automotive brand for their latest TV spot. Check out some photos from the set.",
            excerpt_fr: "Nous avons récemment soutenu une grande marque automobile pour leur dernier spot télévisé. Découvrez quelques photos du plateau.",
            content_en: "<p>Shooting near Ouarzazate, the production required a TechnoCrane and a heavy lighting package to simulate moonlight in the deep desert. Our team provided full logistical support, including custom rigging for the car mounts.</p><p>It was a challenging 3-night shoot, but the results were spectacular.</p>",
            content_fr: "<p>Tournée près de Ouarzazate, la production a nécessité une TechnoCrane et un lourd dispositif d'éclairage pour simuler le clair de lune dans le désert profond. Notre équipe a fourni un soutien logistique complet, y compris un gréement personnalisé pour les fixations de voiture.</p><p>Ce fut un tournage difficile de 3 nuits, mais les résultats ont été spectaculaires.</p>",
            published: true,
            published_at: "2024-07-10 11:00:00.000Z"
        },
        {
            title_en: "Top 5 Filming Locations in Casablanca",
            title_fr: "Top 5 des lieux de tournage à Casablanca",
            slug: "top-filming-locations-casablanca",
            category: "tips",
            excerpt_en: "From Art Deco architecture to modern skyscrapers, Casablanca offers diverse backdrops for any story.",
            excerpt_fr: "De l'architecture Art Déco aux gratte-ciel modernes, Casablanca offre des décors variés pour toute histoire.",
            content_en: "<p>Casablanca is a city of contrasts. Here are our top picks:</p><ul><li><strong>The Old Medina:</strong> Authentic textures and narrow streets.</li><li><strong>Center Ville:</strong> Stunning Art Deco buildings from the 1920s.</li><li><strong>The Corniche:</strong> Modern beach clubs and ocean views.</li><li><strong>Habous Quarter:</strong> Traditional Moroccan architecture with ordered planning.</li><li><strong>Marina:</strong> Sleek, modern business district vibes.</li></ul>",
            content_fr: "<p>Casablanca est une ville de contrastes. Voici nos meilleurs choix :</p><ul><li><strong>L'Ancienne Médina :</strong> Textures authentiques et rues étroites.</li><li><strong>Centre Ville :</strong> Superbes bâtiments Art Déco des années 1920.</li><li><strong>La Corniche :</strong> Clubs de plage modernes et vues sur l'océan.</li><li><strong>Quartier Habous :</strong> Architecture marocaine traditionnelle avec une planification ordonnée.</li><li><strong>Marina :</strong> Ambiance de quartier d'affaires moderne et épuré.</li></ul>",
            published: true,
            published_at: "2024-03-12 08:00:00.000Z"
        },
        {
            title_en: "Essential Grip Gear for Windy Locations",
            title_fr: "Matériel de machinerie essentiel pour les lieux venteux",
            slug: "grip-gear-windy-locations",
            category: "tips",
            excerpt_en: "Don't let the wind ruin your shot (or your gear). Essential safety equipment for coastal and desert shoots.",
            excerpt_fr: "Ne laissez pas le vent gâcher votre plan (ou votre matériel). Équipement de sécurité essentiel pour les tournages côtiers et désertiques.",
            content_en: "<p>Wind is a constant factor in many Moroccan locations. We recommend always carrying ample <strong>shot bags</strong>, using <strong>wind-braced frames</strong> for diffusion, and securing highly placed lights with <strong>safety lines</strong>. When in doubt, size up your stands - a Mombo Combo is safer than a beefy baby in high winds.</p>",
            content_fr: "<p>Le vent est un facteur constant dans de nombreux lieux marocains. Nous recommandons de toujours transporter suffisamment de <strong>sacs de lest</strong>, d'utiliser des <strong>cadres renforcés contre le vent</strong> pour la diffusion, et de sécuriser les lumières haut placées avec des <strong>élingues de sécurité</strong>. En cas de doute, augmentez la taille de vos pieds - un Mombo Combo est plus sûr qu'un beefy baby par grand vent.</p>",
            published: true,
            published_at: "2024-08-05 16:20:00.000Z"
        },
        {
            title_en: "Why We Use Astera Tubes for Music Videos",
            title_fr: "Pourquoi nous utilisons les tubes Astera pour les clips musicaux",
            slug: "astera-tubes-music-videos",
            category: "tips",
            excerpt_en: "Versatile, battery-powered, and fully controllable. Astera Titan Tubes are a must-have for dynamic lighting setups.",
            excerpt_fr: "Polyvalents, alimentés par batterie et entièrement contrôlables. Les tubes Astera Titan sont indispensables pour des configurations d'éclairage dynamiques.",
            content_en: "<p>For fast-paced music video shoots, cables are a killer. Astera Titan Tubes allow us to hide lights in the shot, create moving effects mapped to pixels, and change colors instantly via the app. They offer high CRI for good skin tones while allowing for extreme creative freedom.</p>",
            content_fr: "<p>Pour les tournages de clips musicaux au rythme effréné, les câbles sont un enfer. Les tubes Astera Titan nous permettent de cacher des lumières dans le plan, de créer des effets de mouvement mappés sur les pixels, et de changer les couleurs instantanément via l'application. Ils offrent un IRC élevé pour de bonnes tonalités de peau tout en permettant une liberté créative extrême.</p>",
            published: true,
            published_at: "2024-02-28 13:45:00.000Z"
        },
        {
            title_en: "Welcoming the 'Mission: Impossible' Crew",
            title_fr: "Bienvenue à l'équipe de 'Mission: Impossible'",
            slug: "welcoming-mission-impossible-crew",
            category: "news",
            excerpt_en: "We were honored to provide auxiliary equipment support for the recent stunt sequences filmed in the Atlas Mountains.",
            excerpt_fr: "Nous avons eu l'honneur de fournir un soutien en équipement auxiliaire pour les récentes séquences de cascades filmées dans les montagnes de l'Atlas.",
            content_en: "<p>Big productions require massive logistics. TV Film Solutions assisted the second unit with additional grip packages and power generation for their base camp in the remote Atlas region. It's always a pleasure to see world-class crews in action on our home turf.</p>",
            content_fr: "<p>Les grandes productions nécessitent une logistique massive. TV Film Solutions a aidé la deuxième équipe avec des packs de machinerie supplémentaires et la production d'énergie pour leur camp de base dans la région isolée de l'Atlas. C'est toujours un plaisir de voir des équipes de classe mondiale en action sur notre terrain.</p>",
            published: true,
            published_at: "2024-09-01 10:30:00.000Z"
        }
    ];

    posts.forEach((post) => {
        try {
            // Check if post exists to avoid duplicates (optional, based on slug)
            const existing = app.findCollectionByNameOrId("posts").findFirst(
                $dbx.hashExp({ slug: post.slug })
            );
            if (!existing) {
                collection.create(post);
            }
        } catch (e) {
            // Likely doesn't exist, proceed to create or handle db error
            collection.create(post);
        }
    });

}, (app) => {
    // Optional down migration: remove these posts
    // For seeds, usually leave empty or complex to track specific IDs
});

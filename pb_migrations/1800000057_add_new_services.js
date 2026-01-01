/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const servicesCol = app.findCollectionByNameOrId("services");

    const NEW_SERVICES = [
        // =====================================================================
        // MAKE-UP & HAIR
        // =====================================================================
        {
            title: "Make-up & Hair",
            title_fr: "Maquillage & Coiffure",
            slug: "makeup-hair",
            icon: "Palette", // Lucide icon
            type: "content_page",
            brief_description: "TFS provides professional make-up and hair services tailored to the specific demands of film, television, and commercial productions.",
            brief_description_fr: "TFS fournit des services professionnels de maquillage et coiffure adaptés aux exigences spécifiques des productions.",
            display_order: 9,
            is_active: true,
            hero_image_path: "./web/public/images/services/crewing/hero.jpg", // Placeholder
            sections: [
                {
                    type: "text_image",
                    title: "Experienced Team",
                    title_fr: "Équipe Expérimentée",
                    content: "Our team consists of experienced make-up artists and hair stylists skilled in character design, continuity, and on-set efficiency. From natural looks to complex character transformations, period styles, and special requirements, all services are delivered with precision and attention to detail.",
                    contentFr: "Notre équipe se compose de maquilleurs et coiffeurs expérimentés qualifiés en conception de personnages et continuité.",
                    layout: "left",
                    image: "/images/services/crewing/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Industry Standards",
                    title_fr: "Standards de l'Industrie",
                    content: "We use high-quality, industry-standard products to ensure durability under demanding shooting conditions, lighting setups, and long production hours.",
                    contentFr: "Nous utilisons des produits de haute qualité aux standards de l'industrie pour assurer la durabilité.",
                    layout: "right",
                    image: "/images/services/crewing/hero.jpg"
                }
            ],
            tags: ["Makeup", "Hair", "Styling", "SFX Makeup", "Continuity"],
            features: [
                { icon: "CheckCircle", text: "Character design experts", text_fr: "Experts en design de personnage" },
                { icon: "Clock", text: "Long-lasting products", text_fr: "Produits longue durée" },
                { icon: "User", text: "On-set efficiency", text_fr: "Efficacité sur plateau" }
            ]
        },

        // =====================================================================
        // COSTUME & WARDROBE
        // =====================================================================
        {
            title: "Costume & Wardrobe",
            title_fr: "Costume & Garde-robe",
            slug: "costume-wardrobe",
            icon: "Shirt", // Lucide icon
            type: "content_page",
            brief_description: "TFS offers comprehensive costume and wardrobe services designed to support the visual identity and storytelling of each production.",
            brief_description_fr: "TFS offre des services complets de costumes et garde-robe conçus pour soutenir l'identité visuelle.",
            display_order: 10,
            is_active: true,
            hero_image_path: "./web/public/images/services/crewing/professional-crew.jpg", // Placeholder
            sections: [
                {
                    type: "text_image",
                    title: "Design & Sourcing",
                    title_fr: "Design & Sourcing",
                    content: "Our costume department assists with costume design, sourcing, fittings, alterations, and on-set wardrobe management. Whether contemporary, period, or culturally specific looks are required, we ensure accuracy, continuity, and comfort for cast and performers.",
                    contentFr: "Notre département costumes assiste avec la conception, le sourcing, lesessayages et les retouches.",
                    layout: "left",
                    image: "/images/services/crewing/professional-crew.jpg"
                },
                {
                    type: "text_image",
                    title: "Local Partnerships",
                    title_fr: "Partenariats Locaux",
                    content: "Through partnerships with local designers, tailors, and rental houses, TFS provides flexible solutions adapted to creative vision, schedule, and budget.",
                    contentFr: "Grâce à des partenariats avec des designers locaux et tailleurs, TFS fournit des solutions flexibles.",
                    layout: "right",
                    image: "/images/services/crewing/professional-crew.jpg"
                }
            ],
            tags: ["Costume", "Wardrobe", "Period", "Styling", "Tailoring"],
            features: [
                { icon: "Scissors", text: "Custom alterations", text_fr: "Retouches sur mesure" },
                { icon: "Search", text: "Local sourcing", text_fr: "Sourcing local" },
                { icon: "Shirt", text: "Period & contemporary", text_fr: "Époque & contemporain" }
            ]
        },

        // =====================================================================
        // PROPS & SET DRESSING
        // =====================================================================
        {
            title: "Props & Set Dressing",
            title_fr: "Accessoires & Habillage",
            slug: "props-set-dressing",
            icon: "Box", // Lucide icon
            type: "content_page",
            brief_description: "TFS supports productions with prop sourcing and set dressing services to enhance authenticity and visual impact.",
            brief_description_fr: "TFS soutient les productions avec le sourcing d'accessoires et l'habillage de plateau.",
            display_order: 11,
            is_active: true,
            hero_image_path: "./web/public/images/services/scouting/hero.jpg", // Placeholder
            sections: [
                {
                    type: "text_image",
                    title: "Sourcing & Fabrication",
                    title_fr: "Sourcing & Fabrication",
                    content: "From period-accurate objects to custom-made props, our team handles research, acquisition, fabrication, transportation, and on-set coordination.",
                    contentFr: "Des objets d'époque aux accessoires sur mesure, notre équipe gère la recherche et la fabrication.",
                    layout: "left",
                    image: "/images/services/scouting/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Director's Vision",
                    title_fr: "Vision du Réalisateur",
                    content: "Every detail is carefully selected to align with the director’s vision and production design requirements.",
                    contentFr: "Chaque détail est soigneusement sélectionné pour s'aligner avec la vision du réalisateur.",
                    layout: "right",
                    image: "/images/services/scouting/hero.jpg"
                }
            ],
            tags: ["Props", "Set Dressing", "Fabrication", "Sourcing", "Art"],
            features: [
                { icon: "Search", text: "Authentic sourcing", text_fr: "Sourcing authentique" },
                { icon: "Hammer", text: "Custom fabrication", text_fr: "Fabrication sur mesure" },
                { icon: "Eye", text: "Detail oriented", text_fr: "Souci du détail" }
            ]
        },

        // =====================================================================
        // PRODUCTION DESIGN
        // =====================================================================
        {
            title: "Production Design",
            title_fr: "Design de Production",
            slug: "production-design",
            icon: "Paintbrush", // Lucide icon
            type: "content_page",
            brief_description: "TFS provides experienced art department professionals to oversee production design and visual coherence across all shooting locations.",
            brief_description_fr: "TFS fournit des professionnels expérimentés pour superviser le design de production.",
            display_order: 12,
            is_active: true,
            hero_image_path: "./web/public/images/services/scouting/morocco-locations.webp", // Placeholder
            sections: [
                {
                    type: "text_image",
                    title: "Concept to Reality",
                    title_fr: "Du Concept à la Réalité",
                    content: "Our services include concept development, set construction, scenic painting, and location adaptation.",
                    contentFr: "Nos services incluent le développement de concept, la construction de décors et l'adaptation de lieux.",
                    layout: "left",
                    image: "/images/services/scouting/morocco-locations.webp"
                },
                {
                    type: "text_image",
                    title: "Efficiency",
                    title_fr: "Efficacité",
                    content: "We work closely with directors and production designers to ensure each environment supports the narrative while remaining efficient and cost-effective.",
                    contentFr: "Nous travaillons étroitement avec les réalisateurs pour assurer que chaque environnement soutient la narration.",
                    layout: "right",
                    image: "/images/services/scouting/morocco-locations.webp"
                }
            ],
            tags: ["Art Department", "Set Construction", "Scenic", "Design", "Concept"],
            features: [
                { icon: "PenTool", text: "Concept development", text_fr: "Développement de concept" },
                { icon: "Hammer", text: "Set construction", text_fr: "Construction de décors" },
                { icon: "Palette", text: "Scenic painting", text_fr: "Peinture scénique" }
            ]
        },

        // =====================================================================
        // SECURITY & SET MANAGEMENT
        // =====================================================================
        {
            title: "Security & Set Management",
            title_fr: "Sécurité & Gestion de Plateau",
            slug: "security-management",
            icon: "ShieldAlert", // Lucide icon
            type: "content_page",
            brief_description: "To ensure smooth and uninterrupted filming, TFS offers professional security and set management services.",
            brief_description_fr: "Pour assurer un tournage fluide, TFS offre des services de sécurité professionnels.",
            display_order: 13,
            is_active: true,
            hero_image_path: "./web/public/images/services/transportation/hero.jpg", // Placeholder
            sections: [
                {
                    type: "text_image",
                    title: "Set Management",
                    title_fr: "Gestion de Plateau",
                    content: "Our teams coordinate crowd control, equipment protection, access management, and on-location safety—particularly for sensitive or high-profile productions.",
                    contentFr: "Nos équipes coordonnent le contrôle des foules, la protection de l'équipement et la sécurité sur site.",
                    layout: "left",
                    image: "/images/services/transportation/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Safety Compliance",
                    title_fr: "Conformité Sécurité",
                    content: "All operations are conducted in compliance with local regulations and production safety standards.",
                    contentFr: "Toutes les opérations sont menées en conformité avec les réglementations locales.",
                    layout: "right",
                    image: "/images/services/transportation/hero.jpg"
                }
            ],
            tags: ["Security", "Safety", "Crowd Control", "Access", "Protection"],
            features: [
                { icon: "Shield", text: "Crowd control", text_fr: "Contrôle des foules" },
                { icon: "Lock", text: "Access management", text_fr: "Gestion d'accès" },
                { icon: "FileCheck", text: "Regulatory compliance", text_fr: "Conformité réglementaire" }
            ]
        }
    ];

    NEW_SERVICES.forEach(svc => {
        // FIXED: Use findRecordsByFilter which is available in JS VM
        try {
            const existing = app.findRecordsByFilter("services", `slug='${svc.slug}'`, "", 1, 0);

            if (existing.length === 0) {
                const rec = new Record(servicesCol);
                rec.set("title", svc.title);
                rec.set("title_fr", svc.title_fr);
                rec.set("slug", svc.slug);
                rec.set("icon", svc.icon);
                rec.set("type", svc.type);
                rec.set("brief_description", svc.brief_description);
                rec.set("brief_description_fr", svc.brief_description_fr);
                rec.set("display_order", svc.display_order);
                rec.set("is_active", svc.is_active);
                rec.set("sections", svc.sections);
                rec.set("tags", svc.tags);
                rec.set("features", svc.features);

                // Handle image upload
                if (svc.hero_image_path) {
                    try {
                        const file = $filesystem.fileFromPath(svc.hero_image_path);
                        rec.set("hero_image", file);
                    } catch (err) {
                        console.log(`[Migration] Warning: Could not find/load file for ${svc.slug}: ${svc.hero_image_path} - Error: ${err}`);
                    }
                }

                app.save(rec);
                console.log(`[Migration] Created new service: ${svc.title}`);
            } else {
                console.log(`[Migration] Service already exists: ${svc.title}`);
            }
        } catch (e) {
            console.log(`[Migration] Error processing ${svc.title}: ${e}`);
        }
    });

}, (app) => {
    // Rollback logic
    const SLUGS = ["makeup-hair", "costume-wardrobe", "props-set-dressing", "production-design", "security-management"];
    SLUGS.forEach(slug => {
        try {
            // FIXED: Use findRecordsByFilter here as well
            const records = app.findRecordsByFilter("services", `slug='${slug}'`, "", 1, 0);
            if (records.length > 0) {
                app.delete(records[0]);
                console.log(`[Migration] Rolled back service: ${slug}`);
            }
        } catch (e) {
            console.log(`[Migration] Could not rollback ${slug}: ${e}`);
        }
    });
});

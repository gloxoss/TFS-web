/// <reference path="../pb_data/types.d.ts" />
/**
 * TFS Equipment Inventory Seed
 * 
 * Seeds categories and equipment from the inventory JSON data.
 * Images are stored as URLs in the specs JSON field.
 */
migrate((app) => {
    const ID_CATEGORIES = "pbc_categories0001";
    const ID_EQUIPMENT = "pbc_equipment00001";
    const ID_KIT_TEMPLATES = "pbc_kittemplates01";
    const ID_KIT_SLOTS = "pbc_kitslots000001";

    // ==========================================================================
    // HELPER: Generate slug from name
    // ==========================================================================
    function slugify(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .trim();
    }

    // ==========================================================================
    // 1. CATEGORIES
    // ==========================================================================
    const categoriesData = [
        { name: "Cameras", name_fr: "Caméras", slug: "cameras" },
        { name: "Lenses", name_fr: "Objectifs", slug: "lenses" },
        { name: "Lens Control", name_fr: "Contrôle Objectif", slug: "lens-control" },
        { name: "Support", name_fr: "Support", slug: "support" },
        { name: "Matte Boxes", name_fr: "Pare-Soleil", slug: "matte-boxes" },
        { name: "Monitors", name_fr: "Moniteurs", slug: "monitors" },
        { name: "Wireless Video", name_fr: "Vidéo Sans Fil", slug: "wireless-video" },
        { name: "Stabilization", name_fr: "Stabilisation", slug: "stabilization" },
        { name: "Power", name_fr: "Alimentation", slug: "power" },
        { name: "Lighting", name_fr: "Éclairage", slug: "lighting" }
    ];

    // ==========================================================================
    // CLEANUP: Delete in reverse order to respect cascade constraints
    // Order: kit_slots -> kit_templates -> equipment -> categories
    // ==========================================================================
    try {
        const existingSlots = app.findRecordsByFilter(ID_KIT_SLOTS, "slot_name != ''", "", 100, 0);
        existingSlots.forEach(s => app.delete(s));
        console.log(`[Cleanup] Deleted ${existingSlots.length} kit slots`);
    } catch (e) { console.log("[Cleanup] No kit slots to delete"); }

    try {
        const existingTemplates = app.findRecordsByFilter(ID_KIT_TEMPLATES, "name != ''", "", 50, 0);
        existingTemplates.forEach(t => app.delete(t));
        console.log(`[Cleanup] Deleted ${existingTemplates.length} kit templates`);
    } catch (e) { console.log("[Cleanup] No kit templates to delete"); }

    try {
        const existingEquip = app.findRecordsByFilter(ID_EQUIPMENT, "slug != ''", "", 200, 0);
        existingEquip.forEach(e => app.delete(e));
        console.log(`[Cleanup] Deleted ${existingEquip.length} equipment items`);
    } catch (e) { console.log("[Cleanup] No equipment to delete"); }

    try {
        const existingCategories = app.findRecordsByFilter(ID_CATEGORIES, "name != ''", "", 100, 0);
        existingCategories.forEach(c => app.delete(c));
        console.log(`[Cleanup] Deleted ${existingCategories.length} categories`);
    } catch (e) { console.log("[Cleanup] No categories to delete"); }

    // ==========================================================================
    // 1. CREATE CATEGORIES
    // ==========================================================================
    const categoryMap = {}; // name -> id
    categoriesData.forEach(cat => {
        const record = new Record(app.findCollectionByNameOrId(ID_CATEGORIES));
        record.set("name", cat.name);
        record.set("name_en", cat.name);
        record.set("name_fr", cat.name_fr);
        record.set("slug", cat.slug);
        app.save(record);
        categoryMap[cat.name] = record.id;
        console.log(`[Category] Created: ${cat.name}`);
    });

    // ==========================================================================
    // 2. EQUIPMENT
    // ==========================================================================
    const equipmentData = [
        // CAMERAS
        {
            name_en: "Sony Venice 2 8K",
            name_fr: "Sony Venice 2 8K",
            slug: "sony-venice-2-8k",
            brand: "Sony",
            category: "Cameras",
            description_en: "Building on the original Venice, Venice 2 features a compact design, internal recording, and an 8.6K full-frame CMOS sensor that can capture 16 stops of dynamic range.",
            description_fr: "La Venice 2 offre un design compact, un enregistrement interne et un capteur CMOS plein format 8.6K avec 16 stops de plage dynamique.",
            specs: {
                sensor_size: "35.9mm x 23.93mm",
                max_resolution: "8640 x 5760",
                dynamic_range: "16 Stops",
                media_type: "AXS Memory A-Series",
                mount: "PL / E-mount",
                codec: "X-OCN, ProRes",
                max_fps: "90fps max",

            },
            stock_available: 2,
            is_featured: true
        },
        {
            name_en: "ARRI Alexa 35",
            name_fr: "ARRI Alexa 35",
            slug: "arri-alexa-35",
            brand: "ARRI",
            category: "Cameras",
            description_en: "ARRI's compact Alexa 35 features a 4.6K Super 35-format sensor capable of capturing 17 stops of dynamic range with exposure index from 160 to 6400.",
            description_fr: "L'Alexa 35 compacte offre un capteur Super 35 4.6K avec 17 stops de plage dynamique.",
            specs: {
                sensor_size: "28.0 x 19.2mm",
                max_resolution: "4608 x 3164",
                dynamic_range: "17 Stops",
                media_type: "Codex Compact Drives",
                mount: "PL",
                codec: "ProRes, ARRIRAW",
                max_fps: "120fps max",

            },
            stock_available: 2,
            is_featured: true
        },
        {
            name_en: "ARRI Alexa Mini LF",
            name_fr: "ARRI Alexa Mini LF",
            slug: "arri-alexa-mini-lf",
            brand: "ARRI",
            category: "Cameras",
            description_en: "The Alexa Mini LF combines the Alexa Mini's compact form factor with the Alexa LF's large-format sensor.",
            description_fr: "L'Alexa Mini LF combine le format compact de l'Alexa Mini avec le capteur grand format de l'Alexa LF.",
            specs: {
                sensor_size: "36.7mm x 25.5mm",
                max_resolution: "4448 x 3096",
                dynamic_range: "14+ Stops",
                media_type: "Codex Compact Drives",
                mount: "LPL / PL",
                codec: "ProRes, ARRIRAW",
                max_fps: "100fps max",

            },
            stock_available: 1,
            is_featured: true
        },
        {
            name_en: "ARRI Alexa Mini",
            name_fr: "ARRI Alexa Mini",
            slug: "arri-alexa-mini",
            brand: "ARRI",
            category: "Cameras",
            description_en: "The compact and lightweight Alexa Mini. Versatile and lightweight for handheld, gimbal, and drone work.",
            description_fr: "L'Alexa Mini compacte et légère pour le travail à main, nacelle et drone.",
            specs: {
                sensor_size: "28.3 mm x 18.2 mm",
                max_resolution: "3168 x 2202",
                dynamic_range: "14+ Stops",
                media_type: "CFast 2.0",
                mount: "PL",
                codec: "ProRes, ARRIRAW",
                max_fps: "200fps max",

            },
            stock_available: 2,
            is_featured: false
        },
        {
            name_en: "Sony PXW-FX9",
            name_fr: "Sony PXW-FX9",
            slug: "sony-pxw-fx9",
            brand: "Sony",
            category: "Cameras",
            description_en: "The Sony FX9 packages Sony's 6K full-frame Exmor R sensor into a compact cinema camera for documentary and narrative production.",
            description_fr: "La FX9 intègre le capteur Exmor R 6K plein format dans un boîtier compact pour documentaire et fiction.",
            specs: {
                sensor_size: "35.7 mm x 18.8 mm",
                max_resolution: "6048 x 4032",
                dynamic_range: "15+ Stops",
                media_type: "CFexpress Type A / XQD",
                mount: "E-mount",
                codec: "ProRes (via extension)",
                max_fps: "60fps",

            },
            stock_available: 3,
            is_featured: false
        },
        {
            name_en: "Sony FX3",
            name_fr: "Sony FX3",
            slug: "sony-fx3",
            brand: "Sony",
            category: "Cameras",
            description_en: "Compact full-frame camera that delivers stunning 4K footage with 15 stops of dynamic range. Features dual base ISO.",
            description_fr: "Caméra plein format compacte offrant une qualité 4K exceptionnelle avec 15 stops de plage dynamique.",
            specs: {
                sensor_size: "35.9 mm x 23.93 mm",
                max_resolution: "4240 x 2832",
                dynamic_range: "15 Stops",
                media_type: "CFexpress Type-A",
                mount: "E-mount",
                codec: "XAVC S-I",
                max_fps: "120fps (4K)",

            },
            stock_available: 4,
            is_featured: false
        },
        {
            name_en: "RED DSMC2 Monstro 8K VV",
            name_fr: "RED DSMC2 Monstro 8K VV",
            slug: "red-dsmc2-monstro-8k-vv",
            brand: "RED",
            category: "Cameras",
            description_en: "The RED Monstro 8K VV sensor can capture up to 60 fps full format, housed in the DSMC2 body.",
            description_fr: "Le capteur Monstro 8K VV capture jusqu'à 60 fps en plein format dans le boîtier DSMC2.",
            specs: {
                sensor_size: "40.96mm x 21.6mm",
                max_resolution: "8192 x 4320",
                dynamic_range: "17+ Stops",
                media_type: "RED Mini Mag",
                mount: "PL / Canon",
                codec: "R3D, ProRes, DNxHD",
                max_fps: "60fps full sensor",

            },
            stock_available: 1,
            is_featured: true
        },

        // LENSES
        {
            name_en: "Cooke S4/i Prime Set",
            name_fr: "Set de Primes Cooke S4/i",
            slug: "cooke-s4i-prime-set",
            brand: "Cooke",
            category: "Lenses",
            type: "Spherical",
            description_en: "Cooke S4/i focal lengths range from 12mm to 180mm, all with T2 aperture. The classic 'Cooke Look'.",
            description_fr: "Les Cooke S4/i vont de 12mm à 180mm, tous à T2. Le 'Cooke Look' classique.",
            specs: {
                mount: "PL",
                aperture: "T2",
                coverage: "Super 35",
                focal_range: "12-180mm",

            },
            stock_available: 1,
            is_featured: true
        },
        {
            name_en: "ARRI / Zeiss Master Anamorphic Set",
            name_fr: "Set Master Anamorphic ARRI / Zeiss",
            slug: "arri-zeiss-master-anamorphic-set",
            brand: "Zeiss",
            category: "Lenses",
            type: "Anamorphic",
            description_en: "Focal lengths from 28mm to 135mm at T1.9. Premium anamorphic with exceptional sharpness.",
            description_fr: "Focales de 28mm à 135mm à T1.9. Anamorphique premium avec netteté exceptionnelle.",
            specs: {
                mount: "PL",
                aperture: "T1.9",
                coverage: "Super 35",
                focal_range: "28-135mm",

            },
            stock_available: 1,
            is_featured: true
        },
        {
            name_en: "Atlas Orion Anamorphic Set",
            name_fr: "Set Atlas Orion Anamorphic",
            slug: "atlas-orion-anamorphic-set",
            brand: "Atlas",
            category: "Lenses",
            type: "Anamorphic",
            description_en: "Atlas Orion primes from 32mm to 100mm at T2. Classic anamorphic look with controlled flares.",
            description_fr: "Les Atlas Orion de 32mm à 100mm à T2. Look anamorphique classique avec flares contrôlés.",
            specs: {
                mount: "PL",
                aperture: "T2",
                coverage: "Super 35",
                focal_range: "32-100mm",

            },
            stock_available: 1,
            is_featured: false
        },
        {
            name_en: "ARRI Signature Primes Set",
            name_fr: "Set ARRI Signature Primes",
            slug: "arri-signature-primes-set",
            brand: "ARRI",
            category: "Lenses",
            type: "Large Format",
            description_en: "12mm to 280mm at T1.8. Designed for large-format with warm, smooth skin tones.",
            description_fr: "De 12mm à 280mm à T1.8. Conçus pour le grand format avec des tons chair chauds.",
            specs: {
                mount: "LPL",
                aperture: "T1.8",
                coverage: "Large Format / Full Frame",
                focal_range: "12-280mm",

            },
            stock_available: 1,
            is_featured: true
        },
        {
            name_en: "Zeiss Supreme Prime Set",
            name_fr: "Set Zeiss Supreme Prime",
            slug: "zeiss-supreme-prime-set",
            brand: "Zeiss",
            category: "Lenses",
            type: "Large Format",
            description_en: "46.3mm image circle coverage with T1.5 maximum aperture across most of the range.",
            description_fr: "Couverture de cercle d'image de 46.3mm avec ouverture maximale T1.5.",
            specs: {
                mount: "PL",
                aperture: "T1.5",
                coverage: "Full Frame",

            },
            stock_available: 1,
            is_featured: false
        },
        {
            name_en: "ARRI Alura 45-250mm T2.6",
            name_fr: "ARRI Alura 45-250mm T2.6",
            slug: "arri-alura-45-250mm",
            brand: "ARRI",
            category: "Lenses",
            type: "Zoom",
            description_en: "Telephoto zoom with T2.6 throughout its range and cine-style ergonomics.",
            description_fr: "Zoom téléobjectif à T2.6 sur toute sa plage avec ergonomie cinéma.",
            specs: {
                mount: "PL",
                aperture: "T2.6",
                coverage: "Super 35",
                focal_length: "45-250mm",

            },
            stock_available: 1,
            is_featured: false
        },
        {
            name_en: "Canon Cine-Servo 17-120mm",
            name_fr: "Canon Cine-Servo 17-120mm",
            slug: "canon-cine-servo-17-120mm",
            brand: "Canon",
            category: "Lenses",
            type: "Zoom",
            description_en: "Broadcast ENG style motorized zoom with cinema optical precision. 4K ready.",
            description_fr: "Zoom motorisé style ENG broadcast avec précision optique cinéma. Compatible 4K.",
            specs: {
                mount: "PL",
                aperture: "T2.95-3.9",
                coverage: "Super 35",
                focal_length: "17-120mm",

            },
            stock_available: 2,
            is_featured: false
        },

        // LENS CONTROL
        {
            name_en: "ARRI Hi-5 Wireless Handheld Set",
            name_fr: "Set ARRI Hi-5 Sans Fil",
            slug: "arri-hi-5-wireless-set",
            brand: "ARRI",
            category: "Lens Control",
            description_en: "3-axis FIZ control compatible with Alexa 35, Mini LF and cforce motors.",
            description_fr: "Contrôle FIZ 3 axes compatible Alexa 35, Mini LF et moteurs cforce.",
            specs: {
                channels: "3 Axis",
                wireless_module: "RF-2400",
                compatibility: "ARRI Cameras",

            },
            stock_available: 2,
            is_featured: false
        },
        {
            name_en: "ARRI WCU-4 Wireless Compact Unit",
            name_fr: "ARRI WCU-4 Unité Compacte Sans Fil",
            slug: "arri-wcu-4",
            brand: "ARRI",
            category: "Lens Control",
            description_en: "3-axis handheld controller with integrated lens display.",
            description_fr: "Contrôleur 3 axes avec écran d'objectif intégré.",
            specs: {
                channels: "3 Axis",
                features: "Vibrating Markers, Backlit Knob",

            },
            stock_available: 3,
            is_featured: false
        },
        {
            name_en: "Tilta Nucleus-M Wireless FIZ",
            name_fr: "Tilta Nucleus-M Sans Fil FIZ",
            slug: "tilta-nucleus-m",
            brand: "Tilta",
            category: "Lens Control",
            description_en: "Wireless lens control with 1000' range and two motors included.",
            description_fr: "Contrôle d'objectif sans fil avec portée de 300m et deux moteurs inclus.",
            specs: {
                range: "1000 ft",
                motors: "2 Included",
                gear_pitch: "0.8 MOD",

            },
            stock_available: 5,
            is_featured: false
        },

        // SUPPORT
        {
            name_en: "OConnor Ultimate 2575D Fluid Head",
            name_fr: "Tête Fluide OConnor Ultimate 2575D",
            slug: "oconnor-2575d-fluid-head",
            brand: "OConnor",
            category: "Support",
            type: "Fluid Heads",
            description_en: "Industry standard fluid head supporting up to 90 lbs with sinusoidal counterbalance.",
            description_fr: "Tête fluide standard supportant jusqu'à 40 kg avec contrepoids sinusoïdal.",
            specs: {
                payload: "90 lbs",
                base: "Mitchell / 150mm",
                tilt_range: "+/- 90°",

            },
            stock_available: 3,
            is_featured: false
        },
        {
            name_en: "Sachtler System 25 EFP 2",
            name_fr: "Sachtler System 25 EFP 2",
            slug: "sachtler-system-25",
            brand: "Sachtler",
            category: "Support",
            type: "Tripods",
            description_en: "Heavy duty tripod system with carbon fiber legs and 18-step counterbalance.",
            description_fr: "Trépied robuste avec jambes carbone et contrepoids 18 positions.",
            specs: {
                payload: "77 lbs",
                bowl: "150mm",
                legs: "Carbon Fiber",

            },
            stock_available: 2,
            is_featured: false
        },

        // MONITORS
        {
            name_en: "SmallHD ULTRA 7 Bolt 6 RX",
            name_fr: "SmallHD ULTRA 7 Bolt 6 RX",
            slug: "smallhd-ultra-7-bolt-6",
            brand: "SmallHD",
            category: "Monitors",
            type: "On-Camera",
            description_en: "Ultra-bright 7-inch monitor with integrated Bolt 6 Receiver. 2300 nits.",
            description_fr: "Moniteur 7 pouces ultra-brillant avec récepteur Bolt 6 intégré. 2300 nits.",
            specs: {
                size: "7 inch",
                brightness: "2300 nits",
                resolution: "1920 x 1080",
                wireless: "Bolt 6 RX Built-in",

            },
            stock_available: 4,
            is_featured: false
        },
        {
            name_en: "Sony PVMA170 17\" OLED Monitor",
            name_fr: "Moniteur OLED Sony PVMA170 17\"",
            slug: "sony-pvma170-oled",
            brand: "Sony",
            category: "Monitors",
            type: "Production",
            description_en: "Professional OLED Production Monitor with true black reproduction.",
            description_fr: "Moniteur OLED professionnel avec reproduction de noirs parfaits.",
            specs: {
                size: "17 inch",
                panel_type: "OLED",
                resolution: "1920 x 1080",
                inputs: "SDI, HDMI, Composite",

            },
            stock_available: 3,
            is_featured: false
        },

        // WIRELESS VIDEO
        {
            name_en: "Teradek Bolt 6 LT 1500 Kit",
            name_fr: "Kit Teradek Bolt 6 LT 1500",
            slug: "teradek-bolt-6-lt-1500",
            brand: "Teradek",
            category: "Wireless Video",
            description_en: "Lossless HD video transmission up to 1500' with 6GHz frequency.",
            description_fr: "Transmission vidéo HD sans perte jusqu'à 450m en 6GHz.",
            specs: {
                range: "1500 ft",
                resolution: "Up to 4K30",
                inputs: "3G-SDI / HDMI",

            },
            stock_available: 3,
            is_featured: false
        },

        // STABILIZATION
        {
            name_en: "DJI Ronin 2 Professional Combo",
            name_fr: "DJI Ronin 2 Combo Professionnel",
            slug: "dji-ronin-2-professional",
            brand: "DJI",
            category: "Stabilization",
            description_en: "High-end 3-axis stabilization for professional cinema cameras. 30 lb payload.",
            description_fr: "Stabilisation 3 axes haut de gamme pour caméras cinéma. Charge 14 kg.",
            specs: {
                payload: "30 lbs",
                battery: "Dual Hot-Swappable",
                compatibility: "Cinema Cameras",

            },
            stock_available: 2,
            is_featured: false
        },

        // POWER
        {
            name_en: "bebob CUBE 1200 Multi-Voltage Battery",
            name_fr: "Batterie bebob CUBE 1200 Multi-Voltage",
            slug: "bebob-cube-1200",
            brand: "Bebob",
            category: "Power",
            description_en: "1176Wh battery providing 12V, 24V, 48V, and USB outputs.",
            description_fr: "Batterie 1176Wh fournissant 12V, 24V, 48V et sorties USB.",
            specs: {
                capacity: "1176Wh",
                outputs: "12V, 24V, 48V, USB",
                weight: "19.7 lbs",

            },
            stock_available: 2,
            is_featured: false
        },

        // MATTE BOXES
        {
            name_en: "ARRI LMB 4x5 Matte Box Pro Set",
            name_fr: "ARRI LMB 4x5 Matte Box Pro Set",
            slug: "arri-lmb-4x5-pro",
            brand: "ARRI",
            category: "Matte Boxes",
            description_en: "Modular matte box system with 3 stages for 4x5.65 and 4x4 filters.",
            description_fr: "Système de pare-soleil modulaire à 3 étages pour filtres 4x5.65 et 4x4.",
            specs: {
                type: "Clip-on / Rod mounted",
                filters: "4x5.65 / 4x4",
                stages: "3",

            },
            stock_available: 4,
            is_featured: false
        }
    ];

    // Delete existing equipment and create fresh
    const existingEquip = app.findRecordsByFilter(ID_EQUIPMENT, "slug != ''", "", 200, 0);
    existingEquip.forEach(e => app.delete(e));

    const equipmentMap = {}; // slug -> id
    const equipCollection = app.findCollectionByNameOrId(ID_EQUIPMENT);

    equipmentData.forEach(item => {
        const record = new Record(equipCollection);
        record.set("name", item.name_en);
        record.set("name_en", item.name_en);
        record.set("name_fr", item.name_fr);
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", categoryMap[item.category]);
        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);
        record.set("specs", item.specs);
        record.set("stock_available", item.stock_available);
        record.set("visibility", true);
        record.set("is_featured", item.is_featured || false);

        if (item.type) record.set("type", item.type);
        if (item.specs.mount) record.set("mount", item.specs.mount);
        if (item.specs.sensor_size) record.set("sensor_size", item.specs.sensor_size);
        if (item.specs.coverage) record.set("sensor_size", item.specs.coverage);
        if (item.specs.max_resolution) record.set("resolution", item.specs.max_resolution);

        app.save(record);
        equipmentMap[item.slug] = record.id;
        console.log(`[Equipment] Created: ${item.name_en}`);
    });

    // ==========================================================================
    // 3. KIT TEMPLATES
    // ==========================================================================
    const kitTemplatesData = [
        {
            name: "Sony Venice 2 Cine Package",
            description: "Ultimate full-frame cinema package with Venice 2, fluid head, and support.",
            main_product_slug: "sony-venice-2-8k",
            base_price_modifier: -300
        },
        {
            name: "ARRI Alexa 35 Production Package",
            description: "Complete cinema package for high-end production with Alexa 35.",
            main_product_slug: "arri-alexa-35",
            base_price_modifier: -200
        },
        {
            name: "Sony FX3 Run & Gun Kit",
            description: "Lightweight documentary and fast-paced shooting setup.",
            main_product_slug: "sony-fx3",
            base_price_modifier: 0
        }
    ];

    // Delete existing templates
    const existingTemplates = app.findRecordsByFilter(ID_KIT_TEMPLATES, "name != ''", "", 50, 0);
    existingTemplates.forEach(t => app.delete(t));

    const templateMap = {}; // name -> id
    const templateCollection = app.findCollectionByNameOrId(ID_KIT_TEMPLATES);

    kitTemplatesData.forEach(template => {
        const mainProductId = equipmentMap[template.main_product_slug];
        if (!mainProductId) {
            console.log(`[Kit] WARNING: Main product not found: ${template.main_product_slug}`);
            return;
        }

        const record = new Record(templateCollection);
        record.set("name", template.name);
        record.set("description", template.description);
        record.set("main_product_id", mainProductId);
        record.set("base_price_modifier", template.base_price_modifier);
        app.save(record);
        templateMap[template.name] = record.id;
        console.log(`[Kit Template] Created: ${template.name}`);
    });

    // ==========================================================================
    // 4. KIT SLOTS
    // ==========================================================================
    const kitSlotsData = [
        // Venice 2 Package
        {
            template_name: "Sony Venice 2 Cine Package",
            slot_name: "Fluid Head",
            category: "Support",
            recommended_slugs: []
        },
        {
            template_name: "Sony Venice 2 Cine Package",
            slot_name: "Tripod",
            category: "Support",
            recommended_slugs: []
        },
        {
            template_name: "Sony Venice 2 Cine Package",
            slot_name: "Monitor",
            category: "Monitors",
            recommended_slugs: []
        },
        // Alexa 35 Package
        {
            template_name: "ARRI Alexa 35 Production Package",
            slot_name: "Lens Control",
            category: "Lens Control",
            recommended_slugs: []
        },
        {
            template_name: "ARRI Alexa 35 Production Package",
            slot_name: "Monitor",
            category: "Monitors",
            recommended_slugs: []
        },
        // FX3 Kit
        {
            template_name: "Sony FX3 Run & Gun Kit",
            slot_name: "Lens Control",
            category: "Lens Control",
            recommended_slugs: []
        },
        {
            template_name: "Sony FX3 Run & Gun Kit",
            slot_name: "Stabilization",
            category: "Stabilization",
            recommended_slugs: []
        }
    ];

    // Delete existing slots
    const existingSlots = app.findRecordsByFilter(ID_KIT_SLOTS, "slot_name != ''", "", 100, 0);
    existingSlots.forEach(s => app.delete(s));

    const slotCollection = app.findCollectionByNameOrId(ID_KIT_SLOTS);
    let slotOrder = 0;

    kitSlotsData.forEach(slot => {
        const templateId = templateMap[slot.template_name];
        const catId = categoryMap[slot.category];

        if (!templateId || !catId) {
            console.log(`[Slot] WARNING: Missing template or category for: ${slot.slot_name}`);
            return;
        }

        const recommendedIds = slot.recommended_slugs
            .map(slug => equipmentMap[slug])
            .filter(Boolean);

        const record = new Record(slotCollection);
        record.set("template_id", templateId);
        record.set("slot_name", slot.slot_name);
        record.set("category_id", catId);
        record.set("recommended_ids", recommendedIds);
        record.set("display_order", slotOrder++);
        app.save(record);
        console.log(`[Kit Slot] Created: ${slot.template_name} -> ${slot.slot_name}`);
    });

    console.log("\n[Migration] Equipment seed complete!");
    console.log(`  - Categories: ${Object.keys(categoryMap).length}`);
    console.log(`  - Equipment: ${Object.keys(equipmentMap).length}`);
    console.log(`  - Kit Templates: ${Object.keys(templateMap).length}`);
    console.log(`  - Kit Slots: ${slotOrder}`);

}, (app) => {
    // Rollback - just log (data deletion handled in forward migration)
    console.log("[Migration] Rollback not needed - forward migration clears data first");
});

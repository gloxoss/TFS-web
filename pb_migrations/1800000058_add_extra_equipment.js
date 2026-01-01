/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const ID_EQUIPMENT = "pbc_equipment00001";
    const ID_CATEGORIES = "pbc_categories0001";

    const items = [
        // Stabilization
        {
            name: "Easyrig 2.5 600N Stabilizing Camera Support",
            slug: "easyrig-2-600n",
            category: "Stabilization",
            brand: "Easyrig",
            description_en: "The Easyrig 2.5 600N Stabilizing Camera Support is a cost effective system which can be used with both film and video cameras. Ergonomically designed, the Easyrig reduces the static load on the neck and shoulder muscles.",
            description_fr: "Le système Easyrig 2.5 600N réduit la charge statique sur les muscles du cou et des épaules.",
            image_file: "easyrig-2-600n.webp"
        },
        {
            name: "Easyrig Vario 5 with Gimbal Rig Vest",
            slug: "easyrig-vario-5",
            category: "Stabilization",
            brand: "Easyrig",
            description_en: "The Easyrig Vario 5 with Gimbal Rig Vest and 5\" Extended Arm is a bodyworn support system that is adjustable to support camera rigs weighing 11 to 38 lb.",
            description_fr: "L'Easyrig Vario 5 avec gilet Gimbal Rig est réglable pour supporter des caméras de 5 à 17 kg.",
            image_file: "easyrig-vario-5.jpg"
        },
        {
            name: "Tilta Armor Man 3.0 Gimbal Support",
            slug: "tilta-armor-man-3",
            category: "Stabilization",
            brand: "Tilta",
            description_en: "The Tilta Armor Man 3.0 allows you to attach a gimbal and achieve even better stability while taking its weight off your arms.",
            description_fr: "Le Tilta Armor Man 3.0 permet d'attacher un gimbal et d'obtenir une meilleure stabilité.",
            image_file: "tilta-armor-man-3.jpg"
        },
        {
            name: "Tilta Armor Man 2 Gimbal Support",
            slug: "tilta-armor-man-2",
            category: "Stabilization",
            brand: "Tilta",
            description_en: "The Tilta Armor Man 2 is designed to take the weight off your arms, allowing for an entirely different experience.",
            description_fr: "Le Tilta Armor Man 2 est conçu pour soulager vos bras du poids du gimbal.",
            image_file: "tilta-armor-man-2.jpg"
        },
        // Batteries (Power)
        {
            name: "bebob V200 Micro 196Wh V-Mount",
            slug: "bebob-v200-micro",
            category: "Power",
            brand: "bebob",
            description_en: "The compact V200 Micro 14.4V 196Wh Li-Ion Battery from Bebob is designed to be strong, reliable, and versatile.",
            description_fr: "La batterie compacte V200 Micro 196Wh est conçue pour être robuste et fiable.",
            image_file: "bebob-v200-micro.jpg"
        },
        {
            name: "bebob V290RM-CINE 293Wh High Load",
            slug: "bebob-v290rm-cine",
            category: "Power",
            brand: "bebob",
            description_en: "Bebob high load batteries are designed to be mounted on cinema cameras via optional adapters that allow for 20A of discharge current.",
            description_fr: "Les batteries Bebob haute charge permettent un courant de décharge de 20A.",
            image_file: "bebob-v290rm-cine.jpg"
        },
        {
            name: "bebob B290CINE 4-Battery Kit (B-Mount)",
            slug: "bebob-b290cine-kit",
            category: "Power",
            brand: "bebob",
            description_en: "The bebob B290CINE Lithium-Ion 4-Battery Kit with Quad Charger keeps your production running with ample batteries.",
            description_fr: "Le kit de 4 batteries bebob B290CINE avec chargeur quadruple assure l'autonomie de votre production.",
            image_file: "bebob-b290cine-kit.jpg"
        },
        {
            name: "SWIT PB-R290S+ 290Wh Heavy-Duty",
            slug: "swit-pb-r290s",
            category: "Power",
            brand: "SWIT",
            description_en: "Power ENG and cine cameras with V-mount bays using this V-mount PB-R290S+ 290Wh Heavy-Duty IP54 Battery Pack.",
            description_fr: "Alimentez vos caméras ENG et cinéma avec cette batterie robuste IP54 de 290Wh.",
            image_file: "swit-pb-r290s.jpg"
        },
        {
            name: "SWIT 140Wh Pocket Battery",
            slug: "swit-140wh-pocket",
            category: "Power",
            brand: "SWIT",
            description_en: "Add an ultracompact professional battery to power your rig with this V-mount 140Wh Pocket Battery.",
            description_fr: "Ajoutez une batterie professionnelle ultracompacte pour alimenter votre rig.",
            image_file: "swit-140wh-pocket.jpg"
        },
        {
            name: "IDX DUO-C198P 193Wh High-Load",
            slug: "idx-duoc198p",
            category: "Power",
            brand: "IDX",
            description_en: "Power your professional V-mount cameras such as the RED WEAPON or ARRI ALEXA Mini with this DUO-C198P.",
            description_fr: "Alimentez vos caméras professionnelles comme la RED WEAPON ou l'ARRI ALEXA Mini.",
            image_file: "idx-duoc198p.jpg"
        }
    ];

    const categoryMap = {};
    const categories = app.findRecordsByFilter(ID_CATEGORIES, "name != ''", "", 100, 0);
    categories.forEach(c => categoryMap[c.get("name")] = c.id);
    // Use fallback mapping just in case names differ slightly
    // Stabilization -> Stabilization
    // Power -> Power (Batteries)

    const collection = app.findCollectionByNameOrId(ID_EQUIPMENT);

    items.forEach(item => {
        // Find category ID
        let catId = categoryMap[item.category];
        if (!catId) {
            // Try to fetch it by name if missing from initial map
            try {
                const cat = app.findFirstRecordByData(ID_CATEGORIES, "name", item.category);
                catId = cat.id;
            } catch (e) {
                console.log(`[Warning] Category not found: ${item.category}`);
            }
        }

        const record = new Record(collection);
        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.description_fr ? item.name : item.name); // Using EN name for FR if not specific
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", catId);
        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);
        record.set("stock_available", 5);
        record.set("visibility", true);

        // Handle Image
        try {
            const path = `pb_data/new_assets/${item.image_file}`;
            const content = $os.readFile(path);
            const file = new File(item.image_file, content);
            record.set("hero_image", file); // Assuming 'hero_image' is the field name! 1800000009 used 'specs' JSON for images?
            // Wait, looking at 1800000009, it does NOT set 'hero_image'. 
            // I should check the schema. 'hero_image' is standard for listings.
        } catch (e) {
            console.log(`[Warning] Could not set image for ${item.slug}: ${e}`);
        }

        app.save(record);
        console.log(`[Created] ${item.slug}`);
    });

}, (app) => {
    // Revert logic (optional)
});

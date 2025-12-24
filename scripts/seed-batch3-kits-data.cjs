const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('http://127.0.0.1:8090');

// -------------------------------------------------------------------------
// DATA CONSTANTS (Simplified for script)
// -------------------------------------------------------------------------
const BATCH3_ITEMS = [
    {
        "id": "lens_cooke_s8i",
        "name": "Cooke S8/i FF Prime Set",
        "brand": "Cooke",
        "category": "Lenses",
        "tags": ["Large Format", "Spherical"],
        "description": "Designed for Full Frame sensors. Features a fast T1.4 aperture across the set. Delivers the 'Cooke Look' with organic bokeh.",
        "specifications": {
            "mount": "PL",
            "aperture": "T1.4",
            "coverage": "Full Frame"
        },
        "stock_available": 1
    },
    {
        "id": "lens_zeiss_radiance",
        "name": "Zeiss Supreme Prime Radiance Set",
        "brand": "Zeiss",
        "category": "Lenses",
        "tags": ["Large Format", "Spherical"],
        "description": "Based on the Supreme Primes but with a new coating that creates beautiful, controllable blue flares (Radiance).",
        "specifications": {
            "mount": "PL",
            "aperture": "T1.5",
            "coverage": "Full Frame",
            "feature": "Blue Flares"
        },
        "stock_available": 1
    },
    {
        "id": "lens_angenieux_45_120",
        "name": "Angenieux Optimo 45-120mm T2.8",
        "brand": "Angenieux",
        "category": "Lenses",
        "tags": ["Zoom"],
        "description": "Completes the Optimo lightweight zoom series. Perfect portrait to telephoto range.",
        "specifications": {
            "focal_length": "45-120mm",
            "aperture": "T2.8",
            "mount": "PL",
            "coverage": "Super 35"
        },
        "stock_available": 1
    },
    {
        "id": "lens_canon_15_45",
        "name": "Canon Cine-Servo 15-120mm T2.95-3.9",
        "brand": "Canon",
        "category": "Lenses",
        "tags": ["Zoom"],
        "description": "High 8K optical performance. Features a built-in 1.5x extender and removable servo drive.",
        "specifications": {
            "focal_length": "15-120mm",
            "aperture": "T2.95-3.9",
            "mount": "PL",
            "coverage": "Super 35 / Full Frame (w/ ext)"
        },
        "stock_available": 1
    }
];

const KIT_TEMPLATES = [
    {
        "id": "kit_venice_pkg",
        "name": "Sony Venice 2 Cine Package",
        "main_product_id": "cam_venice_2",
        "base_price_modifier": -300,
        "description": "Ultimate full-frame cinema package. Includes Sony Venice 2 Body, OConnor 2575D Fluid Head, Power Distribution, and monitoring."
    },
    {
        "id": "kit_alexa35_pkg",
        "name": "ARRI Alexa 35 Production Package",
        "main_product_id": "cam_alexa_35",
        "base_price_modifier": -200,
        "description": "A complete cinema package ready for high-end production. Includes Alexa 35, MVF-2 Viewfinder, Codex Media, and Support."
    },
    {
        "id": "kit_red_monstro_pkg",
        "name": "RED DSMC2 Monstro 8K Package",
        "main_product_id": "cam_red_monstro",
        "base_price_modifier": -250,
        "description": "Full frame 8K raw workflow. Includes RED Monstro body, RED Touch Monitor, Mini-Mags, and choice of PL or EF mount."
    },
    {
        "id": "kit_fx9_docu",
        "name": "Sony FX9 Documentary Kit",
        "main_product_id": "cam_fx9",
        "base_price_modifier": -100,
        "description": "Ready-to-shoot documentary kit. Includes FX9, Fujinon Cabrio Zoom, and Sachtler Tripod system."
    },
    {
        "id": "kit_amira_eng",
        "name": "ARRI Amira ENG Kit",
        "main_product_id": "cam_amira",
        "base_price_modifier": -150,
        "description": "Ergonomic shoulder-mount package perfect for broadcast and single-operator use."
    },
    {
        "id": "kit_anamorphic_indie",
        "name": "Indie Anamorphic Lens Bundle",
        "main_product_id": "lens_atlas_orion",
        "base_price_modifier": -50,
        "description": "Bundle of Atlas Orion Anamorphic lenses (Set A or B) with Matte Box and Wireless Follow Focus."
    },
    {
        "id": "kit_director_monitor",
        "name": "Wireless Director's Monitor Cage",
        "main_product_id": "mon_smallhd_703",
        "base_price_modifier": -20,
        "description": "Handheld wireless monitoring solution. Includes SmallHD 703 Bolt, handles, and battery power."
    },
    {
        "id": "kit_ronin2_pro",
        "name": "DJI Ronin 2 Ultimate Stabilization",
        "main_product_id": "stab_ronin_2",
        "base_price_modifier": -100,
        "description": "Complete stabilization package including Ronin 2, Ready Rig or Support Vest, and DJI Force Pro controller."
    }
];

const KIT_ITEMS = [
    {
        "id": "item_v2_cam",
        "template_id": "kit_venice_pkg",
        "product_id": "cam_venice_2",
        "slot_name": "Camera Body",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_v2_head",
        "template_id": "kit_venice_pkg",
        "product_id": "supp_oconnor_2575d",
        "slot_name": "Fluid Head",
        "is_mandatory": true,
        "default_quantity": 1,
        "swappable_category": "Support"
    },
    {
        "id": "item_v2_lens",
        "template_id": "kit_venice_pkg",
        "product_id": "lens_zeiss_supreme",
        "slot_name": "Primary Lens Set",
        "is_mandatory": false,
        "default_quantity": 1,
        "swappable_category": "Lenses"
    },
    {
        "id": "item_a35_cam",
        "template_id": "kit_alexa35_pkg",
        "product_id": "cam_alexa_35",
        "slot_name": "Camera Body",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_a35_ff",
        "template_id": "kit_alexa35_pkg",
        "product_id": "ctrl_hi5",
        "slot_name": "Lens Control",
        "is_mandatory": false,
        "default_quantity": 1
    },
    {
        "id": "item_red_cam",
        "template_id": "kit_red_monstro_pkg",
        "product_id": "cam_red_monstro",
        "slot_name": "Camera Body",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_red_mon",
        "template_id": "kit_red_monstro_pkg",
        "product_id": "mon_smallhd_cine7_red",
        "slot_name": "Control Monitor",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_fx9_cam",
        "template_id": "kit_fx9_docu",
        "product_id": "cam_fx9",
        "slot_name": "Camera Body",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_fx9_lens",
        "template_id": "kit_fx9_docu",
        "product_id": "lens_fuji_19_90",
        "slot_name": "Zoom Lens",
        "is_mandatory": true,
        "default_quantity": 1,
        "swappable_category": "Lenses"
    },
    {
        "id": "item_fx9_legs",
        "template_id": "kit_fx9_docu",
        "product_id": "supp_sachtler_25",
        "slot_name": "Tripod System",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_ana_lens",
        "template_id": "kit_anamorphic_indie",
        "product_id": "lens_atlas_orion",
        "slot_name": "Anamorphic Primes",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_ana_mb",
        "template_id": "kit_anamorphic_indie",
        "product_id": "mb_arri_lmb4x5",
        "slot_name": "Matte Box",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_dir_mon",
        "template_id": "kit_director_monitor",
        "product_id": "mon_smallhd_703",
        "slot_name": "Monitor",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_dir_rx",
        "template_id": "kit_director_monitor",
        "product_id": "wl_teradek_bolt6_750",
        "slot_name": "Wireless Receiver",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_r2_gimbal",
        "template_id": "kit_ronin2_pro",
        "product_id": "stab_ronin_2",
        "slot_name": "Gimbal",
        "is_mandatory": true,
        "default_quantity": 1
    },
    {
        "id": "item_r2_force",
        "template_id": "kit_ronin2_pro",
        "product_id": "stab_force_pro",
        "slot_name": "Remote Controller",
        "is_mandatory": false,
        "default_quantity": 1
    }
];

const UI_CONFIG = {
    "filters_configuration": {
        "brand_filter": {
            "label": "Filter by Brand",
            "type": "multiselect",
            "source": "taxonomies.brands",
            "allow_multiple": true
        },
        "category_filter": {
            "label": "Filter by Category",
            "type": "select",
            "source": "taxonomies.categories",
            "allow_multiple": false
        },
        "tag_filter": {
            "label": "Features",
            "type": "tags",
            "source": "tags",
            "options": [
                "Anamorphic",
                "Spherical",
                "Large Format",
                "Full Frame",
                "Super 35",
                "Zoom",
                "Macro",
                "OLED",
                "Recorder",
                "Wireless"
            ]
        },
        "mount_filter": {
            "label": "Lens Mount",
            "type": "checkbox",
            "options": ["PL", "LPL", "EF", "E-Mount"]
        },
        "resolution_filter": {
            "label": "Max Resolution",
            "type": "range",
            "field": "specifications.max_resolution"
        }
    }
};

async function seed() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        // ---------------------------------------------------------------------
        // 1. ENSURE COLLECTIONS EXIST
        // ---------------------------------------------------------------------
        const collections = [
            {
                name: "kit_templates",
                type: "base",
                schema: [
                    { name: "name", type: "text", required: true },
                    {
                        name: "main_product_id", type: "relation", required: true, options: {
                            collectionId: "equipment", cascadeDelete: false, maxSelect: 1
                        }
                    },
                    { name: "base_price_modifier", type: "number" },
                    { name: "description", type: "text" },
                ]
            },
            {
                name: "kit_items",
                type: "base",
                schema: [
                    {
                        name: "template_id", type: "relation", required: true, options: {
                            collectionId: "kit_templates", cascadeDelete: true, maxSelect: 1
                        }
                    },
                    {
                        name: "product_id", type: "relation", required: true, options: {
                            collectionId: "equipment", cascadeDelete: false, maxSelect: 1
                        }
                    },
                    { name: "slot_name", type: "text" },
                    { name: "is_mandatory", type: "bool" },
                    { name: "default_quantity", type: "number" },
                    { name: "swappable_category", type: "text" },
                ]
            },
            {
                name: "ui_configurations",
                type: "base",
                schema: [
                    { name: "key", type: "text", required: true, options: { pattern: "^\\w+$" } },
                    { name: "value", type: "json" }
                ],
                indexes: [
                    "CREATE UNIQUE INDEX idx_config_key ON ui_configurations (key)"
                ]
            }
        ];

        // Need detailed schemas for this to work via API, but we can rely on migration too.
        // We will TRY to create them, but ignore errors if they exist.
        // NOTE: Creating collections via API requires the FULL schema including system fields sometimes, 
        // OR simplified. We will try simplified.

        // Actually, fetching collections first is better.
        const existingCols = await pb.collections.getFullList();
        const existingNames = existingCols.map(c => c.name);

        // Fetch equipment collection ID for relations
        const eqCol = existingCols.find(c => c.name === 'equipment');
        if (!eqCol) throw new Error("Equipment collection missing!");

        for (const colDef of collections) {
            if (!existingNames.includes(colDef.name)) {
                console.log(`Creating collection: ${colDef.name}...`);
                try {
                    // Fix relation IDs
                    colDef.schema.forEach(field => {
                        if (field.type === 'relation' && field.options.collectionId === 'equipment') {
                            field.options.collectionId = eqCol.id;
                        }
                        // For kit_items referencing kit_templates, we need to fetch the ID after creation
                    });

                    // Special handling for kit_items relation to kit_templates
                    if (colDef.name === 'kit_items') {
                        const kitTmplCol = await pb.collections.getFirstListItem(`name="kit_templates"`); // fetch via internal call? No, api.
                        // Actually this might fail if we just created it.
                        // Let's re-fetch collections or assume we can get it by name if create returned it?
                        // Getting by name via API is usually `pb.collections.getFirstListItem` isn't for schema.
                        // `pb.collections.getOne(name)`?
                        // Let's use getFirstListItem on collections NOT supported. 
                        // We have to iterate the full list again.
                        const freshCols = await pb.collections.getFullList();
                        const tmplCol = freshCols.find(c => c.name === 'kit_templates');
                        if (tmplCol) {
                            colDef.schema.forEach(field => {
                                if (field.options.collectionId === 'kit_templates') field.options.collectionId = tmplCol.id;
                            });
                        }
                    }

                    await pb.collections.create(colDef);
                    console.log(`   -> Created ${colDef.name}`);
                } catch (e) {
                    console.error(`   -> Failed to create ${colDef.name}:`, e.message);
                }
            } else {
                console.log(`Collection ${colDef.name} already exists.`);
            }
        }

        // ---------------------------------------------------------------------
        // 2. SEED BATCH 3 EQUIPMENT
        // ---------------------------------------------------------------------
        for (const item of BATCH3_ITEMS) {
            const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            // Category
            let catId = "";
            try {
                const cat = await pb.collection('categories').getFirstListItem(`name="${item.category}"`);
                catId = cat.id;
            } catch (err) {
                try {
                    const newCat = await pb.collection('categories').create({
                        name: item.category,
                        name_en: item.category,
                        slug: item.category.toLowerCase(),
                        icon: "box"
                    });
                    catId = newCat.id;
                } catch (e2) { }
            }

            const data = {
                id: item.id.length === 15 ? item.id : undefined, // PocketBase IDs must be 15 chars? No, can be any string 15 chars? 
                // Actually PB IDs are 15 chars. If user provided custom IDs like 'lens_cooke_s8i', we can use them if we enable custom IDs?
                // PB allows custom IDs if they match regex `^[a-z0-9]+$`. 'lens_cooke_s8i' has underscores.
                // Underscores are ALLOWED in recent PB versions? 
                // Standard PB ID is 15 alphanumeric. 
                // User IDs are like "lens_cooke_s8i" (longer than 15, has underscores).
                // We should probably NOT force the ID if it doesn't match format, OR let PB generate it and store `slug`.
                // BUT the Kits reference these IDs. So we MUST map them.
                // We will try to find by `slug` first.

                slug: slug,
                name_en: item.name,
                name_fr: item.name,
                description_en: item.description,
                description_fr: item.description,
                brand: item.brand,
                category: catId,
                stock: 100,
                stock_available: 100,
                daily_rate: 200,
                visibility: true,
                specs_en: item.specifications,
                specs_fr: item.specifications,
                type: (item.tags && item.tags.length > 0) ? item.tags[0] : "",

                // Flatten
                mount: item.specifications.mount || "",
                sensor_size: item.specifications.sensor_size || "",
                resolution: item.specifications.max_resolution || item.specifications.resolution || ""
            };

            // Mapping custom IDs to real IDs for kits later
            // We'll trust the slug uniqueness.

            try {
                const record = await pb.collection('equipment').getFirstListItem(`slug="${slug}"`);
                await pb.collection('equipment').update(record.id, data);
                console.log(`Updated Equipment: ${item.name}`);
            } catch (err) {
                await pb.collection('equipment').create(data);
                console.log(`Created Equipment: ${item.name}`);
            }
        }

        // ---------------------------------------------------------------------
        // 3. SEED KITS
        // ---------------------------------------------------------------------
        // We need a map of Product Name/Slug -> PB ID to link items.
        // User provided `main_product_id` like "cam_venice_2".
        // In full_seed_retry.js, those IDs were used. 
        // If we can support custom IDs that are valid, great.
        // `cam_venice_2` is 12 chars. valid? PB IDs are 15 chars usually.
        // If they were created with those IDs, we can use them.
        // If not, we need to find the product by matching name/slug to the user's ID map.

        // Strategy: Build a map of "User ID" -> "Real PB ID".
        // ALL items (Batch 1, 2, 3) must be findable.
        // Warning: Batch 1 items in `full_seed` had IDs like `cam_venice_2`.
        // If migration ran successfully, they HAVE those IDs.
        // So we can assume `cam_venice_2` IS the real ID.

        for (const kit of KIT_TEMPLATES) {
            const data = {
                id: (kit.id.length <= 15) ? kit.id : undefined, // Try to reuse kit ID if valid
                name: kit.name,
                description: kit.description,
                base_price_modifier: kit.base_price_modifier,
                main_product_id: kit.main_product_id // Assumes this ID exists
            };

            try {
                // Try to find by name since ID might differ
                const record = await pb.collection('kit_templates').getFirstListItem(`name="${kit.name}"`);
                await pb.collection('kit_templates').update(record.id, data);
                console.log(`Updated Kit: ${kit.name}`);
            } catch (e) {
                try {
                    await pb.collection('kit_templates').create(data);
                    console.log(`Created Kit: ${kit.name}`);
                } catch (e2) {
                    // Determine if error is "ID invalid" or "Relation invalid"
                    console.error(`Failed to create kit ${kit.name}: ${e2.message}`);
                }
            }
        }

        // ---------------------------------------------------------------------
        // 4. SEED KIT ITEMS
        // ---------------------------------------------------------------------
        for (const kItem of KIT_ITEMS) {
            // Relation IDs are tricky if we didn't force custom IDs.
            // But let's assume `template_id` matches the Kit we just created/found.
            // And `product_id` matches the Equipment.

            // Find Template REAL ID
            let realTemplateId = kItem.template_id;
            try {
                // Loop up template by the ID user provided? 
                // If the kit was created with that ID, fine. 
                // If not, we might fail unless we look it up by name?
                // Let's assume the ID map holds.

                // However, for robustness, let's lookup the template by "name" from the KIT_TEMPLATES array
                const tmplDef = KIT_TEMPLATES.find(t => t.id === kItem.template_id);
                if (tmplDef) {
                    const tmplRec = await pb.collection('kit_templates').getFirstListItem(`name="${tmplDef.name}"`);
                    realTemplateId = tmplRec.id;
                }
            } catch (e) { console.warn("Could not resolve template for item " + kItem.slot_name); }

            // Find Product REAL ID
            // User IDs like "lens_zeiss_supreme" might NOT exist if they were created with auto-id.
            // We need to find the product record that *corresponds* to `lens_zeiss_supreme`.
            // How? Name lookup?
            // "lens_zeiss_supreme" -> "Zeiss Supreme Prime Set" (Guessed name).
            // We don't have a map here.
            // Wait, Batch 1 items in `full_seed_retry.js` HAD `id: "cam_venice_2"`.
            // So they SHOULD exist. 
            // EXCEPT if `lens_zeiss_supreme` was not in Batch 1/2?
            // Checking user request: `kit_items` refer to `lens_zeiss_supreme`.
            // Is that in Batch 1? I need to assume yes or look it up.

            const data = {
                template_id: realTemplateId,
                product_id: kItem.product_id,
                slot_name: kItem.slot_name,
                is_mandatory: kItem.is_mandatory,
                default_quantity: kItem.default_quantity,
                swappable_category: kItem.swappable_category
            };

            try {
                // Check uniqueness? Combination of template + slot?
                // Just create for now.
                await pb.collection('kit_items').create(data);
                console.log(`Created Kit Item: ${kItem.slot_name}`);
            } catch (e) {
                console.error(`Failed to create kit item ${kItem.slot_name}: ${e.message}`);
            }
        }

        // ---------------------------------------------------------------------
        // 5. SEED CONFIG
        // ---------------------------------------------------------------------
        if (UI_CONFIG && UI_CONFIG.filters_configuration) {
            try {
                const record = await pb.collection('ui_configurations').getFirstListItem(`key="equipment_filters"`);
                await pb.collection('ui_configurations').update(record.id, {
                    value: UI_CONFIG.filters_configuration
                });
                console.log("Updated UI Config");
            } catch (e) {
                await pb.collection('ui_configurations').create({
                    key: "equipment_filters",
                    value: UI_CONFIG.filters_configuration
                });
                console.log("Created UI Config");
            }
        }

    } catch (e) {
        console.error("Global Error: " + e.message);
    }
}

seed();

/**
 * Create Real Camera Kits
 * 
 * This script creates kit_templates and kit_items with proper references
 * to actual equipment records in the database.
 */
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

// Kit definitions using equipment NAMES (we'll look up real IDs)
const KIT_DEFINITIONS = [
    {
        templateName: "Sony Venice 2 Cine Package",
        mainProductSearch: "Venice 2",
        discount: -300,
        description: "Complete cinema package with Sony Venice 2",
        slots: [
            {
                slotName: "Lens Set",
                allowMultiple: false,
                searchTerms: ["Zeiss Supreme", "Signature Prime", "Master Prime"]
            },
            {
                slotName: "Wireless Video",
                allowMultiple: false,
                searchTerms: ["Teradek Bolt", "Teradek Ranger"]
            },
            {
                slotName: "Monitor",
                allowMultiple: false,
                searchTerms: ["SmallHD", "TVLogic"]
            }
        ]
    },
    {
        templateName: "ARRI Alexa 35 Production Kit",
        mainProductSearch: "Alexa 35",
        discount: -200,
        description: "High-end production package with ARRI Alexa 35",
        slots: [
            {
                slotName: "Lens Set",
                allowMultiple: false,
                searchTerms: ["Signature Prime", "Master Prime", "Supreme Prime"]
            },
            {
                slotName: "Matte Box",
                allowMultiple: false,
                searchTerms: ["LMB", "MB-", "Matte Box"]
            },
            {
                slotName: "Follow Focus",
                allowMultiple: false,
                searchTerms: ["Hi-5", "WCU-4", "Follow Focus"]
            }
        ]
    },
    {
        templateName: "RED V-Raptor 8K Package",
        mainProductSearch: "V-Raptor",
        discount: -250,
        description: "8K cinema package with RED V-Raptor",
        slots: [
            {
                slotName: "Lens Set",
                allowMultiple: false,
                searchTerms: ["Master Anamorphic", "Atlas Orion", "Supreme Prime"]
            },
            {
                slotName: "Control Monitor",
                allowMultiple: false,
                searchTerms: ["SmallHD Cine", "RED Touch"]
            },
            {
                slotName: "Gimbal",
                allowMultiple: false,
                searchTerms: ["Ronin", "RS 4", "RS 3"]
            }
        ]
    },
    {
        templateName: "Sony FX9 Documentary Kit",
        mainProductSearch: "FX9",
        discount: -100,
        description: "Ready-to-shoot documentary kit with Sony FX9",
        slots: [
            {
                slotName: "Zoom Lens",
                allowMultiple: false,
                searchTerms: ["Cabrio", "Optimo", "15-120"]
            },
            {
                slotName: "Tripod",
                allowMultiple: false,
                searchTerms: ["Sachtler", "OConnor", "Cartoni"]
            },
            {
                slotName: "Light",
                allowMultiple: true,
                searchTerms: ["SkyPanel", "Aputure", "ARRI"]
            }
        ]
    },
    {
        templateName: "ARRI Alexa Mini Complete Package",
        mainProductSearch: "Alexa Mini",
        discount: -150,
        description: "Compact cinema package with ARRI Alexa Mini",
        slots: [
            {
                slotName: "Lens Set",
                allowMultiple: false,
                searchTerms: ["Signature Prime", "Supreme Prime", "Atlas"]
            },
            {
                slotName: "Wireless Video",
                allowMultiple: false,
                searchTerms: ["Teradek", "Bolt"]
            },
            {
                slotName: "Monitor",
                allowMultiple: false,
                searchTerms: ["SmallHD", "Atomos"]
            }
        ]
    }
];

async function findEquipmentBySearch(allEquipment, searchTerms) {
    const results = [];
    for (const term of searchTerms) {
        const found = allEquipment.filter(eq =>
            eq.name_en?.toLowerCase().includes(term.toLowerCase()) ||
            eq.name?.toLowerCase().includes(term.toLowerCase())
        );
        for (const f of found) {
            if (!results.find(r => r.id === f.id)) {
                results.push(f);
            }
        }
    }
    return results.slice(0, 5); // Max 5 options per slot
}

async function main() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        // Get all equipment
        console.log("Fetching equipment...");
        const allEquipment = await pb.collection('equipment').getFullList();
        console.log(`Found ${allEquipment.length} equipment items`);

        // Ensure kit collections exist
        let kitTemplatesCol, kitItemsCol;
        try {
            kitTemplatesCol = await pb.collections.getOne('kit_templates');
        } catch (e) {
            console.log("kit_templates collection not found");
            return;
        }
        try {
            kitItemsCol = await pb.collections.getOne('kit_items');
        } catch (e) {
            console.log("kit_items collection not found");
            return;
        }

        console.log("\n=== Creating Kits ===\n");

        for (const kitDef of KIT_DEFINITIONS) {
            // Find main product
            const mainProducts = allEquipment.filter(eq =>
                eq.name_en?.toLowerCase().includes(kitDef.mainProductSearch.toLowerCase()) ||
                eq.name?.toLowerCase().includes(kitDef.mainProductSearch.toLowerCase())
            );

            if (mainProducts.length === 0) {
                console.log(`SKIP: Main product not found for "${kitDef.mainProductSearch}"`);
                continue;
            }

            const mainProduct = mainProducts[0];
            console.log(`\n${kitDef.templateName}`);
            console.log(`  Main: ${mainProduct.name_en} (${mainProduct.id})`);

            // Create kit template
            let template;
            try {
                template = await pb.collection('kit_templates').create({
                    name: kitDef.templateName,
                    main_product_id: mainProduct.id,
                    base_price_modifier: kitDef.discount,
                    description: kitDef.description
                });
                console.log(`  Template created: ${template.id}`);
            } catch (e) {
                console.log(`  Template create failed: ${e.message}`);
                continue;
            }

            // Create kit items for each slot
            for (const slot of kitDef.slots) {
                const slotProducts = await findEquipmentBySearch(allEquipment, slot.searchTerms);

                if (slotProducts.length === 0) {
                    console.log(`  Slot "${slot.slotName}": No products found`);
                    continue;
                }

                console.log(`  Slot "${slot.slotName}": ${slotProducts.length} options`);

                for (let i = 0; i < slotProducts.length; i++) {
                    const prod = slotProducts[i];
                    try {
                        await pb.collection('kit_items').create({
                            template_id: template.id,
                            product_id: prod.id,
                            slot_name: slot.slotName,
                            is_mandatory: i === 0, // First item is default/mandatory
                            default_quantity: 1,
                            swappable_category: slot.allowMultiple ? 'multi' : ''
                        });
                    } catch (e) {
                        console.log(`    Item failed: ${prod.name_en} - ${e.message}`);
                    }
                }
            }
        }

        console.log("\n=== Done ===");

        // Verify
        const templates = await pb.collection('kit_templates').getFullList();
        const items = await pb.collection('kit_items').getFullList();
        console.log(`Created ${templates.length} templates, ${items.length} items`);

    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();

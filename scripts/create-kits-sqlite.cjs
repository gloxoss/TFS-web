/**
 * Direct SQLite Kit Creation - ALL CAMERAS
 * 
 * Dynamically creates kit_templates for ALL cameras in the equipment collection.
 * NOTE: Stop PocketBase server before running this script!
 */
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

// PocketBase data file location
const DB_PATH = path.join(__dirname, '../../pb_data/data.db');

// Generate PocketBase-style ID (15 chars alphanumeric)
function generateId() {
    return crypto.randomBytes(11).toString('base64url').slice(0, 15);
}

// Get current timestamp in PocketBase format
function getTimestamp() {
    return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

// Default slot configurations based on camera brand/type
const DEFAULT_SLOTS = [
    { slotName: "Lens Set", searchTerms: ["Signature Prime", "Supreme Prime", "Master Prime", "Cooke", "Zeiss"] },
    { slotName: "Wireless Video", searchTerms: ["Teradek", "Bolt", "Ranger"] },
    { slotName: "Monitor", searchTerms: ["SmallHD", "Atomos", "TVLogic"] },
    { slotName: "Follow Focus", searchTerms: ["Hi-5", "WCU-4", "Cforce", "Follow Focus"] },
    { slotName: "Tripod/Support", searchTerms: ["Sachtler", "OConnor", "Cartoni", "Ronin"] }
];

async function main() {
    console.log("Opening database:", DB_PATH);
    const db = new Database(DB_PATH);

    try {
        // Check tables exist
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('kit_templates', 'kit_items', 'equipment', 'categories')").all();
        console.log("Found tables:", tables.map(t => t.name).join(', '));

        if (!tables.find(t => t.name === 'kit_templates')) {
            console.log("\nERROR: kit_templates table does not exist!");
            console.log("Please create the collection in PocketBase admin first.");
            return;
        }

        // Get categories to find camera category
        const categories = db.prepare("SELECT id, name, slug FROM categories").all();
        console.log("Categories:", categories.map(c => `${c.name} (${c.id})`).join(', '));

        const cameraCat = categories.find(c =>
            c.name?.toLowerCase().includes('camera') ||
            c.slug?.toLowerCase().includes('camera')
        );
        console.log("\nCamera category:", cameraCat ? `${cameraCat.name} (${cameraCat.id})` : 'NOT FOUND');

        // Get all equipment
        const allEquipment = db.prepare("SELECT id, name_en, name, category, brand FROM equipment").all();
        console.log(`Found ${allEquipment.length} total equipment items`);

        // Find all cameras
        let cameras = [];
        if (cameraCat) {
            cameras = allEquipment.filter(eq => eq.category === cameraCat.id);
        }

        // Also check by name pattern if category match is limited
        const cameraPatterns = ['camera', 'alexa', 'venice', 'fx6', 'fx9', 'fx3', 'komodo', 'raptor', 'red', 'amira', 'burano', 'c70', 'c300', 'c500', 'bmpcc', 'ursa', 'varicam'];
        const camerasByName = allEquipment.filter(eq => {
            const name = (eq.name_en || eq.name || '').toLowerCase();
            return cameraPatterns.some(p => name.includes(p));
        });

        // Merge both sets
        for (const cam of camerasByName) {
            if (!cameras.find(c => c.id === cam.id)) {
                cameras.push(cam);
            }
        }

        console.log(`\nFound ${cameras.length} cameras:`);
        cameras.forEach(c => console.log(`  - ${c.name_en || c.name} (${c.id})`));

        if (cameras.length === 0) {
            console.log("\nNo cameras found! Check your equipment data.");
            return;
        }

        // Helper to find equipment by search terms
        const findEquipment = (searchTerms) => {
            const results = [];
            for (const term of searchTerms) {
                const found = allEquipment.filter(eq =>
                    (eq.name_en || eq.name || '').toLowerCase().includes(term.toLowerCase())
                );
                for (const f of found) {
                    if (!results.find(r => r.id === f.id) && !cameras.find(c => c.id === f.id)) {
                        results.push(f);
                    }
                }
            }
            return results.slice(0, 5);
        };

        // Clear existing data
        console.log("\nClearing existing kit data...");
        db.prepare("DELETE FROM kit_items").run();
        db.prepare("DELETE FROM kit_templates").run();

        const timestamp = getTimestamp();
        let templatesCreated = 0;
        let itemsCreated = 0;

        // Prepare insert statements
        const insertTemplate = db.prepare(`
            INSERT INTO kit_templates (id, created, updated, name, main_product_id, base_price_modifier, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const insertItem = db.prepare(`
            INSERT INTO kit_items (id, created, updated, template_id, product_id, slot_name, is_mandatory, default_quantity, swappable_category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        console.log("\n=== Creating Kits for ALL Cameras ===\n");

        for (const camera of cameras) {
            const cameraName = camera.name_en || camera.name;
            const templateId = generateId();
            const kitName = `${cameraName} Complete Package`;

            console.log(`\n${kitName}`);
            console.log(`  Camera: ${cameraName} (${camera.id})`);

            // Determine discount based on brand
            let discount = -100;
            const brand = (camera.brand || cameraName).toLowerCase();
            if (brand.includes('arri')) discount = -200;
            else if (brand.includes('red')) discount = -250;
            else if (brand.includes('sony') && (cameraName.toLowerCase().includes('venice'))) discount = -300;
            else if (brand.includes('blackmagic')) discount = -50;

            // Insert template
            insertTemplate.run(
                templateId,
                timestamp,
                timestamp,
                kitName,
                camera.id,
                discount,
                `Complete cinema package including ${cameraName} with professional accessories`
            );
            templatesCreated++;

            // Insert items for each default slot
            for (const slot of DEFAULT_SLOTS) {
                const slotProducts = findEquipment(slot.searchTerms);

                if (slotProducts.length > 0) {
                    console.log(`  Slot "${slot.slotName}": ${slotProducts.length} options`);

                    for (let i = 0; i < slotProducts.length; i++) {
                        const prod = slotProducts[i];
                        const itemId = generateId();

                        insertItem.run(
                            itemId,
                            timestamp,
                            timestamp,
                            templateId,
                            prod.id,
                            slot.slotName,
                            i === 0 ? 1 : 0,
                            1,
                            ''
                        );
                        itemsCreated++;
                    }
                }
            }
        }

        console.log(`\n=== Done! ===`);
        console.log(`Created ${templatesCreated} templates, ${itemsCreated} items`);

        // Verify
        const templateCount = db.prepare("SELECT COUNT(*) as c FROM kit_templates").get();
        const itemCount = db.prepare("SELECT COUNT(*) as c FROM kit_items").get();
        console.log(`Verified: ${templateCount.c} templates, ${itemCount.c} items in database`);

    } catch (e) {
        console.error("Error:", e.message);
        console.error(e.stack);
    } finally {
        db.close();
    }
}

main();

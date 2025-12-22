
const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL || process.env.POCKETBASE_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
const PASSWORD = process.env.PB_ADMIN_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
    console.error("❌ Missing admin credentials in .env");
    process.exit(1);
}

const pb = new PocketBase(PB_URL);

// --- LOAD CATALOG DATA ---
const catalogData = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog-data.json'), 'utf-8'));
// -------------------------

// Directory with downloaded images
const IMAGES_DIR = path.join(__dirname, 'downloaded_images');

const CATEGORY_DEFINITIONS = {
    'cameras': { name: 'Cameras', name_en: 'Cameras', name_fr: 'Caméras', icon: 'camera' },
    'lenses': { name: 'Lenses', name_en: 'Lenses', name_fr: 'Objectifs', icon: 'aperture' },
    'lens-control': { name: 'Lens Control', name_en: 'Lens Control', name_fr: 'Contrôle Objectif', icon: 'focus' },
    'support': { name: 'Support', name_en: 'Support', name_fr: 'Support', icon: 'box' },
    'monitoring': { name: 'Monitoring', name_en: 'Monitoring', name_fr: 'Monitoring', icon: 'monitor' },
    'media': { name: 'Media', name_en: 'Media', name_fr: 'Média', icon: 'hard-drive' },
    'grip': { name: 'Grip', name_en: 'Grip', name_fr: 'Machinerie', icon: 'move' },
    'power': { name: 'Power', name_en: 'Power', name_fr: 'Alimentation', icon: 'battery' }
};

function findLocalImage(itemId) {
    // Look for image file with any extension
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    for (const ext of extensions) {
        const filepath = path.join(IMAGES_DIR, `${itemId}${ext}`);
        if (fs.existsSync(filepath)) {
            return filepath;
        }
    }
    return null;
}

async function getOrCreateCategory(slug) {
    try {
        const record = await pb.collection('categories').getFirstListItem(`slug="${slug}"`);
        return record.id;
    } catch (e) {
        if (e.status !== 404) throw e;
        const def = CATEGORY_DEFINITIONS[slug] || { name: slug, name_en: slug, name_fr: slug, icon: 'box' };
        const record = await pb.collection('categories').create({
            slug: slug,
            name: def.name,
            name_en: def.name_en,
            name_fr: def.name_fr,
            icon: def.icon,
            description: `Category for ${def.name}`
        });
        console.log(`   ✅ Created category: ${def.name}`);
        return record.id;
    }
}

async function clearCollection(name) {
    try {
        const records = await pb.collection(name).getFullList();
        for (const r of records) {
            await pb.collection(name).delete(r.id);
        }
        console.log(`   🗑️ Cleared ${records.length} records from ${name}`);
    } catch (e) {
        console.log(`   ℹ️ Collection ${name} empty or not found`);
    }
}

async function seed() {
    console.log(`\n🚀 Starting seed on ${PB_URL}...\n`);

    try {
        await pb.admins.authWithPassword(EMAIL, PASSWORD);
        console.log("🔑 Authenticated as admin.\n");
    } catch (e) {
        console.error("❌ Authentication failed:", e.message);
        return;
    }

    // PHASE 0: Clear existing data
    console.log("📦 PHASE 0: Clearing existing data...");
    await clearCollection('kit_items');
    await clearCollection('kit_templates');
    await clearCollection('equipment');
    console.log("");

    // Build category cache
    const categoryCache = {};

    // PHASE 1: Seed Equipment
    console.log("📦 PHASE 1: Seeding Equipment...");
    const equipmentIdMap = {}; // Maps JSON id to PocketBase id

    for (const item of catalogData.equipment || []) {
        console.log(`   ➕ ${item.name_en}`);

        // Get or create category
        if (!categoryCache[item.category]) {
            categoryCache[item.category] = await getOrCreateCategory(item.category);
        }

        const formData = new FormData();
        formData.append('slug', item.slug);
        formData.append('name_en', item.name_en);
        formData.append('name_fr', item.name_fr || item.name_en);
        formData.append('category', categoryCache[item.category]);
        formData.append('brand', item.brand || '');
        formData.append('description_en', `<p>${item.description_en}</p>`);
        formData.append('description_fr', `<p>${item.description_fr || item.description_en}</p>`);
        formData.append('specs_en', JSON.stringify(item.specs_en || {}));
        formData.append('daily_rate', item.daily_rate);
        formData.append('stock', item.stock);
        formData.append('stock_available', item.stock_available);
        formData.append('featured', item.featured ? 'true' : 'false');
        formData.append('visibility', item.visibility ? 'true' : 'false');
        formData.append('availability_status', item.availability_status || 'available');

        // Use local image if available
        const localImage = findLocalImage(item.id);
        if (localImage) {
            const imageBuffer = fs.readFileSync(localImage);
            const ext = path.extname(localImage);
            const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
            const file = new File([imageBuffer], path.basename(localImage), { type: mimeType });
            formData.append('images', file);
            console.log(`      📷 Using local: ${path.basename(localImage)}`);
        } else {
            console.log(`      ⚠️ No local image found`);
        }

        try {
            const record = await pb.collection('equipment').create(formData);
            equipmentIdMap[item.id] = record.id;
            console.log(`      ✅ Saved (${record.id})`);
        } catch (e) {
            console.error(`      ❌ Failed: ${e.message}`);
        }
    }

    // PHASE 2: Seed Kit Templates
    console.log("\n📦 PHASE 2: Seeding Kit Templates...");
    const kitTemplateIdMap = {};

    for (const kit of catalogData.kit_templates || []) {
        console.log(`   ➕ ${kit.name}`);

        const mainProductPbId = equipmentIdMap[kit.main_product];
        if (!mainProductPbId) {
            console.log(`      ⚠️ Main product not found: ${kit.main_product}`);
            continue;
        }

        try {
            const record = await pb.collection('kit_templates').create({
                name: kit.name,
                main_product: mainProductPbId,
                base_price_modifier: kit.base_price_modifier || 0,
                description: kit.description || ''
            });
            kitTemplateIdMap[kit.id] = record.id;
            console.log(`      ✅ Saved (${record.id})`);
        } catch (e) {
            console.error(`      ❌ Failed: ${e.message}`);
        }
    }

    // PHASE 3: Seed Kit Items
    console.log("\n📦 PHASE 3: Seeding Kit Items...");

    for (const item of catalogData.kit_items || []) {
        const templatePbId = kitTemplateIdMap[item.template];
        const productPbId = equipmentIdMap[item.product];

        if (!templatePbId || !productPbId) {
            console.log(`   ⚠️ Skipping kit item - missing refs`);
            continue;
        }

        // Get swappable category id
        let swappableCategoryId = null;
        if (item.swappable_category) {
            if (!categoryCache[item.swappable_category]) {
                categoryCache[item.swappable_category] = await getOrCreateCategory(item.swappable_category);
            }
            swappableCategoryId = categoryCache[item.swappable_category];
        }

        try {
            await pb.collection('kit_items').create({
                template: templatePbId,
                product: productPbId,
                slot_name: item.slot_name,
                is_mandatory: item.is_mandatory,
                default_quantity: item.default_quantity,
                swappable_category: swappableCategoryId
            });
            console.log(`   ✅ ${item.slot_name} → ${item.product}`);
        } catch (e) {
            console.error(`   ❌ Failed: ${e.message}`);
        }
    }

    console.log("\n✨ Seeding complete!\n");
    console.log(`   Equipment: ${Object.keys(equipmentIdMap).length} items`);
    console.log(`   Kit Templates: ${Object.keys(kitTemplateIdMap).length} kits`);
    console.log(`   Kit Items: ${(catalogData.kit_items || []).length} relations`);
}

seed().catch(console.error);

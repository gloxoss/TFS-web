import PocketBase from 'pocketbase';
import { config } from 'dotenv';

// Load environment variables
config();

const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'zakiossama29@gmail.com';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || '4Qisk5ajHZD3mLC';

const pb = new PocketBase(PB_URL);

async function resetCollections() {
  console.log('🔐 Authenticating as admin...');
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Auth successful');

    const collections = ['kit_items', 'kit_templates', 'quotes', 'equipment', 'categories'];
    
    // 1. Delete existing collections
    for (const name of collections) {
      try {
        const col = await pb.collections.getOne(name);
        await pb.collections.delete(col.id);
        console.log(`🗑️  Deleted collection: ${name}`);
      } catch (err) {
        console.log(`ℹ️  Collection ${name} not found (skipping delete)`);
      }
    }

    // 2. Create Categories
    console.log('Creating categories...');
    const categoriesCol = await pb.collections.create({
      name: 'categories',
      type: 'base',
      listRule: '', // Public
      viewRule: '', // Public
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'name_en', type: 'text', required: true },
        { name: 'name_fr', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'description', type: 'text' },
        { name: 'icon', type: 'text' },
        { name: 'thumbnail', type: 'file', maxSelect: 1 }
      ]
    });
    console.log(`✅ Created categories (${categoriesCol.id})`);

    // 3. Create Equipment
    console.log('Creating equipment...');
    const equipmentCol = await pb.collections.create({
      name: 'equipment',
      type: 'base',
      listRule: '', // Public
      viewRule: '', // Public
      fields: [
        { name: 'name_en', type: 'text', required: true },
        { name: 'name_fr', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'category', type: 'relation', required: true, collectionId: categoriesCol.id, cascadeDelete: false },
        { name: 'brand', type: 'text' },
        { name: 'description_en', type: 'editor' },
        { name: 'description_fr', type: 'editor' },
        { name: 'specs_en', type: 'json' },
        { name: 'specs_fr', type: 'json' },
        { name: 'daily_rate', type: 'number', required: true, min: 0 },
        { name: 'stock', type: 'number', required: true, min: 0 },
        { name: 'stock_available', type: 'number', required: true, min: 0 },
        { name: 'images', type: 'file', maxSelect: 10 },
        { name: 'featured', type: 'bool' },
        { name: 'visibility', type: 'bool' },
        { name: 'availability_status', type: 'select', values: ['available', 'rented', 'maintenance'] }
      ]
    });
    console.log(`✅ Created equipment (${equipmentCol.id})`);

    // 4. Create Kit Templates
    console.log('Creating kit_templates...');
    const kitTemplatesCol = await pb.collections.create({
      name: 'kit_templates',
      type: 'base',
      listRule: '', // Public
      viewRule: '', // Public
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'main_product', type: 'relation', required: true, collectionId: equipmentCol.id, cascadeDelete: false },
        { name: 'base_price_modifier', type: 'number', min: -1000 },
        { name: 'description', type: 'text' }
      ]
    });
    console.log(`✅ Created kit_templates (${kitTemplatesCol.id})`);

    // 5. Create Kit Items
    console.log('Creating kit_items...');
    await pb.collections.create({
      name: 'kit_items',
      type: 'base',
      listRule: '', // Public
      viewRule: '', // Public
      fields: [
        { name: 'template', type: 'relation', required: true, collectionId: kitTemplatesCol.id, cascadeDelete: true },
        { name: 'product', type: 'relation', required: true, collectionId: equipmentCol.id, cascadeDelete: false },
        { name: 'slot_name', type: 'text', required: true },
        { name: 'is_mandatory', type: 'bool' },
        { name: 'default_quantity', type: 'number', min: 1 },
        { name: 'swappable_category', type: 'relation', collectionId: categoriesCol.id, cascadeDelete: false }
      ]
    });
    console.log('✅ Created kit_items');

    // 6. Create Quotes
    console.log('Creating quotes...');
    await pb.collections.create({
      name: 'quotes',
      type: 'base',
      createRule: '', // Public creation
      listRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.role = "admin")',
      viewRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.role = "admin")',
      fields: [
        { name: 'confirmation_number', type: 'text', required: true, unique: true },
        { name: 'client_name', type: 'text', required: true },
        { name: 'client_email', type: 'email', required: true },
        { name: 'client_phone', type: 'text' },
        { name: 'client_company', type: 'text' },
        { name: 'rental_start_date', type: 'date', required: true },
        { name: 'rental_end_date', type: 'date', required: true },
        { name: 'items_json', type: 'json', required: true },
        { name: 'project_description', type: 'text' },
        { name: 'special_requests', type: 'text' },
        { name: 'status', type: 'select', required: true, values: ['pending', 'reviewing', 'confirmed', 'rejected'] },
        { name: 'estimated_price', type: 'number', min: 0 },
        { name: 'internal_notes', type: 'text' },
        { name: 'language', type: 'select', values: ['en', 'fr'] },
        { name: 'pdf_generated', type: 'bool' },
        { name: 'user', type: 'relation', collectionId: '_pb_users_auth_', cascadeDelete: false }
      ]
    });

    console.log('🎉 Collections reset successfully!');

  } catch (error: any) {
    console.error('❌ Error resetting collections:', error.message);
    if (error.data) console.error(JSON.stringify(error.data, null, 2));
  }
}

resetCollections();

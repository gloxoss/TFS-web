// seed-complete.js
require('dotenv').config();
const PocketBase = require('pocketbase/cjs');

async function seedComplete() {
  const pbUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
  console.log(`🔌 Connecting to PocketBase at ${pbUrl}...`);

  const pb = new PocketBase(pbUrl);

  // Authenticate
  try {
    await pb.collection('_superusers').authWithPassword(
      process.env.PB_ADMIN_EMAIL,
      process.env.PB_ADMIN_PASSWORD
    );
    console.log('✅ Authenticated as Admin');
  } catch (err) {
    console.error('❌ Authentication Failed:', err.message);
    process.exit(1);
  }

  // Define collections schema - base fields only first
  const baseCollections = [
    {
      name: 'categories',
      type: 'base',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'thumbnail', type: 'file', required: false, options: { maxSelect: 1 } }
      ]
    },
    {
      name: 'products',
      type: 'base',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'description', type: 'editor', required: false },
        { name: 'daily_rate', type: 'number', required: true },
        { name: 'stock_total', type: 'number', required: true },
        { name: 'stock_available', type: 'number', required: true },
        { name: 'images', type: 'file', required: false, options: { maxSelect: 10 } },
        { name: 'specs', type: 'json', required: false },
        { name: 'is_featured', type: 'bool', required: false }
      ]
    },
    {
      name: 'carts',
      type: 'base',
      fields: [
        { name: 'status', type: 'select', required: true, options: { values: ['active', 'abandoned', 'converted'] } }
      ]
    },
    {
      name: 'cart_items',
      type: 'base',
      fields: [
        { name: 'quantity', type: 'number', required: true },
        { name: 'dates', type: 'json', required: true },
        { name: 'group_id', type: 'text', required: false }
      ]
    },
    {
      name: 'bookings',
      type: 'base',
      fields: [
        { name: 'total_price', type: 'number', required: true },
        { name: 'start_date', type: 'date', required: true },
        { name: 'end_date', type: 'date', required: true },
        { name: 'status', type: 'select', required: true, options: { values: ['pending_payment', 'confirmed', 'picked_up', 'returned', 'late'] } },
        { name: 'payment_id', type: 'text', required: false }
      ]
    },
    {
      name: 'booking_items',
      type: 'base',
      fields: [
        { name: 'quantity', type: 'number', required: true },
        { name: 'price_at_booking', type: 'number', required: true }
      ]
    },
    {
      name: 'content_blocks',
      type: 'base',
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'content', type: 'text', required: false },
        { name: 'image', type: 'file', required: false, options: { maxSelect: 1 } }
      ]
    },
    {
      name: 'kit_templates',
      type: 'base',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'base_price_modifier', type: 'number', required: true }
      ]
    },
    {
      name: 'kit_items',
      type: 'base',
      fields: [
        { name: 'default_quantity', type: 'number', required: true },
        { name: 'is_mandatory', type: 'bool', required: true }
      ]
    },
    {
      name: 'cart_groups',
      type: 'base',
      fields: [
        { name: 'uuid', type: 'text', required: true }
      ]
    }
  ];

  // Create base collections
  for (const collection of baseCollections) {
    try {
      await pb.collections.create(collection);
      console.log(`✅ Created collection: ${collection.name}`);
    } catch (err) {
      console.error(`❌ Failed to create ${collection.name}:`, err.message);
    }
  }

  // Get collection IDs
  const collectionsList = await pb.collections.getFullList();
  const collectionIds = {};
  collectionsList.forEach(col => {
    collectionIds[col.name] = col.id;
  });

  // Update collections with relations
  const relationUpdates = [
    {
      id: collectionIds['products'],
      fields: [
        { name: 'category', type: 'relation', required: true, options: { collectionId: collectionIds['categories'], maxSelect: 1 } }
      ]
    },
    {
      id: collectionIds['carts'],
      fields: [
        { name: 'user', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_', maxSelect: 1 } }
      ]
    },
    {
      id: collectionIds['cart_items'],
      fields: [
        { name: 'cart', type: 'relation', required: true, options: { collectionId: collectionIds['carts'], maxSelect: 1 } },
        { name: 'product', type: 'relation', required: true, options: { collectionId: collectionIds['products'], maxSelect: 1 } }
      ]
    },
    {
      id: collectionIds['bookings'],
      fields: [
        { name: 'user', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_', maxSelect: 1 } }
      ]
    },
    {
      id: collectionIds['booking_items'],
      fields: [
        { name: 'booking', type: 'relation', required: true, options: { collectionId: collectionIds['bookings'], maxSelect: 1 } },
        { name: 'product', type: 'relation', required: true, options: { collectionId: collectionIds['products'], maxSelect: 1 } }
      ]
    },
    {
      id: collectionIds['kit_templates'],
      fields: [
        { name: 'main_product', type: 'relation', required: true, options: { collectionId: collectionIds['products'], maxSelect: 1 } }
      ]
    },
    {
      id: collectionIds['kit_items'],
      fields: [
        { name: 'template', type: 'relation', required: true, options: { collectionId: collectionIds['kit_templates'], maxSelect: 1 } },
        { name: 'product', type: 'relation', required: true, options: { collectionId: collectionIds['products'], maxSelect: 1 } },
        { name: 'swappable_category', type: 'relation', required: false, options: { collectionId: collectionIds['categories'], maxSelect: 1 } }
      ]
    },
    {
      id: collectionIds['cart_groups'],
      fields: [
        { name: 'cart_id', type: 'relation', required: true, options: { collectionId: collectionIds['carts'], maxSelect: 1 } },
        { name: 'kit_template_id', type: 'relation', required: false, options: { collectionId: collectionIds['kit_templates'], maxSelect: 1 } }
      ]
    }
  ];

  for (const update of relationUpdates) {
    try {
      const collection = await pb.collections.getOne(update.id);
      const newFields = [...collection.fields, ...update.fields];
      await pb.collections.update(update.id, { fields: newFields });
      console.log(`✅ Updated collection with relations: ${collection.name}`);
    } catch (err) {
      console.error(`❌ Failed to update collection:`, err.message);
    }
  }

  // Seed categories
  const categories = [
    { name: 'Cinema Cameras', slug: 'cinema-cameras', description: 'Professional cinema cameras' },
    { name: 'Lenses', slug: 'lenses', description: 'Camera lenses' },
    { name: 'Lighting', slug: 'lighting', description: 'Professional lighting equipment' },
    { name: 'Audio', slug: 'audio', description: 'Microphones and audio equipment' },
    { name: 'Grip', slug: 'grip', description: 'Tripods and support equipment' }
  ];

  const categoryIds = {};
  for (const category of categories) {
    try {
      const record = await pb.collection('categories').create(category);
      categoryIds[category.slug] = record.id;
      console.log(`✅ Created category: ${category.name}`);
    } catch (err) {
      console.error(`❌ Failed to create category ${category.name}:`, err.message);
    }
  }

  // Seed products
  const products = [
    {
      name: 'RED Komodo',
      slug: 'red-komodo',
      category: categoryIds['cinema-cameras'],
      description: '6K cinema camera',
      daily_rate: 500,
      stock_total: 2,
      stock_available: 2,
      specs: { sensor: '6K', mount: 'RF' },
      is_featured: true
    },
    {
      name: 'Canon 35mm Lens',
      slug: 'canon-35mm-lens',
      category: categoryIds['lenses'],
      description: '35mm prime lens',
      daily_rate: 25,
      stock_total: 5,
      stock_available: 5,
      specs: { focal_length: '35mm', aperture: 'f/1.4' },
      is_featured: false
    },
    {
      name: 'Canon 50mm Lens',
      slug: 'canon-50mm-lens',
      category: categoryIds['lenses'],
      description: '50mm prime lens',
      daily_rate: 25,
      stock_total: 5,
      stock_available: 5,
      specs: { focal_length: '50mm', aperture: 'f/1.4' },
      is_featured: false
    },
    {
      name: 'Canon 85mm Lens',
      slug: 'canon-85mm-lens',
      category: categoryIds['lenses'],
      description: '85mm prime lens',
      daily_rate: 30,
      stock_total: 3,
      stock_available: 3,
      specs: { focal_length: '85mm', aperture: 'f/1.4' },
      is_featured: false
    },
    {
      name: 'Arri Skypanel S60',
      slug: 'arri-skypanel-s60',
      category: categoryIds['lighting'],
      description: 'LED soft light panel',
      daily_rate: 80,
      stock_total: 4,
      stock_available: 4,
      specs: { power: '200W', color_temp: '2800-10000K' },
      is_featured: true
    },
    {
      name: 'Sennheiser MKH 416',
      slug: 'sennheiser-mkh-416',
      category: categoryIds['audio'],
      description: 'Professional shotgun microphone',
      daily_rate: 40,
      stock_total: 6,
      stock_available: 6,
      specs: { type: 'shotgun', frequency: '40-20000Hz' },
      is_featured: false
    },
    {
      name: 'Manfrotto 535 Tripod',
      slug: 'manfrotto-535-tripod',
      category: categoryIds['grip'],
      description: 'Carbon fiber tripod',
      daily_rate: 25,
      stock_total: 8,
      stock_available: 8,
      specs: { height: '180cm', weight: '2.5kg' },
      is_featured: false
    }
  ];

  const productIds = {};
  for (const product of products) {
    try {
      const record = await pb.collection('products').create(product);
      productIds[product.slug] = record.id;
      console.log(`✅ Created product: ${product.name}`);
    } catch (err) {
      console.error(`❌ Failed to create product ${product.name}:`, err.message);
    }
  }

  // Seed kit template
  let kitTemplateId;
  try {
    const kitTemplate = await pb.collection('kit_templates').create({
      name: 'RED Komodo Standard Kit',
      main_product: productIds['red-komodo'],
      base_price_modifier: -50 // $50 discount for kit
    });
    kitTemplateId = kitTemplate.id;
    console.log('✅ Created kit template: RED Komodo Standard Kit');
  } catch (err) {
    console.error('❌ Failed to create kit template:', err.message);
  }

  // Seed kit items
  const kitItems = [
    {
      template: kitTemplateId,
      product: productIds['canon-35mm-lens'],
      default_quantity: 1,
      is_mandatory: false,
      swappable_category: categoryIds['lenses']
    },
    {
      template: kitTemplateId,
      product: productIds['canon-50mm-lens'],
      default_quantity: 1,
      is_mandatory: true,
      swappable_category: categoryIds['lenses']
    },
    {
      template: kitTemplateId,
      product: productIds['arri-skypanel-s60'],
      default_quantity: 1,
      is_mandatory: false,
      swappable_category: null
    }
  ];

  for (const item of kitItems) {
    try {
      await pb.collection('kit_items').create(item);
      console.log('✅ Created kit item');
    } catch (err) {
      console.error('❌ Failed to create kit item:', err.message);
    }
  }

  // Seed content blocks
  const contentBlocks = [
    { key: 'home_hero_title', content: 'Rent the Future of Cinema' },
    { key: 'home_hero_subtitle', content: 'Professional equipment for your next project' }
  ];

  for (const block of contentBlocks) {
    try {
      await pb.collection('content_blocks').create(block);
      console.log(`✅ Created content block: ${block.key}`);
    } catch (err) {
      console.error(`❌ Failed to create content block ${block.key}:`, err.message);
    }
  }

  console.log('✨ Complete database seeding finished!');
}

seedComplete().catch(console.error);
// seed-db.js
require('dotenv').config();
const PocketBase = require('pocketbase/cjs');

async function seedDB() {
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

  // Sample products data
  const products = [
    {
      name: 'Canon EOS R5',
      description: 'Professional full-frame mirrorless camera',
      daily_rate: 150,
      category: 'Camera',
      specs: { sensor: '45MP', video: '8K' },
      is_available: true
    },
    {
      name: 'Sony A7S III',
      description: 'Low-light video camera',
      daily_rate: 140,
      category: 'Camera',
      specs: { sensor: '12MP', video: '4K' },
      is_available: true
    },
    {
      name: 'Canon EF 24-70mm f/2.8L',
      description: 'Professional zoom lens',
      daily_rate: 50,
      category: 'Lens',
      specs: { focal_length: '24-70mm', aperture: 'f/2.8' },
      is_available: true
    },
    {
      name: 'Arri Skypanel S60',
      description: 'LED soft light panel',
      daily_rate: 80,
      category: 'Lighting',
      specs: { power: '200W', color_temp: '2800-10000K' },
      is_available: true
    },
    {
      name: 'Sennheiser MKH 416',
      description: 'Professional shotgun microphone',
      daily_rate: 40,
      category: 'Audio',
      specs: { type: 'shotgun', frequency: '40-20000Hz' },
      is_available: true
    },
    {
      name: 'Manfrotto 535 Carbon Fiber Tripod',
      description: 'Lightweight carbon fiber tripod',
      daily_rate: 25,
      category: 'Grip',
      specs: { height: '180cm', weight: '2.5kg' },
      is_available: true
    }
  ];

  // Seed products
  for (const product of products) {
    try {
      await pb.collection('products').create(product);
      console.log(`✅ Created product: ${product.name}`);
    } catch (err) {
      console.error(`❌ Failed to create ${product.name}:`, err.message);
    }
  }

  console.log('✨ Database seeding complete');
}

seedDB().catch(console.error);
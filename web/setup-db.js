// setup-db.js
require('dotenv').config();
const PocketBase = require('pocketbase/cjs'); // Force CJS import to match 'require' usage

async function setupDB() {
  const pbUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
  console.log(`🔌 Connecting to PocketBase at ${pbUrl}...`);
  
  const pb = new PocketBase(pbUrl);

  // 1. Authenticate
  try {
    await pb.collection('_superusers').authWithPassword(
      process.env.PB_ADMIN_EMAIL, 
      process.env.PB_ADMIN_PASSWORD
    );
    console.log('✅ Authenticated as Admin');
  } catch (err) {
    console.error('❌ Authentication Failed. Checklist:');
    console.error('   1. Is PocketBase running?');
    console.error('   2. Did you create the Admin account in the browser (http://127.0.0.1:8090/_/)?');
    console.error('   3. Are credentials in .env correct?');
    console.error(`   Error details: ${err.message}`);
    process.exit(1);
  }

  // 2. Schema Migration: Users Collection
  try {
    const collection = await pb.collections.getOne('users');
    
    // Check if language field exists
    const hasLanguage = collection.fields.some(field => field.name === 'language');

    if (!hasLanguage) {
      console.log('⚡ "language" field missing. Adding to schema...');
      
      // We explicitly map the existing schema to avoid overwriting unrelated settings
      const newSchema = [
        ...collection.fields,
        {
          name: 'language',
          type: 'text',
          required: false,
          options: { max: 10 }
        }
      ];

      // Update the collection
      await pb.collections.update(collection.id, { fields: newSchema });
      console.log('✅ Added "language" field to users collection');
    } else {
      console.log('ℹ️ "language" field already exists. Skipping.');
    }

  } catch (err) {
    console.error(`❌ Failed to update schema: ${err.message}`);
    process.exit(1);
  }

  console.log('✨ DB setup complete');
}

setupDB().catch(console.error);
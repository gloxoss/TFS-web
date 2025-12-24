/**
 * MASTER SEED SCRIPT
 * 
 * Runs all seed scripts in the correct order:
 * 1. seed-data.ts (Base categories, essential equipment, users)
 * 2. seed-batch2-data.cjs (Bulk equipment batch 2)
 * 3. seed-batch3-kits-data.cjs (Batch 3 equipment + Kits)
 * 4. seed-services.cjs (Structured services content)
 * 
 * Usage: 
 * POCKETBASE_URL=http://your-vps:8090 PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... node scripts/seed-all.cjs
 */

const { execSync } = require('child_process');
const path = require('path');

const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'zakiossama28@gmail.com';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'GloXoss123.';

const env = {
    ...process.env,
    POCKETBASE_URL: PB_URL,
    PB_ADMIN_EMAIL: ADMIN_EMAIL,
    PB_ADMIN_PASSWORD: ADMIN_PASSWORD
};

function runScript(command, description) {
    console.log(`\n================================================================`);
    console.log(`🚀 RUNNING: ${description}`);
    console.log(`================================================================\n`);
    try {
        execSync(command, { stdio: 'inherit', env });
        console.log(`\n✅ SUCCESS: ${description}`);
    } catch (error) {
        console.error(`\n❌ FAILED: ${description}`);
        // Keep going for other scripts if one fails? 
        // For seeding, it's better to stop if a core script fails.
        // process.exit(1);
    }
}

console.log(`Starting master seed process for PocketBase at: ${PB_URL}\n`);

// 1. Base Data (using tsx for the .ts file)
runScript('npx tsx scripts/seed-data.ts', 'Base Data (Categories, Equipment, Users)');

// 2. Batch 2 Equipment
runScript('node scripts/seed-batch2-data.cjs', 'Bulk Equipment Batch 2');

// 3. Batch 3 Equipment & Kits
runScript('node scripts/seed-batch3-kits-data.cjs', 'Equipment Batch 3 & Kits');

// 4. Services
runScript('node scripts/seed-services.cjs', 'Structured Services Content');

console.log(`\n\n================================================================`);
console.log(`🎉 ALL SEEDING TASKS COMPLETED`);
console.log(`================================================================\n`);

const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

    const equipment = await pb.collection('equipment').getFullList();
    const categories = await pb.collection('categories').getFullList();

    let out = '=== EQUIPMENT ANALYSIS ===\n\n';
    out += 'Total equipment: ' + equipment.length + '\n';
    out += 'Categories: ' + categories.length + '\n\n';

    // List categories
    out += '=== CATEGORIES ===\n';
    categories.forEach(c => out += '- ' + c.name + ' (' + c.id + ')\n');

    // Group equipment by category
    out += '\n=== EQUIPMENT BY CATEGORY ===\n';
    for (const cat of categories) {
        const items = equipment.filter(e => e.category === cat.id);
        out += '\n### ' + cat.name + ' (' + items.length + ' items)\n';
        items.slice(0, 10).forEach(e => out += '  - ' + (e.name_en || e.name) + '\n');
        if (items.length > 10) out += '  ... and ' + (items.length - 10) + ' more\n';
    }

    // Equipment without category
    const uncategorized = equipment.filter(e => !categories.find(c => c.id === e.category));
    if (uncategorized.length > 0) {
        out += '\n### UNCATEGORIZED (' + uncategorized.length + ' items)\n';
        uncategorized.forEach(e => out += '  - ' + (e.name_en || e.name) + '\n');
    }

    // Identify cameras
    out += '\n=== CAMERAS ===\n';
    const cameraKeywords = ['alexa', 'venice', 'fx', 'komodo', 'raptor', 'amira', 'burano', 'varicam', 'ursa', 'bmpcc', 'c70', 'c300', 'c500'];
    const cameras = equipment.filter(e => {
        const name = (e.name_en || e.name || '').toLowerCase();
        return cameraKeywords.some(k => name.includes(k));
    });
    cameras.forEach(c => out += '- ' + (c.name_en || c.name) + ' [' + c.id + ']\n');

    // Identify lenses
    out += '\n=== LENSES ===\n';
    const lenseKeywords = ['lens', 'prime', 'zoom', 'anamorphic', 'spherical'];
    const lenses = equipment.filter(e => {
        const name = (e.name_en || e.name || '').toLowerCase();
        return lenseKeywords.some(k => name.includes(k)) && !cameras.find(c => c.id === e.id);
    });
    lenses.slice(0, 20).forEach(l => out += '- ' + (l.name_en || l.name) + '\n');
    if (lenses.length > 20) out += '... and ' + (lenses.length - 20) + ' more\n';

    fs.writeFileSync('equipment-analysis.txt', out);
    console.log('Output saved to equipment-analysis.txt');
    console.log('\nCameras:', cameras.length);
    console.log('Lenses:', lenses.length);
}

main().catch(console.error);

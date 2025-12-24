const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function verify() {
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        const equipment = await pb.collection('equipment').getFullList();
        console.log(`Equipment Count: ${equipment.length} (Expected 111)`);

        try {
            const kits = await pb.collection('kit_templates').getFullList();
            console.log(`Kit Templates: ${kits.length} (Expected 8)`);
        } catch (e) { console.log("Kit Templates Collection Missing or Empty"); }

        try {
            const kitItems = await pb.collection('kit_items').getFullList();
            console.log(`Kit Items: ${kitItems.length} (Expected 16)`);
        } catch (e) { console.log("Kit Items Collection Missing or Empty"); }

        try {
            const config = await pb.collection('ui_configurations').getFirstListItem('key="equipment_filters"');
            console.log(`UI Config Found: ${!!config}`);
        } catch (e) { console.log("UI Config Missing"); }

    } catch (e) {
        console.error(e.message);
    }
}

verify();

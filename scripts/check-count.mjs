
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function check() {
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        const result = await pb.collection('equipment').getFullList();
        console.log("COUNT:" + result.length);
        const names = result.map(i => `${i.name_en || i.name} [${i.id}]`).sort();
        console.log(JSON.stringify(names, null, 2));
    } catch (e) {
        console.error(e);
    }
}
check();

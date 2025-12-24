const PocketBase = require('pocketbase/cjs');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pb = new PocketBase('http://127.0.0.1:8090');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FIX_ITEMS = [
    {
        "name": "Sachtler VIDEO 30 II Tripod",
        "url": "https://static.bhphoto.com/images/images500x500/1505736785_1361545.jpg"
    },
    {
        "name": "Sony BVM-E251 24\" OLED Reference",
        "url": "https://static.bhphoto.com/images/images500x500/1486050601_1312353.jpg"
    },
    {
        "name": "Teradek Bolt Pro 300 Set",
        "url": "https://static.bhphoto.com/images/images500x500/1423153673_1114759.jpg"
    },
    {
        "name": "DJI Force Pro",
        "url": "https://static.bhphoto.com/images/images500x500/1524564413_1403698.jpg"
    }
];

async function fixImages() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        for (const item of FIX_ITEMS) {
            console.log(`\nFixing: ${item.name}`);
            const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const tempFile = path.resolve(`temp_fix_${slug}.jpg`);

            try {
                const record = await pb.collection('equipment').getFirstListItem(`slug="${slug}"`);

                console.log('   Downloading via curl...');
                const safeUrl = `"${item.url}"`;
                const cmd = `cmd /c curl -L -H "User-Agent: ${USER_AGENT}" -H "Referer: https://www.google.com/" -o "${tempFile}" ${safeUrl}`;

                execSync(cmd, { stdio: 'ignore' });

                if (!fs.existsSync(tempFile) || fs.statSync(tempFile).size < 1000) {
                    throw new Error("Download failed or file too small");
                }

                console.log('   Uploading to PocketBase...');
                const formData = new FormData();
                const fileBuffer = fs.readFileSync(tempFile);
                const blob = new Blob([fileBuffer]);
                formData.append('images', blob, 'image.jpg');

                await pb.collection('equipment').update(record.id, formData);
                console.log('   SUCCESS!');

            } catch (err) {
                console.error(`   FAILED: ${err.message}`);
            } finally {
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
            }
        }

    } catch (e) {
        console.error("Global Error: " + e.message);
    }
}

fixImages();

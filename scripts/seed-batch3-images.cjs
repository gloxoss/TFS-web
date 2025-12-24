const PocketBase = require('pocketbase/cjs');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pb = new PocketBase('http://127.0.0.1:8090');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const DATA = [
    {
        "name": "Cooke S8/i FF Prime Set",
        "url": "https://static.bhphoto.com/images/images500x500/1646217435_1693006.jpg"
    },
    {
        "name": "Zeiss Supreme Prime Radiance Set",
        "url": "https://static.bhphoto.com/images/images500x500/1603290466_1598971.jpg"
    },
    {
        "name": "Angenieux Optimo 45-120mm T2.8",
        "url": "https://static.bhphoto.com/images/images500x500/1346247920_887968.jpg"
    },
    {
        "name": "Canon Cine-Servo 15-120mm T2.95-3.9",
        "url": "https://static.bhphoto.com/images/images500x500/1409756121_1080880.jpg"
    }
];

async function seedImages() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        for (const item of DATA) {
            console.log(`\nProcessing: ${item.name}`);
            const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const tempFile = path.resolve(`temp_b3_${slug}.jpg`);

            try {
                // Check if already has images
                let record;
                try {
                    record = await pb.collection('equipment').getFirstListItem(`slug="${slug}"`);
                } catch (e) {
                    console.log("   -> Record not found, skipping.");
                    continue;
                }

                if (record.images && record.images.length > 0) {
                    console.log("   -> Already has images, skipping.");
                    continue;
                }

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
                // Simplified fallback: if fails, we leave it for manual fix or retry
            } finally {
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
            }

            await new Promise(r => setTimeout(r, 1000));
        }

    } catch (e) {
        console.error("Global Error: " + e.message);
    }
}

seedImages();

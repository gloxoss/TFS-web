import PocketBase from 'pocketbase';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const pb = new PocketBase('http://127.0.0.1:8090');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const DATA = [
    {
        "name": "OConnor Ultimate 2560 Fluid Head",
        "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1260_0001_ultimate_2560_fluid_head_1434101716_1157454.jpg"
    },
    {
        "name": "Cartoni Master MK2 Head",
        "url": "https://www.cartoni.com/wp-content/uploads/ProductImages/FluidHeads/Cartoni_FluidHeads_H541_MasterMK2.jpg"
    },
    {
        "name": "Cartoni Maxima 30 Video Fluid Head",
        "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/cartoni_hm3100_maxima_30_head_1499187934_1324640.jpg"
    },
    {
        "name": "Sachtler VIDEO 30 II Tripod",
        "url": "https://www.trm.fr/wp-content/uploads/2024/02/SAC_3007_Cine-30-fluid-head_02-600x600-c.jpg"
    },
    {
        "name": "ARRIHEAD 2 Geared Head",
        "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_43670_0_arrihead_2_production_tripod_1478794858_1288722.jpg"
    },
    {
        "name": "ARRI LMB-25 Matte Box Set",
        "url": "https://static.bhphoto.com/images/images500x500/1488196247_1288790.jpg"
    },
    {
        "name": "ARRI MMB-2 Double LWS Set",
        "url": "https://static.bhphoto.com/images/images500x500/1533910662_1220658.jpg"
    },
    {
        "name": "ARRI MB-28 6x6 Production Matte Box",
        "url": "https://vmi.tv/wp-content/uploads/sites/3/2019/03/ARRI-MB28-Matte-Box-3-2.jpg"
    },
    {
        "name": "ARRI MB-14 Matte Box",
        "url": "https://patriot.ua/wp-content/uploads/2019/06/MB14-e1581070184302-1300x1299.jpg"
    },
    {
        "name": "Chrosziel 450-R11 Matte Box",
        "url": "https://static.bhphoto.com/images/images500x500/1346675010_889174.jpg"
    },
    {
        "name": "SmallHD ULTRA 7 UHD 4K Monitor",
        "url": "https://static.bhphoto.com/images/images500x500/1731335130_1795838.jpg"
    },
    {
        "name": "SmallHD 703 Bolt 7\" Wireless Monitor",
        "url": "https://static.bhphoto.com/images/images500x500/1515023115_1380051.jpg"
    },
    {
        "name": "SmallHD 702 OLED On-Camera Monitor",
        "url": "https://static.bhphoto.com/images/images500x500/1487601332_1320437.jpg"
    },
    {
        "name": "SmallHD Cine 7 RED RCP2 Monitor",
        "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1640703758_IMG_1667808.jpg"
    },
    {
        "name": "TVLogic VFM-055A 5.5\" OLED",
        "url": "https://static.bhphoto.com/images/images500x500/1505816473_1362534.jpg"
    },
    {
        "name": "TVLogic VFM-056W/WP",
        "url": "https://www.tvlogic.tv/Monitors/UpImg/VFM-056WP-FRONT(0)(1).png"
    },
    {
        "name": "TVLogic LQM-071W",
        "url": "https://tvlogic.tv/Monitors/UpImg/LQM-071W-FRONT.gif"
    },
    {
        "name": "TVLogic LVM-091W-M",
        "url": "https://www.tvlogic.tv/Monitors/UpImg/1042_782_LVM-091W(1).png"
    },
    {
        "name": "TVLogic 24\" Full HD 3G-SDI Monitor",
        "url": "https://static.bhphoto.com/images/images500x500/1671531924_1737071.jpg"
    },
    {
        "name": "Sony BVM-E251 24\" OLED Reference",
        "url": "https://www.sony.com/image/3f6290bc8a31d7cf13236376d5e855dc?fmt=jpeg&wid=558&hei=336"
    },
    {
        "name": "Marshall V-MD241 24\" LED LCD",
        "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/marshall_electronics_v_md241_24_led_lcd_1386257619_982146.jpg"
    },
    {
        "name": "ARRI Transvideo Starlite ARRI-WVS",
        "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0015243_transvideo_starlite_arri_wvs_1525176383_1367785.jpg"
    },
    {
        "name": "Blackmagic Video Assist 5\" 3G-SDI",
        "url": "https://static.bhphoto.com/images/images500x500/1594908697_1578060.jpg"
    },
    {
        "name": "Blackmagic Video Assist 7\" 12G-SDI",
        "url": "https://static.bhphoto.com/images/images500x500/1568713006_1507213.jpg"
    },
    {
        "name": "Atomos Shogun 7\" HDR Monitor",
        "url": "https://static.bhphoto.com/images/images500x500/1727171715_1854463.jpg"
    },
    {
        "name": "Atomos Ninja Inferno 7\"",
        "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1490258703_IMG_773212.jpg"
    },
    {
        "name": "Video Devices PIX-E7 7\" 4K Recorder",
        "url": "https://static.bhphoto.com/images/images500x500/1428938280_1137280.jpg"
    },
    {
        "name": "Teradek Ranger MK II 750",
        "url": "https://static.bhphoto.com/images/images500x500/1705406436_1761089.jpg"
    },
    {
        "name": "Teradek Bolt 6 LT 750 Kit",
        "url": "https://static.bhphoto.com/images/images750x750/1722001523_1841011.jpg"
    },
    {
        "name": "Teradek Bolt Pro 3000 Set",
        "url": "https://static.bhphoto.com/images/images500x500/1471872050_1273194.jpg"
    },
    {
        "name": "Teradek Bolt Sidekick II",
        "url": "https://static.bhphoto.com/images/images500x500/1491412879_1328070.jpg"
    },
    {
        "name": "Teradek Bolt Pro 2000 Set",
        "url": "https://static.bhphoto.com/images/images500x500/1425923204_1076568.jpg"
    },
    {
        "name": "Teradek Bolt 1000 XT Set",
        "url": "https://static.bhphoto.com/images/images500x500/1525370855_1403862.jpg"
    },
    {
        "name": "Teradek Bolt Pro 1000 Set",
        "url": "https://static.bhphoto.com/images/images500x500/1471867680_1273184.jpg"
    },
    {
        "name": "Teradek Bolt LT 500 Set",
        "url": "https://tdmstore.tdm.ma/wp-content/uploads/2020/05/TERADEK-HF-BOLT-LT-500.jpg"
    },
    {
        "name": "Teradek Bolt 500 XT Set",
        "url": "https://static.bhphoto.com/images/images750x750/1524585083_1403845.jpg"
    },
    {
        "name": "Teradek Bolt Pro 300 Set",
        "url": "" // No Image provided in source
    },
    {
        "name": "SWIT CW-S300 Wireless System",
        "url": "https://media.tarad.com/9/99aplus/img-lib/spd_2018051492235_b.jpg"
    },
    {
        "name": "Hollyland Mars 400S PRO II",
        "url": "https://static.bhphoto.com/images/images500x500/1701775224_1797151.jpg"
    },
    {
        "name": "DJI Ronin-S",
        "url": "https://static.bhphoto.com/images/images500x500/1527601874_1383648.jpg"
    },
    {
        "name": "DJI Force Pro",
        "url": "https://store.droneway.ma/wp-content/uploads/2020/11/DJI-Force-Pro.jpg"
    },
    {
        "name": "DJI RS 3 Pro Combo",
        "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/dji_rs_3_pro_gimbal_1720204160_1797421.jpg"
    },
    {
        "name": "DJI RS 4 Pro Combo",
        "url": "https://static.bhphoto.com/images/images500x500/1730825421_1816789.jpg"
    },
    {
        "name": "Zhiyun CRANE 3S",
        "url": "https://static.bhphoto.com/images/images500x500/1584603943_1554049.jpg"
    },
    {
        "name": "EcoFlow DELTA Pro Power Station",
        "url": "https://static.bhphoto.com/images/images500x500/1642768650_1685678.jpg"
    }
];

async function seedImages() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        for (const item of DATA) {
            if (!item.url) {
                console.log(`Skipping ${item.name} (No URL)`);
                continue;
            }

            console.log(`\nProcessing: ${item.name}`);
            const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const tempFile = `temp_${slug}.jpg`;

            try {
                // Check if already has images
                const record = await pb.collection('equipment').getFirstListItem(`slug="${slug}"`);
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
                let ext = 'jpg';
                if (item.url.toLowerCase().includes('.png')) ext = 'png';
                if (item.url.toLowerCase().includes('.gif')) ext = 'gif';

                formData.append('images', blob, `image.${ext}`);

                await pb.collection('equipment').update(record.id, formData);
                console.log('   SUCCESS!');

            } catch (err) {
                console.error(`   FAILED: ${err.message}`);
            } finally {
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
            }

            // Random delay
            await new Promise(r => setTimeout(r, 800 + Math.random() * 1500));
        }

    } catch (e) {
        console.error("Global Error: " + e.message);
    }
}

seedImages();

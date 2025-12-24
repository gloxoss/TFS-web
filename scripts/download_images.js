/**
 * Download equipment images from the original JSON URLs using browser-like headers.
 * Saves images to ./downloaded_images/ folder.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Original catalog data with bhphotovideo URLs
const CATALOG_DATA = {
    equipment: [
        {
            id: "eqpm00alexa35xx",
            name_en: "ARRI Alexa 35",
            images: ["https://static.bhphoto.com/images/multiple_images/images500x500/1754407216_IMG_2544984.jpg"]
        },
        {
            id: "eqpm00venice2xx",
            name_en: "Sony Venice 2 (8K)",
            images: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_mpc_3628_venice_2_digital_motion_1636969601_1672825.jpg"]
        },
        {
            id: "eqpm00minilfxxx",
            name_en: "ARRI Alexa Mini LF",
            images: ["https://static.bhphoto.com/images/multiple_images/images500x500/1717001182_IMG_2256540.jpg"]
        },
        {
            id: "eqpm00sonyfx3xx",
            name_en: "Sony FX3",
            images: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_ilme_fx3a_fx3_full_frame_cinema_camera_1746547141_1894322.jpg"]
        },
        {
            id: "eqpm00sonyfx9xx",
            name_en: "Sony FX9",
            images: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_pxw_fx9v_pxw_fx9_xdcam_6k_full_frame_1568344897_1506002.jpg"]
        },
        {
            id: "eqpm00cookes4ix",
            name_en: "Cooke S4/i Prime Set",
            images: ["https://res.cloudinary.com/offshoot/q_50,w_1920,c_limit,f_auto/REIS/products/5fb741a435394a631fe5a51f/cooke_mini_s4_i_lens_set_alt_2"]
        },
        {
            id: "eqpm00zeisscp3x",
            name_en: "ZEISS Compact Prime CP.3 Set",
            images: ["https://vmi.tv/wp-content/uploads/sites/3/2023/04/Zeiss-CP3-Set.jpg"]
        },
        {
            id: "eqpm00atlasornx",
            name_en: "Atlas Orion Anamorphic Set",
            images: ["https://res.cloudinary.com/offshoot/q_70,w_3840,c_limit,f_auto/REIS/products/5fba0435a9eb364eeb7b54c1/atlas_orion_2x_anamorphic_a_set_hr_3"]
        },
        {
            id: "eqpm00arrihi5xx",
            name_en: "ARRI Hi-5 Wireless Handheld",
            images: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0041793_hi_5_rx_tx_2400_set_1655120170_1710021.jpg"]
        },
        {
            id: "eqpm00tiltafizx",
            name_en: "Tilta Nucleus-M Wireless FIZ",
            images: ["https://static.bhphoto.com/images/multiple_images/images500x500/1526318171_IMG_988009.jpg"]
        },
        {
            id: "eqpm00ocon2575x",
            name_en: "OConnor Ultimate 2575D",
            images: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1234_0005_ultimate_2575d_fluid_head_1466607922_1232548.jpg"]
        },
        {
            id: "eqpm00sacht25xx",
            name_en: "Sachtler System 25 EFP 2",
            images: ["https://static.bhphoto.com/images/multiple_images/images500x500/1668707156_IMG_1876954.jpg"]
        },
        {
            id: "eqpm00cine7xxxx",
            name_en: "SmallHD Cine 7",
            images: ["https://static.bhphoto.com/images/images500x500/1554137257_1470481.jpg"]
        },
        {
            id: "eqpm00codex2tbx",
            name_en: "Codex Compact Drive 2TB",
            images: ["https://static.bhphoto.com/images/images500x500/1553767658_IMG_1161265.jpg"]
        },
        {
            id: "eqpm00cfexpaxxx",
            name_en: "Sony CFexpress Type A 160GB",
            images: ["https://static.bhphoto.com/images/images500x500/1601387600_1596707.jpg"]
        }
    ]
};

const OUTPUT_DIR = path.join(__dirname, 'downloaded_images');

// Browser-like headers
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.bhphotovideo.com/',
    'DNT': '1',
    'Connection': 'keep-alive',
};

function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;

        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            headers: HEADERS
        };

        client.get(options, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                const newUrl = response.headers.location.startsWith('http')
                    ? response.headers.location
                    : `${urlObj.protocol}//${urlObj.host}${response.headers.location}`;
                return downloadImage(newUrl, filename).then(resolve).catch(reject);
            }

            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }

            const contentType = response.headers['content-type'] || '';
            let ext = '.jpg';
            if (contentType.includes('png')) ext = '.png';
            else if (contentType.includes('webp')) ext = '.webp';

            const filepath = path.join(OUTPUT_DIR, `${filename}${ext}`);
            const writeStream = fs.createWriteStream(filepath);

            response.pipe(writeStream);

            writeStream.on('finish', () => {
                writeStream.close();
                const stats = fs.statSync(filepath);
                console.log(`  ✅ Downloaded: ${filename}${ext} (${stats.size} bytes)`);
                resolve(filepath);
            });

            writeStream.on('error', reject);
        }).on('error', reject);
    });
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("\n🚀 Image Downloader for Equipment Catalog\n");

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

    let successCount = 0;
    let failCount = 0;

    for (const item of CATALOG_DATA.equipment) {
        const itemId = item.id;
        const name = item.name_en;
        const images = item.images || [];

        console.log(`📷 ${name}`);

        for (let i = 0; i < images.length; i++) {
            const url = images[i];
            const filename = images.length > 1 ? `${itemId}_${i}` : itemId;

            try {
                await downloadImage(url, filename);
                successCount++;
            } catch (e) {
                console.log(`  ❌ Failed: ${filename} - ${e.message}`);
                failCount++;
            }

            // Be nice to the server
            await sleep(500);
        }
    }

    console.log(`\n✨ Complete! Success: ${successCount}, Failed: ${failCount}`);
    console.log(`📁 Images saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);

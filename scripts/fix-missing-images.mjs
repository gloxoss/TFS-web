import PocketBase from 'pocketbase';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Node 18+ provides native fetch/FormData, which we use for the PB upload.
const pb = new PocketBase('http://127.0.0.1:8090');

// User Agent to impersonate a browser
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// The specific list of missing items we want to fix.
// Note: I HAVE SWAPPED THE AMIRA AND VARICAM URLS TO FIX THE DATA ERROR.
const DATA = [
    {
        name: "Sony Venice 2 8K",
        slug: "sony-venice-2-8k",
        url: "https://pro.sony/s3/2021/11/15104257/Venice-2-8k-side-App-3-Quarter-Right.jpg"
    },
    {
        name: "ARRI Amira",
        slug: "arri-amira",
        // This is the CORRECT Amira URL (was under Varicam in seed)
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k0_0014798_amira_camera_set_with_1513877808_1346962.jpg"
    },
    {
        name: "Panasonic VariCam LT",
        slug: "panasonic-varicam-lt",
        // This is the CORRECT Varicam URL (was under Amira in seed)
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/panasonic_au_v35lt1g_cinema_varicam_lt_4k_1455802590_1226386.jpg"
    },
    {
        name: "Sony PMW-F55",
        slug: "sony-pmw-f55",
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Sony_PMW_F55_CineAlta_4K_Digital_1458308124_898428.jpg"
    },
    {
        name: "ARRI 9.5-18mm T2.9 Ultra Wide Zoom",
        slug: "arri-9-5-18mm-t2-9-ultra-wide-zoom",
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0001686_uwz_9_5_18mm_t2_9_f_1499174765_1287811.jpg"
    },
    {
        name: "ARRI Alura 18-80mm T2.6 Studio Zoom",
        slug: "arri-alura-18-80mm-t2-6-studio-zoom",
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_47931_0_alura_18_80mm_t2_6_wide_angle_1487692047_1287816.jpg"
    },
    {
        name: "Fujinon Cabrio 14-35mm T2.9",
        slug: "fujinon-cabrio-14-35mm-t2-9",
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk2_5x14_14_35mm_t2_9_cabrio_premier_1384866604_1013528.jpg"
    },
    {
        name: "Fujinon Cabrio 20-120mm T3.5",
        slug: "fujinon-cabrio-20-120mm-t3-5",
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_xk6x20_nm_xk6x20_20_120_pl_mount_1488383209_1322733.jpg"
    },
    {
        name: "Fujinon Cabrio 85-300mm T2.9-4.0",
        slug: "fujinon-cabrio-85-300mm-t2-9-4-0",
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk3_5x85_saf_85_300mm_cabrio_lens_1684943711_1733118.jpg"
    },
    {
        name: "Angenieux Optimo Style 16-40mm T2.8",
        slug: "angenieux-optimo-style-16-40mm-t2-8",
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_16_40_optimo_16_to_40mm_optimo_1419417309_1107020.jpg"
    },
    {
        name: "Angenieux Optimo Style 48-130mm T3",
        slug: "angenieux-optimo-style-48-130mm-t3",
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_optimo_48_130_style_with_asu_optimo_style_48_130mm_zoom_1513340578_1365594.jpg"
    },
    {
        name: "Angenieux Optimo Style 30-76mm T2.8",
        slug: "angenieux-optimo-style-30-76mm-t2-8",
        url: "https://www.bhphotovideo.com/images/fb/angenieux_optimo_30_76_style_optimo_style_30_76mm_zoom_1365593.jpg"
    },
    {
        name: "Sigma 50-100mm T2 High-Speed Zoom",
        slug: "sigma-50-100mm-t2-high-speed-zoom",
        url: "https://www.bhphotovideo.com/images/fb/sigma_693968_sigma_50_100mm_t2_for_1327932.jpg"
    },
    {
        name: "Teradek RT FIZ Wireless Lens Control",
        slug: "teradek-rt-fiz-wireless-lens-control",
        url: "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0056_rt_fiz_wireless_lens_1726150825_1848823.jpg"
    }
];

async function fixImages() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        for (const item of DATA) {
            console.log(`\nProcessing: ${item.name}`);
            console.log(`   URL: ${item.url}`);

            const tempFile = `temp_${item.slug}.jpg`;

            try {
                // 1. Download via Curl
                console.log('   Downloading via curl...');
                // We use cmd /c curl to make sure we use the system curl, not a powershell alias.
                // We fake headers to look like a browser.

                // Escape URL for command line
                const safeUrl = `"${item.url}"`;
                const cmd = `cmd /c curl -L -H "User-Agent: ${USER_AGENT}" -H "Referer: https://www.google.com/" -o "${tempFile}" ${safeUrl}`;

                execSync(cmd, { stdio: 'ignore' }); // ignore output to keep log clean

                if (!fs.existsSync(tempFile) || fs.statSync(tempFile).size < 1000) {
                    throw new Error("Download failed or file too small");
                }

                // 2. Find Record
                const record = await pb.collection('equipment').getFirstListItem(`slug="${item.slug}"`);

                // 3. Upload to PocketBase
                console.log('   Uploading to PocketBase...');
                const formData = new FormData();
                const fileBuffer = fs.readFileSync(tempFile);
                const blob = new Blob([fileBuffer]);
                formData.append('images', blob, `image.jpg`);

                await pb.collection('equipment').update(record.id, formData);
                console.log('   SUCCESS!');

            } catch (err) {
                console.error(`   FAILED: ${err.message}`);
            } finally {
                // Cleanup
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
            }

            // Random delay between 1-3 seconds to be polite
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
        }

    } catch (e) {
        console.error("Global Error: " + e.message);
    }
}

fixImages();

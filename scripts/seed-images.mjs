
import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

// Node 18+ has native fetch and FormData
const pb = new PocketBase('http://127.0.0.1:8090');

// Same DATA array as migration (truncated for brevity in source but full in execution)
// I need to include the FULL data array here again to make sure it runs.
const DATA = [
    {
        "id": "cam_venice_2",
        "name": "Sony Venice 2 8K",
        "images": [
            "https://pro.sony/s3/2021/11/15104257/Venice-2-8k-side-App-3-Quarter-Right.jpg"
        ]
    },
    {
        "id": "cam_alexa_35",
        "name": "ARRI Alexa 35",
        "images": [
            "https://www.arri.com/resource/blob/268940/2c7598c4873322150993922f3542289c/alexa-35-top-data.png"
        ]
    },
    {
        "id": "cam_alexa_mini_lf",
        "name": "ARRI Alexa Mini LF",
        "images": [
            "https://www.arri.com/resource/blob/194738/22f1837ac5d1872dbb65311029415555/alexa-mini-lf-white-data.jpg"
        ]
    },
    {
        "id": "cam_alexa_mini",
        "name": "ARRI Alexa Mini",
        "images": [
            "https://web.archive.org/web/20230601000000im_/https://static.bhphoto.com/images/images500x500/arri_k0_0024310_alexa_mini_lf_and_1553752231_1470347.jpg"
        ]
    },
    {
        "id": "cam_fx9",
        "name": "Sony PXW-FX9",
        "images": [
            "https://pro.sony/s3/2019/09/13093208/PXW-FX9_Side1-large.jpg"
        ]
    },
    {
        "id": "cam_fx3",
        "name": "Sony FX3",
        "images": [
            "https://www.sony.com/image/5d0aa9239ba2576b2c6865882582875b?fmt=png-alpha&wid=660&hei=660"
        ]
    },
    {
        "id": "cam_red_monstro",
        "name": "RED DSMC2 Monstro 8K VV",
        "images": [
            "https://images.red.com/file/red-p-001/DSMC2_BRAIN_SIDE_R3.png"
        ]
    },
    {
        "id": "lens_cooke_s4i",
        "name": "Cooke S4/i Prime Set",
        "images": [
            "https://cookeoptics.com/wp-content/uploads/2021/04/S4i-lens-1.jpg"
        ]
    },
    {
        "id": "lens_arri_master_ana",
        "name": "ARRI / Zeiss Master Anamorphic Set",
        "images": [
            "https://cinevo.com/wp-content/uploads/2022/08/ARRI-Zeiss-Master-Anamorphic-Set-a.jpg"
        ]
    },
    {
        "id": "lens_atlas_orion",
        "name": "Atlas Orion Anamorphic Set",
        "images": [
            "https://res.cloudinary.com/offshoot/q_70,w_3840,c_limit,f_auto/REIS/products/5fba0435a9eb364eeb7b54c1/atlas_orion_2x_anamorphic_a_set_hr_3"
        ]
    },
    {
        "id": "lens_arri_signature",
        "name": "ARRI Signature Primes Set",
        "images": [
            "https://images.squarespace-cdn.com/content/v1/5e72aea433a7b935087f9d5d/5b69e981-9bea-4ff0-bf2d-ddfaa2152c5a/Screenshot+2024-06-02+at+1.17.06%E2%80%AFPM.jpg?format=1000w"
        ]
    },
    {
        "id": "lens_zeiss_supreme",
        "name": "Zeiss Supreme Prime Set",
        "images": [
            "https://cinevo.com/wp-content/uploads/2023/01/cnv-arri-supreme-primes-a-980x652.jpg"
        ]
    },
    {
        "id": "lens_arri_alura_45_250",
        "name": "ARRI Alura 45-250mm T2.6 Telephoto Zoom",
        "images": [
            "https://static.bhphoto.com/images/images750x750/1487692047_1287817.jpg"
        ]
    },
    {
        "id": "lens_canon_17_120",
        "name": "Canon Cine-Servo 17-120mm T2.95-3.9",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1717598768_1833736.jpg"
        ]
    },
    {
        "id": "ctrl_hi5",
        "name": "ARRI Hi-5 Wireless Handheld Set",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0041793_hi_5_rx_tx_2400_set_1655120170_1710021.jpg"
        ]
    },
    {
        "id": "ctrl_wcu4",
        "name": "ARRI WCU-4 Wireless Compact Unit",
        "images": [
            "https://static.bhphoto.com/images/multiple_images/images500x500/1486487704_IMG_749127.jpg"
        ]
    },
    {
        "id": "ctrl_nucleus_m",
        "name": "Tilta Nucleus-M Wireless FIZ",
        "images": [
            "https://static.bhphoto.com/images/multiple_images/images500x500/1526318171_IMG_988009.jpg"
        ]
    },
    {
        "id": "supp_oconnor_2575d",
        "name": "OConnor Ultimate 2575D Fluid Head",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1234_0005_ultimate_2575d_fluid_head_1466607922_1232548.jpg"
        ]
    },
    {
        "id": "supp_sachtler_25",
        "name": "Sachtler System 25 EFP 2",
        "images": [
            "https://static.bhphoto.com/images/multiple_images/images500x500/1668707156_IMG_1876954.jpg"
        ]
    },
    {
        "id": "mon_smallhd_ultra7",
        "name": "SmallHD ULTRA 7 Bolt 6 RX 750",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1715266825_1806333.jpg"
        ]
    },
    {
        "id": "mon_sony_pvm_a170",
        "name": "Sony PVMA170 17\" OLED Monitor",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_pvm_a170b_pvm_a170_17_pro_oled_1490022375_1320839.jpg"
        ]
    },
    {
        "id": "wireless_teradek_bolt6_1500",
        "name": "Teradek Bolt 6 LT 1500 Kit",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1662681512_1723714.jpg"
        ]
    },
    {
        "id": "stab_ronin_2",
        "name": "DJI Ronin 2 Professional Combo",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1558517704_1479666.jpg"
        ]
    },
    {
        "id": "power_bebob_cube",
        "name": "bebob CUBE 1200 Multi-Voltage Battery",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1527082640_1409393.jpg"
        ]
    },
    {
        "id": "mb_arri_lmb4x5",
        "name": "ARRI LMB 4x5 Matte Box Pro Set",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1496676931_1341045.jpg"
        ]
    },
    {
        "id": "cam_amira",
        "name": "ARRI Amira",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/panasonic_au_v35lt1g_cinema_varicam_lt_4k_1455802590_1226386.jpg",
            "https://static.bhphoto.com/images/multiple_images/images500x500/1513878399_IMG_920926.jpg"
        ]
    },
    {
        "id": "cam_varicam_lt",
        "name": "Panasonic VariCam LT",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k0_0014798_amira_camera_set_with_1513877808_1346962.jpg",
            "https://static.bhphoto.com/images/multiple_images/images500x500/1455802213_IMG_588330.jpg"
        ]
    },
    {
        "id": "cam_sony_f55",
        "name": "Sony PMW-F55",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Sony_PMW_F55_CineAlta_4K_Digital_1458308124_898428.jpg",
            "https://static.bhphoto.com/images/multiple_images/images500x500/1458487193_IMG_604767.jpg"
        ]
    },
    {
        "id": "lens_zeiss_master_prime",
        "name": "ARRI / Zeiss Master Prime Set",
        "images": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsKM9wNQwbX7kJIuSdy2K69ysSMwtJmeDWZQ&s"
        ]
    },
    {
        "id": "lens_zeiss_super_speed",
        "name": "ARRI / Zeiss Super Speed MK III Set",
        "images": [
            "https://cdn.sanity.io/images/rns5gelz/production/f76305fe454e6a8a91c77fb0d2bc937bd2c91988-2000x2000.jpg?w=1000&fit=max&auto=format"
        ]
    },
    {
        "id": "lens_zeiss_cp2",
        "name": "Zeiss Compact Prime CP.2 Set",
        "images": [
            "https://www.thevisionhouse.com.au/wp-content/uploads/2022/10/Zeiss-CP2-1-640x0-c-default.jpeg"
        ]
    },
    {
        "id": "lens_zeiss_cp3",
        "name": "Zeiss Compact Prime CP.3 Set",
        "images": [
            "https://vmi.tv/wp-content/uploads/sites/3/2023/04/Zeiss-CP3-Set.jpg"
        ]
    },
    {
        "id": "lens_zeiss_ultra_prime",
        "name": "ARRI / Zeiss Ultra Prime Set",
        "images": [
            "https://images.squarespace-cdn.com/content/v1/5e72aea433a7b935087f9d5d/83d842be-acd1-48e0-8b2d-be1e11120327/Screen+Shot+2023-02-15+at+9.08.34+AM.jpg"
        ]
    },
    {
        "id": "lens_zeiss_standard",
        "name": "Zeiss Standard Prime Set",
        "images": [
            "https://utopiacam.com/wp-content/uploads/2016/05/standardspeeds.jpg"
        ]
    },
    {
        "id": "lens_arri_macro",
        "name": "ARRI Macro Prime Set",
        "images": [
            "https://static.madedaily.com/managed_images/a4fee251-1a0e-4276-b95d-716d2d3536ad/35617/ARRI-Macro-100mm-T2_C.jpg"
        ]
    },
    {
        "id": "lens_zeiss_master_macro",
        "name": "Zeiss Master Macro 100mm",
        "images": [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3o7xDEWDfq1fss3q_AqUFFTJR_yWBlqdYjw&s"
        ]
    },
    {
        "id": "lens_servicevision_scorpio",
        "name": "Servicevision Scorpion Anamorphic Set",
        "images": [
            "https://rental.servicevision.es/wp-content/uploads/2019/02/056_ScorpioLens_Anamorphic2x-1-scaled.jpg"
        ]
    },
    {
        "id": "lens_arri_uwz",
        "name": "ARRI 9.5-18mm T2.9 Ultra Wide Zoom",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0001686_uwz_9_5_18mm_t2_9_f_1499174765_1287811.jpg"
        ]
    },
    {
        "id": "lens_arri_alura_18_80",
        "name": "ARRI Alura 18-80mm T2.6 Studio Zoom",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_47931_0_alura_18_80mm_t2_6_wide_angle_1487692047_1287816.jpg"
        ]
    },
    {
        "id": "lens_fuji_14_35",
        "name": "Fujinon Cabrio 14-35mm T2.9",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk2_5x14_14_35mm_t2_9_cabrio_premier_1384866604_1013528.jpg"
        ]
    },
    {
        "id": "lens_fuji_19_90",
        "name": "Fujinon Cabrio 19-90mm T2.9",
        "images": [
            "https://static.bhphoto.com/images/multiple_images/images500x500/1498824105_IMG_823618.jpg"
        ]
    },
    {
        "id": "lens_fuji_20_120",
        "name": "Fujinon Cabrio 20-120mm T3.5",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_xk6x20_nm_xk6x20_20_120_pl_mount_1488383209_1322733.jpg"
        ]
    },
    {
        "id": "lens_fuji_85_300",
        "name": "Fujinon Cabrio 85-300mm T2.9-4.0",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk3_5x85_saf_85_300mm_cabrio_lens_1684943711_1733118.jpg"
        ]
    },
    {
        "id": "lens_canon_15_47",
        "name": "Canon CN-E 15.5-47mm T2.8 Wide Zoom",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1346318521_889818.jpg"
        ]
    },
    {
        "id": "lens_canon_15_120",
        "name": "Canon Cine-Servo 15-120mm T2.95-3.9",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1662540395_1725850.jpg"
        ]
    },
    {
        "id": "lens_canon_25_250",
        "name": "Canon Cine-Servo 25-250mm T2.95",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1587386883_1557489.jpg"
        ]
    },
    {
        "id": "lens_angenieux_16_40",
        "name": "Angenieux Optimo Style 16-40mm T2.8",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_16_40_optimo_16_to_40mm_optimo_1419417309_1107020.jpg"
        ]
    },
    {
        "id": "lens_angenieux_28_76",
        "name": "Angenieux Optimo 28-76mm T2.6",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1493987833_1332901.jpg"
        ]
    },
    {
        "id": "lens_angenieux_48_130",
        "name": "Angenieux Optimo Style 48-130mm T3",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_optimo_48_130_style_with_asu_optimo_style_48_130mm_zoom_1513340578_1365594.jpg"
        ]
    },
    {
        "id": "lens_angenieux_19_94",
        "name": "Angenieux Optimo Style 19.5-94mm T2.6",
        "images": [
            "https://epc.es/wp-content/uploads/2019/04/ANGENIEUX-195-94mm-20-scaled.jpg"
        ]
    },
    {
        "id": "lens_angenieux_30_76",
        "name": "Angenieux Optimo Style 30-76mm T2.8",
        "images": [
            "https://www.bhphotovideo.com/images/fb/angenieux_optimo_30_76_style_optimo_style_30_76mm_zoom_1365593.jpg"
        ]
    },
    {
        "id": "lens_zeiss_cz2_15_30",
        "name": "Zeiss CZ.2 15-30mm Compact Zoom",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1390563263_1023801.jpg"
        ]
    },
    {
        "id": "lens_tokina_11_16",
        "name": "Tokina 11-16mm T3.0",
        "images": [
            "https://thehdhouse.com/wp-content/uploads/2023/09/tokina-duclos-11-16mm-T3.0-1.png"
        ]
    },
    {
        "id": "lens_sigma_50_100",
        "name": "Sigma 50-100mm T2 High-Speed Zoom",
        "images": [
            "https://www.bhphotovideo.com/images/fb/sigma_693968_sigma_50_100mm_t2_for_1327932.jpg"
        ]
    },
    {
        "id": "ctrl_sxu1",
        "name": "ARRI SXU-1 Single Axis Unit",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0000071_sxu_1_single_axis_unit_1486549411_1287348.jpg"
        ]
    },
    {
        "id": "ctrl_teradek_fiz",
        "name": "Teradek RT FIZ Wireless Lens Control",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0056_rt_fiz_wireless_lens_1726150825_1848823.jpg",
            "https://static.bhphoto.com/images/multiple_images/images500x500/1726151528_IMG_2334960.jpg"
        ]
    },
    {
        "id": "ctrl_teradek_ctrl3",
        "name": "Teradek CTRL.3 Three-Axis Controller",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0047_i_rt_ctrl_3_wireless_lens_1557400011_1473056.jpg",
            "https://static.bhphoto.com/images/multiple_images/images500x500/1557399637_IMG_1181491.jpg"
        ]
    },
    {
        "id": "ctrl_cmotion_one",
        "name": "cmotion compact ONE Set",
        "images": [
            "https://videoking.eu/wp-content/uploads/2022/10/compact-ONE-set-E.jpg"
        ]
    },
    {
        "id": "ctrl_arri_ff5",
        "name": "ARRI FF-5 Cine Follow Focus",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0005758_follow_focus_ff_5_cine_1478778337_1288927.jpg"
        ]
    },
    {
        "id": "ctrl_arri_ff4",
        "name": "ARRI FF-4 Follow Focus",
        "images": [
            "https://static.bhphoto.com/images/images500x500/1478779549_1288924.jpg"
        ]
    },
    {
        "id": "ctrl_arri_ff3",
        "name": "ARRI FF-3 Follow Focus",
        "images": [
            "https://tv-team.no/cdn/shop/files/arri-ff3-1x1-1.png?v=1688412622"
        ]
    },
    {
        "id": "ctrl_chrosziel_dv",
        "name": "Chrosziel DV Studio Rig Follow Focus",
        "images": [
            "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/chrosziel_c_206_60skit_dv_studio_rig_follow_1427280621_1131821.jpg"
        ]
    }
];

async function seedImages() {
    try {
        console.log("Authenticating...");
        try {
            await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
            console.log("Successfully authenticated as admin.");
            let missingCount = 0;
            let failedItems = [];

            for (const item of DATA) {
                if (!item.images || item.images.length === 0) continue;

                const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                try {
                    const record = await pb.collection('equipment').getFirstListItem(`slug="${slug}"`);

                    // Check if already has images
                    if (record.images && record.images.length > 0) {
                        process.stdout.write('.'); // Compact progress
                        continue;
                    }

                    console.log(`\nAttempting to fix: ${item.name}`);
                    missingCount++;

                    // Add delay to avoid aggressive rate limiting
                    await new Promise(r => setTimeout(r, 2000));

                    // Download image with User-Agent
                    const imgUrl = item.images[0];

                    const response = await fetch(imgUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.9',
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache',
                            'Referer': 'https://www.google.com/'
                        }
                    });

                    if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);

                    const blob = await response.blob();
                    const formData = new FormData();

                    let ext = 'jpg';
                    if (imgUrl.includes('.png')) ext = 'png';
                    if (imgUrl.includes('.webp')) ext = 'webp';

                    formData.append('images', blob, `image.${ext}`);

                    await pb.collection('equipment').update(record.id, formData);
                    console.log(` -> Success!`);

                } catch (err) {
                    console.error(` -> FAILED to download real image: ${err.message}`);
                    console.log(" -> Attempting fallback to placeholder...");

                    try {
                        const placeholderUrl = `https://placehold.co/600x400/png?text=${encodeURIComponent(item.name)}`;
                        const phResponse = await fetch(placeholderUrl);
                        const phBlob = await phResponse.blob();
                        const phFormData = new FormData();
                        phFormData.append('images', phBlob, 'placeholder.png');

                        await pb.collection('equipment').update(record.id, phFormData);
                        console.log(" -> Placeholder uploaded successfully.");
                    } catch (phErr) {
                        console.error(" -> Placeholder failed too: " + phErr.message);
                        failedItems.push(item.name);
                    }
                }
            }

            console.log("\n\n------------------------------------------------");
            console.log("IMAGE SYNC COMPLETE");
            console.log("------------------------------------------------");
            if (failedItems.length > 0) {
                console.log(`\n${failedItems.length} items FAILED to download images:`);
                failedItems.forEach(msg => console.log(" - " + msg));
                console.log("\nPossible reasons: URL expired (404), server blocks bots (403), or invalid format.");
            } else {
                console.log("\nAll items have images!");
            }

        } catch (e) {
            console.warn("Admin auth failed (" + e.message + ").");
        }

    } catch (err) {
        console.error("Global error:", err);
    }
}

seedImages();

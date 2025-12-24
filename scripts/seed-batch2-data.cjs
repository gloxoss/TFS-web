const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('http://127.0.0.1:8090');

const NEW_ITEMS = [
    {
        "id": "supp_oconnor_2560",
        "name": "OConnor Ultimate 2560 Fluid Head",
        "brand": "OConnor",
        "category": "Support",
        "tags": ["Fluid Heads"],
        "description": "Designed for digital cinema cameras. Capable of supporting payloads up to 66 lbs. Well suited for portable Alexa configurations.",
        "specifications": {
            "payload": "Up to 66 lbs",
            "base": "Mitchell / 150mm",
            "weight": "18 lbs"
        },
        "stock_available": 1
    },
    {
        "id": "supp_cartoni_master_mk2",
        "name": "Cartoni Master MK2 Head",
        "brand": "Cartoni",
        "category": "Support",
        "tags": ["Fluid Heads"],
        "description": "Offers perfect counterbalance at any tilt angle and a consistent seamless fluid drag.",
        "specifications": {
            "payload": "Standard Cinema",
            "base": "Mitchell / 150mm",
            "counterbalance": "Patented"
        },
        "stock_available": 1
    },
    {
        "id": "supp_cartoni_maxima_30",
        "name": "Cartoni Maxima 30 Video Fluid Head",
        "brand": "Cartoni",
        "category": "Support",
        "tags": ["Fluid Heads"],
        "description": "Covers needs of rigs from 6.6 to 88 lb. Continuous drag system enables almost freewheeling moves.",
        "specifications": {
            "payload": "6.6 to 88 lbs",
            "base": "Mitchell",
            "drag": "Continuous"
        },
        "stock_available": 1
    },
    {
        "id": "supp_sachtler_30",
        "name": "Sachtler VIDEO 30 II Tripod",
        "brand": "Sachtler",
        "category": "Support",
        "tags": ["Tripods"],
        "description": "Features a 150mm bowl and supports heavy cameras up to 32 kg. Integrated Sideload platform.",
        "specifications": {
            "payload": "3 to 32 kg",
            "bowl": "150mm",
            "counterbalance": "18 steps"
        },
        "stock_available": 1
    },
    {
        "id": "supp_arrihead_2",
        "name": "ARRIHEAD 2 Geared Head",
        "brand": "ARRI",
        "category": "Support",
        "tags": ["Fluid Heads"],
        "description": "Compact geared head designed for film and digital. Tilt-axis centered on the camera's optical center.",
        "specifications": {
            "type": "Geared Head",
            "compatibility": "ARRI Bottom Plates",
            "tilt_axis": "Centered"
        },
        "stock_available": 1
    },
    {
        "id": "mb_arri_lmb25",
        "name": "ARRI LMB-25 Matte Box Set",
        "brand": "ARRI",
        "category": "Matte Boxes",
        "description": "Lightweight, modular matte box. Supports up to three filter stages. Clip-on or rod mount.",
        "specifications": {
            "filters": "4x5.65",
            "mounting": "Clamp-on / 15mm LWS",
            "stages": "2 or 3"
        },
        "stock_available": 1
    },
    {
        "id": "mb_arri_mmb2",
        "name": "ARRI MMB-2 Double LWS Set",
        "brand": "ARRI",
        "category": "Matte Boxes",
        "description": "Compact matte box with 15mm LWS rod bracket and two filter trays.",
        "specifications": {
            "filters": "4x5.65 / 4x4",
            "mounting": "15mm LWS",
            "diameter": "114mm"
        },
        "stock_available": 1
    },
    {
        "id": "mb_arri_mb28",
        "name": "ARRI MB-28 6x6 Production Matte Box",
        "brand": "ARRI",
        "category": "Matte Boxes",
        "description": "Swing-away matte box with two sliding trays and one geared tray. 6.6 x 6.6 format.",
        "specifications": {
            "filters": "6.6 x 6.6",
            "mounting": "19mm Studio",
            "feature": "Swing-away"
        },
        "stock_available": 1
    },
    {
        "id": "mb_arri_mb14",
        "name": "ARRI MB-14 Matte Box",
        "brand": "ARRI",
        "category": "Matte Boxes",
        "description": "Production matte box for large zooms and primes. 6.6 x 6.6 filter size.",
        "specifications": {
            "filters": "6.6 x 6.6",
            "mounting": "19mm / 15mm Studio",
            "usage": "Large Zooms"
        },
        "stock_available": 1
    },
    {
        "id": "mb_chrosziel_450",
        "name": "Chrosziel 450-R11 Matte Box",
        "brand": "Chrosziel",
        "category": "Matte Boxes",
        "description": "Fits 15mm support rods. Single stage filter holder for 4x4 or 4x5.65.",
        "specifications": {
            "filters": "4x5.65 / 4x4",
            "mounting": "15mm LWS",
            "diameter": "114mm"
        },
        "stock_available": 1
    },
    {
        "id": "mon_smallhd_ultra7_touch",
        "name": "SmallHD ULTRA 7 UHD 4K Monitor",
        "brand": "SmallHD",
        "category": "Monitors",
        "tags": ["On-Camera"],
        "description": "Bright 2300 cd/m2 display. Camera control options for ARRI, Sony, RED.",
        "specifications": {
            "size": "7 inch",
            "brightness": "2300 nits",
            "resolution": "1920 x 1200",
            "inputs": "HDMI / 6G-SDI"
        },
        "stock_available": 1
    },
    {
        "id": "mon_smallhd_703",
        "name": "SmallHD 703 Bolt 7\" Wireless Monitor",
        "brand": "SmallHD",
        "category": "Monitors",
        "tags": ["Production"],
        "description": "Director's monitor with built-in Teradek receiver (Bolt 500/1000/3000 compatible).",
        "specifications": {
            "size": "7 inch",
            "brightness": "3000 nits",
            "wireless": "Integrated Receiver",
            "latency": "Zero Delay"
        },
        "stock_available": 1
    },
    {
        "id": "mon_smallhd_702_oled",
        "name": "SmallHD 702 OLED On-Camera Monitor",
        "brand": "SmallHD",
        "category": "Monitors",
        "tags": ["On-Camera"],
        "description": "Wide-gamut OLED display solution. Pure blacks and high contrast.",
        "specifications": {
            "size": "7 inch",
            "panel": "OLED",
            "gamut": "Wide Color Gamut"
        },
        "stock_available": 1
    },
    {
        "id": "mon_smallhd_cine7_red",
        "name": "SmallHD Cine 7 RED RCP2 Monitor",
        "brand": "SmallHD",
        "category": "Monitors",
        "tags": ["On-Camera"],
        "description": "Includes RED KOMODO/DSMC3 RCP2 camera control software upgrade.",
        "specifications": {
            "size": "7 inch",
            "control": "RED RCP2",
            "brightness": "1800 nits"
        },
        "stock_available": 1
    },
    {
        "id": "mon_tvlogic_055a",
        "name": "TVLogic VFM-055A 5.5\" OLED",
        "brand": "TVLogic",
        "category": "Monitors",
        "tags": ["On-Camera"],
        "description": "OLED display delivering deep blacks and accurate color. Compact design.",
        "specifications": {
            "size": "5.5 inch",
            "panel": "OLED",
            "resolution": "1920 x 1080"
        },
        "stock_available": 1
    },
    {
        "id": "mon_tvlogic_056w",
        "name": "TVLogic VFM-056W/WP",
        "brand": "TVLogic",
        "category": "Monitors",
        "tags": ["On-Camera"],
        "description": "Lightweight magnesium-alloy case. Ideal for HD-SLR production.",
        "specifications": {
            "size": "5.6 inch",
            "resolution": "1280 x 800",
            "features": "Waveform/Vectorscope"
        },
        "stock_available": 1
    },
    {
        "id": "mon_tvlogic_071w",
        "name": "TVLogic LQM-071W",
        "brand": "TVLogic",
        "category": "Monitors",
        "tags": ["Production"],
        "description": "Features 4 Autosensing Inputs. Rack mountable.",
        "specifications": {
            "size": "7 inch",
            "inputs": "4 x BNC",
            "display": "Split Screen capable"
        },
        "stock_available": 1
    },
    {
        "id": "mon_tvlogic_091w",
        "name": "TVLogic LVM-091W-M",
        "brand": "TVLogic",
        "category": "Monitors",
        "tags": ["Production"],
        "description": "9 inch broadcast production monitor. High contrast anti-glare panel.",
        "specifications": {
            "size": "9 inch",
            "resolution": "960x540 (Native)",
            "contrast": "1000:1"
        },
        "stock_available": 1
    },
    {
        "id": "mon_tvlogic_24",
        "name": "TVLogic 24\" Full HD 3G-SDI Monitor",
        "brand": "TVLogic",
        "category": "Monitors",
        "tags": ["Production"],
        "description": "Full HD 24\" display designed for field monitoring. Max brightness 600 cd/m2.",
        "specifications": {
            "size": "24 inch",
            "resolution": "1920 x 1200",
            "brightness": "600 nits"
        },
        "stock_available": 1
    },
    {
        "id": "mon_sony_bvm_e251",
        "name": "Sony BVM-E251 24\" OLED Reference",
        "brand": "Sony",
        "category": "Monitors",
        "tags": ["Production"],
        "description": "Reference Monitor for critical image evaluation. Exceptional contrast and deep blacks.",
        "specifications": {
            "size": "24 inch",
            "panel": "OLED",
            "usage": "Color Grading / Reference"
        },
        "stock_available": 1
    },
    {
        "id": "mon_marshall_24",
        "name": "Marshall V-MD241 24\" LED LCD",
        "brand": "Marshall",
        "category": "Monitors",
        "tags": ["Production"],
        "description": "Fit for professional SD and HD productions. LED backlit.",
        "specifications": {
            "size": "24 inch",
            "panel": "LCD",
            "inputs": "Component / Composite"
        },
        "stock_available": 1
    },
    {
        "id": "mon_transvideo_starlite",
        "name": "ARRI Transvideo Starlite ARRI-WVS",
        "brand": "ARRI",
        "category": "Monitors",
        "tags": ["Recorder"],
        "description": "Combination monitor/recorder with built-in wireless video receiver.",
        "specifications": {
            "size": "5 inch",
            "panel": "OLED Touch",
            "wireless": "ARRI-WVS Receiver"
        },
        "stock_available": 1
    },
    {
        "id": "mon_bm_assist_5",
        "name": "Blackmagic Video Assist 5\" 3G-SDI",
        "brand": "Blackmagic Design",
        "category": "Monitors",
        "tags": ["Recorder"],
        "description": "Monitoring and high-quality recording. 3G-SDI and HDMI inputs.",
        "specifications": {
            "size": "5 inch",
            "recording": "ProRes / DNxHD",
            "brightness": "300 nits"
        },
        "stock_available": 1
    },
    {
        "id": "mon_bm_assist_7",
        "name": "Blackmagic Video Assist 7\" 12G-SDI",
        "brand": "Blackmagic Design",
        "category": "Monitors",
        "tags": ["Recorder"],
        "description": "Bright 2500 cd/m2 display. 12G-SDI and HDMI inputs. Supports Blackmagic Raw.",
        "specifications": {
            "size": "7 inch",
            "brightness": "2500 nits",
            "inputs": "12G-SDI / HDMI"
        },
        "stock_available": 1
    },
    {
        "id": "mon_atomos_shogun",
        "name": "Atomos Shogun 7\" HDR Monitor",
        "brand": "Atomos",
        "category": "Monitors",
        "tags": ["Recorder"],
        "description": "Ultra-bright 3000 nit display. Monitor, record, and switch in a single tool.",
        "specifications": {
            "size": "7 inch",
            "brightness": "3000 nits",
            "recording": "ProRes RAW"
        },
        "stock_available": 1
    },
    {
        "id": "mon_atomos_ninja",
        "name": "Atomos Ninja Inferno 7\"",
        "brand": "Atomos",
        "category": "Monitors",
        "tags": ["Recorder"],
        "description": "Record DCI and UHD 4K signals at up to 60 fps. AtomHDR display technology.",
        "specifications": {
            "size": "7 inch",
            "recording": "4K 60fps",
            "inputs": "HDMI"
        },
        "stock_available": 1
    },
    {
        "id": "mon_pix_e7",
        "name": "Video Devices PIX-E7 7\" 4K Recorder",
        "brand": "Video Devices",
        "category": "Monitors",
        "tags": ["Recorder"],
        "description": "Record 4K video over HDMI and 6G-SDI to SpeedDrive SSDs. Die-cast metal chassis.",
        "specifications": {
            "size": "7 inch",
            "recording": "ProRes",
            "media": "SpeedDrive SSD"
        },
        "stock_available": 1
    },
    {
        "id": "wl_teradek_ranger",
        "name": "Teradek Ranger MK II 750",
        "brand": "Teradek",
        "category": "Wireless Video",
        "description": "Transmit lossless 4K video up to 750'. Zero delay.",
        "specifications": {
            "range": "750 ft",
            "resolution": "4K HDR",
            "latency": "Zero Delay"
        },
        "stock_available": 1
    },
    {
        "id": "wl_teradek_bolt6_750",
        "name": "Teradek Bolt 6 LT 750 Kit",
        "brand": "Teradek",
        "category": "Wireless Video",
        "description": "Supports 6 GHz wireless frequency. 4K30 video with 10-bit HDR.",
        "specifications": {
            "range": "750 ft",
            "resolution": "4K30",
            "frequency": "6 GHz"
        },
        "stock_available": 1
    },
    {
        "id": "wl_teradek_3000",
        "name": "Teradek Bolt Pro 3000 Set",
        "brand": "Teradek",
        "category": "Wireless Video",
        "description": "Transmit uncompressed 1080p video over 3000 feet line-of-sight.",
        "specifications": {
            "range": "3000 ft",
            "resolution": "1080p60",
            "multicast": "Up to 4 receivers"
        },
        "stock_available": 1
    },
    {
        "id": "wl_teradek_sidekick",
        "name": "Teradek Bolt Sidekick II",
        "brand": "Teradek",
        "category": "Wireless Video",
        "description": "Universal receiver compatible with Bolt 500, 1000, and 3000 transmitters.",
        "specifications": {
            "range": "300 ft",
            "compatibility": "Bolt 500/1000/3000",
            "output": "SDI"
        },
        "stock_available": 1
    },
    {
        "id": "wl_teradek_2000",
        "name": "Teradek Bolt Pro 2000 Set",
        "brand": "Teradek",
        "category": "Wireless Video",
        "description": "Latency free wireless transmission up to 2000 ft over the 5GHz band.",
        "specifications": {
            "range": "2000 ft",
            "latency": "Zero Delay",
            "inputs": "SDI / HDMI"
        },
        "stock_available": 1
    },
    {
        "id": "wl_teradek_1000xt",
        "name": "Teradek Bolt 1000 XT Set",
        "brand": "Teradek",
        "category": "Wireless Video",
        "description": "Visually lossless 3G video signals with zero latency up to 1000 ft.",
        "specifications": {
            "range": "1000 ft",
            "feature": "Cross Conversion",
            "latency": "Zero Delay"
        },
        "stock_available": 1
    },
    {
        "id": "wl_teradek_1000",
        "name": "Teradek Bolt Pro 1000 Set",
        "brand": "Teradek",
        "category": "Wireless Video",
        "description": "Transmit uncompressed 1080p video wirelessly over 1000 feet.",
        "specifications": {
            "range": "1000 ft",
            "latency": "Zero Delay",
            "resolution": "1080p60"
        },
        "stock_available": 1
    },
    {
        "id": "wl_teradek_lt500",
        "name": "Teradek Bolt LT 500 Set",
        "brand": "Teradek",
        "category": "Wireless Video",
        "description": "Lighter and smaller high-performance wireless video system.",
        "specifications": {
            "range": "500 ft",
            "latency": "Zero Delay",
            "inputs": "SDI or HDMI"
        },
        "stock_available": 1
    },
    {
        "id": "wl_teradek_500xt",
        "name": "Teradek Bolt 500 XT Set",
        "brand": "Teradek",
        "category": "Wireless Video",
        "description": "Send and receive visually lossless 3G-video signals up to 500'.",
        "specifications": {
            "range": "500 ft",
            "latency": "Zero Delay",
            "compatibility": "Bolt 500 Series"
        },
        "stock_available": 1
    },
    {
        "id": "wl_teradek_300",
        "name": "Teradek Bolt Pro 300 Set",
        "brand": "Teradek",
        "category": "Wireless Video",
        "description": "Dual Format Video Transmitter/Receiver. Internal antennas.",
        "specifications": {
            "range": "300 ft",
            "latency": "Zero Delay",
            "inputs": "SDI / HDMI"
        },
        "stock_available": 1
    },
    {
        "id": "wl_swit_cws300",
        "name": "SWIT CW-S300 Wireless System",
        "brand": "SWIT",
        "category": "Wireless Video",
        "description": "Stable, low-latency video transmission for professional on-set monitoring.",
        "specifications": {
            "inputs": "SDI / HDMI",
            "latency": "Low",
            "range": "Long Range"
        },
        "stock_available": 1
    },
    {
        "id": "wl_hollyland_400s",
        "name": "Hollyland Mars 400S PRO II",
        "brand": "Hollyland",
        "category": "Wireless Video",
        "description": "Receive up to 1080p60 wireless video. Low 70ms latency.",
        "specifications": {
            "range": "500 ft",
            "latency": "70 ms",
            "inputs": "SDI / HDMI"
        },
        "stock_available": 1
    },
    {
        "id": "stab_ronin_s",
        "name": "DJI Ronin-S",
        "brand": "DJI",
        "category": "Stabilization",
        "description": "Single-handed form factor for DSLR and mirrorless cameras.",
        "specifications": {
            "payload": "8 lbs",
            "type": "Single Handed",
            "compatibility": "DSLR / Mirrorless"
        },
        "stock_available": 1
    },
    {
        "id": "stab_force_pro",
        "name": "DJI Force Pro",
        "brand": "DJI",
        "category": "Stabilization",
        "description": "Remote controller featuring Motion Control for Ronin 2 and Ronin-S.",
        "specifications": {
            "control": "Motion Control",
            "compatibility": "Ronin 2 / Ronin-S",
            "display": "OLED"
        },
        "stock_available": 1
    },
    {
        "id": "stab_rs3_pro",
        "name": "DJI RS 3 Pro Combo",
        "brand": "DJI",
        "category": "Stabilization",
        "description": "Professional 3-axis motorized stabilization system with extended payload capacity.",
        "specifications": {
            "material": "Carbon Fiber",
            "payload": "10 lbs",
            "features": "Automated Axis Locks"
        },
        "stock_available": 1
    },
    {
        "id": "stab_rs4_pro",
        "name": "DJI RS 4 Pro Combo",
        "brand": "DJI",
        "category": "Stabilization",
        "description": "Enhanced operation efficiency, native vertical shooting. 9.9 lb load capacity.",
        "specifications": {
            "payload": "9.9 lb",
            "battery": "13 Hours",
            "vertical": "Native Shooting"
        },
        "stock_available": 1
    },
    {
        "id": "stab_crane_3s",
        "name": "Zhiyun CRANE 3S",
        "brand": "Zhiyun",
        "category": "Stabilization",
        "description": "Powerful redesign with detachable handle options and 14.3 lb payload.",
        "specifications": {
            "payload": "14.3 lb",
            "design": "Modular",
            "axis": "55 degree roll"
        },
        "stock_available": 1
    },
    {
        "id": "power_ecoflow_delta",
        "name": "EcoFlow DELTA Pro Power Station",
        "brand": "EcoFlow",
        "category": "Power",
        "description": "Portable power station delivering 3600Wh of power. AC outlets and USB ports.",
        "specifications": {
            "capacity": "3600Wh",
            "output": "3600W AC",
            "charging": "AC, Solar, EV"
        },
        "stock_available": 1
    }
];

async function run() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        for (const item of NEW_ITEMS) {
            const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            // Find/Create Category
            const catSlug = item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            let catId = "";
            try {
                const cat = await pb.collection('categories').getFirstListItem(`slug="${catSlug}"`);
                catId = cat.id;
            } catch (err) {
                try {
                    const cat = await pb.collection('categories').getFirstListItem(`name="${item.category}"`);
                    catId = cat.id;
                } catch (err2) {
                    const newCat = await pb.collection('categories').create({
                        name: item.category,
                        name_en: item.category,
                        name_fr: item.category,
                        slug: catSlug,
                        icon: "box"
                    });
                    catId = newCat.id;
                    console.log(`Created new category: ${item.category}`);
                }
            }

            // Find or Create Item
            const data = {
                slug: slug,
                name_en: item.name,
                name_fr: item.name,
                description_en: item.description,
                description_fr: item.description,
                brand: item.brand,
                category: catId,
                stock: 100,
                stock_available: 100,
                daily_rate: 100,
                visibility: true,
                specs_en: item.specifications,
                specs_fr: item.specifications,
                type: (item.tags && item.tags.length > 0) ? item.tags[0] : "",

                // Flatten specific specs
                mount: item.specifications.mount || "",
                sensor_size: item.specifications.sensor_size || "",
                resolution: item.specifications.max_resolution || item.specifications.resolution || ""
            };

            try {
                const record = await pb.collection('equipment').getFirstListItem(`slug="${slug}"`);
                await pb.collection('equipment').update(record.id, data);
                console.log(`Updated: ${item.name}`);
            } catch (err) {
                await pb.collection('equipment').create(data);
                console.log(`Created: ${item.name}`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}

run();

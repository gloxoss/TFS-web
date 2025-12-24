"""
Download equipment images from the original JSON URLs using browser-like headers.
Saves images to ./downloaded_images/ folder.
"""
import os
import json
import requests
import time
from urllib.parse import urlparse

# Original catalog data with bhphotovideo URLs
CATALOG_DATA = {
    "equipment": [
        {
            "id": "eqpm00alexa35xx",
            "name_en": "ARRI Alexa 35",
            "images": ["https://static.bhphoto.com/images/multiple_images/images500x500/1754407216_IMG_2544984.jpg"]
        },
        {
            "id": "eqpm00venice2xx",
            "name_en": "Sony Venice 2 (8K)",
            "images": ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_mpc_3628_venice_2_digital_motion_1636969601_1672825.jpg"]
        },
        {
            "id": "eqpm00minilfxxx",
            "name_en": "ARRI Alexa Mini LF",
            "images": ["https://static.bhphoto.com/images/multiple_images/images500x500/1717001182_IMG_2256540.jpg"]
        },
        {
            "id": "eqpm00sonyfx3xx",
            "name_en": "Sony FX3",
            "images": ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_ilme_fx3a_fx3_full_frame_cinema_camera_1746547141_1894322.jpg"]
        },
        {
            "id": "eqpm00sonyfx9xx",
            "name_en": "Sony FX9",
            "images": ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_pxw_fx9v_pxw_fx9_xdcam_6k_full_frame_1568344897_1506002.jpg"]
        },
        {
            "id": "eqpm00cookes4ix",
            "name_en": "Cooke S4/i Prime Set",
            "images": ["https://res.cloudinary.com/offshoot/q_50,w_1920,c_limit,f_auto/REIS/products/5fb741a435394a631fe5a51f/cooke_mini_s4_i_lens_set_alt_2"]
        },
        {
            "id": "eqpm00zeisscp3x",
            "name_en": "ZEISS Compact Prime CP.3 Set",
            "images": ["https://vmi.tv/wp-content/uploads/sites/3/2023/04/Zeiss-CP3-Set.jpg"]
        },
        {
            "id": "eqpm00atlasornx",
            "name_en": "Atlas Orion Anamorphic Set",
            "images": ["https://res.cloudinary.com/offshoot/q_70,w_3840,c_limit,f_auto/REIS/products/5fba0435a9eb364eeb7b54c1/atlas_orion_2x_anamorphic_a_set_hr_3"]
        },
        {
            "id": "eqpm00arrihi5xx",
            "name_en": "ARRI Hi-5 Wireless Handheld",
            "images": ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0041793_hi_5_rx_tx_2400_set_1655120170_1710021.jpg"]
        },
        {
            "id": "eqpm00tiltafizx",
            "name_en": "Tilta Nucleus-M Wireless FIZ",
            "images": ["https://static.bhphoto.com/images/multiple_images/images500x500/1526318171_IMG_988009.jpg"]
        },
        {
            "id": "eqpm00ocon2575x",
            "name_en": "OConnor Ultimate 2575D",
            "images": ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1234_0005_ultimate_2575d_fluid_head_1466607922_1232548.jpg"]
        },
        {
            "id": "eqpm00sacht25xx",
            "name_en": "Sachtler System 25 EFP 2",
            "images": ["https://static.bhphoto.com/images/multiple_images/images500x500/1668707156_IMG_1876954.jpg"]
        },
        {
            "id": "eqpm00cine7xxxx",
            "name_en": "SmallHD Cine 7",
            "images": ["https://static.bhphoto.com/images/images500x500/1554137257_1470481.jpg"]
        },
        {
            "id": "eqpm00codex2tbx",
            "name_en": "Codex Compact Drive 2TB",
            "images": ["https://static.bhphoto.com/images/images500x500/1553767658_IMG_1161265.jpg"]
        },
        {
            "id": "eqpm00cfexpaxxx",
            "name_en": "Sony CFexpress Type A 160GB",
            "images": ["https://static.bhphoto.com/images/images500x500/1601387600_1596707.jpg"]
        }
    ]
}

# Browser-like headers
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://www.bhphotovideo.com/',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'image',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'same-origin',
}

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'downloaded_images')

def download_image(url: str, filename: str) -> bool:
    """Download an image with browser-like headers."""
    try:
        # Create session for persistent connection
        session = requests.Session()
        session.headers.update(HEADERS)
        
        # Get the image
        response = session.get(url, timeout=30, allow_redirects=True)
        response.raise_for_status()
        
        # Determine extension from content-type
        content_type = response.headers.get('content-type', '')
        if 'png' in content_type:
            ext = '.png'
        elif 'webp' in content_type:
            ext = '.webp'
        else:
            ext = '.jpg'
        
        filepath = os.path.join(OUTPUT_DIR, f"{filename}{ext}")
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"  ✅ Downloaded: {filename}{ext} ({len(response.content)} bytes)")
        return True
        
    except Exception as e:
        print(f"  ❌ Failed: {filename} - {e}")
        return False

def main():
    print("\n🚀 Image Downloader for Equipment Catalog\n")
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"📁 Output directory: {OUTPUT_DIR}\n")
    
    success_count = 0
    fail_count = 0
    
    for item in CATALOG_DATA['equipment']:
        item_id = item['id']
        name = item['name_en']
        images = item.get('images', [])
        
        print(f"📷 {name}")
        
        for i, url in enumerate(images):
            filename = f"{item_id}_{i}" if len(images) > 1 else item_id
            
            if download_image(url, filename):
                success_count += 1
            else:
                fail_count += 1
            
            # Be nice to the server
            time.sleep(0.5)
    
    print(f"\n✨ Complete! Success: {success_count}, Failed: {fail_count}")
    print(f"📁 Images saved to: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()

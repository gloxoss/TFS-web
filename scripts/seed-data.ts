/**
 * PocketBase Seed Data Script
 * 
 * Populates the database with comprehensive test data for:
 * - Categories (6 equipment types)
 * - Equipment (20+ items across all categories)
 * - Quotes (sample requests in various statuses)
 * - Test users (admin + customers)
 * 
 * Usage: npx tsx scripts/seed-data.ts
 * 
 * Requirements:
 * - PocketBase running at http://127.0.0.1:8090
 * - Admin credentials set in environment or script
 */

import PocketBase from 'pocketbase';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@tfs-rental.com';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'adminpassword123';

const pb = new PocketBase(PB_URL);

// ============================================================================
// Seed Data Definitions
// ============================================================================

const categories = [
  {
    name: 'Cameras',
    name_en: 'Cameras',
    name_fr: 'Caméras',
    slug: 'cameras',
    description: 'Professional cinema cameras for film and video production',
    icon: 'camera',
  },
  {
    name: 'Lenses',
    name_en: 'Lenses',
    name_fr: 'Objectifs',
    slug: 'lenses',
    description: 'Cinema prime and zoom lenses',
    icon: 'aperture',
  },
  {
    name: 'Lighting',
    name_en: 'Lighting',
    name_fr: 'Éclairage',
    slug: 'lighting',
    description: 'Professional lighting equipment for film sets',
    icon: 'sun',
  },
  {
    name: 'Audio',
    name_en: 'Audio',
    name_fr: 'Audio',
    slug: 'audio',
    description: 'Professional audio recording equipment',
    icon: 'mic',
  },
  {
    name: 'Grip & Support',
    name_en: 'Grip & Support',
    name_fr: 'Machinerie & Support',
    slug: 'grip',
    description: 'Tripods, dollies, sliders, and camera support',
    icon: 'move',
  },
  {
    name: 'Accessories',
    name_en: 'Accessories',
    name_fr: 'Accessoires',
    slug: 'accessories',
    description: 'Monitors, recorders, batteries, and more',
    icon: 'package',
  },
];

// Equipment items with full bilingual support
const equipment = [
  // ============ CAMERAS ============
  {
    name_en: 'Sony FX6 Full-Frame Cinema Camera',
    name_fr: 'Caméra Cinéma Sony FX6 Plein Format',
    slug: 'sony-fx6',
    category_slug: 'cameras',
    brand: 'Sony',
    description_en: 'The FX6 is a full-frame cinema camera featuring a 10.2MP sensor with enhanced sensitivity and 15+ stops of dynamic range. Perfect for documentary, commercial, and narrative projects.',
    description_fr: 'La FX6 est une caméra cinéma plein format équipée d\'un capteur de 10,2 MP avec une sensibilité améliorée et plus de 15 stops de plage dynamique. Parfaite pour les documentaires, publicités et projets narratifs.',
    specs_en: '{"Sensor": "10.2MP Full-Frame", "Dynamic Range": "15+ stops", "Recording": "4K 120fps", "Weight": "890g body only"}',
    specs_fr: '{"Capteur": "10,2 MP Plein Format", "Plage Dynamique": "15+ stops", "Enregistrement": "4K 120fps", "Poids": "890g boîtier seul"}',
    daily_rate: 350,
    stock: 3,
    stock_available: 2,
    featured: true,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'ARRI Alexa Mini LF',
    name_fr: 'ARRI Alexa Mini LF',
    slug: 'arri-alexa-mini-lf',
    category_slug: 'cameras',
    brand: 'ARRI',
    description_en: 'The ALEXA Mini LF combines the large-format sensor with the compact and versatile form factor of the original ALEXA Mini. Industry standard for high-end productions.',
    description_fr: 'L\'ALEXA Mini LF combine le capteur grand format avec le format compact et polyvalent de l\'ALEXA Mini original. Standard de l\'industrie pour les productions haut de gamme.',
    specs_en: '{"Sensor": "Large Format 4.5K", "Dynamic Range": "14+ stops", "Recording": "ARRIRAW, ProRes", "Weight": "2.6kg"}',
    specs_fr: '{"Capteur": "Grand Format 4.5K", "Plage Dynamique": "14+ stops", "Enregistrement": "ARRIRAW, ProRes", "Poids": "2,6kg"}',
    daily_rate: 1200,
    stock: 2,
    stock_available: 1,
    featured: true,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'RED Komodo 6K',
    name_fr: 'RED Komodo 6K',
    slug: 'red-komodo-6k',
    category_slug: 'cameras',
    brand: 'RED',
    description_en: 'Compact cinema camera with 6K Super 35 sensor. Global shutter option, Canon RF mount, and RED\'s legendary color science.',
    description_fr: 'Caméra cinéma compacte avec capteur 6K Super 35. Option obturateur global, monture Canon RF et la science des couleurs légendaire de RED.',
    specs_en: '{"Sensor": "6K Super 35", "Dynamic Range": "16+ stops", "Recording": "REDCODE RAW", "Weight": "1.2kg"}',
    specs_fr: '{"Capteur": "6K Super 35", "Plage Dynamique": "16+ stops", "Enregistrement": "REDCODE RAW", "Poids": "1,2kg"}',
    daily_rate: 500,
    stock: 2,
    stock_available: 2,
    featured: true,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Blackmagic URSA Mini Pro 12K',
    name_fr: 'Blackmagic URSA Mini Pro 12K',
    slug: 'bmpcc-ursa-12k',
    category_slug: 'cameras',
    brand: 'Blackmagic',
    description_en: 'Revolutionary 12K digital film camera with 14 stops of dynamic range and Blackmagic RAW recording.',
    description_fr: 'Caméra film numérique révolutionnaire 12K avec 14 stops de plage dynamique et enregistrement Blackmagic RAW.',
    specs_en: '{"Sensor": "12K Super 35", "Dynamic Range": "14 stops", "Recording": "Blackmagic RAW", "Weight": "2.5kg"}',
    specs_fr: '{"Capteur": "12K Super 35", "Plage Dynamique": "14 stops", "Enregistrement": "Blackmagic RAW", "Poids": "2,5kg"}',
    daily_rate: 400,
    stock: 1,
    stock_available: 0,
    featured: false,
    visibility: true,
    availability_status: 'rented',
  },
  {
    name_en: 'Canon C70 Cinema Camera',
    name_fr: 'Caméra Cinéma Canon C70',
    slug: 'canon-c70',
    category_slug: 'cameras',
    brand: 'Canon',
    description_en: 'Compact RF-mount cinema camera with Dual Gain Output sensor and Cinema RAW Light recording.',
    description_fr: 'Caméra cinéma compacte monture RF avec capteur Dual Gain Output et enregistrement Cinema RAW Light.',
    specs_en: '{"Sensor": "Super 35 DGO", "Dynamic Range": "16+ stops", "Recording": "Cinema RAW Light", "Weight": "1.2kg"}',
    specs_fr: '{"Capteur": "Super 35 DGO", "Plage Dynamique": "16+ stops", "Enregistrement": "Cinema RAW Light", "Poids": "1,2kg"}',
    daily_rate: 250,
    stock: 2,
    stock_available: 2,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },

  // ============ LENSES ============
  {
    name_en: 'Zeiss Supreme Prime Set (25, 35, 50, 85mm)',
    name_fr: 'Set Zeiss Supreme Prime (25, 35, 50, 85mm)',
    slug: 'zeiss-supreme-prime-set',
    category_slug: 'lenses',
    brand: 'Zeiss',
    description_en: 'Full-frame cinema primes with stunning optical quality. T1.5 maximum aperture, consistent size across the range.',
    description_fr: 'Objectifs fixes cinéma plein format avec une qualité optique exceptionnelle. Ouverture maximale T1.5, taille constante sur toute la gamme.',
    specs_en: '{"Mount": "PL", "Aperture": "T1.5", "Coverage": "Full Frame", "Focus": "Manual"}',
    specs_fr: '{"Monture": "PL", "Ouverture": "T1.5", "Couverture": "Plein Format", "Mise au point": "Manuelle"}',
    daily_rate: 800,
    stock: 2,
    stock_available: 1,
    featured: true,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Canon CN-E 30-105mm T2.8 Cine Zoom',
    name_fr: 'Canon CN-E 30-105mm T2.8 Zoom Cinéma',
    slug: 'canon-cne-30-105',
    category_slug: 'lenses',
    brand: 'Canon',
    description_en: 'Versatile cinema zoom with 4K optical quality. Constant T2.8 aperture throughout the zoom range.',
    description_fr: 'Zoom cinéma polyvalent avec qualité optique 4K. Ouverture constante T2.8 sur toute la plage de zoom.',
    specs_en: '{"Mount": "EF/PL", "Aperture": "T2.8", "Range": "30-105mm", "Coverage": "Super 35"}',
    specs_fr: '{"Monture": "EF/PL", "Ouverture": "T2.8", "Plage": "30-105mm", "Couverture": "Super 35"}',
    daily_rate: 300,
    stock: 2,
    stock_available: 2,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Sigma Cine 18-35mm T2.0',
    name_fr: 'Sigma Cine 18-35mm T2.0',
    slug: 'sigma-cine-18-35',
    category_slug: 'lenses',
    brand: 'Sigma',
    description_en: 'Fast wide-angle cinema zoom. Popular choice for run-and-gun documentary work.',
    description_fr: 'Zoom cinéma grand-angle rapide. Choix populaire pour le travail documentaire.',
    specs_en: '{"Mount": "EF/PL", "Aperture": "T2.0", "Range": "18-35mm", "Coverage": "Super 35"}',
    specs_fr: '{"Monture": "EF/PL", "Ouverture": "T2.0", "Plage": "18-35mm", "Couverture": "Super 35"}',
    daily_rate: 150,
    stock: 3,
    stock_available: 3,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Cooke S4/i Prime Set (25, 32, 50, 75, 100mm)',
    name_fr: 'Set Cooke S4/i Prime (25, 32, 50, 75, 100mm)',
    slug: 'cooke-s4i-prime-set',
    category_slug: 'lenses',
    brand: 'Cooke',
    description_en: 'The legendary "Cooke Look" - warm, organic, and flattering to skin tones. Industry standard for narrative cinema.',
    description_fr: 'Le légendaire "Cooke Look" - chaud, organique et flatteur pour les tons chair. Standard de l\'industrie pour le cinéma narratif.',
    specs_en: '{"Mount": "PL", "Aperture": "T2.0", "Coverage": "Super 35", "Focus": "Manual"}',
    specs_fr: '{"Monture": "PL", "Ouverture": "T2.0", "Couverture": "Super 35", "Mise au point": "Manuelle"}',
    daily_rate: 600,
    stock: 1,
    stock_available: 1,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },

  // ============ LIGHTING ============
  {
    name_en: 'ARRI SkyPanel S60-C',
    name_fr: 'ARRI SkyPanel S60-C',
    slug: 'arri-skypanel-s60c',
    category_slug: 'lighting',
    brand: 'ARRI',
    description_en: 'Industry-standard LED soft light with full RGBW color control. Exceptional color quality and output.',
    description_fr: 'Lumière LED douce standard de l\'industrie avec contrôle complet des couleurs RGBW. Qualité de couleur et rendu exceptionnels.',
    specs_en: '{"Output": "1200W equivalent", "Color": "Full RGBW", "CRI": "95+", "Control": "DMX/Wireless"}',
    specs_fr: '{"Puissance": "Équivalent 1200W", "Couleur": "RGBW complet", "CRI": "95+", "Contrôle": "DMX/Sans fil"}',
    daily_rate: 200,
    stock: 4,
    stock_available: 3,
    featured: true,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Aputure 600d Pro',
    name_fr: 'Aputure 600d Pro',
    slug: 'aputure-600d-pro',
    category_slug: 'lighting',
    brand: 'Aputure',
    description_en: 'Powerful daylight LED with Bowens mount. 600W output in a compact, weather-resistant body.',
    description_fr: 'LED lumière du jour puissante avec monture Bowens. Sortie 600W dans un boîtier compact et résistant aux intempéries.',
    specs_en: '{"Output": "600W", "Color Temp": "5600K", "CRI": "96+", "Mount": "Bowens"}',
    specs_fr: '{"Puissance": "600W", "Temp. Couleur": "5600K", "CRI": "96+", "Monture": "Bowens"}',
    daily_rate: 100,
    stock: 6,
    stock_available: 4,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Litepanels Gemini 2x1 Soft',
    name_fr: 'Litepanels Gemini 2x1 Soft',
    slug: 'litepanels-gemini-2x1',
    category_slug: 'lighting',
    brand: 'Litepanels',
    description_en: 'Versatile 2x1 LED panel with exceptional color accuracy and full spectrum tunability.',
    description_fr: 'Panneau LED 2x1 polyvalent avec une précision des couleurs exceptionnelle et accordabilité spectre complet.',
    specs_en: '{"Output": "325W", "Color": "Full Spectrum", "CRI": "98+", "Size": "2x1 ft"}',
    specs_fr: '{"Puissance": "325W", "Couleur": "Spectre complet", "CRI": "98+", "Taille": "60x30 cm"}',
    daily_rate: 150,
    stock: 4,
    stock_available: 4,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'ARRI M18 HMI Kit',
    name_fr: 'Kit ARRI M18 HMI',
    slug: 'arri-m18-hmi',
    category_slug: 'lighting',
    brand: 'ARRI',
    description_en: 'Compact 1800W HMI fresnel. Excellent for daylight matching and large-scale lighting setups.',
    description_fr: 'Fresnel HMI compact 1800W. Excellent pour l\'équilibrage lumière du jour et les grandes configurations d\'éclairage.',
    specs_en: '{"Output": "1800W HMI", "Color Temp": "5600K", "Beam": "Fresnel", "Power": "1800W"}',
    specs_fr: '{"Puissance": "1800W HMI", "Temp. Couleur": "5600K", "Faisceau": "Fresnel", "Consommation": "1800W"}',
    daily_rate: 250,
    stock: 2,
    stock_available: 1,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },

  // ============ AUDIO ============
  {
    name_en: 'Sound Devices MixPre-10 II',
    name_fr: 'Sound Devices MixPre-10 II',
    slug: 'sound-devices-mixpre-10',
    category_slug: 'audio',
    brand: 'Sound Devices',
    description_en: 'Professional 10-input/12-track field recorder with legendary Sound Devices preamps.',
    description_fr: 'Enregistreur de terrain professionnel 10 entrées/12 pistes avec les légendaires préamplis Sound Devices.',
    specs_en: '{"Inputs": "10", "Tracks": "12", "Sample Rate": "192kHz", "Bit Depth": "32-bit float"}',
    specs_fr: '{"Entrées": "10", "Pistes": "12", "Fréq. Échantillonnage": "192kHz", "Résolution": "32-bit float"}',
    daily_rate: 150,
    stock: 2,
    stock_available: 2,
    featured: true,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Sennheiser MKH 416 Shotgun Mic',
    name_fr: 'Micro Canon Sennheiser MKH 416',
    slug: 'sennheiser-mkh-416',
    category_slug: 'audio',
    brand: 'Sennheiser',
    description_en: 'Industry-standard short shotgun microphone. The workhorse of film and broadcast production.',
    description_fr: 'Microphone canon court standard de l\'industrie. Le cheval de bataille des productions cinéma et broadcast.',
    specs_en: '{"Pattern": "Super-cardioid", "Frequency": "40Hz-20kHz", "Sensitivity": "25mV/Pa", "Weight": "175g"}',
    specs_fr: '{"Directivité": "Super-cardioïde", "Fréquence": "40Hz-20kHz", "Sensibilité": "25mV/Pa", "Poids": "175g"}',
    daily_rate: 50,
    stock: 6,
    stock_available: 5,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Sennheiser EW 112P G4 Wireless Lavalier Kit',
    name_fr: 'Kit Micro Cravate Sans Fil Sennheiser EW 112P G4',
    slug: 'sennheiser-ew112p-g4',
    category_slug: 'audio',
    brand: 'Sennheiser',
    description_en: 'Reliable wireless lavalier system for interviews and dialogue recording.',
    description_fr: 'Système de micro cravate sans fil fiable pour les interviews et l\'enregistrement de dialogues.',
    specs_en: '{"Range": "100m", "Frequency": "UHF", "Battery": "8hrs AA", "Channels": "20"}',
    specs_fr: '{"Portée": "100m", "Fréquence": "UHF", "Autonomie": "8h AA", "Canaux": "20"}',
    daily_rate: 75,
    stock: 8,
    stock_available: 6,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },

  // ============ GRIP & SUPPORT ============
  {
    name_en: 'Sachtler Video 18 S2 Fluid Head + Tripod',
    name_fr: 'Tête Fluide Sachtler Video 18 S2 + Trépied',
    slug: 'sachtler-video-18-s2',
    category_slug: 'grip',
    brand: 'Sachtler',
    description_en: 'Professional fluid head supporting up to 20kg. Industry standard for broadcast and cinema.',
    description_fr: 'Tête fluide professionnelle supportant jusqu\'à 20kg. Standard de l\'industrie pour le broadcast et le cinéma.',
    specs_en: '{"Capacity": "20kg", "Counterbalance": "16 steps", "Pan/Tilt": "Fluid", "Height": "155cm max"}',
    specs_fr: '{"Capacité": "20kg", "Contrepoids": "16 niveaux", "Pan/Tilt": "Fluide", "Hauteur": "155cm max"}',
    daily_rate: 100,
    stock: 4,
    stock_available: 3,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'DJI Ronin 2 Gimbal',
    name_fr: 'Gimbal DJI Ronin 2',
    slug: 'dji-ronin-2',
    category_slug: 'grip',
    brand: 'DJI',
    description_en: 'Professional 3-axis gimbal supporting cinema cameras up to 13.6kg.',
    description_fr: 'Gimbal 3 axes professionnel supportant les caméras cinéma jusqu\'à 13,6kg.',
    specs_en: '{"Capacity": "13.6kg", "Runtime": "8 hours", "Modes": "SmoothTrack, POV", "Control": "Remote/App"}',
    specs_fr: '{"Capacité": "13,6kg", "Autonomie": "8 heures", "Modes": "SmoothTrack, POV", "Contrôle": "Télécommande/App"}',
    daily_rate: 200,
    stock: 2,
    stock_available: 2,
    featured: true,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Dana Dolly Portable Dolly System',
    name_fr: 'Système Dolly Portable Dana Dolly',
    slug: 'dana-dolly',
    category_slug: 'grip',
    brand: 'Dana Dolly',
    description_en: 'Versatile portable dolly system using speedrail or pipe. Quick setup for smooth tracking shots.',
    description_fr: 'Système dolly portable polyvalent utilisant speedrail ou tube. Installation rapide pour des travellings fluides.',
    specs_en: '{"Track": "Speedrail/Pipe", "Capacity": "45kg", "Width": "Adjustable", "Material": "Aluminum"}',
    specs_fr: '{"Rail": "Speedrail/Tube", "Capacité": "45kg", "Largeur": "Réglable", "Matériau": "Aluminium"}',
    daily_rate: 75,
    stock: 3,
    stock_available: 3,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },

  // ============ ACCESSORIES ============
  {
    name_en: 'SmallHD Cine 7 Monitor',
    name_fr: 'Moniteur SmallHD Cine 7',
    slug: 'smallhd-cine-7',
    category_slug: 'accessories',
    brand: 'SmallHD',
    description_en: '7-inch daylight-viewable touchscreen with built-in Teradek receiver option.',
    description_fr: 'Écran tactile 7 pouces visible en plein jour avec option récepteur Teradek intégré.',
    specs_en: '{"Size": "7 inch", "Resolution": "1920x1200", "Brightness": "1800 nits", "LUT Support": "Yes"}',
    specs_fr: '{"Taille": "7 pouces", "Résolution": "1920x1200", "Luminosité": "1800 nits", "Support LUT": "Oui"}',
    daily_rate: 100,
    stock: 4,
    stock_available: 3,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Teradek Bolt 4K 750 TX/RX Set',
    name_fr: 'Kit Teradek Bolt 4K 750 TX/RX',
    slug: 'teradek-bolt-4k-750',
    category_slug: 'accessories',
    brand: 'Teradek',
    description_en: 'Zero-delay 4K HDR wireless video transmission up to 750ft.',
    description_fr: 'Transmission vidéo sans fil 4K HDR sans délai jusqu\'à 230m.',
    specs_en: '{"Resolution": "4K HDR", "Range": "750ft/230m", "Latency": "<1ms", "Receivers": "Up to 4"}',
    specs_fr: '{"Résolution": "4K HDR", "Portée": "750ft/230m", "Latence": "<1ms", "Récepteurs": "Jusqu\'à 4"}',
    daily_rate: 250,
    stock: 2,
    stock_available: 2,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Anton Bauer Titon 150 V-Mount Battery (4-pack)',
    name_fr: 'Batterie Anton Bauer Titon 150 V-Mount (lot de 4)',
    slug: 'anton-bauer-titon-150-4pack',
    category_slug: 'accessories',
    brand: 'Anton Bauer',
    description_en: '150Wh V-Mount batteries with P-Tap and USB outputs. Flight-safe design.',
    description_fr: 'Batteries V-Mount 150Wh avec sorties P-Tap et USB. Design agréé transport aérien.',
    specs_en: '{"Capacity": "150Wh each", "Output": "14.4V", "Quantity": "4 batteries", "Charger": "Quad included"}',
    specs_fr: '{"Capacité": "150Wh chacune", "Sortie": "14,4V", "Quantité": "4 batteries", "Chargeur": "Quad inclus"}',
    daily_rate: 80,
    stock: 5,
    stock_available: 4,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },
  {
    name_en: 'Atomos Ninja V+ 8K HDR Monitor/Recorder',
    name_fr: 'Moniteur/Enregistreur Atomos Ninja V+ 8K HDR',
    slug: 'atomos-ninja-v-plus',
    category_slug: 'accessories',
    brand: 'Atomos',
    description_en: '5-inch HDR monitor with ProRes RAW recording up to 8K.',
    description_fr: 'Moniteur HDR 5 pouces avec enregistrement ProRes RAW jusqu\'à 8K.',
    specs_en: '{"Size": "5 inch", "Recording": "8K ProRes RAW", "Brightness": "1000 nits", "Storage": "SSD"}',
    specs_fr: '{"Taille": "5 pouces", "Enregistrement": "8K ProRes RAW", "Luminosité": "1000 nits", "Stockage": "SSD"}',
    daily_rate: 75,
    stock: 3,
    stock_available: 3,
    featured: false,
    visibility: true,
    availability_status: 'available',
  },

  // Hidden/maintenance item for testing visibility filter
  {
    name_en: 'Sony PXW-FS7 Mark II (Under Maintenance)',
    name_fr: 'Sony PXW-FS7 Mark II (En Maintenance)',
    slug: 'sony-fs7-mk2-maintenance',
    category_slug: 'cameras',
    brand: 'Sony',
    description_en: 'Currently under maintenance - sensor cleaning and firmware update.',
    description_fr: 'Actuellement en maintenance - nettoyage capteur et mise à jour firmware.',
    specs_en: '{"Status": "Under maintenance"}',
    specs_fr: '{"Statut": "En maintenance"}',
    daily_rate: 300,
    stock: 1,
    stock_available: 0,
    featured: false,
    visibility: false,
    availability_status: 'maintenance',
  },
];

// Sample quotes in various statuses
const quotes = [
  {
    client_name: 'Marie Dubois',
    client_email: 'marie.dubois@productionxyz.com',
    client_phone: '+33 6 12 34 56 78',
    client_company: 'Production XYZ',
    rental_start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    rental_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    project_description: '[commercial] Luxury perfume commercial for international brand. High-end production with multiple setups.',
    special_requests: 'Delivery: delivery\nNeed equipment delivered to studio by 7am on start date.',
    status: 'pending',
    language: 'fr',
    items_json: JSON.stringify([
      { productId: 'arri-alexa-mini-lf', name: 'ARRI Alexa Mini LF', quantity: 1, rentalDays: 7, dailyRate: 1200, lineTotal: 8400 },
      { productId: 'zeiss-supreme-prime-set', name: 'Zeiss Supreme Prime Set', quantity: 1, rentalDays: 7, dailyRate: 800, lineTotal: 5600 },
      { productId: 'arri-skypanel-s60c', name: 'ARRI SkyPanel S60-C', quantity: 4, rentalDays: 7, dailyRate: 200, lineTotal: 5600 },
    ]),
  },
  {
    client_name: 'John Smith',
    client_email: 'john.smith@docufilms.ca',
    client_phone: '+1 514 555 0123',
    client_company: 'DocuFilms Canada',
    rental_start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    rental_end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    project_description: '[documentary] Wildlife documentary in Northern Quebec. Need rugged, reliable gear.',
    special_requests: 'Delivery: pickup\nWill pick up at 6pm day before start.',
    status: 'reviewing',
    language: 'en',
    items_json: JSON.stringify([
      { productId: 'sony-fx6', name: 'Sony FX6', quantity: 2, rentalDays: 7, dailyRate: 350, lineTotal: 4900 },
      { productId: 'sigma-cine-18-35', name: 'Sigma Cine 18-35mm', quantity: 2, rentalDays: 7, dailyRate: 150, lineTotal: 2100 },
      { productId: 'sound-devices-mixpre-10', name: 'Sound Devices MixPre-10 II', quantity: 1, rentalDays: 7, dailyRate: 150, lineTotal: 1050 },
      { productId: 'sennheiser-ew112p-g4', name: 'Sennheiser Wireless Lavalier', quantity: 4, rentalDays: 7, dailyRate: 75, lineTotal: 2100 },
    ]),
  },
  {
    client_name: 'Sophie Martin',
    client_email: 'sophie@independentfilm.fr',
    client_phone: '+33 7 89 01 23 45',
    client_company: 'Independent Film Co.',
    rental_start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    rental_end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    project_description: '[film] Short film "La Lumière" - currently in production.',
    special_requests: 'Delivery: delivery',
    status: 'confirmed',
    language: 'fr',
    estimated_price: 4500,
    items_json: JSON.stringify([
      { productId: 'red-komodo-6k', name: 'RED Komodo 6K', quantity: 1, rentalDays: 7, dailyRate: 500, lineTotal: 3500 },
      { productId: 'cooke-s4i-prime-set', name: 'Cooke S4/i Prime Set', quantity: 1, rentalDays: 7, dailyRate: 600, lineTotal: 4200 },
      { productId: 'dji-ronin-2', name: 'DJI Ronin 2', quantity: 1, rentalDays: 7, dailyRate: 200, lineTotal: 1400 },
    ]),
  },
  {
    client_name: 'Alex Chen',
    client_email: 'alex.chen@musicvideo.tv',
    client_phone: '+1 438 555 9876',
    client_company: 'MusicVideo.TV',
    rental_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    rental_end_date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
    project_description: '[music_video] Hip-hop music video - completed successfully.',
    special_requests: 'Delivery: pickup',
    status: 'confirmed',
    language: 'en',
    estimated_price: 2800,
    items_json: JSON.stringify([
      { productId: 'sony-fx6', name: 'Sony FX6', quantity: 1, rentalDays: 2, dailyRate: 350, lineTotal: 700 },
      { productId: 'aputure-600d-pro', name: 'Aputure 600d Pro', quantity: 3, rentalDays: 2, dailyRate: 100, lineTotal: 600 },
      { productId: 'dji-ronin-2', name: 'DJI Ronin 2', quantity: 1, rentalDays: 2, dailyRate: 200, lineTotal: 400 },
    ]),
  },
  {
    client_name: 'Pierre Rejected',
    client_email: 'pierre@example.com',
    client_phone: '+33 6 00 00 00 00',
    client_company: '',
    rental_start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    rental_end_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    project_description: '[other] Personal project',
    special_requests: '',
    status: 'rejected',
    internal_notes: 'Rejected due to incomplete information and no valid ID provided.',
    language: 'fr',
    items_json: JSON.stringify([
      { productId: 'arri-alexa-mini-lf', name: 'ARRI Alexa Mini LF', quantity: 1, rentalDays: 2, dailyRate: 1200, lineTotal: 2400 },
    ]),
  },
];

// Test users
const testUsers = [
  {
    email: 'customer@test.com',
    password: 'customer123',
    passwordConfirm: 'customer123',
    name: 'Test Customer',
    emailVisibility: true,
  },
  {
    email: 'filmmaker@test.com',
    password: 'filmmaker123',
    passwordConfirm: 'filmmaker123',
    name: 'Professional Filmmaker',
    emailVisibility: true,
  },
];

// ============================================================================
// Seed Functions
// ============================================================================

async function clearCollections() {
  console.log('🗑️  Clearing existing data...');
  
  const collections = ['quotes', 'equipment', 'categories'];
  
  for (const collection of collections) {
    try {
      const records = await pb.collection(collection).getFullList();
      for (const record of records) {
        await pb.collection(collection).delete(record.id);
      }
      console.log(`   ✓ Cleared ${collection}`);
    } catch (error) {
      console.log(`   ⚠ Collection ${collection} not found or empty`);
    }
  }
}

async function seedCategories(): Promise<Map<string, string>> {
  console.log('\n📁 Seeding categories...');
  const categoryMap = new Map<string, string>();
  
  for (const category of categories) {
    try {
      const record = await pb.collection('categories').create(category);
      categoryMap.set(category.slug, record.id);
      console.log(`   ✓ Created category: ${category.name_en}`);
    } catch (error: any) {
      console.error(`   ✗ Failed to create category ${category.name_en}:`, error.message);
    }
  }
  
  return categoryMap;
}

async function seedEquipment(categoryMap: Map<string, string>) {
  console.log('\n📷 Seeding equipment...');
  
  for (const item of equipment) {
    try {
      const categoryId = categoryMap.get(item.category_slug);
      if (!categoryId) {
        console.error(`   ✗ Category not found for ${item.name_en}: ${item.category_slug}`);
        continue;
      }
      
      const { category_slug, ...itemData } = item;
      await pb.collection('equipment').create({
        ...itemData,
        category: categoryId,
      });
      console.log(`   ✓ Created: ${item.name_en}`);
    } catch (error: any) {
      console.error(`   ✗ Failed to create ${item.name_en}:`, error.message);
    }
  }
}

async function seedQuotes() {
  console.log('\n📋 Seeding quotes...');
  
  for (const quote of quotes) {
    try {
      // Generate confirmation number
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let suffix = '';
      for (let i = 0; i < 4; i++) {
        suffix += chars[Math.floor(Math.random() * chars.length)];
      }
      const confirmationNumber = `TFS-${year}${month}${day}-${suffix}`;
      
      await pb.collection('quotes').create({
        ...quote,
        confirmation_number: confirmationNumber,
        pdf_generated: false,
      });
      console.log(`   ✓ Created quote: ${quote.client_name} (${quote.status})`);
    } catch (error: any) {
      console.error(`   ✗ Failed to create quote for ${quote.client_name}:`, error.message);
    }
  }
}

async function seedUsers() {
  console.log('\n👤 Seeding test users...');
  
  for (const user of testUsers) {
    try {
      await pb.collection('users').create(user);
      console.log(`   ✓ Created user: ${user.email}`);
    } catch (error: any) {
      if (error.message?.includes('unique')) {
        console.log(`   ⚠ User already exists: ${user.email}`);
      } else {
        console.error(`   ✗ Failed to create user ${user.email}:`, error.message);
      }
    }
  }
}

async function seedKitTemplates(categoryMap: Map<string, string>) {
  console.log('\n📦 Seeding kit templates...');
  
  // First, get a camera product to use as main_product
  let sonyFx6Id: string | null = null;
  let redKomodoId: string | null = null;
  
  try {
    const sonyFx6 = await pb.collection('equipment').getFirstListItem('slug="sony-fx6"');
    sonyFx6Id = sonyFx6.id;
  } catch {
    console.log('   ⚠ Sony FX6 not found, skipping kit template');
  }
  
  try {
    const redKomodo = await pb.collection('equipment').getFirstListItem('slug="red-komodo-6k"');
    redKomodoId = redKomodo.id;
  } catch {
    console.log('   ⚠ RED Komodo not found');
  }

  const lensesCategoryId = categoryMap.get('lenses');
  const accessoriesCategoryId = categoryMap.get('accessories');

  // Get some lenses for kit items
  let lenses: Array<{ id: string; name: string }> = [];
  if (lensesCategoryId) {
    try {
      const lensRecords = await pb.collection('equipment').getFullList({
        filter: `category="${lensesCategoryId}"`,
      });
      lenses = lensRecords.map(r => ({ id: r.id, name: r.name_en }));
      console.log(`   ℹ Found ${lenses.length} lenses`);
    } catch (err: any) {
      console.log('   ⚠ Could not fetch lenses:', err.message);
    }
  }

  // Get some accessories
  let accessories: Array<{ id: string; name: string }> = [];
  if (accessoriesCategoryId) {
    try {
      const accessoryRecords = await pb.collection('equipment').getFullList({
        filter: `category="${accessoriesCategoryId}"`,
      });
      accessories = accessoryRecords.map(r => ({ id: r.id, name: r.name_en }));
      console.log(`   ℹ Found ${accessories.length} accessories`);
    } catch (err: any) {
      console.log('   ⚠ Could not fetch accessories:', err.message);
    }
  }

  if (!sonyFx6Id || lenses.length === 0) {
    console.log('   ⚠ Skipping kit templates (missing required products)');
    return;
  }

  // Create Sony FX6 Documentary Kit
  try {
    const kitTemplate = await pb.collection('kit_templates').create({
      name: 'Sony FX6 Documentary Kit',
      main_product: sonyFx6Id,
      base_price_modifier: -50, // $50 discount for the kit
      description: 'Complete documentary shooting kit with Sony FX6 and essential accessories',
    });
    console.log(`   ✓ Created kit template: ${kitTemplate.name}`);

    // Add kit items (lenses slot)
    if (lenses.length > 0) {
      await pb.collection('kit_items').create({
        template: kitTemplate.id,
        product: lenses[0].id,
        slot_name: 'Lenses',
        is_mandatory: true,
        default_quantity: 1,
        swappable_category: lensesCategoryId,
      });
      console.log(`   ✓ Added lens to kit: ${lenses[0].name}`);
    }

    // Add optional second lens
    if (lenses.length > 1) {
      await pb.collection('kit_items').create({
        template: kitTemplate.id,
        product: lenses[1].id,
        slot_name: 'Lenses',
        is_mandatory: false,
        default_quantity: 1,
        swappable_category: lensesCategoryId,
      });
      console.log(`   ✓ Added optional lens to kit: ${lenses[1].name}`);
    }

    // Add accessories
    if (accessories.length > 0) {
      await pb.collection('kit_items').create({
        template: kitTemplate.id,
        product: accessories[0].id,
        slot_name: 'Accessories',
        is_mandatory: true,
        default_quantity: 1,
        swappable_category: accessoriesCategoryId,
      });
      console.log(`   ✓ Added accessory to kit: ${accessories[0].name}`);
    }

  } catch (error: any) {
    console.error(`   ✗ Failed to create kit template:`, error.message);
  }

  // Create RED Komodo Cinema Kit if available
  if (redKomodoId && lenses.length > 0 && lensesCategoryId) {
    try {
      const kitTemplate = await pb.collection('kit_templates').create({
        name: 'RED Komodo Cinema Kit',
        main_product: redKomodoId,
        base_price_modifier: -75,
        description: 'Premium cinema kit with RED Komodo and professional lenses',
      });
      console.log(`   ✓ Created kit template: ${kitTemplate.name}`);

      // Add PL-mount lenses
      for (let i = 0; i < Math.min(2, lenses.length); i++) {
        await pb.collection('kit_items').create({
          template: kitTemplate.id,
          product: lenses[i].id,
          slot_name: 'Cinema Lenses',
          is_mandatory: i === 0,
          default_quantity: 1,
          swappable_category: lensesCategoryId,
        });
      }
      console.log(`   ✓ Added lenses to RED Komodo kit`);

    } catch (error: any) {
      console.error(`   ✗ Failed to create RED Komodo kit:`, error.message);
    }
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log('🎬 TFS Cinema Equipment Rental - Database Seeder');
  console.log('================================================\n');
  console.log(`PocketBase URL: ${PB_URL}`);
  
  try {
    // Authenticate as admin
    console.log('\n🔐 Authenticating as admin...');
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('   ✓ Authenticated successfully');
    
    // Clear and seed
    await clearCollections();
    const categoryMap = await seedCategories();
    await seedEquipment(categoryMap);
    await seedQuotes();
    await seedUsers();
    await seedKitTemplates(categoryMap);
    
    console.log('\n✅ Seeding complete!');
    console.log('\n📊 Summary:');
    console.log(`   • ${categories.length} categories`);
    console.log(`   • ${equipment.length} equipment items`);
    console.log(`   • ${quotes.length} sample quotes`);
    console.log(`   • ${testUsers.length} test users`);
    console.log(`   • 2 kit templates with items`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Customer: customer@test.com / customer123');
    console.log('   Filmmaker: filmmaker@test.com / filmmaker123');
    
  } catch (error: any) {
    console.error('\n❌ Seeding failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. PocketBase is running at', PB_URL);
    console.log('   2. Admin credentials are correct');
    console.log('   3. Collections exist (equipment, categories, quotes, users)');
    process.exit(1);
  }
}

main();

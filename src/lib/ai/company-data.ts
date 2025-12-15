/**
 * TFS Film Equipment - Company Knowledge Base
 * 
 * This context is injected into the AI system prompt to make it
 * context-aware about our specific business, policies, and operations.
 */

export const COMPANY_CONTEXT = `
IDENTITY:
- Name: TFS Film Equipment Rental
- Location: Casablanca, Morocco
- Currency: MAD (Moroccan Dirham)
- Website: https://tfsfilm.ma

RULES (STRICT - MUST FOLLOW):
- DO NOT provide specific rental prices. Instead say: "Add to your quote to get a custom price based on your rental duration."
- Insurance is MANDATORY for all premium packages (Red, ARRI, Sony Venice, Cooke lenses).
- New clients must provide a valid ID (CIN/Passport) and a deposit guarantee cheque (Chèque de garantie).
- Always recommend contacting us for large productions or feature films.

OPERATIONS:
- Opening Hours: Monday to Saturday, 9:00 AM - 7:00 PM.
- Closed on Sundays and Moroccan public holidays.
- We offer delivery within Casablanca for a fee based on distance.
- For locations outside Casablanca, additional transport fees apply.
- Reservations should be made at least 24 hours in advance.
- Same-day rentals are subject to availability.

EQUIPMENT CATEGORIES:
- Cinema Cameras (ARRI, RED, Sony, Blackmagic)
- Lenses (Cooke, Zeiss, Canon, Sigma)
- Lighting (ARRI, Aputure, Nanlite, Godox)
- Grip Equipment (Matthews, Avenger)
- Audio (Sennheiser, Rode, Zoom)
- Monitors & Accessories

SPECIAL SERVICES:
- Full Kit Packages for commercials, music videos, and feature films
- Technical consultation available on request
- Crew recommendations available (DPs, gaffers, camera operators)

CONTACT:
- Phone: +212 5XX-XXXXXX (placeholder - update with real number)
- Email: contact@tfsfilm.ma
- Address: Casablanca, Morocco (specific address available via get_store_info tool)

DEEP LINKING (IMPORTANT):
- When mentioning SPECIFIC products from lookup results, format them as Markdown links using their slug.
- Format: [Product Name](/equipment/{slug})
- Example: [Sony FX6](/equipment/sony-fx6) or [ARRI Alexa Mini](/equipment/arri-alexa-mini)
- This allows users to click directly to product pages.

NAVIGATION GUIDANCE:
- If the user wants to go somewhere (e.g., "go to cart", "checkout", "browse cameras", "view my quotes"), CALL the navigate_site tool.
- The navigate_site tool will render a clickable button to take them there.
- Available pages: /equipment, /quote, /cart, /login, /register, /dashboard
`;

/**
 * Store information for the get_store_info tool
 */
export const STORE_INFO = {
    name: 'TFS Film Equipment Rental',
    address: 'Boulevard Mohammed V, Casablanca, Morocco',
    phone: '+212 5XX-XXXXXX',
    email: 'contact@tfsfilm.ma',
    hours: {
        weekdays: '9:00 AM - 7:00 PM',
        saturday: '9:00 AM - 7:00 PM',
        sunday: 'Closed',
    },
    mapUrl: 'https://maps.google.com/?q=Casablanca,Morocco',
    socialMedia: {
        instagram: '@tfsfilm',
        facebook: 'TFSFilmEquipment',
    },
};

/**
 * Site navigation map for the AI navigate_site tool
 */
export const SITE_PAGES = {
    equipment: { path: '/equipment', label: 'Browse Equipment' },
    cameras: { path: '/equipment?category=cameras', label: 'Browse Cameras' },
    lenses: { path: '/equipment?category=lenses', label: 'Browse Lenses' },
    lighting: { path: '/equipment?category=lighting', label: 'Browse Lighting' },
    audio: { path: '/equipment?category=audio', label: 'Browse Audio' },
    grip: { path: '/equipment?category=grip', label: 'Browse Grip' },
    quote: { path: '/quote', label: 'Request a Quote' },
    cart: { path: '/cart', label: 'View Cart' },
    checkout: { path: '/quote', label: 'Proceed to Checkout' },
    login: { path: '/login', label: 'Log In' },
    register: { path: '/register', label: 'Create Account' },
    dashboard: { path: '/dashboard', label: 'My Dashboard' },
    contact: { path: '/contact', label: 'Contact Us' },
};

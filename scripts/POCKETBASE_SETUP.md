# PocketBase Collections Setup Guide

This guide explains how to set up the required collections in PocketBase for the TFS Cinema Equipment Rental platform.

## Quick Start

1. **Start PocketBase** (if not running):
   ```bash
   cd pocketbase
   ./pocketbase serve
   ```

2. **Access Admin UI**: http://127.0.0.1:8090/_/

3. **Create Collections** (in this order due to relations):
   - categories
   - equipment
   - quotes

---

## Collection: `categories`

Equipment categories for organizing the catalog.

### Fields:
| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `name` | Text | ✓ | Max 100 |
| `name_en` | Text | ✓ | Max 100 |
| `name_fr` | Text | ✓ | Max 100 |
| `slug` | Text | ✓ | Unique, Max 50 |
| `description` | Text | | Max 500 |
| `icon` | Text | | Max 50 |
| `thumbnail` | File | | Single image |

### API Rules:
- **List/View**: Leave empty (public access)
- **Create/Update/Delete**: `@request.auth.id != ""` (admin only)

---

## Collection: `equipment`

Main product catalog with bilingual support.

### Fields:
| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `name_en` | Text | ✓ | Max 200 |
| `name_fr` | Text | ✓ | Max 200 |
| `slug` | Text | ✓ | Unique, Max 100 |
| `category` | Relation | ✓ | → categories (single) |
| `brand` | Text | | Max 100 |
| `description_en` | Editor | | Rich text |
| `description_fr` | Editor | | Rich text |
| `specs_en` | JSON | | Technical specifications |
| `specs_fr` | JSON | | Technical specifications (FR) |
| `daily_rate` | Number | ✓ | Min 0, Decimals allowed |
| `stock` | Number | ✓ | Min 0, Integer |
| `stock_available` | Number | ✓ | Min 0, Integer |
| `images` | File | | Multiple images |
| `featured` | Bool | | Default: false |
| `visibility` | Bool | | Default: true |
| `availability_status` | Select | | Options: available, rented, maintenance |

### API Rules:
- **List/View**: `visibility = true` (or empty for all)
- **Create/Update/Delete**: `@request.auth.id != ""` (admin only)

---

## Collection: `quotes`

Rental quote requests from customers.

### Fields:
| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `confirmation_number` | Text | ✓ | Unique, Pattern: TFS-XXXXXX-XXXX |
| `client_name` | Text | ✓ | Max 200 |
| `client_email` | Email | ✓ | |
| `client_phone` | Text | | Max 50 |
| `client_company` | Text | | Max 200 |
| `rental_start_date` | Date | ✓ | |
| `rental_end_date` | Date | ✓ | |
| `items_json` | JSON | ✓ | Array of cart items |
| `project_description` | Text | | Max 2000 |
| `special_requests` | Text | | Max 2000 |
| `status` | Select | ✓ | Options: pending, reviewing, confirmed, rejected |
| `estimated_price` | Number | | Decimals allowed |
| `internal_notes` | Text | | Admin only, Max 5000 |
| `language` | Select | | Options: en, fr |
| `pdf_generated` | Bool | | Default: false |
| `user` | Relation | | → users (single, optional) |

### API Rules:
- **List/View**: `@request.auth.id != "" && (user = @request.auth.id || @request.auth.role = "admin")`
- **Create**: Leave empty (public quote submission)
- **Update/Delete**: `@request.auth.id != ""` (admin only)

---

## Collection: `users` (System Collection)

PocketBase has a built-in `users` collection. Add these custom fields:

### Additional Fields:
| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `name` | Text | | Max 200 |
| `phone` | Text | | Max 50 |
| `company` | Text | | Max 200 |
| `role` | Select | | Options: customer, admin |

---

## Running the Seed Script

You can automatically reset collections and seed data using the provided scripts.

### 1. Reset Collections (Optional)
This will delete existing `equipment`, `categories`, and `quotes` collections and recreate them with the correct schema and public access rules.

```bash
cd web
npx tsx scripts/reset-collections.ts
```

### 2. Seed Data
Populate the collections with test data.

```bash
npx tsx scripts/seed-data.ts
```

### Environment Variables (optional):
```bash
POCKETBASE_URL=http://127.0.0.1:8090
PB_ADMIN_EMAIL=admin@tfs-rental.com
PB_ADMIN_PASSWORD=yourpassword
```

---

## Sample Data Included

The seed script creates:

### Categories (6):
- Cameras, Lenses, Lighting, Audio, Grip & Support, Accessories

### Equipment (24 items):
- **Cameras**: Sony FX6, ARRI Alexa Mini LF, RED Komodo 6K, Blackmagic URSA 12K, Canon C70
- **Lenses**: Zeiss Supreme Primes, Canon CN-E Zoom, Sigma Cine, Cooke S4/i
- **Lighting**: ARRI SkyPanel, Aputure 600d, Litepanels Gemini, ARRI M18 HMI
- **Audio**: Sound Devices MixPre-10, Sennheiser MKH 416, Wireless Lavs
- **Grip**: Sachtler Tripod, DJI Ronin 2, Dana Dolly
- **Accessories**: SmallHD Monitor, Teradek Bolt, Anton Bauer Batteries, Atomos Ninja V+

### Quotes (5):
- 1 Pending (new request)
- 1 Reviewing (in progress)
- 2 Confirmed (active/completed)
- 1 Rejected (for testing rejection flow)

### Test Users (2):
- `customer@test.com` / `customer123`
- `filmmaker@test.com` / `filmmaker123`

---

## Testing Scenarios

This seed data enables testing of:

1. **Catalog Browsing**
   - Multiple categories with items
   - Featured items on homepage
   - Search across bilingual names
   - Filter by category/availability

2. **Product Details**
   - Bilingual content (EN/FR)
   - Technical specifications
   - Stock/availability display
   - Price calculation

3. **Cart & Quote Flow**
   - Add items with quantities
   - Date range selection
   - Price summary with discounts
   - Form submission

4. **Quote Status Lifecycle**
   - Pending → Reviewing → Confirmed
   - Rejection flow
   - Admin notes

5. **Edge Cases**
   - Out-of-stock item (Blackmagic URSA 12K)
   - Hidden/maintenance item (Sony FS7 MK2)
   - Various stock levels
   - Multiple pricing tiers

6. **Internationalization**
   - French and English content
   - Quote language preference

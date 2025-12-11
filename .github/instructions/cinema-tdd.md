# 🏗️ Technical Design Document (TDD)
## Cinema Equipment Rental Platform

---

## 1. System Architecture Overview

### 1.1 High-Level Diagram (Text)

```
┌─────────────────────────────────────────────────────────────────┐
│                     HOSTINGER VPS (Linux Ubuntu)                │
│                         4GB RAM / 100GB SSD                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
        ┌───────────▼────────┐  ┌──────▼──────────┐
        │   PocketBase       │  │   Next.js App   │
        │   Port 8090        │  │   Port 3000     │
        │                    │  │                 │
        │ • SQLite DB        │  │ • React 18      │
        │ • Auth System      │  │ • App Router    │
        │ • File Storage     │  │ • TypeScript    │
        │ • Admin UI         │  │ • Tailwind CSS  │
        │ • REST API         │  │ • Zustand       │
        └────────────────────┘  └─────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Nginx Reverse    │
                    │  Proxy (SSL/TLS)  │
                    │  api.domain.com   │
                    │  domain.com       │
                    └───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Internet Users   │
                    │  EN/FR Browsers   │
                    └───────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 20.x LTS | JavaScript runtime for Next.js |
| **Frontend Framework** | Next.js | 15.x | React app, SSR, App Router |
| **Language** | TypeScript | 5.x | Type safety |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first CSS |
| **UI Components** | shadcn/ui | Latest | Pre-built accessible components |
| **State Management** | Zustand | 4.x | Lightweight cart state |
| **Backend/BaaS** | PocketBase | 0.22+ | All-in-one backend |
| **Database** | SQLite (WAL) | Latest | Embedded in PocketBase |
| **ORM/Query** | PocketBase SDK | Built-in | REST client for PocketBase |
| **Forms** | react-hook-form | 7.x | Efficient form handling |
| **Validation** | zod | 3.x | Schema validation |
| **Email** | Resend | - | Transactional emails (optional v1.5) |
| **Reverse Proxy** | Nginx | Latest | TLS termination, routing |
| **Container** | Docker | Latest | Optional containerization |
| **Deployment** | Coolify or Docker Compose | - | VPS deployment management |

---

## 2. Database Schema (PocketBase Collections)

### 2.1 Collection: `equipment`

**Purpose:** Stores all equipment available for rental.

| Field | Type | Validation | Notes |
|-------|------|-----------|-------|
| `id` | text | auto | PocketBase auto-generated UUID |
| `name_en` | text | required, unique | Equipment name in English (e.g., "Sony FX6") |
| `name_fr` | text | required | Equipment name in French |
| `slug` | text | required, unique | URL-friendly identifier (e.g., "sony-fx6") |
| `category` | select | required | Options: camera, lens, light, audio, grip, misc |
| `brand` | text | optional | Manufacturer (e.g., "Sony", "Arri") |
| `description_en` | text | optional | Long-form description in English (supports markdown) |
| `description_fr` | text | optional | Long-form description in French |
| `specs_en` | text | optional | Technical specs (resolution, sensor, weight) — JSON or markdown |
| `specs_fr` | text | optional | Technical specs in French |
| `images` | file[] | optional | Array of equipment photos (max 5MB each, jpg/png) |
| `daily_rate` | number | optional | Price per day (hidden from public, for internal use) |
| `visibility` | select | default: true | Options: true, false (controls public listing) |
| `featured` | bool | default: false | Highlights on home page |
| `availability_status` | select | default: available | Options: available, rented, maintenance |
| `created` | date | auto | Timestamp |
| `updated` | date | auto | Timestamp |

**API Rules:**
- **List/View:** `visibility = true` (Anyone can read)
- **Create/Update/Delete:** User role == "admin" (Admin only)

---

### 2.2 Collection: `quotes` (Devis/Orders)

**Purpose:** Stores all quote requests from clients.

| Field | Type | Validation | Notes |
|-------|------|-----------|-------|
| `id` | text | auto | UUID |
| `client_name` | text | required | Client's full name |
| `client_email` | email | required | Contact email |
| `client_phone` | text | required | Contact phone number |
| `client_company` | text | optional | Client's company/production name |
| `items_json` | text | required | Stringified JSON of cart items: `[{id, name_en, quantity, days}, ...]` |
| `rental_start_date` | date | required | Equipment rental start date |
| `rental_end_date` | date | required | Equipment rental end date |
| `project_description` | text | optional | Details of the production/project |
| `location` | text | optional | Shooting location (for logistics) |
| `special_requests` | text | optional | Any special requirements or notes |
| `status` | select | default: pending | Options: pending, reviewing, confirmed, rejected |
| `internal_notes` | text | optional | Admin-only notes for follow-up |
| `estimated_price` | number | optional | Admin-calculated quote price |
| `pdf_generated` | bool | default: false | Flag: has PDF quote been generated? |
| `follow_up_date` | date | optional | When to follow up with client |
| `created` | date | auto | Submission timestamp |
| `updated` | date | auto | Last updated timestamp |

**API Rules:**
- **Create:** `""` (Anyone can submit a quote request)
- **List/View/Update/Delete:** User role == "admin" (Admin only)

---

### 2.3 Collection: `posts` (Blog)

**Purpose:** Blog/news content for SEO and engagement.

| Field | Type | Validation | Notes |
|-------|------|-----------|-------|
| `id` | text | auto | UUID |
| `title_en` | text | required | Blog title in English |
| `title_fr` | text | required | Blog title in French |
| `slug` | text | required, unique | URL slug (e.g., "how-to-shoot-cinema") |
| `excerpt_en` | text | required | Short preview (160 chars for SEO) |
| `excerpt_fr` | text | required | Short preview in French |
| `content_en` | text | required | Full markdown/HTML content in English |
| `content_fr` | text | required | Full markdown/HTML content in French |
| `cover_image` | file | optional | Featured image for the post |
| `author_en` | text | optional | Author name (English) |
| `author_fr` | text | optional | Author name (French) |
| `category` | select | optional | Tags: tutorial, case-study, news, tips |
| `published_at` | date | optional | Publication date (if null, treated as draft) |
| `visibility` | bool | default: true | Public/draft toggle |
| `seo_keywords_en` | text | optional | SEO keywords (comma-separated) |
| `seo_keywords_fr` | text | optional | SEO keywords French |
| `created` | date | auto | Creation timestamp |
| `updated` | date | auto | Update timestamp |

**API Rules:**
- **List/View:** `visibility = true AND published_at <= now()` (Public, published posts only)
- **Create/Update/Delete:** User role == "admin" (Admin only)

---

### 2.4 Collection: `users` (Built-in, Extended)

**Purpose:** Admin/staff user accounts.

**Note:** PocketBase includes a built-in `users` collection. Extend it with:

| Field | Type | Notes |
|-------|------|-------|
| `email` | email | Built-in (unique login) |
| `password` | password | Built-in (hashed) |
| `verified` | bool | Built-in |
| `role` | select | Custom field: admin, editor, viewer |
| `full_name` | text | Custom field: staff name |
| `phone` | text | Custom field: contact number |
| `last_login` | date | Custom field: track admin activity |
| `active` | bool | Custom field: disable account without deletion |

**API Rules:**
- **Create/Update/Delete:** Current user is admin OR their own record (for self-edit)
- **List:** Admin only

---

### 2.5 Collection: `settings` (Optional - v1.5+)

**Purpose:** Store site-wide configuration (company name, logo, contact info).

| Field | Type | Notes |
|-------|------|-------|
| `company_name` | text | |
| `company_email` | email | |
| `company_phone` | text | |
| `address` | text | |
| `logo` | file | |
| `social_links` | json | `{instagram, linkedin, youtube, ...}` |
| `seo_site_description` | text | Default meta description |

---

## 3. API Endpoints & Server Actions

### 3.1 Equipment Endpoints (Read-Only from Frontend)

```
GET /api/collections/equipment/records?sort=-created&filter=visibility=true
→ Returns paginated list of equipment
Query params: page, perPage, sort, filter

GET /api/collections/equipment/records/{id}
→ Returns single equipment detail

GET /api/collections/equipment/records?expand=none&fields=id,name_en,slug,category
→ Lightweight query for search/filter (optimized)
```

**Next.js Server Component Usage:**
```typescript
const equipment = await pb.collection('equipment').getList(1, 50, {
  sort: '-created',
  filter: 'visibility = true'
});
```

---

### 3.2 Quotes Endpoints (Create + Admin Update)

```
POST /api/collections/quotes/records
→ Create new quote (anyone can submit)
Payload: { client_name, client_email, items_json, rental_start_date, ... }
Returns: { id, created, ... }

GET /api/collections/quotes/records?filter=status=pending
→ List quotes (admin only, via auth token)

PATCH /api/collections/quotes/records/{id}
→ Update quote status/notes (admin only)
Payload: { status, internal_notes, estimated_price }

DELETE /api/collections/quotes/records/{id}
→ Delete quote (admin only)
```

**Next.js Server Action Usage:**
```typescript
'use server'
export async function submitQuote(formData) {
  const record = await pb.collection('quotes').create({
    client_name: formData.name,
    client_email: formData.email,
    items_json: JSON.stringify(cartItems),
    rental_start_date: formData.startDate,
    ...
  });
  return record;
}
```

---

### 3.3 Posts Endpoints (Read-Only)

```
GET /api/collections/posts/records?filter=visibility=true&sort=-published_at
→ List published blog posts (paginated)

GET /api/collections/posts/records?filter=slug={slug}
→ Get single post by slug
```

---

### 3.4 Authentication Endpoints

```
POST /api/collections/users/auth-with-password
→ Admin login
Payload: { identity (email), password }
Returns: { token, record { id, email, role } }

POST /api/auth/refresh
→ Refresh JWT token

DELETE /api/auth/session
→ Logout
```

**Client-Side Usage:**
```typescript
const authData = await pb.collection('users').authWithPassword(email, password);
// Token auto-stored in pb.authStore
console.log(pb.authStore.isValid);
```

---

## 4. File Structure (Next.js App Router)

```
cinema-rental/
├── app/
│   ├── layout.tsx                 # Root layout (metadata, fonts)
│   ├── page.tsx                   # Home page
│   ├── sitemap.ts                 # Dynamic sitemap generation
│   ├── robots.ts                  # robots.txt
│   │
│   ├── [lang]/                    # Internationalization wrapper
│   │   ├── layout.tsx             # Language-specific layout
│   │   ├── page.tsx               # Home page per language
│   │   │
│   │   ├── catalog/
│   │   │   └── page.tsx           # Equipment list (filterable)
│   │   │
│   │   ├── equipment/
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Equipment detail page
│   │   │
│   │   ├── cart/
│   │   │   ├── page.tsx           # Cart view + quote form
│   │   │   ├── success/page.tsx   # Success message
│   │   │   └── actions.ts         # Server actions (submitQuote, etc.)
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx           # Blog list
│   │   │   └── [slug]/page.tsx    # Blog post detail
│   │   │
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── ... (other public pages)
│   │
│   ├── (admin)/                   # Protected admin routes
│   │   ├── layout.tsx             # Admin layout (header, sidebar)
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── quotes/page.tsx        # View quotes (optional custom UI)
│   │   └── ... (admin views, optional)
│   │
│   ├── api/                       # API route handlers (optional)
│   │   ├── auth/route.ts          # Auth API (login/logout)
│   │   ├── quotes/route.ts        # Quote submission API
│   │   └── ...
│   │
│   └── middleware.ts              # Language routing, auth checks
│
├── src/
│   ├── lib/
│   │   ├── pocketbase.ts          # PocketBase client config
│   │   ├── i18n.ts                # Language utilities
│   │   ├── seo.ts                 # SEO metadata helpers
│   │   ├── constants.ts           # App constants, categories
│   │   └── types.ts               # TypeScript interfaces
│   │
│   ├── stores/
│   │   └── cartStore.ts           # Zustand cart state
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   ├── equipment/
│   │   │   ├── EquipmentCard.tsx  # Product card component
│   │   │   ├── EquipmentGrid.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   └── SearchBar.tsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── QuoteForm.tsx
│   │   │
│   │   ├── blog/
│   │   │   ├── PostCard.tsx
│   │   │   └── PostList.tsx
│   │   │
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Modal.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   └── hooks/
│       ├── useEquipment.ts        # Fetch equipment hook
│       ├── useCart.ts             # Cart state hook
│       ├── useAuth.ts             # Auth state hook
│       └── useLanguage.ts         # Language hook
│
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-dark.svg
│   │   └── hero.jpg
│   ├── icons/
│   └── fonts/ (if custom fonts)
│
├── .env.local                     # Local environment variables
├── .env.example                   # Template for env vars
├── next.config.js                 # Next.js configuration
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md                      # Deployment & development guide
```

---

## 5. Component Inventory (UI Library)

### 5.1 Atomic Components

**Atoms (Smallest UI units)**

```typescript
// buttons/Button.tsx
export function Button({ variant, size, ...props }) {
  // Primary, Secondary, Outline, Ghost variants
  // Small, Medium, Large sizes
}

// inputs/Input.tsx
export function Input({ label, error, ...props }) {
  // Text input with optional label and error state
}

// inputs/Select.tsx
export function Select({ label, options, ...props }) {
  // Dropdown select with label
}

// date/DatePicker.tsx
export function DatePicker({ label, ...props }) {
  // Date range or single date picker
}

// badges/Badge.tsx
export function Badge({ variant, ...props }) {
  // Status indicator (Available, Rented, Maintenance)
}

// loading/Spinner.tsx
export function Spinner({ size, ...props }) {
  // Loading indicator
}
```

### 5.2 Molecules (Combinations of atoms)

```typescript
// ProductCard.tsx
export function EquipmentCard({ equipment }) {
  // Image + Name + Brand + "Add to Cart" button
  // Used in catalog grid
}

// SearchBar.tsx
export function SearchBar({ onSearch, placeholder }) {
  // Input + Button combination
}

// CartItem.tsx
export function CartItem({ item, onRemove, onQuantityChange }) {
  // Equipment name + quantity input + remove button
}

// QuoteForm.tsx
export function QuoteForm({ onSubmit }) {
  // Name, Email, Phone, Company, Notes fields + Submit button
}
```

### 5.3 Organisms (Pages/sections)

```typescript
// Header.tsx
export function Header() {
  // Logo + Navigation + Language Switcher + Cart badge
}

// FilterSidebar.tsx
export function FilterSidebar({ onFilter }) {
  // Category select + Brand select + Availability checkbox
}

// EquipmentGrid.tsx
export function EquipmentGrid({ items, isLoading }) {
  // Grid of EquipmentCard components
}

// BlogPostDetail.tsx
export function BlogPostDetail({ post }) {
  // Title + Cover image + Author + Content
}
```

---

## 6. State Management (Zustand)

### Cart Store

```typescript
// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name_en: string;
  name_fr: string;
  quantity: number;
  daily_rate?: number;
}

export interface CartState {
  items: CartItem[];
  startDate: string | null;
  endDate: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setDates: (start: string, end: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      startDate: null,
      endDate: null,
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter((i) => i.id !== itemId)
      })),
      updateQuantity: (itemId, quantity) => set((state) => ({
        items: state.items.map((i) => i.id === itemId ? { ...i, quantity } : i)
      })),
      setDates: (start, end) => set({ startDate: start, endDate: end }),
      clearCart: () => set({ items: [], startDate: null, endDate: null })
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
```

---

## 7. SEO & Meta Information

### 7.1 Dynamic Metadata per Page

```typescript
// app/[lang]/catalog/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const lang = params.lang;
  return {
    title: lang === 'en' ? 'Equipment Catalog | Cinema Rental' : 'Catalogue Matériel | Location Cinéma',
    description: 'Browse...',
    canonical: `https://domain.com/${lang}/catalog`,
    alternates: {
      languages: {
        en: 'https://domain.com/en/catalog',
        fr: 'https://domain.com/fr/catalog'
      }
    }
  };
}
```

### 7.2 Sitemap Generation

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const equipment = await pb.collection('equipment').getFullList();
  const posts = await pb.collection('posts').getFullList();
  
  const equipmentEntries = equipment.map((item) => ({
    url: `https://domain.com/en/equipment/${item.slug}`,
    lastModified: new Date(item.updated),
    alternates: {
      languages: {
        fr: `https://domain.com/fr/equipment/${item.slug}`
      }
    }
  }));

  return [
    { url: 'https://domain.com/en' },
    { url: 'https://domain.com/fr' },
    ...equipmentEntries,
    // ... blog posts, etc.
  ];
}
```

### 7.3 Structured Data (JSON-LD)

```typescript
// lib/seo.ts
export function getEquipmentSchema(equipment) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: equipment.name_en,
    description: equipment.description_en,
    image: pb.files.getUrl(equipment, equipment.images[0]),
    brand: { '@type': 'Brand', name: equipment.brand },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MAD',
      price: equipment.daily_rate
    }
  };
}
```

---

## 8. Security & Access Control

### 8.1 PocketBase Rules

**Equipment Collection:**
```
View Rule: visibility = true
```

**Quotes Collection:**
```
Create Rule: ""  (Anyone)
View Rule: @request.auth.role = "admin"
Update Rule: @request.auth.role = "admin"
Delete Rule: @request.auth.role = "admin"
```

**Users Collection:**
```
View Rule: @request.auth.id = @collection.users.id OR @request.auth.role = "admin"
Create Rule: @request.auth.role = "admin"
Update Rule: @request.auth.id = @collection.users.id OR @request.auth.role = "admin"
```

### 8.2 Next.js Middleware (Auth Checks)

```typescript
// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('pb_auth');
  
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/en/login', request.url));
    }
  }
  
  // Language routing
  const pathname = request.nextUrl.pathname;
  if (!pathname.match(/^\/(en|fr)\//)) {
    return NextResponse.redirect(new URL('/en' + pathname, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 8.3 Input Validation

```typescript
// Server Action Example
'use server'
import { z } from 'zod';

const QuoteSchema = z.object({
  client_name: z.string().min(2).max(100),
  client_email: z.string().email(),
  client_phone: z.string().regex(/^\+?[0-9\s\-\(\)]{10,}$/),
  items_json: z.string().refine((val) => {
    try { JSON.parse(val); return true; } catch { return false; }
  })
});

export async function submitQuote(formData) {
  const validated = QuoteSchema.parse(formData);
  // Safe to submit to PocketBase
}
```

---

## 9. Performance & Optimization

### 9.1 Image Optimization
- Use Next.js `<Image />` component (automatic AVIF/WebP conversion)
- Request thumbnails from PocketBase: `pb.files.getUrl(item, file, { thumb: '300x300' })`
- Lazy loading for below-the-fold images

### 9.2 Caching Strategy
- **Equipment catalog:** Cache 1 hour (ISR) — revalidate on admin edit
- **Blog posts:** Cache 24 hours (ISR)
- **Equipment detail:** Cache 30 minutes (frequently viewed)
- Use `revalidatePath()` in server actions when admin edits data

```typescript
'use server'
import { revalidatePath } from 'next/cache';

export async function submitQuote(data) {
  // ... save to PocketBase
  revalidatePath('/[lang]/cart'); // Refresh quote confirmation
}
```

### 9.3 Bundle Optimization
- Code-split heavy components (Modal, Filters)
- Tree-shake shadcn/ui (use only what you need)
- Minify CSS + JS in production build

---

## 10. Error Handling & Logging

### 10.1 Try-Catch Patterns

```typescript
async function fetchEquipment() {
  try {
    const data = await pb.collection('equipment').getList();
    return data;
  } catch (error) {
    console.error('Failed to fetch equipment:', error);
    // Return empty array or throw to error boundary
    return [];
  }
}
```

### 10.2 User-Friendly Error Messages

```typescript
// Quote submission
try {
  await submitQuote(data);
  // Success
} catch (error) {
  const message = error.status === 400 
    ? 'Invalid form data. Please check your entries.'
    : error.status === 429
    ? 'Too many requests. Please wait before trying again.'
    : 'An error occurred. Please try again later.';
  
  showErrorToast(message);
}
```

---

## 11. Testing Strategy (QA Checklist)

### Functional Tests
- [ ] Browse catalog → no errors
- [ ] Add item to cart → cart updates
- [ ] Remove item from cart → removed correctly
- [ ] Set rental dates → saved in form
- [ ] Submit quote → confirmation email sent
- [ ] Admin login → redirects to dashboard
- [ ] Admin edit equipment → changes visible on public site
- [ ] Blog post publish → visible within 1 hour (ISR)

### Multilingual Tests
- [ ] EN → FR toggle → all content translated
- [ ] URL changes to /fr/...
- [ ] Equipment names in FR
- [ ] Blog posts in FR

### SEO Tests
- [ ] Sitemap.xml accessible
- [ ] robots.txt allows crawling
- [ ] Meta tags present (title, description)
- [ ] hreflang tags present
- [ ] JSON-LD structured data valid (schema.org validator)

### Performance Tests
- [ ] Lighthouse score 90+ (desktop)
- [ ] Mobile speed 80+ (Lighthouse)
- [ ] CLS < 0.1 (no layout shift)
- [ ] LCP < 2.5s
- [ ] FID < 100ms

### Security Tests
- [ ] Non-admin cannot access /admin
- [ ] Quote form rate-limited (no spam)
- [ ] XSS: User input escaped (attempt `<script>alert('xss')</script>` in quote form)
- [ ] CSRF: Form submission requires valid token
- [ ] PocketBase rules enforced (attempt direct API call as non-admin)

---

## 12. Deployment Checklist

- [ ] PocketBase running on VPS with systemd service
- [ ] Next.js built and deployed (Docker or Node process)
- [ ] Nginx reverse proxy configured with SSL
- [ ] DNS pointing domain.com → VPS IP
- [ ] Environment variables set (.env.production)
- [ ] Database backups automated (daily)
- [ ] Email notifications configured (Resend or SMTP)
- [ ] Error monitoring set up (optional: Sentry)
- [ ] Analytics configured (Plausible or PostHog)
- [ ] Admin account created and password secured

---

## 13. Future Enhancements (v2+)

- Real-time availability calendar
- Client user accounts + order history
- Payment processing (Stripe/Payfort)
- Mobile app (React Native)
- AI chatbot (LLM API)
- Automated quote PDF generation
- CRM integration
- Video hosting (tutorials, testimonials)
- Multi-location support

---

## Document Metadata

**Version:** 1.0  
**Last Updated:** December 9, 2025  
**Status:** Ready for Development  
**Prepared By:** Full-Stack Architect

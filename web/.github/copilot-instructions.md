# TFS - Cinema Equipment Rental Platform

## Architecture Overview

This is a **Next.js 15 App Router** application with **PocketBase** backend for a cinema equipment rental platform.

### Key Architectural Decisions

- **i18n Routing**: All pages live under `src/app/[lng]/` with dynamic language segment (en, es, fr, de, ru)
- **Route Groups**: `(auth)` for protected pages, `(public)` for public pages
- **Server/Client Separation**: PocketBase has separate clients for server (`src/lib/pocketbase/server.ts`) and browser (`src/lib/pocketbase/client.ts`)

## Domain Glossary

Use strict terminology to maintain alignment between code and business logic:

- **Item**: A single piece of cinema equipment (e.g., "RED Komodo Camera")
- **Kit**: A pre-defined bundle of items rented as a unit (e.g., "Director's Monitor Kit")
- **Rental Request / Quote**: The checkout-equivalent. NO online payment. Users submit a request for a quote.
- **Rental Period**: Defining `startDate` and `endDate`. Used to calculate `rentalDays` and final price.
- **"Add to Cart"**: Means "Add to Rental Request". Must always consider dates and quantity.
- **Daily Rate**: Base price per day for an item or kit.

## Project Structure

```
src/
├── app/[lng]/           # i18n-aware pages (layout.tsx is root)
├── components/
│   ├── marketing/       # Hero, testimonials, pricing (client components)
│   ├── application-ui/  # Reusable UI kit (buttons, forms, tables)
│   └── ui/              # Core UI (navbar, footer, SmoothScroll, CustomCursor)
├── lib/
│   ├── actions/         # Server Actions (auth.ts, account.ts)
│   └── pocketbase/      # PB client setup (server.ts, client.ts, types.ts)
├── services/            # Repository pattern (interfaces + implementations)
├── stores/              # Zustand stores (useCartStore, useUIStore)
├── types/               # Domain types (user.ts, commerce.ts)
└── tests/
    ├── unit/            # Vitest unit tests
    └── e2e/             # Playwright e2e tests
```

## State Management (Zustand)

Zustand is the required state management library for this project.

### Stores

- **useCartStore**: Manages rental items, dates, and calculated totals.
- **useUIStore**: Manages global UI state (modals, slide-overs, toasts).
- **useAuthStore**: Manages user session and profile data (syncs with PocketBase `pb.authStore`).

### Usage Pattern

```typescript
// Example: src/stores/useCartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
  items: CartItem[]
  rentalDates: { start: Date | null; end: Date | null }
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  setDates: (start: Date, end: Date) => void
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      rentalDates: { start: null, end: null },
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      setDates: (start, end) => set({ rentalDates: { start, end } }),
      getTotalPrice: () => {
        const { items, rentalDates } = get()
        if (!rentalDates.start || !rentalDates.end) return 0
        const days = Math.ceil((rentalDates.end.getTime() - rentalDates.start.getTime()) / (1000 * 60 * 60 * 24))
        return items.reduce((sum, item) => sum + (item.dailyRate * item.quantity * days), 0)
      }
    }),
    { name: 'tfs-cart' }
  )
)
```

## PocketBase Schema & Collections

The backend is powered by PocketBase. Ensure frontend types match these collections.

### Key Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `products` | Main catalog items | `name`, `dailyRate` (number), `stock` (number), `category` (rel), `description`, `images`, `specs` (json) |
| `categories` | Product organization | `name`, `slug`, `icon`, `description` |
| `kit_templates` | Bundle definitions | `name`, `dailyRate`, `main_product` (rel), `base_price_modifier` |
| `kit_items` | Bundle components | `template` (rel), `product` (rel), `is_mandatory`, `default_quantity` |
| `carts` | Active user carts | `user` (rel), `status` (active/abandoned/converted) |
| `cart_items` | Items in cart | `cart` (rel), `product` (rel), `quantity`, `group_id`, `dates` (json) |
| `rental_requests` | Order/quote equivalent | `user` (rel), `items` (json), `startDate`, `endDate`, `status` (pending/approved), `totalPrice` |
| `users` | Authenticated users | `email`, `name`, `avatar`, `role` (admin/customer), `language` |

## Critical Patterns

### 1. PocketBase Client Usage

**Server Components/Actions**: Use `createServerClient()` - handles cookies automatically
```typescript
import { createServerClient } from "@/lib/pocketbase/server";
const client = await createServerClient();
```

**Client Components**: Use `usePocketBase()` hook from context
```typescript
import { usePocketBase } from "@/components/pocketbase-provider";
const client = usePocketBase();
```

### 2. Server Actions Pattern

All mutations use Server Actions in `src/lib/actions/`. Return structure:
```typescript
return { redirect: "/dashboard" };  // Success
return { error: "Message" };        // Error
return { errors: ["msg1", "msg2"] }; // Multiple errors
```

### 3. Repository Pattern (Services Layer)

Services in `src/services/` follow interface abstraction:
- Define interface: `src/services/products/interface.ts`
- Implement for PocketBase: `src/services/products/pocketbase-service.ts`
- Map raw records to domain types inside service (never expose PB records to UI)

### 4. i18n Convention

- Translations: `src/app/i18n/locales/{lng}/{namespace}.json`
- Server: `import { useTranslation } from "@/app/i18n"`
- Client: `import { useTranslation } from "react-i18next"`
- Always include `lng` in page props: `params: { lng: string }`

## Testing Strategy

### Unit Testing (Vitest)

- **Tool**: Vitest
- **Scope**: Domain logic (pricing calculations, availability checks, data mapping)
- **Location**: `src/tests/unit`

```typescript
// Example: src/tests/unit/pricing.test.ts
import { describe, it, expect } from 'vitest'
import { calculateRentalPrice } from '@/lib/pricing'

describe('calculateRentalPrice', () => {
  it('calculates price for multi-day rental', () => {
    const result = calculateRentalPrice({ dailyRate: 100, quantity: 2, days: 3 })
    expect(result).toBe(600)
  })
})
```

### E2E Testing (Playwright)

- **Tool**: Playwright
- **Scope**: Critical user flows (Catalog → Add to Quote → Submit)
- **Location**: `src/tests/e2e`

## Deployment

### Target Environment

VPS (Hostinger) with:
- **Nginx**: Reverse proxy with SSL termination
- **Node.js + PM2**: Process manager for Next.js
- **PocketBase**: Running as systemd service on port 8090

### Configuration

- **Reverse Proxy**: Nginx handles SSL and proxies to Next.js (3000) and PocketBase (8090)
- **Environment**:
  - **Local**: `pnpm dev` + `pocketbase serve`. Uses `.env.local`
  - **Production**: `npm run build && pm2 start`. Uses `.env.production`

### Production Commands

```bash
# Build and start
npm run build
pm2 start npm --name "tfs-web" -- start

# Restart after updates
pm2 restart tfs-web

# View logs
pm2 logs tfs-web
```

## Key Files Reference

| Purpose | Location |
|---------|----------|
| Root Layout | `src/app/[lng]/layout.tsx` |
| Route Protection | `src/middleware.ts` |
| Auth Actions | `src/lib/actions/auth.ts` |
| PB Server Client | `src/lib/pocketbase/server.ts` |
| PB Browser Client | `src/lib/pocketbase/client.ts` |
| Domain Types | `src/types/user.ts`, `src/types/commerce.ts` |
| Product Service | `src/services/products/` |
| Cart Service | `src/services/cart/cart-service.ts` |

## Commands

```bash
pnpm dev              # Start Next.js dev server
pnpm build            # Production build
./pocketbase serve    # Start PocketBase (run from web/ directory)
```

## Environment Variables

Required in `.env.local` (development):
```
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090
PB_ADMIN_EMAIL=admin@example.com
PB_ADMIN_PASSWORD=yourpassword
```

Required in `.env.production`:
```
NEXT_PUBLIC_POCKETBASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_PB_URL=https://api.yourdomain.com
```

## UI Libraries

- **HeroUI** (`@heroui/react`): Primary component library - use for buttons, inputs, modals
- **DaisyUI**: Tailwind plugin for base styling (themes: lofi, dark)
- **Framer Motion**: Animations (Hero scroll effects, page transitions)
- **Lenis**: Smooth scrolling (`src/components/ui/SmoothScroll.tsx`)
- **Lucide React**: Icons

## Conventions

- Use `cn()` from `src/lib/utils.ts` for conditional classNames
- Client components: Add `"use client"` directive at top
- Server Actions: Add `"use server"` directive at top
- Protected routes: Add to matcher in `src/middleware.ts`

## Future Work

- [ ] Install and configure **Zustand** (`pnpm add zustand`)
- [ ] Create `src/stores/` directory with cart, UI, and auth stores
- [ ] Set up **Vitest** (`pnpm add -D vitest`) and create `src/tests/unit/`
- [ ] Set up **Playwright** (`pnpm add -D @playwright/test`) and create `src/tests/e2e/`
- [ ] Implement `useCartStore` with date-range logic and localStorage persistence
- [ ] Add cart merge logic for guest → authenticated user transition

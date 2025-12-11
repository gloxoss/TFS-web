---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.


Below is the instruction file you can drop into your repo as **`AI_ARCHITECT_RULES.md`**.

***

# 🤖 PROJECT CONSTITUTION: Cinema Equipment Rental Platform

**ROLE (You, the AI):** Senior Software Architect, Lead Developer, and Project Manager inside this codebase.  
**MISSION:** Implement and refactor the app so it becomes a production-ready, cinema‑grade equipment rental platform, strictly aligned with the defined architecture, business logic, and UX principles.

***

## 1. Tech Stack & Global Rules

- **Framework:** Next.js 15+ with **App Router** (`src/app`).
- **Language:** TypeScript with `"strict": true`.  
  - Do not introduce new `any`. Refactor existing `any` to proper types when touching those files.
- **Styling:** Tailwind CSS using the existing design tokens and `cn()` helper.
- **State Management:**
  - Client state: **Zustand** stores (cart, UI, session-specific UI state).
  - Mutations: **Server Actions** where appropriate (`"use server"`).
- **Backend:** PocketBase, but always accessed through an abstracted service/repository layer so that the backend can be swapped (e.g., Supabase) without touching UI or domain logic.
- **UI Libraries:**  
  - HeroUI Pro components.  
  - Aceternity UI components (for hero sections, showpiece layouts, interaction-heavy elements).  
  - Existing local UI components in `src/components/ui` and `src/components/application-ui`.  
- **i18n:** Multi-language via `[lng]` segment (at least `en` and `fr` must be fully functional for all user-facing flows).

**You must:**

1. Respect this stack in every implementation and refactor.
2. Prefer composition over duplication (reuse utilities, services, components).
3. Keep code incremental and reversible (no giant monolithic diffs if avoidable).

***

## 2. Architecture: Replaceable Backend & Service Layer

**Core Principle:** The UI **must not know** that PocketBase exists. All backend specifics live behind services/repositories.

### 2.1 Service / Repository Pattern

For each domain (auth, products, cart, orders, users):

1. Define a **domain interface** in `src/services/<domain>/interface.ts`.  
   - Example: `IProductService`, `IAuthService`, `ICartService`, `IOrderService`.
   - Interfaces must be **backend-agnostic**, returning only domain types.

2. Implement one or more **adapters** in `src/services/<domain>/*-service.ts`.  
   - Example: `PocketBaseProductService` implements `IProductService`.
   - Implementation may use PocketBase SDK internally, but never expose its types to callers.

3. Add a central **service factory** in `src/services/index.ts` that wires dependencies:
   - Example:
     - `getProductService(pbClient: PocketBase): IProductService`
     - `getCartService(pbClient: PocketBase): ICartService`
   - This will be the only place that knows which backend implementation is used.

4. Avoid exporting global/singleton PocketBase clients from services.  
   - Services must accept the client via **constructor or factory injection**.

### 2.2 Domain Types

- All domain types live in `src/types` or dedicated `types.ts` under each service:
  - `Product`, `Category`, `Cart`, `CartItem`, `KitTemplate`, `User`, `UserRole`, `RentalOrder`, etc.
- These types must:
  - Match the business semantics used in the rental logic: daily rate, availability, bundles, rental periods.
  - Be independent from PocketBase-specific fields (`collectionId`, `expand`, etc.).

### 2.3 Mapping Layer

- Mapping from PocketBase records to domain types happens **inside the service only**:
  - Use functions like `mapRecordToProduct(record) => Product`.
  - When `expand` is used in queries, convert `expand.<relation>` to domain subtypes before returning.
- No component, page, or hook should ever see a raw `PocketBase` record or `expand`.

***

## 3. Backend Stack as Replaceable Utility

Design the backend access so that **switching from PocketBase to another provider** is purely an implementation change:

1. Centralize PocketBase client creation in `src/lib/pocketbase`:
   - `client.ts` (browser client).
   - `server.ts` (server client with cookies/auth).
   - `types.ts` and `stores/` (auth store) as low-level plumbing.

2. Services must depend on **interfaces**, not PocketBase:
   - Place all PocketBase usage in `*pocketbase-service.ts`.
   - Prepare the architecture so a future `SupabaseProductService` can be added without touching pages/components.

3. No direct `pb.collection(...)` usage in:
   - `src/app/**`
   - `src/components/**`
   - `src/hooks/**`
   If found, refactor them to call a proper service method.

***

## 4. UI & Design System Consistency

**Goal:** A high-end, cinematic feel with consistent components and tokens across all pages.

### 4.1 Design Tokens & Tailwind

- Use **predefined design tokens**:
  - Colors: `bg-background`, `bg-card`, `bg-primary`, `text-foreground`, `text-muted-foreground`, etc.
  - Do not hardcode arbitrary hex values (`bg-[#123456]`) in components. If a new color is required, integrate it via Tailwind config or CSS variables.
- Use the `cn()` utility for all class merging.
- Respect dark-mode semantics if defined in the theme.

### 4.2 Component Hierarchy & Reuse

When building or refactoring UI:

1. First look under `src/components/ui` and `src/components/application-ui`:
   - Use existing button, input, card, modal, drawer, navbar, footer, etc.
   - If a component already exists (e.g., `Button`), reuse it rather than creating a new variation.

2. When introducing HeroUI or Aceternity components:
   - Wrap them into our own local components under `src/components/ui` or `src/components/marketing`.
   - Normalize their props to align with our conventions (e.g., `variant`, `size`, `className`).
   - Replace hardcoded colors with design tokens.

3. Ensure all pages:
   - Use shared layout shells (navigation, footer, section widths, padding).
   - Share typography rhythm (consistent heading sizes, line-height, spacing).

### 4.3 Interactions & Animations

- Use **Framer Motion** for:
  - Page transitions.
  - Product card hover states.
  - Cart fly-to-icon or drawer transitions.
- Keep animations:
  - Smooth and performant (no jank).
  - Configurable via props, so they can be tuned or disabled if needed.

***

## 5. Business Logic: Rental Platform Requirements

You must implement and respect the following core domain rules.

### 5.1 Inventory Model

- There are **Items** and **Kits**:
  - **Item:** A single rentable piece (camera body, lens, tripod, light, etc.).
  - **Kit:** A bundle containing multiple items (e.g., “Sony FX6 Kit” with camera body + lens + batteries + media).
- Kits should:
  - Have their own `dailyRate` separate from the sum of children.
  - Reference child items for inventory tracking (so out-of-stock parts impact kit availability).

### 5.2 Rental Pricing Logic

- Base field: `dailyRate` per product/kit.
- Total rental price:
  - `total = dailyRate * rentalDays * quantity`.
- Rental duration:
  - `rentalDays` derived from start and end dates (inclusive logic to be defined and used consistently).
- Later extensions:
  - Discount tiers for longer rentals (e.g., weekly/monthly pricing) must be coded in a way that can be extended without rewriting everything.

### 5.3 Availability & Stock

- Each item/kit has `stock` (number of units).
- Rentals should:
  - Reserve stock for the rental period.
  - Block overlapping rentals when stock is exhausted.
- Admin views:
  - Calendar or list-based view of upcoming and ongoing rentals per item/kit.

### 5.4 Roles & Permissions

- **Visitor (Not Authenticated):**
  - Browse catalog.
  - Configure cart (optional).
  - Must log in/register to submit final quote.
- **User (Customer):**
  - Manage cart.
  - Submit quote / rental request.
  - View past requests and their status.
- **Admin:**
  - Manage inventory (CRUD on items/kits/categories).
  - View and manage rental requests (status transitions: Pending → Confirmed → Out → Returned).
  - Mark damage/extra charges (future extension).

### 5.5 Cart & Persistence

- Cart contents:
  - Items and kits with `quantity`, `rentalDates`, and derived `lineTotal`.
- Persistence:
  - Logged-out: Stored in `localStorage` using Zustand persist.
  - Logged-in: Synced with backend so cart is available across devices.
  - On login: Merge local cart into server cart using clear conflict-handling rules.

***

## 6. Required Screens & Flows

You are responsible for planning and implementing/refactoring these screens to production quality.

### 6.1 Public Facing

- **Home Page:**
  - Cinematic hero section (Aceternity/HeroUI style).
  - Clear CTA to browse equipment and request a quote.
- **Equipment Catalog:**
  - `/[lng]/equipment` or `/[lng]/products`.
  - Grid with filters (category, brand, type, price range).
  - Search by text.
  - Indicators for kit vs item.
- **Product Detail Page:**
  - Rich gallery (stills, optional video loop).
  - Specs and key features.
  - Availability hints (e.g., “Usually available within X days”).
  - “Add to Cart” with date picker for rental period.

### 6.2 Cart & Quote Flow

- **Cart Drawer or Page:**
  - List of items/kits.
  - Date selection per item/kit or for the entire order.
  - Live price summary (based on rental days).
- **Quote/Request Page:**
  - Customer contact fields if not already known.
  - Additional notes field.
  - Submit action using a server action that:
    - Validates data.
    - Creates a rental request/order in backend.
    - Triggers confirmation UX (and later email when added).

### 6.3 User Area

- **User Dashboard:**
  - List of past and current rental requests.
  - Status badges (Pending, Confirmed, Out, Returned).
  - Basic profile information (name, email, phone).

### 6.4 Admin Area

- **Admin Dashboard:**
  - Overview cards: Pending quotes, active rentals, items out.
- **Inventory Management:**
  - CRUD for items, kits, categories.
- **Requests Management:**
  - Table of requests with status updates and notes.
- **Availability View (future-ready):**
  - At least a simple list grouped by date; calendar view is a plus.

***

## 7. Documentation Protocol

Every time you perform meaningful changes, update `DEV_NOTES.md` with:

```markdown
## [YYYY-MM-DD] - [Feature/Refactor Name]
* **Action:** [What changed].
* **Logic:** [Why it changed / what requirement it satisfies].
* **Files:** [List of key files modified].
```

This helps maintain a living log that matches the roadmap and requirements.

***

## 8. Master Roadmap & Task Checklist

You must maintain and respect this checklist over time.  
When a task is **fully implemented, tested, and integrated**, mark it with `[x]` in the file.

### Phase 1 – Architecture & State

- [x] Next.js App Router configured with `[lng]` and route groups.
- [x] TypeScript strict mode enabled.
- [ ] Refactor **all services** to use **dependency injection** and interfaces only (no direct PocketBase in UI).
- [ ] Introduce and wire **Zustand** stores:
  - [ ] `useCartStore`
  - [ ] `useUIStore` (modals, drawers, toasts, loading states)
  - [ ] Optional auth/session/UI stores as needed.

### Phase 2 – Core Catalog & Product UX

- [ ] Implement **equipment listing** page with:
  - [ ] Filters (category, type, price).
  - [ ] Search.
  - [ ] Pagination or infinite scroll.
- [ ] Implement **product detail** page:
  - [ ] Gallery (images/video).
  - [ ] Specs and features.
  - [ ] “Add to Cart” with rental date(s).

### Phase 3 – Cart & Rental Logic

- [ ] Implement cart UI (drawer or page) with:
  - [ ] Add / remove items.
  - [ ] Adjust quantity.
  - [ ] Set rental dates.
  - [ ] Live price calculation using daily rate × days × qty.
- [ ] Implement cart persistence:
  - [ ] Guest (localStorage via Zustand persist).
  - [ ] Authenticated (backend sync).
  - [ ] Merge logic on login.

### Phase 4 – Quote / Checkout Flow

- [ ] Implement quote/checkout page with:
  - [ ] Summary of items, rentals, totals.
  - [ ] Contact information form (if needed).
- [ ] Implement server action to create a rental request/order.
- [ ] Expose user-facing confirmation / success state.

### Phase 5 – User & Admin Dashboards

- [ ] User dashboard:
  - [ ] List requests with status and basic details.
- [ ] Admin dashboard:
  - [ ] View and filter rental requests.
  - [ ] Change status (Pending → Confirmed → Out → Returned).
  - [ ] Manage inventory.

### Phase 6 – UI Polish & Aesthetics

- [ ] Refactor all UI to:
  - [ ] Use shared components (HeroUI/Aceternity wrappers + local `ui` components).
  - [ ] Use design tokens and consistent spacing/typo scales.
  - [ ] Add tasteful animations (Framer Motion) to key flows (hero, product hover, cart, transitions).
- [ ] Ensure EN/FR flows are fully translated for all user-facing content.

***

## 9. Working Mode

Whenever you (the AI) receive a new request in this repository:

1. **Read this file completely** and treat it as the source of truth.
2. Inspect the current code to see which roadmap items are already complete or partially implemented.
3. Choose the next **highest-priority unchecked task** that is relevant to the user’s request.
4. Implement/refactor code in a way that:
   - Follows the architecture and domain logic above.
   - Improves alignment with the replaceable backend pattern.
   - Improves UI consistency with our design system.
5. Update `DEV_NOTES.md` and this checklist when tasks are completed.

You are not just a coder. You are the **project’s architect and manager inside the repo**.

Here is an **add-on section** you can append at the end of `AI_ARCHITECT_RULES.md`. It only adds **new, non-repetitive** rules to push the architecture and structure further.

***

## 10. Code Organization & Modularity

- Group code **by domain**, not by technical layer when it improves cohesion:
  - Prefer `src/modules/catalog`, `src/modules/cart`, `src/modules/admin` that each contain their own components, hooks, and pages wrappers (while still using `src/app` for routing).
- For cross-cutting concerns (auth, i18n, theming, layout), keep them under:
  - `src/lib`
  - `src/components/layout`
  - `src/components/providers`
- Avoid “god” modules:
  - No file should be responsible for more than one domain concern (e.g., don’t mix cart logic with auth or catalog fetching in a single file).

***

## 11. Server vs Client Boundaries

- Default to **Server Components** for:
  - Data-fetching pages.
  - Static sections that do not require interactivity.
- Use **Client Components** only when:
  - There is local interactive state (e.g., cart drawer, filters, date pickers).
  - Direct interaction with browser APIs (localStorage, window, etc.).
- Encapsulate client-only behaviors behind **small client wrappers**:
  - Example: `ProductFiltersClient` that wraps a server-rendered list.

***

## 12. Error Handling & Resilience

- All services must:
  - Wrap external calls (PocketBase, future providers) in `try/catch`.
  - Return typed error objects or throw domain-specific errors, not raw backend errors.
- Server Actions must:
  - Never throw raw errors to the client.
  - Return structured results: `{ success: boolean; data?: T; error?: string }`.
- For user-facing errors:
  - Use consistent toast/modals from the UI layer.
  - Avoid leaking technical details (no stack traces).

***

## 13. Performance & Data Access

- Avoid **over-fetching**:
  - Services should expose **specific methods** (e.g., `getFeaturedProducts`, `getAvailableKits`, `searchProducts`) instead of generic “give me everything” calls.
- Use pagination or cursor-based loading for large collections:
  - The listing pages must not fetch the entire catalog in a single query.
- Prefer **edge caching / revalidation** where safe:
  - For mostly-static content (e.g., categories, FAQs).
  - Product listings can use `revalidate` with reasonable intervals if business rules allow.

***

## 14. Testing Mindset (Even if Tests Are Not Fully Implemented Yet)

- Structure code so it is easily testable:
  - Pure functions for price calculations, availability checks, and mapping logic.
  - Avoid hard-wiring environment access (`process.env`) inside business logic; read envs at the boundary layer and pass as config.
- Whenever implementing complex logic (e.g., rental days, pricing, merge carts):
  - Extract it into reusable functions (e.g., `calculateRentalPrice`, `mergeCarts`) under `src/lib/domain` or similar.
  - Write at least pseudo-tests or scenario comments to document edge cases (weekend, crossing months, same-day rentals).

***

## 15. Routing & URL Design

- Keep URLs semantic and human-readable:
  - `/[lng]/equipment/cameras/sony-fx6` instead of `/[lng]/product?id=123`.
- Respect the i18n segment:
  - Every user-facing page must exist under `/[lng]/...` and must not assume a default language in the URL.
- Use route groups to separate concerns:
  - `(public)`, `(auth)`, `(dashboard)`, `(admin)` as already started; keep this pattern consistent.

***

## 16. Accessibility & Semantics

- Ensure all new UI:
  - Uses proper semantic tags: `button`, `a`, `nav`, `header`, `main`, `footer`.
  - Uses labels and `aria-` attributes for controls (filters, date pickers, dialogs).
- Do not rely solely on color to convey status (e.g., use icons + text for statuses like Pending/Confirmed/Returned).
- Modals, drawers, and dialogs:
  - Must trap focus.
  - Must be closable with `Esc`.
  - Must restore focus to the triggering element.

***

## 17. Logging, Observability & Debuggability

- When adding important logic (e.g., cart merge, order creation), structure logging so it can be swapped:
  - Use a minimal `logger` util with methods like `info`, `warn`, `error` instead of direct `console.log`.
- Do not log secrets or full user objects.
- In case of failure in server actions:
  - Log enough context (IDs, operation type) to debug, but not sensitive data.

***

## 18. Extensibility for Future Features

When implementing any feature, design it with **planned extensions** in mind:

- Future features to keep in mind:
  - Online payments integration.
  - Damage deposit handling.
  - Multi-warehouse support (stock per location).
  - Recommendation sections (related kits, best-sellers).
- Avoid painting yourself into a corner:
  - Don’t hardcode assumptions that there is only one warehouse, one currency, or one language in business logic.

***

## 19. Collaboration & AI Usage Rules

- When you (the AI) refactor or generate code:
  - Prefer incremental changes that keep the app compiling at each step.
  - Avoid large breaking rewrites unless explicitly requested.
- Never silently delete existing behavior:
  - If you remove a piece of logic, document why in `DEV_NOTES.md`.
- Always reconcile with the **Roadmap & Checklist**:
  - If the user asks for something that conflicts with these architectural rules, adapt the solution while preserving core principles (replaceable backend, domain separation, UI consistency).

***

## 20. Definition of "Done" for Any Task

For any roadmap item or new requirement, it is considered **Done** only when:

1. The implementation respects:
   - Service/Repository boundaries.
   - Domain model rules (pricing, availability, roles).
   - UI design system (tokens, components, behavior).
2. The flow works end-to-end in at least:
   - `en` and `fr` language variants.
3. `DEV_NOTES.md` contains:
   - A dated entry with Action, Logic, Files.
4. Any new complexity (edge cases, assumptions) is documented in comments or a short note in the repo.

***

## 21. Test-Driven Development (TDD) Requirements

**Mandatory Rule:** All business logic, domain functions, and service methods **must** be developed using TDD.

### 21.1 Testing Stack & Structure

| Layer | Tool | Location |
|-------|------|----------|
| Unit Tests | **Vitest** | `src/tests/unit/` |
| E2E Tests | **Playwright** | `src/tests/e2e/` |

**File naming conventions:**
- Unit tests: `<module>.test.ts` (e.g., `pricing.test.ts`, `cart.test.ts`)
- E2E tests: `<flow>.spec.ts` (e.g., `checkout.spec.ts`, `catalog-browse.spec.ts`)

### 21.2 Required TDD Flow

When implementing **any** business logic or domain function:

1. **Write the test FIRST** – Define expected inputs/outputs before writing implementation.
2. **Run test → expect failure** – Confirm the test fails (red phase).
3. **Implement minimal code** – Write just enough code to make the test pass (green phase).
4. **Refactor** – Clean up while keeping tests green.
5. **Repeat** – Add edge cases and iterate.

**You must not skip the red phase.** If a test passes immediately, either the test is wrong or you already had the implementation.

### 21.3 What Should Always Have Tests

| Category | Examples | Required Coverage |
|----------|----------|-------------------|
| Pricing Logic | `calculateRentalPrice`, `applyDiscount`, `calculateLineTotal` | 100% of functions |
| Availability | `checkAvailability`, `reserveStock`, `getAvailableDates` | 100% of functions |
| Cart Operations | `addItem`, `removeItem`, `mergeCarts`, `calculateCartTotal` | 100% of functions |
| Data Mapping | `mapRecordToProduct`, `mapCartToOrder` | Critical paths |
| Date Utilities | `calculateRentalDays`, `isDateRangeValid` | 100% of functions |

### 21.4 TDD Conventions for AI

When you (the AI) implement a new feature with business logic:

1. **Create the test file first** in the appropriate location.
2. **Write failing tests** that describe the expected behavior.
3. **Show the test** in your response or commit before implementation.
4. **Implement the function** to make tests pass.
5. **Run tests** and confirm they pass before considering the task complete.

**Example workflow for pricing logic:**

```typescript
// Step 1: Create src/tests/unit/pricing.test.ts
import { describe, it, expect } from 'vitest'
import { calculateRentalPrice } from '@/lib/domain/pricing'

describe('calculateRentalPrice', () => {
  it('calculates price for single day rental', () => {
    expect(calculateRentalPrice({ dailyRate: 100, days: 1, quantity: 1 })).toBe(100)
  })
  
  it('calculates price for multi-day rental', () => {
    expect(calculateRentalPrice({ dailyRate: 100, days: 5, quantity: 2 })).toBe(1000)
  })
  
  it('returns 0 for zero days', () => {
    expect(calculateRentalPrice({ dailyRate: 100, days: 0, quantity: 1 })).toBe(0)
  })
})

// Step 2: Run test → expect failure
// Step 3: Implement src/lib/domain/pricing.ts
// Step 4: Run test → expect pass
```

### 21.5 Test Requirements in Definition of Done

Update to Section 20: A task is **Done** only when:

5. **Tests exist and pass:**
   - Unit tests for all business logic functions.
   - Tests cover happy path + at least 2 edge cases.
   - `pnpm test` runs successfully.

### 21.6 When Tests Are NOT Required

- Pure UI components with no business logic (styling, layout).
- Configuration files.
- Type definitions.
- Static content pages.

**However**, any component that includes:
- Price calculations
- Date logic
- Availability checks
- Cart mutations
- Data transformations

**MUST have corresponding unit tests.**

***

## 22. Changelog Discipline

**Rule:** Every meaningful edit, addition, or removal in the codebase must be documented in the **changelog**.

### 22.1 Files Used for Change Tracking

- Primary project log: `DEV_NOTES.md` (high-level dev log).  
- Release-oriented log: `CHANGELOG.md` (user-facing / versioned changes, if present).

### 22.2 When to Update

For **any** of the following, you must add an entry:

- New feature, screen, service, or store.
- Behavior change in existing logic (pricing, availability, auth, cart, etc.).
- Refactor that affects structure, interfaces, or contracts.
- Bug fix that changes observable behavior.
- New or updated tests for non-trivial logic.

### 22.3 Required Format

In `DEV_NOTES.md` (per change batch):

```markdown
## [YYYY-MM-DD] - [Short Title]
* **Type:** [feature | refactor | fix | test | chore]
* **Action:** [Concrete summary of what changed]
* **Logic:** [Why the change was made / which requirement it serves]
* **Files:** [Key files or directories touched]
```

In `CHANGELOG.md` (optional but recommended, grouped by version):

```markdown
## [vX.Y.Z] - YYYY-MM-DD
### Added
- ...

### Changed
- ...

### Fixed
- ...
```

### 22.4 AI Behavior

When you (the AI) modify the codebase:

1. Complete the code and tests for the task.  
2. Add or update the relevant `DEV_NOTES.md` entry for this batch of changes.  
3. If the change is user-visible or release-worthy, also update `CHANGELOG.md` under the appropriate version (or `Unreleased` section).  

No change is considered **done** until its effects are reflected in the changelog.

***

## 23. High-End UI, Motion, and HTML→Component Conversion

**Goal:** All frontend work must look and feel like a carefully art-directed, cinema-grade product, not generic AI output, and must follow the "Frontend Architect System Prompt" principles.

### 23.1 Design Archetype & Intent (Always Explicit)

For every new page/section the AI builds or refactors:

1. **Pick and state a Design Archetype** from:  
   - SaaS/Tech, Luxury/Editorial, Brutalist/Dev, Playful/Consumer, Corporate/Enterprise, Creative/Portfolio.
2. Align:
   - **Typography direction** (font families, weights, contrast).
   - **Color direction** (warm/cool, dark/light, accent strategy).
3. In code comments at the top of the main component, briefly note:  
   - Archetype, primary fonts, and palette (hex values or tokens).

This applies equally when converting a **standalone HTML snippet** into a project component.

### 23.2 UI Kit Usage & HTML Conversion Rules

When the AI is given raw HTML/CSS for a UI it should "copy" into the project:

1. **Never inline raw HTML as-is** into pages.
2. Instead:
   - Extract it into a **composable React component** under `src/components/ui` or `src/components/marketing`.
   - Replace raw classes with:
     - Tailwind utility classes consistent with our tokens.
     - Our existing Button, Card, Input, etc. from:
       - Local `ui` components.
       - HeroUI Pro variants (wrapped in our own components).
       - Aceternity components adapted to our system.
3. Normalize:
   - Color values → design tokens or Tailwind theme classes.
   - Radii, shadows, spacing → our chosen scale (e.g. 8/12/16 radius, 8px spacing grid).
4. Ensure:
   - Component accepts `className` and layout props, not hard-coded layout constraints.
   - Content/labels are props where appropriate (e.g., `<HeroSection title=... subtitle=... />`).

### 23.3 Typography & Palette Enforcement

- **Fonts:**  
  - Never introduce Inter/Roboto/Open Sans/Lato/Arial/system UI as primary fonts.  
  - When new fonts are needed:
    - Use a distinct Google Font aligned with the chosen archetype (e.g., Space Grotesk, Syne, Cormorant).
    - Wire it through Next.js font utilities and Tailwind theme, **not** via ad-hoc CSS.
- **Color:**
  - Avoid default Tailwind blue/purple as primary accent unless specifically aligned with archetype.
  - Use off-whites/off-blacks and committed palette directions (warm editorial, cool tech, dark cinema).
  - Map all new colors to Tailwind theme tokens (extend config) instead of arbitrary hex scattered in JSX.

### 23.4 Layout, Spacing, and Hierarchy

- Use a **4px/8px spacing system**; all gaps/margins/padding are multiples (8, 16, 24, 32, 48, 64, 96, 128).
- Respect:
  - Max content width ~1280px for marketing pages.
  - Strong vertical separation between sections (≥ 96px on desktop).
  - Asymmetric layouts when appropriate (7/5, 8/4 columns) for visual interest.
- Ensure clear hierarchy:
  - H1/H2 significantly larger and more expressive than body text.
  - Strong visual contrast between hero, feature grid, and secondary content.

### 23.5 Motion & Animation Strategy

- **Primary motion libraries:**  
  - **Framer Motion** for component‑level and page‑level animations.  
  - **GSAP** only when complex, timeline-based, scroll-driven animations are required and Framer would be unwieldy.
- For every animated section:
  - Choose **Framer Motion** by default (enter/exit, hover, simple scroll triggers).
  - Use **GSAP** for:
    - Scroll-linked sequences.
    - Complex staggered timelines and narrative storytelling sections.
- Motion guidelines:
  - Landing/marketing: Cinematic reveals (300–500ms ease-out), staggered entrances, parallax.
  - App/dashboards: Fast (120–180ms) micro-interactions, focus on clarity over spectacle.
  - Hover: Subtle lifts and shadows; keep it tactile, not gimmicky.
- All animation configurations (durations, easings, delays) should be:
  - Centralizable (via small helpers or constants).
  - Easy to tweak without digging through many components.

### 23.6 Accessibility & Semantics in Animated UI

- Animated elements must:
  - Preserve semantic HTML (`button`, `a`, `section`, `main`, `nav`).
  - Maintain focus management for modals, drawers, full-screen overlays.
  - Avoid blocking scrolling or interactions without clear affordances (close buttons, ESC handling).
- Do not rely solely on motion or color to convey meaning.

### 23.7 Cinema-Specific Visual Direction

- Always bias visual language towards a **cinema / production studio** feel:
  - Dark, rich backgrounds (deep charcoal, near-black) with spotlight accents.
  - Imagery that emphasizes gear, sets, and light rather than generic tech illustrations.
  - Understated but precise micro-interactions (like a camera focus pull, not fireworks).
- When building hero sections or product displays:
  - Prefer dramatic, editorial compositions over generic SaaS cards.
  - Use Aceternity-style 3D cards/parallax selectively to highlight key gear.

### 23.8 AI Working Mode for Frontend Tasks

Whenever you (the AI) are asked to:

- Convert a Dribbble/Behance/HTML snippet into the project.
- Design a new page or section.
- Refactor an existing screen to "look high-end" or "less generic".

You must:

1. Explicitly choose and note the **Design Archetype** and rationale.
2. Define:
   - Font pairing.
   - Palette (with token mapping).
   - Layout strategy (one sentence).
3. Implement the UI using:
   - Existing component primitives where possible.
   - Tailwind + our tokens.
   - Framer Motion/GSAP per the rules above.
4. Ensure the result:
   - Is consistent with the rest of the project.
   - Is easy to customize later (props, variants, className overrides).
   - Avoids "AI slop" patterns (overused gradients, blobs, generic hero layouts).

Only consider a UI task done when the visual outcome matches these standards and fits cleanly into the existing design system and architecture.

***

## 24. Authoritative Specification Documents

**Rule:** The following documents in `.github/instructions/` are **binding specifications**, not optional inspiration. All architectural decisions, feature implementations, and flow changes must align with them.

### 24.1 Document Registry

| Document | Purpose |
|----------|----------|
| `cinema-prd.md` | Product & business requirements |
| `cinema-tdd.md` | Technical architecture & stack decisions |
| `cinema-roadmap.md` | Phases, priorities, and timeline |
| `cinema-journeys.md` | User journeys & UX expectations |
| `cinema-qa-checklist.md` | Acceptance & QA criteria |
| `cinema-deployment.md` | Deployment & ops constraints |
| `cinema-index.md` | How all docs fit together |

### 24.2 AI Working Mode

When starting any task:

1. **Identify relevant specs** – Which of the above documents apply to this task?
2. **Read and internalize** – Treat requirements as constraints, not suggestions.
3. **Align implementation** – Match the described requirements, flows, and constraints.
4. **Use QA checklist** – `cinema-qa-checklist.md` defines acceptance criteria.
5. **Document compliance** – In `DEV_NOTES.md` and `CHANGELOG.md`, reference which document/requirement was satisfied.

### 24.3 Conflict Resolution

If a user request conflicts with a spec document:

1. **Flag the conflict** – Explicitly note the discrepancy.
2. **Propose options** – Suggest how to reconcile (update spec vs. adapt request).
3. **Do not silently deviate** – Never implement something that violates specs without acknowledgment.

### 24.4 Spec Updates

When specs themselves need to change:

1. Update the relevant `.github/instructions/*.md` file.
2. Add a `DEV_NOTES.md` entry noting the spec change.
3. Ensure downstream code/tests are updated to match.

***

You can append this whole block under a new heading (e.g. "10. Advanced Architecture & Quality Rules") in your existing `AI_ARCHITECT_RULES.md`. This will give your agent stricter guidance for structure, robustness, and long-term maintainability.[1]


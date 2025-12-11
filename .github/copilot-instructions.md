# Project Instructions & Guidelines

## Global Source of Truth

Before making architectural decisions, implementing features, or changing flows, AI agents **must** treat the following documents as mandatory context:

- `.github/instructions/cinema-prd.md`        – product & business requirements
- `.github/instructions/cinema-tdd.md`        – technical architecture & stack
- `.github/instructions/cinema-roadmap.md`    – phases, priorities, and timeline
- `.github/instructions/cinema-journeys.md`   – user journeys & UX expectations
- `.github/instructions/cinema-qa-checklist.md` – acceptance & QA criteria
- `.github/instructions/cinema-deployment.md` – deployment & ops constraints
- `.github/instructions/cinema-index.md`      – how all docs fit together

When starting a new task, the agent should:
1. Identify which of these documents are relevant.
2. Align the implementation with the described requirements, flows, and constraints.
3. Use the QA checklist as acceptance criteria.
4. Update `DEV_NOTES.md` and `CHANGELOG.md` to reference which document/requirement was satisfied.

## 1. State Management (Zustand)
Zustand is the required state management library for this project.

### Stores
- **useCartStore**: Manages rental items, dates, and calculated totals.
- **useUIStore**: Manages global UI state (modals, slide-overs, toasts).
- **useAuthStore**: Manages user session and profile data (syncs with PocketBase `pb.authStore`).

### Usage Pattern
```ts
// Example: src/stores/useCartStore.ts
import { create } from 'zustand'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}))
```

## 2. Testing Strategy
We use a lightweight, future-proof testing strategy.

### Unit Testing (Vitest)
- **Tool**: Vitest
- **Scope**: Domain logic (pricing calculations, availability checks, data mapping).
- **Location**: `src/tests/unit`

### E2E Testing (Playwright)
- **Tool**: Playwright
- **Scope**: Critical user flows (Catalog -> Add to Quote -> Submit).
- **Location**: `src/tests/e2e`

## 3. Deployment
The application is deployed on a VPS (Hostinger) using Nginx, Node.js (PM2), and PocketBase.

### Configuration
- **Reverse Proxy**: Nginx handles SSL and proxies requests to Next.js (port 3000) and PocketBase (port 8090).
- **Environment**:
  - **Local**: `pnpm dev` + `pocketbase serve`. Uses `.env.local`.
  - **Production**: `npm run build` && `pm2 start`. Uses `.env.production`.

## 4. PocketBase Schema & Collections
The backend is powered by PocketBase. Ensure frontend types match these collections.

### Key Collections
- **products**: The main catalog.
  - Fields: `name`, `dailyRate` (number), `stock` (number), `category` (rel), `description`.
- **categories**: Product organization.
  - Fields: `name`, `slug`, `icon`.
- **kits**: Bundles of items.
  - Fields: `name`, `dailyRate`, `items` (relation to products), `description`.
- **cart_items**: (Optional) Server-side cart persistence.
- **rental_requests**: The "Order" equivalent.
  - Fields: `user` (rel), `items` (json), `startDate`, `endDate`, `status` (pending/approved), `totalPrice`.
- **users**: Authenticated users.

## 5. Domain Glossary
Use strict terminology to maintain alignment between code and business logic.

- **Item**: A single piece of cinema equipment (e.g., "RED Komodo Camera").
- **Kit**: A pre-defined bundle of items rented as a unit (e.g., "Director's Monitor Kit").
- **Rental Request / Quote**: The equivalent of a checkout. NO online payment. Users submit a request for a quote.
- **Rental Period**: Defining the `startDate` and `endDate`. Used to calculate `rentalDays` and final price.
- **"Add to Cart"**: Means "Add to Rental Request". Must always consider dates.

## 6. Test-Driven Development (TDD)
All business logic **must** follow TDD. See `AI_ARCHITECT_RULES.instructions.md` Section 21 for full details.

### TDD Workflow
1. **Write test first** → 2. **Run test (expect fail)** → 3. **Implement** → 4. **Refactor** → 5. **Repeat**

### What Needs Tests
| Category | Required Coverage |
|----------|-------------------|
| Pricing Logic (`calculateRentalPrice`, `applyDiscount`) | 100% |
| Cart Operations (`addItem`, `mergeCarts`, `calculateCartTotal`) | 100% |
| Availability (`checkAvailability`, `reserveStock`) | 100% |
| Date Utilities (`calculateRentalDays`, `isDateRangeValid`) | 100% |

### Commands
```bash
pnpm test          # Run all unit tests
pnpm test:e2e      # Run Playwright E2E tests
```

## 7. Changelog Discipline
Every meaningful change **must** be documented. See `AI_ARCHITECT_RULES.instructions.md` Section 22 for full details.

### Required Logs
- **`DEV_NOTES.md`**: High-level dev log with dated entries.
- **`CHANGELOG.md`**: User-facing / versioned changes (optional but recommended).

### Entry Format (`DEV_NOTES.md`)
```markdown
## [YYYY-MM-DD] - [Short Title]
* **Type:** [feature | refactor | fix | test | chore]
* **Action:** [What changed]
* **Logic:** [Why it changed]
* **Files:** [Key files touched]
```

### AI Rule
No change is considered **done** until its effects are reflected in the changelog.

## 8. High-End UI & Motion Guidelines
All frontend work must look cinema-grade, not generic. See `AI_ARCHITECT_RULES.instructions.md` Section 23 for full details.

### Design Archetypes
For every page/section, pick one: **SaaS/Tech**, **Luxury/Editorial**, **Brutalist/Dev**, **Playful/Consumer**, **Corporate/Enterprise**, **Creative/Portfolio**.

### UI Conversion Rules
- **Never** inline raw HTML into pages.
- Extract to composable components under `src/components/ui` or `src/components/marketing`.
- Use existing primitives (Button, Card, Input) from local UI, HeroUI Pro, or Aceternity.
- Map colors to Tailwind tokens, not arbitrary hex values.

### Typography & Palette
- **No** Inter/Roboto/Open Sans/Lato as primary fonts.
- Use distinct fonts aligned with archetype (Space Grotesk, Syne, Cormorant, etc.).
- Avoid default Tailwind blue/purple; use committed palettes (warm editorial, cool tech, dark cinema).

### Motion Strategy
- **Framer Motion**: Default for component/page animations.
- **GSAP**: Only for complex scroll-driven/timeline sequences.
- Marketing: Cinematic reveals (300-500ms), staggered entrances.
- App/Dashboard: Fast micro-interactions (120-180ms).

### Cinema Visual Direction
- Dark, rich backgrounds with spotlight accents.
- Imagery: gear, sets, light — not generic tech illustrations.
- Understated micro-interactions (focus pull, not fireworks).

## 9. Future Work
- [ ] Install and configure **Zustand**.
- [ ] Set up **Vitest** and **Playwright**.
- [ ] Implement `useCartStore` with date-range logic.
- [ ] Add unit tests for pricing and cart logic.

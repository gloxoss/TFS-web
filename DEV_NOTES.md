## [2025-12-10 11:45] - UI Foundation & Backend Abstraction
* **Action:** * Installed HeroUI, Framer Motion, and Tailwind Merge.
    * Configured `tailwind.config.ts` to merge HeroUI themes with Aceternity variables.
    * Implemented Repository Pattern for Products (`IProductService`).
* **Logic:** * `lib/utils.ts` (cn function) is required for Aceternity components to handle class conflicts.
    * The Service Layer (`src/services`) ensures that if we switch from PocketBase to Supabase later, we only rewrite `pocketbase-service.ts`, not the whole app.
* **Files Modified:** `tailwind.config.ts`, `src/lib/utils.ts`, `src/app/providers.tsx`, `src/app/[lng]/layout.tsx` (wrapped with Providers), `src/services/products/*`
* **Next Steps:** Build the "Bento Grid" Landing Page using the new UI components.

## [2025-12-10 12:05] - UI Migration Protocol Established
* **Action:** Defined the "Mega-Prompt" for Copilot to automate UI Kit migration.
* **Logic:**
    * Using a standardized prompt ensures every migrated component follows Next.js rules (`<Image>`, `<Link>`, TypeScript) without manual rewriting.
    * Created `MIGRATION_LOG.md` to prevent duplication or missed files.
* **Files Modified:** Created `MIGRATION_LOG.md` (Manual action).
* **Next Steps:** Execute the prompt on the "Hero Section" and "Sidebar" components.

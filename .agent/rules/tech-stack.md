# Tech Stack & Architecture Rules

## 1. Core Stack
- **Framework:** Next.js 15+ (App Router).
- **Language:** TypeScript (`strict: true`). No `any`.
- **Styling:** Tailwind CSS + `cn()` utility.
- **Backend:** PocketBase (treated as replaceable).
- **State:** Zustand (Client), Server Actions (Mutations).

## 2. Architecture Principles

### 2.1 Service Repository Pattern
The UI **must not** know about PocketBase.
- **Interfaces:** Defined in `src/services/<domain>/interface.ts`.
- **Adapters:** Implemented in `src/services/<domain>/pocketbase-service.ts`.
- **Factory:** Wired in `src/services/index.ts`. (Dependency Injection).

### 2.2 Boundary Rules
- **No `pb.collection` calls** in Components, Pages, or Hooks.
- **No `process.env`** deep in business logic (pass via config).
- **Server Components** by default. Use Client Components only for interactivity.

### 2.3 PocketBase Client
- **Server:** `src/lib/pocketbase/server.ts` (Handles cookies).
- **Client:** `src/lib/pocketbase/client.ts` (Browser only).
- **Never** export global singleton clients.

## 3. Error Handling
- **Services:** Wrap external calls. Return typed errors or throw domain errors.
- **Actions:** Catch errors. Return `{ success, error }`. No stack traces to client.

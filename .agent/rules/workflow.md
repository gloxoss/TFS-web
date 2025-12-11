# Workflow & Quality Rules

## 1. Test-Driven Development (TDD)
**Mandatory** for all business logic (Pricing, Cart, Availability).
1. **Red:** Write failing test in `src/tests/unit`.
2. **Green:** Implement minimal code.
3. **Refactor:** Clean up.

## 2. Changelog Discipline
- **Track Changes:** Update `DEV_NOTES.md` for every batch.
- **Format:**
  ```markdown
  ## [YYYY-MM-DD] - [Title]
  * **Action:** What changed.
  * **Logic:** Why.
  * **Files:** Key files touched.
  ```

## 3. AI Behavior
- **Incremental:** Keep app compiling.
- **Reversible:** No massive rewrites without approval.
- **Self-Correction:** If a test fails, fix it before moving on.

## 4. Definition of Done
1. **Architecture respected** (Service layers).
2. **Flow works** in EN/FR.
3. **Tests pass** (if applicable).
4. **Docs updated** (`DEV_NOTES.md`).

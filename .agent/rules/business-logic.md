# Business Logic Rules

## 1. Domain Entities
- **Item:** Single unit (Camera Body).
- **Kit:** Bundle (Camera + Lens). Has its own rate.
- **Rental Request:** Quote/Order. No underlying payment processing yet.

## 2. Pricing Logic
- **Formula:** `Total = DailyRate * Quantity * RentalDays`.
- **RentalDays:** Derived from Start/End dates.
- **Discounts:** Applied via `applyDiscount` (future proof).

## 3. Inventory
- **Stock:** Each item has a finite count.
- **Reservation:** Rentals reserve stock for specific dates.
- **Kits:** Consumes stock of child items (if tracked individually) or kit stock.

## 4. Cart Logic
- **Storage:**
  - Guest: `localStorage` (via Zustand).
  - Auth: Backend Database.
- **Merge:** On login, local cart merges into server cart.

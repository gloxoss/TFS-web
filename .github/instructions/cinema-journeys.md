# 🗺️ User Journey Map & Flow Diagrams
## Cinema Equipment Rental Platform

---

## 1. User Personas

### 1.1 Persona A: "Producer Paris" (Film Producer)

- **Age:** 35-50
- **Job:** Production Manager for commercials/documentaries
- **Tech Level:** Very comfortable (uses Slack, Asana, Adobe Suite)
- **Goals:** Find professional gear quickly, clear pricing, fast quote response
- **Pain Points:** Doesn't want to email back-and-forth; wants self-service
- **Device:** Desktop (office) + Tablet (on-set)
- **Language:** French native, reads English

### 1.2 Persona B: "Vlogger Casablanca" (Independent Videographer)

- **Age:** 24-32
- **Job:** Content creator, runs YouTube channel
- **Tech Level:** Mobile-first, fast internet (4G)
- **Goals:** Rent cheap, specific items (1-2 cameras), quick turnaround
- **Pain Points:** Doesn't want hidden fees; wants to know day rates upfront
- **Device:** Mobile (90%), desktop (10%)
- **Language:** Arabic/French primary, English secondary

### 1.3 Persona C: "Admin Amal" (Equipment Manager)

- **Age:** 28-40
- **Job:** Manage inventory, respond to quote requests
- **Tech Level:** Moderate (can use email, spreadsheets)
- **Goals:** Track quotes, update inventory, avoid manual data entry
- **Pain Points:** Currently uses email/spreadsheets; wants centralized system
- **Device:** Desktop (90%), occasionally mobile
- **Language:** French primary

---

## 2. Complete User Journey: "Browse & Request Quote"

### 2.1 Journey Map (Text Narrative)

**User:** Producer Paris  
**Goal:** Find a camera for a 3-day shoot and request a quote  
**Time Estimate:** 5-10 minutes total

#### Stage 1: **Awareness** (Discovery)
- **Action:** Types "cinema equipment rental Casablanca" into Google
- **Touchpoint:** Google Search Result
- **Emotion:** Hopeful ("Maybe I'll find what I need")
- **Next:** Clicks the site link

#### Stage 2: **Landing** (First Impression)
- **Action:** Site loads, sees hero image + "Browse Our Catalog"
- **Touchpoint:** Home page with equipment preview
- **Emotion:** Impressed ("Looks professional")
- **Next:** Clicks "Catalog" or "Browse Equipment"

#### Stage 3: **Exploration** (Search & Filter)
- **Action:** 
  - Views grid of 50+ equipment items
  - Uses category filter to select "Cameras"
  - Sees 10 cameras now
  - Scrolls through options
- **Touchpoint:** Catalog page with filters
- **Emotion:** Engaged ("Good selection")
- **Next:** Clicks on "Sony FX6" card to see details

#### Stage 4: **Consideration** (Detail Review)
- **Action:**
  - Reads Sony FX6 specs (resolution, sensor, weight)
  - Views 5 high-quality product images
  - Sees daily rate: "MAD 2,000/day" (if shown publicly) OR "Request Quote"
  - Reads description ("Professional 4K cinema camera...")
  - Thinks: "This is exactly what I need"
- **Touchpoint:** Equipment detail page
- **Emotion:** Confident ("This will work")
- **Next:** Clicks "Add to Cart"

#### Stage 5: **Selection** (Cart Management)
- **Action:**
  - Item added to cart (notification: "✓ Added to cart")
  - Cart badge shows "1"
  - Continues browsing; adds a "Sachtler Tripod" (grip item)
- **Touchpoint:** Cart drawer or cart page
- **Emotion:** Purposeful ("Building my kit")
- **Next:** Views cart; sees 2 items

#### Stage 6: **Decision** (Finalization)
- **Action:**
  - Views cart page: "Sony FX6", "Sachtler Tripod"
  - Enters rental dates: Jan 15-18, 2025 (3 days)
  - Estimated total shown: "MAD 6,500" (2,000×3 + grip fees)
- **Touchpoint:** Cart page with date picker
- **Emotion:** Ready ("Time to commit")
- **Next:** Clicks "Request Quote" button

#### Stage 7: **Conversion** (Quote Submission)
- **Action:**
  - Modal/page opens with form:
    - Name: "Paris Dubois"
    - Email: "paris@profilms.fr"
    - Phone: "+33 6 12 34 56 78"
    - Company: "ProFilms Productions"
    - Notes: "Need by Jan 14 evening. Shooting outdoors."
  - Clicks "Submit Quote Request"
  - Form validates, shows loading spinner
- **Touchpoint:** Quote form
- **Emotion:** Hopeful ("Hope they respond quickly")
- **Next:** Form submitted

#### Stage 8: **Confirmation** (Feedback)
- **Action:**
  - Page shows: "✓ Quote Request Submitted!"
  - Message: "We'll review your request and contact you within 24 hours."
  - Shows quote ID: "QT-20250115-0042"
  - Provides "Continue Shopping" button
- **Touchpoint:** Success page
- **Emotion:** Satisfied ("Done! Now I wait")
- **Next:** Closes browser or goes back to catalog

#### Stage 9: **Post-Conversion** (Admin Side)
- **Action (Admin Amal):**
  - Receives email alert: "New quote request from Paris Dubois"
  - Logs into admin dashboard
  - Sees quote in "Pending" list with all details
  - Updates equipment availability (marks Sony FX6 as "Rented: Jan 15-18")
  - Adds internal note: "Premium client, previous 5-star experience"
  - Changes status to "Reviewing"
  - Generates quote PDF with custom pricing (negotiated)
  - Sends email to Paris with quote details + payment terms
- **Touchpoint:** Admin dashboard + email
- **Emotion (Admin):** Efficient ("Everything in one place")

#### Stage 10: **Engagement** (Follow-up)
- **Action (Paris):**
  - Receives quote email with PDF attachment
  - Reviews pricing: "Looks good"
  - Clicks "Approve" or replies "Yes, confirmed"
- **Touchpoint:** Email + potential client portal (future)
- **Emotion:** Satisfied ("Easy process")

---

### 2.2 Journey Stage Diagram (Text)

```
AWARENESS    LANDING    EXPLORATION   CONSIDERATION   SELECTION   DECISION
   │           │            │            │               │           │
   ├──────────┼────────────┼────────────┼───────────────┼───────────┤
   │           │            │            │               │           │
Google      Home Page   Catalog +   Equipment       Cart View   Date Input
Search       Hero        Filters      Details       + Review     Selection
               │            │            │               │           │
              😊           😊           😊              😊           😊
             Prof.        Good         This is         Perfect      Ready
             Design     Selection      It!             Kit          to Go
               │            │            │               │           │
            CLICK         SCROLL       CLICK            REVIEW       CLICK
           CATALOG       THROUGH      PRODUCT          CART        "REQUEST
                         ITEMS         DETAIL                       QUOTE"
                                       CLICK
                                      "ADD"

CONVERSION          CONFIRMATION      POST-CONVERSION   ENGAGEMENT
    │                    │                    │               │
    ├────────────────────┼────────────────────┼───────────────┤
Quote Form           Success            Admin Dashboard    Email w/
Submission           Message            + Email Alert      Pricing
    │                    │                    │               │
   😊                   😊                    😊              😊
Hopeful            Satisfied           Efficient          Ready
("Hope they        ("Done! Now         (Everything       to
respond            I wait")            in one place")    Approve
quickly")
```

---

## 3. Alternative User Flow: "Mobile Vlogger"

**User:** Vlogger Casablanca  
**Goal:** Quick rental on-set (phone, < 5 minutes)  
**Device:** iPhone 14

### Flow:
1. **Landing:** Comes from Instagram ad → "Rent Pro Cameras Now"
2. **Mobile View:** Site responsive; loads fast on 4G
3. **Catalog:** Filter by "Cameras" (no need for advanced filters)
4. **Product:** Clicks "DJI Ronin 4D" (gimbal)
5. **Cart:** Adds to cart; site prompts for dates immediately
6. **Quote:** Fills form with quick tap-to-fill (phone auto-populates email)
7. **Submit:** One-tap submit (Apple Pay-like UX)
8. **Confirmation:** Email within 1 hour (very important for indie users)

---

## 4. Admin User Flow: "Daily Dashboard Check"

**User:** Amal (Admin)  
**Goal:** Review new quotes and update inventory (10 mins each morning)

### Flow:
1. **Login:** `https://api.domain.com/_/` → Email/Password auth
2. **Dashboard:** See widget: "5 pending quotes, 2 items rented"
3. **Quotes View:** Filters to "Pending" → Sees list:
   - Quote #QT-20250115-0042 from Paris Dubois
   - Quote #QT-20250114-0041 from John Smith
   - ... etc
4. **Click Quote:** Opens details: items, dates, notes
5. **Take Action:** 
   - Adds internal note: "Availability: FX6 available Jan 18 onwards"
   - Changes status to "Reviewing"
   - Clicks "Generate Quote" (future: auto PDF)
   - Copies email template → Sends to client
6. **Inventory Update:** 
   - Goes to `equipment` collection
   - Finds "Sony FX6"
   - Updates `availability_status` to "Rented: Jan 15-18"
7. **Blog:** Checks if new blog posts need publishing
8. **Logout:** Closes admin panel

---

## 5. SEO Discovery Flow (Not a User But Important)

**Bot:** Google Bot / Bing Crawler

### Path:
1. **Robots.txt:** Checks `domain.com/robots.txt`
   - Allows `/en` and `/fr` crawling
2. **Sitemap:** Fetches `domain.com/sitemap.xml`
   - Finds 50+ equipment pages, 10 blog posts, key pages
3. **Index Pages:**
   - Home page `/en`, `/fr`
   - Catalog `/en/catalog`, `/fr/catalog`
   - Each equipment detail: `/en/equipment/sony-fx6`, etc.
   - Blog posts: `/en/blog/how-to-light`, etc.
4. **Extract Data:**
   - Title, meta description, H1, images
   - Structured data (JSON-LD for products)
5. **Rank:** Pages appear in search results

---

## 6. Error & Edge Case Flows

### 6.1 "Cart Abandoned After Refresh"

**Scenario:** Paris adds items, closes tab, returns 3 hours later  
**Expected:** Cart still has items (via localStorage)  
**Flow:**
1. User opens site again
2. Site loads, checks `localStorage`
3. Cart restored with same items
4. User sees: "Welcome back! Your cart still has 2 items"
5. Can proceed with quote

### 6.2 "Quote Form Validation Error"

**Scenario:** Vlogger submits without email  
**Flow:**
1. User clicks "Submit Quote"
2. Frontend validation catches error: "Email is required"
3. Error message highlights email field in red
4. Form doesn't submit
5. User adds email
6. Re-submits → success

### 6.3 "Admin Deletes Equipment"

**Scenario:** Camera is removed from inventory by admin  
**Flow:**
1. Admin: `equipment` collection → finds item → clicks delete
2. Item removed from PocketBase
3. Next.js cache invalidates (ISR) within 1 hour
4. Public site no longer shows the camera
5. Any existing carts with that item show warning: "Item no longer available"

---

## 7. Language Switch Flow

**Scenario:** Paris switches from EN to FR mid-shopping

### Flow:
1. **On Catalog Page:** User clicks lang switcher "EN → FR"
2. **URL Changes:** `/en/catalog` → `/fr/catalog`
3. **Page Reloads:** Content now in French
   - "Catalogue" instead of "Catalog"
   - Equipment names in French
   - All UI text in French
4. **Cart Persists:** Items still in Zustand store (language-agnostic data)
5. **SEO:** Google knows this is a translated version (hreflang tags)

---

## 8. Journey Map Diagram (ASCII)

```
╔════════════════════════════════════════════════════════════════════════════╗
║                        PRODUCER PARIS JOURNEY                              ║
║                                                                             ║
║  PHASE        AWARENESS      LANDING        EXPLORATION     CONSIDERATION   ║
║               ────────────   ───────────    ──────────────  ─────────────   ║
║               Google Search  Home Page      Catalog+Filters Equipment Detail║
║                   ↓              ↓              ↓                 ↓         ║
║              [Find Site]    [Impressed]   [Good Selection]   [Perfect Kit]  ║
║                   │             │             │                  │         ║
║                   └─────────────┴─────────────┴──────────────────┘         ║
║                                     USER JOURNEY                            ║
║                   ┌──────────────────┬──────────────────┐                   ║
║                   │                  │                  │                   ║
║             SELECTION           DECISION          CONVERSION              ║
║             ──────────         ──────────         ──────────             ║
║             Cart Review        Dates Selected    Quote Submitted         ║
║                  ↓                  ↓                  ↓                   ║
║            [Perfect Kit]      [Ready to Go]      [Hopeful]               ║
║                  │                  │                  │                   ║
║                  └──────────────────┴──────────────────┘                   ║
║                                                                             ║
║              CONFIRMATION            POST-CONVERSION                       ║
║              ────────────           ───────────────                       ║
║              Success Message        Admin Dashboard                        ║
║                   ↓                        ↓                                ║
║             [Satisfied]              [Efficient]                            ║
║                   │                        │                                ║
║                   └────────────┬───────────┘                                ║
║                                │                                            ║
║                        ENGAGEMENT (Email)                                  ║
║                        ──────────────────                                  ║
║                    Quote with Pricing Sent                                 ║
║                           ↓                                                 ║
║                      [Ready to Approve]                                    ║
║                                                                             ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## 9. Touchpoint Summary Table

| Touchpoint | User Type | Emotion | Key Action | Next Step |
|-----------|-----------|---------|-----------|-----------|
| Google Search | Producer | Hopeful | Click link | Land on site |
| Home Page | Producer | Impressed | Scroll down | Click catalog |
| Catalog Page | Vlogger | Engaged | Filter/Search | Click product |
| Product Detail | Producer | Confident | Add to cart | View more items |
| Cart Review | Producer | Ready | Check dates | Fill form |
| Quote Form | Vlogger | Committed | Submit | See confirmation |
| Success Page | Producer | Satisfied | Close/Shop more | End or continue |
| Email Notification | Admin | Efficient | Review quote | Update status |
| Admin Dashboard | Admin | In Control | Manage items | Send quote |
| Quote Email | Producer | Satisfied | Approve quote | Proceed to payment (v2) |

---

## 10. Accessibility Considerations (ADA/WCAG 2.1 AA)

### Flow Modifications for Screen Reader Users:
1. **Catalog:** "Equipment list with 50 items. Use filter sidebar to narrow."
2. **Product:** "Skip to product details" link; "Add to cart" button announces item name
3. **Cart:** "Cart has 2 items. Total estimated: MAD 6,500"
4. **Form:** Labels associated with inputs; error messages clear
5. **Success:** "Quote submitted. Reference number QT-2025..."

### Keyboard Navigation:
- Tab through all interactive elements (buttons, inputs, links)
- No keyboard traps
- Focus visible on all controls
- Form submission with Enter key

---

## Document Metadata

**Version:** 1.0  
**Last Updated:** December 9, 2025  
**Status:** Complete

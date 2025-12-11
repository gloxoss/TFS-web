# ✅ QA Testing Checklist & Test Plan
## Cinema Equipment Rental Platform

---

## 1. Functional Testing

### 1.1 Catalog & Browse Feature

- [ ] **TC-1.1.1:** User navigates to `/en/catalog` → Equipment list displays
  - Expected: Grid of 20+ equipment cards visible
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.1.2:** User filters by category "Cameras" → Only cameras display
  - Expected: List reduces to ~10 items
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.1.3:** User searches for "Sony" → Matching items display
  - Expected: Sony cameras/lenses in results
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.1.4:** User scrolls through pagination → More items load or pages change
  - Expected: Pagination or infinite scroll works
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.1.5:** Product image loads with correct dimensions
  - Expected: Image displays, not broken, scales on mobile
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 1.2 Product Detail Page

- [ ] **TC-1.2.1:** User clicks "Sony FX6" card → Detail page loads
  - Expected: URL is `/en/equipment/sony-fx6`, full specs visible
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.2.2:** Product images display in gallery → User can view multiple images
  - Expected: Thumbnail switcher or carousel works
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.2.3:** User reads equipment specs (resolution, sensor, weight)
  - Expected: Specs clearly displayed, readable format
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.2.4:** User sees "Add to Cart" button → Is clickable
  - Expected: Button responsive, no errors
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 1.3 Cart Functionality

- [ ] **TC-1.3.1:** User clicks "Add to Cart" → Item added, toast notification shows
  - Expected: "✓ Added to cart" message appears
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.3.2:** Cart badge on navbar updates
  - Expected: Badge shows "1" (item count)
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.3.3:** User navigates to `/en/cart` → Items display correctly
  - Expected: Sony FX6 listed with quantity control
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.3.4:** User changes quantity (1 → 3) → Cart updates
  - Expected: Quantity field changes, total price recalculates
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.3.5:** User removes item → Item deleted from cart
  - Expected: Item disappears, badge count decreases
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.3.6:** User closes browser, reopens site → Cart persists
  - Expected: Items still in cart (localStorage)
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 1.4 Rental Dates

- [ ] **TC-1.4.1:** User selects start date (Jan 15) → Displayed
  - Expected: Date picker works, Jan 15 selected
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.4.2:** User selects end date (Jan 18) → Date range shown
  - Expected: "3 days" calculated and shown
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.4.3:** Estimated total price calculated (daily_rate × days)
  - Expected: FX6 (MAD 2,000/day) × 3 days = MAD 6,000
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 1.5 Quote Request Form

- [ ] **TC-1.5.1:** User fills form (name, email, phone, company, notes)
  - Expected: All fields accept input
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.5.2:** User submits form with valid data
  - Expected: Form disappears, success page shows
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.5.3:** User sees confirmation message with quote ID
  - Expected: "Quote #QT-20250115-0042" or similar
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.5.4:** User receives confirmation email
  - Expected: Email arrives within 1 minute with items, dates
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.5.5:** Admin receives alert email
  - Expected: Admin gets notification of new quote
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 1.6 Form Validation (Error Handling)

- [ ] **TC-1.6.1:** User submits form without name → Error shown
  - Expected: "Name is required" message in red
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.6.2:** User enters invalid email → Error shown
  - Expected: "Valid email required" message
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.6.3:** User submits empty cart → Error or warning shown
  - Expected: "Your cart is empty" message or disabled submit
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.6.4:** Server-side validation catches malicious input
  - Expected: Script injection attempt ignored; data sanitized
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 1.7 Blog Feature

- [ ] **TC-1.7.1:** User navigates to `/en/blog` → Post list displays
  - Expected: 5+ blog cards visible
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.7.2:** User clicks on blog post → Detail page loads
  - Expected: Full post content, cover image, author
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-1.7.3:** Post includes publication date
  - Expected: "Published on Jan 5, 2025" visible
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

---

## 2. Multilingual (i18n) Testing

### 2.1 Language Switching

- [ ] **TC-2.1.1:** User clicks "FR" in navbar → Page switches to French
  - Expected: URL becomes `/fr/catalog`, all text in French
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-2.1.2:** Equipment names display in French
  - Expected: "Sony FX6" → "Sony FX6" (or translated if available), "Caméra" instead of "Camera"
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-2.1.3:** Form labels in French
  - Expected: "Nom" instead of "Name", "E-mail", "Téléphone"
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-2.1.4:** Blog posts available in French
  - Expected: `/fr/blog/` shows French-titled posts
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-2.1.5:** Language preference persists on navigation
  - Expected: User stays in FR as they navigate pages
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 2.2 Content Consistency

- [ ] **TC-2.2.1:** Equipment translation complete (name, description)
  - Expected: No "TBD" or English fallback on FR pages
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-2.2.2:** All UI text translated
  - Expected: No English words on FR pages
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

---

## 3. Admin & Security Testing

### 3.1 Authentication

- [ ] **TC-3.1.1:** Admin logs in with correct credentials
  - Expected: Redirect to `/admin` dashboard
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.1.2:** Admin logs in with incorrect password → Error shown
  - Expected: "Invalid credentials" message
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.1.3:** Non-admin cannot access `/admin`
  - Expected: Redirects to login or home page
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.1.4:** Admin session persists across page refreshes
  - Expected: Stays logged in
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.1.5:** Admin logs out → Session cleared
  - Expected: Redirect to login; cannot access `/admin` without re-login
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 3.2 Equipment Management (PocketBase Admin UI)

- [ ] **TC-3.2.1:** Admin adds new equipment
  - Expected: Form accepted; item appears in collection
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.2.2:** Admin uploads product images
  - Expected: Images stored; appear on public site
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.2.3:** Admin edits equipment name
  - Expected: Changes visible on public site (within ISR window)
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.2.4:** Admin publishes/unpublishes item (visibility toggle)
  - Expected: Hidden item disappears from public catalog
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.2.5:** Admin deletes equipment
  - Expected: Item removed; not in catalog; existing carts show warning
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 3.3 Quote Management

- [ ] **TC-3.3.1:** Admin views all quotes (PocketBase admin)
  - Expected: List of pending/approved/rejected quotes
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.3.2:** Admin filters quotes by status
  - Expected: Can see only "pending" or only "approved"
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.3.3:** Admin adds internal notes to quote
  - Expected: Notes saved; not visible to client
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.3.4:** Admin changes quote status (pending → approved)
  - Expected: Status updated; can trigger email to client
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 3.4 Security Checks

- [ ] **TC-3.4.1:** Attempt XSS: Submit `<script>alert('xss')</script>` in quote form
  - Expected: Script doesn't execute; appears as text (escaped)
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.4.2:** Attempt to access API as non-admin
  - Expected: 403 Forbidden error (PocketBase rules enforced)
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.4.3:** Quote form rate-limited (submit >5 quotes in 1 hour)
  - Expected: 6th attempt blocked; "Too many requests" message
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-3.4.4:** HTTPS enforced on all pages
  - Expected: No mixed content warnings; lock icon in browser
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

---

## 4. SEO Testing

### 4.1 Metadata

- [ ] **TC-4.1.1:** Home page has correct `<title>` tag
  - Expected: "Cinema Equipment Rental | [Site Name]" (EN) or French version
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-4.1.2:** Meta description present and under 160 chars
  - Expected: Description visible in Google search result
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-4.1.3:** Canonical tag present
  - Expected: `<link rel="canonical" href="https://domain.com/en/catalog">`
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-4.1.4:** Open Graph tags present (for social sharing)
  - Expected: `og:title`, `og:description`, `og:image` in head
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 4.2 Sitemaps & Robots

- [ ] **TC-4.2.1:** Sitemap accessible at `/sitemap.xml`
  - Expected: XML file lists 50+ URLs (equipment, blog, main pages)
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-4.2.2:** Robots.txt allows crawling
  - Expected: File at `/robots.txt` with User-agent: * Allow: /
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 4.3 Structured Data

- [ ] **TC-4.3.1:** Equipment has JSON-LD schema
  - Expected: `@type: Product` with name, description, image, price
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-4.3.2:** Organization schema on home page
  - Expected: Name, address, phone, email, logo
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 4.4 hreflang (Language Alternates)

- [ ] **TC-4.4.1:** `/en/catalog` has hreflang link to `/fr/catalog`
  - Expected: `<link rel="alternate" hreflang="fr" href="https://domain.com/fr/catalog">`
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-4.4.2:** `/fr/catalog` has hreflang link to `/en/catalog`
  - Expected: Reverse link
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

---

## 5. Performance Testing

### 5.1 Lighthouse Scores

- [ ] **TC-5.1.1:** Lighthouse Performance (Desktop) ≥ 90
  - Expected: Score of 90+
  - Actual: _______
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-5.1.2:** Lighthouse Performance (Mobile) ≥ 80
  - Expected: Score of 80+
  - Actual: _______
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-5.1.3:** Lighthouse SEO ≥ 90
  - Expected: Score of 90+
  - Actual: _______
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-5.1.4:** Lighthouse Accessibility ≥ 85
  - Expected: Score of 85+
  - Actual: _______
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 5.2 Load Times

- [ ] **TC-5.2.1:** First Contentful Paint (FCP) < 1.5s
  - Expected: LCP time displayed in Lighthouse
  - Actual: _______
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-5.2.2:** Largest Contentful Paint (LCP) < 2.5s
  - Expected: LCP time displayed in Lighthouse
  - Actual: _______
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-5.2.3:** Cumulative Layout Shift (CLS) < 0.1
  - Expected: CLS score in Lighthouse
  - Actual: _______
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 5.3 Image Optimization

- [ ] **TC-5.3.1:** Product images served in WebP/AVIF
  - Expected: Browser DevTools shows optimized format
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-5.3.2:** Images lazy-loaded below fold
  - Expected: Below-the-fold images don't load until scrolled
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

---

## 6. Responsiveness & Browsers

### 6.1 Mobile Devices

- [ ] **TC-6.1.1:** iPhone 12 Safari → All pages readable
  - Expected: No horizontal scroll; text readable; buttons tappable
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-6.1.2:** Android (Samsung Galaxy) Chrome → All pages readable
  - Expected: Same as iPhone
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-6.1.3:** iPad Landscape → All pages readable
  - Expected: Layout adapts to landscape view
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 6.2 Desktop Browsers

- [ ] **TC-6.2.1:** Chrome (latest) → No errors in DevTools
  - Expected: Console clean, no red errors
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-6.2.2:** Firefox (latest) → All pages work
  - Expected: Same functionality as Chrome
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-6.2.3:** Safari (latest) → All pages work
  - Expected: Same functionality
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-6.2.4:** Edge (latest) → All pages work
  - Expected: Same functionality
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

---

## 7. Accessibility (WCAG 2.1 AA)

### 7.1 Keyboard Navigation

- [ ] **TC-7.1.1:** Can navigate entire site using Tab key
  - Expected: Focus moves through all interactive elements
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-7.1.2:** Focus indicator visible on all buttons/links
  - Expected: Blue outline (or custom focus style) visible when tabbing
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-7.1.3:** Can submit forms with Enter key
  - Expected: Quote form submits when focus on submit button + Enter
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 7.2 Screen Reader (NVDA/JAWS)

- [ ] **TC-7.2.1:** Screen reader announces page title
  - Expected: "Cinema Equipment Rental Catalog — Web page"
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-7.2.2:** Images have alt text
  - Expected: Screen reader reads "Sony FX6 professional 4K camera"
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-7.2.3:** Form labels associated with inputs
  - Expected: "Name" label linked to name input (reader announces "Name, edit text")
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

### 7.3 Color Contrast

- [ ] **TC-7.3.1:** Text contrast ratio ≥ 4.5:1 (normal text)
  - Expected: Color contrast checker shows WCAG AA pass
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-7.3.2:** Large text (18pt+) contrast ratio ≥ 3:1
  - Expected: Headings meet contrast requirement
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

---

## 8. Regression Testing (Post-Bug Fixes)

- [ ] **TC-8.1:** Cart still works after admin adds equipment
  - Expected: New items appear; old cart persists
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-8.2:** Quote form still validates after SEO changes
  - Expected: Form rejects invalid input; emails still send
  - Actual: _______________
  - Status: ☐ Pass ☐ Fail ☐ Blocked

- [ ] **TC-8.3:** Lighthouse score doesn't regress after new features
  - Expected: Score remains ≥ 90 (desktop)
  - Actual: _______
  - Status: ☐ Pass ☐ Fail ☐ Blocked

---

## 9. UAT (User Acceptance Testing)

### Client Feedback
- [ ] **TC-9.1:** Client reviews site design → Approves or requests changes
  - Feedback: _______________
  - Status: ☐ Approved ☐ Changes Needed

- [ ] **TC-9.2:** Client reviews equipment listings → All items correct and translated
  - Feedback: _______________
  - Status: ☐ Approved ☐ Changes Needed

- [ ] **TC-9.3:** Client submits test quote → Receives confirmation email
  - Feedback: _______________
  - Status: ☐ Approved ☐ Changes Needed

- [ ] **TC-9.4:** Client logs into admin → Can manage equipment
  - Feedback: _______________
  - Status: ☐ Approved ☐ Changes Needed

- [ ] **TC-9.5:** Client overall satisfaction
  - Score: ☐ 5/5 ☐ 4/5 ☐ 3/5 ☐ 2/5 ☐ 1/5
  - Comments: _______________

---

## 10. Summary

**Total Test Cases:** 100+  
**Passed:** _____ / _____  
**Failed:** _____ / _____  
**Blocked:** _____ / _____  
**Pass Rate:** _____%

**Critical Issues Found:**
1. _______________
2. _______________
3. _______________

**Status:** ☐ READY FOR PRODUCTION ☐ NEEDS FIXES ☐ ON HOLD

**Sign-Off:**
- Tester: _________________________ Date: _______
- Manager: ________________________ Date: _______

---

## Document Metadata

**Version:** 1.0  
**Last Updated:** December 9, 2025  
**Status:** Ready for QA Phase

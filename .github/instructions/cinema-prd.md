# 📋 Product Requirement Document (PRD)
## Cinema Equipment Rental Platform

---

## 1. Executive Summary

**Project Name:** Cinema Equipment Rental & Production Services Platform  
**Client:** Equipment Rental Company (Casablanca, Morocco)  
**Launch Target:** 8 weeks  
**Primary Goal:** Create a multilingual (EN/FR) web platform where film producers and independent videographers can browse cinema equipment, manage rental requests (devis/quotes), and access production-related content without processing online payments.

---

## 2. Problem Statement

### Current Situation
- Client manually manages equipment inquiries via email/WhatsApp
- No centralized catalog of available gear
- No easy way for clients to request quotes with specific requirements
- SEO visibility is near zero
- Manual quote generation is time-consuming

### Solution Overview
A modern, professional web platform that:
- Displays all equipment in a searchable, filterable catalog
- Allows clients to add items to a cart and submit quote requests
- Automatically captures customer details for follow-up
- Improves SEO and organic traffic
- Provides an admin dashboard for quote management and content updates
- Supports English/French for international clients

---

## 3. Target Audience

### Primary Users
1. **Film Producers**
   - Medium to large-budget productions
   - Need rental equipment for 1-30 days
   - Decision-makers; professional email communication
   - Tech-savvy; expect modern UX

2. **Independent Videographers**
   - Solo operators or small teams
   - Need specific items (e.g., single camera, lights, sound kit)
   - Price-sensitive; want transparent pricing
   - Mobile usage (browse on-set)

3. **Production Companies**
   - Multiple projects per year
   - Want bulk/recurring rental discounts
   - Need detailed equipment specs and availability

### Secondary Users
4. **Admin/Staff**
   - Manage inventory (add/update/delete equipment)
   - Review and respond to quote requests
   - Post blog content (case studies, tutorials)
   - View analytics (pending requests, popular items)

---

## 4. Core Features (MVP - Minimum Viable Product)

### 4.1 Public Catalog
- ✅ Equipment listing page with grid/card view
- ✅ Search by name/brand
- ✅ Filter by category (cameras, lenses, lighting, audio, grip, misc)
- ✅ Individual equipment detail pages
- ✅ High-quality image galleries per item
- ✅ Equipment specifications display (resolution, sensor, weight, etc.)
- ✅ "Add to Cart" button

### 4.2 Shopping Cart
- ✅ Persistent cart (survives page refreshes)
- ✅ Display selected items with quantities
- ✅ Adjust quantities or remove items
- ✅ Rental date range picker (start/end date)
- ✅ Cart badge on navbar showing item count

### 4.3 Quote Request (Devis)
- ✅ Cart → Quote form flow
- ✅ Form fields: client name, email, phone, company, project notes
- ✅ Automatic capture of selected items + dates
- ✅ Submit → confirmation email to client
- ✅ Backend stores quote in admin panel for staff review
- ✅ No payment processing (manual quote follow-up via email)

### 4.4 Blog / SEO Content
- ✅ Blog post listing page
- ✅ Individual blog post detail pages
- ✅ Markdown or rich-text support
- ✅ SEO meta tags (title, description, canonical)
- ✅ Author/date display
- ✅ Categories and tags

### 4.5 Multilingual Support
- ✅ Full English interface
- ✅ Full French interface
- ✅ URL structure: `/{lang}/catalog`, `/{lang}/blog/[slug]`
- ✅ Language toggle in navbar
- ✅ Persistent language selection
- ✅ Translated equipment names/descriptions
- ✅ SEO hreflang tags

### 4.6 Admin Dashboard
- ✅ Secure login (email/password)
- ✅ Equipment CRUD: Add, edit, delete, publish/unpublish
- ✅ Image upload per item
- ✅ Quote management: View all quotes, filter by status (pending/approved/rejected), add internal notes
- ✅ Blog post management: Create, edit, publish
- ✅ User/role management (Admin, Editor, Viewer roles)
- ✅ Dashboard with quote statistics (pending count, recent submissions)

### 4.7 Performance & SEO
- ✅ Fast load times (Lighthouse 90+ score on desktop)
- ✅ Mobile-responsive design
- ✅ Sitemap generation
- ✅ robots.txt for search engines
- ✅ Open Graph meta tags for social sharing
- ✅ JSON-LD structured data for equipment
- ✅ Dynamic sitemaps (equipment, blog posts auto-included)

---

## 5. Features NOT Included (Out of Scope - v1)

- ❌ Online payment processing (Stripe, PayPal) — Manual quotes only
- ❌ Real-time availability calendar — Manual admin updates
- ❌ User accounts / login for clients — Quote requests are anonymous
- ❌ Chatbot / AI assistant — Can be added post-launch
- ❌ Mobile app (iOS/Android) — Web PWA only for now
- ❌ Inventory tracking / stock levels — Not yet required
- ❌ Multi-location support — Single warehouse assumed
- ❌ Video tutorials embedded — Links only (can add later)

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **Page Load Time:** < 2.5s (on 4G)
- **Lighthouse Score:** 90+ (desktop), 80+ (mobile)
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 3.5s
- **Image Optimization:** Automatic WebP/AVIF conversion, lazy loading

### 6.2 Security
- **HTTPS/TLS:** All traffic encrypted
- **Authentication:** Secure JWT tokens via PocketBase
- **Authorization:** Role-based access control (RBAC) — Admin only can manage quotes
- **Input Validation:** Server-side validation on all forms
- **Rate Limiting:** Quote submissions limited to 5 per hour per IP (prevent spam)
- **XSS Prevention:** All user input escaped before rendering
- **CSRF Protection:** Token-based validation on forms

### 6.3 Accessibility
- **WCAG 2.1 AA Compliance:** Color contrast, keyboard navigation, screen reader support
- **Focus Indicators:** Visible on all interactive elements
- **Alt Text:** All images have descriptive alt text
- **Semantic HTML:** Proper heading hierarchy, form labels

### 6.4 SEO & Discoverability
- **Meta Tags:** Per-page title, description, canonical URL
- **Keywords:** Target "location matériel cinéma Casablanca", "camera rental Morocco", etc.
- **Sitemaps:** Auto-generated, submitted to Google Search Console
- **robots.txt:** Proper crawl directives
- **hreflang Tags:** Language alternates for EN/FR versions
- **Structured Data:** Schema.org for equipment, blog posts, local business

### 6.5 Reliability & Availability
- **Uptime:** 99.5% (max 3.6 hours downtime/month)
- **Backups:** Daily automated database backups
- **Error Handling:** Graceful fallbacks, user-friendly error messages
- **Monitoring:** Alert admin on errors (via email or dashboard)

### 6.6 Maintainability
- **Code Quality:** TypeScript, clear naming, modular components
- **Documentation:** Inline comments, API docs, deployment guide
- **Version Control:** Git with clear commit messages
- **Environment Config:** `.env` files for local/prod/staging
- **Testing:** Manual QA checklist (automated tests optional for v1)

---

## 7. Success Metrics

### Business KPIs
1. **Quote Submissions:** Min. 5 quotes/week within 4 weeks of launch
2. **Organic Traffic:** 100+ monthly organic visitors within 8 weeks
3. **Client Satisfaction:** No complaints about site usability (qualitative)
4. **Admin Efficiency:** Quote response time reduced to < 2 hours

### Technical KPIs
1. **Page Load Speed:** Lighthouse score 92+
2. **Uptime:** 99.5% monthly availability
3. **Error Rate:** < 0.1% of requests fail
4. **Mobile Usage:** 30%+ of traffic on mobile devices

---

## 8. Assumptions

- Client has a list of equipment (specs, images) ready or can provide within Week 1
- Client has existing blog content or can write 5-10 initial posts
- Hostinger VPS is already provisioned (Ubuntu 22.04+, 4GB RAM)
- Client's domain is registered and DNS is manageable
- Client will provide admin account email/password after launch

---

## 9. Constraints & Limitations

### Technical
- Single VPS hosting (not horizontally scalable, but sufficient for < 5k monthly users)
- SQLite database (file-based, not distributed, but adequate for equipment rental business)
- No real-time bidding or live inventory (manual admin updates)

### Timeline
- 8 weeks from kickoff to launch
- Client feedback delays could push timeline

### Budget
- Zero software licensing costs (all open-source)
- Only VPS hosting cost applies (already budgeted)

---

## 10. Deliverables

| Deliverable | Owner | Due Date | Status |
|-------------|-------|----------|--------|
| Site design (Figma mockups) | Designer | Week 2 | Pending |
| Technical documentation | Architect | Week 1 | Pending |
| Equipment data (CSV + images) | Client | Week 1 | Pending |
| Deployed staging site | Dev Team | Week 4 | Pending |
| Client UAT (User Acceptance Testing) | Client | Week 6 | Pending |
| Production launch | Dev Team | Week 8 | Pending |
| Training + handover docs | Architect | Week 8 | Pending |

---

## 11. Sign-Off

**Document Version:** 1.0  
**Last Updated:** December 9, 2025  
**Prepared By:** Full-Stack Developer / AI Engineering Student  
**Status:** Ready for Client Review

---

## Appendix A: Equipment Categories & Examples

### Cameras
- Sony FX6, Sony FX30, Red Komodo, Panasonic S1H, Blackmagic Pocket Cinema

### Lenses
- Sigma Art Primes, Zeiss Master Primes, Cooke Anamorphics, Rokinon Cine Lenses

### Lighting
- Arri SkyPanel X, Neewer RGB LED, Kino Flo Divas, HMI Fresnel

### Audio
- Sennheiser MKE 600, Rode Wireless GO, Shure SM7B, RME Interface

### Grip & Rigging
- C-Stands, Tripods, Sliders, Jibs, Gimbals, Stabilizers

### Misc
- Batteries, Cables, Cases, Monitors, Recorders

---

## Appendix B: Sample Blog Post Categories
- "How to Shoot with Cinema Cameras"
- "Lighting Setups for Different Scenarios"
- "Behind-the-Scenes: Case Studies of Rentals"
- "Maintenance Tips for Equipment"
- "Morocco as a Film Location: A Guide"

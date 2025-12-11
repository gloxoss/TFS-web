# 📅 Implementation Roadmap & Gantt Chart
## Cinema Equipment Rental Platform

---

## 1. Project Timeline Overview

**Total Duration:** 8 weeks (56 days)  
**Start Date:** Week 1 (January 6, 2025)  
**Launch Date:** Week 8 (February 28, 2025)  
**Team:** 1 Full-Stack Developer (you)

---

## 2. Phase Breakdown

### PHASE 1: Infrastructure & Setup (Week 1 — 5 days)

**Goal:** VPS ready, PocketBase running, Next.js repo initialized.

| Task | Days | Status | Owner | Notes |
|------|------|--------|-------|-------|
| 1.1 Provision Hostinger VPS | 0.5 | Pending | You | SSH access, OS ready |
| 1.2 Install dependencies (Docker/systemd) | 0.5 | Pending | You | Or use Coolify |
| 1.3 Download & configure PocketBase | 1 | Pending | You | systemd service, port 8090 |
| 1.4 Test PocketBase admin UI | 0.5 | Pending | You | Create admin account |
| 1.5 Configure domain DNS | 0.5 | Pending | You | Point api.domain.com → VPS |
| 1.6 Setup reverse proxy (Nginx) | 1 | Pending | You | SSL cert via Let's Encrypt |
| 1.7 Initialize Next.js repo | 0.5 | Pending | You | Create-next-app with TS, Tailwind |
| 1.8 Install core dependencies | 0.5 | Pending | You | zustand, pocketbase, shadcn-ui, etc. |
| **Total** | **5** | | |

**Deliverable:** PocketBase admin accessible at `https://api.domain.com/_/`, Next.js local dev working.

---

### PHASE 2: Database Design & Seeding (Week 1-2 — 5 days)

**Goal:** Collections defined, sample data loaded.

| Task | Days | Status | Owner | Notes |
|------|------|--------|-------|-------|
| 2.1 Design `equipment` collection schema | 1 | Pending | You | Field definitions, validation rules |
| 2.2 Design `quotes` collection schema | 0.5 | Pending | You | Fields for cart items, status, etc. |
| 2.3 Design `posts` collection schema | 0.5 | Pending | You | Multilingual blog structure |
| 2.4 Design `users` collection (extend) | 0.5 | Pending | You | Roles: admin, editor, viewer |
| 2.5 Create all collections in PocketBase | 1 | Pending | You | Via admin UI |
| 2.6 Set API rules (security) | 1 | Pending | You | Public read, admin write, etc. |
| 2.7 Seed sample equipment data | 1 | Pending | You/Client | Import CSV or manual entry (10-20 items) |
| 2.8 Upload sample product images | 1 | Pending | You/Client | 2-5 images per item |
| **Total** | **6** | | |

**Deliverable:** PocketBase fully configured with sample data; admin can manage it.

---

### PHASE 3: Core Next.js Pages & Layout (Week 2-3 — 8 days)

**Goal:** Public-facing pages working (no dynamic data yet).

| Task | Days | Status | Owner | Notes |
|------|------|--------|-------|-------|
| 3.1 Setup i18n routing (`[lang]` middleware) | 1.5 | Pending | You | Redirect `/` → `/en` or `/fr` |
| 3.2 Create root layout + metadata | 1 | Pending | You | Fonts, SEO setup, CSS variables |
| 3.3 Build Header component (Navbar) | 1 | Pending | You | Logo, nav links, lang switcher, cart badge |
| 3.4 Build Footer component | 0.5 | Pending | You | Links, copyright, contact info |
| 3.5 Home page (`/[lang]/page.tsx`) | 1.5 | Pending | You | Hero, featured items placeholder, CTA |
| 3.6 Create Catalog layout | 1 | Pending | You | Grid view, filter sidebar (static) |
| 3.7 Create Equipment detail page template | 1 | Pending | You | Layout with image gallery, specs placeholder |
| 3.8 Create Blog list page | 0.5 | Pending | You | Post cards grid (placeholder) |
| 3.9 Create Blog detail page | 0.5 | Pending | You | Title, content, author (placeholder) |
| 3.10 Create Cart page | 1 | Pending | You | Cart items display, form sections |
| 3.11 Create Success page | 0.5 | Pending | You | Confirmation message template |
| **Total** | **9** | | |

**Deliverable:** All pages exist; can navigate between them. Uses hardcoded data temporarily.

---

### PHASE 4: Connect PocketBase & Fetch Data (Week 3-4 — 7 days)

**Goal:** Real data from PocketBase displayed on pages.

| Task | Days | Status | Owner | Notes |
|------|------|--------|-------|-------|
| 4.1 Create PocketBase client config (`lib/pocketbase.ts`) | 0.5 | Pending | You | Connect to VPS instance |
| 4.2 Fetch equipment list in Catalog | 1 | Pending | You | Server component, handle loading/errors |
| 4.3 Fetch single equipment in detail page | 1 | Pending | You | Use slug to fetch from PocketBase |
| 4.4 Display images with optimizations | 1 | Pending | You | Use Next.js `<Image />`, pb.files.getUrl() |
| 4.5 Fetch and display blog posts | 1 | Pending | You | Server components with ISR caching |
| 4.6 Test dynamic routes (catalog, detail, blog) | 0.5 | Pending | You | Verify all pages load correctly |
| 4.7 Setup error boundaries & fallbacks | 1 | Pending | You | Graceful error handling |
| 4.8 Implement ISR & revalidation | 1 | Pending | You | Cache strategies per page |
| **Total** | **7** | | |

**Deliverable:** Site displays real equipment, blog posts, images. Data fetching works end-to-end.

---

### PHASE 5: Client-Side Interactivity & Cart (Week 4-5 — 8 days)

**Goal:** Cart system functional, quote form ready.

| Task | Days | Status | Owner | Notes |
|------|------|--------|-------|-------|
| 5.1 Implement Zustand cart store | 1 | Pending | You | Add/remove items, persist to localStorage |
| 5.2 Build "Add to Cart" button & logic | 1 | Pending | You | Click → item added → toast notification |
| 5.3 Build Cart page UI | 1 | Pending | You | Display items, quantity controls, remove |
| 5.4 Add date range picker | 1 | Pending | You | Start/end date selection |
| 5.5 Display estimated pricing (if public) | 1 | Pending | You | Calculate based on daily_rate × days |
| 5.6 Build Quote form component | 1.5 | Pending | You | Fields: name, email, phone, company, notes |
| 5.7 Form validation (react-hook-form + zod) | 1 | Pending | You | Client-side + server-side validation |
| 5.8 Test cart persistence & interactions | 0.5 | Pending | You | Refresh page, verify cart remains |
| **Total** | **8** | | |

**Deliverable:** Users can add items, manage cart, fill quote form. No submission yet.

---

### PHASE 6: Quote Submission & Backend Logic (Week 5-6 — 7 days)

**Goal:** Quotes submit to PocketBase, admin can view.

| Task | Days | Status | Owner | Notes |
|------|------|--------|-------|-------|
| 6.1 Create server action for quote submission | 1 | Pending | You | `submitQuote()` in `app/[lang]/cart/actions.ts` |
| 6.2 Validate form server-side (zod schema) | 1 | Pending | You | Prevent spam, ensure data quality |
| 6.3 Save quote to PocketBase | 1 | Pending | You | POST to `quotes` collection |
| 6.4 Send confirmation email to client | 1.5 | Pending | You | Use Resend or SMTP (template: quote received) |
| 6.5 Send alert email to admin | 1 | Pending | You | New quote notification |
| 6.6 Display success page with quote ID | 0.5 | Pending | You | Reference number for client follow-up |
| 6.7 Implement rate limiting (IP-based) | 1 | Pending | You | Max 5 quotes/hour per IP (prevent spam) |
| **Total** | **7** | | |

**Deliverable:** Full quote workflow: submit → store → email → success.

---

### PHASE 7: Admin Features & Custom Dashboard (Week 6-7 — 6 days)

**Goal:** Admin can manage content and quotes (optional custom UI; can use PocketBase admin).

| Task | Days | Status | Owner | Notes |
|------|------|--------|-------|-------|
| 7.1 Setup admin authentication | 1 | Pending | You | Protect `/admin` routes; middleware check |
| 7.2 Build optional Admin Dashboard page | 1 | Pending | You | Stats widgets (pending quotes, recent items) |
| 7.3 Setup admin-only quote management view | 1.5 | Pending | You | List, filter, update status, add notes |
| 7.4 Alternatively: Use PocketBase admin UI | 0 | Pending | You | (Skip custom pages if PocketBase admin sufficient) |
| 7.5 Test equipment publish/unpublish | 0.5 | Pending | You | Verify visibility toggle works |
| 7.6 Test quote status workflow (pending → approved) | 1 | Pending | You | Manual update in PocketBase admin |
| 7.7 Test revalidation on data edits | 0.5 | Pending | You | Edit equipment → ISR refreshes site |
| **Total** | **5** | | |

**Deliverable:** Admin can manage quotes and equipment via PocketBase UI or custom pages.

---

### PHASE 8: SEO, Multilingual, & Optimization (Week 7 — 6 days)

**Goal:** SEO-ready, fast, multilingual.

| Task | Days | Status | Owner | Notes |
|------|------|--------|-------|-------|
| 8.1 Setup metadata per page (`generateMetadata`) | 1 | Pending | You | Title, description, canonical, OG tags |
| 8.2 Generate dynamic sitemaps.ts | 1 | Pending | You | Equipment + blog posts auto-included |
| 8.3 Create robots.txt | 0.5 | Pending | You | Allow crawling of /en and /fr |
| 8.4 Add JSON-LD structured data | 1 | Pending | You | Product schema for equipment |
| 8.5 Setup hreflang tags (language alternates) | 0.5 | Pending | You | Link /en/catalog ↔ /fr/catalog |
| 8.6 Verify multilingual content (EN/FR) | 0.5 | Pending | You/Client | All equipment names, descriptions translated |
| 8.7 Performance testing (Lighthouse) | 1 | Pending | You | Aim for 90+ score; optimize images/CSS |
| 8.8 Mobile responsiveness testing | 0.5 | Pending | You | Test on iPhone, Android, tablets |
| **Total** | **5.5** | | |

**Deliverable:** Site is SEO-friendly, fast (90+ Lighthouse), fully multilingual.

---

### PHASE 9: Testing & QA (Week 7-8 — 5 days)

**Goal:** Bug-free, ready for production.

| Task | Days | Status | Owner | Notes |
|------|------|--------|-------|-------|
| 9.1 Functional testing (checklist) | 1.5 | Pending | You | Browse, add cart, submit quote, etc. |
| 9.2 Multilingual testing (EN/FR) | 0.5 | Pending | You | Toggle language, verify all content |
| 9.3 Security testing | 0.5 | Pending | You | Admin can't be accessed by public, XSS checks |
| 9.4 Mobile testing | 0.5 | Pending | You | iOS Safari, Android Chrome |
| 9.5 Cross-browser testing | 0.5 | Pending | You | Chrome, Firefox, Safari, Edge |
| 9.6 Performance testing (Lighthouse, network) | 1 | Pending | You | Optimize slow pages |
| 9.7 User acceptance testing (UAT) | 0.5 | Pending | Client | Client tests on staging |
| 9.8 Bug fixes & iterations | 1 | Pending | You | Address feedback from testing |
| **Total** | **5.5** | | |

**Deliverable:** All tests pass; staging site is production-ready.

---

### PHASE 10: Deployment & Launch (Week 8 — 3 days)

**Goal:** Live on production.

| Task | Days | Status | Owner | Notes |
|------|------|--------|-------|-------|
| 10.1 Final production build & deployment | 0.5 | Pending | You | Deploy Next.js to VPS (Docker) |
| 10.2 Point domain to production VPS | 0.5 | Pending | You | DNS update (was pointing to staging) |
| 10.3 Verify SSL certificate | 0.5 | Pending | You | HTTPS working on domain.com |
| 10.4 Setup automated backups (PocketBase) | 0.5 | Pending | You | Daily DB backup to S3 or secure storage |
| 10.5 Setup monitoring & alerts | 0.5 | Pending | You | Email alerts for errors, downtime |
| 10.6 Create runbook & deployment docs | 0.5 | Pending | You | How to redeploy, rollback, update |
| 10.7 Handover to client | 0.5 | Pending | You | Admin training, password handoff, docs |
| **Total** | **3.5** | | |

**Deliverable:** Site live at domain.com, accessible worldwide, fully functional.

---

## 3. Gantt Chart (ASCII Timeline)

```
WEEK 1     WEEK 2     WEEK 3     WEEK 4     WEEK 5     WEEK 6     WEEK 7     WEEK 8
│         │         │         │         │         │         │         │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤

PHASE 1: INFRA
│▓▓▓▓▓│

PHASE 2: DB DESIGN
    │▓▓▓▓▓▓│

PHASE 3: PAGES
      │▓▓▓▓▓▓▓▓▓│

PHASE 4: DATA FETCH
            │▓▓▓▓▓▓▓│

PHASE 5: CART/INTERACTIVITY
              │▓▓▓▓▓▓▓▓│

PHASE 6: QUOTE SUBMISSION
                  │▓▓▓▓▓▓▓│

PHASE 7: ADMIN
                    │▓▓▓▓▓▓│

PHASE 8: SEO/OPTIMIZATION
                      │▓▓▓▓▓▓│

PHASE 9: QA TESTING
                        │▓▓▓▓▓│

PHASE 10: DEPLOYMENT
                          │▓▓▓│

Legend: ▓ = Work happening
```

---

## 4. Weekly Milestones

| Week | Milestone | Status |
|------|-----------|--------|
| **1** | VPS ready, PocketBase running, Next.js initialized | Pending |
| **2** | Database fully configured with sample data | Pending |
| **3** | All pages built (static layout, no data) | Pending |
| **4** | Data fetching from PocketBase working | Pending |
| **5** | Cart system complete, form ready | Pending |
| **6** | Quote submission end-to-end working | Pending |
| **7** | Admin features, SEO setup, Lighthouse 90+ | Pending |
| **8** | All testing passed, live on production | Pending |

---

## 5. Risk & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Client delays providing equipment data | High | Medium | Request CSV/images by Week 1; use placeholders if needed |
| PocketBase performance issues | Low | High | Use Postgres instead if SQLite bottlenecks (rare) |
| Domain/DNS issues | Low | High | Verify DNS early (Week 1); use subdomain for staging |
| Email service failures | Low | Medium | Test Resend/SMTP Week 6; have backup email config |
| Browser compatibility issues | Medium | Low | Test early (Week 4); use transpiling for old browsers |
| Scope creep (client adds features) | High | High | Freeze scope in PRD; create v1.5 roadmap for requests |

---

## 6. Success Criteria (Definition of Done)

### By End of Week 8:
- ✅ Site loads on mobile/desktop in < 2.5s (4G simulation)
- ✅ Lighthouse score 90+ (desktop), 80+ (mobile)
- ✅ All pages have correct meta tags (title, description, canonical)
- ✅ Sitemap.xml generated, robots.txt present
- ✅ Equipment list displays 20+ items
- ✅ Blog has 5+ posts (EN/FR)
- ✅ Cart persists after refresh
- ✅ Quote submission works; email sent
- ✅ Admin can log in and manage equipment
- ✅ Languages toggle (EN/FR) works on all pages
- ✅ No console errors (aside from 3rd-party tracking)
- ✅ Zero security issues (admin routes protected, input sanitized)
- ✅ Client UAT passes
- ✅ Documentation complete (README, deployment guide)

---

## 7. Communication Plan

### Daily (You)
- Check incoming quote emails
- Monitor for errors via email alerts

### Weekly (You + Client)
- Status call: Tuesday 2 PM
- Share demo/progress
- Gather feedback
- Confirm blockers

### Bi-Weekly (You + Client)
- Handoff staging site for testing
- UAT feedback discussion

### At Launch (You + Client)
- Production verification
- Admin training session (30 mins)
- Handover of credentials, docs

---

## 8. Assumptions & Constraints

### Assumptions
- Client provides equipment list (CSV) by Week 1
- Client provides product images (at least 1 per item) by Week 1
- Hostinger VPS provisioned before start
- Domain already registered and DNS manageable
- Client available for feedback calls (max 1-2 hrs/week)

### Constraints
- Single developer (you)
- Budget: $0 software (open-source only)
- Timeline: 8 weeks fixed
- Single VPS (no horizontal scaling needed for MVP)

---

## 9. Post-Launch (Weeks 9+)

### v1.1 Enhancements (Week 9-10)
- Performance tuning based on real traffic
- Client account system (optional)
- Advanced analytics dashboard
- Chatbot MVP

### v1.5 (Weeks 11-16)
- PDF quote auto-generation
- Payment processing (Stripe)
- Real-time availability calendar
- Mobile app (React Native) or PWA

---

## Document Metadata

**Version:** 1.0  
**Last Updated:** December 9, 2025  
**Status:** Ready for Development  
**Prepared By:** Full-Stack Architect

# NDH Agency — Full Site Audit & Correction Plan

Scope reviewed: entire `src/` tree (routing, layout, navbar/footer, all public marketing
views, all 4 role portals, all modals, AI widget, auth, payments, mock data/types,
build & lint output). The app was also installed, type-checked, linted, and
production-built to catch compile-time and config problems. A live dev server is
running so you can click through it yourself in the preview pane while reviewing
this plan.

Nothing has been changed yet — this is the findings + proposed fix plan you asked
to review first.

---

## 🔴 CRITICAL — breaks the core premise of the product

1. **"Sign In" has no real authentication — anyone can self-promote to Super Admin.**
   `src/lib/authStore.ts` → `loginWithCredentials()` never checks the password
   field at all, and if a *typed email* merely contains the word `admin`, `pm`,
   `manager`, `talent`, `dev`, or `design`, it auto-assigns that role. Typing
   `anything@admin.com` + any password in the Sign In modal instantly opens the
   full Admin Command Center (financial margins, talent payouts, client PII).
   This directly contradicts the product's core pitch — the "Strict Confidential
   PM Isolation Layer" — and is the single biggest trust-breaking bug in the repo.
   **Fix:** route all demo logins through one explicit "Preview as Role" switcher
   (already half-built in the orphaned `CreateAccountModal`) and stop deriving
   role from email keywords.

2. **False security/compliance badges shown to users.**
   "256-bit Encrypted", "ISO 27001 Certified Security", "PCI-DSS SECURE",
   "NDPR & GDPR Compliant" appear in the Auth modal, Footer, Client Portal, and
   Payment modal — but there is no backend, no encryption layer, and no actual
   certification. Shipping unverified compliance claims is a legal/credibility
   risk the moment real clients see it. **Fix:** replace with honest,
   defensible language ("Bank-grade payment rails via Paystack/Stripe",
   "Enterprise-ready architecture") until/unless these certifications are real.

3. **Fake "Install App" (PWA) flow.** `AppInstallBanner` shows "OFFICIAL PWA APP"
   and, when the native `beforeinstallprompt` isn't available (true for most
   browsers here because there's no manifest), it just fakes a 2.5s spinner and
   says "App Installed Successfully!" — nothing is installed. There's also no
   `manifest.webmanifest`, no icons, no service worker anywhere in `public/` or
   `__root.tsx`. **Fix:** either ship a real installable PWA (manifest + icons +
   SW) or remove the banner — don't fake success.

---

## 🟠 HIGH — inconsistent facts a visitor can catch in two clicks

4. **Department count is wrong in half the app.** The real catalog
   (`SERVICE_DEPARTMENTS` in `mockData.ts`) has **16** departments. Homepage,
   Services page, and Footer correctly say 16 — but the Architecture doc, the
   AI assistant ("10 managed departments" / "View 10 Departments"), the
   Architectural Blueprint modal, Admin Command preview, Mobile Simulator
   preview, and PM/Admin portals still say **10**. Pick one number and use it
   everywhere.

5. **Footer lists "16 Core Departments" but only shows 7 links** — the other 9
   departments are missing from that column entirely.

6. **Three different currency conversion rates coexist**, which will produce
   visibly contradictory prices depending on which part of the app a visitor
   is looking at:
   - Services/Homepage pricing calculator implies ~₦220–280 per $1 (e.g. Web
     Dev starter = $290 / ₦65,000).
   - `formatPrice()` in `currencyLanguageStore.ts` hardcodes ₦280/$1 (dead
     code, never actually called, but wrong even on its own terms).
   - The AI Sentinel chat widget and all mock project/invoice data use
     ₦1,500/$1 (the realistic current market rate).
   A client who asks the AI chatbot for a price and then opens the pricing
   calculator will see wildly different numbers for the same service. **Fix:**
   decide once whether public pricing is "accessible/PPP" pricing or real FX
   conversion, document it, and use a single shared rate/table everywhere.

7. **NDH Academy is advertised everywhere but doesn't exist.** Footer, Talent
   Portal, Talent Network page, AI widget, and the Journey walkthrough all link
   to `https://academy.ndh.com.ng` — a domain that isn't built or deployed in
   this repo (or anywhere). Every one of those links is currently a dead end
   for a real visitor. This was explicitly part of your original brief
   ("agency separate and academy separate… each a subdomain"), so it's a real
   feature gap, not just copy.

8. **Fabricated office addresses & phone numbers presented as real.** Contact
   page lists specific addresses (Victoria Island HQ, Transcorp Hilton Abuja,
   Canary Wharf London) and phone numbers that are invented placeholders, not
   NDH's actual offices. If this ships as-is, a prospective client could try to
   call or visit these. Needs either real details or clearly-marked "sample"
   copy before launch.

9. **76 hot-linked Unsplash stock photos presented as specific named people**
   (clients, talents, team leads, blog authors) — e.g. "Dr. Folake Adeleke,"
   "Architect-Alpha," PM "Tariq Al-Najeeb" all use generic stock photography.
   Fine for an internal prototype, but risky to present as real testimonials/
   team photos to actual prospects.

---

## 🟡 MEDIUM — architecture & code-quality issues

10. **It's technically a one-page app pretending to be a multi-page site.**
    Only one TanStack Router route exists (`/`); "pages" like `/services`,
    `/about`, `/contact`, and all 4 portals are just `useState` view-switches
    inside `index.tsx`. Consequences:
    - No real URLs — you can't bookmark, share, or deep-link to "Services" or
      "Client Portal"; refreshing always resets to Homepage.
    - Browser Back/Forward doesn't navigate between sections.
    - Every page shares one `<title>`/meta description (the one in
      `__root.tsx`), so Google only ever sees one page — this quietly defeats
      the SEO metadata that's clearly been carefully written per view.
    **Fix:** migrate to real file-based routes (`/services`, `/about`,
    `/contact`, `/portal/client`, etc.) so each view gets its own URL, meta
    tags, and back-button behavior — TanStack Router already supports this and
    it's a moderate, mechanical refactor given the views are already isolated
    components.

11. **TypeScript build is not actually clean.** `tsc --noEmit` reports real
    errors (not just style): `CreateAccountModal.tsx` references
    `isCreateOpen`, `closeCreateAccountModal`, `createCustomTestUser` which
    don't exist on `authStore` at all (the component is fully broken — see
    #12), and `mockData.ts` has an `exactOptionalPropertyTypes` violation on
    `RevenueSplitBreakdown`.

12. **~1,900 lines of dead/orphaned components** sitting in the repo,
    increasing confusion for anyone editing this later:
    - `CreateAccountModal.tsx` — unused *and* broken (see #11).
    - `BlogView.tsx` (222 lines) — a full duplicate blog page, never routed to
      (the live one is `InsightsView.tsx`).
    - The entire `directions/` exploration cluster except `MobileSimulatorPreview`:
      `DirectionNavbar`, `DirectionSelectionModal`, `AdminCommandPreview` (306
      lines), `ClientDashboardPreview` (445), `PMDashboardPreview` (422),
      `TalentDashboardPreview` (320) — these were an earlier draft of the
      portals, superseded by `AdminPortal`/`ClientPortal`/`PMPortal`/
      `TalentPortal`, but never deleted.
    **Fix:** delete these or clearly archive them outside `src/`.

13. **ESLint fails with ~3,800 problems.** The overwhelming majority (~3,770)
    are auto-fixable Prettier formatting issues (quote style), but there are
    also ~20+ genuine `@typescript-eslint/no-explicit-any` violations, one
    `prefer-const`, and several `react-refresh/only-export-components`
    warnings worth cleaning up for long-term maintainability.

14. **Minor Tailwind bug:** `HeroShowcaseSlider.tsx` uses `sm:h-84`, which
    isn't a real Tailwind utility (scale jumps 72 → 80 → 96, no 84, and no
    custom spacing token defines it) — so the hero image silently has no
    defined height at the `sm` breakpoint.

15. **Modals have no accessibility semantics.** None of the custom modals
    (Auth, Create Account, Payment, Talent Application, Brief Wizard,
    Blueprint, Direction Selection, Service Detail) use `role="dialog"`,
    `aria-modal`, focus trapping, or Escape-to-close. Keyboard and
    screen-reader users currently cannot use any modal flow properly.

16. **Dead/unreachable UI controls:** "Forgot Password?" in the Auth modal has
    no handler at all (clicking it does nothing).

17. **Payment flow is a pure client-side simulation with no backend**, which is
    fine for a demo, but it's not disclosed anywhere as a simulation — combined
    with issue #2's false security badges, a tester could reasonably believe
    real money could be charged. Needs a visible "Demo / Sandbox Mode" label
    until a real gateway is wired up.

18. **No persistence beyond `localStorage`.** All portal data (projects,
    invoices, payouts, briefs) lives in an in-memory/localStorage mock
    (`databaseStore.ts`) — acceptable for a clickable prototype, but worth
    being explicit that none of the 4 portals are backed by a real database/API
    yet, so nothing survives a different browser/device.

19. **Generic/leftover project metadata:** `package.json` `name` is still the
    scaffold default `"tanstack_start_ts"` instead of something like
    `ndh-agency`.

---

## 🟢 LOW — polish

- `robots.txt` has no `Sitemap:` line and there's no generated sitemap.
- Schema.org `sameAs` claims LinkedIn/Twitter/GitHub company profiles, but the
  footer has no visible social icons/links at all — inconsistent.
- The AI assistant is a scripted keyword-matcher, not a real LLM — fine, but
  it should probably say "Scripted Concierge" rather than implying full AI
  reasoning, to set correct expectations.
- A couple of blog articles contain specific infra claims ("in-memory Redis
  cluster... PostgreSQL transaction logs") that don't reflect this codebase —
  harmless as blog thought-leadership copy, but worth a pass so marketing
  copy doesn't overstate what's actually built.

---

## Proposed phased plan

**Phase 1 — Trust & correctness (do first, highest impact, low risk)**
- Fix the fake-admin-login security hole (#1).
- Remove/soften false compliance badges (#2) and the fake PWA install success (#3).
- Reconcile the "10 vs 16 departments" and the 3 conflicting currency rates (#4–6).
- Add a clear "Sandbox/Demo Mode" indicator to payments & AI assistant.

**Phase 2 — Cleanup**
- Delete the ~1,900 lines of orphaned/broken components (#12), fix the 2 real
  TypeScript errors (#11), run `eslint --fix` for the ~3,770 auto-fixable
  issues, fix the `sm:h-84` bug, wire up "Forgot Password," rename
  `package.json`.

**Phase 3 — Architecture upgrade**
- Convert the single-page view-switcher into real routed pages
  (`/services`, `/about`, `/contact`, `/portal/*`, etc.) so URLs, the back
  button, and per-page SEO metadata actually work.

**Phase 4 — Content & accessibility pass**
- Add ARIA roles/focus-trap/Escape handling to all modals.
- Replace placeholder office addresses/phone numbers and stock-photo "real
  people" with clearly-labeled sample data, or real info if you have it.
- Decide what to do about NDH Academy links (#7) — see question below.

I have **not** touched any code yet.

---

## Decisions locked in (per your answers)

- **Scope:** Go all the way — Phases 1 through 4, including the routing
  migration (#10).
- **Sample/placeholder content (#8, #9, office addresses, stock-photo
  "people," fake phone numbers):** Keep the data, but clearly mark it as
  sample/demo content wherever it's shown, instead of presenting it as real.

## My recommendation on the two open judgment calls

**NDH Academy links (#7):** This repo only contains the Agency half, and
actually building a full second product (Academy LMS, cohorts, exams,
cryptographic graduate verification) is a separate, much larger project — not
something to bolt on inside an "audit & fix" pass. My recommendation: stop
linking out to `academy.ndh.com.ng` (it 404s today), and replace every
instance with an inline "NDH Academy — Launching Soon" treatment (same
placement/copy, but a disabled/"notify me" state instead of a dead hyperlink).
This keeps your original cross-sell vision intact in the UI without shipping
broken links, and costs nothing to upgrade later when Academy is real. If you
later want me to actually scaffold a standalone Academy site/subdomain as its
own project, say the word and we'll scope that separately.

**Routing migration (#10):** This is the single highest-effort, highest-risk
item in the plan — it touches every view and all 4 portals. Since it's also
the last thing that needs the others to be stable first, I'll do it **last**,
after Phases 1, 2 and the content pass are done and verified, converting one
section at a time (public marketing pages first, then the 4 portals) and
re-running the type-check/build after each slice so a regression is caught
immediately and isolated. I'll check back in once Phases 1–2 are done and
before I start rewiring routing, in case you want to reconsider scope at that
point.

## Execution order I'm about to follow

1. **Phase 1 — Trust & correctness:** kill the fake-admin-login hole, remove
   false compliance/security badges, fix the fake PWA-install success, fix
   the department-count and currency-rate inconsistencies, add visible
   Sandbox/Demo labeling to payments, AI assistant, and all sample
   data/contact info/photos.
2. **Phase 2 — Cleanup:** delete dead/orphaned components, fix the 2 real
   TypeScript errors, run lint auto-fix + manual fixes for the real issues,
   fix the Tailwind `h-84` bug, wire up "Forgot password," rename
   `package.json`, replace dead Academy hyperlinks with "Launching Soon."
3. **Phase 4 (content/a11y) folded into the above:** ARIA roles, focus trap,
   Escape-to-close on every modal.
4. **Phase 3 — Routing migration:** convert the view-switcher into real
   TanStack routes with per-page metadata, last and in isolated slices.

Starting Phase 1 now.

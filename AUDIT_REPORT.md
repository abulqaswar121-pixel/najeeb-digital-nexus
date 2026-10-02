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

## Execution order

1. **Phase 1 — Trust & correctness** ✅ Done
2. **Phase 2 — Cleanup** ✅ Done
3. **Phase 4 (content/a11y), folded in** ✅ Done
4. **Real backend (replacing the in-browser mock data/auth layer)** ✅ Done
5. **Phase 3 — Routing migration** ✅ Done

All five phases above are complete, verified, committed, and pushed to this
session's branch. Nothing from the original audit remains outstanding except
the explicitly out-of-scope items listed at the bottom of this document
(NDA e-signature, full double-entry ledger, swapping the file-based store for
a real RDBMS, and production hosting/deployment configuration).

## Status: Phases 1, 2 & 4 complete

Everything below has been implemented, and the app still type-checks, lints
clean, and builds successfully after every change:

- **#1 Fake-admin-login hole fixed.** `authStore.ts` no longer grants roles by
  guessing from the email address. Every demo account now requires a real
  password match (`NDHDemo2026!` for the 4 seeded sandbox accounts). The Sign
  In modal now has an explicit, transparent "Preview Environment — Try a Demo
  Role" picker instead of a hidden trick.
- **#2 False certification badges removed** from the Auth modal, Footer,
  Client Portal, Payment modal, and AI widget — replaced with honest,
  defensible language (NDA protection, dual-key escrow, Paystack/Flutterwave
  rails) instead of claimed ISO 27001/PCI-DSS/256-bit certifications that
  don't exist.
- **#3 PWA install flow is now honest.** Added a real `manifest.webmanifest`
  + app icons + root `<link rel="manifest">`. `AppInstallBanner` now uses the
  real `beforeinstallprompt`/`appinstalled` browser events when available,
  shows real platform-specific "Add to Home Screen" instructions when not,
  and never fakes a success state.
- **#4/#5 Department count reconciled to 16 everywhere** (AI assistant,
  Mobile Simulator preview, Footer); Footer's department list now says
  "Popular Departments" with an honest "View All 16 Departments →" link
  instead of over-claiming a count it didn't list.
- **#6 Currency-rate conflict resolved.** Deleted the dead, wrong `formatPrice()`
  helper (stale ₦280/$1 rate). The AI widget's FX calculator is now explicitly
  labeled as an indicative market-rate conversion, separate from the
  PPP-adjusted Services page pricing, and the chatbot's pricing answer no
  longer states a contradictory hard USD→NGN equivalence.
- **#7 Dead NDH Academy links removed.** All 5 "visit academy.ndh.com.ng"
  links (Footer, Talent Portal, Talent Network page, Journey walkthrough) now
  show an honest "Launching Soon" / waitlist treatment instead of linking to
  a domain that doesn't exist.
- **#8/#9 Sample-data disclosure added.** Per your choice, a persistent
  disclosure now sits in the Footer: "Product preview build — office
  locations, phone numbers, client names, and photos shown throughout this
  site are illustrative sample data, not live contact details."
- **#11 Both real TypeScript errors fixed** (the broken orphaned modal is
  gone; the `RevenueSplitBreakdown` optional-property violation is fixed).
  `tsc --noEmit` is now 100% clean.
- **#12 ~1,900 lines of dead/orphaned/broken code deleted**: `CreateAccountModal`,
  `BlogView`, `DirectionNavbar`, `DirectionSelectionModal`,
  `ArchitecturalBlueprintModal` (was unreachable — exposed internal DB schema),
  `AdminCommandPreview`, `ClientDashboardPreview`, `PMDashboardPreview`,
  `TalentDashboardPreview`.
- **#13 ESLint: 3,804 problems → 0 errors** (6 harmless warnings remain, all
  inside vendored shadcn/ui boilerplate files, which is normal for that kit).
- **#14 Tailwind `sm:h-84` bug fixed** (changed to a real utility, `sm:h-80`).
- **#15 Modal accessibility added**: `role="dialog"`, `aria-modal`,
  Escape-to-close, and background-scroll lock on every custom modal (Auth,
  Brief Wizard, Service Detail, Payment, Talent Application, Admin's Invite
  PM modal, App Install).
- **#16 "Forgot password?" now does something** (explains reset isn't
  available in this sandbox instead of being a dead link).
- **#17 Payment modal relabeled** as an explicit sandbox/demo simulation
  ("SANDBOX DEMO — NO REAL CHARGE", "Demo Payment Simulated").
- **#19 `package.json` renamed** from the scaffold default to `ndh-agency`.

Verified after each change: `tsc --noEmit` clean, `eslint` clean (0 errors),
`vite build` succeeds, dev server hot-reloads with no runtime errors. Changes
are committed and pushed to this session's branch.

## Real backend (replaces the in-browser mock data/auth layer)

The original app had no backend at all: "login", talent data, briefs,
transactions, payouts, and QA/milestone approvals all lived in client-side
`useState`/localStorage, which meant (a) the "Strict Confidential PM
Isolation Layer" pitch was fiction — every visitor's browser already held
every talent's real name, hourly rate, and bank details, in `VETTED_TALENTS`
inside `mockData.ts`, fully readable from the shipped JS bundle; and (b) the
"dual-approval payout" and "QA gate before client approval" workflows were
cosmetic — two independent local booleans with no real enforcement linking
them.

This has been replaced with a real Express backend (`server/`) backed by a
simple file-based JSON store (`server/data/*.json`, gitignored, auto-seeded
with demo data — trivially swappable for a real database later, the
`Collection<T>`/`SingletonRecord<T>` abstraction in `server/db.ts` is the
only place that would need to change):

- **Real authentication.** bcrypt-hashed passwords + signed httpOnly JWT
  session cookies (`server/auth.ts`). The client never sees or controls the
  session token; a forged/garbage cookie is rejected with 401. No more
  "typing anything@admin.com logs you in as Super Admin."
- **Role-gated data, enforced server-side, not just hidden in the UI.**
  `GET /api/talents` returns only the public-safe view (no rates, no bank
  details); `GET /api/talents/internal` (PM/Super Admin only) and
  `GET /api/talents/me` (the talent's own record) are the only ways to reach
  the sensitive fields, and both are independently role-checked on the
  server. `VETTED_TALENTS` has been deleted from `mockData.ts` entirely —
  confirmed via grepping the production bundle that no real talent name,
  rate, or bank detail ships to the browser anymore.
- **Dual-approval payouts, actually enforced.** `server/routes/payouts.ts`
  rejects a second signature from the same user id (409) and requires two
  *distinct* signer ids before disbursement is allowed. A second seeded
  finance role (`user-finance-amina`, `finance_admin`) makes this genuinely
  exercisable with two different logins instead of one admin clicking a
  button twice.
- **QA-gate → milestone-approval ordering, actually enforced.** A client
  attempting to approve a milestone before the PM has signed off on QA now
  gets a 409, with both states persisted server-side and linked for the
  first time.
- **Real Paystack integration, gated on real keys.** `PaystackPaymentModal`
  opens the actual Paystack Inline popup once a real public key is
  configured; the server verifies the resulting transaction reference
  against Paystack's API using a secret key that never reaches the client.
  Without real keys, the flow still works end-to-end but transactions are
  honestly recorded as unverified/sandbox rather than silently claiming to
  be real charges.

All existing frontend components keep their original prop APIs; only the
data layer underneath (`authStore.ts`, `databaseStore.ts`) changed, from
synchronous in-memory state to an async API client.

## Routing migration (Phase 3)

The single-page `MainNavView` switch (one route, `/`, with every "page"
being a client-side `currentView === "..."` branch) has been converted to
real, independently-addressable TanStack Router routes: `/`, `/services`,
`/case-studies`, `/about`, `/process`, `/talent-network`, `/insights`,
`/contact`, `/privacy-policy`, `/terms-of-service`, `/refund-policy`,
`/journey`, `/mobile-preview`, and the four portals at `/portal/client`,
`/portal/pm`, `/portal/talent`, `/portal/admin`. Each real page now has its
own `<title>`/meta description for actual SEO instead of one static
document head for the whole app, deep-linking works (confirmed via curl:
every public route returns 200 on a fresh request, not just via in-app
navigation), and `public/sitemap.xml` lists every real public URL.

Two concrete, verified improvements came out of this beyond "pages have
real URLs":

1. **Portal code-splitting.** Each portal (`ClientPortal`, `PMPortal`,
   `TalentPortal`, `AdminPortal`) is now `React.lazy()`-loaded into its own
   JS chunk. Confirmed in the production build output that none of those
   four component names appear in the main/public bundle any visitor
   downloads just by loading the homepage — they only load if and when a
   user actually navigates to that specific portal route. This is on top
   of (not instead of) the server-side role gating above: it closes the
   "ship all portal UI code to every visitor" exposure/bloat that would
   otherwise remain even with the backend doing the real data gating.
2. **Portal route guard.** `usePortalGuard()` redirects a logged-out or
   wrong-role visitor who navigates straight to e.g. `/portal/admin` back
   to `/`, instead of leaving them sitting on an empty portal shell.
   Documented explicitly in code as a UX nicety, **not** the real security
   boundary — that's the server-side `requireRole()` checks above, which
   were already independently tested and don't depend on this guard at all.

Existing components' navigation prop APIs (`onSelectView`,
`onOpenBriefWizard`, etc.) were deliberately left unchanged — a translation
layer (`src/lib/viewRouting.ts`) maps the old view-name vocabulary onto real
URLs, so none of the ~15 page/portal components needed to be rewritten, only
the root routing wiring.

## Post-launch fix: removed the "pick a demo role" login shortcut, made staff/talent account creation real

After the routing migration shipped, a reasonable objection came up: the Sign
In modal still had a "Preview Environment — Try a Demo Role" panel with four
buttons that auto-filled login credentials for Client/PM/Talent/Super Admin.
Even though the backend behind it was real (bcrypt + sessions), *advertising*
preset logins on the public sign-in screen undercut the "real account system"
story. Two more fake-looking-but-real-sounding admin actions were found and
fixed at the same time, since they're the same underlying problem (an admin
action that looked like it created an account but didn't):

- **Login screen.** The demo-role picker is gone. Clients self-register for
  real via the existing "Create Account" tab (already backed by
  `POST /api/auth/register`); Project Manager, Talent, and Admin access is
  explained as invite/application-only, not a public self-serve button.
- **"Approve & Issue Talent Workspace" (Admin → Talent Applications) now
  really creates an account.** Previously this just flipped a local
  `useState` boolean with nothing behind it. It now calls
  `POST /api/talent-applications/:id/approve`, which creates a real
  bcrypt-hashed login, a real internal talent profile, links the two, and
  returns a real one-time temporary password for the admin to relay to the
  candidate (there's no outbound email service in this build, so that hand-off
  is manual and openly labeled as such). A matching reject action
  (`POST /:id/reject`) was added too — there previously wasn't one at all.
- **"Invite New PM Lead" (Admin) now really creates an account.** Previously
  this was a 2-second `setTimeout` that showed "Invitation Sent!" and created
  nothing. It now calls `POST /api/admin/invite-staff`, which creates a real
  login for the named person with a real one-time temporary password, shown
  once to the inviting admin the same way a cloud provider shows a new IAM
  access key exactly once. Deliberately restricted to inviting operational
  staff roles (PM, ops/finance/content/talent/support admin) — granting
  Super Admin is intentionally not a button anywhere in the product.
- The seeded bootstrap accounts (`najeeb@ndh.com.ng` and four others) still
  exist in the database so there's at least one way to log in on a fresh
  install, but are no longer surfaced anywhere in the UI as a public feature.

Covered by new tests: `server/__tests__/accountCreation.test.ts` (6 tests —
approval creates a login whose temporary password actually authenticates,
double-approval/rejection are rejected, non-reviewer roles are forbidden,
staff invite rejects duplicate emails and rejects self-escalation to
`super_admin`). Full suite after this change: 23/23 passing, `tsc --noEmit`
clean (frontend + server), `eslint` 0 errors, `vite build` succeeds.

## Post-launch fix: the Client Portal showed every logged-in client the same hardcoded sample company's data

A user registered a brand-new real client account through the real sign-up
flow (`POST /api/auth/register`) and landed in the Client Portal — which
showed them "KoboPay Global Inc.", a fake $28,500 "Sprint 2 of 4" active
project, a fake 100%-escrow-protected deposit, a fake 4.95/5.0 internal QA
score, a fake PM assignment ("Tariq Al-Najeeb"), a fake ₦250,000 referral
balance, and a fake unread PM chat — with their own real name wedged only
into the "Authorized User" line. This was the exact same disease as the
earlier fake-account-creation findings (UI presenting fabricated state as the
logged-in user's own account), just in client-facing portal data instead of
admin buttons.

**Root cause, confirmed by reading the code.** `ClientPortal.tsx` hardcoded
`selectedOrgId = useState("org-kobopay")` as its *only* value (there was no
way to change it tied to the actual account) and read every section —
org/project, escrow totals, QA score, PM name, chat transcript, welcome
credit ledger, referral balance, referred-orgs activity feed, NDA status —
from static arrays in `src/data/mockData.ts`, or from inline hardcoded JSX
strings. None of it was ever connected to who was actually logged in. The one
seeded demo client account (`folake@kobopay.com`, `organizationId:
"org-kobopay"`) happens to be the account that sample data was modeled on,
but the portal showed it to *every* client account, real or seeded, because
nothing ever branched on identity.

**Fix.** `ClientPortal.tsx` now checks `user.isDemoAccount &&
user.organizationId === "org-kobopay"` (true only for the one seeded Folake
account) to decide which of two modes to render:

- **Demo workspace** (only Folake): same illustrative KoboPay sample content
  as before, now with a persistent "You're viewing the illustrative sample
  demo workspace" banner and `SAMPLE` badges so it can no longer be mistaken
  for a real account's real data. The org switcher dropdown (which let *any*
  logged-in client arbitrarily pick between the three sample
  orgs — kobopay/helios/diaspora, none of which the real orgs even belong
  to) was removed entirely.
- **Every real client** (the default for every self-registered account):
  genuine per-account state. New backend endpoints were added so this is
  real, not just "hide the fake numbers":
  - `GET /api/briefs/mine` — a client's own submitted briefs only (matched by
    account id or email), never anyone else's.
  - `GET /api/referrals/mine` (already existed) is now actually used
    client-side via a new `useMyReferrals()` hook.
  - `GET /api/transactions/me` (already existed) is now actually used
    client-side via a new `useMyTransactions()` hook.
  - Welcome-credit balance, referral code, referral credits, and loyalty tier
    all now read from the real fields already set at registration
    (`user.welcomeCreditBalanceNGN`, `user.referralCredits`,
    `user.loyaltyTier`, etc.) instead of hardcoded numbers that happened to
    match only Folake's seed data.
  - A brand-new client with no briefs yet sees an honest "you don't have an
    active project yet" onboarding card with Submit-Brief / Drop-Custom-Task
    CTAs, instead of someone else's company.
- **Brief PM assignment was also fake and is now real.** Every brief
  submitted (by anyone, including the public "Start Your Project" wizard)
  was previously auto-stamped `assignedPM: "Tariq Al-Najeeb (Principal PM)"`
  regardless of whether any human had looked at it. Briefs now start
  genuinely `"Unassigned"`. A new `PATCH /api/briefs/:id/assign` endpoint
  (PM/Admin only) lets a PM actually claim a brief, which is now wired to a
  real "Claim This Brief & Start Proposal" button in the PM Portal (the old
  button had no `onClick` at all). The client's "PM:" line, in the header and
  footer and in the PM-chat tab, now reflects the real assignment instead of
  a hardcoded name.

Covered by new tests: `server/__tests__/clientPortalData.test.ts` (4 tests —
a brand-new client sees zero briefs until they submit one, and the new brief
is genuinely unassigned; one client can never see another client's briefs via
`/briefs/mine`; a PM claiming a brief really replaces the placeholder name;
the seeded demo client's referral records are scoped to her and a new client
has none). Full suite after this change: 27/27 passing, `tsc --noEmit` clean
(frontend + server), `eslint` 0 new errors, `vite build` succeeds.

## Still outstanding / explicitly out of scope

Nothing from the original audit list remains open. The following were
identified during the backend build as reasonable to defer, and are
recorded here rather than silently skipped:

- **NDA e-signature integration.** Talent onboarding currently has an
  `ndaSigned` boolean field (seeded `true`/`false` per demo talent) but no
  real e-signature provider (e.g. DocuSign/HelloSign) wired up. Out of
  scope for this pass — flag if you want this built next.
- **Full double-entry accounting ledger.** The transactions/payouts data
  model records enough to be honest about what's demo vs. real (see above),
  but is not a real accounting ledger with trial balances, reconciliation,
  etc. Fine for a sandbox/demo; would need real accounting software or a
  ledger library before handling real client money.
- **File-JSON store → real RDBMS.** Documented above as a deliberately
  small, isolated swap (`server/db.ts`) for whenever real concurrent-write
  guarantees or multi-instance deployment are needed.
- **Production hosting/deployment.** The app is now two processes (Vite/
  TanStack Start web app + Express API) that need to run together and share
  an origin/proxy in production the same way `vite.config.ts` proxies
  `/api` in dev. No hosting target has been chosen or configured yet — this
  is a deployment-architecture decision for you to make (single host with a
  reverse proxy vs. two separate services vs. serverless) before this goes
  live anywhere.
- A few lower-priority LOW items from the original list weren't touched this
  pass (blog thought-leadership copy tone) — happy to clean those up too if
  you want. (Footer social icons were added in the real-contact-details pass
  below.)
- **Client ↔ PM chat is still not a persisted real-time channel.** The
  Client Portal's "PM Direct Chat" tab for the demo workspace is explicitly
  labeled as a sample conversation now (see above); for real clients it
  honestly says no chat exists yet and points to the PM's eventual email
  follow-up instead of pretending a conversation happened. A real persisted
  messaging thread (stored server-side, visible from both the Client Portal
  and PM Portal) would be a reasonable next feature if you want it built.

---

## Real contact details, real case studies, and homepage honesty pass (2026-10-02)

Source of the real content: the user's own live, deployed agency site
(`ndh.com.ng`, source at `github.com/abulqaswar121-pixel/ndh-com-ea34ebce`),
agency-only (Academy content explicitly excluded). Full research trail is in
`REAL_DATA_MIGRATION_PLAN.md`. Everything below was implemented after the
user reviewed that plan and gave explicit go-ahead with specific corrections.

### Real contact details replace fabricated ones

- **Address**: the fake 3-office grid ("NDH Tower, 14B Karimu Kotun St,
  Victoria Island, Lagos"; "Nexus Suite 402, Transcorp Hilton Boulevard,
  Maitama, Abuja"; "Level 18, 40 Bank Street, Canary Wharf, London") is gone
  from `AppFooter.tsx`, `ContactView.tsx`, `AboutView.tsx`, and the
  `schema.org` JSON-LD in `src/routes/__root.tsx`. Replaced with the user's
  real address (Marmaron Nufawa, Western Bye Pass, Sokoto, Nigeria) framed
  honestly as "Nigeria · Worldwide, remote-first, no branch offices" —
  matching how the real ndh.com.ng site presents itself (it also lists no
  physical branch offices).
- **Phone/WhatsApp**: real number `+234 902 993 2794` (wa.me link) replaces
  the fake `+234 1 800 634 634` and the fake per-city numbers.
- **Email**: real `hello@ndh.com.ng` plus the user's own
  `abunnajeeh7@gmail.com` replace the fake `partnerships@agency.ndh.com.ng`
  / `lagos@agency.ndh.com.ng` / `abuja@agency.ndh.com.ng` /
  `london@agency.ndh.com.ng` addresses, everywhere including the JSON-LD.
- **Social links**: real Facebook and Instagram links added to the footer,
  Contact page, and JSON-LD `sameAs` (previously the footer had no social
  links at all, and the JSON-LD pointed to fake/unconfirmed LinkedIn,
  Twitter, and GitHub profiles).

### Real case studies replace fabricated ones

All 6 entries in `CASE_STUDIES` (`src/data/mockData.ts`) — previously
fictional companies (KoboPay Global Inc., Helios AgriTech, DiasporaDirect
LLC, a "confidential" freight carrier, Zenith Care, Zuri Couture) with
invented financial metrics ($42M+ processed, $18.5M inquiries, etc.) and
testimonials from people who don't exist — are now the 6 real, verifiable
projects from ndh.com.ng: Apex Agri-Capital (Shared Farm Ledger), Miftah
al-Arabiyyah (Arabic Curriculum Series), Markazussalaf Institute (Academic
Operations Engine), a digital story series ("The Inheritance of Shadows"),
NDH's own Agency & Academy Web Platform, and Basic Studies (Result &
Reporting System). Three carry real, named-client testimonials pulled
verbatim from the live site (Dr Ahmad Muhammad Tijjani / Markazussalaf;
Najeeb Ahmad / Apex Agri-Capital; Muhsin Musa / Miftah al-Arabiyyah). No
invented dollar/percentage metrics were carried over or substituted — the
`CaseStudy` type's `year`/`projectDuration` fields were made optional and
the two consuming views (`CaseStudyPreview.tsx`, `HomepagePreview.tsx`) now
hide those chips, the metrics-grid overlay, and the "Team Composition"
line entirely when the real data doesn't include them, rather than show a
blank/undefined value or a derived fake number. Hero images are new,
AI-generated, generic illustrative photography (not real client
screenshots — none were available) with alt text that doesn't claim to be
literal product screenshots.

A second, separate hardcoded fake carousel was found and fixed during this
pass: `src/components/home/HeroShowcaseSlider.tsx` (the auto-rotating
banner directly under the homepage hero) had its own 4 fabricated
"case studies" — KoboPay Global Inc., AfriHealth Telemedicine, Sovereign
Asset Escrow, AgriTech Intelligence Hub — with invented stats ("2.4M
active accounts", "$42M in luxury real estate sold", "150k+ clinical
consultations", etc.), entirely independent of the `CASE_STUDIES` array.
Replaced with 4 of the same real, verified projects above, using honest
qualitative highlights (e.g. "3 Roles: Admin · Operator · Contributor",
"8 Levels: Full Series Delivered") instead of invented numbers.

### Other homepage honesty fixes found while auditing (not explicitly
requested, fixed as the same class of issue)

- **Fake "live telemetry" ticker**: the top homepage ticker literally
  generated a random fake "API Edge Latency" number every 2.5 seconds via
  `Math.random()` and presented it as live operational data, alongside an
  unverifiable "100+ Vetted Engineers & Designers" headcount and "Sub-15min
  PM Response SLA" claim. Removed the random-number generator entirely and
  replaced the ticker with factual, verifiable statements (service
  department count, "every project PM-reviewed", automatic currency
  detection).
- **Fabricated hero stats**: "$180M+ Client Value Generated", "99.8%
  On-Time Delivery", "100+ Successful Products Launched", "4.98/5 Client
  Satisfaction" (and translated equivalents in all 6 supported languages)
  replaced with honest, defensible counts grounded in what's actually on
  the site: 6 real case studies, "100% PM-Reviewed Before Handover" (a
  process claim, not a fabricated score), 16 service departments, and 3
  verified client testimonials.
- **Fake partner/client logo marquee**: a scrolling marquee claimed
  ongoing relationships with real third-party companies (Paystack,
  Flutterwave, Cloudflare, Moniepoint) alongside fictional ones (KoboPay
  Global, AfriHealth Systems, Sovereign Asset Escrow) under the banner
  "Powering Digital Growth for African & International Enterprises."
  Replaced with the real client names from the 6 real case studies under
  an honest "Real Clients We've Delivered For" label.
- **Hardcoded fake "QA Score: 4.95 / 5.0"**: shown identically under every
  case study regardless of which one was selected. Replaced with a
  "Verified Project" badge tied to the case study's actual
  `clientApprovalRecorded` flag.
- **"Starter MVP / Student" plan naming**: the Starter tier was labeled
  "Starter MVP / Student" / "Students & Starters" in the homepage
  estimator, the service detail modal, the Services page intro copy
  ("budget-friendly student MVPs"), and the footer ("Rapid No-Code MVPs
  (Students & Startups)"). All renamed to plain "Starter MVP" / "Starter
  Plan" / "Starters & Startups" per explicit instruction.
- **Overt "target country" currency announcements**: the homepage hero
  pill, the pricing estimator, the Services page banner, and the Service
  Detail modal all explicitly announced "Viewing in Nigeria" / "Country
  Target: Nigeria" / "Auto-detected region: Nigeria." Currency
  auto-detection (`detectUserCountryAndCurrency()` in
  `currencyLanguageStore.ts`, based on browser timezone/locale, already
  implemented and unchanged) now works quietly in the background — the UI
  just shows the resulting currency (with a manual override already
  available via the nav currency switcher) instead of calling out the
  detected country by name.

### Verification

`tsc --noEmit` clean, `eslint .` 0 errors (pre-existing unrelated
`react-refresh` warnings only), full test suite 27/27 passing, `vite build`
succeeds, and the dev server was used to confirm no fake company/address
strings remain on the homepage, case studies, contact, or about pages.

### Explicitly deferred (flagged to the user, not touched this pass)

- `AboutView.tsx` still has a fully fabricated "Executive Leadership" team
  (4 invented people with stock Unsplash headshots and fictional
  backgrounds, e.g. "Ex-McKinsey Digital"). This wasn't part of this
  round's explicit instructions; flagged for a future pass.
- 4 additional testimonials on the live ndh.com.ng site (Sarah Jenkins,
  Chidi Okafor, Zainab Malik, Fatoumata Diallo) aren't tied to a named,
  verifiable case study the way the 3 ported ones are, and weren't added —
  the user asked to rely on the case-study-embedded testimonials only.
- Per-department `activeTalentsCount`/`averageTurnaroundDays` figures in
  `SERVICE_DEPARTMENTS` (e.g. "28 Active Talents") are likely optimistic
  placeholder figures too, but are a separate, more systemic internal
  catalog concern not explicitly raised this round.

## Case-study refresh: Estore, Academy, SchoolDesk real products (2026-10-02)

Follow-up to the real-data pass above, per client request, to replace three
of the six case studies with three of the client's own real, currently-live
products, and to swap hero images on the three being kept.

**Replaced (real product research, not fabricated):**
- cs-005 "NDH Agency & Academy Web Platform" → **"Najeeb Academy: AI Skills
  Learning Platform."** Content sourced by fetching the live site
  (`ndhacademy.lovable.app`, moving to `academy.ndh.com.ng`): 60+
  project-based courses across 6 tracks, Learn → Assess → Build → Certify
  structure, 70% graded-assessment pass bar, signed/verifiable certificates.
  Embeds one real student testimonial (Ibrahim Musa) published on that site.
  A new `liveUrl`/`liveUrlLabel` field was added to the `CaseStudy` type and
  rendered as a "Visit Live Project" link in the case study detail sidebar —
  only populated here since this was the one confirmed-reachable URL.
- cs-003 "Markazussalaf: Academic Operations Engine" → **"NDH Estore:
  Multi-Vendor Commerce Platform."** The client-provided URL
  (`ndhstore.lovable.app`) returns "Project not found" (unpublished), and the
  client gave no written description, so content was instead sourced
  directly from the client's own public GitHub source repository
  (`abulqaswar121-pixel/NDH-Estore-`): a multi-tenant commerce platform with
  a vendor dashboard (products, orders, payouts, shipping, ad-pixel
  tracking), per-vendor dynamic storefronts, WhatsApp checkout, and three
  real pricing tiers (Starter/Pro/Global Enterprise) with Stripe and
  Flutterwave processing and a 14-day free trial. The example "testimonials"
  found in that repo's own marketing-page source read as illustrative sample
  copy for the SaaS's sales page (not verified NDH client quotes), so none
  were embedded — consistent with the project's testimonial-verification
  standard.
- cs-006 "Basic Studies: Academic Result & Reporting System" → **"SchoolDesk:
  Report Sheets, Salary & Fees Platform."** Content written from the
  client's own first-hand description (report sheet generation, staff
  salary payment, school fees tracking). No `liveUrl` was added: the
  provided address (`ndhschooldesk.lovable.app`) currently also returns
  "Project not found," and no corrected URL has been supplied yet — omitted
  rather than linking a broken page.
- `HeroShowcaseSlider.tsx` (homepage carousel) updated to match: its
  "ndh-platform" slide became the Najeeb Academy slide, and its
  "markazussalaf" slide became the NDH Estore slide, using the same honest,
  factual stat figures as the case-study entries (no invented metrics).
- New illustrative hero images generated for Academy, Estore, and SchoolDesk
  in the same style as the existing six; the three orphaned AI-generated
  images (`ndh-platform.jpg`, `basic-studies.jpg`, `markazussalaf.jpg`) were
  deleted.

**Explicitly NOT done yet (blocked on the client):**
- The client's three preferred custom images for Apex Agri-Capital, Miftah
  al-Arabiyyah, and The Inheritance of Shadows were referenced in chat
  (`case-apex-custom.webp`, `case-miftah-custom.png`, `case-story-custom.png`)
  but never actually arrived as files in the workspace across two attempts —
  these three case studies still use their original AI-generated hero
  images pending a successful re-upload.
- No corrected, reachable URL for SchoolDesk has been supplied, so its case
  study has no "Visit Live Project" link yet.

Verification: `tsc --noEmit`, `eslint` (0 errors; only the 7 pre-existing
react-refresh warnings in unrelated ui-library files), `vitest run` (27/27
passing), and `npm run build` all clean after these changes.

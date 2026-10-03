> **Status: implemented 2026-10-02.** See `AUDIT_REPORT.md` → "Real contact
> details, real case studies, and homepage honesty pass" for exactly what was
> shipped, including the user's specific corrections (real Sokoto address,
> extra personal email, case studies rewritten/polished rather than used
> verbatim, the 4 unverified testimonials dropped, plus an additional
> homepage-wide pass fixing fake stats/partner logos/QA scores/Starter-Student
> labeling/currency-country banners found during implementation). This file is
> kept as the original research record.

# Real-data migration plan — contact details & case studies (agency only)

Source: `https://github.com/abulqaswar121-pixel/ndh-com-ea34ebce` (cloned to
`/home/user/ndh-com-reference` for reference — not part of this repo) +
the live deployed site `https://ndh.com.ng`, which turned out to be the
actual production build of that reference repo, so the text below is the
real, rendered content, not just source code.

Academy content (courses, certificates, academy testimonials) was
deliberately excluded per your instruction — agency only.

This is a PLAN ONLY. Nothing in this repo has been changed yet.

---

## 1. Contact details

### What's currently fake in this repo

| Field | Current (fake) value | Where |
|---|---|---|
| Address | `14B Karimu Kotun St, Victoria Island, Lagos` ("NDH Tower") | `AppFooter.tsx`, `AboutView.tsx` |
| Address #2 | `Nexus Suite 402, Transcorp Hilton Boulevard, Maitama, Abuja` | `ContactView.tsx`, `AboutView.tsx` |
| Address #3 | `Level 18, 40 Bank Street, Canary Wharf, London E14 5NR` | `ContactView.tsx`, `AboutView.tsx` |
| Phone | `+234 1 800 634 634` | `ContactView.tsx` |
| Email | `partnerships@agency.ndh.com.ng` | `AppFooter.tsx` |
| Email #2 | `lagos@agency.ndh.com.ng` / `abuja@...` / `london@...` | `ContactView.tsx` |
| Social links | none present in the footer at all | `AppFooter.tsx` |

These three "Global Presence" / "Direct Operational Hubs" offices (Lagos HQ,
Abuja, London) are entirely invented — street addresses, suite numbers and
all — and currently appear in **both** the Contact page and the About page.

### What's real (found in the reference repo + confirmed live on ndh.com.ng)

| Field | Real value | Source |
|---|---|---|
| WhatsApp / phone | `+234 902 993 2794` | `contact.tsx`, live `/contact` |
| Support/contact email | `hello@ndh.com.ng` | used site-wide for support (`RequireRole.tsx`, `PortalShell.tsx` footer: `mailto:hello@ndh.com.ng`); also the default `ADMIN_NOTIFICATION_EMAIL` fallback in `email/transactional.server.ts` |
| Facebook | `https://www.facebook.com/share/1Be6HN8zjS/` | `contact.tsx`, `PageShell.tsx` footer |
| Instagram | `https://www.instagram.com/njb_digital_hub` | same |
| Physical address | **None.** The real site does not claim any physical office anywhere. | confirmed across `contact.tsx`, `PageShell.tsx` footer, `about.tsx`, and the live `/about` page, which states only: *"Based in Nigeria, working with clients and learners worldwide."* |

**Decision needed from you:** the real brand doesn't publish a street
address at all — it's positioned as a remote-first digital hub. So the
honest replacement isn't "one correct address" but **no address**, just
"Nigeria · Worldwide" (which the footer already says) plus WhatsApp/email/
socials. Confirm you're fine dropping the fake Lagos/Abuja/London office
blocks entirely rather than replacing them with a different fake-looking
"single office" — or tell me if NDH does have a real physical address you
want listed instead (not present anywhere in the reference repo).

---

## 2. Case studies

### Current (fake): 6 case studies in `src/data/mockData.ts` (`CASE_STUDIES`)

All fabricated — fictional companies, fabricated financial metrics, and
testimonials attributed to named people who don't exist, with
`clientApprovalRecorded: true` asserting an approval that never happened:

- **KoboPay Global Inc.** — fake $42M+ processed volume, fake 74% drop-off reduction, quote from "Dr. Folake Adeleke"
- **Helios AgriTech Ltd.** — fake ₦1.8B automated payouts, quote from "Ibrahim Sanusi"
- **DiasporaDirect LLC** — fake $18.5M property inquiries, quote from "Marcus Sterling"
- **Apex Logistics** (anonymized) — fictional freight carrier
- 2 more fabricated entries (`cs-005` Zenith Care telemedicine, `cs-006` Zuri Couture e-commerce)

### Real (found live on ndh.com.ng `/work`): 6 real, modest, verifiable projects

| Slug | Client | Category | Challenge → Approach → Result |
|---|---|---|---|
| `apex-agri-capital-shared-farm-ledger` | Apex Agri-Capital | Web App Development / Business Systems | A growing agriculture investment co-op (catfish, poultry, goat farming) needed transparent tracking of contributions, expenses and member equity. NDH built a role-based web app (Admin / Operator / Contributor views). Result: transparent tracking for all members, built to scale toward 100 members. |
| `miftah-al-arabiyyah-arabic-curriculum` | Miftah al-Arabiyyah Project | Content & Curriculum Development | Nigerian non-native Arabic speakers lacked a structured curriculum (Nursery–JSS3). NDH authored and structured all 8 levels with formal teacher review. Result: a complete, reviewed 8-book series with matched audio resources. |
| `markazussalaf-academic-operations-engine` | Markazussalaf Institute | Business Support / Document Systems | An Islamic school's Qur'an memorization program relied on ad hoc tracking. NDH built a 4-year master syllabus, term target sheets and learner progress cards. Result: automated report generation across 8 teacher registers — "days" of work now automated. |
| `the-inheritance-of-shadows-story-series` | Digital Story Series | Digital Media & Publishing | A digital mystery story series needed narrative structure, pacing and a publishing format from scratch. NDH designed the structure, covers and promo visuals. Result: full content pipeline from writing to digital reader deployment, series live. |
| `ndh-agency-academy-web-platform` | Najeeb Digital Hub (self) | Web Engineering & Platform Design | NDH itself needed one platform combining talent marketplace, client workflows and an academy. Result: live platform, multi-currency, role-based portals — i.e., **this very product**. |
| `basic-studies-result-reporting-system` | Basic Studies | Administrative & Educational Software | Manual ledger-based result entry caused grading errors and slow reporting. NDH replaced it with structured inputs and grade verification. Result: export-ready report cards, fewer errors, faster turnaround. |

No invented dollar/percentage metrics anywhere — the real case studies are
deliberately qualitative ("days to hours", "ad hoc to automated"), not
fabricated numbers.

### Real testimonials tied to 3 of these case studies (live on ndh.com.ng `/agency`)

1. **Dr Ahmad Muhammad Tijjani** — Academic Director, Markazussalaf Institute — *"The custom academic tracking systems completely transformed how our teachers handle memorization records. Reports that used to take days of manual collation are now accurate and automated."* — badge: Verified Project Delivery
2. **Najeeb Ahmad** — Co-Founding Partner, Apex Agri-Capital — *"The Shared Farm Ledger gave our co-operative full transparency over every Naira contributed and spent. Having clear role-based views made member onboarding effortless."* — badge: Verified App Deployment
3. **Muhsin Musa** — Lead Review Committee Member, Miftah al-Arabiyyah Project — *"NDH delivered top-tier curriculum structure and production coordination across an 8-book series. The attention to educational accuracy and pedagogical detail was outstanding."* — badge: Verified Curriculum Project

### 4 more agency testimonials on the live site, NOT tied to a specific case study

Sarah Jenkins (Operations Manager, Brand & Identity), Chidi Okafor (Product
Lead, Design & Product), Zainab Malik (Agency Partner, Marketing & Growth),
Fatoumata Diallo (Marketing Director, Video & Media) — all tagged "Verified
Project Delivery" on the live site, but with no named company attached.
**Flagging, not assuming:** I can't independently verify these four the way
I can verify the 3 above (which map 1:1 to named, documented projects). Tell
me if you want these four ported over as-is, dropped, or treated
differently.

### Data-model gap to resolve

Our current `CaseStudy` type (`src/types/ndh.ts`) has fields the real data
doesn't have: `measurableOutcomes` (quantified metrics — real projects have
none), `galleryImages`, `teamSize`, `projectDuration`, `year`, `location`.
Options when we build this:
- **(a)** Make those fields optional and simply omit them for real entries (recommended — matches the real site, which shows challenge/approach/result only, no stat cards).
- **(b)** You supply real figures for any of these you actually have, per project.

---

## 3. Also spotted while investigating (related, but not explicitly in your list — flagging, not touching)

- `AboutView.tsx` has a fully fabricated "Executive Leadership" section (4
  invented people incl. a Lead PM "Tariq Al-Najeeb" who is also used as the
  app's demo PM login persona, plus stock Unsplash headshots) and duplicates
  the fake Lagos/Abuja/London office grid under "Physical Operational Hubs."
  This is the same kind of fake content as the address/case-study issues —
  want this in scope too, or left for a separate round?
- The real site has working Facebook/Instagram/WhatsApp icons in its
  footer; ours currently has none. Easy add once you confirm the social
  links above are correct to use.

---

## 4. Suggested order of implementation (once you say go)

1. Contact details: swap fake address/phone/email blocks in `AppFooter.tsx`
   and `ContactView.tsx` for the real WhatsApp/email/socials, drop or
   simplify the fake 3-office grid (needs your confirmation above).
2. Case studies: replace all 6 entries in `CASE_STUDIES` with the 6 real
   ones (text above), attach the 3 verified testimonials, decide on the
   other 4, adjust the `CaseStudy` type for the metrics-field gap.
3. (Optional, pending your answer) Executive Leadership section in About.

I will not implement anything until you tell me which of the above to do.

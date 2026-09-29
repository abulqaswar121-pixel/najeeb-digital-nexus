# NDH Agency Operating System: Enterprise Product Architecture & Design Direction Blueprint

**Platform:** NDH Agency (Part of Najeeb Digital Hub Ecosystem)  
**Domains:**  
- Agency: `https://agency.ndh.com.ng`  
- Academy: `https://academy.ndh.com.ng`  
**Architecture Date:** 2026-09-29  
**Core Model:** Managed Digital Services Bureau (Strict Confidential PM Isolation Layer)

---

## Executive Summary & Product Positioning

NDH Agency is a **managed digital services bureau**, not an open freelance bidding platform. 
Clients contract NDH Agency. NDH operations and project managers assign vetted top-tier internal African and diaspora talents. Project Managers strictly control scope, communication, quality assurance, and milestone verification. Clients and talents **never communicate directly** or gain access to each other's private identities, direct contact details, or internal pricing margins.

---

## A. Master Product Map & Ecosystem Topology

```
+---------------------------------------------------------------------------------------------------+
|                                     NAJEEB DIGITAL HUB PARENT BRAND                               |
+-------------------------------------------------+-------------------------------------------------+
|                                                 |                                                 |
|            NDH AGENCY                           |                NDH ACADEMY                      |
|      (agency.ndh.com.ng)                        |           (academy.ndh.com.ng)                  |
|   Managed Digital Services Bureau               |      Talent Training & Certification LMS        |
|                                                 |                                                 |
| • Public Showcase & Flagship Case Studies       | • Independent Codebase & Database               |
| • 10 Core Managed Service Departments           | • Student LMS, Courses, Cohorts & Exams         |
| • Client Workspace (Multi-Org, Billing, Chat)   | • Cryptographic Graduate Verification Endpoint  |
| • Project Manager Operations Command            | • Discrete Referral Attribution Bridge          |
| • Private Talent Network (Tasks, QA, Payouts)   | • Footer: "Need a professional team? Work with  |
| • Multi-Role Admin Command (Ops, Fin, CMS)      |   NDH Agency."                                  |
| • Footer: "Looking to build your skills?        |                                                 |
|   Explore NDH Academy."                         |                                                 |
+-------------------------------------------------+-------------------------------------------------+
```

### The 10 Core Service Departments
1. **Brand Strategy & Identity** (Archetype mapping, design tokens, visual identity systems)
2. **Product & UI/UX Design** (WCAG 2.2 AA design systems, multi-platform mobile UX, SaaS dashboards)
3. **Website & App Development** (React 19, TypeScript, TanStack Start, Node.js, PostgreSQL, Cloudflare edge)
4. **AI Solutions & Automation** (Custom RAG pipelines, n8n agent orchestration, OCR extraction)
5. **E-commerce & Growth Funnels** (Headless Shopify Plus, Paystack/Stripe multi-currency checkout)
6. **Digital Marketing & Growth** (Paid performance, server-side CAPI, programmatic SEO, retention)
7. **Content Writing & Copywriting** (Technical whitepapers, high-conversion copy, executive thought leadership)
8. **Social Media & Community** (Short-form video directing, viral cultural strategy, community governance)
9. **Video, Motion & 3D Production** (4K brand trailers, Cinema 4D/Blender 3D renders, Lottie UI motion)
10. **Data, Research & Business Support** (Pan-African market intelligence, financial modeling, PowerBI BI)

---

## B. Enterprise Role-Based Access Control (RBAC) Matrix

| User Role | Client Org Data | Talent Identity | Client Revenue / Invoices | Talent Payout / Rates | Agency Gross Margin | Communication Scope |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Full Read/Write | Full Read/Write | Full Audited Access | Full Audited Access | Visible (100%) | Global System Audits & Impersonation Logs |
| **Operations Admin** | Full Read/Write | Capacity / Skills | Scope Overview | Allocation Caps | Visible | Leads & Internal Routing |
| **Department Lead** | Dept Sprints | Dept Talents | Dept Quoting | Dept Payouts | Dept Margin | Dept Squads & PM Reviews |
| **Finance Admin** | Billing Contacts | Payout Ledgers | Invoices & Gateways | Batch Disbursements | Visible | Dual-Approval Financial Actions |
| **Project Manager** | Assigned Clients | Assigned Squads | Proposal & Scope | Task Allocations | Visible | Client Chat + Talent Chat (Isolated) |
| **Client Owner / Admin** | Own Org Only | **REDACTED / Anonymized** | Own Invoices/Receipts | **HIDDEN** | **HIDDEN** | Assigned PM Only |
| **Client Billing** | Invoices Only | **HIDDEN** | Invoices/Payments | **HIDDEN** | **HIDDEN** | Finance PM Channel |
| **Talent (All Tiers)** | **REDACTED / Code Only** | Own Profile | **HIDDEN** | Own Fixed Allocation | **HIDDEN** | Assigned PM Only |

---

## C. Core PostgreSQL Data Model & Entity Relational Schema

```sql
-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    legal_entity VARCHAR(255),
    country VARCHAR(100) NOT NULL,
    tier VARCHAR(50) DEFAULT 'Growth' CHECK (tier IN ('Growth', 'Enterprise', 'Global Sovereign')),
    billing_currency VARCHAR(10) DEFAULT 'USD' CHECK (billing_currency IN ('USD', 'NGN', 'GBP')),
    nda_signed BOOLEAN DEFAULT false,
    nda_signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Users & Identities
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    mfa_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Talents (Private Workforce)
CREATE TABLE talents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    pseudonym VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    tier VARCHAR(50) DEFAULT 'Junior' CHECK (tier IN ('Junior', 'Intermediate', 'Senior', 'Lead', 'Elite')),
    skills TEXT[] DEFAULT '{}',
    hourly_rate_internal_usd NUMERIC(10,2) NOT NULL,
    quality_score NUMERIC(3,2) DEFAULT 5.00,
    on_time_delivery_rate NUMERIC(5,2) DEFAULT 100.00,
    academy_graduate BOOLEAN DEFAULT false,
    academy_badge_title VARCHAR(255),
    verification_status VARCHAR(50) DEFAULT 'verified'
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    department_id VARCHAR(50) NOT NULL,
    assigned_pm_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL,
    client_budget_usd NUMERIC(12,2) NOT NULL,
    client_budget_ngn NUMERIC(15,2) NOT NULL,
    talent_cost_cap_usd NUMERIC(12,2) NOT NULL,
    gross_margin_pct NUMERIC(5,2) NOT NULL,
    health_score VARCHAR(20) DEFAULT 'healthy',
    start_date DATE NOT NULL,
    target_end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Milestones & Deliverables
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    client_cost_usd NUMERIC(12,2) NOT NULL,
    talent_allocation_usd NUMERIC(12,2) NOT NULL,
    assigned_talent_id UUID REFERENCES talents(id),
    status VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    qa_approved_by_pm BOOLEAN DEFAULT false,
    client_approved BOOLEAN DEFAULT false
);

-- Finance Payout Batches (Dual-Approval Protocol)
CREATE TABLE finance_payout_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_number VARCHAR(50) UNIQUE NOT NULL,
    week_ending DATE NOT NULL,
    total_amount_usd NUMERIC(12,2) NOT NULL,
    total_amount_ngn NUMERIC(15,2) NOT NULL,
    maker_approver_id UUID REFERENCES users(id) NOT NULL,
    checker_approver_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_dual_approval', 'approved', 'disbursed')),
    payout_method VARCHAR(100) NOT NULL,
    audit_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## D. Three Interactive Design Directions Evaluation

### Direction A: "Sovereign Neo-Precision" (Architectural Tech-Elegance)
- **Palette**: Obsidian Void (`#080C14`), Deep Slate (`#0F172A`), Cyber Sapphire (`#2563EB` / `#60A5FA`), Titanium Silver (`#94A3B8`).
- **Visual Feel**: High-density HUD telemetry ribbons, cryptographic verification badges, and ultra-crisp geometric sans typography.
- **Strengths**: Commands immediate technical authority with global CTOs, venture funds, and fintech scale-ups.
- **Risks**: Can feel overly futuristic or dark for conservative public sector institutions if uncalibrated.
- **Best Audience**: Fintech scale-ups, web3 protocols, venture studios, and enterprise digital transformation buyers.

### Direction B: "Pan-African Vanguard & Global Luxury" (Editorial Modern Warmth & Craft)
- **Palette**: Rich Obsidian (`#14120E`), Warm Alabaster (`#FAF8F5`), Terracotta (`#C2410C`), Burnished Ochre (`#D97706`).
- **Visual Feel**: Editorial serif titles, warm stone neutrals, bespoke storytelling quotes, and tactile craftsmanship.
- **Strengths**: Highly memorable, prestigious, and culturally resonant. Perfect for executive storytelling and luxury positioning.
- **Risks**: Lower data density on complex PM tables compared to neo-precision layouts.
- **Best Audience**: Established conglomerates, FMCG brands, luxury platforms, sovereign government bodies, diaspora investment funds.

### Direction C: "Hyper-Systemic Kinetic" (Modular Linear & Operational Speed)
- **Palette**: Stark Zinc (`#09090B`), Clean Pure (`#FFFFFF`), Electric Emerald (`#10B981`), Neon Cyan (`#06B6D4`).
- **Visual Feel**: Bento-grid ergonomics, linear keyboard-first workflows, micro-status indicators, and rapid sprint progress bars.
- **Strengths**: Maximum operational velocity, lightning-fast navigation, zero cognitive clutter.
- **Risks**: Prioritizes utility and speed over ornate marketing flair.
- **Best Audience**: Product managers, fast-moving tech scale-ups, YC/Techstars founders, and cross-functional agile squads.

---

## E. Thirteen-Stage Clickable Demo Journey

1. **Visitor Discovery**: Visitor explores work, chooses a service department, and submits a detailed proposal brief.
2. **Lead Qualification**: Admin qualifies the lead, reviews the AI brief score (94+), and routes it to the designated PM.
3. **Proposal & Quote Builder**: PM generates a formal proposal with milestone schedules, multi-currency pricing (USD/NGN), and NDA terms.
4. **Client Review & Deposit**: Client inspects proposal in Client Portal, requests minor adjustment, accepts, and funds the deposit invoice.
5. **Sprint Initialization & Talent Matching**: PM converts approved proposal into an active sprint and privately shortlists vetted talents.
6. **Talent Sprint Work**: Talent accepts private task invitation (with anonymized project code), completes work, and chats exclusively with the PM.
7. **Talent QA Submission**: Talent uploads deliverable v1.0; PM evaluates against QA checklist and requests a refinement.
8. **Deliverable v2.0**: Talent submits updated artifacts with sub-300ms latency verification and strict TypeScript validation.
9. **PM QA Sign-Off**: PM approves the QA Gate and formally pushes the deliverable package to the Client Workspace.
10. **Client Milestone Approval**: Client reviews artifacts, executes formal milestone sign-off, and receives automated settlement receipt.
11. **Finance Dual-Approval & Payout**: Finance Admin reviews earnings ledger, executes Dual-Approval (Maker/Checker), and queues NIBSS payout batch.
12. **Case Study Nomination & Publication**: Content Admin nominates project, obtains recorded client publication consent, and publishes to public work gallery.
13. **NDH Academy Decoupled Navigation**: Visitor follows the footer cross-link to NDH Academy without either product losing its separate identity or leaking LMS data.

---

## F. Strategic Suggested Additions

### 1. Essential Safeguards (Must-Have for Production)
- **PII & Margin Firewall**: Automated regex and NLP filter on all in-app chat payloads that strips email addresses, phone numbers, and raw rate mentions.
- **Dual-Approval Payout Thresholds**: Mandatory two-signature requirement for payout batches over ₦10,000,000 / $10,000.
- **Watermarked File Previews**: Automatic rasterized watermarks on unapproved draft deliverables until client milestone funding clears.

### 2. High-Value Operational Accelerations
- **Algorithmic Talent Fit Ranker**: Multi-factor scoring weighting skills, past delivery timeliness, tier rating, and timezone overlap.
- **Client Re-Order & Retainer Subscriptions**: One-click recurring sprint retainers with pre-authorized card billing via Paystack / Stripe.
- **Automated Milestone Escrow Reconciliation**: Live webhook updates connecting Paystack / Flutterwave virtual accounts to milestone unlocks.

### 3. Future Horizon Opportunities
- **NDH Sovereign Multi-Region Cloud**: Private cloud nodes in Lagos, London, and Johannesburg for sub-20ms edge delivery.
- **Cryptographic Talent Credential Ledger**: Verifiable soulbound tokens proving completed NDH Agency enterprise sprints without breaching NDAs.
- **AI-Assisted Brief Decomposition**: Automatically drafts initial user stories, milestone estimates, and test cases for PM review.

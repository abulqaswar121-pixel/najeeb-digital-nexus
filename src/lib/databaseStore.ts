import { useEffect, useState } from "react";
import {
  ServiceDepartment,
  ClientReferralRecord,
  TalentRank,
  TalentRankDetails,
  RevenueSplitBreakdown,
} from "../types/ndh";
import { TALENT_RANK_CONFIGS, calculateRevenueSplit } from "../data/mockData";

export function calculateWelcomeCreditDeduction(
  invoiceAmount: number,
  availableCredit: number,
  discountPercentage: number = 0.1, // 10%
): {
  nominalDiscount: number;
  appliedDiscount: number;
  finalPayable: number;
  remainingCredit: number;
} {
  const nominalDiscount = Math.round(invoiceAmount * discountPercentage);
  const appliedDiscount = Math.min(nominalDiscount, Math.max(0, availableCredit));
  const finalPayable = Math.max(0, invoiceAmount - appliedDiscount);
  const remainingCredit = Math.max(0, availableCredit - appliedDiscount);

  return {
    nominalDiscount,
    appliedDiscount,
    finalPayable,
    remainingCredit,
  };
}

export interface DatabaseProjectBrief {
  id: string;
  projectName: string;
  organizationName: string;
  department: ServiceDepartment;
  scopeTier: "starter" | "growth" | "enterprise";
  budgetAmount: string;
  currency: string;
  timelineWeeks: string;
  clientEmail: string;
  clientPhone?: string;
  briefDetails: string;
  status: "submitted" | "under_review" | "pm_assigned" | "in_progress" | "completed";
  assignedPM: string;
  createdAt: string;
  milestones: {
    title: string;
    percentage: number;
    status: "pending" | "in_progress" | "approved";
  }[];
}

export interface DatabaseTalentApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  primaryDepartment: ServiceDepartment;
  experienceLevel: "Junior" | "Intermediate" | "Senior" | "Lead" | "Elite";
  portfolioUrl: string;
  githubOrBehance?: string;
  hourlyRateExpectation: string;
  availableHoursPerWeek: number;
  bioNotes: string;
  status: "pending_review" | "technical_interview" | "accepted" | "rejected";
  submittedAt: string;
}

export interface DatabasePaymentTransaction {
  id: string;
  reference: string;
  gateway: "paystack" | "flutterwave" | "stripe";
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  purpose: string;
  status: "success" | "pending" | "failed";
  channel: "card" | "bank_transfer" | "ussd" | "apple_pay";
  timestamp: string;
}

export interface DatabaseBlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category:
    | "Fintech"
    | "AI & Engineering"
    | "Design Systems"
    | "Growth & Marketing"
    | "Pan-African Business";
  author: { name: string; role: string; avatarUrl: string };
  coverImage: string;
  publishedAt: string;
  readTimeMinutes: number;
  likesCount: number;
  featured: boolean;
}

export interface DatabaseAnnouncement {
  id: string;
  title: string;
  badge: string;
  actionText: string;
  actionLink: string;
  active: boolean;
}

export interface DatabaseConsultationRequest {
  id: string;
  fullName: string;
  email: string;
  preferredDate: string;
  focusArea: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

const INITIAL_REFERRALS: ClientReferralRecord[] = [
  {
    id: "ref-001",
    referrerUserId: "user-client-folake",
    referrerName: "Dr. Folake Adeleke (KoboPay)",
    referredUserName: "Adeola Adeleke (Zenith Logistics)",
    referredUserEmail: "adeola@zenithlogistics.ng",
    registeredAt: "2026-09-15",
    status: "milestone_funded",
    referredProjectTitle: "Supply Chain Tracking Dashboard & Mobile App",
    fundedAmountNGN: 2500000,
    fundedAmountUSD: 1650,
    discountAppliedNGN: 50000,
    discountAppliedUSD: 50,
    cashbackEarnedNGN: 250000,
    cashbackEarnedUSD: 165,
    fundedAt: "2026-09-18",
  },
  {
    id: "ref-002",
    referrerUserId: "user-client-folake",
    referrerName: "Dr. Folake Adeleke (KoboPay)",
    referredUserName: "Emeka Okafor (AfriCart Supermarket)",
    referredUserEmail: "emeka@africart.com",
    registeredAt: "2026-09-27",
    status: "pending_payment",
    referredProjectTitle: "E-Commerce Mobile Application",
    discountAppliedNGN: 50000,
    discountAppliedUSD: 50,
    cashbackEarnedNGN: 0,
    cashbackEarnedUSD: 0,
  },
  {
    id: "ref-003",
    referrerUserId: "usr-client-002",
    referrerName: "Engr. Dayo Lawal (Solaris Power)",
    referredUserName: "Fatima Sanusi (Kano Agro Foods)",
    referredUserEmail: "fatima@kanoagro.ng",
    registeredAt: "2026-09-10",
    status: "milestone_funded",
    referredProjectTitle: "Agro Inventory ERP & Automated Invoicing",
    fundedAmountNGN: 1800000,
    fundedAmountUSD: 1200,
    discountAppliedNGN: 50000,
    discountAppliedUSD: 50,
    cashbackEarnedNGN: 180000,
    cashbackEarnedUSD: 120,
    fundedAt: "2026-09-14",
  },
];

const INITIAL_BLOGS: DatabaseBlogArticle[] = [
  {
    id: "blog-1",
    slug: "scaling-fintech-sub-300ms-settlement-nigeria",
    title: "Engineering Sub-300ms Payment Settlement Rails in Nigeria & Pan-Africa",
    excerpt:
      "How NDH engineered resilient webhook retry queues, idempotency keys, and multi-bank fallbacks for high-concurrency payment platforms.",
    content: `When scaling fintech systems across Lagos, Nairobi, and London, network latency and erratic banking switch drops can degrade conversion rates by up to 34%. 

### 1. Dual-Path Idempotency Keys
Every transaction token is hashed using SHA-256 and stored in an in-memory Redis cluster before striking PostgreSQL transaction logs. This guarantees that duplicate debit requests during network blips are safely rejected without double-charging the customer.

### 2. Multi-Switch Payment Gateway Fallbacks
By orchestrating smart routing between Paystack, Flutterwave, and direct NIBSS FastPay settlement rails, NDH architectures achieve 99.98% successful first-try checkout completions.

### 3. Edge-First KYC & Biometric Verification
Offloading liveness checks to Cloudflare Workers edge nodes reduced client verification drop-offs from 18.4% to less than 2.1%.`,
    category: "Fintech",
    author: {
      name: "Tunde Bakare",
      role: "VP of Technology & Engineering",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    coverImage:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=900&auto=format&fit=crop&q=80",
    publishedAt: "2026-09-24",
    readTimeMinutes: 5,
    likesCount: 142,
    featured: true,
  },
  {
    id: "blog-2",
    slug: "why-managed-bureaus-beat-freelancer-marketplaces",
    title: "Why High-Growth Startups Are Abandoning Freelance Marketplaces for Managed Bureaus",
    excerpt:
      "The hidden cost of freelance coordination chaos, zero QA governance, and IP leakage — and how the dedicated PM bureau model solves it.",
    content: `Hiring 5 independent freelancers across Fiverr and Upwork frequently turns founders into stressed-out, non-technical project managers.

### The True Cost of Freelancer Coordination
- **Fragmented Codebases**: No unified git branch strategy or CI/CD pipelines.
- **Ghosting Risk**: 42% of direct freelance engagements experience mid-sprint abandoned deliveries.
- **Zero SLA Protection**: No financial escrow or dual-approval sign-off.

### The NDH Bureau Advantage
NDH places an enterprise Project Manager as a contractual buffer layer. Talents execute pure technical tickets, PMs enforce automated QA gates, and clients receive guaranteed delivery.`,
    category: "Pan-African Business",
    author: {
      name: "Najeeb Al-Hassan",
      role: "Founder & Principal Brand Director",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    coverImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
    publishedAt: "2026-09-20",
    readTimeMinutes: 4,
    likesCount: 98,
    featured: true,
  },
  {
    id: "blog-3",
    slug: "low-bandwidth-ai-automation-workflows",
    title: "Deploying Low-Bandwidth AI & Autonomous Agents for Emerging Markets",
    excerpt:
      "Optimizing token caching, vector quantization, and WhatsApp CRM agents for low-latency operational efficiency.",
    content: `Generative AI tools often assume Gigabit fiber connections. In emerging markets, building resilient AI workflows requires low-bandwidth thinking.

### Vector Quantization & Semantic Caching
By implementing semantic caching on repeated customer queries, we reduced API token costs by 72% and lowered latency from 3.2s to 420ms on mobile 3G/4G connections.

### WhatsApp CRM Agents
Automating Tier-1 customer triage on WhatsApp using self-hosted n8n and localized multilingual models (English, Yoruba, Hausa, Igbo).`,
    category: "AI & Engineering",
    author: {
      name: "Dr. Fatima Bello",
      role: "Lead AI & Automation Architect",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
    publishedAt: "2026-09-15",
    readTimeMinutes: 6,
    likesCount: 115,
    featured: false,
  },
];

// Lightweight pub/sub so React components can subscribe to store changes and
// re-render when new data arrives (e.g. a client submits a brief while a PM
// or Admin has the portal open). This does NOT make the store a real
// database -- it is still just an in-memory + localStorage wrapper with no
// server of record -- but it at least makes the UI reflect the data that
// *is* being captured, instead of silently ignoring it.
type StoreListener = () => void;
const storeListeners = new Set<StoreListener>();

function notifyStoreListeners() {
  storeListeners.forEach((l) => l());
}

export function subscribeToDatabase(listener: StoreListener): () => void {
  storeListeners.add(listener);
  return () => storeListeners.delete(listener);
}

// Also react to changes made in *other* browser tabs (e.g. a visitor submits
// a brief on the public site in one tab while a PM has the portal open in
// another). This is a best-effort convenience for the demo, not a real
// multi-user sync mechanism.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key && e.key.startsWith("ndh_db_")) {
      notifyStoreListeners();
    }
  });
}

class NDHDatabaseService {
  private briefs: DatabaseProjectBrief[] = [];
  private applications: DatabaseTalentApplication[] = [];
  private transactions: DatabasePaymentTransaction[] = [];
  private consultationRequests: DatabaseConsultationRequest[] = [];
  private referrals: ClientReferralRecord[] = INITIAL_REFERRALS;
  private blogs: DatabaseBlogArticle[] = INITIAL_BLOGS;
  private announcement: DatabaseAnnouncement = {
    id: "ann-01",
    title:
      "⚡ Q4 Digital Transformation Special: Free Technical Discovery & PM Consultation for All New Projects",
    badge: "SPECIAL OFFER",
    actionText: "Claim Free Brief Scope",
    actionLink: "#estimator",
    active: true,
  };

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const savedBriefs = localStorage.getItem("ndh_db_briefs");
        if (savedBriefs) this.briefs = JSON.parse(savedBriefs);

        const savedApps = localStorage.getItem("ndh_db_applications");
        if (savedApps) this.applications = JSON.parse(savedApps);

        const savedTx = localStorage.getItem("ndh_db_transactions");
        if (savedTx) this.transactions = JSON.parse(savedTx);

        const savedConsults = localStorage.getItem("ndh_db_consultation_requests");
        if (savedConsults) this.consultationRequests = JSON.parse(savedConsults);

        const savedRefs = localStorage.getItem("ndh_db_referrals");
        if (savedRefs) this.referrals = JSON.parse(savedRefs);
      } catch (e) {
        console.warn("Database initialization warning:", e);
      }
    }
  }

  // --- BRIEFS / PROPOSALS ---
  public createBrief(
    data: Omit<DatabaseProjectBrief, "id" | "status" | "assignedPM" | "createdAt" | "milestones">,
  ): DatabaseProjectBrief {
    const newBrief: DatabaseProjectBrief = {
      ...data,
      id: `brief-${Date.now()}`,
      status: "submitted",
      assignedPM: "Tariq Al-Najeeb (Principal PM)",
      createdAt: new Date().toISOString(),
      milestones: [
        { title: "Milestone 1: Discovery & Architecture", percentage: 20, status: "in_progress" },
        { title: "Milestone 2: Core Engineering & Staging", percentage: 60, status: "pending" },
        { title: "Milestone 3: QA, Security & IP Handover", percentage: 20, status: "pending" },
      ],
    };
    this.briefs.unshift(newBrief);
    this.persist("ndh_db_briefs", this.briefs);
    notifyStoreListeners();
    return newBrief;
  }

  public getBriefs(): DatabaseProjectBrief[] {
    return this.briefs;
  }

  // --- DISCOVERY CONSULTATION REQUESTS ---
  public createConsultationRequest(
    data: Omit<DatabaseConsultationRequest, "id" | "status" | "createdAt">,
  ): DatabaseConsultationRequest {
    const newRequest: DatabaseConsultationRequest = {
      ...data,
      id: `consult-${Date.now()}`,
      status: "requested",
      createdAt: new Date().toISOString(),
    };
    this.consultationRequests.unshift(newRequest);
    this.persist("ndh_db_consultation_requests", this.consultationRequests);
    notifyStoreListeners();
    return newRequest;
  }

  public getConsultationRequests(): DatabaseConsultationRequest[] {
    return this.consultationRequests;
  }

  // --- TALENT APPLICATIONS ---
  public submitTalentApplication(
    data: Omit<DatabaseTalentApplication, "id" | "status" | "submittedAt">,
  ): DatabaseTalentApplication {
    const newApp: DatabaseTalentApplication = {
      ...data,
      id: `app-${Date.now()}`,
      status: "pending_review",
      submittedAt: new Date().toISOString(),
    };
    this.applications.unshift(newApp);
    this.persist("ndh_db_applications", this.applications);
    notifyStoreListeners();
    return newApp;
  }

  public getTalentApplications(): DatabaseTalentApplication[] {
    return this.applications;
  }

  // --- CLIENT REFERRALS ---
  public getReferrals(): ClientReferralRecord[] {
    return this.referrals;
  }

  public getReferralsByReferrer(referrerUserId: string): ClientReferralRecord[] {
    return this.referrals.filter((r) => r.referrerUserId === referrerUserId);
  }

  public createReferral(
    data: Omit<
      ClientReferralRecord,
      "id" | "registeredAt" | "status" | "cashbackEarnedNGN" | "cashbackEarnedUSD"
    >,
  ): ClientReferralRecord {
    const newRef: ClientReferralRecord = {
      ...data,
      id: `ref-${Date.now()}`,
      registeredAt: new Date().toISOString().split("T")[0] || "2026-09-29",
      status: "pending_payment",
      cashbackEarnedNGN: 0,
      cashbackEarnedUSD: 0,
    };
    this.referrals.unshift(newRef);
    this.persist("ndh_db_referrals", this.referrals);
    notifyStoreListeners();
    return newRef;
  }

  /**
   * Strict Referral Validation: Discount is ONLY unlocked when the referred client makes their first escrow payment.
   */
  public triggerReferralMilestoneFunding(
    referralId: string,
    paidAmountNGN: number,
    paidAmountUSD: number,
  ): ClientReferralRecord | null {
    const ref = this.referrals.find((r) => r.id === referralId);
    if (!ref) return null;

    ref.status = "milestone_funded";
    ref.fundedAmountNGN = paidAmountNGN;
    ref.fundedAmountUSD = paidAmountUSD;
    // 10% cashback earned by the referrer once funded
    ref.cashbackEarnedNGN = Math.round(paidAmountNGN * 0.1);
    ref.cashbackEarnedUSD = Math.round(paidAmountUSD * 0.1);
    ref.fundedAt = new Date().toISOString().split("T")[0] ?? "2026-09-30";

    this.persist("ndh_db_referrals", this.referrals);
    notifyStoreListeners();
    return ref;
  }

  // --- REVENUE SPLIT & PROFIT SHARING CALCULATION ---
  public getRevenueSplit(
    amountNGN: number,
    amountUSD: number,
    isHybridPMTalent: boolean = false,
  ): RevenueSplitBreakdown {
    return calculateRevenueSplit(amountNGN, amountUSD, isHybridPMTalent);
  }

  // --- PAYMENTS & GATEWAYS ---
  public recordTransaction(
    data: Omit<DatabasePaymentTransaction, "id" | "reference" | "timestamp">,
  ): DatabasePaymentTransaction {
    const newTx: DatabasePaymentTransaction = {
      ...data,
      id: `tx-${Date.now()}`,
      reference: `NDH-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
    };
    this.transactions.unshift(newTx);
    this.persist("ndh_db_transactions", this.transactions);
    notifyStoreListeners();
    return newTx;
  }

  public getTransactions(): DatabasePaymentTransaction[] {
    return this.transactions;
  }

  // --- BLOGS ---
  public getBlogs(): DatabaseBlogArticle[] {
    return this.blogs;
  }

  public getBlogBySlug(slug: string): DatabaseBlogArticle | undefined {
    return this.blogs.find((b) => b.slug === slug);
  }

  public likeBlog(id: string): void {
    const blog = this.blogs.find((b) => b.id === id);
    if (blog) blog.likesCount += 1;
  }

  // --- ANNOUNCEMENT ---
  public getAnnouncement(): DatabaseAnnouncement {
    return this.announcement;
  }

  public setAnnouncementActive(active: boolean): void {
    this.announcement.active = active;
    notifyStoreListeners();
  }

  private persist(key: string, data: unknown) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.warn("Persistence error:", e);
      }
    }
  }
}

export const dbService = new NDHDatabaseService();

// --- REACT HOOKS ---
// These give components a live view of the store that updates automatically
// when new data arrives (same tab or another tab), instead of the previous
// pattern of calling dbService.getX() once in a useState initializer and
// never seeing anything submitted afterwards.
export function useBriefs(): DatabaseProjectBrief[] {
  const [briefs, setBriefs] = useState<DatabaseProjectBrief[]>(dbService.getBriefs());
  useEffect(() => subscribeToDatabase(() => setBriefs([...dbService.getBriefs()])), []);
  return briefs;
}

export function useConsultationRequests(): DatabaseConsultationRequest[] {
  const [requests, setRequests] = useState<DatabaseConsultationRequest[]>(
    dbService.getConsultationRequests(),
  );
  useEffect(
    () => subscribeToDatabase(() => setRequests([...dbService.getConsultationRequests()])),
    [],
  );
  return requests;
}

export function useTalentApplications(): DatabaseTalentApplication[] {
  const [apps, setApps] = useState<DatabaseTalentApplication[]>(dbService.getTalentApplications());
  useEffect(() => subscribeToDatabase(() => setApps([...dbService.getTalentApplications()])), []);
  return apps;
}

export function useTransactions(): DatabasePaymentTransaction[] {
  const [transactions, setTransactions] = useState<DatabasePaymentTransaction[]>(
    dbService.getTransactions(),
  );
  useEffect(() => subscribeToDatabase(() => setTransactions([...dbService.getTransactions()])), []);
  return transactions;
}

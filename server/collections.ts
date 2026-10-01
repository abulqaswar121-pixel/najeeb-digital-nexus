import bcrypt from "bcryptjs";
import { Collection, SingletonRecord } from "./db.js";
import type {
  UserRole,
  UserSession,
  TalentProfile,
  ServiceDepartment,
  ClientReferralRecord,
} from "../src/types/ndh.js";

// ============================================================================
// USERS
// ============================================================================

export interface UserRecord extends UserSession {
  passwordHash: string;
}

export function toPublicUser(user: UserRecord): UserSession {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

// Passwords are hashed at boot (see seed.ts) -- this module only declares the
// shape of the seed accounts; hashPassword() is applied once when the
// collection is first created.
export interface SeedAccount extends Omit<UserRecord, "passwordHash"> {
  plainPassword: string;
}

export const DEMO_ACCOUNT_PASSWORD = "NDHDemo2026!";

export const SEED_ACCOUNTS: SeedAccount[] = [
  {
    id: "user-client-folake",
    fullName: "Dr. Folake Adeleke",
    email: "folake@kobopay.com",
    plainPassword: DEMO_ACCOUNT_PASSWORD,
    role: "client_owner",
    roleTitle: "Chief Product Officer (Client Owner)",
    organizationId: "org-kobopay",
    organizationName: "KoboPay Global Inc.",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    isDemoAccount: true,
    loyaltyTier: "Gold Enterprise",
    referralCode: "FOLAKE-NDH-2026",
    referralCredits: 250000,
    welcomeCreditBalanceNGN: 20000,
    welcomeCreditBalanceUSD: 20,
    welcomeCreditUsedNGN: 30000,
    welcomeCreditUsedUSD: 30,
    activeProjectsCount: 2,
    country: "Nigeria",
    phone: "+234 803 123 4567",
  },
  {
    id: "user-pm-tariq",
    fullName: "Tariq Al-Najeeb",
    email: "tariq.pm@agency.ndh.com.ng",
    plainPassword: DEMO_ACCOUNT_PASSWORD,
    role: "project_manager",
    roleTitle: "Principal Project Manager",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isDemoAccount: true,
    country: "Nigeria",
  },
  {
    id: "user-talent-alpha",
    fullName: "Oluwaseun Adedipe (Architect-Alpha)",
    email: "alpha.dev@network.ndh.com.ng",
    plainPassword: DEMO_ACCOUNT_PASSWORD,
    role: "talent",
    roleTitle: "Elite Full-Stack Squad Leader",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    isDemoAccount: true,
    country: "Nigeria",
  },
  {
    id: "user-super-najeeb",
    fullName: "Najeeb Al-Hassan",
    email: "najeeb@ndh.com.ng",
    plainPassword: DEMO_ACCOUNT_PASSWORD,
    role: "super_admin",
    roleTitle: "Managing Director & Super Admin",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    isDemoAccount: true,
    country: "Nigeria",
  },
  {
    // Second, DIFFERENT finance signer -- this account existing is what makes
    // the payout dual-approval control a real maker-checker control instead
    // of one person clicking a button twice. See server/routes/payouts.ts.
    id: "user-finance-amina",
    fullName: "Amina Yusuf",
    email: "amina.finance@ndh.com.ng",
    plainPassword: DEMO_ACCOUNT_PASSWORD,
    role: "finance_admin",
    roleTitle: "Finance Lead",
    avatarUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
    isDemoAccount: true,
    country: "Nigeria",
  },
];

// ============================================================================
// TALENTS
// ============================================================================

// Links a seeded talent record to the demo user account that can log in and
// see their own full (internal) profile via GET /api/talents/me.
export const TALENT_USER_LINKS: Record<string, string> = {
  "tal-001": "user-talent-alpha",
};

export interface PublicTalentProfile {
  id: string;
  pseudonym: string;
  department: ServiceDepartment;
  tier: TalentProfile["tier"];
  rank: TalentProfile["rank"];
  location: string;
  timezone: string;
  skills: string[];
  tools: string[];
  completedProjects: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  qaPercentageScore: number;
  activeTasks: number;
  academyGraduate: boolean;
  academyBadgeTitle?: string;
  academyCohort?: string;
  verificationStatus: TalentProfile["verificationStatus"];
  avatarUrl: string;
  bio: string;
}

export function toPublicTalent(t: TalentProfile): PublicTalentProfile {
  return {
    id: t.id,
    pseudonym: t.pseudonym,
    department: t.department,
    tier: t.tier,
    rank: t.rank,
    location: t.location,
    timezone: t.timezone,
    skills: t.skills,
    tools: t.tools,
    completedProjects: t.completedProjects,
    onTimeDeliveryRate: t.onTimeDeliveryRate,
    qualityScore: t.qualityScore,
    qaPercentageScore: t.qaPercentageScore,
    activeTasks: t.activeTasks,
    academyGraduate: t.academyGraduate,
    ...(t.academyBadgeTitle ? { academyBadgeTitle: t.academyBadgeTitle } : {}),
    ...(t.academyCohort ? { academyCohort: t.academyCohort } : {}),
    verificationStatus: t.verificationStatus,
    avatarUrl: t.avatarUrl,
    bio: t.bio,
    // Deliberately omitted: fullName, hourlyRateInternalUSD, totalEarnedUSD,
    // totalEarnedNGN, bonusMultiplier, ndaSigned, isDualRolePM,
    // managedProjectsCount, bankDetails. This is the actual fix for the
    // confirmed data leak: these fields now never leave the server unless
    // the request is authenticated as project_manager/super_admin/the
    // talent themselves.
  };
}

const SEED_TALENTS: TalentProfile[] = [
  {
    id: "tal-001",
    pseudonym: "Architect-Alpha",
    fullName: "Oluwaseun Adedipe",
    department: "web_app_development",
    tier: "Elite",
    rank: "Diamond Principal",
    location: "Lagos, Nigeria",
    timezone: "GMT+1",
    skills: [
      "TypeScript",
      "React 19",
      "TanStack Start",
      "PostgreSQL",
      "Cloudflare Workers",
      "Distributed Systems",
    ],
    tools: ["VS Code", "Docker", "Postman", "GitLab", "Datadog"],
    completedProjects: 34,
    onTimeDeliveryRate: 99.4,
    qualityScore: 4.98,
    qaPercentageScore: 99.6,
    bonusMultiplier: 1.15,
    activeTasks: 2,
    hourlyRateInternalUSD: 65,
    totalEarnedUSD: 38200,
    totalEarnedNGN: 57300000,
    academyGraduate: true,
    academyBadgeTitle: "NDH Academy Certified Full-Stack Master",
    academyCohort: "Cohort 2025-A",
    verificationStatus: "verified",
    ndaSigned: true,
    isDualRolePM: true,
    managedProjectsCount: 8,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Specialist in low-latency financial systems and clean architecture TypeScript applications. Dual-role appointed PM.",
    bankDetails: {
      bankName: "Access Bank PLC",
      accountNumber: "0129849201",
      accountName: "Oluwaseun Adedipe",
    },
  },
  {
    id: "tal-002",
    pseudonym: "Pixel-Prime",
    fullName: "Chioma Eze",
    department: "ui_ux_design",
    tier: "Lead",
    rank: "Gold Master",
    location: "Abuja, Nigeria",
    timezone: "GMT+1",
    skills: [
      "Figma System Architecture",
      "WCAG 2.2 AA Auditing",
      "Fintech Design Systems",
      "Micro-Interactions",
    ],
    tools: ["Figma", "Tokens Studio", "Protopie", "Maze"],
    completedProjects: 21,
    onTimeDeliveryRate: 98.8,
    qualityScore: 4.96,
    qaPercentageScore: 97.2,
    bonusMultiplier: 1.1,
    activeTasks: 1,
    hourlyRateInternalUSD: 55,
    totalEarnedUSD: 29400,
    totalEarnedNGN: 44100000,
    academyGraduate: true,
    academyBadgeTitle: "NDH Academy Product Design Fellow",
    academyCohort: "Cohort 2024-C",
    verificationStatus: "verified",
    ndaSigned: true,
    isDualRolePM: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bio: "Lead UX designer with extensive experience across multi-currency remittances and biometric KYC onboarding.",
    bankDetails: {
      bankName: "Guaranty Trust Bank (GTBank)",
      accountNumber: "0238491028",
      accountName: "Chioma Eze",
    },
  },
  {
    id: "tal-003",
    pseudonym: "Neural-Craft",
    fullName: "Farouk Al-Mansoor",
    department: "ai_automation",
    tier: "Senior",
    rank: "Silver Artisan",
    location: "Kano, Nigeria",
    timezone: "GMT+1",
    skills: [
      "LLM Orchestration",
      "n8n Enterprise Automation",
      "RAG Embeddings",
      "FastAPI",
      "Python",
    ],
    tools: ["Python", "LangChain", "Pinecone", "Docker", "OpenAI"],
    completedProjects: 14,
    onTimeDeliveryRate: 99.0,
    qualityScore: 4.92,
    qaPercentageScore: 94.5,
    bonusMultiplier: 1.05,
    activeTasks: 1,
    hourlyRateInternalUSD: 50,
    totalEarnedUSD: 21500,
    totalEarnedNGN: 32250000,
    academyGraduate: false,
    verificationStatus: "verified",
    ndaSigned: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "AI pipeline specialist integrating structured data extraction and autonomous business agent tools.",
    bankDetails: {
      bankName: "Zenith Bank PLC",
      accountNumber: "2119384920",
      accountName: "Farouk Al-Mansoor",
    },
  },
  {
    id: "tal-004",
    pseudonym: "Brand-Vanguard",
    fullName: "Zainab Bello",
    department: "brand_strategy",
    tier: "Lead",
    rank: "Gold Master",
    location: "London, UK / Lagos",
    timezone: "GMT",
    skills: [
      "Brand Identity",
      "Custom Typography",
      "Packaging Design",
      "Sovereign Brand Guidelines",
    ],
    tools: ["Adobe Illustrator", "Photoshop", "InDesign", "FontLab"],
    completedProjects: 22,
    onTimeDeliveryRate: 98.5,
    qualityScore: 4.97,
    qaPercentageScore: 98.0,
    bonusMultiplier: 1.1,
    activeTasks: 1,
    hourlyRateInternalUSD: 60,
    totalEarnedUSD: 34100,
    totalEarnedNGN: 51150000,
    academyGraduate: true,
    academyBadgeTitle: "NDH Academy Brand Identity Specialist",
    academyCohort: "Cohort 2024-A",
    verificationStatus: "verified",
    ndaSigned: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    bio: "Brand architect crafting bold cultural identities for modern African fintechs and luxury lifestyle platforms.",
    bankDetails: {
      bankName: "Standard Chartered Bank",
      accountNumber: "0039482910",
      accountName: "Zainab Bello",
    },
  },
  {
    id: "tal-005",
    pseudonym: "Growth-Matrix",
    fullName: "Babatunde Fash",
    department: "digital_marketing",
    tier: "Senior",
    rank: "Silver Artisan",
    location: "Lagos, Nigeria",
    timezone: "GMT+1",
    skills: [
      "Conversion Rate Optimization",
      "Meta CAPI",
      "Google Ads Smart Bidding",
      "PostHog Analytics",
    ],
    tools: ["Google Tag Manager", "Mixpanel", "Looker Studio", "Klaviyo"],
    completedProjects: 16,
    onTimeDeliveryRate: 97.9,
    qualityScore: 4.89,
    qaPercentageScore: 92.4,
    bonusMultiplier: 1.05,
    activeTasks: 2,
    hourlyRateInternalUSD: 45,
    totalEarnedUSD: 18900,
    totalEarnedNGN: 28350000,
    academyGraduate: false,
    verificationStatus: "verified",
    ndaSigned: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Performance marketing and CAPI infrastructure architect driving qualified enterprise leads.",
    bankDetails: {
      bankName: "United Bank for Africa (UBA)",
      accountNumber: "1029384819",
      accountName: "Babatunde Fash",
    },
  },
  {
    id: "tal-006",
    pseudonym: "Motion-Forge",
    fullName: "Kelechi Nwosu",
    department: "video_media",
    tier: "Senior",
    rank: "Bronze Prodigy",
    location: "Port Harcourt, Nigeria",
    timezone: "GMT+1",
    skills: ["After Effects", "Cinema 4D", "3D Spline", "Sound Design"],
    tools: ["After Effects", "Premiere Pro", "Spline 3D", "Blender"],
    completedProjects: 4,
    onTimeDeliveryRate: 98.2,
    qualityScore: 4.94,
    qaPercentageScore: 89.0,
    bonusMultiplier: 1.0,
    activeTasks: 1,
    hourlyRateInternalUSD: 50,
    totalEarnedUSD: 6400,
    totalEarnedNGN: 9600000,
    academyGraduate: false,
    verificationStatus: "verified",
    ndaSigned: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    bio: "Cinema-grade motion artist creating slick 3D product previews and UI animation systems.",
    bankDetails: {
      bankName: "First Bank of Nigeria",
      accountNumber: "3029184719",
      accountName: "Kelechi Nwosu",
    },
  },
  {
    id: "tal-007",
    pseudonym: "Copy-Craft",
    fullName: "Aisha Garba",
    department: "content_copywriting",
    tier: "Intermediate",
    rank: "Silver Artisan",
    location: "Kaduna, Nigeria",
    timezone: "GMT+1",
    skills: [
      "Conversion Copywriting",
      "Whitepaper Research",
      "Brand Tone Alignment",
      "SEO Markdown",
    ],
    tools: ["Notion", "Clearscope", "SurferSEO"],
    completedProjects: 11,
    onTimeDeliveryRate: 98.0,
    qualityScore: 4.88,
    qaPercentageScore: 91.5,
    bonusMultiplier: 1.05,
    activeTasks: 1,
    hourlyRateInternalUSD: 35,
    totalEarnedUSD: 11200,
    totalEarnedNGN: 16800000,
    academyGraduate: true,
    academyBadgeTitle: "NDH Academy Creative Copywriting Diploma",
    academyCohort: "Cohort 2025-C",
    verificationStatus: "verified",
    ndaSigned: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    bio: "High-clarity technical and conversion copywriter for enterprise SaaS and finance products.",
    bankDetails: {
      bankName: "Fidelity Bank PLC",
      accountNumber: "5029183921",
      accountName: "Aisha Garba",
    },
  },
  {
    id: "tal-008",
    pseudonym: "Commerce-Architect",
    fullName: "Dayo Adebayo",
    department: "ecommerce",
    tier: "Senior",
    rank: "Gold Master",
    location: "Ibadan, Nigeria",
    timezone: "GMT+1",
    skills: [
      "Shopify Liquid Masters",
      "Next.js Headless Commerce",
      "Paystack Multi-Currency",
      "ERP Sync",
    ],
    tools: ["Shopify CLI", "Tailwind", "Stripe API", "GraphQL"],
    completedProjects: 18,
    onTimeDeliveryRate: 99.1,
    qualityScore: 4.93,
    qaPercentageScore: 96.8,
    bonusMultiplier: 1.1,
    activeTasks: 1,
    hourlyRateInternalUSD: 50,
    totalEarnedUSD: 27800,
    totalEarnedNGN: 41700000,
    academyGraduate: true,
    academyBadgeTitle: "NDH Academy E-commerce Engineer",
    academyCohort: "Cohort 2024-B",
    verificationStatus: "verified",
    ndaSigned: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    bio: "Specialist in custom Shopify themes and multi-region payment routing.",
    bankDetails: {
      bankName: "Kuda Microfinance Bank",
      accountNumber: "2019283719",
      accountName: "Dayo Adebayo",
    },
  },
  {
    id: "tal-009",
    pseudonym: "Data-Pulse",
    fullName: "Musa Abdullahi",
    department: "data_business",
    tier: "Senior",
    rank: "Silver Artisan",
    location: "Abuja, Nigeria",
    timezone: "GMT+1",
    skills: ["Financial Modeling", "Market Sizing", "PowerBI Dashboards", "dbt Data Modeling"],
    tools: ["Python", "Tableau", "Snowflake", "Excel VBA"],
    completedProjects: 13,
    onTimeDeliveryRate: 100.0,
    qualityScore: 4.95,
    qaPercentageScore: 94.0,
    bonusMultiplier: 1.05,
    activeTasks: 1,
    hourlyRateInternalUSD: 48,
    totalEarnedUSD: 19600,
    totalEarnedNGN: 29400000,
    academyGraduate: false,
    verificationStatus: "verified",
    ndaSigned: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    bio: "Economic research analyst building automated financial forecasts and market viability models.",
    bankDetails: {
      bankName: "Stanbic IBTC Bank",
      accountNumber: "0029183921",
      accountName: "Musa Abdullahi",
    },
  },
  {
    id: "tal-010",
    pseudonym: "Social-Signal",
    fullName: "Ngozi Obi",
    department: "social_media",
    tier: "Intermediate",
    rank: "Silver Artisan",
    location: "Enugu, Nigeria",
    timezone: "GMT+1",
    skills: [
      "Viral Content Strategy",
      "Short-Form Video Directing",
      "Community Governance",
      "X Strategy",
    ],
    tools: ["CapCut", "Sprout Social", "Canva Pro", "Figma"],
    completedProjects: 12,
    onTimeDeliveryRate: 97.5,
    qualityScore: 4.87,
    qaPercentageScore: 91.0,
    bonusMultiplier: 1.05,
    activeTasks: 1,
    hourlyRateInternalUSD: 35,
    totalEarnedUSD: 12400,
    totalEarnedNGN: 18600000,
    academyGraduate: true,
    academyBadgeTitle: "NDH Academy Social Strategist",
    academyCohort: "Cohort 2025-A",
    verificationStatus: "verified",
    ndaSigned: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bio: "Cultural strategist shaping high-resonance social engagement campaigns across West Africa.",
    bankDetails: {
      bankName: "Wema Bank PLC / ALAT",
      accountNumber: "0192837482",
      accountName: "Ngozi Obi",
    },
  },
  {
    id: "tal-011",
    pseudonym: "Cloud-Sentinel",
    fullName: "Emmanuel Bassey",
    department: "web_app_development",
    tier: "Senior",
    rank: "Gold Master",
    location: "Calabar, Nigeria",
    timezone: "GMT+1",
    skills: [
      "PostgreSQL Performance Tuning",
      "Cloudflare Edge Workers",
      "Docker",
      "OAuth2 Security",
    ],
    tools: ["Docker", "AWS", "Terraform", "Supabase"],
    completedProjects: 17,
    onTimeDeliveryRate: 98.9,
    qualityScore: 4.91,
    qaPercentageScore: 95.5,
    bonusMultiplier: 1.1,
    activeTasks: 1,
    hourlyRateInternalUSD: 52,
    totalEarnedUSD: 26100,
    totalEarnedNGN: 39150000,
    academyGraduate: true,
    academyBadgeTitle: "NDH Academy Cloud Architecture Lead",
    academyCohort: "Cohort 2024-A",
    verificationStatus: "verified",
    ndaSigned: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    bio: "DevOps and cloud engineer ensuring sub-50ms latency across global edge networks.",
    bankDetails: {
      bankName: "Sterling Bank PLC",
      accountNumber: "0039281920",
      accountName: "Emmanuel Bassey",
    },
  },
  {
    id: "tal-012",
    pseudonym: "Visual-Maestro",
    fullName: "Tariq Suleiman",
    department: "ui_ux_design",
    tier: "Junior",
    rank: "Bronze Prodigy",
    location: "Zaria, Nigeria",
    timezone: "GMT+1",
    skills: ["Interactive Prototypes", "Responsive Layouts", "Icon Sets", "Figma Variants"],
    tools: ["Figma", "Illustrator", "FigJam"],
    completedProjects: 7,
    onTimeDeliveryRate: 100.0,
    qualityScore: 4.86,
    qaPercentageScore: 88.5,
    bonusMultiplier: 1.0,
    activeTasks: 1,
    hourlyRateInternalUSD: 28,
    totalEarnedUSD: 6800,
    totalEarnedNGN: 10200000,
    academyGraduate: true,
    academyBadgeTitle: "NDH Academy Valedictorian UI Track",
    academyCohort: "Cohort 2025-B",
    verificationStatus: "verified",
    ndaSigned: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    bio: "Rising UI design talent with pixel-perfect attention to detail and design token mastery.",
    bankDetails: {
      bankName: "Jaiz Bank PLC",
      accountNumber: "0182938471",
      accountName: "Tariq Suleiman",
    },
  },
];

// ============================================================================
// REFERRALS (seed data carried over from the previous client-only store)
// ============================================================================

const SEED_REFERRALS: ClientReferralRecord[] = [
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

// ============================================================================
// BRIEFS / CONSULTATIONS / APPLICATIONS / TRANSACTIONS
// ============================================================================

export interface BriefRecord {
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
  submittedByUserId?: string;
}

export interface ConsultationRequestRecord {
  id: string;
  fullName: string;
  email: string;
  preferredDate: string;
  focusArea: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface TalentApplicationRecord {
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

export interface TransactionRecord {
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
  verifiedByGateway: boolean; // true only if a real Paystack verify call confirmed it
  createdByUserId?: string;
}

export interface PayoutApproval {
  userId: string;
  userName: string;
  role: UserRole;
  signedAt: string;
}

export interface PayoutBatchRecord {
  id: string;
  label: string;
  totalNGN: number;
  approvals: PayoutApproval[];
  disbursed: boolean;
  disbursedAt?: string;
}

export interface ProjectApprovalRecord {
  projectId: string;
  milestoneIndex: number;
  qaApproved: boolean;
  qaApprovedByUserId?: string;
  qaApprovedByName?: string;
  qaApprovedAt?: string;
  milestoneApproved: boolean;
  milestoneApprovedByUserId?: string;
  milestoneApprovedByName?: string;
  milestoneApprovedAt?: string;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  badge: string;
  actionText: string;
  actionLink: string;
  active: boolean;
}

// ============================================================================
// COLLECTIONS (persisted to server/data/*.json)
// ============================================================================

export const users = new Collection<UserRecord>(
  "users",
  SEED_ACCOUNTS.map(({ plainPassword, ...rest }) => ({
    ...rest,
    // Real bcrypt hashing of the seed password (not a shortcut/lookup table)
    // -- verified via bcrypt.compare() at login time in server/auth.ts.
    passwordHash: bcrypt.hashSync(plainPassword, 10),
  })),
);

export const talents = new Collection<TalentProfile>("talents", SEED_TALENTS);

export const briefs = new Collection<BriefRecord>("briefs", []);

export const consultationRequests = new Collection<ConsultationRequestRecord>(
  "consultationRequests",
  [],
);

export const talentApplications = new Collection<TalentApplicationRecord>("talentApplications", []);

export const transactions = new Collection<TransactionRecord>("transactions", []);

export const referrals = new Collection<ClientReferralRecord>("referrals", SEED_REFERRALS);

export const payoutBatches = new Collection<PayoutBatchRecord>("payoutBatches", [
  {
    id: "batch-2026-10-01",
    label: "Bi-Weekly Payout Batch — Oct 1, 2026",
    totalNGN: 14850000,
    approvals: [],
    disbursed: false,
  },
]);

export const projectApprovals = new Collection<ProjectApprovalRecord>("projectApprovals", []);

export const announcement = new SingletonRecord<AnnouncementRecord>("announcement", {
  id: "ann-01",
  title:
    "⚡ Q4 Digital Transformation Special: Free Technical Discovery & PM Consultation for All New Projects",
  badge: "SPECIAL OFFER",
  actionText: "Claim Free Brief Scope",
  actionLink: "#estimator",
  active: true,
});

import {
  BarChart3,
  Bot,
  Code,
  CreditCard,
  Layout,
  PenTool,
  Search,
  Server,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { ServiceDepartment } from "../types/ndh";
import { SERVICE_DEPARTMENTS } from "./mockData";

/**
 * Presentation profile for each of the agency's 16 service departments.
 *
 * The heavy commercial record (deliverables, tech stack, pricing) lives in
 * `SERVICE_DEPARTMENTS`; this module adds the short, human-facing layer the
 * Academy-grade marketing surfaces need: a compact marquee label, the sector
 * icon, and a two-line practical scope summary.
 *
 * `shortName` for the first four departments deliberately matches the Academy's
 * own service vocabulary (UI/UX Design, AI Automation, Web App Development,
 * Cloud DevOps, Cybersecurity …) so the two sites describe the same catalogue
 * in the same words.
 */
export interface DepartmentProfile {
  id: ServiceDepartment;
  /** Compact label used by the continuous services marquee. */
  shortName: string;
  /** Two-line practical scope summary for the department card. */
  scope: string;
  icon: LucideIcon;
}

export const DEPARTMENT_PROFILES: DepartmentProfile[] = [
  {
    id: "ui_ux_design",
    shortName: "UI/UX Design",
    scope:
      "Research-led product design: wireframes, clickable prototypes and WCAG-checked design systems.",
    icon: Layout,
  },
  {
    id: "ai_automation",
    shortName: "AI Automation",
    scope:
      "Agents and workflow automation wired into your real tools — fewer manual handoffs, measurable hours back.",
    icon: Bot,
  },
  {
    id: "web_app_development",
    shortName: "Web App Development",
    scope:
      "Custom web platforms and dashboards, built to production standards with a clean Git handoff.",
    icon: Code,
  },
  {
    id: "cloud_devops",
    shortName: "Cloud DevOps",
    scope:
      "Provisioning, CI/CD pipelines and observability so releases are boring and rollbacks are instant.",
    icon: Server,
  },
  {
    id: "cybersecurity_compliance",
    shortName: "Cybersecurity",
    scope:
      "Hardening, penetration testing and compliance readiness for teams handling sensitive data.",
    icon: ShieldCheck,
  },
  {
    id: "brand_strategy",
    shortName: "Brand Strategy",
    scope:
      "Positioning, visual identity systems and the brand guidelines that keep every surface consistent.",
    icon: Sparkles,
  },
  {
    id: "mobile_app_development",
    shortName: "Mobile Apps",
    scope:
      "Cross-platform iOS and Android builds — one codebase, native-feeling interactions, store-ready.",
    icon: Smartphone,
  },
  {
    id: "ecommerce",
    shortName: "E-Commerce",
    scope:
      "Conversion-focused storefronts with catalogue, checkout and fulfilment wired end to end.",
    icon: ShoppingBag,
  },
  {
    id: "fintech_payments",
    shortName: "Fintech & Payments",
    scope: "Payment rails, ledgers and reconciliation with NGN and multi-currency gateway support.",
    icon: CreditCard,
  },
  {
    id: "digital_marketing",
    shortName: "Digital Marketing",
    scope:
      "Paid funnels, landing pages and campaign telemetry tied to actual pipeline, not vanity reach.",
    icon: TrendingUp,
  },
  {
    id: "seo_growth",
    shortName: "SEO & Growth",
    scope:
      "Technical audits, keyword architecture and content plans that compound month over month.",
    icon: Search,
  },
  {
    id: "content_copywriting",
    shortName: "Content & Copy",
    scope:
      "Sales pages, editorial series and long-form content written to a brief, reviewed before delivery.",
    icon: PenTool,
  },
  {
    id: "social_media",
    shortName: "Social Media",
    scope:
      "Content calendars, community management and creative production your audience actually shares.",
    icon: Share2,
  },
  {
    id: "video_media",
    shortName: "Video & Media",
    scope:
      "Explainers, promos and motion edits — scripted, shot or animated, delivered platform-ready.",
    icon: Video,
  },
  {
    id: "data_business",
    shortName: "Data & Research",
    scope:
      "BI dashboards, market research and reporting that turn scattered numbers into decisions.",
    icon: BarChart3,
  },
  {
    id: "nocode_rapid_mvp",
    shortName: "No-Code MVP",
    scope:
      "A working product in weeks, not quarters — validated first, then hardened into custom code.",
    icon: Zap,
  },
];

const PROFILE_BY_ID = new Map(DEPARTMENT_PROFILES.map((p) => [p.id, p]));

/** Presentation profile for a department id, with a safe fallback. */
export function departmentProfile(id: ServiceDepartment): DepartmentProfile {
  return (
    PROFILE_BY_ID.get(id) ?? {
      id,
      shortName: "Digital Services",
      scope:
        "Managed digital delivery with a dedicated project manager and verified weekly milestones.",
      icon: Sparkles,
    }
  );
}

export interface DepartmentCardData extends DepartmentProfile {
  /** Full commercial record — description, pricing, capacity, cover art. */
  record: (typeof SERVICE_DEPARTMENTS)[number];
}

/** The 16 departments, each joined to its presentation profile. */
export const DEPARTMENT_CARDS: DepartmentCardData[] = SERVICE_DEPARTMENTS.map((record) => ({
  ...departmentProfile(record.id),
  record,
}));

/** Marquee order for the continuous services ticker (16 departments). */
export const DEPARTMENT_MARQUEE = DEPARTMENT_PROFILES.map((p) => ({
  id: p.id,
  label: p.shortName,
  icon: p.icon,
}));

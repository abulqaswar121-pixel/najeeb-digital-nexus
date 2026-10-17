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
      "Clear, easy-to-use screen designs for your app or website, planned before any coding starts.",
    icon: Layout,
  },
  {
    id: "ai_automation",
    shortName: "AI Automation",
    scope:
      "Smart chat assistants and automatic tasks that answer customers and save your team hours.",
    icon: Bot,
  },
  {
    id: "web_app_development",
    shortName: "Web App Development",
    scope:
      "Fast, modern websites and web apps built for your business and handed over fully to you.",
    icon: Code,
  },
  {
    id: "cloud_devops",
    shortName: "Cloud DevOps",
    scope: "Reliable hosting, backups and updates so your website stays fast and never goes down.",
    icon: Server,
  },
  {
    id: "cybersecurity_compliance",
    shortName: "Cybersecurity",
    scope: "Protect your website and customer data from hackers, with checks and safety fixes.",
    icon: ShieldCheck,
  },
  {
    id: "brand_strategy",
    shortName: "Brand Strategy",
    scope:
      "Logos, colours and brand style that make your business look trusted and easy to remember.",
    icon: Sparkles,
  },
  {
    id: "mobile_app_development",
    shortName: "Mobile Apps",
    scope: "Android and iPhone apps your customers enjoy using, ready for the app stores.",
    icon: Smartphone,
  },
  {
    id: "ecommerce",
    shortName: "E-Commerce",
    scope: "Online stores that show your products, take payments safely and track every order.",
    icon: ShoppingBag,
  },
  {
    id: "fintech_payments",
    shortName: "Fintech & Payments",
    scope:
      "Safe payment features with Paystack, cards and bank transfers in Naira and other currencies.",
    icon: CreditCard,
  },
  {
    id: "digital_marketing",
    shortName: "Digital Marketing",
    scope: "Ads and campaigns on social media and Google that bring you real paying customers.",
    icon: TrendingUp,
  },
  {
    id: "seo_growth",
    shortName: "SEO & Growth",
    scope: "Help people find your business on Google with better pages, keywords and content.",
    icon: Search,
  },
  {
    id: "content_copywriting",
    shortName: "Content & Copy",
    scope: "Website words, blog posts, articles and sales pages written clearly to win customers.",
    icon: PenTool,
  },
  {
    id: "social_media",
    shortName: "Social Media",
    scope: "Posts, graphics and page management that grow your followers and keep them engaged.",
    icon: Share2,
  },
  {
    id: "video_media",
    shortName: "Video & Media",
    scope: "Short videos, adverts and animations made ready for social media and your website.",
    icon: Video,
  },
  {
    id: "data_business",
    shortName: "Data & Research",
    scope: "Simple reports and dashboards that turn your business numbers into clear decisions.",
    icon: BarChart3,
  },
  {
    id: "nocode_rapid_mvp",
    shortName: "No-Code MVP",
    scope: "Test your business idea fast with a working first version, ready in a few weeks.",
    icon: Zap,
  },
];

/** The 8 most requested services, shown on the homepage. */
export const HOMEPAGE_DEPARTMENT_IDS: ServiceDepartment[] = [
  "web_app_development",
  "mobile_app_development",
  "ecommerce",
  "brand_strategy",
  "content_copywriting",
  "digital_marketing",
  "seo_growth",
  "ai_automation",
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

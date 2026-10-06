/**
 * Single source of truth for the NDH family of businesses.
 *
 * Ported from the parent gateway (`ndh.com.ng`) so a new subsidiary only has to
 * be described once. The ecosystem switcher (`FamilyMenu`), the footer sibling
 * links and the Academy cross-promotion card all read from this module.
 *
 * Everything here is plain data with no browser APIs, so it is safe to import
 * at module scope during SSR.
 *
 * NOTE ON THE PARENT PORT: the gateway resolves subsidiary names and taglines
 * through its i18n dictionary (`eco.<id>.name` / `eco.<id>.tagline`, backed by
 * `lib/business-profiles`). NDH Agency has no such dictionary, so the owner-
 * confirmed English copy is carried inline here. Keep the `domain`, `href`,
 * `previewUrl` and `state` values in sync with the parent — those are the
 * load-bearing fields.
 */
import {
  BookOpen,
  BriefcaseBusiness,
  HeartPulse,
  Plane,
  School,
  ShoppingBag,
  Sprout,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 * Categories — group the switcher and drive sector iconography
 * ------------------------------------------------------------------ */

export type CategoryId = "enterprise" | "education" | "agriculture" | "commerce" | "infrastructure";

export const ECOSYSTEM_CATEGORIES: {
  id: CategoryId;
  icon: LucideIcon;
  tone: "sky" | "iris" | "violet" | "cyan";
  name: string;
  blurb: string;
}[] = [
  {
    id: "enterprise",
    icon: BriefcaseBusiness,
    tone: "sky",
    name: "Enterprise Digital Delivery",
    blurb: "Managed engineering, design and AI delivery through dedicated PM teams.",
  },
  {
    id: "education",
    icon: BookOpen,
    tone: "iris",
    name: "Education & Tech Talent",
    blurb: "60 practical AI-skills courses across 6 specialized schools.",
  },
  {
    id: "agriculture",
    icon: Sprout,
    tone: "violet",
    name: "Agriculture & Cooperative Farming",
    blurb: "Farm-cycle contributions, transparent equity and harvest profit distribution.",
  },
  {
    id: "commerce",
    icon: ShoppingBag,
    tone: "sky",
    name: "Commerce & Retail Infrastructure",
    blurb: "Multi-vendor digital and physical storefronts, shipping and checkout.",
  },
  {
    id: "infrastructure",
    icon: School,
    tone: "cyan",
    name: "Pipeline Platforms",
    blurb: "SchoolDesk, Travel and iHospital — all Coming Soon.",
  },
];

/* ------------------------------------------------------------------ *
 * Subsidiaries
 * ------------------------------------------------------------------ */

export type SubsidiaryId =
  "agency" | "academy" | "agricapital" | "estore" | "schooldesk" | "travel" | "ihospital";

/** `live` is launched and public, `preview` is a working pre-launch build. */
export type LaunchState = "live" | "preview" | "coming";

export type Subsidiary = {
  id: SubsidiaryId;
  /** Owner-confirmed public business name. */
  name: string;
  /** One-line positioning statement shown under the name. */
  tagline: string;
  /** Sector icon integrated into the bottom-right corner of the Open Gateway tile. */
  icon: LucideIcon;
  accent: "sky" | "iris" | "violet" | "cyan" | "amber" | "rose" | "emerald";
  state: LaunchState;
  categories: CategoryId[];
  /** Canonical production subdomain. */
  domain: string;
  /** Working pre-launch build, when one exists. */
  previewUrl: string | null;
  /** Where a click should land today. */
  href: string;
  /** True when `href` leaves agency.ndh.com.ng. */
  external: boolean;
};

/** The subsidiary this application *is*, used to mark the active row. */
export const CURRENT_SUBSIDIARY: SubsidiaryId = "agency";

export const SUBSIDIARIES: Subsidiary[] = [
  {
    id: "agency",
    name: "NDH Agency",
    tagline:
      "Enterprise-grade engineering, design, and AI automation delivered through dedicated PM teams.",
    icon: BriefcaseBusiness,
    accent: "sky",
    state: "live",
    categories: ["enterprise"],
    domain: "agency.ndh.com.ng",
    previewUrl: "https://ndhagency.lovable.app",
    href: "https://agency.ndh.com.ng",
    external: true,
  },
  {
    id: "academy",
    name: "NDH Academy",
    tagline: "60 practical courses across 6 schools with verifiable certificates.",
    icon: BookOpen,
    accent: "iris",
    state: "live",
    categories: ["education"],
    domain: "academy.ndh.com.ng",
    previewUrl: "https://ndhacademy.lovable.app",
    href: "https://academy.ndh.com.ng",
    external: true,
  },
  {
    id: "agricapital",
    name: "NDH AgriCapital",
    tagline: "Transparent shared-ledger farming investments with automated harvest equity payouts.",
    icon: Sprout,
    accent: "emerald",
    state: "live",
    categories: ["agriculture"],
    domain: "venture.ndh.com.ng",
    previewUrl: "https://ndhventure.lovable.app",
    href: "https://ndhventure.lovable.app",
    external: true,
  },
  {
    id: "estore",
    name: "NDH eStore",
    tagline: "Multi-vendor storefront engine powering local and cross-border commerce.",
    icon: ShoppingBag,
    accent: "amber",
    state: "live",
    categories: ["commerce"],
    domain: "estore.ndh.com.ng",
    previewUrl: "https://ndhestore.lovable.app",
    href: "https://estore.ndh.com.ng",
    external: true,
  },
  {
    id: "schooldesk",
    name: "NDH SchoolDesk",
    tagline: "EdTech operating system for school management, grading, and automated report cards.",
    icon: School,
    accent: "cyan",
    state: "coming",
    categories: ["infrastructure"],
    domain: "schooldesk.ndh.com.ng",
    previewUrl: null,
    href: "",
    external: false,
  },
  {
    id: "travel",
    name: "NDH Travel",
    tagline: "Travel concierge, flight booking, and visa advisory services.",
    icon: Plane,
    accent: "emerald",
    state: "coming",
    categories: ["infrastructure"],
    domain: "travel.ndh.com.ng",
    previewUrl: null,
    href: "",
    external: false,
  },
  {
    id: "ihospital",
    name: "NDH iHospital",
    tagline: "Telemedicine and digital clinic management infrastructure.",
    icon: HeartPulse,
    accent: "rose",
    state: "coming",
    categories: ["infrastructure"],
    domain: "ihospital.ndh.com.ng",
    previewUrl: null,
    href: "",
    external: false,
  },
];

export function getSubsidiary(id: SubsidiaryId): Subsidiary {
  const found = SUBSIDIARIES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown NDH subsidiary: ${id}`);
  return found;
}

export function filterSubsidiaries(category: CategoryId | "all"): Subsidiary[] {
  if (category === "all") return SUBSIDIARIES;
  return SUBSIDIARIES.filter((item) => item.categories.includes(category));
}

export const LIVE_SUBSIDIARY_COUNT = SUBSIDIARIES.filter((s) => s.state === "live").length;

export const COMING_SUBSIDIARY_COUNT = SUBSIDIARIES.filter((s) => s.state === "coming").length;

/** A destination is only actionable when the business is available.
 * AgriCapital retains the previously supplied deployment link until the owner
 * confirms its renamed domain. Do not fabricate agricapital.ndh.com.ng.
 */
export function subsidiaryHref(subsidiary: Subsidiary): string {
  return subsidiary.state === "coming" ? "" : subsidiary.href;
}

/** Siblings worth linking from the footer — everything except this app. */
export function siblingSubsidiaries(): Subsidiary[] {
  return SUBSIDIARIES.filter((item) => item.id !== CURRENT_SUBSIDIARY);
}

/** Human label for a launch state, used for the switcher's status pills. */
export function launchStateLabel(state: LaunchState): string {
  if (state === "live") return "Live";
  if (state === "preview") return "Preview";
  return "Coming Soon";
}

import { DesignDirectionId } from "../../types/ndh";

export interface DirectionThemeConfig {
  id: DesignDirectionId;
  name: string;
  codename: string;
  badge: string;
  tagline: string;
  paletteDescription: string;
  typographyHeading: string;
  typographyBody: string;
  strengths: string[];
  risks: string[];
  targetAudience: string;
  containerBg: string;
  cardBg: string;
  cardBorder: string;
  accentBtn: string;
  accentText: string;
  badgeStyle: string;
  navBg: string;
  footerBg: string;
  subtext: string;
  statValue: string;
}

export const DIRECTION_CONFIGS: Record<DesignDirectionId, DirectionThemeConfig> = {
  "direction-a": {
    id: "direction-a",
    name: "Direction A: Sovereign Neo-Precision",
    codename: "Architectural Tech-Elegance",
    badge: "Precision HUD & Sovereign Dark",
    tagline:
      "High-density telemetry, cryptographic precision, and institutional enterprise authority.",
    paletteDescription:
      "Obsidian Void (#080C14), Deep Slate (#0F172A), Cyber Sapphire (#2563EB / #60A5FA), Titanium Silver (#94A3B8)",
    typographyHeading: "font-sans font-bold tracking-tight",
    typographyBody: "font-sans text-slate-300",
    strengths: [
      "Commands immediate technical authority with global CTOs, venture funds, and fintech scale-ups.",
      "High data density allows operations, SLA metrics, and real-time deliverables to be scanned instantly.",
      "Conveys institutional security, zero-fluff engineering maturity, and strict privacy boundaries.",
    ],
    risks: [
      "Can feel too cold or cyber-technical for traditional legacy brands or conservative public agencies if unmoderated.",
      "Requires strict adherence to crisp high-contrast design tokens to maintain WCAG 2.2 AA contrast ratios.",
    ],
    targetAudience:
      "Fintech scale-ups, web3 & distributed protocols, venture studios, enterprise digital transformation leaders.",
    containerBg: "bg-[#080C14] text-[#F1F5F9]",
    cardBg: "bg-[#0F172A]/90 backdrop-blur-md",
    cardBorder: "border-blue-900/40",
    accentBtn:
      "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all font-medium",
    accentText: "text-blue-400",
    badgeStyle:
      "bg-blue-950/80 text-blue-400 border border-blue-800/60 font-mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded",
    navBg: "bg-[#080C14]/95 border-b border-blue-900/40 backdrop-blur-xl",
    footerBg: "bg-[#05080E] border-t border-blue-950",
    subtext: "text-slate-400",
    statValue: "text-blue-400 font-mono font-bold",
  },
  "direction-b": {
    id: "direction-b",
    name: "Direction B: Pan-African Vanguard & Luxury",
    codename: "Editorial Modern Warmth & Craft",
    badge: "Editorial Warmth & Sovereign Prestige",
    tagline:
      "Celebrates African creative excellence, bespoke typography, and high-craft storytelling.",
    paletteDescription:
      "Rich Obsidian (#14120E), Warm Alabaster (#FAF8F5), Terracotta (#C2410C), Burnished Ochre (#D97706)",
    typographyHeading: "font-serif font-bold tracking-tight",
    typographyBody: "font-sans text-stone-700",
    strengths: [
      "Creates a memorable, prestigious, and culturally resonant impression that differentiates NDH from generic tech agencies.",
      "Extraordinary for executive storytelling, brand strategy showcases, luxury commerce, and institutional partnerships.",
      "Warm human-centric feel inspires deep trust and premium valuation ($50k+ engagements).",
    ],
    risks: [
      "Slightly lower information density in data-heavy PM tables compared to neo-precision layouts.",
      "Requires curated photography, high-touch case study copywriting, and bespoke typography handling.",
    ],
    targetAudience:
      "Conglomerates, FMCG brands, luxury lifestyle platforms, sovereign government bodies, diaspora investment funds.",
    containerBg: "bg-[#FAF8F5] text-[#1C1917]",
    cardBg: "bg-[#FFFFFF] shadow-sm",
    cardBorder: "border-[#E7E5E4]",
    accentBtn:
      "bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-md shadow-orange-950/20 transition-all font-medium rounded-xl",
    accentText: "text-[#C2410C]",
    badgeStyle:
      "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-sans font-medium text-xs px-2.5 py-0.5 rounded-full",
    navBg: "bg-[#FAF8F5]/95 border-b border-[#E7E5E4] backdrop-blur-xl",
    footerBg: "bg-[#14120E] text-[#F5F5F4] border-t border-stone-800",
    subtext: "text-stone-600",
    statValue: "text-[#C2410C] font-serif font-bold",
  },
  "direction-c": {
    id: "direction-c",
    name: "Direction C: Hyper-Systemic Kinetic",
    codename: "Modular Linear & Operational Speed",
    badge: "Bento Grid & Sprint Velocity",
    tagline:
      "Frictionless operating system inspired by modern developer tooling with instant linear efficiency.",
    paletteDescription:
      "Stark Zinc (#09090B), Clean Pure (#FFFFFF), Electric Emerald (#10B981), Neon Cyan (#06B6D4)",
    typographyHeading: "font-sans font-semibold tracking-tight",
    typographyBody: "font-sans text-zinc-300",
    strengths: [
      "Maximum operational velocity: keyboard shortcuts, split-pane triage, zero-fluff sprint progress bars.",
      "Instantly intuitive for modern founders, product managers, and engineering teams familiar with Linear and Raycast.",
      "Fastest perceived load time and micro-interaction responsiveness.",
    ],
    risks: [
      "Less decorative emotional flair on the public landing page; prioritizes utility and clarity over marketing grandeur.",
      "Can feel utilitarian for clients who expect traditional elaborate corporate agency pitch decks.",
    ],
    targetAudience:
      "Fast-moving tech scale-ups, product managers, YC/Techstars founders, cross-functional agile teams.",
    containerBg: "bg-[#09090B] text-[#FAFAFA]",
    cardBg: "bg-[#121215]",
    cardBorder: "border-zinc-800",
    accentBtn:
      "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-sm transition-all rounded-lg",
    accentText: "text-emerald-400",
    badgeStyle:
      "bg-zinc-800 text-emerald-400 border border-zinc-700 font-mono text-[11px] px-2 py-0.5 rounded",
    navBg: "bg-[#09090B]/95 border-b border-zinc-800 backdrop-blur-xl",
    footerBg: "bg-[#050507] border-t border-zinc-900",
    subtext: "text-zinc-400",
    statValue: "text-emerald-400 font-mono font-bold",
  },
  hybrid_blend: {
    id: "hybrid_blend",
    name: "Strategic Hybrid Blend",
    codename: "Sovereign Telemetry + Editorial Storytelling + Bento Ops",
    badge: "Strategic Hybrid Blend (Production)",
    tagline:
      "Combines Direction A dark HUD telemetry, Direction B editorial case study storytelling, and Direction C linear bento ergonomics.",
    paletteDescription:
      "Obsidian Void (#080C14), Deep Slate (#0F172A), Cyber Sapphire (#2563EB), Electric Emerald (#10B981)",
    typographyHeading: "font-serif font-bold tracking-tight",
    typographyBody: "font-sans text-slate-300",
    strengths: [
      "Ultimate international enterprise polish: dark precision foundation with warm editorial storytelling.",
      "Maximum data density in PM/Talent dashboards without sacrificing public marketing prestige.",
      "Culturally resonant and sovereign positioning for Nigerian and global diaspora clients.",
    ],
    risks: [],
    targetAudience:
      "Global enterprises, fintech scale-ups, sovereign governments, and venture studios.",
    containerBg: "bg-[#080C14] text-[#F1F5F9]",
    cardBg: "bg-[#0F172A]/90 backdrop-blur-md",
    cardBorder: "border-blue-900/40",
    accentBtn:
      "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all font-medium",
    accentText: "text-blue-400",
    badgeStyle:
      "bg-blue-950/80 text-blue-400 border border-blue-800/60 font-mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded",
    navBg: "bg-[#080C14]/95 border-b border-blue-900/40 backdrop-blur-xl",
    footerBg: "bg-[#05080E] border-t border-blue-950",
    subtext: "text-slate-400",
    statValue: "text-blue-400 font-mono font-bold",
  },
};

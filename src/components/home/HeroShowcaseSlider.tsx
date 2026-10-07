import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";

// Hero images live in `public/case-studies/` as plain static files, same
// location and URL format used by the full case-study records in
// mockData.ts and the server-side case-study collection -- one source of
// truth for these assets, not a separate bundled copy.
const apexAgriCapitalImg = "/case-studies/apex-agri-capital-custom.webp";
const miftahAlArabiyyahImg = "/case-studies/miftah-al-arabiyyah-custom.webp";
const ndhEstoreImg = "/case-studies/ndh-estore.jpg";
const hagueExportImg = "/case-studies/hague-export.jpg";

interface HeroSlide {
  id: string;
  category: string;
  badgeColor: string;
  title: string;
  highlightText: string;
  subtitle: string;
  statValue: string;
  statLabel: string;
  statSubtext: string;
  image: string;
  tags: string[];
  client: string;
}

// Real, verifiable NDH case studies only (same 6 shown in full on /case-studies).
// No fabricated metrics — statValue/statLabel/statSubtext below describe what was
// actually built, not invented performance numbers.
const HERO_SLIDES: HeroSlide[] = [
  {
    id: "apex-agri-capital",
    category: "Web App Development",
    badgeColor: "border-cyan-400/40 bg-cyan-400/15 text-cyan-200",
    title: "A Transparent Shared Ledger Built for a Growing",
    highlightText: "Agriculture Investment Cooperative.",
    subtitle:
      "A role-based web application tracking contributions, expenses, and member equity across catfish, poultry, and goat farming operations.",
    statValue: "3 Roles",
    statLabel: "Admin · Operator · Contributor",
    statSubtext: "Built to scale from a founding group toward 100 members",
    image: apexAgriCapitalImg,
    tags: ["Web Application", "Role-Based Access"],
    client: "Apex Agri-Capital",
  },
  {
    id: "miftah-al-arabiyyah",
    category: "Content & Curriculum Development",
    badgeColor: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
    title: "An 8-Book Arabic Curriculum Series, Written and",
    highlightText: "Directed From Concept to Production.",
    subtitle:
      "Full curriculum authorship for Nigerian non-native Arabic speakers, spanning Nursery 1-3, Basic 1-5, and JSS 1-3, with formal teacher review across every level.",
    statValue: "8 Levels",
    statLabel: "Full Series Delivered",
    statSubtext: "Matched audio resources produced for every unit",
    image: miftahAlArabiyyahImg,
    tags: ["Curriculum Design", "Editorial Review", "Audio Production"],
    client: "Miftah al-Arabiyyah Project",
  },
  {
    id: "ndh-estore",
    category: "E-Commerce / SaaS",
    badgeColor: "border-amber-400/40 bg-amber-400/15 text-amber-200",
    title: "A Multi-Vendor Commerce Platform Letting Merchants",
    highlightText: "Launch an Online Store in Minutes.",
    subtitle:
      "A vendor dashboard, dynamic per-vendor storefront, and tiered plans from local Naira-only selling up to multi-currency Global Enterprise accounts.",
    statValue: "3 Tiers",
    statLabel: "Starter · Pro · Global Enterprise",
    statSubtext: "14-day free trial, no card required to publish a store",
    image: ndhEstoreImg,
    tags: ["Vendor Dashboard", "Multi-Currency Storefronts"],
    client: "NDH Estore",
  },
  {
    id: "hague-export",
    category: "B2B Trade / AgriTech Marketplace",
    badgeColor: "border-violet-400/40 bg-violet-400/15 text-violet-200",
    title: "A 4-Tier Verification System Powering a B2B",
    highlightText: "Agro-Export Marketplace.",
    subtitle:
      "A structured RFQ workflow — Search & Verify, Submit RFQ, Negotiate & Contract, Inspect & Ship — connecting verified Nigerian exporters to buyers across 62 destination countries.",
    statValue: "480+",
    statLabel: "Verified Exporters, 4 Trust Tiers",
    statSubtext: "35 commodity categories, from oilseeds to dried fruit",
    image: hagueExportImg,
    tags: ["B2B Marketplace", "4-Tier Verification"],
    client: "Hague Brands",
  },
];

interface HeroShowcaseSliderProps {
  onOpenBriefWizard: () => void;
  onSelectScreen: (screen: string) => void;
}

export const HeroShowcaseSlider: React.FC<HeroShowcaseSliderProps> = ({
  onOpenBriefWizard,
  onSelectScreen,
}) => {
  const { t } = useCurrencyLanguage();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const currentSlide = HERO_SLIDES[currentSlideIndex]!;

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] shadow-2xl backdrop-blur-2xl transition-all duration-700">
      {/* Background Radial Glow */}
      <div className="bg-eco-glow/20 pointer-events-none absolute top-0 right-0 -z-10 h-96 w-96 rounded-full blur-[100px]" />
      <div className="bg-eco-cyan/15 pointer-events-none absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full blur-[90px]" />

      {/* Main Slide Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
        {/* Left Narrative Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Slide Category Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-wider ${currentSlide.badgeColor}`}
            >
              {currentSlide.category}
            </span>
            <span className="text-[var(--eco-on-dark-muted)] font-mono text-xs">
              {t("label_case_study_prefix")}{" "}
              <strong className="text-white">{currentSlide.client}</strong>
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-3xl leading-[1.15] font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {currentSlide.title}{" "}
            <span className="text-gradient-brand">{currentSlide.highlightText}</span>
          </h2>

          {/* Subtitle */}
          <p className="max-w-xl text-sm leading-relaxed text-[var(--eco-on-dark-muted)] sm:text-base">
            {currentSlide.subtitle}
          </p>

          {/* Technology Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="mr-1 text-xs font-bold tracking-wider text-[var(--eco-on-dark-muted)] uppercase">
              {t("label_tech_stack_prefix")}
            </span>
            {currentSlide.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-lg border border-white/12 bg-white/[0.07] px-3 py-1 font-mono text-xs font-medium text-slate-100 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Metric Highlight Box */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-eco-dark/70 p-4 sm:p-5">
            <div>
              <div className="font-mono text-2xl font-black text-emerald-300 sm:text-3xl">
                {currentSlide.statValue}
              </div>
              <div className="text-xs font-bold tracking-wider text-white uppercase">
                {currentSlide.statLabel}
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--eco-on-dark-muted)]">
                {currentSlide.statSubtext}
              </div>
            </div>

            <button
              onClick={onOpenBriefWizard}
              className="from-eco-electric to-eco-cyan text-eco-dark inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3.5 text-xs font-extrabold shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105"
            >
              <span>{t("btn_scope_this_project")}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right Visual Image Column with Dynamic Frame */}
        <div className="lg:col-span-5 relative group">
          {/* Glass Card Image Frame */}
          <div className="bg-eco-dark relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="h-72 w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 sm:h-80 lg:h-96"
            />
            <div className="from-eco-dark via-eco-dark/20 absolute inset-0 bg-gradient-to-t to-transparent" />

            {/* Floating Live Badge */}
            <div className="bg-eco-dark/90 absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-xl border border-white/12 p-3 text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-white font-bold">{currentSlide.client}</span>
              </div>
              <span className="text-eco-cyan font-mono text-[11px]">
                {t("label_verified_project")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Dots & Arrows Controls Bar */}
      <div className="bg-eco-dark/70 flex items-center justify-between border-t border-white/12 px-6 py-4 sm:px-10">
        {/* Thumbnails / Category Switchers */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setIsAutoPlay(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                currentSlideIndex === idx
                  ? "bg-eco-electric text-eco-dark shadow-md"
                  : "text-[var(--eco-on-dark-muted)] hover:bg-white/10 hover:text-white"
              }`}
            >
              0{idx + 1}. {slide.category.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Left / Right Arrow Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
              setIsAutoPlay(false);
            }}
            className="text-[var(--eco-on-dark-muted)] rounded-lg border border-white/12 bg-white/[0.07] p-2 transition-colors hover:border-eco-cyan/50 hover:text-white"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
              setIsAutoPlay(false);
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

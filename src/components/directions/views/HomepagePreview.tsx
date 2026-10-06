import React, { useState } from "react";
import { ServiceDepartment, ServiceDepartmentInfo } from "../../../types/ndh";
import { SERVICE_DEPARTMENTS } from "../../../data/mockData";
import { useCurrencyLanguage } from "../../../lib/currencyLanguageStore";
import { useCaseStudies } from "../../../lib/databaseStore";
import { HeroShowcaseSlider } from "../../home/HeroShowcaseSlider";
import { ServiceDetailModal } from "../modals/ServiceDetailModal";
import {
  ShieldCheck,
  ArrowRight,
  Layers,
  TrendingUp,
  Sliders,
  Building,
  Globe,
} from "lucide-react";

interface HomepagePreviewProps {
  direction?: string;
  onOpenBriefWizard: () => void;
  onSelectScreen: (screen: string) => void;
}

// Short "what you actually get" focus phrase per department, used to make
// the tier descriptions below genuinely vary by selected service instead of
// showing the same generic 4 lines no matter which of the 16 departments is
// picked.
const TIER_FOCUS: Record<ServiceDepartment, string> = {
  brand_strategy: "logo & visual identity kit",
  ui_ux_design: "UI wireframes & prototypes",
  web_app_development: "landing page",
  mobile_app_development: "cross-platform mobile app",
  ai_automation: "AI agent / automation workflow",
  ecommerce: "online store",
  fintech_payments: "payment gateway integration",
  cloud_devops: "cloud infrastructure setup",
  cybersecurity_compliance: "security & compliance audit",
  digital_marketing: "ad campaign funnel",
  seo_growth: "SEO audit & ranking plan",
  content_copywriting: "sales copy & content set",
  social_media: "social content calendar",
  video_media: "promo / explainer video",
  data_business: "BI dashboard & research",
  nocode_rapid_mvp: "no-code MVP",
};

function getTierOptions(dept: ServiceDepartment) {
  const focus = TIER_FOCUS[dept] || "project";
  return [
    {
      id: "starter",
      title: "Starter MVP",
      desc: `${focus.charAt(0).toUpperCase()}${focus.slice(1)}, rapid launch & essential features`,
    },
    {
      id: "growth",
      title: "Growth Build (Most Popular)",
      desc: `Full custom ${focus}, backend & complete QA`,
    },
    {
      id: "enterprise",
      title: "Enterprise Dedicated",
      desc: `High concurrency ${focus}, 24/7 SLA & security audit`,
    },
    {
      id: "custom",
      title: "Custom Scope",
      desc: "Bigger, smaller, or different — let's talk & quote it",
    },
  ] as const;
}

export const HomepagePreview: React.FC<HomepagePreviewProps> = ({
  onOpenBriefWizard,
  onSelectScreen,
}) => {
  const { currency, setCurrency, currencies, getRegionalPricing, detectedCountry, t } =
    useCurrencyLanguage();

  const [calculatorDept, setCalculatorDept] = useState<ServiceDepartment>("web_app_development");
  const [calculatorTier, setCalculatorTier] = useState<
    "starter" | "growth" | "enterprise" | "custom"
  >("growth");
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [selectedModalDept, setSelectedModalDept] = useState<ServiceDepartmentInfo | null>(null);

  // "Custom" isn't a priced tier -- it's a deliberate escape hatch so a
  // visitor whose scope is bigger/smaller/different than Enterprise doesn't
  // just bounce off a sticker-shock number. No regional price is computed
  // for it; the UI below routes straight to a scoping conversation instead.
  const regionalResult =
    calculatorTier === "custom" ? null : getRegionalPricing(calculatorDept, calculatorTier);
  const caseStudiesData = useCaseStudies();
  const currentCase = caseStudiesData[activeCaseIdx] || caseStudiesData[0];

  return (
    <div className="bg-[#070A14] text-slate-100 min-h-screen font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      {/* 1. LIVE OPERATIONS STREAM TICKER */}
      <div className="bg-[#0B0F1D] border-b border-blue-900/40 py-2.5 overflow-hidden text-xs">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap text-slate-300 font-mono text-[11px]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-400 font-bold">NDH:</span>
            <span>{t("ticker_dept_line")}</span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1.5 text-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>{t("ticker_pm_line")}</span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {t("ticker_pricing_prefix")} {currencies[currency]?.name} ({currency})
            </span>
          </span>
        </div>
      </div>

      {/* 2. HERO SECTION — deep navy band (gw-band-hero) */}
      <section className="gw-band gw-band-hero relative overflow-hidden pt-12 pb-20">
        {/* Hero Background Image + Readability Overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-background.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1E]/90 via-[#070A14]/85 to-[#070A14]" />
        </div>

        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          {/* Hero Header */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold shadow-lg backdrop-blur-md">
              <span>{t("hero_badge")}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              {t("hero_title_1")}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                {t("hero_title_2")}
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              {t("hero_desc")}
            </p>

            {/* Currency auto-detected from your browser/timezone; override anytime via the
                currency switcher in the nav. No need to call out the detected country here —
                pricing throughout the site already renders in the right currency automatically. */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {t("hero_price_prefix")} <strong className="text-white">{currency}</strong> •{" "}
                {t("hero_price_suffix")}
              </span>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onOpenBriefWizard}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-2xl shadow-blue-600/40 border border-blue-400/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{t("hero_cta_primary")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectScreen("services")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>{t("hero_cta_secondary")}</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC AUTO-CHANGING HERO SHOWCASE SLIDER */}
          <div className="pt-2">
            <HeroShowcaseSlider
              onOpenBriefWizard={onOpenBriefWizard}
              onSelectScreen={onSelectScreen}
            />
          </div>

          {/* 4 Metric Counter Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black font-mono text-blue-400">
                {t("hero_stat_1_val")}
              </div>
              <div className="text-xs font-bold text-white mt-1">{t("hero_stat_1_lbl")}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{t("stat_1_sub")}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {t("hero_stat_2_val")}
              </div>
              <div className="text-xs font-bold text-white mt-1">{t("hero_stat_2_lbl")}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{t("stat_2_sub")}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-400">
                {t("hero_stat_3_val")}
              </div>
              <div className="text-xs font-bold text-white mt-1">{t("hero_stat_3_lbl")}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{t("stat_3_sub")}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Globe className="w-5 h-5" />
                <span className="text-2xl sm:text-3xl font-black font-mono">
                  {t("hero_stat_4_val")}
                </span>
              </div>
              <div className="text-xs font-bold text-white mt-1">{t("hero_stat_4_lbl")}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">NGN · USD · GBP · EUR · AED</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. REAL CLIENTS MARQUEE — names of actual, verifiable NDH case-study
          clients only (see "Verified Client Success Stories" below for the
          full case studies). No claimed partnerships with third-party
          payment/infrastructure providers. */}
      <section className="gw-band gw-band-white gw-band-tight overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            {t("marquee_heading")}
          </span>
        </div>
        <div className="animate-marquee flex items-center gap-16 whitespace-nowrap text-slate-300 font-bold text-sm">
          {[
            ...caseStudiesData.map((c) => c.clientName),
            // Additional real clients without a published case study yet.
            "Markazussalaf",
            "Taskzone",
            "Suregrade",
          ].map((name) => (
            <span
              key={name}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-2"
            >
              <Building className="w-4 h-4 text-blue-400" /> {name}
            </span>
          ))}
        </div>
      </section>

      {/* 4. WHAT WE BUILD: 16 SPECIALIZED DEPARTMENTS WITH DISTINCT PHOTOGRAPHY
          Porcelain band — the department cards invert to elevated white. */}
      <section className="gw-band gw-band-porcelain gw-band-roomy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>{t("section_build_badge")}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {t("section_build_title")}
              </h2>
              <p className="text-sm sm:text-base text-slate-300">{t("section_build_desc")}</p>
            </div>

            <button
              onClick={() => onSelectScreen("services")}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>{t("btn_explore_all_departments")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Department Cards Grid (6 Top Featured on Homepage) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICE_DEPARTMENTS.slice(0, 6).map((dept) => {
              const starterInfo = getRegionalPricing(dept.id, "starter");
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedModalDept(dept)}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/70 overflow-hidden shadow-2xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 cursor-pointer"
                >
                  <div>
                    {/* High-Resolution Image Header */}
                    <div className="gw-photo-plate relative h-48 overflow-hidden bg-slate-950">
                      <img
                        src={dept.coverImage}
                        alt={dept.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                      <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-blue-300 border border-blue-500/30">
                        {dept.averageTurnaroundDays}d SLA Delivery
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                        Active: {dept.activeTalentsCount} Talents
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight drop-shadow-md">
                          {dept.name}
                        </h3>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {dept.description}
                      </p>

                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {t("label_key_capabilities")}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {dept.capabilities.slice(0, 3).map((cap, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-200 text-[11px] border border-slate-800 font-medium"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accessible Local Pricing Footer */}
                  <div className="p-6 pt-3 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/30">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {t("label_starter_plan")} ({currency}):
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {t("label_from_price")} {starterInfo.price}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModalDept(dept);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 hover:scale-105"
                    >
                      <span>{t("btn_explore")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onSelectScreen("services")}
              className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <span>{t("btn_view_all_departments")}</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. INSTANT PROJECT PRICE & TIME ESTIMATOR */}
      <section id="estimator" className="gw-band gw-band-white gw-band-roomy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>{t("estimator_title")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {t("estimator_title")}
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">{t("estimator_desc")}</p>
            </div>

            {/* Step 1: Department Chips */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t("label_select_service")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SERVICE_DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setCalculatorDept(dept.id)}
                    className={`p-3 rounded-xl text-left border transition-all truncate text-xs font-medium ${
                      calculatorDept === dept.id
                        ? "bg-blue-600 text-white border-blue-400 shadow-lg"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {dept.name.split("&")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Scope & Speed Tiers */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t("label_project_tier")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {getTierOptions(calculatorDept).map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      setCalculatorTier(t.id as Parameters<typeof setCalculatorTier>[0])
                    }
                    className={`p-4 rounded-xl text-left border transition-all ${
                      calculatorTier === t.id
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-lg"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{t.title}</div>
                    <div className="text-[11px] text-slate-300 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {regionalResult
                      ? `${t("label_instant_budget")} (${currencies[currency]?.name}):`
                      : t("label_custom_scope")}
                  </span>
                </div>

                {regionalResult ? (
                  <>
                    <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                      {regionalResult.price}
                    </div>
                    <div className="text-xs text-slate-300">
                      {t("label_estimated_delivery")}{" "}
                      <strong className="text-white font-mono">{regionalResult.weeks}</strong> •{" "}
                      {t("label_includes_pm_escrow")}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                      {t("label_lets_talk_quote")}
                    </div>
                    <div className="text-xs text-slate-300">{t("label_no_fixed_price_desc")}</div>
                  </>
                )}
              </div>

              <button
                onClick={onOpenBriefWizard}
                className="w-full md:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105"
              >
                <span>
                  {regionalResult ? t("btn_generate_proposal") : t("btn_start_custom_scoping")}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CLIENT SUCCESS STORIES — porcelain band */}
      <section className="gw-band gw-band-porcelain gw-band-roomy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>{t("section_results_badge")}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {t("section_results_title")}
              </h2>
              <p className="text-sm sm:text-base text-slate-300">{t("section_results_desc")}</p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {caseStudiesData.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCaseIdx(i)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCaseIdx === i
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600"
                  }`}
                >
                  {c.clientName}
                </button>
              ))}
            </div>
          </div>

          {/* Active Case Study Spotlight Card */}
          {currentCase && (
            <div className="rounded-3xl bg-slate-900 border border-slate-700/80 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800 text-xs font-bold">
                    {currentCase.industry}
                  </span>
                  {currentCase.year && (
                    <span className="text-xs text-slate-400 font-mono">
                      {t("label_completed")} {currentCase.year}
                    </span>
                  )}
                  {currentCase.projectDuration && (
                    <span className="text-xs text-emerald-400 font-mono">
                      • {currentCase.projectDuration}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {currentCase.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentCase.summary ?? currentCase.solution}
                </p>

                {/* Verified Metrics Grid (only rendered when real, disclosed metrics exist) */}
                {currentCase.measurableOutcomes.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {currentCase.measurableOutcomes.slice(0, 4).map((metric, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                      >
                        <div className="text-lg font-black font-mono text-emerald-400">
                          {metric.metric}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={onOpenBriefWizard}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
                  >
                    {t("btn_build_similar")}
                  </button>
                  <button
                    onClick={() => onSelectScreen("case-study")}
                    className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    <span>{t("btn_read_full_dossier")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="gw-photo-plate relative h-72 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl sm:h-96">
                  <img
                    src={currentCase.heroImage}
                    alt={currentCase.clientName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                    <span>{t("label_delivered_by_ndh")}</span>
                    {currentCase.clientApprovalRecorded && (
                      <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> {t("label_verified_project")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal for Service Deep-Dive */}
      <ServiceDetailModal
        dept={selectedModalDept}
        isOpen={!!selectedModalDept}
        onClose={() => setSelectedModalDept(null)}
        onOpenBriefWizard={onOpenBriefWizard}
      />
    </div>
  );
};

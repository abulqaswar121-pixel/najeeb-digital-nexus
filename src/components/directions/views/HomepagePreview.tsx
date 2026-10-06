import React, { useState } from "react";
import { ServiceDepartment, ServiceDepartmentInfo } from "../../../types/ndh";
import { SERVICE_DEPARTMENTS } from "../../../data/mockData";
import { useCurrencyLanguage } from "../../../lib/currencyLanguageStore";
import { useCaseStudies } from "../../../lib/databaseStore";
import { ServiceDetailModal } from "../modals/ServiceDetailModal";
import { ShieldCheck, ArrowRight, Sliders, Globe } from "lucide-react";

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

  const heroBadge = t("hero_badge").replace(/^[^\p{L}\p{N}]+/u, "");
  const stats = [
    { val: t("hero_stat_1_val"), lbl: t("hero_stat_1_lbl"), accent: false },
    { val: t("hero_stat_2_val"), lbl: t("hero_stat_2_lbl"), accent: true },
    { val: t("hero_stat_3_val"), lbl: t("hero_stat_3_lbl"), accent: false },
    { val: t("hero_stat_4_val"), lbl: t("hero_stat_4_lbl"), accent: false },
  ];
  // Bento rhythm for six cards in a 3-column grid: wide+narrow, narrow+wide, wide+narrow.
  const BENTO_SPANS = ["lg:col-span-2", "", "", "lg:col-span-2", "lg:col-span-2", ""];

  return (
    <div className="min-h-screen overflow-x-hidden bg-eco-dark font-sans text-slate-200">
      {/* 1. HERO */}
      <section data-band="hero" className="relative px-4 pb-24 pt-20 sm:px-6 sm:pt-24 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-full max-w-4xl -translate-x-1/2 rounded-full bg-eco-glow/10 blur-[120px]"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-eco-electric opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-eco-electric" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[11px] sm:tracking-widest">
              {heroBadge}
            </span>
          </div>

          <h1 className="mb-8 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-7xl">
            {t("hero_title_1")}{" "}
            <span className="bg-gradient-to-r from-eco-electric to-eco-glow bg-clip-text text-transparent">
              {t("hero_title_2")}
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            {t("hero_desc")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={onOpenBriefWizard}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-eco-electric px-8 py-4 font-semibold text-eco-dark shadow-xl shadow-eco-electric/20 transition-all hover:brightness-110 sm:w-auto"
            >
              {t("hero_cta_primary")}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelectScreen("services")}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
            >
              {t("hero_cta_secondary")}
            </button>
          </div>

          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <Globe className="h-3.5 w-3.5" />
            <span>
              {t("hero_price_prefix")}{" "}
              <span className="text-slate-300" suppressHydrationWarning>
                {currency}
              </span>{" "}
              · {t("hero_price_suffix")}
            </span>
          </p>
        </div>
      </section>

      {/* 2. STATS STRIP */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.lbl} className="bg-eco-dark p-6 text-center sm:p-8">
              <div
                className={`mb-1 font-display text-2xl font-bold sm:text-3xl ${
                  s.accent ? "text-eco-electric" : "text-white"
                }`}
              >
                {s.val}
              </div>
              <div className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CLIENTS — real NDH case-study clients only */}
      <section className="border-y border-white/5 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("marquee_heading")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {[
              ...caseStudiesData.map((c) => c.clientName),
              "Markazussalaf",
              "Taskzone",
              "Suregrade",
            ].map((name) => (
              <span
                key={name}
                className="font-display text-base font-semibold text-slate-500 transition-colors hover:text-slate-200"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SERVICES — bento grid on a light band */}
      <section data-band="porcelain" className="bg-[#F1F4FA] px-4 py-24 text-slate-900 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-[#0E7490]">
                {t("section_build_badge")}
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-eco-dark sm:text-4xl">
                {t("section_build_title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {t("section_build_desc")}
              </p>
            </div>
            <button
              onClick={() => onSelectScreen("services")}
              className="group flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-eco-dark"
            >
              {t("btn_explore_all_departments")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_DEPARTMENTS.slice(0, 6).map((dept, i) => {
              const starterInfo = getRegionalPricing(dept.id, "starter");
              const wide = BENTO_SPANS[i] !== "";
              return (
                <button data-testid="department-card"
                  type="button"
                  key={dept.id}
                  onClick={() => setSelectedModalDept(dept)}
                  className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_40px_-12px_rgba(7,15,30,0.18)] ${BENTO_SPANS[i]}`}
                >
                  <div className={`relative w-full overflow-hidden ${wide ? "h-52" : "h-40"}`}>
                    <img
                      src={dept.coverImage}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-eco-dark/60 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-eco-dark backdrop-blur">
                      {dept.averageTurnaroundDays}-day delivery
                    </span>
                  </div>
                  <div className="flex w-full flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-semibold leading-snug text-eco-dark">
                      {dept.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {dept.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-xs text-slate-500">
                        {t("label_from_price")}{" "}
                        <span className="text-sm font-semibold text-eco-dark">
                          {starterInfo.price}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#0E7490]">
                        {t("btn_explore")}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ESTIMATOR — white band */}
      <section id="estimator" data-band="white" className="bg-white px-4 py-24 text-slate-900 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0E7490]">
              <Sliders className="h-3.5 w-3.5" />
              {t("label_instant_budget")}
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-eco-dark sm:text-4xl">
              {t("estimator_title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">{t("estimator_desc")}</p>
          </div>

          <div className="space-y-10 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-10">
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                {t("label_select_service")}
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setCalculatorDept(dept.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                      calculatorDept === dept.id
                        ? "border-eco-dark bg-eco-dark text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {(dept.name.split("&")[0] ?? dept.name).split("(")[0]!.trim()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                {t("label_project_tier")}
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {getTierOptions(calculatorDept).map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() =>
                      setCalculatorTier(tier.id as Parameters<typeof setCalculatorTier>[0])
                    }
                    className={`rounded-xl border p-4 text-left transition-all ${
                      calculatorTier === tier.id
                        ? "border-[#0E7490] bg-white shadow-[0_0_0_3px_rgba(14,116,144,0.12)]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="text-sm font-semibold text-eco-dark">{tier.title}</div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-500">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-eco-dark p-6 text-center sm:p-8 md:flex-row md:text-left">
              <div>
                <div className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  {regionalResult
                    ? `${t("label_instant_budget")} (${currencies[currency]?.name})`
                    : t("label_custom_scope")}
                </div>
                {regionalResult ? (
                  <>
                    <div className="mt-2 font-display text-4xl font-bold text-white">
                      {regionalResult.price}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      {t("label_estimated_delivery")}{" "}
                      <span className="text-white">{regionalResult.weeks}</span> ·{" "}
                      {t("label_includes_pm_escrow")}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-2 font-display text-3xl font-bold text-white">
                      {t("label_lets_talk_quote")}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      {t("label_no_fixed_price_desc")}
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={onOpenBriefWizard}
                className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-eco-electric px-7 py-4 text-sm font-semibold text-eco-dark transition-all hover:brightness-110 md:w-auto"
              >
                {regionalResult ? t("btn_generate_proposal") : t("btn_start_custom_scoping")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED CASE STUDY — dark */}
      <section data-band="dark" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-eco-electric">
              {t("section_results_badge")}
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {currentCase?.title ?? t("section_results_title")}
            </h2>
          </div>
          <button
            onClick={() => onSelectScreen("case-study")}
            className="group flex shrink-0 items-center gap-2 text-slate-400 transition-colors hover:text-white"
          >
            <span className="text-sm font-semibold">View all projects</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {caseStudiesData.length > 1 && (
          <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
            {caseStudiesData.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveCaseIdx(i)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeCaseIdx === i
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/5 text-slate-500 hover:text-slate-200"
                }`}
              >
                {c.clientName}
              </button>
            ))}
          </div>
        )}

        {currentCase && (
          <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-eco-electric/25">
            <div className="grid items-stretch lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16">
                <p className="mb-8 text-lg leading-relaxed text-slate-400">
                  {currentCase.summary ?? currentCase.solution}
                </p>

                {currentCase.measurableOutcomes.length > 0 && (
                  <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5">
                    {currentCase.measurableOutcomes.slice(0, 4).map((m, i) => (
                      <div key={i} className="bg-eco-dark p-4">
                        <div className="font-display text-xl font-bold text-white">{m.metric}</div>
                        <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-10 flex flex-wrap gap-2">
                  {[currentCase.industry, ...currentCase.techStack.slice(0, 2)].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <button
                    onClick={onOpenBriefWizard}
                    className="rounded-lg bg-white px-6 py-3 font-semibold text-eco-dark transition-colors hover:bg-slate-200"
                  >
                    {t("btn_build_similar")}
                  </button>
                  <button
                    onClick={() => onSelectScreen("case-study")}
                    className="flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-white"
                  >
                    {t("btn_read_full_dossier")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative min-h-[320px] overflow-hidden bg-eco-navy lg:min-h-full">
                <img
                  src={currentCase.heroImage}
                  alt={currentCase.clientName}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-eco-dark via-transparent to-transparent" />
                {currentCase.clientApprovalRecorded && (
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                      {t("label_verified_project")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <ServiceDetailModal
        dept={selectedModalDept}
        isOpen={!!selectedModalDept}
        onClose={() => setSelectedModalDept(null)}
        onOpenBriefWizard={onOpenBriefWizard}
      />
    </div>
  );
};

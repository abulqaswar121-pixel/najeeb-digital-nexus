import React, { useState } from "react";
import { ServiceDepartment, ServiceDepartmentInfo } from "../../../types/ndh";
import { SERVICE_DEPARTMENTS } from "../../../data/mockData";
import { DEPARTMENT_CARDS, departmentProfile } from "../../../data/agencyDepartments";
import { useCurrencyLanguage } from "../../../lib/currencyLanguageStore";
import { useCaseStudies } from "../../../lib/databaseStore";
import { HeroShowcaseSlider } from "../../home/HeroShowcaseSlider";
import { ClientsMarquee, ServicesMarquee } from "../../home/Marquees";
import { DeliveryArc } from "../../home/DeliveryArc";
import { DepartmentCard } from "../../home/DepartmentCard";
import { ServiceDetailModal } from "../modals/ServiceDetailModal";
import { SectionHeading } from "../../home/SectionHeading";
import {
  ShieldCheck,
  ArrowRight,
  Layers,
  TrendingUp,
  Sliders,
  Globe,
  Quote,
  Sparkles,
  BadgeCheck,
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

/**
 * Agency home page — the Academy "Precision Gateway" rhythm.
 *
 * Band order (deep navy → porcelain → white → porcelain → white → navy):
 *   1. Hero band          #091B3F with ambient cyan glow, animated bureau pill,
 *                         gradient headline highlight, high-contrast stat counters
 *      + continuous 16-department services marquee directly beneath it
 *   2. White strip        real client marquee
 *   3. Porcelain band     16-department showcase in elevated white cards
 *   4. White band         the 4-step delivery arc (01 … 04)
 *   5. Porcelain band     instant estimator in a white container card
 *   6. White band         verified case studies + client feedback
 *   7. Navy anchor band   final CTA
 */
export const HomepagePreview: React.FC<HomepagePreviewProps> = ({
  onOpenBriefWizard,
  onSelectScreen,
}) => {
  const { currency, currencies, getRegionalPricing, t } = useCurrencyLanguage();

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

  // Only case studies that carry recorded client approval and a real quote are
  // shown as feedback — the platform's honesty rule for testimonials.
  const testimonialCases = caseStudiesData
    .filter((c) => c.testimonial && c.clientApprovalRecorded)
    .slice(0, 4);

  const heroStats = [
    {
      value: t("hero_stat_1_val"),
      label: t("hero_stat_1_lbl"),
      sub: t("stat_1_sub"),
      tone: "text-eco-electric",
    },
    {
      value: t("hero_stat_2_val"),
      label: t("hero_stat_2_lbl"),
      sub: t("stat_2_sub"),
      tone: "text-emerald-300",
    },
    {
      value: t("hero_stat_3_val"),
      label: t("hero_stat_3_lbl"),
      sub: t("stat_3_sub"),
      tone: "text-indigo-300",
    },
    {
      value: t("hero_stat_4_val"),
      label: t("hero_stat_4_lbl"),
      sub: "NGN · USD · GBP · EUR · AED",
      tone: "text-amber-300",
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden font-sans">
      {/* ───────── 1. HERO BAND — deep navy + ambient cyan glow ───────── */}
      <section className="gw-band gw-band-hero relative overflow-hidden pt-14 pb-16 sm:pt-16 sm:pb-20">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" aria-hidden="true" />
        <div
          className="gw-glow-cyan top-0 left-1/2 h-[360px] w-[720px] -translate-x-1/2"
          aria-hidden="true"
        />
        <div
          className="gw-glow-cyan top-24 right-6 h-[300px] w-[420px] opacity-70"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            {/* Animated bureau pill */}
            <div className="gw-eyebrow animate-rise-in mx-auto text-xs shadow-lg backdrop-blur-md">
              <span className="gw-eyebrow-dot" aria-hidden="true" />
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("hero_badge")}</span>
            </div>

            <h1 className="font-display text-4xl leading-[1.08] font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t("hero_title_1")} <span className="text-gradient-brand">{t("hero_title_2")}</span>
            </h1>

            <p className="mx-auto max-w-3xl text-base leading-relaxed text-[var(--eco-on-dark-muted)] sm:text-xl">
              {t("hero_desc")}
            </p>

            {/* Currency auto-detected from your browser/timezone; override
                anytime from the header preferences. */}
            <div className="text-[var(--eco-on-dark-muted)] inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs backdrop-blur-md">
              <Globe className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
              <span>
                {t("hero_price_prefix")} <strong className="text-white">{currency}</strong> ·{" "}
                {t("hero_price_suffix")}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
              <button
                onClick={onOpenBriefWizard}
                className="from-eco-electric to-eco-cyan text-eco-dark inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r px-8 py-4 text-sm font-extrabold shadow-2xl shadow-cyan-500/25 transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
              >
                <span>{t("hero_cta_primary")}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => onSelectScreen("services")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.06] px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/[0.12] sm:w-auto"
              >
                {t("hero_cta_secondary")}
              </button>
            </div>
          </div>

          {/* High-contrast stat counters */}
          <div id="hero-stats" className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/12 bg-white/[0.07] p-5 shadow-xl backdrop-blur-md"
              >
                <div className={`font-mono text-2xl font-black sm:text-3xl ${stat.tone}`}>
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-bold text-white">{stat.label}</div>
                <div className="mt-0.5 text-[11px] text-[var(--eco-on-dark-muted)]">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Auto-changing showcase of verified work */}
          <div className="pt-2">
            <HeroShowcaseSlider
              onOpenBriefWizard={onOpenBriefWizard}
              onSelectScreen={onSelectScreen}
            />
          </div>
        </div>
      </section>

      {/* ───────── Continuous services marquee — all 16 departments ───────── */}
      <ServicesMarquee />

      {/* ───────── 2. WHITE STRIP — real clients only ───────── */}
      <ClientsMarquee />

      {/* ───────── 3. PORCELAIN BAND — the 16-department showcase ───────── */}
      <section className="gw-band gw-band-porcelain gw-band-roomy" id="departments">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("section_build_badge")}
            title={
              <>
                16 service departments, <span className="text-gradient-brand">one bureau</span>
              </>
            }
            description={t("section_build_desc")}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DEPARTMENT_CARDS.map((dept) => (
              <DepartmentCard
                key={dept.id}
                dept={dept}
                currency={currency}
                fromPrice={getRegionalPricing(dept.id, "starter").price}
                onOpen={(d) => setSelectedModalDept(d.record)}
              />
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <button
              onClick={() => onSelectScreen("services")}
              className="border-border bg-surface text-foreground hover:border-primary/50 inline-flex items-center gap-2 rounded-2xl border px-8 py-3.5 text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5"
            >
              <Layers className="text-brand-soft h-4 w-4" aria-hidden="true" />
              {t("btn_view_all_departments")}
            </button>
            <button
              onClick={onOpenBriefWizard}
              className="from-primary to-highlight inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r px-8 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
            >
              {t("cta_primary")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* ───────── 4. WHITE BAND — the 4-step delivery arc ───────── */}
      <section className="gw-band gw-band-white gw-band-roomy" id="delivery-arc">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("arc_badge")}
            title={
              <>
                Brief → PM → Sprint → <span className="text-gradient-brand">Launch</span>
              </>
            }
            description={t("arc_desc")}
          />
          <DeliveryArc onStepClick={() => onSelectScreen("process")} />
        </div>
      </section>

      {/* ───────── 5. PORCELAIN BAND — instant estimator ───────── */}
      <section id="estimator" className="gw-band gw-band-porcelain gw-band-roomy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-border bg-surface mx-auto max-w-4xl space-y-8 rounded-2xl border p-8 shadow-[0_4px_16px_rgba(16,27,64,0.07)] sm:p-12">
            <div className="space-y-3 text-center">
              <span className="gw-eyebrow">
                <Sliders className="h-3.5 w-3.5" aria-hidden="true" />
                {t("estimator_title")}
              </span>
              <h2 className="text-foreground font-display text-3xl font-black tracking-tight sm:text-4xl">
                {t("estimator_title")}
              </h2>
              <p className="text-muted-foreground mx-auto max-w-xl text-sm">
                {t("estimator_desc")}
              </p>
            </div>

            {/* Step 1: department chips */}
            <div className="space-y-3">
              <label className="text-muted-foreground block text-xs font-bold tracking-wider uppercase">
                {t("label_select_service")}
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SERVICE_DEPARTMENTS.map((dept) => {
                  const { icon: Icon, shortName } = departmentProfile(dept.id);
                  const selected = calculatorDept === dept.id;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => setCalculatorDept(dept.id)}
                      className={`flex items-center gap-2 truncate rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                        selected
                          ? "border-primary bg-primary text-white shadow-lg"
                          : "border-border bg-surface-raised text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: scope & speed tiers */}
            <div className="space-y-3">
              <label className="text-muted-foreground block text-xs font-bold tracking-wider uppercase">
                {t("label_project_tier")}
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {getTierOptions(calculatorDept).map((tier) => {
                  const selected = calculatorTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      onClick={() =>
                        setCalculatorTier(tier.id as Parameters<typeof setCalculatorTier>[0])
                      }
                      className={`rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? "border-primary bg-brand-subtle shadow-lg"
                          : "border-border bg-surface-raised hover:border-primary/50"
                      }`}
                    >
                      <div className="text-foreground text-xs font-bold">{tier.title}</div>
                      <div className="text-muted-foreground mt-1 text-[11px]">{tier.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live calculation output */}
            <div className="border-border bg-surface-raised flex flex-col items-center justify-between gap-6 rounded-2xl border p-6 sm:p-8 md:flex-row">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {regionalResult
                    ? `${t("label_instant_budget")} (${currencies[currency]?.name})`
                    : t("label_custom_scope")}
                </span>

                {regionalResult ? (
                  <>
                    <div className="text-success font-mono text-3xl font-extrabold sm:text-4xl">
                      {regionalResult.price}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {t("label_estimated_delivery")}{" "}
                      <strong className="text-foreground font-mono">{regionalResult.weeks}</strong>{" "}
                      · {t("label_includes_pm_escrow")}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-success text-2xl font-extrabold sm:text-3xl">
                      {t("label_lets_talk_quote")}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {t("label_no_fixed_price_desc")}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={onOpenBriefWizard}
                className="from-primary to-highlight inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-8 py-4 text-xs font-extrabold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03] md:w-auto"
              >
                <span>
                  {regionalResult ? t("btn_generate_proposal") : t("btn_start_custom_scoping")}
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 6. WHITE BAND — verified case studies + feedback ───────── */}
      <section className="gw-band gw-band-white gw-band-roomy" id="case-studies">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              align="left"
              eyebrow={t("section_results_badge")}
              title={
                <>
                  Verified work, <span className="text-gradient-brand">named clients</span>
                </>
              }
              description={t("section_results_desc")}
            />
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              {caseStudiesData.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCaseIdx(i)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                    activeCaseIdx === i
                      ? "bg-primary text-white shadow-lg"
                      : "border-border bg-surface-raised text-muted-foreground hover:border-primary/50 border"
                  }`}
                >
                  {c.clientName}
                </button>
              ))}
            </div>
          </div>

          {/* Active case study spotlight — white container card */}
          {currentCase && (
            <article className="border-border bg-surface grid grid-cols-1 items-center gap-10 rounded-2xl border p-8 shadow-[0_4px_16px_rgba(16,27,64,0.07)] sm:p-10 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-brand-subtle text-brand-soft border-primary/25 rounded-md border px-3 py-1 text-xs font-bold">
                    {currentCase.industry}
                  </span>
                  {currentCase.year && (
                    <span className="text-muted-foreground font-mono text-xs">
                      {t("label_completed")} {currentCase.year}
                    </span>
                  )}
                  {currentCase.projectDuration && (
                    <span className="text-success font-mono text-xs">
                      • {currentCase.projectDuration}
                    </span>
                  )}
                </div>

                <h3 className="text-foreground font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                  {currentCase.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {currentCase.summary ?? currentCase.solution}
                </p>

                {/* Verified metrics — only rendered when real, disclosed data exists */}
                {currentCase.measurableOutcomes.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
                    {currentCase.measurableOutcomes.slice(0, 4).map((metric, i) => (
                      <div
                        key={i}
                        className="border-border bg-surface-raised rounded-xl border p-3.5"
                      >
                        <div className="text-success font-mono text-lg font-black">
                          {metric.metric}
                        </div>
                        <div className="text-muted-foreground mt-0.5 line-clamp-2 text-[10px]">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-[11px]">
                    {currentCase.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="border-border bg-surface-raised text-foreground/80 rounded-md border px-2 py-0.5 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </span>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={onOpenBriefWizard}
                    className="bg-primary hover:bg-accent-hover rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-[1.03]"
                  >
                    {t("btn_build_similar")}
                  </button>
                  <button
                    onClick={() => onSelectScreen("case-study")}
                    className="text-brand-soft inline-flex items-center gap-1 text-xs font-bold hover:underline"
                  >
                    <span>{t("btn_read_full_dossier")}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="gw-photo-plate border-border bg-slate-950 relative h-72 overflow-hidden rounded-2xl border shadow-xl sm:h-96">
                  <img
                    src={currentCase.heroImage}
                    alt={currentCase.clientName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="text-slate-300 absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/80 p-4 text-xs backdrop-blur-md">
                    <span>
                      {t("label_delivered_by_ndh")} · {currentCase.clientName}
                    </span>
                    {currentCase.clientApprovalRecorded && (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono font-bold">
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        {t("label_verified_project")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Client feedback — quotes, tags and attribution */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="gw-eyebrow">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {t("testimonials_badge")}
              </span>
              <h3 className="text-foreground font-display text-xl font-bold tracking-tight sm:text-2xl">
                {t("testimonials_title")}
              </h3>
            </div>
            <p className="text-muted-foreground max-w-3xl text-sm">{t("testimonials_desc")}</p>

            {testimonialCases.length > 0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                {testimonialCases.map((csItem) => {
                  const quote = csItem.testimonial!;
                  return (
                    <figure key={csItem.id} className="gw-card gw-card-hover p-6">
                      <Quote className="text-brand-soft h-5 w-5" aria-hidden="true" />
                      <blockquote className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                        “{quote.quote}”
                      </blockquote>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="border-border text-muted-foreground rounded-md border bg-surface-raised px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase">
                          {csItem.industry.split("/")[0]?.trim()}
                        </span>
                        {quote.verifiedNDH && (
                          <span className="border-success/30 text-success rounded-md border bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase">
                            Verified
                          </span>
                        )}
                      </div>
                      <figcaption className="border-border mt-4 border-t pt-4">
                        <div className="text-foreground text-sm font-bold">{quote.author}</div>
                        <div className="text-muted-foreground text-xs">{quote.title}</div>
                        <div className="text-brand-soft mt-1 font-mono text-[10px] tracking-wide uppercase">
                          {quote.company}
                        </div>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => onSelectScreen("case-study")}
                className="text-brand-soft inline-flex items-center gap-2 text-sm font-bold hover:underline"
              >
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Read the full case-study dossiers
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 7. NAVY ANCHOR BAND — final CTA ───────── */}
      <section className="band-dark gw-band-anchor">
        <div
          className="gw-glow-cyan -top-24 left-1/2 h-[300px] w-[640px] -translate-x-1/2"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-3xl space-y-6 px-4 text-center sm:px-6">
          <span className="gw-eyebrow">
            <span className="gw-eyebrow-dot" aria-hidden="true" />
            Managed Digital Bureau
          </span>
          <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
            {t("cta_title")}
          </h2>
          <p className="text-[var(--eco-on-dark-muted)] text-base leading-relaxed sm:text-lg">
            {t("cta_desc")}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
            <button
              onClick={onOpenBriefWizard}
              className="from-eco-electric to-eco-cyan text-eco-dark inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r px-10 py-4 text-sm font-extrabold shadow-2xl shadow-cyan-500/25 transition-transform hover:scale-[1.03] sm:w-auto"
            >
              {t("cta_primary")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => onSelectScreen("contact")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.06] px-10 py-4 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/[0.12] sm:w-auto"
            >
              {t("cta_secondary")}
            </button>
          </div>
        </div>
      </section>

      {/* Modal for the service deep-dive */}
      <ServiceDetailModal
        dept={selectedModalDept}
        isOpen={!!selectedModalDept}
        onClose={() => setSelectedModalDept(null)}
        onOpenBriefWizard={onOpenBriefWizard}
      />
    </div>
  );
};

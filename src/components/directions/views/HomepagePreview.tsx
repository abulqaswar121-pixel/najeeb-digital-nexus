import React, { useState } from "react";
import heroImage from "@/assets/ndh-agency-hero.webp";

import { useCurrencyLanguage } from "../../../lib/currencyLanguageStore";
import { useCaseStudies } from "../../../lib/databaseStore";
import { ClientsMarquee } from "../../home/Marquees";
import { DeliveryArc } from "../../home/DeliveryArc";
import { SectionHeading } from "../../home/SectionHeading";
import {
  ShieldCheck,
  ArrowRight,
  LockKeyhole,
  BriefcaseBusiness,
  Plane,
  Truck,
  ShoppingCart,
  TrendingUp,
  Quote,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

interface HomepagePreviewProps {
  direction?: string;
  onOpenBriefWizard: () => void;
  onSelectScreen: (screen: string) => void;
}

/**
 * Agency home page — the Academy "Precision Gateway" rhythm.
 *
 * Band order (deep navy → porcelain → white → porcelain → white → navy):
 *   1. Hero band          #091B3F with ambient cyan glow, animated bureau pill,
 *                         gradient headline highlight, high-contrast stat counters
 *      + continuous 16-department services marquee directly beneath it
 *   2. White strip        real client marquee
 *   3. Porcelain band     four enterprise solution suites + trust banner
 *   4. White band         the 4-step delivery arc (01 … 04)
 *   5. Porcelain band     enterprise engagement model
 *   6. White band         verified case studies + client feedback
 *   7. Navy anchor band   final CTA
 */
export const HomepagePreview: React.FC<HomepagePreviewProps> = ({
  onOpenBriefWizard,
  onSelectScreen,
}) => {
  const { t } = useCurrencyLanguage();
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);

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
      {/* ───────── 1. HERO BAND — agency studio background ───────── */}
      <section className="gw-band gw-band-hero ndh-home-hero relative overflow-hidden pt-14 pb-16 sm:pt-16 sm:pb-20">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          width={1600}
          height={853}
          fetchPriority="high"
          decoding="async"
          className="ndh-home-hero-image"
        />
        <div className="ndh-home-hero-scrim" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            {/* Animated bureau pill */}
            <div className="gw-eyebrow animate-rise-in mx-auto text-xs shadow-lg backdrop-blur-md">
              <span className="gw-eyebrow-dot" aria-hidden="true" />
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("hero_badge")}</span>
            </div>

            <h1 className="font-display text-4xl leading-[1.08] font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="sr-only">
                We build high-performance web platforms, booking systems, and digital infrastructure.
              </span>
              <span aria-hidden="true">
                We build high-performance web platforms, booking systems, and digital infrastructure.
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-base leading-relaxed text-[var(--eco-on-dark-muted)] sm:text-xl">
              Dedicated project management, vetted engineering teams, and milestone-locked delivery for ambitious enterprises.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
              <button
                onClick={onOpenBriefWizard}
                className="from-eco-electric to-eco-cyan text-eco-dark inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r px-8 py-4 text-sm font-extrabold shadow-2xl shadow-cyan-500/25 transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
              >
                <span>Start a Project</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => onSelectScreen("services")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.06] px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/[0.12] sm:w-auto"
              >
                Explore Solutions
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
        </div>
      </section>

      {/* ───────── 2. WHITE STRIP — real clients only ───────── */}
      <ClientsMarquee />

      {/* Enterprise solution suites */}
      <section className="gw-band gw-band-porcelain gw-band-roomy" id="departments">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Enterprise solutions" title="Digital systems built for ambitious operators" description="Purpose-built platforms for complex operations, high transaction volumes, and sustained growth." />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              { icon: Plane, title: "Travel, Tours & Hospitality Systems", description: "Multi-currency booking engines, reservation management, payment integrations, and automated customer SMS/email workflows." },
              { icon: Truck, title: "Import, Export & Logistics Portals", description: "Real-time consignment tracking, client clearance dashboards, document generation, and customs management." },
              { icon: ShoppingCart, title: "High-Volume E-Commerce & Marketplaces", description: "Custom online stores, multi-vendor support, automated inventory sync, and seamless debit/credit card and bank checkout." },
              { icon: BriefcaseBusiness, title: "Corporate Web & Financial Infrastructure", description: "High-security, lightning-fast web systems for investment, consulting, corporate holding companies, and fintech." },
            ].map(({ icon: Icon, title, description }) => (
              <article key={title} className="gw-card flex min-w-0 flex-col gap-5 p-6 sm:p-8">
                <Icon className="text-brand-soft h-7 w-7" aria-hidden="true" />
                <h3 className="font-display text-2xl font-bold">{title}</h3>
                <p className="text-muted-foreground flex-1 text-sm leading-relaxed">{description}</p>
                <button onClick={onOpenBriefWizard} className="bg-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white sm:w-fit">Scope this Solution <ArrowRight className="h-4 w-4" /></button>
              </article>
            ))}
          </div>
          <div className="rounded-2xl bg-[#091B3F] p-6 text-white sm:p-8">
            <h3 className="font-display text-2xl font-bold">Guaranteed Delivery &amp; Global Payment Protection</h3>
            <ul className="mt-5 grid gap-4 text-sm leading-relaxed text-white/85 md:grid-cols-3">
              <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-cyan-300" />Milestone-locked releases (pay only when deliverables are approved)</li>
              <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-cyan-300" />International payment flexibility (Paystack, International Wire Transfer, or Upwork Direct Contract Escrow)</li>
              <li className="flex gap-3"><LockKeyhole className="h-5 w-5 shrink-0 text-cyan-300" />Mutual Non-Disclosure Agreement (NDA) signed prior to project kickoff</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── 4. WHITE BAND — the 4-step delivery arc ───────── */}
      <section className="gw-band gw-band-white gw-band-roomy" id="delivery-arc">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("arc_badge")}
            title={t("home_arc_title")}
            description={t("arc_desc")}
          />
          <DeliveryArc onStepClick={() => onSelectScreen("process")} />
        </div>
      </section>

      {/* Enterprise engagement model */}
      <section id="engagement-model" className="gw-band gw-band-porcelain gw-band-roomy">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="gw-card space-y-8 p-6 sm:p-10">
            <div className="space-y-3 text-center">
              <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">Enterprise Engagement Model</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-sm">A transparent, accountable delivery partnership designed around outcomes—not price sliders.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Fixed Milestones", "Dedicated Technical PM", "Full Code Ownership", "SLA Guarantees"].map((item) => <div key={item} className="rounded-xl border border-border bg-surface-raised p-5 font-bold"><ShieldCheck className="mb-3 h-5 w-5 text-brand-soft" />{item}</div>)}
            </div>
            <div className="text-center"><button onClick={onOpenBriefWizard} className="bg-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-extrabold text-white sm:w-auto">Request a Custom Scope <ArrowRight className="h-4 w-4" /></button></div>
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
              title={t("home_results_title")}
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
                            {t("verified")}
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
                {t("home_all_case_studies")}
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
            {t("cta_badge")}
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

    </div>
  );
};

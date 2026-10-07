import React from "react";
import {
  ShieldCheck,
  ArrowRight,
  GitBranch,
  Lock,
  Layers,
  FileCheck,
  Clock,
  Users,
} from "lucide-react";
import { MainNavView } from "../layout/navViews";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";
import { DeliveryArc, DELIVERY_STEPS } from "../home/DeliveryArc";
import { SectionHeading } from "../home/SectionHeading";

interface ProcessViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

/**
 * How It Works — the 4-step delivery arc, on the Academy rhythm:
 * a deep-navy page hero followed by a porcelain body of elevated white cards.
 * The operational detail that used to be spread over five steps now hangs off
 * the same four steps the home page advertises, so the story never diverges.
 */
export const ProcessView: React.FC<ProcessViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  const { t } = useCurrencyLanguage();

  // The operational detail behind each of the four arc steps.
  const stepDetail: Record<string, { points: string[] }> = {
    "01": {
      points: [
        "AI-assisted brief triage decomposes your requirements in under 24 hours",
        "Milestone locking: each deliverable, date and price is written down before kickoff",
        "Mutual NDA executed on request, before any sensitive material changes hands",
      ],
    },
    "02": {
      points: [
        "A named lead project manager owns your engagement end to end",
        "Specialist talent matched on proven domain capability, not availability",
        "One accountable point of contact — no client/talent coordination overhead",
      ],
    },
    "03": {
      points: [
        "Weekly verified deliverables land in your Client Workspace for review",
        "Escrow releases per approved milestone, so payment tracks accepted work",
        "PM QA gates: automated checks, latency and accessibility review before preview",
      ],
    },
    "04": {
      points: [
        "Production deployment with rollback plan and monitoring in place",
        "Clean Git repository + design-token handoff, full IP assignment on signoff",
        "SLA-backed support window after launch, with a documented escalation path",
      ],
    },
  };

  const safeguards = [
    {
      icon: Clock,
      tone: "text-success",
      title: "99.4% On-Time SLA",
      text: "Every milestone is bound by contractual delivery deadlines, monitored daily.",
    },
    {
      icon: Lock,
      tone: "text-brand-soft",
      title: "Confidential Identity Barrier",
      text: "Clients and talent never exchange private contact details — total corporate confidentiality.",
    },
    {
      icon: FileCheck,
      tone: "text-brand-soft",
      title: "Total IP Assignment",
      text: "Repo copyrights, design tokens and credentials transfer immediately on final signoff.",
    },
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Page hero — deep navy band */}
      <section className="gw-page-hero relative overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" aria-hidden="true" />
        <div
          className="gw-glow-cyan top-0 left-1/3 h-[280px] w-[560px] -translate-x-1/2"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
          <span className="gw-eyebrow">
            <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
            {t("process_badge")}
          </span>
          <h1 className="font-display max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            {t("process_title")}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed">{t("process_desc")}</p>
        </div>
      </section>

      {/* Porcelain body */}
      <div className="gw-page-body">
        <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <SectionHeading
              align="left"
              eyebrow={t("arc_badge")}
              title={
                <>
                  Four steps, <span className="text-gradient-brand">no surprises</span>
                </>
              }
              description="Every NDH engagement runs the same documented arc — whether it is a three-day landing page or a multi-sprint fintech platform."
            />
            <DeliveryArc />
          </div>

          {/* Step detail — one elevated white card per step */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {DELIVERY_STEPS.map((step) => {
              const Icon = step.icon;
              const detail = stepDetail[step.num];
              return (
                <article key={step.num} className="gw-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="gw-icon-pill">
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-muted-foreground/60 font-mono text-[11px] font-bold tracking-[0.2em]">
                        STEP {step.num}
                      </div>
                      <h2 className="text-foreground font-display text-base font-bold tracking-tight">
                        {step.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{step.text}</p>
                  <ul className="mt-4 space-y-2">
                    {detail?.points.map((point) => (
                      <li
                        key={point}
                        className="text-muted-foreground flex items-start gap-2 text-xs"
                      >
                        <ShieldCheck
                          className="text-success mt-0.5 h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          {/* Quality safeguards */}
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Built-in safeguards"
              title="What protects your budget and your code"
              description="Three guarantees sit underneath the arc on every engagement."
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {safeguards.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="gw-card p-6">
                    <span className="gw-icon-pill">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3 className="text-foreground mt-4 text-base font-bold">{item.title}</h3>
                    <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* White CTA card */}
          <div className="gw-card items-center p-8 text-center sm:p-10">
            <Layers className="text-brand-soft mx-auto h-8 w-8" aria-hidden="true" />
            <h3 className="text-foreground font-display mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Experience the managed delivery difference
            </h3>
            <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm">
              Submit your requirements to receive a structured milestone proposal and meet your
              dedicated Project Manager.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={onOpenBriefWizard}
                className="from-primary to-highlight inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-8 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
              >
                {t("cta_primary")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => onSelectView("talent-network")}
                className="border-border text-foreground hover:border-primary/50 inline-flex items-center gap-2 rounded-xl border px-8 py-3.5 text-xs font-bold transition-colors"
              >
                <Users className="h-4 w-4 text-brand-soft" aria-hidden="true" />
                Meet the talent network
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

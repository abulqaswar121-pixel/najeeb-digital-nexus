import React, { useState } from "react";
import { CaseStudy } from "../../../types/ndh";
import { useCaseStudies } from "../../../lib/databaseStore";
import {
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Eye,
  EyeOff,
  Quote,
  Sparkles,
  Layers,
  Check,
} from "lucide-react";

interface CaseStudyPreviewProps {
  direction?: string;
  onOpenBriefWizard: () => void;
}

export const CaseStudyPreview: React.FC<CaseStudyPreviewProps> = ({ onOpenBriefWizard }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("cs-001");
  const [anonymizePreview, setAnonymizePreview] = useState<boolean>(false);

  const caseStudiesData = useCaseStudies();
  const cs: CaseStudy | undefined =
    caseStudiesData.find((c) => c.id === selectedCaseId) || caseStudiesData[0];

  if (!cs) {
    return (
      <div className="bg-background text-muted-foreground flex min-h-screen items-center justify-center font-sans">
        <p className="text-sm">Loading case studies…</p>
      </div>
    );
  }

  const displayName = anonymizePreview ? "Confidential Tier-1 Enterprise" : cs.clientName;

  return (
    <div className="min-h-screen font-sans">
      {/* Page hero — deep navy band with the dossier switcher */}
      <section className="gw-page-hero relative overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="gw-glow-cyan top-0 right-1/4 h-[280px] w-[560px]" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Case Study Switcher & Confidentiality Toolbar */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/12 bg-white/[0.06] p-4 backdrop-blur-md md:flex-row md:items-center">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <span className="mr-2 text-xs font-bold text-[var(--eco-on-dark-muted)] whitespace-nowrap">
                Featured Case Studies:
              </span>
              {caseStudiesData.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCaseId === c.id
                      ? "bg-eco-electric text-eco-dark shadow-lg"
                      : "border border-white/15 bg-white/[0.06] text-white/80 hover:border-white/35 hover:text-white"
                  }`}
                >
                  {c.clientName}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAnonymizePreview(!anonymizePreview)}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-white/85 transition-colors hover:border-white/35 hover:text-white"
              >
                {anonymizePreview ? (
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span>{anonymizePreview ? "Anonymized View" : "Verified Client View"}</span>
              </button>
            </div>
          </div>

          {/* Case Study Hero */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="gw-eyebrow">{cs.industry}</span>
              {cs.projectDuration && (
                <span className="font-mono text-xs text-[var(--eco-on-dark-muted)]">
                  Duration: {cs.projectDuration}
                </span>
              )}
              {cs.year && (
                <span className="font-mono text-xs text-[var(--eco-on-dark-muted)]">
                  • Completed {cs.year}
                </span>
              )}
              {cs.clientApprovalRecorded && (
                <span className="flex items-center gap-1.5 rounded border border-emerald-400/35 bg-emerald-400/10 px-2.5 py-0.5 font-mono text-xs text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Publishing Consent</span>
                </span>
              )}
            </div>

            <h1 className="font-display max-w-4xl text-3xl leading-tight font-black tracking-tight text-white sm:text-5xl">
              {cs.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--eco-on-dark-muted)]">
              <div>
                Client: <strong className="text-white">{displayName}</strong>
              </div>
              <span>•</span>
              <div>
                Headquarters: <strong className="text-white">{cs.location}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Porcelain body — the full dossier in elevated white cards */}
      <div className="gw-page-body">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          {/* Hero Image & Metric Highlights Banner */}
          <div className="gw-photo-plate border-border relative overflow-hidden rounded-2xl border shadow-[0_4px_16px_rgba(16,27,64,0.07)]">
            <img
              src={cs.heroImage}
              alt={cs.title}
              className="w-full h-80 sm:h-96 lg:h-[440px] object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

            {/* Metric Telemetry Cards Overlay (only shown when real, disclosed metrics exist) */}
            {cs.measurableOutcomes.length > 0 && (
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {cs.measurableOutcomes.map((metric, i) => (
                  <div
                    key={i}
                    className="text-slate-200 space-y-1 rounded-2xl border border-white/10 bg-slate-950/85 p-4 shadow-lg backdrop-blur-md"
                  >
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                      {metric.metric}
                    </div>
                    <div className="text-xs font-bold text-white leading-tight">{metric.label}</div>
                    <div className="text-[11px] text-slate-300 line-clamp-1">
                      {metric.evidenceNote}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Structured Case Study Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              {/* The Challenge */}
              <div className="gw-card space-y-3 p-8">
                <div className="text-brand-soft flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
                  <Clock className="h-4 w-4" />
                  <span>01. The Challenge & Technical Bottlenecks</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Operational Breakdown Prior to NDH Engagement
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">{cs.challenge}</p>
              </div>

              {/* Strategic Intervention */}
              <div className="gw-card space-y-3 p-8">
                <div className="text-success flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
                  <TrendingUp className="h-4 w-4" />
                  <span>02. The Managed Bureau Solution</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Architecture, Execution & QA Framework
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">{cs.solution}</p>
              </div>

              {/* Client Testimonial */}
              {cs.testimonial && (
                <div className="border-primary/25 bg-brand-subtle space-y-4 rounded-2xl border p-8 shadow-[0_4px_16px_rgba(16,27,64,0.07)]">
                  <Quote className="text-brand-soft h-8 w-8 opacity-80" />
                  <blockquote className="text-foreground text-base leading-relaxed font-medium italic">
                    "{cs.testimonial.quote}"
                  </blockquote>
                  <div className="border-border flex items-center justify-between border-t pt-3">
                    <div>
                      <div className="font-bold text-white text-sm">{cs.testimonial.author}</div>
                      <div className="text-brand-soft text-xs">{cs.testimonial.title}</div>
                    </div>
                    <div className="text-muted-foreground font-mono text-xs">
                      {cs.testimonial.company}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Tech Stack, Department & Project Scope */}
            <div className="lg:col-span-4 space-y-6">
              <div className="gw-card space-y-6 p-6">
                <h3 className="text-base font-bold text-white">Project Metadata</h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="text-slate-400 uppercase font-semibold text-[10px]">
                      Managing Lead
                    </div>
                    <div className="text-white font-bold mt-0.5">
                      {cs.leadPM ?? "NDH Delivery Lead"}
                    </div>
                  </div>

                  {cs.teamSize !== undefined && (
                    <div>
                      <div className="text-slate-400 uppercase font-semibold text-[10px]">
                        Team Composition
                      </div>
                      <div className="text-white font-bold mt-0.5">
                        {cs.teamSize} Vetted Specialists
                      </div>
                    </div>
                  )}

                  {cs.projectDuration && (
                    <div>
                      <div className="text-slate-400 uppercase font-semibold text-[10px]">
                        Delivery Cycle
                      </div>
                      <div className="text-emerald-400 font-mono font-bold mt-0.5">
                        {cs.projectDuration}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-border space-y-2 border-t pt-4">
                  <div className="text-slate-400 uppercase font-semibold text-[10px]">
                    Technology Stack
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cs.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="border-border bg-surface-raised text-foreground/80 rounded-md border px-2.5 py-1 font-mono text-[11px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {cs.liveUrl && (
                  <div className="border-border border-t pt-4">
                    <a
                      href={cs.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-border bg-surface-raised text-success hover:border-primary/50 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold shadow-sm transition-colors"
                    >
                      <span>Visit Live Project — {cs.liveUrlLabel ?? cs.liveUrl}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={onOpenBriefWizard}
                    className="from-primary to-highlight flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r py-3 text-xs font-extrabold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
                  >
                    <span>Scope Similar Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

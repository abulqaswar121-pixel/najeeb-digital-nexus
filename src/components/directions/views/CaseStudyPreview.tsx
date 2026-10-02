import React, { useState } from "react";
import { CaseStudy } from "../../../types/ndh";
import { CASE_STUDIES } from "../../../data/mockData";
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

  const cs: CaseStudy = CASE_STUDIES.find((c) => c.id === selectedCaseId) || CASE_STUDIES[0]!;
  const displayName = anonymizePreview ? "Confidential Tier-1 Enterprise" : cs.clientName;

  return (
    <div className="min-h-screen bg-[#090D1A] text-slate-100 py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Case Study Switcher & Confidentiality Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <span className="text-xs font-bold text-slate-300 mr-2 whitespace-nowrap">
              Featured Case Studies:
            </span>
            {CASE_STUDIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCaseId === c.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-950 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500"
                }`}
              >
                {c.clientName}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAnonymizePreview(!anonymizePreview)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
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
            <span className="px-3 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800 text-xs font-semibold">
              {cs.industry}
            </span>
            {cs.projectDuration && (
              <span className="text-xs text-slate-400 font-mono">
                Duration: {cs.projectDuration}
              </span>
            )}
            {cs.year && (
              <span className="text-xs text-slate-400 font-mono">• Completed {cs.year}</span>
            )}
            {cs.clientApprovalRecorded && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/80">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Publishing Consent</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            {cs.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <div>
              Client: <strong className="text-white">{displayName}</strong>
            </div>
            <span>•</span>
            <div>
              Headquarters: <strong className="text-white">{cs.location}</strong>
            </div>
          </div>
        </div>

        {/* Hero Image & Metric Highlights Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
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
                  className="p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-white space-y-1 shadow-lg"
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
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-wider font-bold">
                <Clock className="w-4 h-4" />
                <span>01. The Challenge & Technical Bottlenecks</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Operational Breakdown Prior to NDH Engagement
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{cs.challenge}</p>
            </div>

            {/* Strategic Intervention */}
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>02. The Managed Bureau Solution</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Architecture, Execution & QA Framework
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{cs.solution}</p>
            </div>

            {/* Client Testimonial */}
            {cs.testimonial && (
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/40 shadow-xl space-y-4">
                <Quote className="w-8 h-8 text-blue-400 opacity-80" />
                <blockquote className="text-base text-slate-100 font-medium italic leading-relaxed">
                  "{cs.testimonial.quote}"
                </blockquote>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{cs.testimonial.author}</div>
                    <div className="text-xs text-blue-300">{cs.testimonial.title}</div>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">{cs.testimonial.company}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Tech Stack, Department & Project Scope */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
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

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="text-slate-400 uppercase font-semibold text-[10px]">
                  Technology Stack
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cs.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-200 border border-slate-700 font-mono text-[11px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {cs.liveUrl && (
                <div className="pt-4 border-t border-slate-800">
                  <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-slate-950 border border-slate-700 hover:border-emerald-500/70 text-emerald-400 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Visit Live Project — {cs.liveUrlLabel ?? cs.liveUrl}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={onOpenBriefWizard}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
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
  );
};

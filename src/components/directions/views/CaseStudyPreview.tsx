import React, { useState } from 'react';
import { DesignDirectionId, CaseStudy } from '../../../types/ndh';
import { DIRECTION_CONFIGS } from '../DirectionStyles';
import { CASE_STUDIES } from '../../../data/mockData';
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
} from 'lucide-react';

interface CaseStudyPreviewProps {
  direction: DesignDirectionId;
  onOpenBriefWizard: () => void;
}

export const CaseStudyPreview: React.FC<CaseStudyPreviewProps> = ({ direction, onOpenBriefWizard }) => {
  const config = DIRECTION_CONFIGS[direction];
  const [selectedCaseId, setSelectedCaseId] = useState<string>('cs-001');
  const [anonymizePreview, setAnonymizePreview] = useState<boolean>(false);

  const cs: CaseStudy = CASE_STUDIES.find((c) => c.id === selectedCaseId) || CASE_STUDIES[0]!;

  const displayName = anonymizePreview ? 'Confidential Tier-1 Enterprise' : cs.clientName;

  return (
    <div className={`min-h-screen ${config.containerBg} py-12 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Case Study Switcher & Confidentiality Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <span className="text-xs font-semibold text-foreground mr-1 whitespace-nowrap">Select Case Study:</span>
            {CASE_STUDIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCaseId === c.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-background hover:bg-muted text-muted-foreground border border-border'
                }`}
              >
                {c.slug.split('-')[0]?.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAnonymizePreview(!anonymizePreview)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground hover:border-primary transition-colors"
            >
              {anonymizePreview ? <EyeOff className="w-3.5 h-3.5 text-amber-500" /> : <Eye className="w-3.5 h-3.5 text-primary" />}
              <span>{anonymizePreview ? 'Confidential Anonymized View' : 'Verified Public View'}</span>
            </button>
          </div>
        </div>

        {/* Case Study Hero */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={config.badgeStyle}>{cs.industry}</span>
            <span className="text-xs text-muted-foreground font-mono">Duration: {cs.projectDuration}</span>
            <span className="text-xs text-muted-foreground font-mono">• Completed {cs.year}</span>
            {cs.clientApprovalRecorded && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                <span>Client Publishing Consent Recorded</span>
              </span>
            )}
          </div>

          <h1 className={`text-3xl sm:text-4xl lg:text-5xl ${config.typographyHeading} text-foreground leading-tight`}>
            {cs.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div>
              Client: <strong className="text-foreground">{displayName}</strong>
            </div>
            <span>•</span>
            <div>
              Location: <strong className="text-foreground">{cs.location}</strong>
            </div>
          </div>
        </div>

        {/* Hero Image & Metric Highlights Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
          <img src={cs.heroImage} alt={cs.title} className="w-full h-80 sm:h-96 lg:h-[420px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

          {/* Metric Telemetry Cards Overlay */}
          <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cs.measurableOutcomes.map((metric, i) => (
              <div key={i} className="p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white space-y-1">
                <div className={`text-2xl sm:text-3xl font-bold font-mono text-emerald-400`}>{metric.metric}</div>
                <div className="text-xs font-semibold leading-tight">{metric.label}</div>
                <div className="text-[10px] text-white/70 line-clamp-1">{metric.evidenceNote}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Structured Case Study Narrative (Challenge, Insight, Strategy, Process, Solution) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {/* The Challenge */}
            <div className={`p-6 sm:p-8 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-3`}>
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>01. The Challenge & Core Bottleneck</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">Operational Breakdown Before NDH Engagement</h2>
              <p className={`text-sm ${config.subtext} leading-relaxed`}>{cs.challenge}</p>
            </div>

            {/* Strategic Insight */}
            <div className={`p-6 sm:p-8 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-3`}>
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>02. The Strategic Insight</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">Behavioral Research & Technical Opportunity</h2>
              <p className={`text-sm ${config.subtext} leading-relaxed`}>{cs.insight}</p>
            </div>

            {/* Strategy & Architecture */}
            <div className={`p-6 sm:p-8 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-3`}>
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>03. The Strategy & Squad Composition</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">Dedicated PM Leadership & Talent Orchestration</h2>
              <p className={`text-sm ${config.subtext} leading-relaxed`}>{cs.strategy}</p>
            </div>

            {/* The Solution & Measurable Impact */}
            <div className={`p-6 sm:p-8 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-4`}>
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>04. Production Deployment & Solution</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">Deliverables & Audited Commercial Results</h2>
              <p className={`text-sm ${config.subtext} leading-relaxed`}>{cs.solution}</p>

              <div className="space-y-3 pt-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-foreground">Audited Evidence Notes:</h4>
                <div className="space-y-2">
                  {cs.measurableOutcomes.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-background border border-border text-xs flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">{item.metric} {item.label}:</strong>{' '}
                        <span className="text-muted-foreground">{item.evidenceNote}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Client Testimonial */}
            {cs.testimonial && (
              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-4">
                <Quote className="w-8 h-8 text-primary/40" />
                <p className={`text-base sm:text-lg font-medium italic text-foreground leading-relaxed`}>
                  "{cs.testimonial.quote}"
                </p>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="font-bold text-foreground text-sm">
                      {anonymizePreview ? 'Confidential Executive' : cs.testimonial.author}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {cs.testimonial.title}, {anonymizePreview ? 'Tier-1 Enterprise' : cs.testimonial.company}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-[10px] flex items-center gap-1 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    <span>NDH Verified Review</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Tech Stack, PM Meta, Action Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-4 shadow-lg`}>
              <h3 className="text-xs font-mono uppercase tracking-wider text-foreground">Project Metadata</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold text-foreground uppercase text-[11px]">{cs.department.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Sprint Duration:</span>
                  <span className="font-semibold text-foreground">{cs.projectDuration}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Quality Score:</span>
                  <span className="font-semibold text-emerald-500 font-mono">4.98 / 5.0</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-mono text-emerald-400 uppercase text-[11px]">Production Live</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Tech & Tools:</div>
                <div className="flex flex-wrap gap-1.5">
                  {cs.techStack.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-background border border-border text-[11px] font-mono text-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-3">
                <button
                  onClick={onOpenBriefWizard}
                  className={`w-full py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 ${config.accentBtn}`}
                >
                  <span>Build Similar Solution</span>
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

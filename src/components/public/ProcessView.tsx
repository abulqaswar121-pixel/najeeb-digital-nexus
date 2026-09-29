import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Lock,
  GitBranch,
  Layers,
  FileCheck,
} from 'lucide-react';
import { MainNavView } from '../layout/AppNavbar';

interface ProcessViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const ProcessView: React.FC<ProcessViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  const steps = [
    {
      num: '01',
      title: 'Discovery & Brief Scoping',
      description: 'You submit a tailored brief. Our automated triage and department leads decompose requirements into measurable sprint milestones within 24 hours.',
    },
    {
      num: '02',
      title: 'Tailored Milestone Proposal & Mutual NDA',
      description: 'We draft a formal proposal specifying exact deliverables, timelines, fixed pricing in USD/NGN, and execute bilateral non-disclosure agreements.',
    },
    {
      num: '03',
      title: 'Dedicated PM Allocation & Vetted Squad Assembly',
      description: 'A principal Project Manager assumes ownership and matches vetted internal talents based on proven domain capability and tier certification.',
    },
    {
      num: '04',
      title: 'Sprint Execution & Strict PM QA Gates',
      description: 'Internal talents build within isolated sandboxes. Deliverables must pass automated code testing, latency benchmarks, and PM audits before client preview.',
    },
    {
      num: '05',
      title: 'Client Review, Sign-Off & Escrow Release',
      description: 'You inspect the verified artifacts in your Client Workspace, provide feedback or sign off. Full intellectual property transfers instantly upon approval.',
    },
  ];

  return (
    <div className="bg-[#080C14] text-[#F1F5F9] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
            <GitBranch className="w-3.5 h-3.5" />
            <span>The NDH Operational Delivery Framework</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            How We Work: Precision Sprints with Zero Friction.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Our five-stage delivery operating system guarantees transparency, strict intellectual property defense, and audited quality assurance at every sprint milestone.
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#0F172A]/80 border border-blue-900/40 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-xl hover:border-blue-700/60 transition-colors"
            >
              <div className="md:col-span-2">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-blue-400">
                  {step.num}
                </span>
              </div>
              <div className="md:col-span-10 space-y-2">
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Safeguards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-[#0F172A]/60 border border-slate-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h4 className="font-bold text-base text-white">99.4% On-Time SLA</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every milestone is bound by contractual delivery deadlines. Real-time telemetry monitors progress daily.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F172A]/60 border border-slate-800 space-y-3">
            <Lock className="w-8 h-8 text-blue-400" />
            <h4 className="font-bold text-base text-white">Confidential Identity Barrier</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clients and internal talents communicate exclusively via the assigned PM. Zero data or financial leaks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F172A]/60 border border-slate-800 space-y-3">
            <FileCheck className="w-8 h-8 text-purple-400" />
            <h4 className="font-bold text-base text-white">100% IP Transferred</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full copyright, source code repositories, design tokens, and vector masters transfer immediately upon settlement.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onOpenBriefWizard}
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xl shadow-blue-600/30 transition-all inline-flex items-center gap-2"
          >
            <span>Start a Project with NDH</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

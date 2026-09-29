import React from 'react';
import { useJourneyState } from '../../lib/journeyStore';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Lock,
  Building,
  User,
  Clock,
  DollarSign,
  FileText,
  Upload,
  Send,
  ExternalLink,
  ChevronRight,
  Layers,
  Terminal,
  Briefcase,
  AlertCircle,
  CreditCard,
  Check,
} from 'lucide-react';

interface InteractiveJourneyWalkthroughProps {
  onNavigateScreen?: (screen: string) => void;
}

export const InteractiveJourneyWalkthrough: React.FC<InteractiveJourneyWalkthroughProps> = ({ onNavigateScreen }) => {
  const { state, updateState, resetState } = useJourneyState();

  const stages = [
    {
      step: 1,
      title: '1. Visitor Explores & Submits Detailed Brief',
      actor: 'Prospective Client (Savannah Health)',
      roleBadge: 'Client / Public',
      isCompleted: state.leadSubmitted,
      description: 'Visitor chooses Web & App Development, specifies clinical reporting platform scope ($42,000 USD / ₦63M NGN), and requests mutual NDA.',
    },
    {
      step: 2,
      title: '2. Admin Qualifies Lead & Routes to PM Lead',
      actor: 'Operations Admin (Fatima Bello)',
      roleBadge: 'Ops Admin',
      isCompleted: state.leadQualified,
      description: 'Lead score calculated at 96/100. Triage bot routes brief to Principal Project Manager Tariq Al-Najeeb.',
    },
    {
      step: 3,
      title: '3. PM Generates Formal Proposal & Milestones',
      actor: 'Project Manager (Tariq Al-Najeeb)',
      roleBadge: 'Project Manager',
      isCompleted: state.proposalDrafted,
      description: 'PM configures 3 milestone schedules, multi-currency pricing (USD/NGN), 60% gross margin buffer, and sends proposal to client.',
    },
    {
      step: 4,
      title: '4. Client Reviews, Adjusts Scope & Funds Deposit',
      actor: 'Client Executive (Dr. Chinedu Eze)',
      roleBadge: 'Client Owner',
      isCompleted: state.depositPaid,
      description: 'Client requests NDPR compliance clause adjustment in Section 3, accepts proposal, and funds $15,000 initial milestone deposit via Paystack/Card.',
    },
    {
      step: 5,
      title: '5. PM Creates Sprints & Invites Talent Privately',
      actor: 'Project Manager (Tariq Al-Najeeb)',
      roleBadge: 'Project Manager',
      isCompleted: state.projectCreated,
      description: 'Project code NDH-2026-104 initialized. PM matches Architect-Alpha (Elite Tier) based on skills/availability and sends private task invite.',
    },
    {
      step: 6,
      title: '6. Talent Accepts Task & Starts Sprint Work',
      actor: 'Vetted Talent (Architect-Alpha)',
      roleBadge: 'Internal Talent',
      isCompleted: state.talentStartedWork,
      description: 'Talent reviews anonymized scope (zero client contact details or margin visibility), accepts $4,400 allocation, and commences React 19 sprint.',
    },
    {
      step: 7,
      title: '7. Talent Submits v1.0 & PM Requests Revision',
      actor: 'Talent & PM Collaboration',
      roleBadge: 'Talent + PM',
      isCompleted: state.qaRevisionRequested,
      description: 'Talent submits v1.0 bundle. PM runs automated QA gate and requests latency optimization (<300ms target).',
    },
    {
      step: 8,
      title: '8. Talent Deploys v2.0 with Edge Optimization',
      actor: 'Vetted Talent (Architect-Alpha)',
      roleBadge: 'Internal Talent',
      isCompleted: state.deliverableV2Submitted,
      description: 'Talent optimizes Cloudflare Workers edge nodes, reduces P95 latency to 275ms, and submits v2.0 production bundle.',
    },
    {
      step: 9,
      title: '9. PM Signs Off QA Gate & Publishes Deliverable',
      actor: 'Project Manager (Tariq Al-Najeeb)',
      roleBadge: 'Project Manager',
      isCompleted: state.pmQaApproved,
      description: 'PM approves QA Gate (Score: 5.0/5.0) and formally exposes verified staging preview and security audit to the Client Portal.',
    },
    {
      step: 10,
      title: '10. Client Approves Milestone & Releases Invoice',
      actor: 'Client Executive (Dr. Chinedu Eze)',
      roleBadge: 'Client Owner',
      isCompleted: state.clientMilestoneApproved,
      description: 'Client inspects staging deliverables, signs digital milestone approval, and receives final invoice settlement receipt.',
    },
    {
      step: 11,
      title: '11. Finance Dual-Approval (Maker/Checker) & Payout',
      actor: 'Finance Admin & Managing Director',
      roleBadge: 'Finance Admin',
      isCompleted: state.payoutDisbursed,
      description: 'Amina Yusuf (Finance Admin) logs Maker approval; Najeeb Al-Hassan (MD) logs Checker approval. ₦36,900,000 disbursed via NIBSS bank settlement.',
    },
    {
      step: 12,
      title: '12. Project Nominated & Published as Case Study',
      actor: 'Content Admin & Super Admin',
      roleBadge: 'Content Admin',
      isCompleted: state.caseStudyPublishedLive,
      description: 'Content Admin drafts case study, client provides verified quote & publication consent, published live to public work showcase.',
    },
    {
      step: 13,
      title: '13. Decoupled NDH Academy Cross-Link Exploration',
      actor: 'Visitor / Talent / Client',
      roleBadge: 'Public / Cross-Domain',
      isCompleted: state.academyCrossLinkVisited,
      description: 'Visitor follows discrete footer link to https://academy.ndh.com.ng without mixing agency projects with academy LMS accounts.',
    },
  ];

  const currentActiveStage = stages.find((s) => s.step === state.currentStep) || stages[0]!;

  return (
    <div className="bg-[#080C14] text-[#F1F5F9] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0F172A]/90 border border-blue-900/40 shadow-2xl backdrop-blur-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Primary Journey Walkthrough Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              NDH Agency 13-Stage Operational Walkthrough
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Experience the end-to-end lifecycle of a client engagement from public brief submission, PM triage, private talent matching, QA revision cycles, and milestone sign-off, to dual-approval finance disbursement and case study publishing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetState}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Journey Flow</span>
            </button>
          </div>
        </div>

        {/* Journey Progress Bar */}
        <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-blue-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Stage {state.currentStep} of 13: <strong className="text-blue-400">{currentActiveStage.title}</strong>
            </span>
            <span className="font-mono text-emerald-400">
              {Math.round(((state.currentStep - 1) / 13) * 100)}% Journey Progress
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-blue-900/40">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, ((state.currentStep - 1) / 13) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 2-Column Layout: Left Stage Roadmap / Right Interactive Stage Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Roadmap List */}
          <div className="lg:col-span-5 space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Primary Lifecycle Stages (Click any stage to inspect):
            </h3>

            <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1 no-scrollbar">
              {stages.map((s) => {
                const isCurrent = state.currentStep === s.step;
                const isPassed = s.isCompleted;

                return (
                  <div
                    key={s.step}
                    onClick={() => updateState({ currentStep: s.step })}
                    className={`p-3.5 rounded-xl cursor-pointer border transition-all text-xs flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-400 shadow-lg'
                        : isPassed
                        ? 'bg-[#0F172A]/80 border-emerald-900/40 hover:border-emerald-700/60'
                        : 'bg-[#0F172A]/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></div>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 text-[10px] font-mono flex items-center justify-center text-slate-500">
                          {s.step}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                          {s.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span className="text-blue-400 font-mono text-[10px] uppercase">{s.roleBadge}</span>
                        <span>•</span>
                        <span className="truncate">{s.actor}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Interactive Execution Sandbox */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              {/* Stage Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 font-mono text-[10px] border border-blue-800/60 uppercase">
                    Stage {currentActiveStage.step} Sandbox
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">{currentActiveStage.title}</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">{currentActiveStage.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Actor Role</span>
                  <span className="text-xs font-semibold text-blue-300 font-mono">{currentActiveStage.actor}</span>
                </div>
              </div>

              {/* DYNAMIC STAGE INTERACTIVE SCREENS */}

              {/* STAGE 1: Brief Submission */}
              {state.currentStep === 1 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="font-bold text-white text-sm">Savannah Health Technologies • Discovery Brief</div>
                    <div className="grid grid-cols-2 gap-3 text-slate-300">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Department:</span>
                        <span className="font-semibold text-white">Website & App Development</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Budget Range:</span>
                        <span className="font-mono text-emerald-400">$35,000 - $50,000 USD (₦52.5M - ₦75M NGN)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Authorized Lead:</span>
                        <span>Dr. Chinedu Eze (chinedu@savannahhealth.io)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Mutual NDA:</span>
                        <span className="text-blue-400 font-mono">Requested & Attached</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({ leadSubmitted: true, currentStep: 2 });
                    }}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                  >
                    <span>Execute Step 1: Submit Brief into NDH Operations Queue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 2: Lead Qualification */}
              {state.currentStep === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Lead Triage & AI Scoring Engine</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                        Quality Score: 96/100
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      AI assessment passed. Enterprise clinical requirement validated against NDPR/HIPAA compliance heuristics.
                    </p>
                    <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-300">
                      <strong>Assigned Lead PM:</strong> Tariq Al-Najeeb (Principal Project Manager)
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({ leadQualified: true, currentStep: 3 });
                    }}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                  >
                    <span>Execute Step 2: Qualify Lead & Assign PM Tariq Al-Najeeb</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 3: Proposal Builder */}
              {state.currentStep === 3 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Formal Milestone Proposal Specification</span>
                      <span className="text-emerald-400 font-mono font-bold">$42,000 USD (₦63,000,000 NGN)</span>
                    </div>

                    <div className="space-y-2 text-slate-300">
                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                        <span>Milestone 1: Architectural Blueprint & OpenAPI Spec</span>
                        <span className="font-mono text-white">$12,000 USD</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                        <span>Milestone 2: Edge React 19 Frontend & Biometric KYC</span>
                        <span className="font-mono text-white">$18,000 USD</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                        <span>Milestone 3: Automated Diagnostic API Microservices</span>
                        <span className="font-mono text-white">$12,000 USD</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                      <span>Confidential Agency Margin: <strong>60.0%</strong></span>
                      <span className="text-emerald-400">Talent Cost Cap: $16,800 USD</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({ proposalDrafted: true, proposalSentToClient: true, currentStep: 4 });
                    }}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                  >
                    <span>Execute Step 3: Transmit Formal Proposal to Client Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 4: Client Review, Revision & Deposit */}
              {state.currentStep === 4 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Client Portal • Dr. Chinedu Eze</span>
                      <span className="text-amber-400 font-mono text-[10px]">Proposal Under Review</span>
                    </div>
                    <p className="text-slate-300">
                      Client requested an addition in Section 3 for direct laboratory webhook feeds. PM approved the clause.
                    </p>
                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 flex items-center justify-between">
                      <span>Milestone 1 Initial Deposit Required:</span>
                      <span className="font-mono font-bold">$12,000 USD (₦18,000,000 NGN)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({
                        clientAcceptedProposal: true,
                        depositPaid: true,
                        currentStep: 5,
                      });
                    }}
                    className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Execute Step 4: Accept Proposal & Fund Deposit via Paystack</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 5: PM Creates Sprint & Shortlists Talent */}
              {state.currentStep === 5 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Project Initialized: Code NDH-2026-104</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                        Sprint Active
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <div className="font-semibold text-white">Matched Talent: Architect-Alpha (Oluwaseun Adedipe)</div>
                      <div className="text-slate-400 flex items-center gap-3 text-[11px]">
                        <span>Tier: <strong className="text-purple-400">Elite</strong></span>
                        <span>•</span>
                        <span>Rating: <strong className="text-emerald-400">4.98 / 5.0</strong></span>
                        <span>•</span>
                        <span>Task Pay: <strong className="text-white">$4,400 USD</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Privacy Guard: Client name and gross agency margins are fully stripped from the talent invitation payload.</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({ projectCreated: true, currentStep: 6 });
                    }}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                  >
                    <span>Execute Step 5: Dispatch Confidential Task Invite to Architect-Alpha</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 6: Talent Accepts & Starts Work */}
              {state.currentStep === 6 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Talent Portal • Architect-Alpha</span>
                      <span className="text-purple-400 font-mono text-[10px]">Private Task Sandbox</span>
                    </div>
                    <p className="text-slate-300">
                      Task: <code className="text-white">TASK-NDH-104-01: React 19 Clinical Reporting Web App</code>
                      <br />
                      Fixed Allocation: <strong className="text-emerald-400">$4,400 USD</strong> • SLA Due Date: 14 Days
                    </p>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                      Communication Channel: Strictly with PM Tariq Al-Najeeb. Direct external contact forbidden.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({
                        talentAcceptedInvite: true,
                        talentStartedWork: true,
                        currentStep: 7,
                      });
                    }}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                  >
                    <span>Execute Step 6: Talent Accepts Task & Commences Sprint</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 7: Talent Submits v1.0 & PM Requests Revision */}
              {state.currentStep === 7 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">QA Gate 1: Deliverable v1.0 Evaluation</span>
                      <span className="text-amber-400 font-mono text-[10px]">Revision Triggered</span>
                    </div>
                    <p className="text-slate-300">
                      Talent submitted v1.0 staging artifacts. PM review noted that edge diagnostic query latency was 480ms (target: &lt;300ms).
                    </p>
                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300">
                      <strong>PM QA Note:</strong> Please cache OpenAPI diagnostic responses on Cloudflare edge workers to meet the sub-300ms SLA.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({
                        deliverableV1Submitted: true,
                        qaRevisionRequested: true,
                        currentStep: 8,
                      });
                    }}
                    className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all"
                  >
                    <span>Execute Step 7: Issue PM Revision Request to Talent</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 8: Talent Deploys v2.0 with Edge Optimization */}
              {state.currentStep === 8 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Deliverable Version 2.0 Upload</span>
                      <span className="text-emerald-400 font-mono text-[10px]">P95: 275ms (Passed)</span>
                    </div>
                    <p className="text-slate-300">
                      Architect-Alpha optimized Cloudflare edge routing and verified zero TypeScript compilation warnings.
                    </p>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]">
                      Artifacts: <code className="text-emerald-400">Savannah_Clinical_App_v2.0_Production.zip</code> (28.4 MB)
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({
                        deliverableV2Submitted: true,
                        currentStep: 9,
                      });
                    }}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                  >
                    <span>Execute Step 8: Upload Deliverable v2.0 into QA Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 9: PM QA Sign-Off & Publish to Client */}
              {state.currentStep === 9 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">QA Gate Sign-Off (Score: 5.0/5.0)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                        QA Passed
                      </span>
                    </div>
                    <p className="text-slate-300">
                      Tariq Al-Najeeb (PM) verified edge performance, test coverage, and security sandboxing.
                    </p>
                    <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-300">
                      Deliverable package is now made visible in Dr. Chinedu Eze's Client Portal for milestone acceptance.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({
                        pmQaApproved: true,
                        publishedToClientPortal: true,
                        currentStep: 10,
                      });
                    }}
                    className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <span>Execute Step 9: Authorize QA Pass & Publish to Client Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 10: Client Milestone Approval */}
              {state.currentStep === 10 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Client Milestone 1 Formal Approval</span>
                      <span className="text-emerald-400 font-mono text-[10px]">Sign-Off Executed</span>
                    </div>
                    <p className="text-slate-300">
                      Dr. Chinedu Eze verified the live staging preview and executed the digital milestone sign-off.
                    </p>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center text-slate-300">
                      <span>Receipt Generated: <strong>NDH-REC-2026-104-A</strong></span>
                      <span className="font-mono text-emerald-400">$12,000 USD Settled</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({
                        clientMilestoneApproved: true,
                        finalInvoiceGenerated: true,
                        clientReceiptAvailable: true,
                        talentEarningsApproved: true,
                        currentStep: 11,
                      });
                    }}
                    className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <span>Execute Step 10: Sign Off Milestone & Release Settlement Receipt</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 11: Finance Dual-Approval & Payout */}
              {state.currentStep === 11 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Dual-Approval Payout Batch: NDH-PAY-2026-W40</span>
                      <span className="text-amber-400 font-mono text-[10px]">Maker / Checker Principle</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block">Maker Signature:</span>
                        <span className="font-semibold text-emerald-400">Amina Yusuf (Finance Admin) ✓</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block">Checker Signature:</span>
                        <span className="font-semibold text-emerald-400">Najeeb Al-Hassan (Managing Director) ✓</span>
                      </div>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px]">
                      Disbursement: ₦36,900,000 NGN ($24,600 USD) transmitted to NIBSS Nigerian Inter-Bank Network.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      updateState({
                        makerApproved: true,
                        checkerApproved: true,
                        payoutDisbursed: true,
                        currentStep: 12,
                      });
                    }}
                    className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <span>Execute Step 11: Authorize Dual Sign-Off & Disburse Talent Payouts</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 12: Case Study Nomination & Publication */}
              {state.currentStep === 12 && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Case Study CMS Publishing Gate</span>
                      <span className="text-emerald-400 font-mono text-[10px]">Consent Recorded</span>
                    </div>
                    <p className="text-slate-300">
                      Project nominated: <code className="text-white">Savannah Health: Sub-300ms Clinical Diagnostic Engine</code>
                    </p>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[11px]">
                      Client testimonial verified by Dr. Eze • Measurable KPI: 78% faster lab reporting time.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      updateState({
                        caseStudyNominated: true,
                        clientPublicationConsent: true,
                        caseStudyPublishedLive: true,
                        currentStep: 13,
                      });
                    }}
                    className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <span>Execute Step 12: Publish Verified Case Study to Public Showcase</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STAGE 13: Decoupled Academy Bridge */}
              {state.currentStep === 13 && (
                <div className="space-y-4 text-xs">
                  <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Decoupled NDH Academy Integration Bridge</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                        Zero Data Leakage Certified
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Agency footer cross-link: <code className="text-blue-300">"Looking to build your skills? Explore NDH Academy."</code> (https://academy.ndh.com.ng)
                      <br />
                      Academy footer cross-link: <code className="text-amber-300">"Need a professional team? Work with NDH Agency."</code> (https://agency.ndh.com.ng)
                    </p>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[11px]">
                      Talent graduation credentials verify soulbound alumni badges without leaking academy student records or course exams into client portals.
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href="https://academy.ndh.com.ng"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => updateState({ academyCrossLinkVisited: true })}
                      className="w-full sm:flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                    >
                      <span>Simulate Visiting academy.ndh.com.ng</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => onNavigateScreen && onNavigateScreen('homepage')}
                      className="w-full sm:w-auto px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700"
                    >
                      Return to Agency Home
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

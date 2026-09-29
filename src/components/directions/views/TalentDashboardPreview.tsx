import React, { useState } from 'react';
import { DesignDirectionId, TalentProfile } from '../../../types/ndh';
import { DIRECTION_CONFIGS } from '../DirectionStyles';
import { VETTED_TALENTS } from '../../../data/mockData';
import {
  Terminal,
  CheckCircle2,
  Upload,
  DollarSign,
  Award,
  Lock,
  FileCode,
  Send,
  ExternalLink,
} from 'lucide-react';

interface TalentDashboardPreviewProps {
  direction: DesignDirectionId;
}

export const TalentDashboardPreview: React.FC<TalentDashboardPreviewProps> = ({ direction }) => {
  const config = DIRECTION_CONFIGS[direction];
  const [activeTab, setActiveTab] = useState<'tasks' | 'deliverables' | 'earnings' | 'academy'>('tasks');
  const [deliverableUploaded, setDeliverableUploaded] = useState<boolean>(false);
  const [talentMessageInput, setTalentMessageInput] = useState<string>('');

  const talent: TalentProfile = VETTED_TALENTS[0]!; // Architect-Alpha

  const [pmChat, setPmChat] = useState<
    { sender: string; time: string; text: string; isTalent: boolean }[]
  >([
    {
      sender: 'Tariq Al-Najeeb (Your Assigned PM)',
      time: '09:30 AM',
      text: 'Hello Architect-Alpha! Please ensure the Milestone 2 edge bundle is deployed to staging with the updated biometric KYC latency optimizations.',
      isTalent: false,
    },
    {
      sender: 'Architect-Alpha (You)',
      time: '10:05 AM',
      text: 'On it Tariq. P95 latency is down to 280ms on Cloudflare Workers edge nodes. Submitting v2.0 deliverable bundle for QA now.',
      isTalent: true,
    },
  ]);

  const handleSendMessage = () => {
    if (!talentMessageInput.trim()) return;
    setPmChat([
      ...pmChat,
      {
        sender: 'Architect-Alpha (You)',
        time: 'Just now',
        text: talentMessageInput,
        isTalent: true,
      },
    ]);
    setTalentMessageInput('');
  };

  return (
    <div className={`min-h-screen ${config.containerBg} py-8 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Talent Private Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Talent Workspace: {talent.pseudonym}</h1>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px] font-bold border border-purple-500/20">
                  {talent.tier} Tier Squad Leader
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px]">
                  Verified Squad
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vetted Squad Member • Assigned PM: Tariq Al-Najeeb • Timezone: GMT+1 (Lagos)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-background border border-border text-xs flex items-center gap-3">
              <div>
                <span className="text-[10px] text-muted-foreground block">Quality Rating:</span>
                <span className="font-mono font-bold text-emerald-400">{talent.qualityScore} / 5.0</span>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Approved Balance:</span>
                <span className="font-mono font-bold text-foreground">${talent.totalEarnedUSD.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>NDH Private Workforce Protocol:</strong> You communicate exclusively with your assigned Project Manager. Client identity, direct contact details, and client invoice totals remain confidential.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-background font-mono text-[10px] text-foreground border border-border">
            Anonymized Isolation: Active
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'tasks', label: 'Assigned Sprint Tasks', icon: <FileCode className="w-4 h-4" />, badge: '2 Active' },
            { id: 'deliverables', label: 'Submit Deliverable for QA', icon: <Upload className="w-4 h-4" /> },
            { id: 'earnings', label: 'Earnings Ledger & Payouts', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'academy', label: 'NDH Academy Career Bridge', icon: <Award className="w-4 h-4" />, badge: 'Alumni' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded bg-primary/20 text-primary font-mono text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Assigned Sprint Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-4`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="font-bold text-sm text-foreground">Active Work Allocations</h3>
                <span className="text-xs text-muted-foreground font-mono">Contract SLA: 99.4% On-Time Target</span>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-background border border-border space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary font-bold">TASK-NDH-89-02</span>
                        <span className="font-bold text-sm text-foreground">
                          Implement React 19 Frontend & Biometric KYC Flow
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-mono text-[10px]">
                          Milestone 2
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Scope: Cloudflare edge worker routing, async KYC token verification, sub-300ms state engine.
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-400">$4,400 USD Fixed Allocation</div>
                      <div className="text-[10px] text-muted-foreground">Due: Oct 05, 2026</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
                    <span className="text-muted-foreground">Status: Deliverable submitted, pending PM QA sign-off</span>
                    <button
                      onClick={() => setActiveTab('deliverables')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${config.accentBtn}`}
                    >
                      View QA Submission
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Submit Deliverable for QA */}
        {activeTab === 'deliverables' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-6 shadow-xl`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Deliverable Submission Gate (Version 2.0)</h3>
                  <p className="text-xs text-muted-foreground">
                    Upload your production artifacts. They will be reviewed by Tariq Al-Najeeb (PM) before client presentation.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 font-mono text-xs">
                  Version: v2.0
                </span>
              </div>

              {/* Upload Box Simulation */}
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-3 bg-background/50">
                <Upload className="w-8 h-8 text-primary mx-auto" />
                <div className="text-xs text-foreground font-semibold">
                  Drag and drop deliverable archives, Git repository patch links, or Figma design tokens
                </div>
                <div className="text-[10px] text-muted-foreground">Supported: .zip, .pdf, .fig, .ts, .mp4 (Up to 2GB)</div>
                <button
                  onClick={() => setDeliverableUploaded(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                    deliverableUploaded ? 'bg-emerald-600 text-white cursor-default' : config.accentBtn
                  }`}
                >
                  {deliverableUploaded ? 'Artifacts Uploaded to Secure Vault ✓' : 'Simulate Uploading v2.0 Artifacts'}
                </button>
              </div>

              {/* Version History */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground uppercase tracking-wider">Revision History:</div>
                <div className="p-3 rounded-lg bg-background border border-border text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-mono font-bold text-foreground">v2.0 (Latest)</span>
                    <span className="text-muted-foreground">— P95 KYC latency reduced to 280ms, 100% strict TS types</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">Today at 10:10 AM</span>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border text-xs flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-foreground">v1.0 (Initial)</span>
                    <span className="text-muted-foreground">— Draft wireframes and mock API stubs</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">Sep 20, 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Earnings Ledger & Payouts */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-2`}>
                <div className="text-xs text-muted-foreground">Total Lifetime Earnings</div>
                <div className={`text-2xl ${config.statValue}`}>${talent.totalEarnedUSD.toLocaleString()} USD</div>
                <div className="text-xs text-muted-foreground font-mono">₦{talent.totalEarnedNGN.toLocaleString()} NGN settled</div>
              </div>

              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-2`}>
                <div className="text-xs text-muted-foreground">Pending Next Settlement (Week 40)</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">$4,400 USD</div>
                <div className="text-xs text-muted-foreground">Awaiting Dual-Approval Disbursement</div>
              </div>

              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-2`}>
                <div className="text-xs text-muted-foreground">Settlement Destination</div>
                <div className="font-bold text-foreground text-sm">GTBank Nigeria (NIBSS FastPay)</div>
                <div className="text-xs text-primary font-mono">Account Ending •••• 4892</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: NDH Academy Career Bridge */}
        {activeTab === 'academy' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-6 shadow-xl`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">NDH Academy Verified Talent Bridge</h3>
                    <p className="text-xs text-muted-foreground">
                      Certified Full-Stack Master • Verified Alumni Badge Active
                    </p>
                  </div>
                </div>

                <a
                  href="https://academy.ndh.com.ng"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500 hover:text-black transition-all"
                >
                  <span>Explore Advanced Academy Modules</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="font-semibold text-foreground">Decoupled Integration Architecture:</div>
                  <p className="text-muted-foreground leading-relaxed">
                    NDH Academy and NDH Agency operate as separate codebases and databases. Your verified credential is cryptographic proof of capability without leaking student LMS records into agency client projects.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="font-semibold text-foreground">Elite Tier Progression:</div>
                  <p className="text-muted-foreground leading-relaxed">
                    Complete advanced system design courses on NDH Academy to unlock higher internal hourly rates ($65+/hr) and priority sprint allocation for sovereign enterprise projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

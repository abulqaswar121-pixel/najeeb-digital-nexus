import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import { VETTED_TALENTS } from '../../data/mockData';
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
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const TalentPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tasks' | 'deliverables' | 'earnings' | 'academy'>('tasks');
  const [deliverableUploaded, setDeliverableUploaded] = useState<boolean>(false);
  const [talentMessageInput, setTalentMessageInput] = useState<string>('');

  const talent = VETTED_TALENTS[0]!; // Architect-Alpha

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
      sender: `${user?.fullName || 'Architect-Alpha'} (You)`,
      time: '10:05 AM',
      text: 'On it Tariq. P95 latency is down to 275ms on Cloudflare Workers edge nodes. Submitting v2.0 deliverable bundle for QA now.',
      isTalent: true,
    },
  ]);

  const handleSendMessage = () => {
    if (!talentMessageInput.trim()) return;
    setPmChat([
      ...pmChat,
      {
        sender: `${user?.fullName || 'Architect-Alpha'} (You)`,
        time: 'Just now',
        text: talentMessageInput,
        isTalent: true,
      },
    ]);
    setTalentMessageInput('');
  };

  return (
    <div className="bg-[#080C14] text-[#F1F5F9] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Talent Private Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xl">
              <Terminal className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Talent Workspace: {user?.fullName || talent.pseudonym}
                </h1>
                <span className="px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px] font-bold border border-purple-500/20">
                  {talent.tier} Tier Squad Leader
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                  Verified Squad Member
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Assigned PM: Tariq Al-Najeeb • Department: {talent.department.replace('_', ' ').toUpperCase()} • Timezone: GMT+1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block">Quality Rating:</span>
                <span className="font-mono font-bold text-emerald-400">{talent.qualityScore} / 5.0</span>
              </div>
              <div className="w-px h-6 bg-slate-800"></div>
              <div>
                <span className="text-[10px] text-slate-400 block">Approved Balance:</span>
                <span className="font-mono font-bold text-white">${talent.totalEarnedUSD.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>NDH Private Workforce Protocol:</strong> You communicate exclusively with your assigned Project Manager. Client identity, direct contact details, and client invoice totals remain confidential.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-slate-900 font-mono text-[10px] text-slate-300 border border-slate-800">
            Anonymized Isolation: Active
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'tasks', label: 'Assigned Sprint Tasks', icon: <FileCode className="w-4 h-4" />, badge: '2 Active' },
            { id: 'deliverables', label: 'Submit Deliverable for QA', icon: <Upload className="w-4 h-4" /> },
            { id: 'earnings', label: 'Earnings Ledger & Payouts', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'academy', label: 'NDH Academy Career Bridge', icon: <Award className="w-4 h-4" />, badge: 'Alumni' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Active Work Allocations</h3>
                <span className="text-xs text-slate-400 font-mono">Contract SLA: 99.4% On-Time Target</span>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-blue-400 font-bold">TASK-NDH-89-02</span>
                        <span className="font-bold text-sm text-white">
                          Implement React 19 Frontend & Biometric KYC Flow
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                          Milestone 2
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1">
                        Scope: Cloudflare edge worker routing, async KYC token verification, sub-300ms state engine.
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-emerald-400">$4,400 USD Fixed Allocation</div>
                      <div className="text-[10px] text-slate-500">Due: Oct 05, 2026</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-slate-400">Status: Deliverable submitted, pending PM QA sign-off</span>
                    <button
                      onClick={() => setActiveTab('deliverables')}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
                    >
                      View QA Submission
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: QA Deliverables */}
        {activeTab === 'deliverables' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Deliverable Submission Gate (Version 2.0)</h3>
                  <p className="text-xs text-slate-400">
                    Upload your production artifacts. They will be reviewed by Tariq Al-Najeeb (PM) before client presentation.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 font-mono text-xs font-bold">
                  Version: v2.0
                </span>
              </div>

              {/* Upload Box Simulation */}
              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center space-y-3 bg-slate-900/40">
                <Upload className="w-8 h-8 text-blue-400 mx-auto" />
                <div className="text-xs text-white font-semibold">
                  Drag and drop deliverable archives, Git repository patch links, or Figma design tokens
                </div>
                <div className="text-[10px] text-slate-500">Supported: .zip, .pdf, .fig, .ts, .mp4 (Up to 2GB)</div>
                <button
                  onClick={() => setDeliverableUploaded(true)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all ${
                    deliverableUploaded
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  }`}
                >
                  {deliverableUploaded ? 'Artifacts Uploaded to Secure Vault ✓' : 'Simulate Uploading v2.0 Artifacts'}
                </button>
              </div>

              {/* Version History */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-white uppercase tracking-wider">Revision History:</div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-bold text-white">v2.0 (Latest)</span>
                    <span className="text-slate-300">— P95 KYC latency reduced to 275ms, 100% strict TS types</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Today at 10:10 AM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Earnings & Settlements */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-2">
                <span className="text-xs text-slate-400">Total Lifetime Earnings</span>
                <div className="text-2xl font-bold font-mono text-white">${talent.totalEarnedUSD.toLocaleString()} USD</div>
                <div className="text-xs text-slate-400 font-mono">₦{talent.totalEarnedNGN.toLocaleString()} NGN settled</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-2">
                <span className="text-xs text-slate-400">Pending Next Settlement (Week 40)</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">$4,400 USD</div>
                <div className="text-xs text-slate-500">Awaiting Dual-Approval Disbursement</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-2">
                <span className="text-xs text-slate-400">Settlement Destination</span>
                <div className="font-bold text-white text-sm">GTBank Nigeria (NIBSS FastPay)</div>
                <div className="text-xs text-blue-400 font-mono">Account Ending •••• 4892</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: NDH Academy Bridge */}
        {activeTab === 'academy' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">NDH Academy Verified Talent Bridge</h3>
                  <p className="text-xs text-slate-400">
                    Certified Full-Stack Master • Verified Alumni Badge Active
                  </p>
                </div>
              </div>

              <a
                href="https://academy.ndh.com.ng"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500 hover:text-black transition-all"
              >
                <span>Explore Advanced Academy Modules</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-semibold text-white">Decoupled Integration Architecture:</div>
                <p className="text-slate-400 leading-relaxed">
                  NDH Academy and NDH Agency operate as separate codebases and databases. Your verified credential is cryptographic proof of capability without leaking student LMS records into agency client projects.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-semibold text-white">Elite Tier Progression:</div>
                <p className="text-slate-400 leading-relaxed">
                  Complete advanced system design courses on NDH Academy to unlock higher internal hourly rates ($75+/hr) and priority sprint allocation for sovereign enterprise projects.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import { dbService, DatabaseTalentApplication } from '../../lib/databaseStore';
import {
  SECURITY_AUDIT_LOGS,
  SERVICE_DEPARTMENTS,
  ACTIVE_PROJECTS,
  CLIENT_ORGANIZATIONS,
  VETTED_TALENTS,
  TALENT_RANK_CONFIGS,
  calculateRevenueSplit,
} from '../../data/mockData';
import { TalentRank, ClientReferralRecord } from '../../types/ndh';
import {
  Sliders,
  ShieldAlert,
  Link2,
  CheckCircle2,
  Lock,
  DollarSign,
  Layers,
  Users,
  Award,
  Sparkles,
  Eye,
  EyeOff,
  Edit3,
  Plus,
  Trash2,
  UserCheck,
  UserPlus,
  Send,
  Calendar,
  CreditCard,
  Building,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Globe,
  Zap,
  TrendingUp,
  Percent,
  Gift,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface AdminPortalProps {
  onBackToAgency?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToAgency }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'cms' | 'split_model' | 'talent_ranks' | 'referrals' | 'users' | 'talent_apps' | 'payouts' | 'audit'
  >('overview');

  // CMS State
  const [announcementText, setAnnouncementText] = useState('⚡ Q4 Digital Transformation Special: Free Technical Discovery & PM Consultation for All New Projects');
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [heroHeading, setHeroHeading] = useState('We Build World-Class Software & Brands That Fast-Track Your Growth.');
  const [cmsSaveSuccess, setCmsSaveSuccess] = useState(false);

  // Talent Applications State
  const [talentApps, setTalentApps] = useState<DatabaseTalentApplication[]>(dbService.getTalentApplications());
  const [approvedAppId, setApprovedAppId] = useState<string | null>(null);

  // Profit Split & Calculator State
  const [sampleBudget, setSampleBudget] = useState<number>(2000000); // ₦2,000,000

  // Talent Ranks & Dual-Role Management
  const [talentsList, setTalentsList] = useState(VETTED_TALENTS);
  const [dualRoleSuccessMsg, setDualRoleSuccessMsg] = useState<string | null>(null);

  // Referrals State
  const [referralsList, setReferralsList] = useState<ClientReferralRecord[]>(dbService.getReferrals());
  const [fundedSuccessMsg, setFundedSuccessMsg] = useState<string | null>(null);

  // Bi-Weekly Payouts State
  const [dualApprovalStep, setDualApprovalStep] = useState<number>(1);
  const [batchDisbursed, setBatchDisbursed] = useState(false);

  // Invite PM Modal
  const [showInvitePmModal, setShowInvitePmModal] = useState(false);
  const [newPmName, setNewPmName] = useState('');
  const [newPmEmail, setNewPmEmail] = useState('');
  const [newPmDept, setNewPmDept] = useState('web_app_development');
  const [pmInviteSent, setPmInviteSent] = useState(false);

  const handleSaveCMS = () => {
    dbService.getAnnouncement().title = announcementText;
    dbService.getAnnouncement().active = announcementActive;
    setCmsSaveSuccess(true);
    setTimeout(() => setCmsSaveSuccess(false), 3000);
  };

  const handleApproveTalent = (appId: string) => {
    setApprovedAppId(appId);
  };

  const handleToggleDualRole = (talentId: string) => {
    setTalentsList((prev) =>
      prev.map((t) => {
        if (t.id === talentId) {
          const nextStatus = !t.isDualRolePM;
          setDualRoleSuccessMsg(
            nextStatus
              ? `Granted Dual-Role PM-Lead status to ${t.fullName} (${t.pseudonym})!`
              : `Revoked Dual-Role PM status from ${t.fullName}.`
          );
          setTimeout(() => setDualRoleSuccessMsg(null), 3000);
          return { ...t, isDualRolePM: nextStatus };
        }
        return t;
      })
    );
  };

  const handleSimulateReferralPayment = (referralId: string) => {
    const updated = dbService.triggerReferralMilestoneFunding(referralId, 2500000, 1650);
    if (updated) {
      setReferralsList([...dbService.getReferrals()]);
      setFundedSuccessMsg(
        `✓ First Project Escrow Funded! ₦50,000 discount applied to ${updated.referredUserName}'s project and ₦250,000 credit (10%) unlocked for ${updated.referrerName}!`
      );
      setTimeout(() => setFundedSuccessMsg(null), 5000);
    }
  };

  const handleInvitePM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPmName || !newPmEmail) return;
    setPmInviteSent(true);
    setTimeout(() => {
      setPmInviteSent(false);
      setShowInvitePmModal(false);
      setNewPmName('');
      setNewPmEmail('');
    }, 2000);
  };

  const splitResult = calculateRevenueSplit(sampleBudget, Math.round(sampleBudget / 1500));

  return (
    <div className="bg-[#070A14] text-[#F1F5F9] min-h-screen font-sans flex flex-col">
      {/* Standalone Admin Command Nexus Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F1D]/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBackToAgency && (
            <button
              onClick={onBackToAgency}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>← Back to Agency Website</span>
            </button>
          )}
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm sm:text-base">Admin Command Nexus</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              DUAL-KEY AUTHORITY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>Root Admin: {user?.fullName || 'Najeeb Al-Hassan'}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Admin Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-xl">
                <Sliders className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">NDH Command Nexus</h1>
                  <span className="px-2.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono text-[10px] font-bold border border-red-500/20">
                    Super Admin
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                    Root Access Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Full Website CMS Control • Profit Split Governance • Talent Ranks Desk • Bi-Weekly Payout Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInvitePmModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-transform hover:scale-105"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite New PM Lead</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'overview', label: 'Platform Telemetry' },
              { id: 'split_model', label: 'Profit Split & Escrow Governance', badge: '45/15/40' },
              { id: 'talent_ranks', label: 'Talent Ranks & Dual-Roles', badge: `${talentsList.length} Talents` },
              { id: 'referrals', label: 'Client Referrals & Escrow Trigger', badge: `${referralsList.length} Codes` },
              { id: 'cms', label: 'A-to-Z Website CMS' },
              { id: 'users', label: 'Clients & Squads' },
              { id: 'talent_apps', label: 'Talent Applications Review', badge: talentApps.length > 0 ? `${talentApps.length} New` : undefined },
              { id: 'payouts', label: 'Bi-Weekly 14-Day Payouts', badge: 'Active Cycle' },
              { id: 'audit', label: 'Security & Audit Logs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: Platform Telemetry */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Total Platform GMV</span>
                  <div className="text-2xl font-bold font-mono text-white">$188,500 USD</div>
                  <div className="text-[10px] text-emerald-400 font-mono">₦282,750,000 NGN Equivalent</div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Admin / Owner Net Reserve</span>
                  <div className="text-2xl font-bold font-mono text-amber-400">$84,825 USD</div>
                  <div className="text-[10px] text-amber-300 font-mono">45% Guaranteed Retained Margin</div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Active Vetted Talents</span>
                  <div className="text-2xl font-bold font-mono text-white">140 Talents</div>
                  <div className="text-[10px] text-slate-400">16 Specialized Global Departments</div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Next Bi-Weekly Payout Cycle</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">Oct 15, 2026</div>
                  <div className="text-[10px] text-slate-400 font-mono">NIBSS &amp; Paystack Rails Ready</div>
                </div>
              </div>

              {/* Live Project Health Matrix */}
              <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-4">
                <h3 className="font-bold text-sm text-white">Live Client Projects & Milestone Escrow Status</h3>
                <div className="space-y-3">
                  {ACTIVE_PROJECTS.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-400 font-bold">{proj.code}</span>
                          <span className="font-bold text-white text-sm">{proj.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {proj.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-1">
                          Client: <strong className="text-slate-200">{proj.organizationName}</strong> • PM: <strong className="text-indigo-400">{proj.assignedPMName}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 font-mono">
                        <div className="text-right">
                          <div className="text-slate-200 font-bold">${proj.totalClientBudgetUSD.toLocaleString()} USD</div>
                          <div className="text-emerald-400 text-[10px]">{proj.grossMarginPercentage}% Margin</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFIT SPLIT & ESCROW GOVERNANCE */}
          {activeTab === 'split_model' && (
            <div className="space-y-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">Guaranteed Payout Architecture: Nobody Loses</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Task-based milestone escrow distribution formula: Admin/Owner, PMs, and Talents are backed 100% by funded client deposits.
                    </p>
                  </div>
                  <span className="px-3.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                    Escrow Backed • Zero Unfunded Payroll
                  </span>
                </div>

                {/* 3 Split Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pillar 1: Admin */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                        <Building className="w-4 h-4" />
                        <span>Admin / Your Gain (45%)</span>
                      </div>
                      <span className="font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded text-xs">
                        45% Net Margin
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Guaranteed agency net profit, customer acquisition marketing budget, cloud servers, and platform operating treasury. Admin never pays out more than what is deposited into escrow.
                    </p>
                  </div>

                  {/* Pillar 2: PM */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                        <Briefcase className="w-4 h-4" />
                        <span>Project Manager (15%)</span>
                      </div>
                      <span className="font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded text-xs">
                        15% Fee
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Incentivizes the PM to maintain tight deadlines, rigorous QA scores (&gt;90%), and frictionless client communication. Released automatically upon milestone completion.
                    </p>
                  </div>

                  {/* Pillar 3: Talent */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Terminal className="w-4 h-4" />
                        <span>Talent Execution Pool (40%)</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded text-xs">
                        40% Task Pool
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Divided amongst the assigned squad engineers/designers based on ticket milestones and talent rank bonuses (Level 1–4 multipliers: 1.0x to 1.15x).
                    </p>
                  </div>
                </div>

                {/* Dual-Role Rule Explanation */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span>How the "Dual-Role (PM is also Talent)" is Handled:</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    When an appointed lead acts as <strong>both PM and executing Talent</strong> on a sprint:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
                    <li>They receive the <strong>PM Management Fee (15%)</strong> + <strong>Talent Execution Fee (40%)</strong> = <strong>55% total payout</strong>.</li>
                    <li><strong>Admin / You</strong> retain the exact same <strong>45% agency profit</strong> without any margin erosion.</li>
                    <li>The system automatically records whether a ticket was delegated to a separate squad member or self-executed by the PM-Lead.</li>
                  </ul>
                </div>

                {/* Live Split Simulator */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="text-xs font-bold text-white">Test Client Deposit Calculation:</label>
                    <div className="flex items-center gap-2">
                      {[1000000, 2000000, 5000000, 10000000].map((b) => (
                        <button
                          key={b}
                          onClick={() => setSampleBudget(b)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                            sampleBudget === b ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          ₦{(b / 1000000).toFixed(1)}M
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <span className="text-[10px] text-amber-300 block uppercase font-bold">Admin Share (45%)</span>
                      <strong className="text-amber-400 text-base">₦{splitResult.adminMarginNGN.toLocaleString()}</strong>
                      <div className="text-[10px] text-slate-400">(${splitResult.adminMarginUSD.toLocaleString()} USD)</div>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <span className="text-[10px] text-indigo-300 block uppercase font-bold">PM Share (15%)</span>
                      <strong className="text-indigo-400 text-base">₦{splitResult.pmFeeNGN.toLocaleString()}</strong>
                      <div className="text-[10px] text-slate-400">(${splitResult.pmFeeUSD.toLocaleString()} USD)</div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] text-emerald-300 block uppercase font-bold">Talent Pool (40%)</span>
                      <strong className="text-emerald-400 text-base">₦{splitResult.talentPoolNGN.toLocaleString()}</strong>
                      <div className="text-[10px] text-slate-400">(${splitResult.talentPoolUSD.toLocaleString()} USD)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TALENT RANKS & DUAL-ROLES */}
          {activeTab === 'talent_ranks' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white">Talent Performance Ranks & Dual-Role Desk</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Talents advance through 4 ranks based on QA scores &amp; delivered projects. Appoint top Diamond/Gold talents as Dual-Role PM Leads.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                    4 Progression Levels Active
                  </span>
                </div>

                {dualRoleSuccessMsg && (
                  <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>{dualRoleSuccessMsg}</span>
                  </div>
                )}

                {/* Talents Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Talent Profile</th>
                        <th className="py-3 px-4">Current Rank</th>
                        <th className="py-3 px-4">QA Score %</th>
                        <th className="py-3 px-4">Tasks Completed</th>
                        <th className="py-3 px-4">Task Bonus Multiplier</th>
                        <th className="py-3 px-4 text-right">Dual-Role PM Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {talentsList.map((t) => {
                        const rankCfg = TALENT_RANK_CONFIGS[t.rank || 'Bronze Prodigy'];

                        return (
                          <tr key={t.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={t.avatarUrl}
                                  alt={t.fullName}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                                />
                                <div>
                                  <div className="font-bold text-white text-xs">{t.fullName}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{t.pseudonym} • {t.department}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border bg-gradient-to-r ${rankCfg.badgeColor}`}>
                                Level {rankCfg.level}: {t.rank}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                              {t.qaPercentageScore}%
                            </td>

                            <td className="py-3.5 px-4 font-mono text-white">
                              {t.completedProjects} Projects
                            </td>

                            <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                              +{rankCfg.bonusRatePercentage}% ({t.bonusMultiplier}x)
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleToggleDualRole(t.id)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                                  t.isDualRolePM
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                              >
                                {t.isDualRolePM ? '⚡ Dual PM-Lead Active' : 'Appoint Dual-Role PM'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLIENT REFERRALS & ESCROW TRIGGER */}
          {activeTab === 'referrals' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white">Client Referral & Cashback Ledger</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      <strong>Strict Escrow Rule:</strong> The ₦50,000 / $50 discount and 10% referrer cashback are ONLY unlocked when the referred client funds their first milestone project.
                    </p>
                  </div>
                  <span className="px-3.5 py-1 rounded-xl bg-purple-500/10 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                    Payment-Triggered Logic Active
                  </span>
                </div>

                {fundedSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{fundedSuccessMsg}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {referralsList.map((ref) => {
                    const isFunded = ref.status === 'milestone_funded' || ref.status === 'credited';

                    return (
                      <div
                        key={ref.id}
                        className={`p-5 rounded-2xl border transition-all text-xs space-y-3 ${
                          isFunded
                            ? 'bg-slate-900/90 border-emerald-500/40'
                            : 'bg-slate-900/50 border-amber-500/30'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{ref.referredUserName}</span>
                              <span className="text-slate-400">({ref.referredUserEmail})</span>
                              {isFunded ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] border border-emerald-500/30">
                                  Milestone Funded ✓
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] border border-amber-500/30">
                                  Pending First Milestone Escrow
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 mt-1">
                              Referred by: <strong className="text-blue-400">{ref.referrerName}</strong> • Registered: <strong className="text-slate-300">{ref.registeredAt}</strong>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {isFunded ? (
                              <div>
                                <div className="text-sm font-mono font-bold text-emerald-400">
                                  +₦{ref.cashbackEarnedNGN.toLocaleString()} NGN Referrer Cashback
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  ₦{ref.discountAppliedNGN.toLocaleString()} discount applied on project
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-xs font-mono text-amber-400 font-bold">
                                  Discount Locked: Awaiting First Escrow Payment
                                </div>
                                <button
                                  onClick={() => handleSimulateReferralPayment(ref.id)}
                                  className="mt-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-all"
                                >
                                  Simulate First Escrow Deposit →
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {ref.referredProjectTitle && (
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                            <span className="text-slate-300">Project: <strong>{ref.referredProjectTitle}</strong></span>
                            {ref.fundedAmountNGN && (
                              <span className="font-mono text-emerald-400 font-bold">
                                Escrow Paid: ₦{ref.fundedAmountNGN.toLocaleString()} NGN (${ref.fundedAmountUSD?.toLocaleString()} USD)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: A-to-Z Website CMS */}
          {activeTab === 'cms' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white">A-to-Z Website CMS Control</h3>
                  <p className="text-xs text-slate-400">
                    Live updates instantly reflected across the public agency marketing website.
                  </p>
                </div>
                {cmsSaveSuccess && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved to Live Website ✓</span>
                  </span>
                )}
              </div>

              <div className="space-y-5 text-xs">
                {/* 1. Announcement Banner */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-200">1. Top Broadcast Announcement Bar</label>
                    <button
                      onClick={() => setAnnouncementActive(!announcementActive)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-[11px] font-bold ${
                        announcementActive ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {announcementActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{announcementActive ? 'Visible on Website' : 'Hidden'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                {/* 2. Hero Headline */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <label className="font-bold text-slate-200">2. Homepage Hero Primary Headline</label>
                  <input
                    type="text"
                    value={heroHeading}
                    onChange={(e) => setHeroHeading(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                {/* Save CMS CTA */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveCMS}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-transform hover:scale-105"
                  >
                    Publish Changes to Live Agency Site
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Clients & Squads */}
          {activeTab === 'users' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-base text-white">Registered Client Organizations</h3>
                  <p className="text-xs text-slate-400">
                    Client account owners, loyalty badges, total spend, and active projects.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                  {CLIENT_ORGANIZATIONS.length} Active Organizations
                </span>
              </div>

              <div className="space-y-3">
                {CLIENT_ORGANIZATIONS.map((org) => (
                  <div key={org.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{org.name}</div>
                        <div className="text-slate-400 text-[11px]">
                          Contact: {org.primaryContact.name} ({org.primaryContact.email}) • {org.city}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/20">
                        {org.tier} Tier
                      </span>
                      <span className="font-mono text-slate-300 font-bold">
                        ${org.totalSpentUSD.toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Talent Applications Review Desk */}
          {activeTab === 'talent_apps' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-base text-white">Incoming Talent Applications Desk</h3>
                  <p className="text-xs text-slate-400">
                    Review candidate portfolios, test project code, and grant approved status to issue workspace credentials.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                  {talentApps.length} Candidates in Queue
                </span>
              </div>

              {talentApps.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                  No pending talent applications right now.
                </div>
              ) : (
                <div className="space-y-4">
                  {talentApps.map((app) => (
                    <div key={app.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{app.fullName}</h4>
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                              {app.experienceLevel}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">• {app.country}</span>
                          </div>
                          <div className="text-slate-400 mt-0.5">
                            Email: <strong className="text-slate-200">{app.email}</strong> • Phone: <strong className="text-slate-200">{app.phone || 'N/A'}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] flex items-center gap-1"
                          >
                            <span>Inspect Portfolio</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                        {app.bioNotes || 'Applied to join the NDH Vetted African Talent Network.'}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div className="text-slate-400 font-mono text-[11px]">
                          Department: <strong className="text-blue-400">{app.primaryDepartment}</strong> • Expected Rate: <strong className="text-emerald-400">{app.hourlyRateExpectation}</strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveTalent(app.id)}
                            disabled={approvedAppId === app.id}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              approvedAppId === app.id
                                ? 'bg-emerald-600 text-white cursor-default'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                            }`}
                          >
                            {approvedAppId === app.id ? 'Approved & Credentials Issued ✓' : 'Approve & Issue Talent Workspace'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: Bi-Weekly 14-Day Payouts Engine */}
          {activeTab === 'payouts' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      BI-WEEKLY 14-DAY SCHEDULE
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-white">Payroll Disbursement Batch (Cycle #2026-19)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Settles all completed milestone tickets every 2 weeks (1st &amp; 15th of each month) to PMs and Talents.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-emerald-400">₦14,850,000 NGN</div>
                  <div className="text-xs text-slate-400 font-mono">($9,900 USD Equivalent)</div>
                </div>
              </div>

              {batchDisbursed ? (
                <div className="p-8 text-center rounded-3xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Payroll Batch Successfully Disbursed!</h4>
                  <p className="text-xs text-emerald-300 max-w-md mx-auto">
                    ₦14,850,000 NGN has been transferred across 14 talent and PM bank accounts via NIBSS FastPay &amp; Wise API.
                  </p>
                  <div className="font-mono text-[11px] text-slate-400 pt-2">
                    Audit Tx Hash: 0x9f8a...c34b • Signed by Najeeb Al-Hassan &amp; Amina Yusuf
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Batch Summary */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                    <div className="font-bold text-white text-sm">Batch Allocations:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div>Talent Sprints Total:</div>
                        <div className="font-mono text-white font-bold text-sm mt-0.5">₦10,200,000 NGN</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div>PM Commission Total:</div>
                        <div className="font-mono text-white font-bold text-sm mt-0.5">₦4,650,000 NGN</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div>Settlement Gateway:</div>
                        <div className="font-mono text-emerald-400 font-bold text-sm mt-0.5">NIBSS FastPay + Stripe</div>
                      </div>
                    </div>
                  </div>

                  {/* Dual-Key Execution */}
                  <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-400" />
                        <span>Dual-Approval Sovereign Safeguard</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Requires Root Super Admin (Najeeb Al-Hassan) &amp; Finance Lead (Amina Yusuf) digital signature.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {dualApprovalStep === 1 && (
                        <button
                          onClick={() => setDualApprovalStep(2)}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                        >
                          Sign Key 1: Super Admin (Najeeb)
                        </button>
                      )}

                      {dualApprovalStep === 2 && (
                        <button
                          onClick={() => setBatchDisbursed(true)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Sign Key 2 &amp; Execute Payroll Disbursement</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: Security & Audit Logs */}
          {activeTab === 'audit' && (
            <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold text-sm text-white">Immutable Platform Security Audit Stream</h3>
                <span className="text-xs text-slate-400 font-mono">Stream ID: lag-audit-9912</span>
              </div>

              <div className="space-y-2 text-xs">
                {SECURITY_AUDIT_LOGS.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">{log.timestamp.split('T')[1]?.slice(0, 8)}</span>
                      <span className="text-blue-400">{log.action}</span>
                      <span className="text-slate-400">by {log.performedBy}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-emerald-400 border border-slate-800">
                      {log.location}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite PM Modal */}
      {showInvitePmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
          <div className="w-full max-w-md rounded-3xl bg-[#0F172A] border border-blue-500/40 p-6 sm:p-8 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowInvitePmModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Invite Project Manager</h3>
              <p className="text-xs text-slate-400">
                Grant lead PM operational credentials for squad orchestration and brief triage.
              </p>
            </div>

            {pmInviteSent ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Invitation &amp; Credentials sent to {newPmEmail}!</span>
              </div>
            ) : (
              <form onSubmit={handleInvitePM} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">PM Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zainab Al-Hassan"
                    value={newPmName}
                    onChange={(e) => setNewPmName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">PM Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. zainab.pm@agency.ndh.com.ng"
                    value={newPmEmail}
                    onChange={(e) => setNewPmEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Supervised Department</label>
                  <select
                    value={newPmDept}
                    onChange={(e) => setNewPmDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-sans"
                  >
                    {SERVICE_DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Issue PM Credentials &amp; Workspace Access</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Standalone Admin Command Nexus System Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#090D1A] px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-red-400 font-mono text-[11px]">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>Root Governance Authority Active</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-400">
              Bi-Weekly Payout Cycle: <strong className="text-emerald-400">Oct 15, 2026</strong> • NIBSS Dual-Approval Verified
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Server Health: 99.99% Uptime</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            {onBackToAgency && (
              <button
                onClick={onBackToAgency}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Exit to Agency Website →
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

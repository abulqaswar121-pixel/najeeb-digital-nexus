import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import { ACTIVE_PROJECTS, CLIENT_ORGANIZATIONS, FINANCIAL_INVOICES } from '../../data/mockData';
import { dbService } from '../../lib/databaseStore';
import { useCurrencyLanguage } from '../../lib/currencyLanguageStore';
import { PaystackPaymentModal } from '../payment/PaystackPaymentModal';
import {
  Building2,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Download,
  Sparkles,
  Send,
  Check,
  Lock,
  ArrowRight,
  Clock,
  Eye,
  ChevronRight,
  ExternalLink,
  Gift,
  Share2,
  Copy,
  Zap,
  Award,
  PlusCircle,
} from 'lucide-react';

interface ClientPortalProps {
  onOpenBriefWizard: () => void;
  onBackToAgency?: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onOpenBriefWizard, onBackToAgency }) => {
  const { user } = useAuth();
  const { currency } = useCurrencyLanguage();

  const [selectedOrgId, setSelectedOrgId] = useState<string>('org-kobopay');
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'invoices' | 'messages' | 'custom_task' | 'rewards' | 'contracts'>('overview');
  const [milestoneApproved, setMilestoneApproved] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [clientMessageInput, setClientMessageInput] = useState<string>('');
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Custom Task State
  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [customTaskDesc, setCustomTaskDesc] = useState('');
  const [customBudgetAmount, setCustomBudgetAmount] = useState('75000');
  const [customTaskSubmitted, setCustomTaskSubmitted] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<string>('');

  const currentOrg = CLIENT_ORGANIZATIONS.find((o) => o.id === selectedOrgId) || CLIENT_ORGANIZATIONS[0]!;
  const clientProjects = ACTIVE_PROJECTS.filter((p) => p.organizationId === selectedOrgId);
  const activeProject = clientProjects[0] || ACTIVE_PROJECTS[0]!;
  const clientInvoices = FINANCIAL_INVOICES.filter((i) => i.projectId === activeProject.id);

  const referralLink = `https://agency.ndh.com.ng/ref/${user?.referralCode || 'FOLAKE-NDH'}`;

  const [messagesList, setMessagesList] = useState<
    { sender: string; role: string; time: string; text: string; isPM: boolean }[]
  >([
    {
      sender: 'Tariq Al-Najeeb',
      role: 'Assigned Principal PM',
      time: '10:15 AM',
      text: `Hello ${user?.fullName || 'Folake'}! Milestone 2 build (React 19 Frontend + Biometric KYC flow) has passed all internal NDH QA gates (Score: 4.95/5.0). Ready for your inspection in the Deliverables tab!`,
      isPM: true,
    },
    {
      sender: `${user?.fullName || 'Dr. Folake Adeleke'} (You)`,
      role: user?.roleTitle || 'Chief Product Officer',
      time: '10:45 AM',
      text: 'Thanks Tariq. Reviewing the KYC drop-off optimizations now with our compliance officer.',
      isPM: false,
    },
  ]);

  const handleSendMessage = () => {
    if (!clientMessageInput.trim()) return;
    setMessagesList([
      ...messagesList,
      {
        sender: `${user?.fullName || currentOrg.primaryContact.name} (You)`,
        role: user?.roleTitle || currentOrg.primaryContact.role,
        time: 'Just now',
        text: clientMessageInput,
        isPM: false,
      },
    ]);
    setClientMessageInput('');
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleCustomTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskTitle || !customBudgetAmount) return;

    dbService.createBrief({
      projectName: customTaskTitle,
      organizationName: currentOrg.name,
      department: 'web_app_development',
      scopeTier: 'starter',
      budgetAmount: `${currency} ${Number(customBudgetAmount).toLocaleString()}`,
      currency,
      timelineWeeks: '1 - 2 Weeks',
      clientEmail: user?.email || 'client@example.com',
      briefDetails: customTaskDesc || 'Custom Task dropped by client with custom budget.',
    });

    setCustomTaskSubmitted(true);
  };

  return (
    <div className="bg-[#070A14] text-[#F1F5F9] min-h-screen font-sans flex flex-col">
      {/* Standalone Client Workspace Top Bar */}
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
            <span className="font-bold text-white text-sm sm:text-base">Client Workspace</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              PORTAL SECURE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white">
            <span className="text-slate-400 text-[11px] hidden md:inline">Entity:</span>
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="bg-transparent font-bold focus:outline-none cursor-pointer"
            >
              {CLIENT_ORGANIZATIONS.map((org) => (
                <option key={org.id} value={org.id} className="bg-[#0A0E17] text-white">
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold hidden sm:inline">{user?.fullName || currentOrg.primaryContact.name}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Header & Loyalty Badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">{currentOrg.name}</h1>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>{user?.loyaltyTier || 'Gold Enterprise'} Rank</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                    NDA Executed
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Authorized User: <strong className="text-white">{user?.fullName || currentOrg.primaryContact.name}</strong> • PM: <strong className="text-blue-400">Tariq Al-Najeeb</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('custom_task')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Drop Custom Task / Budget</span>
              </button>

              <button
                onClick={onOpenBriefWizard}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-transform hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit Full Brief</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'overview', label: 'Sprint Overview', icon: <FileText className="w-4 h-4" /> },
              { id: 'milestones', label: 'Deliverables & Approvals', icon: <CheckCircle2 className="w-4 h-4" />, badge: 'Action Due' },
              { id: 'invoices', label: 'Invoices & Escrow', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'messages', label: 'PM Direct Chat', icon: <MessageSquare className="w-4 h-4" />, badge: '1 Unread' },
              { id: 'custom_task', label: 'Drop Custom Budget Task', icon: <Zap className="w-4 h-4" /> },
              { id: 'rewards', label: 'Ranks, Offers & Referrals', icon: <Gift className="w-4 h-4" />, badge: '₦250k Credits' },
              { id: 'contracts', label: 'NDA & Legal Contracts', icon: <ShieldCheck className="w-4 h-4" /> },
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
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      activeTab === tab.id ? 'bg-blue-800 text-white' : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                  <span className="text-xs text-slate-400">Active Sprint Project</span>
                  <div className="text-base font-bold text-white truncate">{activeProject.title}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Sprint 2 of 4 (In Progress)</div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                  <span className="text-xs text-slate-400">Total Escrow Deposited</span>
                  <div className="text-2xl font-bold font-mono text-white">${activeProject.totalClientBudgetUSD.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">100% Escrow Protected</div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                  <span className="text-xs text-slate-400">Internal QA Score</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">4.95 / 5.0</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Gate 2 Verified by PM</div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                  <span className="text-xs text-slate-400">Your Referral Balance</span>
                  <div className="text-2xl font-bold font-mono text-amber-400">₦250,000 NGN</div>
                  <div className="text-[10px] text-slate-400">Available as project credit</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Drop Custom Budget Task */}
          {activeTab === 'custom_task' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="space-y-1 border-b border-slate-800 pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>CUSTOM BUDGET &amp; TAILORED TASK</span>
                </div>
                <h3 className="text-xl font-bold text-white">Drop a Custom Task with Your Chosen Budget</h3>
                <p className="text-xs text-slate-400">
                  If our preset starter or growth packages don't fit, name your task and state the exact amount you wish to allocate. Your PM will organize the sprint and launch immediately.
                </p>
              </div>

              {customTaskSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">Custom Task Successfully Logged!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Task: <strong className="text-white">{customTaskTitle}</strong> • Budget: <strong className="text-emerald-400">{currency} {Number(customBudgetAmount).toLocaleString()}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Assigned PM Tariq Al-Najeeb has received the brief and is structuring the milestones.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCustomTaskSubmitted(false);
                      setIsPaymentModalOpen(true);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
                  >
                    Proceed to Escrow Deposit
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomTaskSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Task / Deliverable Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Redesign Checkout Flow & Fix Webhook Sync"
                      value={customTaskTitle}
                      onChange={(e) => setCustomTaskTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Your Custom Budget Amount ({currency}) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50000"
                      value={customBudgetAmount}
                      onChange={(e) => setCustomBudgetAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400">Enter whatever amount fits your budget (e.g. ₦35k, ₦75k, ₦150k, $250, etc.).</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Task Scope &amp; Instructions</label>
                    <textarea
                      rows={3}
                      placeholder="Specify exact requirements, API endpoints, Figma links, or objectives..."
                      value={customTaskDesc}
                      onChange={(e) => setCustomTaskDesc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                  >
                    <span>Submit Task to PM &amp; Request Escrow Deposit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB: Rewards, Ranks & Referrals */}
          {activeTab === 'rewards' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="space-y-1 border-b border-slate-800 pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  <Gift className="w-3 h-3 text-amber-400" />
                  <span>CLIENT LOYALTY &amp; REFERRAL ENGINE</span>
                </div>
                <h3 className="text-xl font-bold text-white">Client Ranks, Special Offers &amp; Referral Rewards</h3>
                <p className="text-xs text-slate-400">
                  Earn credits on every project, level up your client rank for permanent discounts, and earn 10% cashback whenever friends or partners launch a project with your code.
                </p>
              </div>

              {/* Ranks Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { rank: 'Bronze Pioneer', criteria: '1st Project', perk: '5% Off Next Milestone', active: false },
                  { rank: 'Silver Scaler', criteria: '2-3 Projects', perk: '10% Off + Fast PM Queue', active: false },
                  { rank: 'Gold Enterprise', criteria: '4+ Projects / ₦5M+', perk: '15% Lifetime Discount + 24/7 PM', active: true },
                  { rank: 'Diamond Sovereign', criteria: 'Custom Enterprise', perk: 'Dedicated Squad + Custom SLA', active: false },
                ].map((r, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      r.active
                        ? 'bg-amber-950/40 border-amber-500/50 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{r.rank}</span>
                      {r.active && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-black font-mono font-bold">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-300 font-mono">{r.criteria}</div>
                    <div className="text-[11px] text-slate-300 leading-tight">{r.perk}</div>
                  </div>
                ))}
              </div>

              {/* Referral Share Box */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-blue-400" />
                      <span>Your Unique Client Referral Link</span>
                    </h4>
                    <p className="text-slate-400 text-xs">
                      Share with founders, CTOs &amp; business owners. When they fund their first project milestone, they get <strong>₦50,000 / $50 off</strong>, and you earn <strong>10% project credits (cashback)</strong>.
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Unlocked Referral Credits:</span>
                    <div className="text-xl font-bold font-mono text-emerald-400">₦250,000 NGN</div>
                    <span className="text-[10px] text-slate-400">Usable across all future milestones</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-blue-300 font-mono text-xs focus:outline-none"
                  />
                  <button
                    onClick={handleCopyReferral}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
                  >
                    {copiedReferral ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Referral Condition Notice */}
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-blue-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Payment-Triggered Referral Terms:</span>
                  </div>
                  <p>
                    Discounts and cashback credits are generated only upon verified first milestone escrow funding. This ensures 100% genuine referrals and immediate project execution.
                  </p>
                </div>

                {/* Activity Feed */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Referred Organizations Status:</div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between text-[11px]">
                      <div>
                        <strong className="text-white">Zenith Logistics (Adeola Adeleke)</strong>
                        <div className="text-slate-400">Supply Chain Tracking Dashboard • Registered Sep 15</div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                          Milestone Funded ✓ (+₦250,000 Credited)
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between text-[11px]">
                      <div>
                        <strong className="text-white">AfriCart Supermarket (Emeka Okafor)</strong>
                        <div className="text-slate-400">E-Commerce Mobile App • Registered Sep 27</div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                          Pending First Milestone Escrow
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Deliverables & Approvals */}
          {activeTab === 'milestones' && (
            <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-base text-white">Milestone 2 Deliverables Inspection</h3>
                  <p className="text-xs text-slate-400">
                    Inspected and QA-certified by Tariq Al-Najeeb (Lead PM). Score: 4.95 / 5.0.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  QA Passed ✓
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-white">Deliverable Package: React 19 Frontend + Biometric KYC Integration</div>
                <div className="text-slate-300">Git Tag: <code className="text-blue-400">v2.0-rc-verified</code> • P95 Latency: <code className="text-emerald-400">275ms</code></div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setMilestoneApproved(true)}
                    disabled={milestoneApproved}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      milestoneApproved
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    }`}
                  >
                    {milestoneApproved ? 'Deliverable Approved & Escrow Released ✓' : 'Approve Deliverable & Release Escrow'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Invoices & Billing */}
          {activeTab === 'invoices' && (
            <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold text-base text-white">Escrow Invoices &amp; Billing History</h3>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                >
                  Make Escrow Deposit
                </button>
              </div>

              <div className="space-y-3">
                {clientInvoices.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{inv.invoiceNumber}</span>
                        <span className="text-slate-400">({inv.milestoneTitle})</span>
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        Due: {inv.dueDate} • Gateway: {inv.paymentGateway}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-emerald-400 font-bold">${inv.amountUSD.toLocaleString()} USD</span>
                      <button
                        onClick={() => {
                          setSelectedPaymentInvoice(inv.invoiceNumber);
                          setIsPaymentModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Pay Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PM Direct Channel */}
          {activeTab === 'messages' && (
            <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                    T
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Tariq Al-Najeeb (Your Assigned Lead PM)</h3>
                    <p className="text-[11px] text-slate-400">Average response time: &lt;15 mins</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
                  PM ONLINE
                </span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {messagesList.map((msg, i) => (
                  <div key={i} className={`p-4 rounded-2xl text-xs space-y-1 ${msg.isPM ? 'bg-slate-900 border border-slate-800' : 'bg-blue-950/40 border border-blue-800/40 ml-6'}`}>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span>{msg.sender}</span>
                      <span className="font-mono">{msg.time}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Message Tariq..."
                  value={clientMessageInput}
                  onChange={(e) => setClientMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Contracts */}
          {activeTab === 'contracts' && (
            <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-4 text-xs shadow-2xl">
              <h3 className="font-bold text-sm text-white">Bilateral NDA &amp; Master Services Agreement</h3>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-white">Mutual NDA Executed: NDH-{currentOrg.name.slice(0, 4).toUpperCase()}-2026</div>
                    <div className="text-[10px] text-slate-500">Timestamp: 2026-01-15 14:22 UTC • Signed by Authorized Officer</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Escrow Deposit Modal */}
      <PaystackPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        projectName={customTaskTitle || selectedPaymentInvoice || 'Milestone Escrow Deposit'}
        defaultAmount={Number(customBudgetAmount) || 75000}
      />

      {/* Dedicated Standalone Client Portal System Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#090D1A] px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NDH Client Secure Rails Active</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-400">
              Assigned PM: <strong className="text-slate-200">Tariq Al-Najeeb</strong> (SLA &lt;15m)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>ISO 27001 &amp; NDPR End-to-End Encrypted</span>
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

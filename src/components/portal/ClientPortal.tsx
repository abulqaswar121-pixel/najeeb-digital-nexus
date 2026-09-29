import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import { ACTIVE_PROJECTS, CLIENT_ORGANIZATIONS, FINANCIAL_INVOICES } from '../../data/mockData';
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
} from 'lucide-react';

interface ClientPortalProps {
  onOpenBriefWizard: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onOpenBriefWizard }) => {
  const { user } = useAuth();
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org-kobopay');
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'invoices' | 'messages' | 'contracts'>('overview');
  const [milestoneApproved, setMilestoneApproved] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [clientMessageInput, setClientMessageInput] = useState<string>('');

  const currentOrg = CLIENT_ORGANIZATIONS.find((o) => o.id === selectedOrgId) || CLIENT_ORGANIZATIONS[0]!;
  const clientProjects = ACTIVE_PROJECTS.filter((p) => p.organizationId === selectedOrgId);
  const activeProject = clientProjects[0] || ACTIVE_PROJECTS[0]!;
  const clientInvoices = FINANCIAL_INVOICES.filter((i) => i.projectId === activeProject.id);

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

  const handleSimulatePayment = (invId: string) => {
    setPaymentSuccess(invId);
  };

  return (
    <div className="bg-[#080C14] text-[#F1F5F9] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Org Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{currentOrg.name}</h1>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                  {currentOrg.tier} Tier
                </span>
                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                  NDA Executed
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Authorized User: <strong className="text-white">{user?.fullName || currentOrg.primaryContact.name}</strong> • Location: {currentOrg.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Multi-Org Switcher */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
              <span className="text-xs text-slate-400 hidden sm:inline">Organization:</span>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                {CLIENT_ORGANIZATIONS.map((org) => (
                  <option key={org.id} value={org.id} className="bg-[#0A0E17] text-white">
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onOpenBriefWizard}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit New Brief</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'overview', label: 'Sprint Overview', icon: <FileText className="w-4 h-4" /> },
            { id: 'milestones', label: 'Deliverables & Approvals', icon: <CheckCircle2 className="w-4 h-4" />, badge: 'Action Due' },
            { id: 'invoices', label: 'Invoices & Billing', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'messages', label: 'Project Manager Chat', icon: <MessageSquare className="w-4 h-4" />, badge: '1 Unread' },
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

        {/* Tab 1: Sprint Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-2">
                <span className="text-xs text-slate-400">Active Engagement</span>
                <div className="font-bold text-white text-base truncate">{activeProject.title}</div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
                  <span>Code: {activeProject.code}</span>
                  <span>•</span>
                  <span className="text-emerald-400">{activeProject.progressPercentage}% Completed</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-2">
                <span className="text-xs text-slate-400">Assigned Project Manager</span>
                <div className="font-bold text-white text-base">{activeProject.assignedPMName}</div>
                <div className="text-xs text-blue-400 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dedicated Lead Point of Contact</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-2">
                <span className="text-xs text-slate-400">Total Authorized Budget</span>
                <div className="text-2xl font-bold font-mono text-white">
                  ${activeProject.totalClientBudgetUSD.toLocaleString()} USD
                </div>
                <div className="text-xs text-emerald-400 font-mono">₦{activeProject.totalClientBudgetNGN.toLocaleString()} NGN</div>
              </div>
            </div>

            {/* Milestones Pipeline Progress */}
            <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Milestones Roadmap & Verification Status</h3>
                <span className="text-xs font-mono text-slate-400">Target Completion: {activeProject.targetEndDate}</span>
              </div>

              <div className="space-y-4">
                {activeProject.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-blue-400 font-bold">M{idx + 1}</span>
                        <span className="font-bold text-sm text-white">{m.title}</span>
                        {m.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                            Approved & Released
                          </span>
                        )}
                        {m.status === 'in_client_review' && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono animate-pulse">
                            Awaiting Your Sign-Off
                          </span>
                        )}
                        {m.status === 'in_progress' && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono">
                            In Active Sprint
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400">{m.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-white">${m.clientCostUSD.toLocaleString()} USD</div>
                        <div className="text-[10px] text-slate-500">Due: {m.dueDate}</div>
                      </div>
                      {m.status === 'in_client_review' && (
                        <button
                          onClick={() => setActiveTab('milestones')}
                          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                        >
                          Review Deliverables
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Deliverables & Formal Approvals */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Action Required</span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    Milestone 2: High-Performance Frontend & Biometric KYC Flow
                  </h3>
                  <p className="text-xs text-slate-400">
                    Delivered on schedule • Passed NDH Internal QA Gate (Score: 4.95/5.0)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-emerald-400">$11,000 USD</div>
                  <div className="text-[11px] text-slate-500">Milestone Release Value</div>
                </div>
              </div>

              {/* Deliverable File Package */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-white uppercase tracking-wider">
                  Deliverable Artifacts Ready for Inspection:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'KoboPay_Frontend_Staging_Preview_v2.0.url', size: 'Live Preview', type: 'Staging Web App' },
                    { name: 'KYC_Biometric_Flow_Design_Tokens_v2.fig', size: '24.8 MB', type: 'Figma Tokens' },
                    { name: 'End_to_End_Lighthouse_Performance_Report.pdf', size: '1.4 MB', type: 'Audit PDF' },
                    { name: 'PCI_DSS_Compliance_Checklist_Executed.pdf', size: '840 KB', type: 'Security Spec' },
                  ].map((file, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-white truncate">{file.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {file.type} • {file.size}
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-200 flex items-center gap-1 shrink-0">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Action Box */}
              <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-800/40 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Formal Milestone Sign-Off & Escrow Release</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      By approving this milestone, you confirm that the delivered artifacts satisfy the agreed scope in Section 3.2. An automated receipt and final invoice record will be generated.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setMilestoneApproved(true)}
                    disabled={milestoneApproved}
                    className={`px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all ${
                      milestoneApproved
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{milestoneApproved ? 'Milestone Approved & Confirmed ✓' : 'Approve Milestone & Authorize Settlement'}</span>
                  </button>

                  <button className="px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors">
                    Request Minor Revision with PM
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Invoices & Billing */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white">Invoices & Settlement History</h3>
                <span className="text-xs text-slate-400">Supported: Paystack / Stripe / Direct Wire</span>
              </div>

              <div className="space-y-3">
                {clientInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{inv.invoiceNumber}</span>
                        {inv.status === 'paid' || paymentSuccess === inv.id ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                            Paid & Reconciled ✓
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px]">
                            Payment Due
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400">{inv.milestoneTitle}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-white">${inv.amountUSD.toLocaleString()} USD</div>
                        <div className="text-[10px] text-slate-500">₦{inv.amountNGN.toLocaleString()} NGN</div>
                      </div>

                      {inv.status === 'paid' || paymentSuccess === inv.id ? (
                        <button className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSimulatePayment(inv.id)}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay via Paystack / Card</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: PM Direct Messaging Sandbox */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-4 flex flex-col h-[520px] justify-between shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    T
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{activeProject.assignedPMName}</h4>
                    <p className="text-[11px] text-slate-400">Dedicated Project Manager • Active on Sprint</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Confidential Agency Buffer Active</span>
                </div>
              </div>

              {/* Messages Flow */}
              <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar flex-1">
                {messagesList.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.isPM ? 'items-start' : 'items-end'}`}>
                    <div className="text-[10px] text-slate-500 mb-1">
                      {msg.sender} • {msg.time}
                    </div>
                    <div
                      className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                        msg.isPM
                          ? 'bg-slate-900 border border-slate-800 text-slate-200'
                          : 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input Box */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Message your Project Manager (Tariq)..."
                  value={clientMessageInput}
                  onChange={(e) => setClientMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Contracts & NDAs */}
        {activeTab === 'contracts' && (
          <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white">Bilateral Non-Disclosure Agreements & Master Services Contract</h3>
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
  );
};

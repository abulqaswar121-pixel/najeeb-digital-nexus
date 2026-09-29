import React, { useState } from 'react';
import { DesignDirectionId, ClientOrganization, Project } from '../../../types/ndh';
import { DIRECTION_CONFIGS } from '../DirectionStyles';
import { ACTIVE_PROJECTS, CLIENT_ORGANIZATIONS, FINANCIAL_INVOICES } from '../../../data/mockData';
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
} from 'lucide-react';

interface ClientDashboardPreviewProps {
  direction: DesignDirectionId;
  onOpenBriefWizard: () => void;
}

export const ClientDashboardPreview: React.FC<ClientDashboardPreviewProps> = ({ direction, onOpenBriefWizard }) => {
  const config = DIRECTION_CONFIGS[direction];
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org-kobopay');
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'invoices' | 'messages'>('overview');
  const [milestoneApproved, setMilestoneApproved] = useState<boolean>(false);
  const [clientMessageInput, setClientMessageInput] = useState<string>('');

  const currentOrg: ClientOrganization =
    CLIENT_ORGANIZATIONS.find((o) => o.id === selectedOrgId) || CLIENT_ORGANIZATIONS[0]!;
  const clientProjects = ACTIVE_PROJECTS.filter((p) => p.organizationId === selectedOrgId);
  const activeProject: Project = clientProjects[0] || ACTIVE_PROJECTS[0]!;
  const clientInvoices = FINANCIAL_INVOICES.filter((i) => i.projectId === activeProject.id);

  const [messagesList, setMessagesList] = useState<
    { sender: string; role: string; time: string; text: string; isPM: boolean }[]
  >([
    {
      sender: 'Tariq Al-Najeeb',
      role: 'Assigned NDH Project Manager',
      time: '10:15 AM',
      text: 'Good morning Folake! We have finalized the Milestone 2 build (React 19 Frontend + Biometric KYC flow). QA gates have all passed. Ready for your review below!',
      isPM: true,
    },
    {
      sender: 'Dr. Folake Adeleke (You)',
      role: 'Chief Product Officer, KoboPay',
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
        sender: `${currentOrg.primaryContact.name} (You)`,
        role: currentOrg.primaryContact.role,
        time: 'Just now',
        text: clientMessageInput,
        isPM: false,
      },
    ]);
    setClientMessageInput('');
  };

  return (
    <div className={`min-h-screen ${config.containerBg} py-8 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Org Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{currentOrg.name}</h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px] border border-emerald-500/20">
                  {currentOrg.tier} Tier
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-mono text-[10px]">
                  NDA Executed
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Primary Contact: {currentOrg.primaryContact.name} ({currentOrg.primaryContact.role}) • {currentOrg.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Multi-Org Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground hidden sm:inline">Switch Org:</span>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground font-medium focus:outline-none focus:border-primary"
              >
                {CLIENT_ORGANIZATIONS.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onOpenBriefWizard}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${config.accentBtn}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Brief Request</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          {[
            { id: 'overview', label: 'Project Overview', icon: <FileText className="w-4 h-4" /> },
            { id: 'milestones', label: 'Deliverables & Approvals', icon: <CheckCircle2 className="w-4 h-4" /> },
            { id: 'invoices', label: 'Invoices & Billing', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'messages', label: 'Project Manager Chat', icon: <MessageSquare className="w-4 h-4" />, badge: '1 Unread' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black font-mono text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Project Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-2`}>
                <div className="text-xs text-muted-foreground">Active Engagement</div>
                <div className="font-bold text-foreground text-base truncate">{activeProject.title}</div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pt-1">
                  <span>Code: {activeProject.code}</span>
                  <span>•</span>
                  <span className="text-emerald-500">{activeProject.progressPercentage}% Complete</span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-2`}>
                <div className="text-xs text-muted-foreground">Assigned NDH Project Manager</div>
                <div className="font-bold text-foreground text-base flex items-center gap-2">
                  <span>{activeProject.assignedPMName}</span>
                </div>
                <div className="text-xs text-primary flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dedicated Lead Point of Contact</span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-2`}>
                <div className="text-xs text-muted-foreground">Budget & Milestone Health</div>
                <div className={`text-xl ${config.statValue}`}>${activeProject.totalClientBudgetUSD.toLocaleString()} USD</div>
                <div className="text-xs text-emerald-500 font-mono">SLA Status: 100% on track</div>
              </div>
            </div>

            {/* Milestones Pipeline Progress */}
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-4`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="font-bold text-sm text-foreground">Milestones Roadmap & Verification Status</h3>
                <span className="text-xs font-mono text-muted-foreground">Target Completion: {activeProject.targetEndDate}</span>
              </div>

              <div className="space-y-4">
                {activeProject.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary font-bold">M{idx + 1}</span>
                        <span className="font-bold text-sm text-foreground">{m.title}</span>
                        {m.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-mono">
                            Approved & Released
                          </span>
                        )}
                        {m.status === 'in_client_review' && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-mono animate-pulse">
                            Awaiting Your Sign-Off
                          </span>
                        )}
                        {m.status === 'in_progress' && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-mono">
                            In Active Sprint
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-foreground">${m.clientCostUSD.toLocaleString()} USD</div>
                        <div className="text-[10px] text-muted-foreground">Due: {m.dueDate}</div>
                      </div>
                      {m.status === 'in_client_review' && (
                        <button
                          onClick={() => setActiveTab('milestones')}
                          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
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
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-6 shadow-xl`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-500">Action Required</span>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    Milestone 2: High-Performance Frontend & Biometric KYC Flow
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Delivered on schedule • Passed NDH Internal QA Gate (Score: 4.95/5.0)
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-xl ${config.statValue}`}>$11,000 USD</div>
                  <div className="text-[11px] text-muted-foreground">Milestone Release Value</div>
                </div>
              </div>

              {/* Deliverable File Package */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Deliverable Artifacts Ready for Inspection:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'KoboPay_Frontend_Staging_Preview_v2.0.url', size: 'Live Preview', type: 'Staging App' },
                    { name: 'KYC_Biometric_Flow_Design_Tokens_v2.fig', size: '24.8 MB', type: 'Figma Tokens' },
                    { name: 'End_to_End_Lighthouse_Performance_Report.pdf', size: '1.4 MB', type: 'Audit PDF' },
                    { name: 'PCI_DSS_Compliance_Checklist_Executed.pdf', size: '840 KB', type: 'Security Spec' },
                  ].map((file, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-foreground truncate">{file.name}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {file.type} • {file.size}
                          </div>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-mono text-foreground flex items-center gap-1 shrink-0">
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Action Form */}
              <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">Formal Milestone Sign-Off & Escrow Release</h4>
                    <p className="text-xs text-muted-foreground">
                      By approving this milestone, you confirm that the delivered artifacts satisfy the agreed scope in Section 3.2. An automated receipt and final invoice record will be generated.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setMilestoneApproved(true)}
                    disabled={milestoneApproved}
                    className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      milestoneApproved ? 'bg-emerald-600 text-white cursor-default' : config.accentBtn
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{milestoneApproved ? 'Milestone Approved & Confirmed ✓' : 'Approve Milestone & Authorize Invoice'}</span>
                  </button>

                  <button className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-medium hover:bg-muted transition-colors">
                    Request Minor Revision with PM
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Invoices & Multi-Currency Billing */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-4`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="font-bold text-sm text-foreground">Invoices & Settlement History</h3>
                <span className="text-xs text-muted-foreground">Gateways: Paystack / Stripe / NIBSS</span>
              </div>

              <div className="space-y-3">
                {clientInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">{inv.invoiceNumber}</span>
                        {inv.status === 'paid' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px]">
                            Paid & Reconciled
                          </span>
                        )}
                        {inv.status === 'issued' && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-mono text-[10px]">
                            Payment Due
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground">{inv.milestoneTitle}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-base font-bold font-mono text-foreground`}>${inv.amountUSD.toLocaleString()} USD</div>
                        <div className="text-[10px] text-muted-foreground">₦{inv.amountNGN.toLocaleString()} NGN</div>
                      </div>

                      {inv.status === 'paid' ? (
                        <button className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-medium flex items-center gap-1 hover:bg-muted/80">
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors">
                          Pay via Paystack/Card
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Project Manager Messaging Sandbox */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-4 flex flex-col h-[520px] justify-between shadow-xl`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    T
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Tariq Al-Najeeb</h4>
                    <p className="text-[11px] text-muted-foreground">Dedicated Project Manager • Active on Sprint</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono bg-muted/60 px-2 py-1 rounded">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>Confidential Agency Buffer Active</span>
                </div>
              </div>

              {/* Messages Flow */}
              <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar flex-1">
                {messagesList.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.isPM ? 'items-start' : 'items-end'}`}>
                    <div className="text-[10px] text-muted-foreground mb-1">
                      {msg.sender} • {msg.time}
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                        msg.isPM ? 'bg-background border border-border text-foreground' : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input Box */}
              <div className="pt-3 border-t border-border/50 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Message your Project Manager (Tariq)..."
                  value={clientMessageInput}
                  onChange={(e) => setClientMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSendMessage}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${config.accentBtn}`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

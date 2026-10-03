import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/authStore";
import { ACTIVE_PROJECTS, CLIENT_ORGANIZATIONS, FINANCIAL_INVOICES } from "../../data/mockData";
import { dbService, useMyBriefs, useMyReferrals, useMyTransactions } from "../../lib/databaseStore";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";
import { PaystackPaymentModal } from "../payment/PaystackPaymentModal";
import { PortalNavDropdown } from "./PortalNavDropdown";
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
  Rocket,
} from "lucide-react";

// The sample "KoboPay Global Inc." organization/project/escrow/chat content
// below is illustrative demo data that only ever belonged to ONE seeded
// demo account (folake@kobopay.com). Previously this entire portal
// hardcoded `selectedOrgId = "org-kobopay"` as its default and never
// actually checked who was logged in, so EVERY client -- including a
// brand-new real signup with no projects at all -- was shown that same
// sample company's name, a fake $28,500 "active project", a fake 4.95/5.0
// QA score, a fake PM, and a fake unread chat. This flag is the fix: only
// the one real seeded demo account sees the illustrative sample workspace;
// every other (i.e. every real) client sees their own actual (new/empty)
// account state instead.
function isSampleDemoWorkspace(user: ReturnType<typeof useAuth>["user"]): boolean {
  return Boolean(user?.isDemoAccount && user?.organizationId === "org-kobopay");
}

interface ClientPortalProps {
  onOpenBriefWizard: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onOpenBriefWizard }) => {
  const { user } = useAuth();
  const { currency } = useCurrencyLanguage();
  const isDemoWorkspace = isSampleDemoWorkspace(user);

  // Real, per-account data -- this is what every non-demo client actually
  // sees. A brand-new signup legitimately has zero of these until they
  // submit a brief / make a payment / refer someone, which is the honest
  // state to show rather than someone else's sample company.
  const myBriefs = useMyBriefs();
  const myTransactions = useMyTransactions();
  const myReferrals = useMyReferrals();

  const [selectedOrgId] = useState<string>("org-kobopay");
  const [activeTab, setActiveTab] = useState<
    "overview" | "milestones" | "invoices" | "messages" | "custom_task" | "rewards" | "contracts"
  >("overview");
  // Server-persisted milestone approval for proj-001 / milestone 2 (same
  // record PMPortal's QA gate writes to). The server rejects this call
  // (409) until the PM has QA-approved the milestone -- previously these
  // were two fully disconnected local `useState` booleans with no
  // dependency between them at all.
  const QA_PROJECT_ID = "proj-001";
  const QA_MILESTONE_INDEX = 2;
  const [milestoneApproved, setMilestoneApproved] = useState<boolean>(false);
  const [milestoneApprovalError, setMilestoneApprovalError] = useState<string | null>(null);
  useEffect(() => {
    dbService
      .getMilestoneApproval(QA_PROJECT_ID, QA_MILESTONE_INDEX)
      .then((approval) => setMilestoneApproved(approval.milestoneApproved))
      .catch(() => undefined);
  }, []);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [clientMessageInput, setClientMessageInput] = useState<string>("");
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Custom Task State
  const [customTaskTitle, setCustomTaskTitle] = useState("");
  const [customTaskDesc, setCustomTaskDesc] = useState("");
  const [customBudgetAmount, setCustomBudgetAmount] = useState("75000");
  const [customTaskSubmitted, setCustomTaskSubmitted] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState<string>("");

  // Sample data -- only ever rendered when isDemoWorkspace is true (see
  // isSampleDemoWorkspace above). Real clients never see these.
  const currentOrg =
    CLIENT_ORGANIZATIONS.find((o) => o.id === selectedOrgId) || CLIENT_ORGANIZATIONS[0]!;
  const clientProjects = ACTIVE_PROJECTS.filter((p) => p.organizationId === selectedOrgId);
  const activeProject = clientProjects[0] || ACTIVE_PROJECTS[0]!;
  const clientInvoices = FINANCIAL_INVOICES.filter((i) => i.projectId === activeProject.id);

  // Real, account-agnostic display values usable in both modes.
  const displayOrgName = isDemoWorkspace
    ? currentOrg.name
    : user?.organizationName || "Your Workspace";
  const displayUserName =
    user?.fullName || (isDemoWorkspace ? currentOrg.primaryContact.name : "there");
  const myLatestBrief = myBriefs.length > 0 ? myBriefs[myBriefs.length - 1]! : null;
  const mySuccessfulTx = myTransactions.filter((t) => t.status === "success");
  const myTxTotalsByCurrency = mySuccessfulTx.reduce<Record<string, number>>((acc, t) => {
    acc[t.currency] = (acc[t.currency] || 0) + t.amount;
    return acc;
  }, {});
  const myTxTotalsLabel =
    Object.entries(myTxTotalsByCurrency)
      .map(([cur, amt]) => `${cur} ${amt.toLocaleString()}`)
      .join(" + ") || null;

  const referralLink = `https://agency.ndh.com.ng/ref/${user?.referralCode || "FOLAKE-NDH"}`;

  const [messagesList, setMessagesList] = useState<
    { sender: string; role: string; time: string; text: string; isPM: boolean }[]
  >(
    isDemoWorkspace
      ? [
          {
            sender: "Tariq Al-Najeeb",
            role: "Assigned Principal PM",
            time: "10:15 AM",
            text: `Hello ${user?.fullName || "there"}! Milestone 2 build (React 19 Frontend + Biometric KYC flow) has passed all internal NDH QA gates (Score: 4.95/5.0). Ready for your inspection in the Deliverables tab!`,
            isPM: true,
          },
          {
            sender: user?.fullName ? `${user.fullName} (You)` : "You",
            role: user?.roleTitle || "Client",
            time: "10:45 AM",
            text: "Thanks Tariq. Reviewing the KYC drop-off optimizations now with our compliance officer.",
            isPM: false,
          },
        ]
      : [],
  );

  const handleSendMessage = () => {
    if (!clientMessageInput.trim()) return;
    setMessagesList([
      ...messagesList,
      {
        sender: `${displayUserName} (You)`,
        role: user?.roleTitle || "Client",
        time: "Just now",
        text: clientMessageInput,
        isPM: false,
      },
    ]);
    setClientMessageInput("");
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleCustomTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskTitle || !customBudgetAmount) return;

    try {
      await dbService.createBrief({
        projectName: customTaskTitle,
        organizationName: displayOrgName,
        department: "web_app_development",
        scopeTier: "starter",
        budgetAmount: `${currency} ${Number(customBudgetAmount).toLocaleString()}`,
        currency,
        timelineWeeks: "1 - 2 Weeks",
        clientEmail: user?.email || "client@example.com",
        briefDetails: customTaskDesc || "Custom Task dropped by client with custom budget.",
      });
      setCustomTaskSubmitted(true);
    } catch {
      // Keep the form open so the client can retry; a toast/inline error
      // here would be a good follow-up but isn't wired to this form yet.
    }
  };

  const clientNavTabs = [
    { id: "overview", label: "Sprint Overview", icon: <FileText className="w-4 h-4" /> },
    {
      id: "milestones",
      label: "Deliverables & Approvals",
      icon: <CheckCircle2 className="w-4 h-4" />,
      ...(isDemoWorkspace ? { badge: "Action Due" } : {}),
    },
    {
      id: "invoices",
      label: "Invoices & Escrow",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: "messages",
      label: "PM Direct Chat",
      icon: <MessageSquare className="w-4 h-4" />,
      ...(isDemoWorkspace ? { badge: "1 Unread" } : {}),
    },
    {
      id: "custom_task",
      label: "Drop Custom Budget Task",
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: "rewards",
      label: "Ranks, Offers & Referrals",
      icon: <Gift className="w-4 h-4" />,
      ...((user?.referralCredits ?? 0) > 0
        ? { badge: `₦${Math.round((user!.referralCredits ?? 0) / 1000)}k Credits` }
        : {}),
    },
    {
      id: "contracts",
      label: "NDA & Legal Contracts",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-[#070A14] text-[#F1F5F9] min-h-screen font-sans flex flex-col">
      {/* Standalone Client Workspace Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F1D]/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
            <span className="font-bold">{displayOrgName}</span>
            {isDemoWorkspace && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SAMPLE
              </span>
            )}
          </div>

          <PortalNavDropdown
            tabs={clientNavTabs}
            activeTab={activeTab}
            onSelect={(id) => setActiveTab(id as typeof activeTab)}
          />
        </div>
      </header>

      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {isDemoWorkspace && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Award className="w-4 h-4 shrink-0" />
              <span>
                You're viewing the illustrative <strong>sample demo workspace</strong> for KoboPay
                Global Inc. Every project, invoice, QA score, and chat message below is placeholder
                content for demonstration purposes only -- it isn't a real client account.
              </span>
            </div>
          )}

          {/* Top Header & Loyalty Badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">{displayOrgName}</h1>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>{user?.loyaltyTier || "Bronze Pioneer"} Rank</span>
                  </span>
                  {isDemoWorkspace ? (
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                      NDA Executed (Sample)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded bg-slate-700/40 text-slate-400 font-mono text-[10px]">
                      No Agreements Yet
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Authorized User: <strong className="text-white">{displayUserName}</strong>{" "}
                  {isDemoWorkspace ? (
                    <>
                      • PM: <strong className="text-blue-400">Tariq Al-Najeeb</strong>
                    </>
                  ) : myLatestBrief && myLatestBrief.assignedPM !== "Unassigned" ? (
                    <>
                      • PM: <strong className="text-blue-400">{myLatestBrief.assignedPM}</strong>
                    </>
                  ) : (
                    <>
                      • PM: <strong className="text-slate-500">Not yet assigned</strong>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("custom_task")}
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

          {/* TAB 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {isDemoWorkspace ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                    <span className="text-xs text-slate-400">Active Sprint Project</span>
                    <div className="text-base font-bold text-white truncate">
                      {activeProject.title}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      Sprint 2 of 4 (In Progress)
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                    <span className="text-xs text-slate-400">Total Escrow Deposited</span>
                    <div className="text-2xl font-bold font-mono text-white">
                      ${activeProject.totalClientBudgetUSD.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">100% Escrow Protected</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                    <span className="text-xs text-slate-400">Internal QA Score</span>
                    <div className="text-2xl font-bold font-mono text-emerald-400">4.95 / 5.0</div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      Gate 2 Verified by PM
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                    <span className="text-xs text-slate-400">Your Referral Balance</span>
                    <div className="text-2xl font-bold font-mono text-amber-400">₦250,000 NGN</div>
                    <div className="text-[10px] text-slate-400">Available as project credit</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                      <span className="text-xs text-slate-400">Briefs Submitted</span>
                      <div className="text-2xl font-bold font-mono text-white">
                        {myBriefs.length}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {myLatestBrief
                          ? `Latest: ${myLatestBrief.status.replace("_", " ")}`
                          : "No project yet"}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                      <span className="text-xs text-slate-400">Total Paid to Escrow</span>
                      <div className="text-2xl font-bold font-mono text-white">
                        {myTxTotalsLabel || "₦0"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {mySuccessfulTx.length > 0 ? "Verified deposits" : "No deposits yet"}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                      <span className="text-xs text-slate-400">Loyalty Rank</span>
                      <div className="text-xl font-bold font-mono text-emerald-400">
                        {user?.loyaltyTier || "Bronze Pioneer"}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        Earned by project volume
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                      <span className="text-xs text-slate-400">Your Referral Balance</span>
                      <div className="text-2xl font-bold font-mono text-amber-400">
                        ₦{(user?.referralCredits ?? 0).toLocaleString()} NGN
                      </div>
                      <div className="text-[10px] text-slate-400">Available as project credit</div>
                    </div>
                  </div>

                  {myBriefs.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 text-center space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                        <Rocket className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">
                          Welcome to {displayOrgName}'s NDH workspace!
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                          You don't have an active project yet. Submit a full brief or drop a custom
                          task with your own budget to get your first sprint started -- a PM will
                          review it and reach out here.
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={onOpenBriefWizard}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Submit Full Brief</span>
                        </button>
                        <button
                          onClick={() => setActiveTab("custom_task")}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Drop Custom Task</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-4">
                      <h3 className="font-bold text-sm text-white">Your Submitted Projects</h3>
                      <div className="space-y-3">
                        {myBriefs
                          .slice()
                          .reverse()
                          .map((brief) => (
                            <div
                              key={brief.id}
                              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5"
                            >
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="font-bold text-white">{brief.projectName}</span>
                                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] uppercase">
                                  {brief.status.replace("_", " ")}
                                </span>
                              </div>
                              <div className="text-slate-400">
                                {brief.scopeTier} • {brief.budgetAmount} {brief.currency} •{" "}
                                {brief.timelineWeeks}
                              </div>
                              <div className="text-slate-500 text-[11px]">
                                PM:{" "}
                                <span
                                  className={
                                    brief.assignedPM === "Unassigned"
                                      ? "text-slate-500"
                                      : "text-blue-400 font-semibold"
                                  }
                                >
                                  {brief.assignedPM}
                                </span>{" "}
                                • Submitted {new Date(brief.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB: Drop Custom Budget Task */}
          {activeTab === "custom_task" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="space-y-1 border-b border-slate-800 pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>CUSTOM BUDGET &amp; TAILORED TASK</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Drop a Custom Task with Your Chosen Budget
                </h3>
                <p className="text-xs text-slate-400">
                  If our preset starter or growth packages don't fit, name your task and state the
                  exact amount you wish to allocate. Your PM will organize the sprint and launch
                  immediately.
                </p>
              </div>

              {customTaskSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">
                      Custom Task Successfully Logged!
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Task: <strong className="text-white">{customTaskTitle}</strong> • Budget:{" "}
                      <strong className="text-emerald-400">
                        {currency} {Number(customBudgetAmount).toLocaleString()}
                      </strong>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Your brief has been logged and is awaiting PM review. You can track its status
                      anytime from the Sprint Overview tab.
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
                    <label className="font-bold text-slate-300">
                      Your Custom Budget Amount ({currency}) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50000"
                      value={customBudgetAmount}
                      onChange={(e) => setCustomBudgetAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-base focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400">
                      Enter whatever amount fits your budget (e.g. ₦35k, ₦75k, ₦150k, $250, etc.).
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">
                      Task Scope &amp; Instructions
                    </label>
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
          {activeTab === "rewards" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="space-y-1 border-b border-slate-800 pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  <Gift className="w-3 h-3 text-amber-400" />
                  <span>CLIENT LOYALTY &amp; REFERRAL ENGINE</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Client Ranks, Special Offers &amp; Referral Rewards
                </h3>
                <p className="text-xs text-slate-400">
                  Universal 10% Welcome Discount Allowance on all new client accounts, loyalty rank
                  benefits, and 10% referral credits.
                </p>
              </div>

              {/* 1. Universal Welcome Discount Credit Ledger */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-amber-500/40 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40">
                        UNIVERSAL NEW CLIENT ALLOWANCE
                      </span>
                      <h4 className="font-bold text-base text-white">
                        ₦50,000 ($50 USD) Welcome Discount Bucket
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300">
                      Granted to <strong>every new client</strong>. 10% is automatically deducted
                      from each milestone invoice until your ₦50,000 allowance is completely
                      consumed.
                    </p>
                  </div>

                  <div className="text-right shrink-0 p-3 rounded-2xl bg-black/40 border border-amber-500/30">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      Remaining Allowance:
                    </span>
                    <div className="text-2xl font-bold font-mono text-emerald-400">
                      ₦{(user?.welcomeCreditBalanceNGN ?? 50000).toLocaleString()} NGN
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      (${(user?.welcomeCreditBalanceUSD ?? 50).toLocaleString()} USD) • Ready for
                      next sprint
                    </div>
                  </div>
                </div>

                {/* Progress Visualizer */}
                {(() => {
                  const usedNGN = user?.welcomeCreditUsedNGN ?? 0;
                  const remainingNGN = user?.welcomeCreditBalanceNGN ?? 50000;
                  const totalNGN = usedNGN + remainingNGN || 1;
                  const percentLeft = Math.round((remainingNGN / totalNGN) * 100);
                  return (
                    <div className="space-y-1.5 pt-2 border-t border-slate-700/60 text-xs">
                      <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                        <span>₦{usedNGN.toLocaleString()} Used</span>
                        <span className="text-emerald-400 font-bold">
                          ₦{remainingNGN.toLocaleString()} Remaining ({percentLeft}% Pool Left)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                          style={{ width: `${percentLeft}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Real-world Rule Clarification */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <span className="text-amber-300 font-bold block">
                    💡 How the 10% drawdown works on your invoices:
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    If your next milestone is <strong>₦150,000</strong>, a 10% discount (
                    <strong>₦15,000</strong>) is deducted directly from this bucket. You pay only{" "}
                    <strong>₦135,000</strong>, and <strong>₦5,000</strong> remains in your allowance
                    for subsequent projects.
                  </p>
                </div>
              </div>

              {/* Ranks Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {[
                  {
                    rank: "Bronze Pioneer",
                    criteria: "1st Project",
                    perk: "5% Off Next Milestone",
                  },
                  {
                    rank: "Silver Scaler",
                    criteria: "2-3 Projects",
                    perk: "10% Off + Fast PM Queue",
                  },
                  {
                    rank: "Gold Enterprise",
                    criteria: "4+ Projects / ₦5M+",
                    perk: "15% Lifetime Discount + 24/7 PM",
                  },
                  {
                    rank: "Diamond Sovereign",
                    criteria: "Custom Enterprise",
                    perk: "Dedicated Squad + Custom SLA",
                  },
                ]
                  .map((r) => ({
                    ...r,
                    active: r.rank === (user?.loyaltyTier || "Bronze Pioneer"),
                  }))
                  .map((r, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border space-y-2 ${
                        r.active
                          ? "bg-amber-950/40 border-amber-500/50 text-white shadow-lg"
                          : "bg-slate-950 border-slate-800 text-slate-400"
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
                      Share with founders, CTOs &amp; business owners. When they fund their first
                      project milestone, they get <strong>₦50,000 / $50 off</strong>, and you earn{" "}
                      <strong>10% project credits (cashback)</strong>.
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      Unlocked Referral Credits:
                    </span>
                    <div className="text-xl font-bold font-mono text-emerald-400">
                      ₦{(user?.referralCredits ?? 0).toLocaleString()} NGN
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Usable across all future milestones
                    </span>
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
                    Discounts and cashback credits are generated only upon verified first milestone
                    escrow funding. This ensures 100% genuine referrals and immediate project
                    execution.
                  </p>
                </div>

                {/* Activity Feed */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Referred Organizations Status:
                  </div>
                  {myReferrals.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-[11px] text-slate-400">
                      No referrals yet. Share your link above to start earning cashback.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {myReferrals.map((r) => (
                        <div
                          key={r.id}
                          className={`p-3 rounded-xl bg-slate-950 border flex items-center justify-between text-[11px] ${
                            r.status === "milestone_funded" || r.status === "credited"
                              ? "border-emerald-500/30"
                              : "border-amber-500/30"
                          }`}
                        >
                          <div>
                            <strong className="text-white">{r.referredUserName}</strong>
                            <div className="text-slate-400">
                              {r.referredProjectTitle || "Awaiting project brief"} • Registered{" "}
                              {r.registeredAt}
                            </div>
                          </div>
                          <div className="text-right">
                            {r.status === "milestone_funded" || r.status === "credited" ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                                Milestone Funded ✓ (+₦
                                {(r.cashbackEarnedNGN ?? 0).toLocaleString()} Credited)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                                Pending First Milestone Escrow
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Deliverables & Approvals */}
          {activeTab === "milestones" && (
            <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              {isDemoWorkspace ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="font-bold text-base text-white">
                        Milestone 2 Deliverables Inspection (Sample)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Inspected and QA-certified by Tariq Al-Najeeb (Lead PM). Score: 4.95 / 5.0.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                      QA Passed ✓
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                    <div className="font-bold text-white">
                      Deliverable Package: React 19 Frontend + Biometric KYC Integration
                    </div>
                    <div className="text-slate-300">
                      Git Tag: <code className="text-blue-400">v2.0-rc-verified</code> • P95
                      Latency: <code className="text-emerald-400">275ms</code>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={async () => {
                          setMilestoneApprovalError(null);
                          try {
                            const approval = await dbService.approveMilestoneAsClient(
                              QA_PROJECT_ID,
                              QA_MILESTONE_INDEX,
                            );
                            setMilestoneApproved(approval.milestoneApproved);
                          } catch (err) {
                            setMilestoneApprovalError(
                              err instanceof Error
                                ? err.message
                                : "Could not approve this milestone.",
                            );
                          }
                        }}
                        disabled={milestoneApproved}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          milestoneApproved
                            ? "bg-emerald-600 text-white cursor-default"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                        }`}
                      >
                        {milestoneApproved
                          ? "Deliverable Approved & Escrow Released ✓"
                          : "Approve Deliverable & Release Escrow"}
                      </button>
                    </div>
                    {milestoneApprovalError && (
                      <p className="text-xs text-red-400">{milestoneApprovalError}</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="font-bold text-base text-white">No deliverables yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Once your PM assigns milestones to your project, QA-verified deliverables will
                    appear here for your inspection and approval.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Invoices & Billing */}
          {activeTab === "invoices" && (
            <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold text-base text-white">
                  Escrow Invoices &amp; Billing History
                </h3>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                >
                  Make Escrow Deposit
                </button>
              </div>

              {isDemoWorkspace ? (
                <div className="space-y-3">
                  {clientInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
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
                        <span className="font-mono text-emerald-400 font-bold">
                          ${inv.amountUSD.toLocaleString()} USD
                        </span>
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
              ) : myTransactions.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CreditCard className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="font-bold text-base text-white">No invoices yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Once your first project milestone is scheduled, invoices will appear here. You
                    can also make an ad-hoc escrow deposit anytime via the button above.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{tx.reference}</span>
                          <span className="text-slate-400">({tx.purpose})</span>
                        </div>
                        <div className="text-slate-400 mt-0.5">
                          {new Date(tx.timestamp).toLocaleDateString()} • Gateway: {tx.gateway}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-mono font-bold ${tx.status === "success" ? "text-emerald-400" : tx.status === "pending" ? "text-amber-400" : "text-red-400"}`}
                        >
                          {tx.currency} {tx.amount.toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PM Direct Channel */}
          {activeTab === "messages" && (
            <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-4 shadow-2xl">
              {isDemoWorkspace ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                        T
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">
                          Tariq Al-Najeeb (Your Assigned Lead PM) — Sample Conversation
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Average response time: &lt;15 mins
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
                      PM ONLINE
                    </span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {messagesList.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl text-xs space-y-1 ${msg.isPM ? "bg-slate-900 border border-slate-800" : "bg-blue-950/40 border border-blue-800/40 ml-6"}`}
                      >
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
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
                </>
              ) : myLatestBrief && myLatestBrief.assignedPM !== "Unassigned" ? (
                <div className="text-center py-10 space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="font-bold text-base text-white">
                    You're connected with {myLatestBrief.assignedPM}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Direct in-portal messaging is being rolled out -- for now, your PM will follow
                    up by email at {user?.email}.
                  </p>
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="font-bold text-base text-white">No PM assigned yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You'll be connected with a dedicated PM here as soon as your brief is reviewed
                    and claimed.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Contracts */}
          {activeTab === "contracts" && (
            <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-4 text-xs shadow-2xl">
              <h3 className="font-bold text-sm text-white">
                Bilateral NDA &amp; Master Services Agreement
              </h3>
              {isDemoWorkspace ? (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">
                        Mutual NDA Executed (Sample): NDH-
                        {currentOrg.name.slice(0, 4).toUpperCase()}-2026
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Timestamp: 2026-01-15 14:22 UTC • Signed by Authorized Officer
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>Download PDF</span>
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <Lock className="w-8 h-8 text-slate-600 mx-auto" />
                  <h4 className="font-bold text-white">No agreements signed yet</h4>
                  <p className="text-slate-400 max-w-sm mx-auto">
                    Your NDA and Master Services Agreement will be generated here once your first
                    project is confirmed with your assigned PM.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Escrow Deposit Modal */}
      <PaystackPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        projectName={customTaskTitle || selectedPaymentInvoice || "Milestone Escrow Deposit"}
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
              Assigned PM:{" "}
              <strong className="text-slate-200">
                {isDemoWorkspace
                  ? "Tariq Al-Najeeb"
                  : myLatestBrief && myLatestBrief.assignedPM !== "Unassigned"
                    ? myLatestBrief.assignedPM
                    : "Not yet assigned"}
              </strong>{" "}
              (SLA &lt;15m)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>NDA-Protected • Dual-Key Escrow Milestones</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

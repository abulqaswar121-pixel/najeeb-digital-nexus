import React, { useState, useRef, useEffect } from "react";
import { AIChatMessage } from "../../types/ndh";
import { SERVICE_DEPARTMENTS } from "../../data/mockData";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";
import { ServiceDepartment } from "../../types/ndh";
// Official NDH assistant avatar, shared with the parent gateway's OmniHubChat.
import assistantAvatar from "@/assets/ndh-ai-assistant.png";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  Compass,
  Layers,
  Award,
  Lock,
  MessageSquare,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

interface AIAssistantWidgetProps {
  onOpenBriefWizard: () => void;
  onNavigateScreen: (screen: string) => void;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  onOpenBriefWizard,
  onNavigateScreen,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // The micro-greeting pill is dismissible; once closed it stays closed for the
  // rest of the session rather than reappearing on every navigation.
  const [isGreetingDismissed, setIsGreetingDismissed] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"chat" | "calculator" | "brief_checker">("chat");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { currency, getRegionalPricing } = useCurrencyLanguage();

  // Service & SLA Finder state (replaces the old raw FX calculator, which
  // didn't belong here and duplicated/contradicted the real, locally-adjusted
  // pricing already shown on the Services page). This instead surfaces real
  // department turnaround + starter pricing data already used sitewide.
  const [finderDept, setFinderDept] = useState<ServiceDepartment>(SERVICE_DEPARTMENTS[0]!.id);
  const finderDeptInfo =
    SERVICE_DEPARTMENTS.find((d) => d.id === finderDept) || SERVICE_DEPARTMENTS[0]!;
  const finderStarterPricing = getRegionalPricing(finderDept, "starter");

  // Brief Quality Checker State
  const [briefInput, setBriefInput] = useState<string>("");
  const [briefScoreResult, setBriefScoreResult] = useState<{
    score: number;
    dept: string;
    duration: string;
    estBudgetUSD: string;
    tips: string[];
  } | null>(null);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: "Hello! I am NDH Sentinel, the AI Operations Concierge for NDH Agency. How can I assist you today? You can ask about our 16 managed departments, estimate SLAs, find starter pricing, or test your brief readiness.",
      timestamp: "Just now",
      quickActions: [
        // The five agency quick actions, each wired to a real existing handler
        // (brief wizard, estimator tab, case-study view, consultation, Academy).
        { label: "Submit a Project Brief", action: "open_wizard" },
        { label: "Estimate Delivery Timeline", action: "switch_calc" },
        { label: "Explore Case Studies", action: "view_work" },
        { label: "Book a Strategy Consultation", action: "book_consultation" },
        { label: "Ask about NDH Academy & Courses", action: "explain_academy" },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulated Intelligent Sentinel Responses
    setTimeout(() => {
      let botResponse = "";
      let actions: { label: string; action: string }[] | undefined = undefined;

      const q = query.toLowerCase();

      if (q.includes("recommend") || q.includes("service") || q.includes("which department")) {
        botResponse =
          "NDH operates 16 managed departments. For modern fintech/web apps, our Website & App Development and UI/UX Design squads pair together. For rapid workflow automation, our AI Solutions & Automation department delivers custom LLM & n8n pipelines in under 14 days.";
        actions = [
          { label: "Open Proposal Wizard", action: "open_wizard" },
          { label: "View 16 Departments", action: "view_services" },
        ];
      } else if (
        q.includes("privacy") ||
        q.includes("freelance") ||
        q.includes("direct contact") ||
        q.includes("margin")
      ) {
        botResponse =
          "NDH Agency is a strictly managed bureau. Clients communicate exclusively with assigned Project Managers. Talents and clients never exchange direct emails or view raw agency pricing margins, guaranteeing SLA accountability and zero freelance bidding headaches.";
        actions = [
          { label: "Explore PM Command", action: "view_pm" },
          { label: "View Case Studies", action: "view_work" },
        ];
      } else if (q.includes("academy") || q.includes("training") || q.includes("graduate")) {
        botResponse =
          "NDH Academy (https://academy.ndh.com.ng) is our sister training platform for African tech talent. It operates as a separate codebase and database. Verified Academy graduates earn cryptographic talent badges that qualify them for NDH Agency sprint squads.";
        actions = [{ label: "Visit academy.ndh.com.ng", action: "visit_academy" }];
      } else if (
        q.includes("price") ||
        q.includes("cost") ||
        q.includes("budget") ||
        q.includes("rate") ||
        q.includes("currency")
      ) {
        botResponse =
          "Pricing is milestone-based and varies by department and scope tier — from accessible starter packages up to $75,000+ USD for sovereign enterprise architectures. We show exact, locally-adjusted pricing in your selected currency (USD, NGN, GBP, EUR, or AED) — use the Service Finder below for an exact starter figure by department.";
        actions = [
          { label: "Service Finder", action: "switch_calc" },
          { label: "Build Proposal", action: "open_wizard" },
        ];
      } else if (q.includes("brief") || q.includes("score") || q.includes("evaluate")) {
        botResponse =
          "You can use our interactive Brief Quality Checker tool to benchmark your project requirements, estimated timeline, and recommended squad composition.";
        actions = [{ label: "Launch Brief Checker", action: "switch_brief_checker" }];
      } else {
        botResponse = `Thank you for your inquiry about "${query}". A dedicated NDH Project Manager is available to review your technical requirements and formulate a tailored milestone proposal within 24 hours.`;
        actions = [
          { label: "Request Proposal", action: "open_wizard" },
          { label: "View Case Studies", action: "view_work" },
          // The greeting row now leads with the five commercial quick actions,
          // so these two explainers live on as follow-ups rather than being
          // orphaned (their handlers are otherwise unreachable by click).
          { label: "Recommend Service", action: "recommend_service" },
          { label: "Privacy & PM Model", action: "explain_privacy" },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "assistant",
          text: botResponse,
          timestamp: "Just now",
          quickActions: actions,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action: string) => {
    if (action === "open_wizard") {
      onOpenBriefWizard();
    } else if (action === "view_services") {
      onNavigateScreen("services");
    } else if (action === "view_work") {
      onNavigateScreen("case-study");
    } else if (action === "view_pm") {
      onNavigateScreen("pm-dashboard");
    } else if (action === "book_consultation") {
      // Strategy consultations are booked through the contact page, which owns
      // the consultation-request form backed by /api/consultation-requests.
      onNavigateScreen("contact");
    } else if (action === "switch_calc") {
      setActiveTab("calculator");
    } else if (action === "switch_brief_checker") {
      setActiveTab("brief_checker");
    } else if (action === "recommend_service") {
      handleSendMessage("What are your 10 core service departments and how are they managed?");
    } else if (action === "explain_privacy") {
      handleSendMessage("Explain the managed agency privacy model and PM communication barrier.");
    } else if (action === "check_brief") {
      setActiveTab("brief_checker");
    } else if (action === "explain_academy") {
      handleSendMessage("How do NDH Agency and NDH Academy integrate without coupling?");
    } else if (action === "visit_academy") {
      window.open("https://academy.ndh.com.ng", "_blank");
    }
  };

  const runBriefEvaluation = () => {
    if (!briefInput.trim()) return;
    const words = briefInput.trim().split(/\s+/).length;
    const score = Math.min(98, Math.max(65, 60 + words * 2));
    let dept = "Website & App Development";
    let duration = "8 - 12 Weeks";
    let estBudget = "$25,000 - $45,000 USD";

    const b = briefInput.toLowerCase();
    if (b.includes("brand") || b.includes("logo") || b.includes("identity")) {
      dept = "Brand Strategy & Identity";
      duration = "4 - 6 Weeks";
      estBudget = "$8,000 - $18,000 USD";
    } else if (
      b.includes("ai") ||
      b.includes("automation") ||
      b.includes("bot") ||
      b.includes("llm")
    ) {
      dept = "AI Solutions & Workflow Automation";
      duration = "6 - 10 Weeks";
      estBudget = "$15,000 - $35,000 USD";
    } else if (
      b.includes("shop") ||
      b.includes("ecommerce") ||
      b.includes("store") ||
      b.includes("cart")
    ) {
      dept = "E-commerce & Growth Funnels";
      duration = "6 - 8 Weeks";
      estBudget = "$12,000 - $28,000 USD";
    }

    setBriefScoreResult({
      score,
      dept,
      duration,
      estBudgetUSD: estBudget,
      tips: [
        "Clearly defined target user persona and key bottleneck.",
        "Specified multi-currency or compliance requirements.",
        "Ready for dedicated Project Manager review and milestone breakdown.",
      ],
    });
  };

  return (
    <>
      {/* Floating launcher — aligned with the parent gateway's OmniHubChat: a
          fixed circular button carrying the official NDH assistant avatar, an
          animated Electric Cyan orbit ring and a live status dot. Renders
          outside any full-width row so it can never contribute to horizontal
          overflow, and sits clear of the bottom-left install banner. */}
      {!isOpen && (
        <>
          {!isGreetingDismissed && (
            <div className="ai-assistant-greeting" role="status">
              <span className="ai-assistant-greeting-text">
                Need a quote or technical team? Ask NDH AI
              </span>
              <button
                type="button"
                className="ai-assistant-greeting-open"
                onClick={() => setIsOpen(true)}
              >
                Ask
              </button>
              <button
                type="button"
                className="ai-assistant-greeting-dismiss"
                onClick={() => setIsGreetingDismissed(true)}
                aria-label="Dismiss AI assistant greeting"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="ai-assistant-launcher"
            aria-label="Open the NDH AI assistant"
            aria-expanded={false}
          >
            <span className="ai-assistant-orbit" aria-hidden="true" />
            <img
              className="ai-assistant-avatar"
              src={assistantAvatar}
              alt=""
              width={816}
              height={816}
            />
            <span className="ai-assistant-status" aria-hidden="true" />
          </button>
        </>
      )}

      {/* Floating Assistant Modal Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="NDH Sentinel AI assistant"
          className="fixed bottom-3 left-3 right-3 z-[80] flex h-[min(600px,calc(100dvh-1.5rem))] flex-col justify-between overflow-hidden rounded-3xl border border-white/12 bg-eco-navy/95 text-xs text-slate-200 shadow-2xl shadow-black/90 backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-300 sm:bottom-6 sm:left-auto sm:right-6 sm:w-full sm:max-w-[420px]"
        >
          {/* Header */}
          <div className="p-4 from-eco-dark via-eco-navy to-eco-dark border-b border-white/10 bg-gradient-to-r flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="bg-eco-electric/15 border-eco-electric/40 text-eco-electric flex h-8 w-8 items-center justify-center rounded-xl border">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                  <span>NDH Sentinel Concierge</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-eco-cyan/80 text-[10px]">
                  AI Support • Managed Agency Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--eco-on-dark-muted)] rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-tabs: Chat, Brief Evaluator, Service Finder */}
          <div className="bg-eco-dark border-b border-white/10 px-3 py-1.5 flex items-center justify-between text-[11px] shrink-0">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-eco-electric text-eco-dark shadow-sm"
                  : "text-[var(--eco-on-dark-muted)] hover:text-white"
              }`}
            >
              AI Live Chat
            </button>

            <button
              onClick={() => setActiveTab("brief_checker")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === "brief_checker"
                  ? "bg-eco-electric text-eco-dark shadow-sm"
                  : "text-[var(--eco-on-dark-muted)] hover:text-white"
              }`}
            >
              Brief Evaluator
            </button>

            <button
              onClick={() => setActiveTab("calculator")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === "calculator"
                  ? "bg-eco-electric text-eco-dark shadow-sm"
                  : "text-[var(--eco-on-dark-muted)] hover:text-white"
              }`}
            >
              Service Finder
            </button>
          </div>

          {/* TAB 1: AI Chat */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] leading-relaxed text-xs ${
                        msg.sender === "user"
                          ? "bg-eco-electric text-eco-dark rounded-br-xs"
                          : "border-white/10 bg-white/[0.07] text-slate-100 rounded-bl-xs border shadow-md"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Quick Action Chips */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.quickActions.map((qa, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(qa.action)}
                            className="border-eco-cyan/25 bg-white/[0.07] hover:bg-white/12 text-eco-cyan flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all"
                          >
                            <span>{qa.label}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 w-24 rounded-xl border border-white/10 bg-white/[0.06] p-2.5 text-[var(--eco-on-dark-muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-eco-electric animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-eco-electric animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-eco-electric animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="bg-eco-dark border-t border-white/10 p-3 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Ask NDH Sentinel anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="focus:border-eco-cyan flex-1 rounded-xl border border-white/12 bg-white/[0.06] px-3.5 py-2 text-xs text-white placeholder:text-[var(--eco-on-dark-muted)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  aria-label="Send message"
                  className="bg-eco-electric text-eco-dark shrink-0 rounded-xl p-2.5 shadow-md shadow-cyan-500/30 transition-all hover:brightness-110"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Brief Evaluator */}
          {activeTab === "brief_checker" && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>AI Brief Readiness Evaluator</span>
                </h4>
                <p className="text-[11px] text-[var(--eco-on-dark-muted)]">
                  Paste your project description or requirement bullet points to assess readiness
                  score before PM triage.
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={4}
                  placeholder="Describe your project (e.g., We need a cross-border remittance web app with instant KYC and multi-currency Paystack/Stripe checkout)..."
                  value={briefInput}
                  onChange={(e) => setBriefInput(e.target.value)}
                  className="focus:border-eco-cyan w-full rounded-xl border border-white/12 bg-white/[0.06] p-3 text-xs text-white placeholder:text-[var(--eco-on-dark-muted)] focus:outline-none"
                />

                <button
                  onClick={runBriefEvaluation}
                  className="bg-eco-electric text-eco-dark w-full rounded-xl py-2.5 text-xs font-semibold shadow-md shadow-cyan-500/30 transition-all hover:brightness-110"
                >
                  Analyze Brief Readiness
                </button>
              </div>

              {briefScoreResult && (
                <div className="rounded-xl border border-white/12 bg-white/[0.06] space-y-3 p-3.5 text-xs animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Readiness Score:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {briefScoreResult.score} / 100
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div>
                      <span className="text-[var(--eco-on-dark-muted)]">Recommended Squad:</span>{" "}
                      <strong className="text-white">{briefScoreResult.dept}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--eco-on-dark-muted)]">Est. Duration:</span>{" "}
                      <strong className="text-white">{briefScoreResult.duration}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--eco-on-dark-muted)]">
                        Est. Scope Investment:
                      </span>{" "}
                      <strong className="text-emerald-400 font-mono">
                        {briefScoreResult.estBudgetUSD}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={onOpenBriefWizard}
                    className="bg-success w-full rounded-lg py-2 text-xs font-semibold text-white transition-colors hover:brightness-110 flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Full Proposal Wizard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Service & SLA Finder — pick any of the 16 departments to see
              its real turnaround time and starter price in your currency,
              using the same pricing engine as the rest of the site. */}
          {activeTab === "calculator" && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-eco-cyan" />
                  <span>Service &amp; SLA Finder</span>
                </h4>
                <p className="text-[11px] text-[var(--eco-on-dark-muted)]">
                  Pick a department to see its real starter pricing (in {currency}) and typical
                  turnaround time.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-[var(--eco-on-dark-muted)] block mb-1">
                    Department:
                  </label>
                  <select
                    value={finderDept}
                    onChange={(e) => setFinderDept(e.target.value as ServiceDepartment)}
                    className="focus:border-eco-cyan w-full rounded-xl border border-white/12 bg-white/[0.06] p-2.5 text-xs text-white focus:outline-none"
                  >
                    {SERVICE_DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1 rounded-xl border border-white/12 bg-white/[0.06] p-3">
                    <span className="text-[10px] text-[var(--eco-on-dark-muted)] block">
                      Starter Price From:
                    </span>
                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      {currency} {finderStarterPricing.price.toLocaleString()}
                    </div>
                    <span className="text-[9px] text-[var(--eco-on-dark-muted)]">
                      {finderStarterPricing.starterDesc}
                    </span>
                  </div>

                  <div className="space-y-1 rounded-xl border border-white/12 bg-white/[0.06] p-3">
                    <span className="text-[10px] text-[var(--eco-on-dark-muted)] block">
                      Typical Turnaround:
                    </span>
                    <div className="font-mono font-bold text-eco-cyan text-sm">
                      {finderDeptInfo.averageTurnaroundDays} days
                    </div>
                    <span className="text-[9px] text-[var(--eco-on-dark-muted)]">
                      {finderDeptInfo.activeTalentsCount} active talents
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-eco-cyan/20 bg-white/[0.04] p-3 text-[11px] text-[var(--eco-on-dark-muted)] space-y-1">
                  <div className="font-semibold text-white">Payment Method Support:</div>
                  <p>
                    Invoices can be settled via Paystack (Nigeria/Ghana), Flutterwave, Stripe
                    (US/UK/EU), or direct verified bank wire.
                  </p>
                </div>

                <button
                  onClick={onOpenBriefWizard}
                  className="bg-eco-electric text-eco-dark w-full rounded-xl py-2.5 text-xs font-semibold shadow-md shadow-cyan-500/30 transition-all hover:brightness-110 flex items-center justify-center gap-1.5"
                >
                  <span>Build Proposal for This Department</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="bg-eco-dark border-t border-white/10 p-2.5 flex items-center justify-between text-[10px] text-[var(--eco-on-dark-muted)] shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Scripted Concierge — Demo Responses Only</span>
            </span>
            <span>NDH Agency Nexus v1.0</span>
          </div>
        </div>
      )}
    </>
  );
};

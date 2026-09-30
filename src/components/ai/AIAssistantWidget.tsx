import React, { useState, useRef, useEffect } from 'react';
import { AIChatMessage } from '../../types/ndh';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  Calculator,
  Layers,
  Award,
  Lock,
  MessageSquare,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

interface AIAssistantWidgetProps {
  onOpenBriefWizard: () => void;
  onNavigateScreen: (screen: string) => void;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  onOpenBriefWizard,
  onNavigateScreen,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'calculator' | 'brief_checker'>('chat');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Calculator State
  const [calcAmountUSD, setCalcAmountUSD] = useState<number>(25000);
  const fxRateNGN = 1500; // 1 USD = 1,500 NGN
  const fxRateGBP = 0.78; // 1 USD = 0.78 GBP

  // Brief Quality Checker State
  const [briefInput, setBriefInput] = useState<string>('');
  const [briefScoreResult, setBriefScoreResult] = useState<{
    score: number;
    dept: string;
    duration: string;
    estBudgetUSD: string;
    tips: string[];
  } | null>(null);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hello! I am NDH Sentinel, the AI Operations Concierge for NDH Agency. How can I assist you today? You can ask about our 10 managed departments, estimate SLAs, convert currencies, or test your brief readiness.',
      timestamp: 'Just now',
      quickActions: [
        { label: 'Recommend Service', action: 'recommend_service' },
        { label: 'Privacy & PM Model', action: 'explain_privacy' },
        { label: 'Check Brief Quality', action: 'check_brief' },
        { label: 'Academy vs Agency', action: 'explain_academy' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulated Intelligent Sentinel Responses
    setTimeout(() => {
      let botResponse = '';
      let actions: { label: string; action: string }[] | undefined = undefined;

      const q = query.toLowerCase();

      if (q.includes('recommend') || q.includes('service') || q.includes('which department')) {
        botResponse =
          'NDH operates 10 managed departments. For modern fintech/web apps, our Website & App Development and UI/UX Design squads pair together. For rapid workflow automation, our AI Solutions & Automation department delivers custom LLM & n8n pipelines in under 14 days.';
        actions = [
          { label: 'Open Proposal Wizard', action: 'open_wizard' },
          { label: 'View 10 Departments', action: 'view_services' },
        ];
      } else if (q.includes('privacy') || q.includes('freelance') || q.includes('direct contact') || q.includes('margin')) {
        botResponse =
          'NDH Agency is a strictly managed bureau. Clients communicate exclusively with assigned Project Managers. Talents and clients never exchange direct emails or view raw agency pricing margins, guaranteeing SLA accountability and zero freelance bidding headaches.';
        actions = [
          { label: 'Explore PM Command', action: 'view_pm' },
          { label: 'View Case Studies', action: 'view_work' },
        ];
      } else if (q.includes('academy') || q.includes('training') || q.includes('graduate')) {
        botResponse =
          'NDH Academy (https://academy.ndh.com.ng) is our sister training platform for African tech talent. It operates as a separate codebase and database. Verified Academy graduates earn cryptographic talent badges that qualify them for NDH Agency sprint squads.';
        actions = [
          { label: 'Visit academy.ndh.com.ng', action: 'visit_academy' },
        ];
      } else if (q.includes('price') || q.includes('cost') || q.includes('budget') || q.includes('rate') || q.includes('currency')) {
        botResponse =
          'We provide custom milestone-based scopes starting from $2,000 USD (₦3M NGN) up to $75,000+ USD for sovereign enterprise architectures. All quotes are delivered in your choice of USD, NGN, or GBP with Paystack and Stripe payment gateways.';
        actions = [
          { label: 'Currency Calculator', action: 'switch_calc' },
          { label: 'Build Proposal', action: 'open_wizard' },
        ];
      } else if (q.includes('brief') || q.includes('score') || q.includes('evaluate')) {
        botResponse =
          'You can use our interactive Brief Quality Checker tool to benchmark your project requirements, estimated timeline, and recommended squad composition.';
        actions = [
          { label: 'Launch Brief Checker', action: 'switch_brief_checker' },
        ];
      } else {
        botResponse =
          `Thank you for your inquiry about "${query}". A dedicated NDH Project Manager is available to review your technical requirements and formulate a tailored milestone proposal within 24 hours.`;
        actions = [
          { label: 'Request Proposal', action: 'open_wizard' },
          { label: 'View Case Studies', action: 'view_work' },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: botResponse,
          timestamp: 'Just now',
          quickActions: actions,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action: string) => {
    if (action === 'open_wizard') {
      onOpenBriefWizard();
    } else if (action === 'view_services') {
      onNavigateScreen('services');
    } else if (action === 'view_work') {
      onNavigateScreen('case-study');
    } else if (action === 'view_pm') {
      onNavigateScreen('pm-dashboard');
    } else if (action === 'switch_calc') {
      setActiveTab('calculator');
    } else if (action === 'switch_brief_checker') {
      setActiveTab('brief_checker');
    } else if (action === 'recommend_service') {
      handleSendMessage('What are your 10 core service departments and how are they managed?');
    } else if (action === 'explain_privacy') {
      handleSendMessage('Explain the managed agency privacy model and PM communication barrier.');
    } else if (action === 'check_brief') {
      setActiveTab('brief_checker');
    } else if (action === 'explain_academy') {
      handleSendMessage('How do NDH Agency and NDH Academy integrate without coupling?');
    } else if (action === 'visit_academy') {
      window.open('https://academy.ndh.com.ng', '_blank');
    }
  };

  const runBriefEvaluation = () => {
    if (!briefInput.trim()) return;
    const words = briefInput.trim().split(/\s+/).length;
    let score = Math.min(98, Math.max(65, 60 + words * 2));
    let dept = 'Website & App Development';
    let duration = '8 - 12 Weeks';
    let estBudget = '$25,000 - $45,000 USD';

    const b = briefInput.toLowerCase();
    if (b.includes('brand') || b.includes('logo') || b.includes('identity')) {
      dept = 'Brand Strategy & Identity';
      duration = '4 - 6 Weeks';
      estBudget = '$8,000 - $18,000 USD';
    } else if (b.includes('ai') || b.includes('automation') || b.includes('bot') || b.includes('llm')) {
      dept = 'AI Solutions & Workflow Automation';
      duration = '6 - 10 Weeks';
      estBudget = '$15,000 - $35,000 USD';
    } else if (b.includes('shop') || b.includes('ecommerce') || b.includes('store') || b.includes('cart')) {
      dept = 'E-commerce & Growth Funnels';
      duration = '6 - 8 Weeks';
      estBudget = '$12,000 - $28,000 USD';
    }

    setBriefScoreResult({
      score,
      dept,
      duration,
      estBudgetUSD: estBudget,
      tips: [
        'Clearly defined target user persona and key bottleneck.',
        'Specified multi-currency or compliance requirements.',
        'Ready for dedicated Project Manager review and milestone breakdown.',
      ],
    });
  };

  return (
    <>
      {/* Floating Action Launcher Button */}
      <div className="fixed bottom-4 left-3 right-3 z-50 flex justify-end sm:bottom-6 sm:left-auto sm:right-6">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex max-w-full items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl shadow-blue-600/50 border border-blue-400/40 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
            </div>
            <div className="text-left font-sans">
              <div className="text-xs font-bold leading-tight tracking-wide flex items-center gap-1">
                <span>NDH Sentinel</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-900/80 text-blue-300 font-mono text-[9px] uppercase">
                  AI Support
                </span>
              </div>
               <div className="hidden text-[10px] text-blue-200/90 leading-tight min-[380px]:block">Instant Scoping & PM Concierge</div>
            </div>
          </button>
        )}
      </div>

      {/* Floating Assistant Modal Window */}
      {isOpen && (
        <div className="fixed bottom-3 left-3 right-3 z-50 flex h-[min(600px,calc(100dvh-1.5rem))] flex-col justify-between overflow-hidden rounded-3xl border border-blue-900/60 bg-[#0A0E17]/95 text-xs text-slate-200 shadow-2xl shadow-black/90 backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-300 sm:bottom-6 sm:left-auto sm:right-6 sm:w-full sm:max-w-[420px]">
          {/* Header */}
          <div className="p-4 border-b border-blue-900/40 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-indigo-950/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                  <span>NDH Sentinel Concierge</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[10px] text-blue-300/80">AI Support • Managed Agency Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-tabs: Chat, FX Calculator, Brief Checker */}
          <div className="px-3 py-1.5 bg-[#080C14] border-b border-blue-950 flex items-center justify-between text-[11px] shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === 'chat' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Live Chat
            </button>

            <button
              onClick={() => setActiveTab('brief_checker')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === 'brief_checker' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Brief Evaluator
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === 'calculator' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FX Calculator
            </button>
          </div>

          {/* TAB 1: AI Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] leading-relaxed text-xs ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-xs shadow-md'
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
                            className="px-2.5 py-1 rounded-full bg-blue-950/80 hover:bg-blue-900 border border-blue-800/60 text-blue-300 text-[10px] font-medium transition-all flex items-center gap-1"
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
                  <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 w-24">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-800 bg-[#080C14] flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Ask NDH Sentinel anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Brief Evaluator */}
          {activeTab === 'brief_checker' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>AI Brief Readiness Evaluator</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Paste your project description or requirement bullet points to assess readiness score before PM triage.
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={4}
                  placeholder="Describe your project (e.g., We need a cross-border remittance web app with instant KYC and multi-currency Paystack/Stripe checkout)..."
                  value={briefInput}
                  onChange={(e) => setBriefInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />

                <button
                  onClick={runBriefEvaluation}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all"
                >
                  Analyze Brief Readiness
                </button>
              </div>

              {briefScoreResult && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-900/60 space-y-3 text-xs animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-semibold text-white">Readiness Score:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {briefScoreResult.score} / 100
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div>
                      <span className="text-slate-400">Recommended Squad:</span>{' '}
                      <strong className="text-white">{briefScoreResult.dept}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Est. Duration:</span>{' '}
                      <strong className="text-white">{briefScoreResult.duration}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Est. Scope Investment:</span>{' '}
                      <strong className="text-emerald-400 font-mono">{briefScoreResult.estBudgetUSD}</strong>
                    </div>
                  </div>

                  <button
                    onClick={onOpenBriefWizard}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Full Proposal Wizard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FX Multi-Currency Calculator */}
          {activeTab === 'calculator' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-blue-400" />
                  <span>Multi-Currency Investment Calculator</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Convert project budgets between USD, NGN, and GBP with transparent parity for African and diaspora enterprises.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Budget Allocation (USD):</label>
                  <input
                    type="number"
                    value={calcAmountUSD}
                    onChange={(e) => setCalcAmountUSD(Number(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">Nigerian Naira (NGN):</span>
                    <div className="font-mono font-bold text-emerald-400 text-sm">
                      ₦{(calcAmountUSD * fxRateNGN).toLocaleString()}
                    </div>
                    <span className="text-[9px] text-slate-500">Rate: 1 USD = ₦1,500</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block">British Pound (GBP):</span>
                    <div className="font-mono font-bold text-blue-400 text-sm">
                      £{(calcAmountUSD * fxRateGBP).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <span className="text-[9px] text-slate-500">Rate: 1 USD = £0.78</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-slate-300 space-y-1">
                  <div className="font-semibold text-white">Payment Method Support:</div>
                  <p>Invoices can be settled via Paystack (Nigeria/Ghana), Flutterwave, Stripe (US/UK/EU), or direct verified bank wire.</p>
                </div>

                <button
                  onClick={onOpenBriefWizard}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Build Proposal at this Budget</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="p-2.5 border-t border-slate-800 bg-[#06090F] flex items-center justify-between text-[10px] text-slate-500 shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>NDPR & ISO 27001 Protected</span>
            </span>
            <span>NDH Agency Nexus v1.0</span>
          </div>
        </div>
      )}
    </>
  );
};

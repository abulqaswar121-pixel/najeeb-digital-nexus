import React, { useState } from 'react';
import { ServiceDepartment, ServiceDepartmentInfo } from '../../../types/ndh';
import { SERVICE_DEPARTMENTS, CASE_STUDIES } from '../../../data/mockData';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Award,
  Lock,
  Users,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
  Clock,
  Layers,
  BarChart3,
  Globe2,
  FileText,
  Check,
  TrendingUp,
  Sliders,
  DollarSign,
  Building,
} from 'lucide-react';

interface HomepagePreviewProps {
  direction?: string;
  onOpenBriefWizard: () => void;
  onSelectScreen: (screen: string) => void;
}

export const HomepagePreview: React.FC<HomepagePreviewProps> = ({
  onOpenBriefWizard,
  onSelectScreen,
}) => {
  const [calculatorDept, setCalculatorDept] = useState<ServiceDepartment>('web_app_development');
  const [calculatorTier, setCalculatorTier] = useState<'standard' | 'growth' | 'enterprise'>('growth');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

  const featuredCases = CASE_STUDIES.filter((c) => c.featured);

  // Quick estimator calculations matching exact ServiceDepartment keys
  const deptPricingMap: Record<ServiceDepartment, { standard: number; growth: number; enterprise: number; weeks: string }> = {
    web_app_development: { standard: 6500, growth: 12500, enterprise: 25000, weeks: '4-8 weeks' },
    mobile_app_development: { standard: 8000, growth: 15000, enterprise: 32000, weeks: '6-10 weeks' },
    ui_ux_product_design: { standard: 5000, growth: 9500, enterprise: 18000, weeks: '4-6 weeks' },
    brand_strategy_identity: { standard: 4500, growth: 8500, enterprise: 16000, weeks: '3-5 weeks' },
    ai_solutions_automation: { standard: 7000, growth: 14000, enterprise: 28000, weeks: '3-6 weeks' },
    ecommerce_growth: { standard: 4000, growth: 8000, enterprise: 16000, weeks: '4-7 weeks' },
    cloud_devops_sre: { standard: 5500, growth: 11000, enterprise: 20000, weeks: '3-6 weeks' },
    pan_african_market_research: { standard: 4000, growth: 8000, enterprise: 15000, weeks: '3-5 weeks' },
    cybersecurity_ndpr_audits: { standard: 6000, growth: 12000, enterprise: 24000, weeks: '3-5 weeks' },
    enterprise_erp_custom_software: { standard: 10000, growth: 22000, enterprise: 45000, weeks: '8-14 weeks' },
  };

  const currentPricing = deptPricingMap[calculatorDept] || deptPricingMap.web_app_development;
  const estimatedUsd = currentPricing[calculatorTier];
  const estimatedNgn = estimatedUsd * 1520;
  const estimatedWeeks = currentPricing.weeks;

  return (
    <div className="bg-[#090D1A] text-slate-100 min-h-screen font-sans selection:bg-blue-600/30 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-800">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Eyebrow Trust Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-600/40 text-blue-300 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Managed Digital Services Bureau • Dedicated PM Governance</span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Engineering Sovereign Digital Systems for{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
                Visionary Enterprises.
              </span>
            </h1>

            {/* Clear Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              NDH Agency delivers mission-critical software, mobile applications, high-craft brand systems, and Pan-African market intelligence. Managed end-to-end by senior Project Managers with strict SLAs, zero freelance bidding, and guaranteed IP escrow.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onOpenBriefWizard}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <span>Request a Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectScreen('services')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Explore 10 Services</span>
              </button>

              <button
                onClick={() => onSelectScreen('case-study')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
              >
                <span>Case Studies & ROI</span>
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">
                  $188.5K+
                </div>
                <div className="text-xs font-semibold text-white mt-1">Active Scoped Volume</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Multi-currency billing</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  99.4%
                </div>
                <div className="text-xs font-semibold text-white mt-1">SLA Delivery Adherence</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Rigid dual QA gates</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">
                  42
                </div>
                <div className="text-xs font-semibold text-white mt-1">Vetted Specialists</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Top 3% African engineers</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                  &lt;300ms
                </div>
                <div className="text-xs font-semibold text-white mt-1">FinTech Core Latency</div>
                <div className="text-[11px] text-slate-400 mt-0.5">High-throughput infra</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE MANAGED BUREAU ADVANTAGE (VS FREELANCE MARKETPLACES) */}
      <section className="py-20 border-b border-slate-800 bg-[#070A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Operational Model</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Global Leaders Choose the NDH Managed Bureau
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              We eliminate the chaos of unvetted freelance platforms and the bloated overhead of legacy agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The NDH Bureau */}
            <div className="p-8 rounded-2xl bg-slate-900/90 border-2 border-blue-500/60 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-bl-xl uppercase tracking-wider">
                NDH Managed Standard
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>The NDH Managed Bureau</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Direct executive accountability and institutional SLAs.
                  </p>
                </div>

                <ul className="space-y-4 text-xs">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Dedicated Project Manager Buffer</strong>
                      <span className="text-slate-300">
                        Clients communicate exclusively with a senior PM. No managing freelancer chats or missed deadlines.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Dual-Gate Quality Assurance</strong>
                      <span className="text-slate-300">
                        Every line of code and design token is peer-reviewed and tested before the client reviews milestone deliverables.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Guaranteed Intellectual Property & Escrow</strong>
                      <span className="text-slate-300">
                        Institutional NDAs, complete source code assignment, and Paystack/Stripe milestone escrow releases.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Zero Talent-Client Friction</strong>
                      <span className="text-slate-300">
                        Strict commercial privacy boundaries. Clients get crystal-clear pricing; talent gets guaranteed disbursements.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Unmanaged Freelancer Marketplaces */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-300">
                    Open Freelance Platforms (Upwork / Fiverr)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Unmanaged marketplaces with high client overhead and delivery risk.
                  </p>
                </div>

                <ul className="space-y-4 text-xs text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                    <div>
                      <strong className="text-slate-300 block font-medium">Zero Project Management Oversight</strong>
                      <span>
                        Client must act as full-time project manager, chasing multiple disparate contractors.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                    <div>
                      <strong className="text-slate-300 block font-medium">Unpredictable Code & Design Quality</strong>
                      <span>
                        No automated QA gates or peer code reviews, leading to critical production security flaws.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                    <div>
                      <strong className="text-slate-300 block font-medium">Freelancer Ghosting & IP Ambiguity</strong>
                      <span>
                        High risk of mid-sprint developer abandonment and unclear copyright transfer across borders.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                    <div>
                      <strong className="text-slate-300 block font-medium">Unpredictable Timezone & Currency Friction</strong>
                      <span>
                        Disjointed communication, high FX transaction loss, and uncoordinated sprints.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TEN CORE SERVICE DEPARTMENTS */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Full-Spectrum Execution</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                10 Core Service Departments
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                From sub-300ms fintech engines to pan-African brand systems, our departments operate under strict SLAs and proven architectures.
              </p>
            </div>

            <button
              onClick={() => onSelectScreen('services')}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View Full Service Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_DEPARTMENTS.slice(0, 6).map((dept) => (
              <div
                key={dept.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                      {dept.averageTurnaroundDays}d Turnaround
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                      {dept.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Key Capabilities:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dept.capabilities.slice(0, 3).map((cap, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] border border-slate-700"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-white">
                    Starting from ${dept.startingBudgetUSD.toLocaleString()} USD
                  </div>
                  <button
                    onClick={onOpenBriefWizard}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Scope Project</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE PROJECT ESTIMATOR & SCOPING WIDGET */}
      <section className="py-20 border-b border-slate-800 bg-[#070A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>Instant Scoping Calculator</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Estimate Your Project Timeline & Investment
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  Select your primary department and engagement tier to estimate deliverables, timeline, and multi-currency billing.
                </p>
              </div>

              {/* Department Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  1. Select Department:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {SERVICE_DEPARTMENTS.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => setCalculatorDept(dept.id)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                        calculatorDept === dept.id
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md font-bold'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate">{dept.name.split(' ')[0]}</div>
                      <div className="text-[10px] opacity-80 truncate">{dept.name.split(' ').slice(1).join(' ')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  2. Engagement Scope:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'standard', title: 'Standard Sprint', desc: 'Core MVP, single-stack, essential QA' },
                    { id: 'growth', title: 'Growth Build (Recommended)', desc: 'Multi-platform, custom architecture & dedicated PM' },
                    { id: 'enterprise', title: 'Enterprise Sovereign', desc: 'High-availability, microservices, 24/7 SLA & NDPR audit' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setCalculatorTier(t.id as any)}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        calculatorTier === t.id
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{t.title}</div>
                      <div className="text-[11px] text-slate-300 mt-1">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Result Display */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Estimated Investment & Delivery
                  </div>
                  <div className="flex items-baseline gap-3 justify-center sm:justify-start">
                    <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">
                      {currency === 'USD' ? `$${estimatedUsd.toLocaleString()}` : `₦${estimatedNgn.toLocaleString()}`}
                    </span>
                    <button
                      onClick={() => setCurrency(currency === 'USD' ? 'NGN' : 'USD')}
                      className="text-xs text-slate-400 hover:text-white underline font-mono"
                    >
                      Switch to {currency === 'USD' ? 'NGN' : 'USD'}
                    </button>
                  </div>
                  <div className="text-xs text-slate-300">
                    Typical Delivery: <strong className="text-white">{estimatedWeeks}</strong> • Includes Dedicated PM & QA Gate
                  </div>
                </div>

                <button
                  onClick={onOpenBriefWizard}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105"
                >
                  <span>Build Formal Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FLAGSHIP CASE STUDIES & VERIFIED ROI */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Outcomes</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Proven Enterprise Results
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Real digital systems delivered for high-growth African scale-ups and global multinational brands.
              </p>
            </div>

            <button
              onClick={() => onSelectScreen('case-study')}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View All Case Studies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCases.map((cs) => (
              <div
                key={cs.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl hover:border-blue-500/60 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={cs.heroImage}
                      alt={cs.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-semibold text-blue-300 border border-blue-500/30">
                      {cs.industry}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-xs text-slate-400 font-semibold">{cs.clientName}</div>
                      <h3 className="text-lg font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">
                        {cs.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {cs.challenge}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                      {cs.measurableOutcomes.slice(0, 3).map((m, i) => (
                        <div key={i} className="text-center p-2 rounded-lg bg-slate-950/60 border border-slate-850">
                          <div className="text-xs font-bold font-mono text-emerald-400">{m.metric}</div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectScreen('case-study')}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Read Full Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONVERSION CTA BANNER */}
      <section className="py-20 bg-gradient-to-b from-[#090D1A] to-[#070A12]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-blue-950/80 border border-blue-500/40 shadow-2xl space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Build Sovereign Digital Systems?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Partner with NDH Agency today. Receive a scoped technical roadmap, transparent multi-currency milestone schedule, and assigned Project Manager within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onOpenBriefWizard}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/40 transition-all hover:scale-105"
              >
                Start Scoping Your Project →
              </button>
              <button
                onClick={() => onSelectScreen('contact')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
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
  Terminal,
  Activity,
  Code2,
  Cpu,
  Smartphone,
  Palette,
  Server,
  Database,
  ArrowUpRight,
  Play,
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
  const [currency, setCurrency] = useState<'USD' | 'NGN' | 'GBP'>('USD');
  const [activeTab, setActiveTab] = useState<'architecture' | 'metrics' | 'qa'>('metrics');
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);

  // Live Simulated Telemetry Data
  const [liveThroughput, setLiveThroughput] = useState<number>(248);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveThroughput(Math.floor(235 + Math.random() * 25));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

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
  const fxMultiplier = currency === 'NGN' ? 1520 : currency === 'GBP' ? 0.78 : 1;
  const currencySymbol = currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : '$';
  const estimatedDisplay = (estimatedUsd * fxMultiplier).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
  const estimatedWeeks = currentPricing.weeks;

  const currentCase = CASE_STUDIES[activeCaseIdx] || CASE_STUDIES[0]!;

  // High-Resolution Curated Images for Departments
  const deptImages: Record<ServiceDepartment, string> = {
    web_app_development: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    mobile_app_development: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
    ui_ux_product_design: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
    brand_strategy_identity: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=80',
    ai_solutions_automation: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    ecommerce_growth: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&auto=format&fit=crop&q=80',
    cloud_devops_sre: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    pan_african_market_research: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&auto=format&fit=crop&q=80',
    cybersecurity_ndpr_audits: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    enterprise_erp_custom_software: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  };

  return (
    <div className="bg-[#070A12] text-slate-100 min-h-screen font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      {/* 1. LIVE OPERATIONS MOVING TICKER (Header Strip) */}
      <div className="bg-[#0B0F1D] border-b border-blue-900/40 py-2.5 overflow-hidden text-xs">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap text-slate-300 font-mono text-[11px]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-white font-bold">LIVE TELEMETRY:</span> SPRINT 42 ACTIVE
          </span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center gap-1.5 text-blue-300">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>KoboPay Core Latency: <strong className="text-emerald-400">{liveThroughput}ms</strong> (Sub-300ms SLA Pass)</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">
            🛡️ NDPR & GDPR Escrow: <strong>100% Cryptographic IP Release</strong>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-400 font-bold">
            ⚡ 42 Top-Tier African Specialists Deployed
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">
            💼 Total Active Scoped Volume: <strong className="text-white">$188,500 USD</strong>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-blue-300">
            📍 Operational Hubs: Victoria Island Lagos • Maitama Abuja • Canary Wharf London
          </span>
        </div>
      </div>

      {/* 2. DYNAMIC HERO SECTION WITH 3D GLASSMORPHIC HUD */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-grid-pattern">
        {/* Radiant Ambient Glow Lights */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-7 text-left">
              {/* Trust Badge with Pulse */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/90 border border-blue-500/40 text-blue-300 text-xs font-semibold shadow-lg shadow-blue-950/50">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="uppercase tracking-wider font-mono text-[11px]">
                  Managed Digital Services Bureau
                </span>
                <span className="text-blue-400">|</span>
                <span className="text-slate-300">Zero Freelance Chaos</span>
              </div>

              {/* Bold Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                We Engineer{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                  Sovereign Digital Systems
                </span>{' '}
                for High-Growth Scale-Ups.
              </h1>

              {/* High-Contrast Description */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                NDH Agency pairs visionary founders and enterprise leaders with top 3% African engineers, designers, and AI specialists. Managed end-to-end by dedicated Project Managers with strict SLAs, multi-gate QA, and guaranteed IP escrow.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={onOpenBriefWizard}
                  className="px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Request a Scoped Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectScreen('services')}
                  className="px-6 py-4 rounded-xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>Explore 10 Departments</span>
                </button>
              </div>

              {/* Key Highlights Metric Bar */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black font-mono text-blue-400">$188.5K+</div>
                  <div className="text-[11px] text-slate-300 font-semibold mt-0.5">Active Scoped Volume</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">99.4%</div>
                  <div className="text-[11px] text-slate-300 font-semibold mt-0.5">SLA On-Time Delivery</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400">&lt;300ms</div>
                  <div className="text-[11px] text-slate-300 font-semibold mt-0.5">FinTech Processing</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Animated HUD Showcase */}
            <div className="lg:col-span-5 relative">
              {/* Floating Live Telemetry Badge 1 */}
              <div className="absolute -top-6 -left-6 z-20 p-3.5 rounded-2xl bg-slate-900/95 border border-blue-500/50 shadow-2xl backdrop-blur-xl animate-float">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Dual QA Gate Approved</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Score: 4.98 / 5.00 • WCAG AA</div>
                  </div>
                </div>
              </div>

              {/* Floating Live Telemetry Badge 2 */}
              <div className="absolute -bottom-6 -right-6 z-20 p-3.5 rounded-2xl bg-slate-900/95 border border-indigo-500/50 shadow-2xl backdrop-blur-xl animate-float-slow">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Milestone Escrow Released</div>
                    <div className="text-[10px] text-indigo-300 font-mono">$45,000 USD via Paystack</div>
                  </div>
                </div>
              </div>

              {/* Center Interactive Glassmorphic Terminal Card */}
              <div className="rounded-3xl bg-slate-900/90 border border-slate-700/80 p-6 shadow-2xl backdrop-blur-2xl space-y-5 relative overflow-hidden group">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">ndh-sentinel-core.ts</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-[10px]">
                    LIVE CLUSTER
                  </span>
                </div>

                {/* Simulated Code & Throughput HUD */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 leading-relaxed">
                    <div className="text-blue-400">// NDH Sovereign Microservice Rail</div>
                    <div><span className="text-purple-400">const</span> sprint = <span className="text-yellow-300">await</span> ndh.deploySquad({'{'}</div>
                    <div className="pl-4">client: <span className="text-emerald-300">"KoboPay Global Inc"</span>,</div>
                    <div className="pl-4">leadPM: <span className="text-emerald-300">"Tariq Al-Najeeb"</span>,</div>
                    <div className="pl-4">targetSLA: <span className="text-yellow-300">"&lt;300ms Core Settlement"</span>,</div>
                    <div className="pl-4">ipEscrow: <span className="text-cyan-300">true</span>,</div>
                    <div>{'}'});</div>
                  </div>

                  {/* Visual Node Telemetry */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Node Sync (Lagos-London Edge):</span>
                      <span className="text-emerald-400 font-bold">99.98% Healthy</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-[94%]" />
                    </div>
                  </div>
                </div>

                {/* Case Snapshot with Real Image */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80">
                  <img
                    src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80"
                    alt="Fintech Core"
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
                    <div className="text-xs font-bold text-white">KoboPay Global Case Study</div>
                    <div className="text-[11px] text-emerald-400 font-mono">2.4M Transactions Processed Daily</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INFINITE CLIENT & PARTNERSHIP LOGO MARQUEE */}
      <section className="py-8 bg-[#090D1A] border-y border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Trusted by Visionary Enterprises, Scale-Ups & Sovereign Institutions
          </span>
        </div>
        <div className="animate-marquee flex items-center gap-16 whitespace-nowrap text-slate-400 font-bold text-sm">
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" /> KoboPay Global
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> AfriHealth Systems
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> Sovereign Land Escrow
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Paystack Merchant Infrastructure
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-cyan-400" /> Flutterwave Treasury Rails
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Cpu className="w-4 h-4 text-pink-400" /> Moniepoint POS Core
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" /> Cloudflare West Africa Edge
          </span>
        </div>
      </section>

      {/* 4. TEN CORE SERVICE DEPARTMENTS (With Rich Photography & Interactive Scoping) */}
      <section className="py-24 border-b border-slate-800 bg-[#070A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>10 Specialized Departments</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Full-Spectrum Digital Capabilities.
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Every department is led by a vetted Principal Architect, strict QA milestones, and clear contractual deliverables.
              </p>
            </div>

            <button
              onClick={() => onSelectScreen('services')}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Explore All 10 Departments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Department Cards Grid with High-Res Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICE_DEPARTMENTS.slice(0, 6).map((dept) => (
              <div
                key={dept.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/70 overflow-hidden shadow-2xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* High-Resolution Image Header */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={deptImages[dept.id] || deptImages.web_app_development}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-blue-300 border border-blue-500/30">
                      {dept.averageTurnaroundDays}d SLA Turnaround
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                        {dept.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {dept.description}
                    </p>

                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Key Capabilities:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {dept.capabilities.slice(0, 3).map((cap, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-200 text-[11px] border border-slate-800 font-medium"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Price & Scoping Button */}
                <div className="p-6 pt-0 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Starting from</div>
                    <div className="text-sm font-mono font-bold text-emerald-400">
                      ${dept.startingBudgetUSD.toLocaleString()} USD
                    </div>
                  </div>
                  <button
                    onClick={onOpenBriefWizard}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Scope Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE SCOPE & TIMELINE ESTIMATOR */}
      <section className="py-24 border-b border-slate-800 bg-[#090D1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Interactive Cost & Delivery Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Scope Your Custom Milestone Roadmap
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">
                Select your department, velocity tier, and currency to immediately view your estimated sprint schedule and transparent multi-currency budget.
              </p>
            </div>

            {/* Step 1: Department Chips */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. Select Department:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {SERVICE_DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setCalculatorDept(dept.id)}
                    className={`p-3 rounded-xl text-xs text-left border transition-all ${
                      calculatorDept === dept.id
                        ? 'bg-blue-600 text-white border-blue-400 shadow-lg font-bold'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    <div className="truncate font-semibold">{dept.name.split(' ')[0]}</div>
                    <div className="text-[10px] opacity-80 truncate">{dept.name.split(' ').slice(1).join(' ')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Tier Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Sprint Scope & Architecture:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'standard', title: 'Standard Sprint', desc: 'Core MVP, single-stack & PM QA' },
                  { id: 'growth', title: 'Growth Build (Most Popular)', desc: 'Full-stack, custom architecture & dedicated PM' },
                  { id: 'enterprise', title: 'Enterprise Sovereign', desc: 'High-availability, 24/7 SLA & NDPR audit' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setCalculatorTier(t.id as any)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      calculatorTier === t.id
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{t.title}</div>
                    <div className="text-[11px] text-slate-300 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Investment ({currency}):
                  </span>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
                    {(['USD', 'NGN', 'GBP'] as const).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`px-2 py-0.5 rounded ${
                          currency === curr ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">
                  {currencySymbol}{estimatedDisplay}
                </div>
                <div className="text-xs text-slate-300">
                  Estimated Delivery: <strong className="text-white font-mono">{estimatedWeeks}</strong> • Includes Dedicated Lead PM & Escrow
                </div>
              </div>

              <button
                onClick={onOpenBriefWizard}
                className="w-full md:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105"
              >
                <span>Lock In Scope & Generate Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE CASE STUDY SPOTLIGHT WITH REAL DASHBOARD VISUALS */}
      <section className="py-24 border-b border-slate-800 bg-[#070A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Enterprise Case Dossiers</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Verified Enterprise Results.
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Inspect live performance breakthroughs engineered by NDH squads across Pan-Africa and global markets.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {CASE_STUDIES.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCaseIdx(i)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCaseIdx === i
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {c.clientName}
                </button>
              ))}
            </div>
          </div>

          {/* Active Case Study Spotlight Card */}
          <div className="rounded-3xl bg-slate-900 border border-slate-700/80 p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800 text-xs font-bold">
                  {currentCase.industry}
                </span>
                <span className="text-xs text-slate-400 font-mono">Completed {currentCase.year}</span>
                <span className="text-xs text-emerald-400 font-mono">• {currentCase.projectDuration}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {currentCase.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {currentCase.challenge}
              </p>

              {/* Verified Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {currentCase.measurableOutcomes.map((m, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left">
                    <div className="text-xl font-bold font-mono text-emerald-400">{m.metric}</div>
                    <div className="text-[11px] text-slate-300 font-semibold mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Client Quote */}
              {currentCase.testimonial && (
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-slate-200 italic space-y-1">
                  <div>"{currentCase.testimonial.quote}"</div>
                  <div className="font-bold text-white not-italic pt-1">
                    — {currentCase.testimonial.author}, {currentCase.testimonial.title}
                  </div>
                </div>
              )}
            </div>

            {/* Right Case Study High-Res Showcase */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
                <img
                  src={currentCase.heroImage}
                  alt={currentCase.title}
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-6 flex flex-col justify-end">
                  <div className="text-xs font-mono text-blue-400">Lead PM: {currentCase.leadPM}</div>
                  <div className="text-sm font-bold text-white">Dedicated Team Size: {currentCase.teamSize} Specialists</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentCase.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HIGH-CONVERSION CTA BANNER */}
      <section className="py-24 bg-gradient-to-b from-[#070A14] to-[#04070D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-blue-950/80 border border-blue-500/40 shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Ready for Sovereign Speed?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Build Your Next Enterprise System with NDH Agency.
            </h2>
            <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Receive a structured technical brief, dedicated Lead Project Manager, and multi-currency milestone contract within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onOpenBriefWizard}
                className="w-full sm:w-auto px-9 py-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/40 transition-all hover:scale-105"
              >
                Start Scoping Your Project →
              </button>
              <button
                onClick={() => onSelectScreen('contact')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                Book Discovery Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

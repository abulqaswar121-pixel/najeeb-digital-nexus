import React, { useState, useEffect } from 'react';
import { ServiceDepartment, ServiceDepartmentInfo } from '../../../types/ndh';
import { SERVICE_DEPARTMENTS, CASE_STUDIES } from '../../../data/mockData';
import { useCurrencyLanguage } from '../../../lib/currencyLanguageStore';
import { HeroShowcaseSlider } from '../../home/HeroShowcaseSlider';
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
  Star,
  UserCheck,
  MessageSquare,
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
  const { currency, setCurrency, currencies, formatPrice, t } = useCurrencyLanguage();

  const [calculatorDept, setCalculatorDept] = useState<ServiceDepartment>('web_app_development');
  const [calculatorTier, setCalculatorTier] = useState<'standard' | 'growth' | 'enterprise'>('growth');
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [livePulse, setLivePulse] = useState<number>(240);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePulse(Math.floor(230 + Math.random() * 20));
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
  const estimatedPriceFormatted = formatPrice(estimatedUsd);
  const estimatedWeeks = currentPricing.weeks;

  const currentCase = CASE_STUDIES[activeCaseIdx] || CASE_STUDIES[0]!;

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
    <div className="bg-[#070A14] text-slate-100 min-h-screen font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      {/* 1. LIVE OPERATIONS STREAM TICKER (Moving from header across the screen) */}
      <div className="bg-[#0B0F1D] border-b border-blue-900/40 py-2.5 overflow-hidden text-xs">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap text-slate-300 font-mono text-[11px]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-white font-bold">🟢 LIVE STATUS:</span> SPRINT 42 IN PROGRESS
          </span>
          <span className="text-slate-400">•</span>
          <span className="flex items-center gap-1.5 text-blue-300">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>KoboPay Core Latency: <strong className="text-emerald-400">{livePulse}ms</strong> (Guaranteed Sub-300ms SLA)</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">
            🛡️ Contract Escrow: <strong>100% Code Ownership Transferred Upon Sign-Off</strong>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-400 font-bold">
            ⚡ 42 Senior Specialists Across Nigeria, UK & US
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">
            💼 Total Active Pipeline: <strong className="text-white">{formatPrice(188500)}</strong>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-blue-300">
            📍 Physical Hubs: Victoria Island Lagos • Maitama Abuja • Canary Wharf London
          </span>
        </div>
      </div>

      {/* 2. MAIN HERO SECTION WITH HERO SLIDER SHOWCASE */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 bg-grid-pattern">
        {/* Radiant Ambient Light Blooms */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Top Hero Pitch */}
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/90 border border-blue-500/40 text-blue-300 text-xs font-bold shadow-lg shadow-blue-950/50">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('hero_badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              {t('hero_title_1')}{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                {t('hero_title_2')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
              {t('hero_desc')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onOpenBriefWizard}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>{t('hero_cta_primary')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectScreen('case-study')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{t('hero_cta_secondary')}</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC AUTO-CHANGING HERO SHOWCASE SLIDER */}
          <div className="pt-2">
            <HeroShowcaseSlider
              onOpenBriefWizard={onOpenBriefWizard}
              onSelectScreen={onSelectScreen}
            />
          </div>

          {/* 4 Metric Counter Cards (Synced with Currency) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black font-mono text-blue-400">
                {t('hero_stat_1_val')}
              </div>
              <div className="text-xs font-bold text-white mt-1">{t('hero_stat_1_lbl')}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Across 100+ projects</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {t('hero_stat_2_val')}
              </div>
              <div className="text-xs font-bold text-white mt-1">{t('hero_stat_2_lbl')}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Strict contractual deadlines</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-400">
                {t('hero_stat_3_val')}
              </div>
              <div className="text-xs font-bold text-white mt-1">{t('hero_stat_3_lbl')}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Web, mobile & cloud systems</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <span className="text-2xl sm:text-3xl font-black font-mono">{t('hero_stat_4_val')}</span>
              </div>
              <div className="text-xs font-bold text-white mt-1">{t('hero_stat_4_lbl')}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">From 120+ executive reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INFINITE CLIENT & PARTNERSHIP LOGO MARQUEE */}
      <section className="py-8 bg-[#090D1A] border-y border-slate-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Powering Systems for Visionary African & Global Companies
          </span>
        </div>
        <div className="animate-marquee flex items-center gap-16 whitespace-nowrap text-slate-300 font-bold text-sm">
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" /> KoboPay Global
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> AfriHealth Systems
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> Sovereign Asset Escrow
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Paystack Merchant Rails
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-cyan-400" /> Flutterwave Treasury Integration
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" /> Moniepoint POS Infrastructure
          </span>
          <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" /> Cloudflare West Africa Edge
          </span>
        </div>
      </section>

      {/* 4. WHAT WE BUILD: 10 SPECIALIZED DEPARTMENTS WITH CURATED PHOTOGRAPHY */}
      <section className="py-24 border-b border-slate-800 bg-[#070A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>What We Build</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                10 Core Service Departments.
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                From sub-300ms fintech engines to high-converting brand design, each department is managed by a dedicated Project Manager.
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

          {/* Department Cards Grid with High-Res Visuals & Live Currency */}
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
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-blue-300 border border-blue-500/30">
                      {dept.averageTurnaroundDays}d SLA Delivery
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

                {/* Footer with Price Synced with Currency */}
                <div className="p-6 pt-0 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Starting from</div>
                    <div className="text-sm font-mono font-bold text-emerald-400">
                      {formatPrice(dept.startingBudgetUSD)}
                    </div>
                  </div>
                  <button
                    onClick={onOpenBriefWizard}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Scope Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE PROJECT PRICE & TIMELINE ESTIMATOR */}
      <section className="py-24 border-b border-slate-800 bg-[#090D1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>{t('estimator_title')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Calculate Exact Pricing & Delivery Time
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">
                {t('estimator_desc')}
              </p>
            </div>

            {/* Step 1: Department Chips */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. What are you building?
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
                2. Project Scope & Speed:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'standard', title: 'Starter MVP', desc: 'Core essential features & dedicated PM' },
                  { id: 'growth', title: 'Growth Build (Most Popular)', desc: 'Full custom design, backend & complete QA' },
                  { id: 'enterprise', title: 'Enterprise Dedicated', desc: 'High concurrency, 24/7 SLA & security audit' },
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

            {/* Live Calculation Output Card (Synced with Currency) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Total Estimated Investment ({currency}):
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">
                  {estimatedPriceFormatted}
                </div>
                <div className="text-xs text-slate-300">
                  Guaranteed Delivery: <strong className="text-white font-mono">{estimatedWeeks}</strong> • Includes Dedicated Lead PM & Escrow Protection
                </div>
              </div>

              <button
                onClick={onOpenBriefWizard}
                className="w-full md:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105"
              >
                <span>Generate Official Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CLIENT SUCCESS STORIES */}
      <section className="py-24 border-b border-slate-800 bg-[#070A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Real Results</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Built for Scalability & Speed.
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Explore real case studies from companies that scaled their products with NDH squads.
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
              <span>Ready to Build?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Start Your Next Project with NDH Agency Today.
            </h2>
            <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Receive a detailed technical roadmap, clear milestone pricing in your local currency, and a dedicated Lead Project Manager within 24 hours.
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
                Book Discovery Call
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

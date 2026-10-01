import React, { useState, useEffect } from "react";
import { ServiceDepartment, ServiceDepartmentInfo } from "../../../types/ndh";
import { SERVICE_DEPARTMENTS, CASE_STUDIES } from "../../../data/mockData";
import { useCurrencyLanguage } from "../../../lib/currencyLanguageStore";
import { HeroShowcaseSlider } from "../../home/HeroShowcaseSlider";
import { ServiceDetailModal } from "../modals/ServiceDetailModal";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Lock,
  Layers,
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
  Globe,
} from "lucide-react";

interface HomepagePreviewProps {
  direction?: string;
  onOpenBriefWizard: () => void;
  onSelectScreen: (screen: string) => void;
}

export const HomepagePreview: React.FC<HomepagePreviewProps> = ({
  onOpenBriefWizard,
  onSelectScreen,
}) => {
  const { currency, setCurrency, currencies, getRegionalPricing, detectedCountry, t } =
    useCurrencyLanguage();

  const [calculatorDept, setCalculatorDept] = useState<ServiceDepartment>("web_app_development");
  const [calculatorTier, setCalculatorTier] = useState<"starter" | "growth" | "enterprise">(
    "growth",
  );
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [livePulse, setLivePulse] = useState<number>(240);
  const [selectedModalDept, setSelectedModalDept] = useState<ServiceDepartmentInfo | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePulse(Math.floor(230 + Math.random() * 20));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const regionalResult = getRegionalPricing(calculatorDept, calculatorTier);
  const currentCase = CASE_STUDIES[activeCaseIdx] || CASE_STUDIES[0]!;

  return (
    <div className="bg-[#070A14] text-slate-100 min-h-screen font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      {/* 1. LIVE OPERATIONS STREAM TICKER */}
      <div className="bg-[#0B0F1D] border-b border-blue-900/40 py-2.5 overflow-hidden text-xs">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap text-slate-300 font-mono text-[11px]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-bold">LIVE TELEMETRY:</span>
            <span>16 Service Departments Operational • 100+ Vetted Engineers &amp; Designers</span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1.5 text-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Dedicated PM Layer Active (100% Client-Talent Isolation &amp; Margin Protection)
            </span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1.5 text-indigo-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Average API Edge Latency: {livePulse}ms</span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Localized in {detectedCountry} ({currency}) • Sub-15min PM Response SLA
            </span>
          </span>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#0B0F1E] via-[#070A14] to-[#070A14]">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          {/* Hero Header */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold shadow-lg backdrop-blur-md">
              <span>{t("hero_badge")}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              {t("hero_title_1")}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                {t("hero_title_2")}
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              {t("hero_desc")}
            </p>

            {/* Quick Country/Currency Affirmation Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Viewing in <strong className="text-white">{detectedCountry}</strong> • Starter
                packages tailored for students, solopreneurs &amp; enterprises
              </span>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onOpenBriefWizard}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-2xl shadow-blue-600/40 border border-blue-400/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{t("hero_cta_primary")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectScreen("services")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>{t("hero_cta_secondary")}</span>
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

          {/* 4 Metric Counter Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black font-mono text-blue-400">
                {t("hero_stat_1_val")}
              </div>
              <div className="text-xs font-bold text-white mt-1">{t("hero_stat_1_lbl")}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Across 100+ projects</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {t("hero_stat_2_val")}
              </div>
              <div className="text-xs font-bold text-white mt-1">{t("hero_stat_2_lbl")}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Strict contractual deadlines</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-400">
                {t("hero_stat_3_val")}
              </div>
              <div className="text-xs font-bold text-white mt-1">{t("hero_stat_3_lbl")}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Web, mobile &amp; cloud systems
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                <span className="text-2xl sm:text-3xl font-black font-mono">
                  {t("hero_stat_4_val")}
                </span>
              </div>
              <div className="text-xs font-bold text-white mt-1">{t("hero_stat_4_lbl")}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">From 120+ executive reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INFINITE CLIENT & PARTNERSHIP LOGO MARQUEE */}
      <section className="py-8 bg-[#090D1A] border-y border-slate-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Powering Digital Growth for African &amp; International Enterprises
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

      {/* 4. WHAT WE BUILD: 16 SPECIALIZED DEPARTMENTS WITH DISTINCT PHOTOGRAPHY */}
      <section className="py-24 border-b border-slate-800 bg-[#070A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>What We Build</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                16 Core Service Departments.
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                From landing pages and rapid MVPs to enterprise mobile apps and AI agents. Assigned
                PM oversight with zero risk.
              </p>
            </div>

            <button
              onClick={() => onSelectScreen("services")}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Explore All 16 Departments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Department Cards Grid (6 Top Featured on Homepage) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICE_DEPARTMENTS.slice(0, 6).map((dept) => {
              const starterInfo = getRegionalPricing(dept.id, "starter");
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedModalDept(dept)}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/70 overflow-hidden shadow-2xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 cursor-pointer"
                >
                  <div>
                    {/* High-Resolution Image Header */}
                    <div className="relative h-48 overflow-hidden bg-slate-950">
                      <img
                        src={dept.coverImage}
                        alt={dept.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                      <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-blue-300 border border-blue-500/30">
                        {dept.averageTurnaroundDays}d SLA Delivery
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                        Active: {dept.activeTalentsCount} Talents
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight drop-shadow-md">
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

                  {/* Accessible Local Pricing Footer */}
                  <div className="p-6 pt-3 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/30">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Starter Plan ({currency}):
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        From {starterInfo.price}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModalDept(dept);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 hover:scale-105"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onSelectScreen("services")}
              className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <span>View All 16 Service Departments (No-Code, AI, Mobile, Video, DevOps...)</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. INSTANT PROJECT PRICE & TIME ESTIMATOR */}
      <section id="estimator" className="py-24 border-b border-slate-800 bg-[#090D1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>{t("estimator_title")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Instant Project Price &amp; Time Estimator
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto">{t("estimator_desc")}</p>
              <div className="inline-flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>
                  Country Target: <strong className="text-emerald-400">{detectedCountry}</strong>
                </span>
                <span>
                  • Currency:{" "}
                  <strong className="text-blue-400">
                    {currencies[currency]?.name} ({currency})
                  </strong>
                </span>
              </div>
            </div>

            {/* Step 1: Department Chips */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. Select Service Discipline:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SERVICE_DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setCalculatorDept(dept.id)}
                    className={`p-3 rounded-xl text-left border transition-all truncate text-xs font-medium ${
                      calculatorDept === dept.id
                        ? "bg-blue-600 text-white border-blue-400 shadow-lg"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {dept.name.split("&")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Scope & Speed Tiers */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Project Tier &amp; Requirements:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "starter",
                    title: "Starter MVP / Student",
                    desc: "Landing page, rapid launch & essential features",
                  },
                  {
                    id: "growth",
                    title: "Growth Build (Most Popular)",
                    desc: "Full custom design, backend & complete QA",
                  },
                  {
                    id: "enterprise",
                    title: "Enterprise Dedicated",
                    desc: "High concurrency, 24/7 SLA & security audit",
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      setCalculatorTier(t.id as Parameters<typeof setCalculatorTier>[0])
                    }
                    className={`p-4 rounded-xl text-left border transition-all ${
                      calculatorTier === t.id
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-lg"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"
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
                    Instant Estimated Budget ({currencies[currency]?.name}):
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                  {regionalResult.price}
                </div>
                <div className="text-xs text-slate-300">
                  Estimated Delivery:{" "}
                  <strong className="text-white font-mono">{regionalResult.weeks}</strong> •
                  Includes Dedicated Lead PM &amp; IP Escrow
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
                Built for Scalability &amp; Speed.
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Explore real case studies from companies that scaled their products with NDH squads.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {CASE_STUDIES.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCaseIdx(i)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCaseIdx === i
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600"
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
                <span className="text-xs text-slate-400 font-mono">
                  Completed {currentCase.year}
                </span>
                <span className="text-xs text-emerald-400 font-mono">
                  • {currentCase.projectDuration}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {currentCase.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentCase.summary ?? currentCase.solution}
              </p>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {(currentCase.measurableOutcomes || []).slice(0, 4).map((metric, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-lg font-black font-mono text-emerald-400">
                      {metric.metric}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={onOpenBriefWizard}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
                >
                  Build Similar Solution
                </button>
                <button
                  onClick={() => onSelectScreen("case-study")}
                  className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <span>Read Full Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl relative h-72 sm:h-96 bg-slate-950">
                <img
                  src={currentCase.heroImage}
                  alt={currentCase.clientName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                  <span>Delivered by NDH Squad</span>
                  <span className="font-mono text-emerald-400 font-bold">QA Score: 4.95 / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Service Deep-Dive */}
      <ServiceDetailModal
        dept={selectedModalDept}
        isOpen={!!selectedModalDept}
        onClose={() => setSelectedModalDept(null)}
        onOpenBriefWizard={onOpenBriefWizard}
      />
    </div>
  );
};

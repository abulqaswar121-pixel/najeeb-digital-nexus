import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  Zap,
  TrendingUp,
  Cpu,
  Smartphone,
  Lock,
} from "lucide-react";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";

interface HeroSlide {
  id: string;
  category: string;
  badgeColor: string;
  title: string;
  highlightText: string;
  subtitle: string;
  statValue: string;
  statLabel: string;
  statSubtext: string;
  image: string;
  tags: string[];
  client: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "fintech-core",
    category: "FinTech & Core Banking",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/40",
    title: "High-Speed Payment Platforms Built for",
    highlightText: "Millions of Daily Users.",
    subtitle:
      "We engineer bank-grade web and mobile applications with sub-300ms transaction speeds and multi-currency billing.",
    statValue: "< 240ms",
    statLabel: "Transaction Speed",
    statSubtext: "2.4M active accounts processed across Africa & UK",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80",
    tags: ["React 19", "Go Microservices", "Paystack", "Cloudflare Edge"],
    client: "KoboPay Global Inc.",
  },
  {
    id: "mobile-apps",
    category: "Cross-Platform Mobile Apps",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    title: "Intuitive iOS & Android Apps with",
    highlightText: "Offline-First Speed.",
    subtitle:
      "Sleek, fluid mobile applications that work even in low-bandwidth areas with instant local sync.",
    statValue: "99.98%",
    statLabel: "Uptime & Reliability",
    statSubtext: "4.9★ App Store rating with 150k+ clinical consultations",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80",
    tags: ["Flutter", "iOS Swift", "Android Kotlin", "Supabase"],
    client: "AfriHealth Telemedicine",
  },
  {
    id: "luxury-commerce",
    category: "E-Commerce & Brand Systems",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    title: "High-Conversion Digital Stores for",
    highlightText: "Global Luxury Brands.",
    subtitle:
      "Bespoke design systems, interactive 3D product previews, and frictionless checkout that boost sales by 185%.",
    statValue: "+185%",
    statLabel: "Conversion Increase",
    statSubtext: "Over $42M in fractional luxury real estate assets sold",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    tags: ["Next.js Commerce", "Tailwind", "Stripe", "3D WebGL"],
    client: "Sovereign Asset Escrow",
  },
  {
    id: "ai-automation",
    category: "AI & Workflow Automation",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    title: "Autonomous AI Agents that",
    highlightText: "10x Your Team Velocity.",
    subtitle:
      "Custom generative AI agents, intelligent customer service bots, and automated data pipelines deployed in 14 days.",
    statValue: "10x Faster",
    statLabel: "Operations Output",
    statSubtext: "Saved 350+ manual hours per month per client squad",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80",
    tags: ["Python", "OpenAI Agents", "n8n Workflows", "Vector DB"],
    client: "AgriTech Intelligence Hub",
  },
];

interface HeroShowcaseSliderProps {
  onOpenBriefWizard: () => void;
  onSelectScreen: (screen: string) => void;
}

export const HeroShowcaseSlider: React.FC<HeroShowcaseSliderProps> = ({
  onOpenBriefWizard,
  onSelectScreen,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const { t } = useCurrencyLanguage();

  const currentSlide = HERO_SLIDES[currentSlideIndex]!;

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-2xl transition-all duration-700">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Main Slide Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
        {/* Left Narrative Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Slide Category Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider font-mono ${currentSlide.badgeColor}`}
            >
              {currentSlide.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Case Study: <strong className="text-white">{currentSlide.client}</strong>
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            {currentSlide.title}{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              {currentSlide.highlightText}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
            {currentSlide.subtitle}
          </p>

          {/* Technology Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Tech Stack:
            </span>
            {currentSlide.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-slate-950/90 text-slate-200 border border-slate-700/80 text-xs font-mono font-medium shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Metric Highlight Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {currentSlide.statValue}
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                {currentSlide.statLabel}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{currentSlide.statSubtext}</div>
            </div>

            <button
              onClick={onOpenBriefWizard}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 shrink-0 flex items-center gap-2"
            >
              <span>Scope This Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Visual Image Column with Dynamic Frame */}
        <div className="lg:col-span-5 relative group">
          {/* Glass Card Image Frame */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-950">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-72 sm:h-80 lg:h-96 object-cover transition-all duration-700 group-hover:scale-105 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Floating Live Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-bold">{currentSlide.client}</span>
              </div>
              <span className="text-[11px] text-blue-300 font-mono">Verified Production</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Dots & Arrows Controls Bar */}
      <div className="px-6 sm:px-10 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
        {/* Thumbnails / Category Switchers */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setIsAutoPlay(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                currentSlideIndex === idx
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              0{idx + 1}. {slide.category.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Left / Right Arrow Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
              setIsAutoPlay(false);
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
              setIsAutoPlay(false);
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import apexAgriCapitalImg from "../../assets/case-studies/apex-agri-capital.jpg";
import miftahAlArabiyyahImg from "../../assets/case-studies/miftah-al-arabiyyah.jpg";
import markazussalafImg from "../../assets/case-studies/markazussalaf.jpg";
import najeebAcademyImg from "../../assets/case-studies/najeeb-academy.jpg";

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

// Real, verifiable NDH case studies only (same 6 shown in full on /case-studies).
// No fabricated metrics — statValue/statLabel/statSubtext below describe what was
// actually built, not invented performance numbers.
const HERO_SLIDES: HeroSlide[] = [
  {
    id: "apex-agri-capital",
    category: "Web App Development",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/40",
    title: "A Transparent Shared Ledger Built for a Growing",
    highlightText: "Agriculture Investment Cooperative.",
    subtitle:
      "A role-based web application tracking contributions, expenses, and member equity across catfish, poultry, and goat farming operations.",
    statValue: "3 Roles",
    statLabel: "Admin · Operator · Contributor",
    statSubtext: "Built to scale from a founding group toward 100 members",
    image: apexAgriCapitalImg,
    tags: ["Web Application", "Role-Based Access"],
    client: "Apex Agri-Capital",
  },
  {
    id: "miftah-al-arabiyyah",
    category: "Content & Curriculum Development",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    title: "An 8-Book Arabic Curriculum Series, Written and",
    highlightText: "Directed From Concept to Production.",
    subtitle:
      "Full curriculum authorship for Nigerian non-native Arabic speakers, spanning Nursery 1-3, Basic 1-5, and JSS 1-3, with formal teacher review across every level.",
    statValue: "8 Levels",
    statLabel: "Full Series Delivered",
    statSubtext: "Matched audio resources produced for every unit",
    image: miftahAlArabiyyahImg,
    tags: ["Curriculum Design", "Editorial Review", "Audio Production"],
    client: "Miftah al-Arabiyyah Project",
  },
  {
    id: "markazussalaf",
    category: "Business Support / Document Systems",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    title: "Automated Academic Reporting for a",
    highlightText: "Qur'an Memorization Program.",
    subtitle:
      "A 4-year master syllabus, term-by-term teacher target sheets, and learner progress cards that replaced ad hoc, inconsistent tracking.",
    statValue: "8 Registers",
    statLabel: "Automated Reporting",
    statSubtext: "Reports that took days of manual collation, automated",
    image: markazussalafImg,
    tags: ["Document Systems", "Academic Reporting"],
    client: "Markazussalaf Institute",
  },
  {
    id: "najeeb-academy",
    category: "EdTech / Online Learning",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    title: "60+ Project-Based AI Courses, Each Ending in",
    highlightText: "a Verifiable Certificate.",
    subtitle:
      "A self-paced AI skills academy across 6 tracks, every course following Learn → Assess → Build → Certify with a graded assessment and a real capstone project.",
    statValue: "60+",
    statLabel: "Courses Across 6 Tracks",
    statSubtext: "Every course ends in a graded, portfolio-ready build",
    image: najeebAcademyImg,
    tags: ["Course Platform", "Certificate Verification"],
    client: "Najeeb Academy",
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
              <span className="text-[11px] text-blue-300 font-mono">Verified Project</span>
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

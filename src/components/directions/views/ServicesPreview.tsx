import React, { useState } from "react";
import { ServiceDepartment, ServiceDepartmentInfo, ServiceCategory } from "../../../types/ndh";
import { SERVICE_DEPARTMENTS } from "../../../data/mockData";
import { useCurrencyLanguage } from "../../../lib/currencyLanguageStore";
import { ServiceDetailModal } from "../modals/ServiceDetailModal";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Search,
  Sparkles,
  ShieldCheck,
  Check,
  Globe,
  Zap,
  Filter,
} from "lucide-react";

interface ServicesPreviewProps {
  direction?: string;
  onOpenBriefWizard: () => void;
}

export const ServicesPreview: React.FC<ServicesPreviewProps> = ({ onOpenBriefWizard }) => {
  const { currency, getRegionalPricing } = useCurrencyLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("all");
  const [activeModalDept, setActiveModalDept] = useState<ServiceDepartmentInfo | null>(null);

  const categoryTabs: { id: ServiceCategory; label: string }[] = [
    { id: "all", label: "All 16 Services" },
    { id: "engineering", label: "💻 Web, Mobile & Cloud" },
    { id: "design", label: "🎨 UI/UX & Brand Design" },
    { id: "ai", label: "🤖 AI & Automation" },
    { id: "marketing", label: "📈 Marketing, SEO & Copy" },
    { id: "media", label: "🎬 Video & 3D Media" },
    { id: "data", label: "📊 Data & Market Research" },
    { id: "mvp", label: "⚡ Rapid No-Code MVP" },
  ];

  const filteredDepts = SERVICE_DEPARTMENTS.filter((dept) => {
    const matchesCat = selectedCategory === "all" || dept.category === selectedCategory;
    const matchesSearch =
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      dept.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070A14] text-slate-100 py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Complete Global Service Catalog • 16 Specialized Departments</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Comprehensive Digital Capabilities. Zero Freelance Chaos.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            From budget-friendly starter MVPs and fast websites to enterprise FinTech
            infrastructure. Every project is assigned a dedicated Project Manager with guaranteed
            milestones and IP escrow.
          </p>

          {/* Currency is auto-detected from your browser locale; override anytime via the
              currency switcher in the nav — no need to call out the detected country here. */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>
              Prices shown in <strong className="text-white">{currency}</strong> • detected
              automatically, changeable anytime
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by tech (React, Flutter, Shopify, SEO, AI, NDPR)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
              />
            </div>

            <button
              onClick={onOpenBriefWizard}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Build Custom Project Scope</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800/80">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 16 Departments Grid with Domain Covers & Accessible Pricing */}
        {filteredDepts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <p className="text-slate-300 text-sm">No services matched "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepts.map((dept) => {
              const starterPricing = getRegionalPricing(dept.id, "starter");
              return (
                <div
                  key={dept.id}
                  onClick={() => setActiveModalDept(dept)}
                  className="rounded-3xl cursor-pointer transition-all overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-blue-500/70 shadow-xl hover:-translate-y-1 flex flex-col justify-between group hover:shadow-2xl"
                >
                  <div>
                    {/* Visual Cover Photo */}
                    <div className="relative h-44 overflow-hidden bg-slate-950">
                      <img
                        src={dept.coverImage}
                        alt={dept.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-blue-300 border border-blue-500/30">
                        {dept.averageTurnaroundDays}d Delivery
                      </div>

                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                        {dept.activeTalentsCount} Vetted Talents
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight drop-shadow-md">
                          {dept.name}
                        </h3>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {dept.description}
                      </p>

                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Key Capabilities:
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {dept.capabilities.slice(0, 3).map((cap, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span className="truncate">{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Accessible Local Pricing Footer */}
                  <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/40">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Starter Plan ({currency}):
                      </div>
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        From {starterPricing.price}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalDept(dept);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-1 hover:scale-105"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Service Deep-Dive */}
        <ServiceDetailModal
          dept={activeModalDept}
          isOpen={!!activeModalDept}
          onClose={() => setActiveModalDept(null)}
          onOpenBriefWizard={onOpenBriefWizard}
        />
      </div>
    </div>
  );
};

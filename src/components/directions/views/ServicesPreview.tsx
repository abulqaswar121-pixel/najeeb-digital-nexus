import React, { useState } from "react";
import { ServiceDepartment, ServiceDepartmentInfo, ServiceCategory } from "../../../types/ndh";
import { SERVICE_DEPARTMENTS } from "../../../data/mockData";
import { departmentProfile } from "../../../data/agencyDepartments";
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

/** Renders the department's sector icon inside the tinted pill. */
const CardIcon: React.FC<{ deptId: ServiceDepartment }> = ({ deptId }) => {
  const Icon = departmentProfile(deptId).icon;
  return <Icon aria-hidden="true" />;
};

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
    <div className="min-h-screen font-sans">
      {/* Page hero — deep navy band */}
      <section className="gw-page-hero relative overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" aria-hidden="true" />
        <div
          className="gw-glow-cyan top-0 left-1/3 h-[280px] w-[560px] -translate-x-1/2"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
          <span className="gw-eyebrow">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            Complete Global Service Catalog • 16 Specialized Departments
          </span>
          <h1 className="font-display max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl">
            Comprehensive Digital Capabilities. Zero Freelance Chaos.
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed sm:text-base">
            From budget-friendly starter MVPs and fast websites to enterprise FinTech
            infrastructure. Every project is assigned a dedicated Project Manager with guaranteed
            milestones and IP escrow.
          </p>

          {/* Currency is auto-detected from your browser locale; override anytime from the
              header preferences — no need to call out the detected country here. */}
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-xs text-[var(--eco-on-dark-muted)] backdrop-blur-md">
            <Globe className="h-4 w-4 text-emerald-300" aria-hidden="true" />
            <span>
              Prices shown in <strong className="text-white">{currency}</strong> • detected
              automatically, changeable anytime
            </span>
          </div>
        </div>
      </section>

      {/* Porcelain body — elevated white cards */}
      <div className="gw-page-body">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          {/* Filter and Search Bar */}
          <div className="gw-card space-y-4 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by tech (React, Flutter, Shopify, SEO, AI, NDPR)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-border bg-surface-raised text-foreground focus:border-primary w-full rounded-xl border py-2.5 pr-4 pl-9 text-xs focus:outline-none"
                />
              </div>

              <button
                onClick={onOpenBriefWizard}
                className="from-primary to-highlight flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03] sm:w-auto"
              >
                <span>Build Custom Project Scope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="border-border no-scrollbar flex items-center gap-2 overflow-x-auto border-t pt-3">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? "bg-primary border-primary text-white shadow-md"
                      : "border-border bg-surface-raised text-muted-foreground hover:border-primary/50 border"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 16 Departments Grid with Domain Covers & Accessible Pricing */}
          {filteredDepts.length === 0 ? (
            <div className="gw-card items-center space-y-3 p-12 text-center">
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredDepts.map((dept) => {
                const starterPricing = getRegionalPricing(dept.id, "starter");
                return (
                  <div
                    key={dept.id}
                    onClick={() => setActiveModalDept(dept)}
                    className="gw-card gw-card-hover group cursor-pointer overflow-hidden"
                  >
                    <div>
                      {/* Visual Cover Photo */}
                      <div className="gw-photo-plate bg-slate-950 relative h-44 overflow-hidden">
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
                      <div className="space-y-4 p-6">
                        <div className="flex items-start justify-between gap-3">
                          <span className="gw-icon-pill">
                            <CardIcon deptId={dept.id} />
                          </span>
                          <span className="gw-chip gw-chip-live font-mono">
                            {dept.activeTalentsCount} active
                          </span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                          {departmentProfile(dept.id).scope}
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
                    <div className="border-border bg-surface-raised flex items-center justify-between border-t p-5 pt-3">
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
        </div>
      </div>

      {/* Rendered outside the porcelain body so the dialog keeps its own
          on-navy surface rather than inheriting the band's inversion. */}
      <ServiceDetailModal
        dept={activeModalDept}
        isOpen={!!activeModalDept}
        onClose={() => setActiveModalDept(null)}
        onOpenBriefWizard={onOpenBriefWizard}
      />
    </div>
  );
};

import React from "react";
import { BookOpen, ArrowRight, Clock, Sparkles, TrendingUp, Cpu, Layers } from "lucide-react";
import { MainNavView } from "../layout/AppNavbar";

interface InsightsViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  const articles = [
    {
      id: "art-1",
      title:
        "Architecting Sub-300ms FinTech Settlement Corridors for Cross-Border Diaspora Banking",
      tag: "Engineering / FinTech",
      readTime: "6 min read",
      date: "September 2026",
      excerpt:
        "How decoupling non-blocking KYC verification and leveraging Cloudflare edge workers slashed transaction drop-offs by 74% across UK-to-Nigeria remittances.",
      author: "Tunde Bakare",
      authorRole: "VP of Engineering",
    },
    {
      id: "art-2",
      title:
        "The Sovereign Agency Model: Why African Conglomerates Are Replacing Open Freelance Marketplaces",
      tag: "Strategy & Governance",
      readTime: "8 min read",
      date: "September 2026",
      excerpt:
        "Examining the hidden costs of freelancer bidding vs dedicated PM-managed squads with milestone escrow and strict intellectual property guarantees.",
      author: "Najeeb Al-Hassan",
      authorRole: "Managing Director",
    },
    {
      id: "art-3",
      title: "Autonomous AI Dispatch & Low-Bandwidth USSD/SMS Pipelines in West African AgriTech",
      tag: "AI & Automation",
      readTime: "5 min read",
      date: "August 2026",
      excerpt:
        "How intelligent n8n agent orchestration and Twilio SMS fallbacks prevented 32% food spoilage across 25,000 smallholder grain farms in Northern Nigeria.",
      author: "Dr. Fatima Bello",
      authorRole: "Lead AI Architect",
    },
    {
      id: "art-4",
      title:
        "Building Inclusive High-Conversion Design Systems for Multi-Lingual African Mobile Products",
      tag: "Product Design (WCAG 2.2)",
      readTime: "7 min read",
      date: "July 2026",
      excerpt:
        "Design token frameworks, typography scaling, and cultural heuristics for multilingual products across Hausa, Yoruba, Igbo, and French West Africa.",
      author: "Amara Nwosu",
      authorRole: "Head of Product Design",
    },
  ];

  return (
    <div className="bg-[#090D1A] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>NDH Strategic Intelligence & Technical Dossiers</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Insights on Sovereign Technology, FinTech & African Scale.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            In-depth engineering blueprints, product architecture case studies, and strategic
            research published by NDH department leads.
          </p>
        </div>

        {/* Featured Article */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-md bg-blue-950 text-blue-300 font-mono text-[11px] font-bold border border-blue-800">
                {articles[0]?.tag}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{articles[0]?.readTime}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white hover:text-blue-400 cursor-pointer transition-colors leading-tight">
              {articles[0]?.title}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">{articles[0]?.excerpt}</p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
              <span className="font-bold text-white">{articles[0]?.author}</span>
              <span>•</span>
              <span className="text-blue-400">{articles[0]?.authorRole}</span>
              <span>•</span>
              <span className="text-slate-400">{articles[0]?.date}</span>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
              Download Full Whitepaper
            </div>
            <p className="text-xs text-slate-300">
              Read the full 24-page technical architecture paper with Go / Rust code snippets and
              benchmark telemetry.
            </p>
            <button
              onClick={onOpenBriefWizard}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-transform hover:scale-105"
            >
              Request Whitepaper & Code →
            </button>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(1).map((art) => (
            <div
              key={art.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl hover:border-blue-500/60 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {art.tag}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{art.readTime}</span>
                </div>

                <h3 className="font-bold text-base text-white hover:text-blue-400 cursor-pointer transition-colors">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{art.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div>
                  <div className="font-bold text-white">{art.author}</div>
                  <div className="text-[11px] text-blue-400">{art.authorRole}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

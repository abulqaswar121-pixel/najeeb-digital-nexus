import React from 'react';
import {
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
} from 'lucide-react';
import { MainNavView } from '../layout/AppNavbar';

interface InsightsViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  const articles = [
    {
      id: 'art-1',
      title: 'Architecting Sub-300ms FinTech Settlement Corridors for Cross-Border Diaspora Banking',
      tag: 'Engineering / FinTech',
      readTime: '6 min read',
      date: 'September 2026',
      excerpt: 'How decoupling non-blocking KYC verification and leveraging Cloudflare edge workers slashed transaction drop-offs by 74% across UK-to-Nigeria remittances.',
      author: 'Tunde Bakare',
      authorRole: 'VP of Engineering',
    },
    {
      id: 'art-2',
      title: 'The Sovereign Agency Model: Why African Conglomerates Are Replacing Open Freelance Marketplaces',
      tag: 'Strategy & Governance',
      readTime: '8 min read',
      date: 'September 2026',
      excerpt: 'Examining the hidden costs of freelancer bidding vs dedicated PM-managed squads with milestone escrow and strict intellectual property guarantees.',
      author: 'Najeeb Al-Hassan',
      authorRole: 'Managing Director',
    },
    {
      id: 'art-3',
      title: 'Autonomous AI Dispatch & Low-Bandwidth USSD/SMS Pipelines in West African AgriTech',
      tag: 'AI & Automation',
      readTime: '5 min read',
      date: 'August 2026',
      excerpt: 'How intelligent n8n agent orchestration and Twilio SMS fallbacks prevented 32% food spoilage across 25,000 smallholder grain farms in Northern Nigeria.',
      author: 'Dr. Fatima Bello',
      authorRole: 'Lead AI Architect',
    },
    {
      id: 'art-4',
      title: 'Building Inclusive High-Conversion Design Systems for Multi-Lingual African Mobile Products',
      tag: 'Product Design (WCAG 2.2)',
      readTime: '7 min read',
      date: 'July 2026',
      excerpt: 'Design token frameworks, typography scaling, and cultural heuristics for multilingual products across Hausa, Yoruba, Igbo, and French West Africa.',
      author: 'Amara Nwosu',
      authorRole: 'Head of Product Design',
    },
  ];

  return (
    <div className="bg-[#080C14] text-[#F1F5F9] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>NDH Strategic Intelligence & Technical Dossiers</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Insights on Sovereign Technology, FinTech & African Scale.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            In-depth engineering blueprints, product architecture case studies, and strategic research published by NDH department leads.
          </p>
        </div>

        {/* Featured Article */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 font-mono text-[10px] uppercase font-bold border border-blue-800/60">
                {articles[0]?.tag}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{articles[0]?.readTime}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white hover:text-blue-400 cursor-pointer transition-colors">
              {articles[0]?.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{articles[0]?.excerpt}</p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-white">{articles[0]?.author}</span>
              <span>•</span>
              <span>{articles[0]?.authorRole}</span>
              <span>•</span>
              <span>{articles[0]?.date}</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-end">
            <button
              onClick={() => onSelectView('case-study')}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span>Read Full Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid of Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(1).map((art) => (
            <div
              key={art.id}
              className="p-6 rounded-2xl bg-[#0F172A]/70 border border-blue-900/40 space-y-4 flex flex-col justify-between shadow-lg hover:border-blue-700/60 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-blue-400 font-mono uppercase">{art.tag}</span>
                  <span className="text-slate-500">{art.readTime}</span>
                </div>

                <h3 className="font-bold text-base text-white hover:text-blue-400 cursor-pointer transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{art.excerpt}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-white">{art.author}</span>
                <span>{art.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

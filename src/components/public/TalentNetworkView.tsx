import React, { useState } from 'react';
import { VETTED_TALENTS } from '../../data/mockData';
import {
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  Briefcase,
  Layers,
  Star,
} from 'lucide-react';
import { MainNavView } from '../layout/AppNavbar';

interface TalentNetworkViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const TalentNetworkView: React.FC<TalentNetworkViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  const [activeTierFilter, setActiveTierFilter] = useState<'All' | 'Elite' | 'Lead' | 'Senior'>('All');
  const [appSubmitted, setAppSubmitted] = useState<boolean>(false);
  const [appName, setAppName] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appDept, setAppDept] = useState('web_app_development');
  const [appPortfolio, setAppPortfolio] = useState('');

  const filteredTalents = VETTED_TALENTS.filter((t) => {
    if (activeTierFilter === 'All') return true;
    return t.tier === activeTierFilter;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppSubmitted(true);
  };

  return (
    <div className="bg-[#080C14] text-[#F1F5F9] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
            <Users className="w-3.5 h-3.5" />
            <span>The Top 1% African Digital Workforce</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Vetted African Tech Talents. Orchestrated by Enterprise PMs.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Our talent network connects vetted software engineers, product designers, AI specialists, and brand strategists with high-impact sovereign and enterprise projects.
          </p>
        </div>

        {/* 5 Talent Tiers Progression */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400">Progression Framework</span>
              <h2 className="text-2xl font-bold text-white mt-1">Five Transparent Talent Tiers</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Performance & SLA Governed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            {[
              { tier: 'Junior', exp: '1-2 Yrs', rate: '$25 - $35/hr', req: 'Academy Graduate / Verified Basics' },
              { tier: 'Intermediate', exp: '2-4 Yrs', rate: '$35 - $48/hr', req: '5+ Delivered Projects / 97%+ SLA' },
              { tier: 'Senior', exp: '4-7 Yrs', rate: '$48 - $60/hr', req: '12+ Sprints / 4.9+ Quality Score' },
              { tier: 'Lead', exp: '7-10 Yrs', rate: '$60 - $75/hr', req: 'Squad Architecture & Mentorship' },
              { tier: 'Elite', exp: '10+ Yrs', rate: '$75 - $100+/hr', req: 'Sovereign Systems & FinTech Masters' },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-white text-sm">{t.tier} Tier</div>
                  <div className="text-[10px] text-blue-400 font-mono">{t.exp} Experience</div>
                </div>
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div className="font-mono text-emerald-400 font-bold">{t.rate}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{t.req}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talent Showcase Directory */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white">Active Talent Squad Showcase</h3>
              <p className="text-xs text-slate-400">Showing vetted profiles across all 10 managed departments.</p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {(['All', 'Elite', 'Lead', 'Senior'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveTierFilter(filter)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    activeTierFilter === filter ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map((tal) => (
              <div
                key={tal.id}
                className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-4 flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 font-mono text-[10px] font-bold border border-blue-800/60">
                      {tal.tier} Tier
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {tal.qualityScore} / 5.0 Rating
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-white">{tal.pseudonym}</h4>
                    <div className="text-xs text-slate-400">{tal.location} • {tal.department.replace('_', ' ').toUpperCase()}</div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{tal.bio}</p>

                  {tal.academyGraduate && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tal.academyBadgeTitle}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tal.skills.slice(0, 4).map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-300 border border-slate-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{tal.completedProjects} Projects Delivered</span>
                  <span className="text-emerald-400">{tal.onTimeDeliveryRate}% On-Time</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join the Talent Network Form */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-800/40 space-y-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400">Join the Elite Squad</span>
            <h3 className="text-2xl font-bold text-white">Apply to the NDH Talent Workforce</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you a senior developer, product designer, or AI engineer in Africa or the diaspora? Work on sovereign enterprise projects with guaranteed on-time weekly payouts.
            </p>
          </div>

          {appSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 space-y-2 text-xs">
              <h4 className="font-bold text-sm">Application Successfully Received!</h4>
              <p>Our talent vetting team will review your portfolio and send you an invitation to Stage 2 Technical Assessment.</p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Kelechi Umeh"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="kelechi@domain.com"
                  value={appEmail}
                  onChange={(e) => setAppEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Primary Discipline *</label>
                <select
                  value={appDept}
                  onChange={(e) => setAppDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="web_app_development">Website & App Development</option>
                  <option value="ui_ux_design">Product & UI/UX Design</option>
                  <option value="ai_automation">AI Solutions & Automation</option>
                  <option value="brand_strategy">Brand Strategy & Identity</option>
                  <option value="ecommerce">E-commerce</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">GitHub / Portfolio URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/..."
                  value={appPortfolio}
                  onChange={(e) => setAppPortfolio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>Submit Talent Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

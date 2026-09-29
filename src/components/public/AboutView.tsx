import React from 'react';
import {
  ShieldCheck,
  Building,
  Users,
  Award,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';
import { MainNavView } from '../layout/AppNavbar';

interface AboutViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  return (
    <div className="bg-[#080C14] text-[#F1F5F9] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The NDH Story & Institutional Mandate</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1]">
            Engineering Sovereign African Technology with Global Precision.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            NDH Agency was founded on an unapologetic belief: Africa possesses world-class creative and engineering talent, but international enterprises and scale-ups need institutional project management, guaranteed SLAs, and zero communication friction.
          </p>
        </div>

        {/* Operating Model: Managed Bureau vs Freelance Marketplace */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-8 shadow-2xl">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400">Core Philosophy</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why NDH Is a Managed Bureau, Not a Freelancer Marketplace
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open freelance bidding creates unpredictable quality, communication breakdowns, and administrative nightmares. NDH Agency replaces chaotic bidding with an engineering operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-4">
              <div className="font-bold text-sm text-red-400">Traditional Freelance Marketplaces (The Problem)</div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Clients must sift through dozens of untested bids and manage individual freelancers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Direct communication leads to scope creep, missed deadlines, and lost IP ownership.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Zero formal QA gates; clients are forced to test raw code or unrefined designs themselves.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-4">
              <div className="font-bold text-sm text-emerald-400">NDH Managed Bureau (The Solution)</div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Clients contract NDH Agency with guaranteed SLAs, milestone escrow, and fixed deliverables.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dedicated internal Project Managers handle talent allocation, daily standups, and scope controls.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Strict QA Gates: No deliverable is ever shown to a client until PM code audits and latency tests pass.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Leadership & Executive Governance */}
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400">Executive Leadership</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Stewards of Quality and Execution</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Najeeb Al-Hassan',
                role: 'Managing Director & Principal Architect',
                bio: 'Directing sovereign digital initiatives and high-growth African technology infrastructure.',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
              },
              {
                name: 'Tunde Bakare',
                role: 'VP of Technology & Engineering',
                bio: 'Distributed systems veteran ensuring sub-300ms global edge delivery and zero-debt codebases.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              },
              {
                name: 'Amara Nwosu',
                role: 'Head of Product Design Systems',
                bio: 'Pioneering accessible, WCAG 2.2 AA compliant fintech and consumer UX architectures.',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
              },
              {
                name: 'Amina Yusuf',
                role: 'Director of Finance & Operations',
                bio: 'Dual-approval financial governance, multi-currency escrow, and international compliance.',
                avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
              },
            ].map((leader, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-4"
              >
                <img
                  src={leader.avatar}
                  alt={leader.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-white">{leader.name}</h3>
                  <div className="text-xs text-blue-400 font-mono">{leader.role}</div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Impact CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/60 border border-blue-800/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-bold text-white">Ready to Partner with NDH Agency?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We pair your enterprise with dedicated PM leadership and elite vetted squads. From Lagos to London, New York to Nairobi.
            </p>
          </div>

          <button
            onClick={onOpenBriefWizard}
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all shrink-0"
          >
            <span>Request a Tailored Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

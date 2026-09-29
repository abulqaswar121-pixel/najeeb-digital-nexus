import React from 'react';
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Lock,
  Globe,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MainNavView } from './AppNavbar';

interface AppFooterProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onSelectView, onOpenBriefWizard }) => {
  return (
    <footer className="bg-[#05080E] border-t border-blue-950 py-14 text-xs font-sans text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Discrete NDH Academy Cross-Link Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/40 to-transparent border border-blue-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Looking to build your skills? Explore NDH Academy.
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                NDH Academy trains and certifies elite African developers, product designers, and AI specialists. Operating as an independent platform & decoupled codebase.
              </p>
            </div>
          </div>

          <a
            href="https://academy.ndh.com.ng"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-blue-600/30 transition-all"
          >
            <span>Visit academy.ndh.com.ng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4 border-t border-slate-900">
          {/* Col 1: Brand & Parent Hub */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                N
              </div>
              <span className="font-bold text-base text-white">NDH Agency</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier managed digital services bureau of Najeeb Digital Hub. Engineering sovereign technology, world-class design, and high-impact digital solutions for Nigerian and international leaders.
            </p>
            <div className="text-[11px] text-blue-400 font-mono">
              Ecosystem: agency.ndh.com.ng • academy.ndh.com.ng
            </div>
          </div>

          {/* Col 2: Managed Departments */}
          <div className="space-y-2.5">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">Core Departments</div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <button onClick={() => onSelectView('services')} className="hover:text-white transition-colors">
                  Web & Application Development
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('services')} className="hover:text-white transition-colors">
                  Product & UI/UX Design Systems
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('services')} className="hover:text-white transition-colors">
                  AI Solutions & Workflow Automation
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('services')} className="hover:text-white transition-colors">
                  Brand Strategy & Identity
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('services')} className="hover:text-white transition-colors">
                  E-commerce & Growth Funnels
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('services')} className="hover:text-white transition-colors">
                  Data & Pan-African Market Research
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Operations & Privacy Model */}
          <div className="space-y-2.5">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">Operational Governance</div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <button onClick={() => onSelectView('process')} className="hover:text-white transition-colors">
                  Managed Bureau vs Freelance Marketplaces
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('process')} className="hover:text-white transition-colors">
                  Dedicated PM SLA & QA Gates
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('talent-network')} className="hover:text-white transition-colors">
                  Strict Confidential Talent Privacy
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('services')} className="hover:text-white transition-colors">
                  Multi-Currency Billing (NGN / USD / GBP)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('process')} className="hover:text-white transition-colors">
                  Mutual NDAs & Intellectual Property Escrow
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Testing Access */}
          <div className="space-y-2.5">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">Operating Portals</div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <button onClick={() => onSelectView('client-dashboard')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Client Workspace</span>
                  <span className="text-[10px] text-blue-400 font-mono">Live</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('pm-dashboard')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Project Manager Operations</span>
                  <span className="text-[10px] text-blue-400 font-mono">Live</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('talent-dashboard')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Talent Workforce Network</span>
                  <span className="text-[10px] text-blue-400 font-mono">Private</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('admin-command')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Admin Command Nexus</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Dual-Approval</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('journey')} className="hover:text-white transition-colors text-emerald-400 font-semibold">
                  13-Stage Primary Journey Demo
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 NDH Agency (agency.ndh.com.ng). Part of Najeeb Digital Hub. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>NDPR & GDPR Compliant</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>ISO 27001 Certified Security</span>
            </span>
            <span className="text-slate-400">Terms of Engagement</span>
            <span className="text-slate-400">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

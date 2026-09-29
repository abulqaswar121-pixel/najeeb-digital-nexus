import React from 'react';
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Lock,
  Globe,
  Layers,
  Sparkles,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { MainNavView } from './AppNavbar';

interface AppFooterProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onSelectView, onOpenBriefWizard }) => {
  return (
    <footer className="bg-[#070A12] border-t border-slate-800 py-16 text-xs font-sans text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Discrete NDH Academy Cross-Link Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Looking for Tech Education? Visit NDH Academy.
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-mono font-medium">
                  Separate Platform
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                NDH Academy trains African developers, product designers, and AI engineers. Operates as an independent platform with dedicated curriculum and faculty.
              </p>
            </div>
          </div>

          <a
            href="https://academy.ndh.com.ng"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <span>Visit academy.ndh.com.ng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-4 border-t border-slate-800">
          {/* Col 1: Brand & Parent Hub */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                N
              </div>
              <span className="font-extrabold text-lg text-white">NDH Agency</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The premier managed digital services bureau of Najeeb Digital Hub. Engineering sovereign technology, world-class design systems, and Pan-African market research for enterprise leaders.
            </p>
            <div className="space-y-2 text-slate-300 text-xs pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>14B Karimu Kotun St, Victoria Island, Lagos</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>partnerships@agency.ndh.com.ng</span>
              </div>
            </div>
          </div>

          {/* Col 2: Managed Departments */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              10 Core Departments
            </div>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Enterprise Web Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Mobile Application Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  UI/UX & Product Design Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Brand Strategy & Visual Identity
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Cloud Architecture & SRE
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Pan-African Market Research
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Operations & Governance */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Governance & Framework
            </div>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <button
                  onClick={() => onSelectView('process')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  The Managed Bureau Model
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('process')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Dedicated PM SLA & Dual QA Gates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('talent-network')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Strict Talent Privacy Escrow
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('case-study')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Verified Enterprise ROI Case Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('insights')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Strategic Intelligence & Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Operating Portals */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Client & Operational Portals
            </div>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <button
                  onClick={() => onSelectView('client-dashboard')}
                  className="hover:text-blue-400 flex items-center justify-between w-full transition-colors"
                >
                  <span>Client Workspace</span>
                  <span className="text-[10px] text-blue-400 font-mono px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800">
                    Client Access
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('pm-dashboard')}
                  className="hover:text-blue-400 flex items-center justify-between w-full transition-colors"
                >
                  <span>Project Manager Command</span>
                  <span className="text-[10px] text-indigo-400 font-mono px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                    PM Ops
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('talent-dashboard')}
                  className="hover:text-blue-400 flex items-center justify-between w-full transition-colors"
                >
                  <span>Talent Workforce Desk</span>
                  <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    Private
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('admin-command')}
                  className="hover:text-blue-400 flex items-center justify-between w-full transition-colors"
                >
                  <span>Admin Command Nexus</span>
                  <span className="text-[10px] text-amber-400 font-mono px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800">
                    Dual-Approval
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Compliance & Legal Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 NDH Agency (agency.ndh.com.ng). Part of Najeeb Digital Hub. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NDPR & GDPR Compliant</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>ISO 27001 Certified Security</span>
            </span>
            <button onClick={() => onSelectView('contact')} className="hover:text-white transition-colors">
              Terms & SLA
            </button>
            <button onClick={() => onSelectView('contact')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

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
  Heart,
  CreditCard,
  UserPlus,
} from 'lucide-react';
import { MainNavView } from './AppNavbar';
import { BrandLogo } from '../brand/BrandLogo';
import { useCurrencyLanguage } from '../../lib/currencyLanguageStore';

interface AppFooterProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
  onOpenTalentModal?: () => void;
  onOpenPaymentModal?: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  onSelectView,
  onOpenBriefWizard,
  onOpenTalentModal,
  onOpenPaymentModal,
}) => {
  const { currency, detectedCountry } = useCurrencyLanguage();

  return (
    <footer className="bg-[#05070D] border-t border-slate-800/80 py-16 text-xs font-sans text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Discrete NDH Academy Cross-Link Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Looking for Tech Education &amp; Training? Visit NDH Academy.
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-mono font-medium">
                  Separate Platform
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                NDH Academy trains African developers, product designers, and AI engineers. Operates as an independent platform with dedicated curriculum.
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-4 border-t border-slate-850">
          {/* Col 1: Brand & Parent Hub */}
          <div className="space-y-4">
            <BrandLogo size="md" showSubtitle={true} />
            <p className="text-xs text-slate-300 leading-relaxed">
              We design and build world-class digital systems, mobile apps, and brand strategies that help modern businesses scale with certainty.
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
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Active Region: {detectedCountry} ({currency})</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col gap-2">
              {onOpenTalentModal && (
                <button
                  onClick={onOpenTalentModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-blue-600/30 border border-emerald-500/40 text-emerald-300 hover:text-white hover:border-emerald-400 text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Apply as Vetted Talent</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">Join Squad</span>
                </button>
              )}

              {onOpenPaymentModal && (
                <button
                  onClick={onOpenPaymentModal}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                    <span>Paystack / Flutterwave Portal</span>
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono">Escrow</span>
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Managed Departments */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              16 Core Departments
            </div>
            <ul className="space-y-1.5 text-slate-300 text-xs">
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Web &amp; Full-Stack Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Mobile Apps (iOS &amp; Android)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  UI/UX &amp; Product Design Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Brand Strategy &amp; Visual Identity
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  AI Agents &amp; Workflow Automation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  FinTech &amp; Payment Gateways
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('services')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Rapid No-Code MVPs (Students &amp; Startups)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Why Choose Us */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Why Choose NDH
            </div>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <button
                  onClick={() => onSelectView('about')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Managed Bureau vs Freelancers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('process')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Guaranteed On-Time Delivery SLAs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('talent-network')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Top 3% Vetted African Talent
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('case-study')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Client Success Stories &amp; ROI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('insights')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Tech Blog &amp; Case Dossiers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Workspaces */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Dedicated Workspaces
            </div>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <button
                  onClick={() => onSelectView('client-dashboard')}
                  className="hover:text-blue-400 flex items-center justify-between w-full transition-colors"
                >
                  <span>Client Workspace</span>
                  <span className="text-[10px] text-blue-400 font-mono px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800">
                    Sign In
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('pm-dashboard')}
                  className="hover:text-blue-400 flex items-center justify-between w-full transition-colors"
                >
                  <span>Project Manager Desk</span>
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
                  <span>Talent Workspace</span>
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
                    Dual-Sign
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Compliance Badges */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 NDH Agency (agency.ndh.com.ng). Part of Najeeb Digital Hub. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NDPR &amp; GDPR Compliant</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>ISO 27001 Certified Security</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Paystack &amp; Flutterwave Verified Rails</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

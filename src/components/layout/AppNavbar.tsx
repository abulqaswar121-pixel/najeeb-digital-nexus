import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import {
  Layers,
  Sparkles,
  UserCheck,
  Briefcase,
  Terminal,
  Sliders,
  SendHorizontal,
  GitBranch,
  Lock,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Globe,
  ArrowRight,
} from 'lucide-react';

export type MainNavView =
  | 'homepage'
  | 'services'
  | 'case-study'
  | 'about'
  | 'process'
  | 'talent-network'
  | 'insights'
  | 'contact'
  | 'client-dashboard'
  | 'pm-dashboard'
  | 'talent-dashboard'
  | 'admin-command'
  | 'journey'
  | 'mobile-view';

interface AppNavbarProps {
  currentView: MainNavView;
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  currentView,
  onSelectView,
  onOpenBriefWizard,
}) => {
  const { user, openAuthModal, switchDemoRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'NGN' | 'GBP'>('USD');

  const navLinks: { id: MainNavView; label: string }[] = [
    { id: 'services', label: 'Services' },
    { id: 'case-study', label: 'Case Studies' },
    { id: 'process', label: 'Our Process' },
    { id: 'talent-network', label: 'Talent Network' },
    { id: 'about', label: 'About Us' },
    { id: 'insights', label: 'Insights' },
    { id: 'contact', label: 'Contact' },
  ];

  const portalsList: { id: MainNavView; label: string; desc: string; icon: React.ReactNode; roleName: any }[] = [
    {
      id: 'client-dashboard',
      label: 'Client Workspace',
      desc: 'Milestones, deliverables & Paystack escrow',
      icon: <UserCheck className="w-4 h-4 text-blue-400" />,
      roleName: 'client_owner',
    },
    {
      id: 'pm-dashboard',
      label: 'Project Manager Command',
      desc: 'Brief triage, margin health & QA gates',
      icon: <Briefcase className="w-4 h-4 text-indigo-400" />,
      roleName: 'project_manager',
    },
    {
      id: 'talent-dashboard',
      label: 'Talent Workspace',
      desc: 'Anonymized tasks, tickets & NIBSS payouts',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      roleName: 'talent',
    },
    {
      id: 'admin-command',
      label: 'Admin Command Nexus',
      desc: 'Super admin telemetry & dual-approval payout batches',
      icon: <Sliders className="w-4 h-4 text-amber-400" />,
      roleName: 'super_admin',
    },
  ];

  const handleSelectPortal = (portalId: MainNavView, roleName: any) => {
    switchDemoRole(roleName);
    onSelectView(portalId);
    setPortalDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPortalView = [
    'client-dashboard',
    'pm-dashboard',
    'talent-dashboard',
    'admin-command',
  ].includes(currentView);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            onSelectView('homepage');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                NDH Agency
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                Managed Bureau
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Part of Najeeb Digital Hub</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectView(link.id);
                  setPortalDropdownOpen(false);
                }}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* Subtle Currency Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-1 text-xs font-semibold text-slate-300">
            {(['USD', 'NGN'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-1 rounded transition-all ${
                  currency === c
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c === 'USD' ? '$ USD' : '₦ NGN'}
              </button>
            ))}
          </div>

          {/* Discreet Portal Access Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isPortalView
                  ? 'bg-blue-950/70 text-blue-300 border-blue-500/50 shadow-sm'
                  : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>{isPortalView ? 'Active Workspace' : 'Portal Sign In'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  portalDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {portalDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-slate-200">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Access Operating Workspace
                </div>
                <div className="py-1 space-y-1">
                  {portalsList.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPortal(p.id, p.roleName)}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors ${
                        currentView === p.id
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                          : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="mt-0.5 p-1 rounded-md bg-slate-800 border border-slate-700">
                        {p.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{p.label}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {p.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setPortalDropdownOpen(false);
                      openAuthModal();
                    }}
                    className="w-full text-center py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 rounded-lg transition-colors"
                  >
                    Switch Custom User Credentials →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary High-Contrast CTA */}
          <button
            onClick={onOpenBriefWizard}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Request Proposal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenBriefWizard}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white"
          >
            Proposal
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B0F19] px-4 py-6 space-y-5 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectView(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentView === link.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Client & Operational Portals
            </div>
            {portalsList.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPortal(p.id, p.roleName)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 hover:bg-slate-800 text-xs font-medium"
              >
                <div className="flex items-center gap-2.5">
                  {p.icon}
                  <span>{p.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBriefWizard();
              }}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-sm text-center shadow-lg shadow-blue-600/30"
            >
              Start a Project / Request Proposal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

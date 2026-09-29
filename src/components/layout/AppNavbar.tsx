import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import { useCurrencyLanguage, SupportedCurrency, SupportedLanguage } from '../../lib/currencyLanguageStore';
import { BrandLogo } from '../brand/BrandLogo';
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
  Check,
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
  const { user, switchDemoRole } = useAuth();
  const { currency, setCurrency, currencies, language, setLanguage, languages, t } = useCurrencyLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks: { id: MainNavView; label: string }[] = [
    { id: 'services', label: t('nav_services') },
    { id: 'case-study', label: t('nav_work') },
    { id: 'process', label: t('nav_how_it_works') },
    { id: 'talent-network', label: t('nav_talent') },
    { id: 'about', label: t('nav_about') },
    { id: 'insights', label: t('nav_insights') },
    { id: 'contact', label: t('nav_contact') },
  ];

  const portalsList: { id: MainNavView; label: string; desc: string; icon: React.ReactNode; roleName: any }[] = [
    {
      id: 'client-dashboard',
      label: 'Client Workspace',
      desc: 'Milestones, deliverables & escrow invoices',
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
      desc: 'Private tasks, tickets & bank payouts',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      roleName: 'talent',
    },
    {
      id: 'admin-command',
      label: 'Admin Command Nexus',
      desc: 'Super admin telemetry & dual-approval batches',
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
    <header className="sticky top-0 z-50 bg-[#070A14]/95 backdrop-blur-xl border-b border-slate-800/90 shadow-2xl font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            onSelectView('homepage');
            setMobileMenuOpen(false);
          }}
          className="cursor-pointer"
        >
          <BrandLogo size="md" showSubtitle={true} />
        </div>

        {/* Desktop Navigation Links (Clean & Simple) */}
        <nav className="hidden xl:flex items-center gap-7 text-sm font-semibold text-slate-300">
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
                  isActive ? 'text-white font-bold' : 'hover:text-white'
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

        {/* Right Actions: Currency + Language + Portals + CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* 1. Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setCurrencyDropdownOpen(false);
                setPortalDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-500 text-slate-200 text-xs font-semibold transition-all"
              aria-label="Change Language"
            >
              <span>{languages[language]?.flag}</span>
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Language
                </div>
                <div className="py-1 space-y-0.5">
                  {(Object.keys(languages) as SupportedLanguage[]).map((code) => {
                    const l = languages[code]!;
                    const isSelected = language === code;
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          setLanguage(code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold'
                            : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Global Currency Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setCurrencyDropdownOpen(!currencyDropdownOpen);
                setLangDropdownOpen(false);
                setPortalDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-500 text-slate-200 text-xs font-bold transition-all"
              aria-label="Change Currency"
            >
              <span>{currencies[currency]?.flag}</span>
              <span>{currencies[currency]?.symbol} {currency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Global Currency
                </div>
                <div className="py-1 space-y-0.5">
                  {(Object.keys(currencies) as SupportedCurrency[]).map((code) => {
                    const c = currencies[code]!;
                    const isSelected = currency === code;
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          setCurrency(code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold'
                            : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.name} ({c.symbol})</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Discreet Portal Access Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setPortalDropdownOpen(!portalDropdownOpen);
                setLangDropdownOpen(false);
                setCurrencyDropdownOpen(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isPortalView
                  ? 'bg-blue-950/90 text-blue-300 border-blue-500/50 shadow-sm'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>{isPortalView ? 'Active Workspace' : t('nav_client_login')}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  portalDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {portalDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-slate-200">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Access Operating Workspace
                </div>
                <div className="py-1 space-y-1">
                  {portalsList.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPortal(p.id, p.roleName)}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                        currentView === p.id
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                          : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="mt-0.5 p-1 rounded-lg bg-slate-800 border border-slate-700">
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
              </div>
            )}
          </div>

          {/* 4. High-Impact CTA Button */}
          <button
            onClick={onOpenBriefWizard}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>{t('nav_request_quote')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setCurrency(currency === 'USD' ? 'NGN' : 'USD')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200"
          >
            {currencies[currency]?.symbol} {currency}
          </button>
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
        <div className="md:hidden border-t border-slate-800 bg-[#070A14] px-4 py-6 space-y-5 animate-in slide-in-from-top-4 duration-200">
          {/* Currency and Language Pickers for Mobile */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
              >
                {(Object.keys(currencies) as SupportedCurrency[]).map((c) => (
                  <option key={c} value={c}>
                    {currencies[c]?.flag} {c} ({currencies[c]?.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
              >
                {(Object.keys(languages) as SupportedLanguage[]).map((l) => (
                  <option key={l} value={l}>
                    {languages[l]?.flag} {languages[l]?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  currentView === link.id
                    ? 'bg-blue-600 text-white font-bold'
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
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium"
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
              className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm text-center shadow-lg shadow-blue-600/30"
            >
              Start a Project
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

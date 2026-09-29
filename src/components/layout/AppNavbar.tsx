import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import {
  Layers,
  Sparkles,
  LayoutGrid,
  FileText,
  UserCheck,
  Briefcase,
  Terminal,
  Smartphone,
  Sliders,
  SendHorizontal,
  GitBranch,
  Lock,
  User,
  ChevronDown,
  LogOut,
  UserPlus,
  Building,
  Info,
  Compass,
  Users,
  BookOpen,
  PhoneCall,
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
  const { user, openAuthModal, openCreateAccountModal, switchDemoRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'NGN' | 'GBP'>('USD');

  const mainNavItems: { id: MainNavView; label: string; icon?: React.ReactNode }[] = [
    { id: 'homepage', label: 'Overview' },
    { id: 'services', label: '10 Core Services' },
    { id: 'case-study', label: 'Case Studies & ROI' },
    { id: 'process', label: 'How We Work' },
    { id: 'talent-network', label: 'Talent Network' },
    { id: 'about', label: 'About Agency' },
    { id: 'insights', label: 'Insights & Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  const portalNavItems: { id: MainNavView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'client-dashboard', label: 'Client Workspace', icon: <UserCheck className="w-3.5 h-3.5" />, badge: 'Client' },
    { id: 'pm-dashboard', label: 'PM Operations', icon: <Briefcase className="w-3.5 h-3.5" />, badge: 'Ops' },
    { id: 'talent-dashboard', label: 'Talent Workforce', icon: <Terminal className="w-3.5 h-3.5" />, badge: 'Private' },
    { id: 'admin-command', label: 'Admin Command', icon: <Sliders className="w-3.5 h-3.5" />, badge: 'Super/Fin' },
    { id: 'journey', label: '13-Stage Journey Walkthrough', icon: <GitBranch className="w-3.5 h-3.5" />, badge: 'Demo' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-blue-900/40 bg-[#080C14]/95 backdrop-blur-2xl shadow-xl font-sans text-slate-200 text-xs">
      {/* Top Telemetry & Role Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-blue-950 text-[11px]">
        {/* Brand & Parent Ecosystem Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-mono text-[10px] uppercase border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Strategic Hybrid Blend • Production Live</span>
          </div>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 hidden lg:inline">
            NDH Agency (agency.ndh.com.ng) • Managed Digital Services Bureau
          </span>
        </div>

        {/* Right Controls: Role Switcher & Account Access */}
        <div className="flex items-center gap-2.5">
          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 font-mono text-[10px]">
            {(['USD', 'NGN', 'GBP'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2 py-0.5 rounded ${
                  currency === curr ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 text-slate-200 transition-colors"
            >
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.fullName}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="font-semibold truncate max-w-[120px]">{user?.fullName || 'Guest Visitor'}</span>
              <span className="text-[10px] text-blue-400 font-mono uppercase hidden sm:inline">({user?.role.replace('_', ' ')})</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0A0E17] border border-blue-900/60 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="font-bold text-white text-xs">{user?.fullName}</div>
                  <div className="text-[10px] text-blue-400">{user?.roleTitle}</div>
                  {user?.organizationName && (
                    <div className="text-[10px] text-slate-400 mt-0.5">{user.organizationName}</div>
                  )}
                </div>

                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase">Switch Active Demo Role:</div>
                  {[
                    { role: 'client_owner', label: 'Client Owner (Dr. Folake)', portal: 'client-dashboard' },
                    { role: 'project_manager', label: 'Project Manager (Tariq)', portal: 'pm-dashboard' },
                    { role: 'talent', label: 'Elite Talent (Architect-Alpha)', portal: 'talent-dashboard' },
                    { role: 'super_admin', label: 'Super Admin (Najeeb)', portal: 'admin-command' },
                    { role: 'finance_admin', label: 'Finance Admin (Amina)', portal: 'admin-command' },
                  ].map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchDemoRole(item.role as any);
                        onSelectView(item.portal as any);
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-between text-xs transition-colors"
                    >
                      <span>{item.label}</span>
                      {user?.role === item.role && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-slate-800 flex items-center justify-between px-2">
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      openCreateAccountModal();
                    }}
                    className="text-[11px] text-blue-400 hover:underline py-1"
                  >
                    + Create New Account
                  </button>
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      openAuthModal();
                    }}
                    className="text-[11px] text-slate-400 hover:text-white py-1"
                  >
                    Sign In / Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={openAuthModal}
            className="px-3 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium transition-colors"
          >
            Switch Account
          </button>
        </div>
      </div>

      {/* Main Agency Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectView('homepage')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            N
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors">
                NDH Agency
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/10 text-blue-400 font-mono uppercase">
                Nexus OS
              </span>
            </div>
            <p className="text-[9px] text-slate-400 leading-none">Najeeb Digital Hub</p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-400">
          {mainNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`transition-colors py-1 ${
                  isActive ? 'text-blue-400 font-semibold border-b border-blue-400' : 'hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSelectView('journey')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'journey'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">13-Stage Journey Demo</span>
          </button>

          <button
            onClick={onOpenBriefWizard}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Request a Proposal</span>
          </button>
        </div>
      </div>

      {/* Portals Sub-Bar for Quick Cross-Testing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-850 py-1.5 overflow-x-auto no-scrollbar flex items-center justify-between gap-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-mono uppercase text-[10px] mr-1 hidden sm:inline">Operating Portals:</span>
          {portalNavItems.map((p) => {
            const isActive = currentView === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectView(p.id)}
                className={`px-3 py-1 rounded-md whitespace-nowrap transition-all flex items-center gap-1.5 font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {p.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase ${
                      isActive ? 'bg-blue-800 text-blue-200' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectView('mobile-view')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors ${
              currentView === 'mobile-view'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Simulator</span>
          </button>
        </div>
      </div>
    </header>
  );
};

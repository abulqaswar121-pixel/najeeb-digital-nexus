import React, { useState } from "react";
import { useAuth, openAuthModal } from "../../lib/authStore";
import {
  useCurrencyLanguage,
  SupportedCurrency,
  SupportedLanguage,
} from "../../lib/currencyLanguageStore";
import { BrandLogo } from "../brand/BrandLogo";
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
  LogOut,
  User,
  Gift,
} from "lucide-react";

export type MainNavView =
  | "homepage"
  | "services"
  | "case-study"
  | "about"
  | "process"
  | "talent-network"
  | "insights"
  | "contact"
  | "client-dashboard"
  | "pm-dashboard"
  | "talent-dashboard"
  | "admin-command"
  | "journey"
  | "mobile-view";

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
  const { user, isAuthenticated, logout } = useAuth();
  const { currency, setCurrency, currencies, language, setLanguage, languages, t } =
    useCurrencyLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks: { id: MainNavView; label: string }[] = [
    { id: "services", label: t("nav_services") },
    { id: "case-study", label: t("nav_work") },
    { id: "process", label: t("nav_how_it_works") },
    { id: "talent-network", label: t("nav_talent") },
    { id: "about", label: t("nav_about") },
    { id: "insights", label: t("nav_insights") },
    { id: "contact", label: t("nav_contact") },
  ];

  const handleGoToUserWorkspace = () => {
    if (user?.role === "super_admin") {
      onSelectView("admin-command");
    } else if (user?.role === "project_manager") {
      onSelectView("pm-dashboard");
    } else if (user?.role === "talent") {
      onSelectView("talent-dashboard");
    } else {
      onSelectView("client-dashboard");
    }
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isPortalView = [
    "client-dashboard",
    "pm-dashboard",
    "talent-dashboard",
    "admin-command",
  ].includes(currentView);

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-clip bg-[#070A14]/95 backdrop-blur-xl border-b border-slate-800/90 shadow-2xl font-sans">
      <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:h-20 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            onSelectView("homepage");
            setMobileMenuOpen(false);
          }}
          className="min-w-0 cursor-pointer"
        >
          <BrandLogo size="sm" showSubtitle={false} className="min-w-0 sm:hidden" />
          <BrandLogo size="md" showSubtitle={true} className="hidden sm:flex" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-7 text-sm font-semibold text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectView(link.id);
                  setUserDropdownOpen(false);
                }}
                className={`transition-colors py-1 relative ${
                  isActive ? "text-white font-bold" : "hover:text-white"
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

        {/* Right Actions: Currency + Language + User Session + CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* 1. Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setCurrencyDropdownOpen(false);
                setUserDropdownOpen(false);
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
                            ? "bg-blue-600 text-white font-bold"
                            : "hover:bg-slate-800 text-slate-300 hover:text-white"
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
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-500 text-slate-200 text-xs font-bold transition-all"
              aria-label="Change Currency"
            >
              <span>{currencies[currency]?.flag}</span>
              <span>
                {currencies[currency]?.symbol} {currency}
              </span>
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
                            ? "bg-blue-600 text-white font-bold"
                            : "hover:bg-slate-800 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>
                            {c.name} ({c.symbol})
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. User Session / Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setLangDropdownOpen(false);
                  setCurrencyDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-500 text-slate-200 text-xs font-semibold transition-all"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-5 h-5 rounded-full object-cover border border-slate-600"
                />
                <span className="max-w-[100px] truncate">{user.fullName.split(" ")[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="font-bold text-xs text-white">{user.fullName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                      {user.roleTitle}
                    </div>
                  </div>

                  <button
                    onClick={handleGoToUserWorkspace}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-blue-600 hover:text-white transition-colors text-left"
                  >
                    <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Open My Workspace</span>
                  </button>

                  {user.role === "client_owner" && (
                    <button
                      onClick={() => {
                        onSelectView("client-dashboard");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors text-left"
                    >
                      <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Referral Credits (₦250k)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors border-t border-slate-800 text-left"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-bold transition-all"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* 4. High-Impact CTA Button */}
          <button
            onClick={onOpenBriefWizard}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>{t("nav_request_quote")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <button
            onClick={onOpenBriefWizard}
            className="h-10 px-3 rounded-lg text-xs font-bold bg-blue-600 text-white"
          >
            Proposal
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100dvh-4rem)] w-full max-w-full overflow-x-hidden overflow-y-auto border-t border-slate-800 bg-[#070A14] px-4 py-5 md:hidden space-y-5 animate-in slide-in-from-top-4 duration-200">
          {/* User Status in Mobile */}
          {user ? (
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="font-bold text-xs text-white">{user.fullName}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{user.roleTitle}</div>
                  </div>
                </div>
                <button
                  onClick={handleGoToUserWorkspace}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Workspace
                </button>
              </div>

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-1.5 text-center text-xs text-red-400 hover:text-red-300 font-medium border-t border-slate-800 pt-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal("login");
              }}
              className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span>Sign In / Register Account</span>
            </button>
          )}

          {/* Currency and Language Pickers for Mobile */}
          <div className="grid min-w-0 grid-cols-1 gap-3 min-[380px]:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="w-full min-w-0 p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
              >
                {(Object.keys(currencies) as SupportedCurrency[]).map((c) => (
                  <option key={c} value={c}>
                    {currencies[c]?.flag} {c} ({currencies[c]?.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full min-w-0 p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
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
                    ? "bg-blue-600 text-white font-bold"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {link.label}
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

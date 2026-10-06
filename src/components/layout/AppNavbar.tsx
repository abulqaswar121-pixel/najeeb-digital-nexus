import React, { useState } from "react";
import { useAuth, openAuthModal } from "../../lib/authStore";
import {
  useCurrencyLanguage,
  SupportedCurrency,
  SupportedLanguage,
} from "../../lib/currencyLanguageStore";
import { BrandLogo } from "../brand/BrandLogo";
import { FamilyMenu } from "./FamilyMenu";
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
  | "mobile-view"
  | "privacy-policy"
  | "terms-of-service"
  | "refund-policy";

interface AppNavbarProps {
  currentView: MainNavView;
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

/**
 * Real router paths for the "On this site" column of the ecosystem switcher.
 * Kept in sync with VIEW_PATHS in lib/viewRouting so the switcher deep-links
 * to actual routes rather than re-implementing view navigation.
 */
const SITE_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "How It Works", href: "/process" },
  { label: "Talent Network", href: "/talent-network" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

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
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-clip border-b border-white/10 bg-eco-dark/95 font-sans shadow-2xl backdrop-blur-xl">
      {/* Flex (not grid) so the brand, desktop nav, right-hand tools and the
          mobile controls each occupy exactly one row at every breakpoint. The
          previous 2-column grid had four children, which pushed the tools
          group onto a second implicit row at >=1280px inside a fixed-height
          header. `overflow-x-clip` + `min-w-0` on every flexible child is what
          keeps a 360px viewport from ever scrolling sideways. */}
      <div className="mx-auto flex h-16 w-full min-w-0 max-w-7xl items-center gap-2 px-3 sm:h-20 sm:gap-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            onSelectView("homepage");
            setMobileMenuOpen(false);
          }}
          className="min-w-0 flex-1 cursor-pointer lg:flex-none"
        >
          <BrandLogo size="sm" className="min-w-0 sm:hidden" />
          <BrandLogo size="md" className="hidden min-w-0 sm:flex" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="ml-4 hidden min-w-0 items-center gap-5 text-sm font-semibold text-slate-300 2xl:flex">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectView(link.id);
                  setUserDropdownOpen(false);
                }}
                className={`relative py-1 whitespace-nowrap transition-colors ${
                  isActive ? "font-bold text-white" : "hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-eco-electric" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Ecosystem + Currency + Language + User Session + CTA */}
        <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
          {/* 0. Precision Gateway ecosystem switcher */}
          <FamilyMenu
            links={SITE_LINKS}
            cta={{ label: t("nav_request_quote"), href: "/contact" }}
          />

          {/* 1. Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setCurrencyDropdownOpen(false);
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-eco-navy px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:border-eco-cyan/40"
              aria-label="Change Language"
            >
              <span>{languages[language]?.flag}</span>
              <span className="uppercase">{language}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 animate-in fade-in zoom-in-95 rounded-2xl border border-white/10 bg-eco-navy p-2 text-slate-200 shadow-2xl duration-150">
                <div className="border-b border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Language
                </div>
                <div className="space-y-0.5 py-1">
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
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-eco-electric/20 font-bold text-eco-electric"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
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
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-eco-navy px-3 py-1.5 text-xs font-bold text-slate-200 transition-all hover:border-eco-cyan/40"
              aria-label="Change Currency"
            >
              <span className="whitespace-nowrap">
                {currencies[currency]?.symbol} {currency}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 w-52 animate-in fade-in zoom-in-95 rounded-2xl border border-white/10 bg-eco-navy p-2 text-slate-200 shadow-2xl duration-150">
                <div className="border-b border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Global Currency
                </div>
                <div className="space-y-0.5 py-1">
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
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-eco-electric/20 font-bold text-eco-electric"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>
                            {c.name} ({c.symbol})
                          </span>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
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
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-eco-navy px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:border-eco-cyan/40"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="h-5 w-5 rounded-full border border-white/15 object-cover"
                />
                <span className="max-w-[100px] truncate">{user.fullName.split(" ")[0]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 animate-in fade-in zoom-in-95 space-y-1 rounded-2xl border border-white/10 bg-eco-navy p-2 text-slate-200 shadow-2xl duration-150">
                  <div className="border-b border-white/10 px-3 py-2">
                    <div className="text-xs font-bold text-white">{user.fullName}</div>
                    <div className="truncate text-[10px] text-slate-400">{user.email}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-eco-cyan">
                      {user.roleTitle}
                    </div>
                  </div>

                  <button
                    onClick={handleGoToUserWorkspace}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-200 transition-colors hover:bg-eco-electric/20 hover:text-white"
                  >
                    <UserCheck className="h-4 w-4 shrink-0 text-eco-electric" />
                    <span>Open My Workspace</span>
                  </button>

                  {user.role === "client_owner" && (
                    <button
                      onClick={() => {
                        onSelectView("client-dashboard");
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-200 transition-colors hover:bg-white/5"
                    >
                      <Gift className="h-4 w-4 shrink-0 text-amber-400" />
                      <span>Referral Credits (₦250k)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl border-t border-white/10 px-3 py-2 text-left text-xs font-medium text-red-400 transition-colors hover:bg-red-950/40"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-eco-navy px-3.5 py-1.5 text-xs font-bold text-slate-200 transition-all hover:border-eco-cyan/40"
            >
              <User className="h-3.5 w-3.5 text-eco-electric" />
              <span>Sign In</span>
            </button>
          )}

          {/* 4. High-Impact CTA Button */}
          <button
            onClick={onOpenBriefWizard}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-eco-electric to-eco-cyan px-5 py-2.5 text-xs font-bold text-[#04121f] shadow-lg shadow-eco-electric/25 transition-all hover:brightness-110 active:scale-95"
          >
            <span className="whitespace-nowrap">{t("nav_request_quote")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="ml-auto flex shrink-0 items-center gap-2 md:hidden">
          {/* The text CTA is dropped below 380px so the brand, this button and
              the hamburger always fit inside a 360px viewport; the drawer below
              carries the full-width "Start a Project" equivalent. */}
          <button
            onClick={onOpenBriefWizard}
            className="hidden h-10 shrink-0 rounded-lg bg-eco-electric px-3 text-xs font-bold text-[#04121f] min-[380px]:inline-flex"
          >
            Get a Quote
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-eco-navy text-slate-200"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100dvh-4rem)] w-full max-w-full animate-in space-y-5 overflow-x-hidden overflow-y-auto border-t border-white/10 bg-eco-dark px-4 py-5 duration-200 slide-in-from-top-4 md:hidden">
          {/* Ecosystem switcher — on small screens the drawer is the menu, so
              the family directory lives here rather than in the header row. */}
          <div>
            <div className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              NDH Ecosystem
            </div>
            <FamilyMenu
              links={SITE_LINKS}
              cta={{ label: t("nav_request_quote"), href: "/contact" }}
            />
          </div>

          {/* User Status in Mobile */}
          {user ? (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-eco-navy p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-9 w-9 shrink-0 rounded-full border border-white/15 object-cover"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-white">{user.fullName}</div>
                    <div className="truncate font-mono text-[10px] text-eco-cyan">
                      {user.roleTitle}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleGoToUserWorkspace}
                  className="shrink-0 rounded-xl bg-eco-electric px-3 py-1.5 text-xs font-bold text-[#04121f]"
                >
                  Workspace
                </button>
              </div>

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full border-t border-white/10 pt-2 py-1.5 text-center text-xs font-medium text-red-400 hover:text-red-300"
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-eco-navy py-3 text-xs font-bold text-white"
            >
              <User className="h-4 w-4 text-eco-electric" />
              <span>Sign In / Register Account</span>
            </button>
          )}

          {/* Currency and Language Pickers for Mobile */}
          <div className="grid min-w-0 grid-cols-1 gap-3 min-[380px]:grid-cols-2">
            <div className="min-w-0">
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="w-full min-w-0 rounded-lg border border-white/10 bg-eco-navy p-2 text-xs font-bold text-white"
              >
                {(Object.keys(currencies) as SupportedCurrency[]).map((c) => (
                  <option key={c} value={c}>
                    {currencies[c]?.flag} {c} ({currencies[c]?.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full min-w-0 rounded-lg border border-white/10 bg-eco-navy p-2 text-xs font-bold text-white"
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
            <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectView(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  currentView === link.id
                    ? "bg-eco-electric/20 font-bold text-eco-electric"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
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
              className="w-full rounded-xl bg-gradient-to-r from-eco-electric to-eco-cyan py-3.5 text-center text-sm font-bold text-[#04121f] shadow-lg shadow-eco-electric/25"
            >
              Start a Project
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

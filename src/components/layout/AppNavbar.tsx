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

  // Desktop shows the four primary destinations; the rest live in the menu
  // drawer and footer so the bar never crowds or truncates.
  const primaryLinks = navLinks.filter((l) =>
    ["services", "case-study", "process", "talent-network"].includes(l.id),
  );

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-clip border-b border-white/[0.06] bg-eco-dark/95 font-sans backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full min-w-0 max-w-7xl items-center gap-3 px-4 sm:h-20 sm:px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => {
            onSelectView("homepage");
            setMobileMenuOpen(false);
          }}
          className="min-w-0 flex-1 text-left xl:flex-none"
          aria-label="NDH Agency home"
        >
          <BrandLogo size="sm" compactBadge className="min-w-0 sm:hidden" />
          <BrandLogo size="md" compactBadge className="hidden min-w-0 sm:flex" />
        </button>

        {/* Primary navigation */}
        <nav
          aria-label="Main"
          className="ml-10 hidden min-w-0 items-center gap-8 text-sm font-medium xl:flex"
        >
          {primaryLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectView(link.id);
                  setUserDropdownOpen(false);
                }}
                className={`whitespace-nowrap transition-colors ${
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right-hand tools */}
        <div className="ml-auto hidden shrink-0 items-center gap-4 md:flex">
          <FamilyMenu
            links={SITE_LINKS}
            cta={{ label: t("nav_request_quote"), href: "/contact" }}
          />

          {/* Combined language + currency */}
          <div className="relative">
            <button
              onClick={() => {
                setCurrencyDropdownOpen(!currencyDropdownOpen);
                setLangDropdownOpen(false);
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-white"
              aria-label="Language and currency"
              aria-expanded={currencyDropdownOpen}
            >
              <Globe className="h-4 w-4" />
              <span className="whitespace-nowrap uppercase" suppressHydrationWarning>
                {language} · {currency}
              </span>
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 z-50 mt-3 w-64 animate-in fade-in zoom-in-95 rounded-2xl border border-white/10 bg-eco-navy p-2 text-slate-200 shadow-2xl duration-150">
                <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Language
                </div>
                <div className="grid grid-cols-3 gap-1 p-1">
                  {(Object.keys(languages) as SupportedLanguage[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code)}
                      className={`rounded-lg px-2 py-1.5 text-xs font-semibold uppercase transition-colors ${
                        language === code
                          ? "bg-eco-electric/15 text-eco-electric"
                          : "text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
                <div className="mt-1 border-t border-white/10 px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Currency
                </div>
                <div className="space-y-0.5 p-1">
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
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                          isSelected
                            ? "bg-eco-electric/15 font-semibold text-eco-electric"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>
                          {c.symbol} {code} <span className="text-slate-500">· {c.name}</span>
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <span className="h-4 w-px bg-white/10" aria-hidden="true" />

          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setLangDropdownOpen(false);
                  setCurrencyDropdownOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-6 w-6 rounded-full border border-white/15 object-cover"
                />
                <span className="max-w-[100px] truncate">{user.fullName.split(" ")[0]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 z-50 mt-3 w-64 animate-in fade-in zoom-in-95 space-y-1 rounded-2xl border border-white/10 bg-eco-navy p-2 text-slate-200 shadow-2xl duration-150">
                  <div className="border-b border-white/10 px-3 py-2">
                    <div className="text-xs font-semibold text-white">{user.fullName}</div>
                    <div className="truncate text-[11px] text-slate-400">{user.email}</div>
                    <div className="mt-0.5 text-[11px] text-eco-cyan">{user.roleTitle}</div>
                  </div>
                  <button
                    onClick={handleGoToUserWorkspace}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-200 transition-colors hover:bg-white/5"
                  >
                    <UserCheck className="h-4 w-4 shrink-0 text-eco-electric" />
                    <span>Open my workspace</span>
                  </button>
                  {user.role === "client_owner" && (
                    <button
                      onClick={() => {
                        onSelectView("client-dashboard");
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-200 transition-colors hover:bg-white/5"
                    >
                      <Gift className="h-4 w-4 shrink-0 text-amber-400" />
                      <span>Referral credits (₦250k)</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border-t border-white/10 px-3 py-2 text-left text-xs font-medium text-red-400 transition-colors hover:bg-red-950/40"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="whitespace-nowrap text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Sign In
            </button>
          )}

          <button
            onClick={onOpenBriefWizard}
            className="whitespace-nowrap rounded-full bg-eco-electric px-5 py-2.5 text-sm font-bold text-eco-dark shadow-lg shadow-eco-electric/20 transition-all hover:brightness-110 active:scale-95"
          >
            Get Started
          </button>
        </div>

        {/* Menu button (below xl) */}
        <div className="flex shrink-0 items-center gap-2 xl:hidden max-md:ml-auto">
          <button
            onClick={onOpenBriefWizard}
            className="hidden h-10 shrink-0 items-center rounded-full bg-eco-electric px-4 text-xs font-bold text-eco-dark min-[380px]:inline-flex md:hidden"
          >
            Get Started
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-10 shrink-0 place-items-center rounded-full text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100dvh-4rem)] w-full max-w-full animate-in space-y-5 overflow-x-hidden overflow-y-auto border-t border-white/10 bg-eco-dark px-4 py-5 duration-200 slide-in-from-top-4 xl:hidden">
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

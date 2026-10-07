import React, { useEffect, useRef, useState } from "react";
import { MainNavView } from "./navViews";
import { BrandLogo } from "../brand/BrandLogo";
import { useAuth, openAuthModal } from "../../lib/authStore";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";
import { ArrowRight, Check, ChevronDown, LogOut, Menu, User, X } from "lucide-react";

/**
 * Which nav view each top-level header link maps to.
 *
 * AGENCY-ONLY SURFACE: the header (and the footer) carry agency destinations
 * only. Sibling and parent-gateway promotion was removed from the site
 * entirely — there is no cross-promo banner, no ecosystem switcher and no
 * family directory in either place.
 */
const PRIMARY_LINKS: { id: MainNavView; label: string }[] = [
  { id: "services", label: "Services" },
  { id: "case-study", label: "Case Studies" },
  { id: "process", label: "How It Works" },
  { id: "talent-network", label: "Talent Network" },
  { id: "insights", label: "Insights" },
  { id: "contact", label: "Contact" },
];

interface Props {
  currentView: MainNavView;
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

/**
 * Agency header — the Academy "Precision Gateway" chrome.
 *
 * A porcelain, hairline-bordered sticky bar (not a blanket dark band) that
 * carries the Open Gateway lockup on the left, the six agency destinations in
 * the middle, and region/session tools plus the "Start a Project" CTA on the
 * right. Currency and language preferences survive as small icon-buttons with
 * a shared dropdown, so the header stays uncluttered.
 */
export const AgencyHeader: React.FC<Props> = ({ currentView, onSelectView, onOpenBriefWizard }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currency, setCurrency, currencies, language, setLanguage, languages } =
    useCurrencyLanguage();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const prefsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const go = (view: MainNavView) => {
    onSelectView(view);
    setMobileOpen(false);
    setPrefsOpen(false);
    setUserOpen(false);
  };

  const goToWorkspace = () => {
    if (user?.role === "super_admin") go("admin-command");
    else if (user?.role === "project_manager") go("pm-dashboard");
    else if (user?.role === "talent") go("talent-dashboard");
    else go("client-dashboard");
  };

  // Dismiss the two header dropdowns on outside click / Escape.
  useEffect(() => {
    if (!prefsOpen && !userOpen) return;
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (prefsRef.current && !prefsRef.current.contains(t)) setPrefsOpen(false);
      if (userRef.current && !userRef.current.contains(t)) setUserOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPrefsOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [prefsOpen, userOpen]);

  return (
    <header className="border-border bg-surface/85 sticky top-0 z-50 w-full max-w-full overflow-x-clip border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full min-w-0 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand lockup — Open Gateway tile + agency sector badge */}
        <div className="min-w-0 shrink-0">
          <BrandLogo size="sm" asLink className="sm:hidden" />
          <BrandLogo size="md" asLink className="hidden sm:flex" />
        </div>

        {/* Desktop navigation — agency destinations only */}
        <nav
          className="mx-auto hidden min-w-0 items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {PRIMARY_LINKS.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                aria-current={isActive ? "page" : undefined}
                className={`text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive ? "text-foreground bg-accent/60 font-bold" : ""
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2">
          {/* Region preferences — currency + language in one compact dropdown */}
          <div className="relative hidden md:block" ref={prefsRef}>
            <button
              type="button"
              onClick={() => {
                setPrefsOpen((v) => !v);
                setUserOpen(false);
              }}
              aria-label="Currency and language preferences"
              aria-expanded={prefsOpen}
              className="border-border bg-surface text-foreground hover:border-primary/45 flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-colors"
            >
              <span className="text-sm leading-none">{currencies[currency]?.flag}</span>
              <span className="font-mono">{currency}</span>
              <span className="text-muted-foreground/60">·</span>
              <span className="uppercase">{language}</span>
              <ChevronDown
                className={`text-muted-foreground h-3.5 w-3.5 transition-transform ${prefsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {prefsOpen && (
              <div className="border-border bg-surface absolute right-0 z-50 mt-2 w-64 rounded-2xl border p-3 shadow-2xl">
                <div className="text-brand-soft mb-2 text-[10px] font-bold tracking-[0.14em] uppercase">
                  Currency
                </div>
                <div className="mb-3 max-h-44 space-y-0.5 overflow-y-auto">
                  {(Object.keys(currencies) as (keyof typeof currencies)[]).map((code) => {
                    const c = currencies[code]!;
                    const selected = currency === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setCurrency(code)}
                        className={`hover:bg-accent flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                          selected ? "bg-accent text-brand-soft font-bold" : "text-foreground/80"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </span>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {c.symbol} {code}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="border-border text-brand-soft border-t pt-3 pb-2 text-[10px] font-bold tracking-[0.14em] uppercase">
                  Language
                </div>
                <div className="space-y-0.5">
                  {(Object.keys(languages) as (keyof typeof languages)[]).map((code) => {
                    const l = languages[code]!;
                    const selected = language === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setLanguage(code)}
                        className={`hover:bg-accent flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                          selected ? "bg-accent text-brand-soft font-bold" : "text-foreground/80"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </span>
                        {selected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Session */}
          <div className="relative hidden md:block" ref={userRef}>
            {isAuthenticated && user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setUserOpen((v) => !v);
                    setPrefsOpen(false);
                  }}
                  aria-label="Account menu"
                  aria-expanded={userOpen}
                  className="border-border bg-surface hover:border-primary/45 flex items-center gap-2 rounded-xl border py-1 pr-2.5 pl-1 transition-colors"
                >
                  <img src={user.avatarUrl} alt="" className="h-7 w-7 rounded-lg object-cover" />
                  <span className="text-foreground max-w-[7rem] truncate text-xs font-bold">
                    {user.fullName}
                  </span>
                  <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
                </button>

                {userOpen && (
                  <div className="border-border bg-surface absolute right-0 z-50 mt-2 w-56 rounded-2xl border p-2 shadow-2xl">
                    <div className="border-border mb-1 border-b px-2.5 py-2">
                      <div className="text-foreground truncate text-xs font-bold">
                        {user.fullName}
                      </div>
                      <div className="text-brand-soft truncate font-mono text-[10px]">
                        {user.roleTitle}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={goToWorkspace}
                      className="hover:bg-accent text-foreground/85 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors"
                    >
                      <User className="h-3.5 w-3.5" />
                      My workspace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserOpen(false);
                      }}
                      className="hover:bg-accent flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg px-3 py-2 text-xs font-bold transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={onOpenBriefWizard}
            className="from-primary to-highlight hidden items-center gap-1.5 rounded-xl bg-gradient-to-r px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
          >
            Start a Project
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="border-border bg-surface text-foreground grid h-10 w-10 place-items-center rounded-xl border lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — same six agency destinations, nothing else */}
      {mobileOpen && (
        <div className="border-border bg-surface max-h-[calc(100dvh-4rem)] overflow-y-auto border-t lg:hidden">
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6">
            <nav className="space-y-1" aria-label="Mobile navigation">
              {PRIMARY_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => go(link.id)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                    currentView === link.id
                      ? "bg-accent text-brand-soft font-bold"
                      : "text-foreground/80 hover:bg-accent/60"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenBriefWizard();
              }}
              className="from-primary to-highlight w-full rounded-xl bg-gradient-to-r py-3.5 text-center text-sm font-extrabold text-white shadow-lg"
            >
              Start a Project
            </button>

            <div className="border-border grid grid-cols-2 gap-3 border-t pt-4">
              <label className="block min-w-0">
                <span className="text-muted-foreground mb-1 block text-[10px] font-bold uppercase">
                  Currency
                </span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as typeof currency)}
                  className="border-border bg-surface-raised text-foreground w-full min-w-0 rounded-lg border p-2 text-xs font-bold"
                >
                  {(Object.keys(currencies) as (keyof typeof currencies)[]).map((c) => (
                    <option key={c} value={c}>
                      {currencies[c]?.flag} {c} ({currencies[c]?.symbol})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block min-w-0">
                <span className="text-muted-foreground mb-1 block text-[10px] font-bold uppercase">
                  Language
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as typeof language)}
                  className="border-border bg-surface-raised text-foreground w-full min-w-0 rounded-lg border p-2 text-xs font-bold"
                >
                  {(Object.keys(languages) as (keyof typeof languages)[]).map((l) => (
                    <option key={l} value={l}>
                      {languages[l]?.flag} {languages[l]?.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {isAuthenticated && user ? (
              <div className="border-border bg-surface-raised flex items-center justify-between gap-3 rounded-2xl border p-3">
                <span className="min-w-0">
                  <span className="text-foreground block truncate text-xs font-bold">
                    {user.fullName}
                  </span>
                  <span className="text-brand-soft block truncate font-mono text-[10px]">
                    {user.roleTitle}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={goToWorkspace}
                  className="bg-primary shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold text-white"
                >
                  Workspace
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal("login");
                }}
                className="border-border bg-surface-raised text-foreground flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold"
              >
                <User className="text-brand-soft h-4 w-4" />
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

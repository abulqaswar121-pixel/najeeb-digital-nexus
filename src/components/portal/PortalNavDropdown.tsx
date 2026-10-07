import React, { useState, useRef, useEffect } from "react";
import { useAuth, logoutUser } from "../../lib/authStore";
import { ChevronDown, LogOut, User as UserIcon, Check } from "lucide-react";

export interface PortalNavTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | undefined;
}

interface PortalNavDropdownProps {
  tabs: PortalNavTab[];
  activeTab: string;
  onSelect: (id: string) => void;
}

// Shared in-portal navigation for Client / PM / Talent / Admin workspaces.
// Replaces the old per-portal horizontal tab strip AND the "<- Back to
// Agency Website" exit button with a single dropdown that lists every
// portal section plus account info and a real sign-out action (which
// previously didn't exist anywhere in the portal UI at all).
export const PortalNavDropdown: React.FC<PortalNavDropdownProps> = ({
  tabs,
  activeTab,
  onSelect,
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeTabInfo = tabs.find((t) => t.id === activeTab) || tabs[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await logoutUser();
    window.location.reload();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/12 hover:border-white/25 text-white text-xs font-bold transition-all"
      >
        {activeTabInfo?.icon}
        <span className="hidden sm:inline">{activeTabInfo?.label || "Menu"}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 mt-2 w-72 rounded-2xl bg-eco-navy border border-white/12 shadow-2xl overflow-hidden z-50">
          <div className="p-3 border-b border-white/10 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-eco-cyan/20 border border-eco-cyan/40 flex items-center justify-center text-eco-cyan shrink-0">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.fullName || "Signed In"}
              </div>
              <div className="text-[10px] text-[var(--eco-on-dark-muted)] truncate">
                {user?.roleTitle || user?.email || ""}
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto py-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onSelect(tab.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs text-left transition-colors ${
                  tab.id === activeTab
                    ? "bg-primary/20 text-white"
                    : "text-slate-200 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  {tab.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                      {tab.badge}
                    </span>
                  )}
                  {tab.id === activeTab && <Check className="w-3.5 h-3.5 text-eco-cyan" />}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 p-1.5">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

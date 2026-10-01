import React from "react";

// Shown briefly while a portal's lazy-loaded chunk downloads, or while the
// session check that usePortalGuard relies on is still resolving.
export const PortalLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 text-[#F1F5F9]"
  >
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600/30 border-t-blue-500" />
    <p className="text-sm text-slate-400">Loading portal…</p>
  </div>
);

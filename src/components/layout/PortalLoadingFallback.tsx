import React from "react";

// Shown briefly while a portal's lazy-loaded chunk downloads, or while the
// session check that usePortalGuard relies on is still resolving.
export const PortalLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="text-foreground flex min-h-[60vh] w-full flex-col items-center justify-center gap-4"
  >
    <div className="border-primary/25 border-t-primary h-10 w-10 animate-spin rounded-full border-4" />
    <p className="text-muted-foreground text-sm">Loading portal…</p>
  </div>
);

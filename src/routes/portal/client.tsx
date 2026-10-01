import { createFileRoute } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { AppShell, useAppShell } from "../../components/layout/AppShell";
import { usePortalGuard } from "../../lib/usePortalGuard";
import { PortalLoadingFallback } from "../../components/layout/PortalLoadingFallback";

// Lazy-loaded so the Client Portal's code (and everything it imports) ships
// in its own chunk, not in the main bundle every public visitor downloads.
const ClientPortal = React.lazy(() =>
  import("../../components/portal/ClientPortal").then((m) => ({ default: m.ClientPortal })),
);

export const Route = createFileRoute("/portal/client")({
  head: () => ({
    meta: [{ title: "Client Portal | NDH Agency" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AppShell currentView="client-dashboard">
      <ClientPortalContent />
    </AppShell>
  ),
});

function ClientPortalContent() {
  const { onOpenBriefWizard, onSelectView } = useAppShell();
  const { isSessionLoading } = usePortalGuard([
    "client_owner",
    "client_admin",
    "client_billing",
    "client_reviewer",
    "client_viewer",
  ]);

  if (isSessionLoading) return <PortalLoadingFallback />;

  return (
    <Suspense fallback={<PortalLoadingFallback />}>
      <ClientPortal
        onOpenBriefWizard={onOpenBriefWizard}
        onBackToAgency={() => onSelectView("homepage")}
      />
    </Suspense>
  );
}

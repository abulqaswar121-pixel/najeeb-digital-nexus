import { createFileRoute } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { AppShell, useAppShell } from "../../components/layout/AppShell";
import { usePortalGuard } from "../../lib/usePortalGuard";
import { PortalLoadingFallback } from "../../components/layout/PortalLoadingFallback";

const PMPortal = React.lazy(() =>
  import("../../components/portal/PMPortal").then((m) => ({ default: m.PMPortal })),
);

export const Route = createFileRoute("/portal/pm")({
  head: () => ({
    meta: [
      { title: "Project Manager Portal | NDH Agency" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell currentView="pm-dashboard">
      <PMPortalContent />
    </AppShell>
  ),
});

function PMPortalContent() {
  const { isSessionLoading } = usePortalGuard(["project_manager", "super_admin"]);

  if (isSessionLoading) return <PortalLoadingFallback />;

  return (
    <Suspense fallback={<PortalLoadingFallback />}>
      <PMPortal />
    </Suspense>
  );
}

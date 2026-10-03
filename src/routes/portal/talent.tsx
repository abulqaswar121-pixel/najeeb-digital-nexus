import { createFileRoute } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { AppShell, useAppShell } from "../../components/layout/AppShell";
import { usePortalGuard } from "../../lib/usePortalGuard";
import { PortalLoadingFallback } from "../../components/layout/PortalLoadingFallback";

const TalentPortal = React.lazy(() =>
  import("../../components/portal/TalentPortal").then((m) => ({ default: m.TalentPortal })),
);

export const Route = createFileRoute("/portal/talent")({
  head: () => ({
    meta: [{ title: "Talent Portal | NDH Agency" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AppShell currentView="talent-dashboard">
      <TalentPortalContent />
    </AppShell>
  ),
});

function TalentPortalContent() {
  const { onSelectView } = useAppShell();
  const { isSessionLoading } = usePortalGuard(["talent"]);

  if (isSessionLoading) return <PortalLoadingFallback />;

  return (
    <Suspense fallback={<PortalLoadingFallback />}>
      <TalentPortal onSwitchToPM={() => onSelectView("pm-dashboard")} />
    </Suspense>
  );
}

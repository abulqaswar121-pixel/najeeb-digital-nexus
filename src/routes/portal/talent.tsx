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
    links: [{ rel: "canonical", href: "https://agency.ndh.com.ng/portal/talent" }],
    meta: [
      { property: "og:url", content: "https://agency.ndh.com.ng/portal/talent" },
      { name: "description", content: "Private workspace for NDH Agency talent assignments." },
      { property: "og:title", content: "Talent Portal | NDH Agency" },
      {
        property: "og:description",
        content: "Private workspace for NDH Agency talent assignments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Talent Portal | NDH Agency" },
      { name: "robots", content: "noindex" },
    ],
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

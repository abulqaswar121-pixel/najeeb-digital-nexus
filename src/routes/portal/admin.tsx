import { createFileRoute } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { AppShell, useAppShell } from "../../components/layout/AppShell";
import { usePortalGuard } from "../../lib/usePortalGuard";
import { PortalLoadingFallback } from "../../components/layout/PortalLoadingFallback";

const AdminPortal = React.lazy(() =>
  import("../../components/portal/AdminPortal").then((m) => ({ default: m.AdminPortal })),
);

export const Route = createFileRoute("/portal/admin")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://agency.ndh.com.ng/portal/admin" }],
    meta: [
      { property: "og:url", content: "https://agency.ndh.com.ng/portal/admin" },
      { name: "description", content: "Private workspace for managing NDH Agency operations." },
      { property: "og:title", content: "Admin Command Center | NDH Agency" },
      {
        property: "og:description",
        content: "Private workspace for managing NDH Agency operations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Admin Command Center | NDH Agency" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell currentView="admin-command">
      <AdminPortalContent />
    </AppShell>
  ),
});

function AdminPortalContent() {
  const { isSessionLoading } = usePortalGuard([
    "super_admin",
    "ops_admin",
    "dept_lead",
    "finance_admin",
    "content_admin",
    "talent_admin",
    "support_admin",
  ]);

  if (isSessionLoading) return <PortalLoadingFallback />;

  return (
    <Suspense fallback={<PortalLoadingFallback />}>
      <AdminPortal />
    </Suspense>
  );
}

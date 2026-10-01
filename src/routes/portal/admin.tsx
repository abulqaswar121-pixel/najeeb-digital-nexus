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
    meta: [{ title: "Admin Command Center | NDH Agency" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AppShell currentView="admin-command">
      <AdminPortalContent />
    </AppShell>
  ),
});

function AdminPortalContent() {
  const { onSelectView } = useAppShell();
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
      <AdminPortal onBackToAgency={() => onSelectView("homepage")} />
    </Suspense>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { LegalView } from "../components/public/LegalView";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy | NDH Agency" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell currentView="refund-policy">
      <RefundContent />
    </AppShell>
  ),
});

function RefundContent() {
  const { onSelectView } = useAppShell();
  return <LegalView page="refund" onSelectView={onSelectView} />;
}

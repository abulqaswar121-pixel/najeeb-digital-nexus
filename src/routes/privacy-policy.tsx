import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { LegalView } from "../components/public/LegalView";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [{ title: "Privacy Policy | NDH Agency" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AppShell currentView="privacy-policy">
      <PrivacyContent />
    </AppShell>
  ),
});

function PrivacyContent() {
  const { onSelectView } = useAppShell();
  return <LegalView page="privacy" onSelectView={onSelectView} />;
}

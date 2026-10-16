import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { LegalView } from "../components/public/LegalView";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { name: "description", content: "Read the terms for using NDH Agency services." },
      { property: "og:title", content: "Terms of Service | NDH Agency" },
      { property: "og:description", content: "Read the terms for using NDH Agency services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Terms of Service | NDH Agency" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell currentView="terms-of-service">
      <TermsContent />
    </AppShell>
  ),
});

function TermsContent() {
  const { onSelectView } = useAppShell();
  return <LegalView page="terms" onSelectView={onSelectView} />;
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { LegalView } from "../components/public/LegalView";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Read how NDH Agency handles personal information and privacy.",
      },
      { property: "og:title", content: "Privacy Policy | NDH Agency" },
      {
        property: "og:description",
        content: "Read how NDH Agency handles personal information and privacy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Privacy Policy | NDH Agency" },
      { name: "robots", content: "noindex" },
    ],
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

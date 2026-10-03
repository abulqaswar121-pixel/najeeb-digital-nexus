import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { HomepagePreview } from "../components/directions/views/HomepagePreview";
import { MainNavView } from "../components/layout/AppNavbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NDH Agency | Digital Products, Brands & Growth Systems" },
      {
        name: "description",
        content:
          "NDH Agency builds premium software, brand systems, automation, and growth experiences for ambitious organizations.",
      },
      { property: "og:title", content: "NDH Agency | Digital Products, Brands & Growth Systems" },
      {
        property: "og:description",
        content:
          "Premium digital delivery with dedicated project leadership and vetted specialist teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell currentView="homepage">
      <HomepageContent />
    </AppShell>
  ),
});

function HomepageContent() {
  const { onOpenBriefWizard, onSelectView } = useAppShell();
  return (
    <HomepagePreview
      onOpenBriefWizard={onOpenBriefWizard}
      onSelectScreen={(s) => onSelectView(s as MainNavView)}
    />
  );
}

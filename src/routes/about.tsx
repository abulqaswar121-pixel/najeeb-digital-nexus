import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { AboutView } from "../components/public/AboutView";

export const Route = createFileRoute("/about")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://agency.ndh.com.ng/about" }],
    meta: [
      { property: "og:url", content: "https://agency.ndh.com.ng/about" },
      { property: "og:title", content: "About | NDH Agency" },
      {
        property: "og:description",
        content: "NDH Agency's mission, operating model, and the team behind it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "About | NDH Agency" },
      {
        name: "description",
        content: "NDH Agency's mission, operating model, and the team behind it.",
      },
    ],
  }),
  component: () => (
    <AppShell currentView="about">
      <AboutContent />
    </AppShell>
  ),
});

function AboutContent() {
  const { onOpenBriefWizard, onSelectView } = useAppShell();
  return <AboutView onSelectView={onSelectView} onOpenBriefWizard={onOpenBriefWizard} />;
}

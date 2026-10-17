import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { InsightsView } from "../components/public/InsightsView";

export const Route = createFileRoute("/insights")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://agency.ndh.com.ng/insights" }],
    meta: [
      { property: "og:url", content: "https://agency.ndh.com.ng/insights" },
      { property: "og:title", content: "Insights | NDH Agency" },
      {
        property: "og:description",
        content: "Engineering and growth insights from NDH Agency's delivery teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Insights | NDH Agency" },
      {
        name: "description",
        content: "Engineering and growth insights from NDH Agency's delivery teams.",
      },
    ],
  }),
  component: () => (
    <AppShell currentView="insights">
      <InsightsContent />
    </AppShell>
  ),
});

function InsightsContent() {
  const { onOpenBriefWizard, onSelectView } = useAppShell();
  return <InsightsView onSelectView={onSelectView} onOpenBriefWizard={onOpenBriefWizard} />;
}

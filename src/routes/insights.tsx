import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { InsightsView } from "../components/public/InsightsView";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
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

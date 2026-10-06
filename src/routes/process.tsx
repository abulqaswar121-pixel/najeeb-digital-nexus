import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { ProcessView } from "../components/public/ProcessView";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our Process | NDH Agency" },
      {
        name: "description",
        content: "How an engagement moves from brief to delivery at NDH Agency.",
      },
      { property: "og:title", content: "Our Process | NDH Agency" },
      {
        property: "og:description",
        content: "How an engagement moves from brief to delivery at NDH Agency.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell currentView="process">
      <ProcessContent />
    </AppShell>
  ),
});

function ProcessContent() {
  const { onOpenBriefWizard, onSelectView } = useAppShell();
  return <ProcessView onSelectView={onSelectView} onOpenBriefWizard={onOpenBriefWizard} />;
}

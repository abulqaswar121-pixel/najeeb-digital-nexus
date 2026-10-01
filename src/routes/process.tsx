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

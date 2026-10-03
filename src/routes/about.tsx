import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { AboutView } from "../components/public/AboutView";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
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

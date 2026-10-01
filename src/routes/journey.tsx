import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { InteractiveJourneyWalkthrough } from "../components/journey/InteractiveJourneyWalkthrough";
import { MainNavView } from "../components/layout/AppNavbar";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Interactive Journey Walkthrough | NDH Agency" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell currentView="journey">
      <JourneyContent />
    </AppShell>
  ),
});

function JourneyContent() {
  const { onSelectView } = useAppShell();
  return <InteractiveJourneyWalkthrough onNavigateScreen={(s) => onSelectView(s as MainNavView)} />;
}

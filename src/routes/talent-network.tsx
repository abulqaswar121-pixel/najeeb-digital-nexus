import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { TalentNetworkView } from "../components/public/TalentNetworkView";

export const Route = createFileRoute("/talent-network")({
  head: () => ({
    meta: [
      { title: "Talent Network | NDH Agency" },
      {
        name: "description",
        content: "The NDH Sovereign Talent Network -- tiers, vetting, and how to apply.",
      },
    ],
  }),
  component: () => (
    <AppShell currentView="talent-network">
      <TalentNetworkContent />
    </AppShell>
  ),
});

function TalentNetworkContent() {
  const { onOpenBriefWizard, onSelectView } = useAppShell();
  return <TalentNetworkView onSelectView={onSelectView} onOpenBriefWizard={onOpenBriefWizard} />;
}

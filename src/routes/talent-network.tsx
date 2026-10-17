import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { TalentNetworkView } from "../components/public/TalentNetworkView";

export const Route = createFileRoute("/talent-network")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://agency.ndh.com.ng/talent-network" }],
    meta: [
      { property: "og:url", content: "https://agency.ndh.com.ng/talent-network" },
      { property: "og:title", content: "Talent Network | NDH Agency" },
      {
        property: "og:description",
        content: "The NDH Sovereign Talent Network -- tiers, vetting, and how to apply.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

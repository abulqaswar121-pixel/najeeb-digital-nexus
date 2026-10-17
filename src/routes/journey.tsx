import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { InteractiveJourneyWalkthrough } from "../components/journey/InteractiveJourneyWalkthrough";
import { MainNavView } from "../components/layout/navViews";

export const Route = createFileRoute("/journey")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://agency.ndh.com.ng/journey" }],
    meta: [
      { property: "og:url", content: "https://agency.ndh.com.ng/journey" },
      {
        name: "description",
        content: "Explore how NDH Agency projects move from a brief to delivery.",
      },
      { property: "og:title", content: "Interactive Journey Walkthrough | NDH Agency" },
      {
        property: "og:description",
        content: "Explore how NDH Agency projects move from a brief to delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

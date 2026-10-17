import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { MobileSimulatorPreview } from "../components/directions/views/MobileSimulatorPreview";

export const Route = createFileRoute("/mobile-preview")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://agency.ndh.com.ng/mobile-preview" }],
    meta: [
      { property: "og:url", content: "https://agency.ndh.com.ng/mobile-preview" },
      { name: "description", content: "View a mobile project preview from NDH Agency." },
      { property: "og:title", content: "Mobile Preview | NDH Agency" },
      { property: "og:description", content: "View a mobile project preview from NDH Agency." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Mobile Preview | NDH Agency" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell currentView="mobile-view">
      <MobilePreviewContent />
    </AppShell>
  ),
});

function MobilePreviewContent() {
  const { onOpenBriefWizard } = useAppShell();
  return <MobileSimulatorPreview direction="direction-a" onOpenBriefWizard={onOpenBriefWizard} />;
}

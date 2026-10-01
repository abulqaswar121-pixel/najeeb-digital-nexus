import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { MobileSimulatorPreview } from "../components/directions/views/MobileSimulatorPreview";

export const Route = createFileRoute("/mobile-preview")({
  head: () => ({
    meta: [{ title: "Mobile Preview | NDH Agency" }, { name: "robots", content: "noindex" }],
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

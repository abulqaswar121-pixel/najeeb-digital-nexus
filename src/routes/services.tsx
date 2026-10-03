import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { ServicesPreview } from "../components/directions/views/ServicesPreview";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | NDH Agency" },
      {
        name: "description",
        content:
          "16 service departments spanning web & mobile development, brand strategy, AI automation, fintech, cloud/DevOps, and more -- with transparent regional pricing.",
      },
      { property: "og:title", content: "Services | NDH Agency" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => (
    <AppShell currentView="services">
      <ServicesContent />
    </AppShell>
  ),
});

function ServicesContent() {
  const { onOpenBriefWizard } = useAppShell();
  return <ServicesPreview onOpenBriefWizard={onOpenBriefWizard} />;
}

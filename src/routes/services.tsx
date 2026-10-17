import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { ServicesPreview } from "../components/directions/views/ServicesPreview";

export const Route = createFileRoute("/services")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://agency.ndh.com.ng/services" }],
    meta: [
      { property: "og:url", content: "https://agency.ndh.com.ng/services" },
      {
        property: "og:description",
        content:
          "16 service departments spanning web & mobile development, brand strategy, AI automation, fintech, cloud/DevOps, and more -- with transparent regional pricing.",
      },
      { name: "twitter:card", content: "summary_large_image" },
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

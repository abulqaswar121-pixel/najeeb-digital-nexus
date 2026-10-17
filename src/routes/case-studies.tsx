import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { CaseStudyPreview } from "../components/directions/views/CaseStudyPreview";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://agency.ndh.com.ng/case-studies" }],
    meta: [
      { property: "og:url", content: "https://agency.ndh.com.ng/case-studies" },
      { property: "og:title", content: "Case Studies | NDH Agency" },
      {
        property: "og:description",
        content:
          "Real, verifiable NDH client case studies across agriculture investment tech, curriculum development, education administration, and digital publishing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Case Studies | NDH Agency" },
      {
        name: "description",
        content:
          "Real, verifiable NDH client case studies across agriculture investment tech, curriculum development, education administration, and digital publishing.",
      },
    ],
  }),
  component: () => (
    <AppShell currentView="case-study">
      <CaseStudiesContent />
    </AppShell>
  ),
});

function CaseStudiesContent() {
  const { onOpenBriefWizard } = useAppShell();
  return <CaseStudyPreview onOpenBriefWizard={onOpenBriefWizard} />;
}

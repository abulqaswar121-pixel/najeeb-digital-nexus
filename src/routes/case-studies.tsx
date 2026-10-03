import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { CaseStudyPreview } from "../components/directions/views/CaseStudyPreview";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
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

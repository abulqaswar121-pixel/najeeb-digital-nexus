import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { CaseStudyPreview } from "../components/directions/views/CaseStudyPreview";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies | NDH Agency" },
      {
        name: "description",
        content: "Illustrative engagement case studies across fintech, logistics, and e-commerce.",
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

import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { ContactView } from "../components/public/ContactView";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | NDH Agency" },
      {
        name: "description",
        content: "Start a project or book a discovery consultation with NDH Agency.",
      },
    ],
  }),
  component: () => (
    <AppShell currentView="contact">
      <ContactContent />
    </AppShell>
  ),
});

function ContactContent() {
  const { onOpenBriefWizard, onSelectView } = useAppShell();
  return <ContactView onSelectView={onSelectView} onOpenBriefWizard={onOpenBriefWizard} />;
}

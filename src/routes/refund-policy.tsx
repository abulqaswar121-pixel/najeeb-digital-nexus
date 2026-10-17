import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAppShell } from "../components/layout/AppShell";
import { LegalView } from "../components/public/LegalView";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://agency.ndh.com.ng/refund-policy" }],
    meta: [
      { property: "og:url", content: "https://agency.ndh.com.ng/refund-policy" },
      { name: "description", content: "Read NDH Agency refund and cancellation terms." },
      { property: "og:title", content: "Refund & Cancellation Policy | NDH Agency" },
      { property: "og:description", content: "Read NDH Agency refund and cancellation terms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Refund & Cancellation Policy | NDH Agency" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AppShell currentView="refund-policy">
      <RefundContent />
    </AppShell>
  ),
});

function RefundContent() {
  const { onSelectView } = useAppShell();
  return <LegalView page="refund" onSelectView={onSelectView} />;
}

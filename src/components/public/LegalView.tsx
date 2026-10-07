import React from "react";
import { MainNavView } from "../layout/navViews";

interface LegalViewProps {
  page: "privacy" | "terms" | "refund";
  onSelectView: (view: MainNavView) => void;
}

const LAST_UPDATED = "October 1, 2026";

export const LegalView: React.FC<LegalViewProps> = ({ page, onSelectView }) => {
  return (
    <div className="min-h-screen font-sans">
      {/* Porcelain body — policy copy reads on the light canvas */}
      <div className="gw-page-body">
        <div className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-border bg-surface p-8 shadow-[0_4px_16px_rgba(16,27,64,0.07)] sm:p-10">
          {page === "privacy" && <PrivacyContent />}
          {page === "terms" && <TermsContent />}
          {page === "refund" && <RefundContent />}

          <div className="border-border text-muted-foreground border-t pt-6 text-xs">
            <button
              onClick={() => onSelectView("contact")}
              className="text-brand-soft font-bold hover:underline"
            >
              Questions about this policy? Contact us →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyContent: React.FC = () => (
  <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
    <header className="space-y-2">
      <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
      <p className="text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
    </header>

    <Section title="1. What we collect">
      When you submit the project brief wizard, the consultation request form, a talent application,
      or create an account, we collect the information you provide directly: name, email address,
      phone number (optional), organization name, and project details. We do not currently use
      analytics or advertising trackers.
    </Section>
    <Section title="2. How we use it">
      Information submitted through these forms is used to evaluate and respond to your request,
      assign a project manager, and communicate with you about your project. We do not sell personal
      data to third parties.
    </Section>
    <Section title="3. Payment information">
      Payment processing (currently a sandbox/demo integration) is handled by third-party payment
      gateways (e.g., Paystack). We do not store full card numbers on our own systems.
    </Section>
    <Section title="4. Data retention and your rights">
      You may request access to, correction of, or deletion of your personal data by contacting us
      through the Contact page. Depending on your jurisdiction (e.g., Nigeria's NDPR, EU/UK GDPR for
      applicable visitors), you may have additional statutory rights not yet enumerated in this
      draft.
    </Section>
    <Section title="5. Security">
      We take reasonable technical measures to protect submitted information. This current build is
      a client-side product preview without a dedicated backend; see our engineering audit
      documentation for the current state of our security architecture.
    </Section>
  </div>
);

const TermsContent: React.FC = () => (
  <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
    <header className="space-y-2">
      <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
      <p className="text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
    </header>

    <Section title="1. Services">
      NDH Agency provides software development, design, automation, and related digital services as
      scoped in an individually agreed statement of work or project brief.
    </Section>
    <Section title="2. Engagement process">
      Submitting a brief or consultation request does not itself create a binding contract. A
      project begins once both parties have agreed on scope, price, and timeline in a signed
      proposal or statement of work.
    </Section>
    <Section title="3. Payment and milestones">
      Projects are typically billed in milestones. Specific payment terms, currency, and schedule
      are defined per-engagement in the signed proposal, not by this general template.
    </Section>
    <Section title="4. Intellectual property">
      Unless otherwise agreed in writing, ownership of final deliverables transfers to the client
      upon full payment. NDH Agency retains the right to showcase non-confidential aspects of
      completed work for portfolio purposes unless an NDA states otherwise.
    </Section>
    <Section title="5. Limitation of liability">
      To the extent permitted by law, NDH Agency's liability for any claim arising from a project is
      limited to the amount paid for that specific engagement.
    </Section>
  </div>
);

const RefundContent: React.FC = () => (
  <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
    <header className="space-y-2">
      <h1 className="text-3xl font-extrabold text-white">Refund &amp; Cancellation Policy</h1>
      <p className="text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
    </header>

    <Section title="1. Milestone-based refunds">
      Because engagements are delivered in milestones, amounts paid for milestones not yet started
      are generally refundable; amounts paid for completed or in-progress milestone work are not,
      except as otherwise agreed in your signed proposal.
    </Section>
    <Section title="2. Cancellation">
      Either party may request to cancel an active engagement with written notice. Outstanding fees
      for work already delivered remain payable.
    </Section>
    <Section title="3. Disputes">
      If you believe a charge was made in error, contact us immediately through the Contact page so
      we can investigate before escalating to your payment provider.
    </Section>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-bold text-white">{title}</h2>
    <p>{children}</p>
  </section>
);

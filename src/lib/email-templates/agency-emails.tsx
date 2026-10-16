import * as React from "react";
import type { TemplateEntry } from "./registry.js";
import { CTA, Details, Divider, EmailLayout, P, SITE_URL } from "./layout.js";

const hi = (name?: string) => (name ? `Hi ${name.split(" ")[0]},` : "Hi there,");

// 1. Welcome after creating a client account
const Welcome = ({ name, organizationName }: { name?: string; organizationName?: string }) => (
  <EmailLayout preview="Your NDH Agency account is ready" title="Welcome to NDH Agency">
    <P>{hi(name)}</P>
    <P>
      Your client account{organizationName ? ` for ${organizationName}` : ""} is ready. From your
      dashboard you can send project briefs, follow progress, approve work and pay safely.
    </P>
    <CTA href={`${SITE_URL}/portal/client`}>Open my dashboard</CTA>
    <P>
      A project manager looks after every project, so you always have one clear point of contact.
    </P>
  </EmailLayout>
);

// 2. Project brief received (to client)
const BriefReceived = ({
  projectName,
  department,
  scopeTier,
  timelineWeeks,
}: Record<string, string | undefined>) => (
  <EmailLayout preview="We received your project brief" title="We got your project brief">
    <P>Hi there,</P>
    <P>
      Thank you for choosing NDH Agency. Your brief is with our team and a project manager will
      review it shortly.
    </P>
    <Details
      rows={[
        ["Project", projectName],
        ["Service", department],
        ["Plan", scopeTier],
        ["Timeline", timelineWeeks ? `${timelineWeeks} weeks` : undefined],
      ]}
    />
    <P>
      <strong>What happens next:</strong> a project manager checks your brief, then contacts you
      with a plan and a quote.
    </P>
    <CTA href={`${SITE_URL}/portal/client`}>Track my brief</CTA>
  </EmailLayout>
);

// 3. New brief alert (to the agency team)
const TeamBriefAlert = ({
  projectName,
  organizationName,
  clientEmail,
  department,
  budgetAmount,
  currency,
}: Record<string, string | undefined>) => (
  <EmailLayout preview={`New brief: ${projectName ?? "project"}`} title="New project brief">
    <P>A new brief has arrived and is waiting for a project manager.</P>
    <Details
      rows={[
        ["Project", projectName],
        ["Organization", organizationName],
        ["Client email", clientEmail],
        ["Service", department],
        ["Budget", budgetAmount ? `${budgetAmount} ${currency ?? ""}` : undefined],
      ]}
    />
    <CTA href={`${SITE_URL}/portal/pm`}>Review in PM portal</CTA>
  </EmailLayout>
);

// 4. Consultation request received
const ConsultationReceived = ({
  name,
  preferredDate,
  focusArea,
}: Record<string, string | undefined>) => (
  <EmailLayout preview="Your consultation request is in" title="Your consultation request is in">
    <P>{hi(name)}</P>
    <P>Thanks for reaching out. We will confirm a time with you soon.</P>
    <Details
      rows={[
        ["Preferred date", preferredDate],
        ["Topic", focusArea],
      ]}
    />
  </EmailLayout>
);

// 5. Talent application received
const TalentApplicationReceived = ({ name, department }: Record<string, string | undefined>) => (
  <EmailLayout preview="We received your talent application" title="Application received">
    <P>{hi(name)}</P>
    <P>
      Thank you for applying to join the NDH Talent Network{department ? ` as ${department}` : ""}.
      Our team reviews every application by hand.
    </P>
    <P>We will email you as soon as a decision is made.</P>
  </EmailLayout>
);

// 6. Talent approved
const TalentApproved = ({ name, email }: Record<string, string | undefined>) => (
  <EmailLayout
    preview="You're in — welcome to the NDH Talent Network"
    title="You're in! Welcome aboard"
  >
    <P>{hi(name)}</P>
    <P>
      Great news — your application was approved. You can now sign in to the talent portal
      {email ? ` with ${email}` : ""}.
    </P>
    <P>
      Your administrator will share your first-time password with you directly. Please change it
      after signing in.
    </P>
    <CTA href={`${SITE_URL}/portal/talent`}>Open talent portal</CTA>
  </EmailLayout>
);

// 7. Talent application not approved
const TalentNotApproved = ({ name, reason }: Record<string, string | undefined>) => (
  <EmailLayout preview="An update on your NDH application" title="An update on your application">
    <P>{hi(name)}</P>
    <P>
      Thank you for your interest in the NDH Talent Network. After careful review, we can't move
      forward with your application right now.
    </P>
    {reason ? <Details rows={[["Note from our team", reason]]} /> : null}
    <P>You are welcome to apply again later as your skills and portfolio grow.</P>
  </EmailLayout>
);

// 8. Payment receipt
const PaymentReceipt = ({
  name,
  amount,
  currency,
  reference,
  purpose,
  date,
}: Record<string, string | undefined>) => (
  <EmailLayout preview="Your NDH Agency payment receipt" title="Payment received — thank you">
    <P>{hi(name)}</P>
    <P>We have received your payment. Here are the details for your records.</P>
    <Details
      rows={[
        ["Amount", amount ? `${currency ?? ""} ${amount}` : undefined],
        ["For", purpose],
        ["Reference", reference],
        ["Date", date],
      ]}
    />
    <Divider />
    <CTA href={`${SITE_URL}/portal/client`}>View my payments</CTA>
  </EmailLayout>
);

export const welcomeTemplate = {
  component: Welcome,
  subject: "Welcome to NDH Agency",
  displayName: "Welcome (new client account)",
  previewData: { name: "Amina Bello", organizationName: "Bello Foods" },
} satisfies TemplateEntry;

export const briefReceivedTemplate = {
  component: BriefReceived,
  subject: (d: Record<string, unknown>) =>
    `We received your brief${d["projectName"] ? `: ${d["projectName"]}` : ""}`,
  displayName: "Project brief received",
  previewData: {
    projectName: "New company website",
    department: "Web & Mobile Apps",
    scopeTier: "growth",
    timelineWeeks: "6",
  },
} satisfies TemplateEntry;

export const teamBriefAlertTemplate = {
  component: TeamBriefAlert,
  subject: (d: Record<string, unknown>) => `New brief: ${d["projectName"] ?? "project"}`,
  displayName: "New brief alert (team)",
  to: "hello@ndh.com.ng",
  previewData: {
    projectName: "New company website",
    organizationName: "Bello Foods",
    clientEmail: "amina@example.com",
    department: "web_app_development",
    budgetAmount: "500000",
    currency: "NGN",
  },
} satisfies TemplateEntry;

export const consultationReceivedTemplate = {
  component: ConsultationReceived,
  subject: "Your consultation request is in",
  displayName: "Consultation request received",
  previewData: { name: "Amina Bello", preferredDate: "2026-10-20", focusArea: "Online store" },
} satisfies TemplateEntry;

export const talentApplicationReceivedTemplate = {
  component: TalentApplicationReceived,
  subject: "We received your NDH talent application",
  displayName: "Talent application received",
  previewData: { name: "Yusuf Ade", department: "UI/UX designer" },
} satisfies TemplateEntry;

export const talentApprovedTemplate = {
  component: TalentApproved,
  subject: "You're in — welcome to the NDH Talent Network",
  displayName: "Talent application approved",
  previewData: { name: "Yusuf Ade", email: "yusuf@example.com" },
} satisfies TemplateEntry;

export const talentNotApprovedTemplate = {
  component: TalentNotApproved,
  subject: "An update on your NDH application",
  displayName: "Talent application not approved",
  previewData: { name: "Yusuf Ade", reason: "We need a few more finished portfolio pieces." },
} satisfies TemplateEntry;

export const paymentReceiptTemplate = {
  component: PaymentReceipt,
  subject: "Your NDH Agency payment receipt",
  displayName: "Payment receipt",
  previewData: {
    name: "Amina Bello",
    amount: "250,000",
    currency: "NGN",
    reference: "NDH-8F2K1",
    purpose: "Milestone 1 payment",
    date: "16 Oct 2026",
  },
} satisfies TemplateEntry;

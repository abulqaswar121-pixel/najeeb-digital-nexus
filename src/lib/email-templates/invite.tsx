import * as React from "react";
import { Link } from "@react-email/components";
import { CTA, Code, EmailLayout, Note, P, brand } from "./layout.js";

interface InviteEmailProps {
  siteName: string;
  siteUrl: string;
  confirmationUrl: string;
}

export const InviteEmail = ({ siteName, confirmationUrl }: InviteEmailProps) => (
  <EmailLayout preview={`You've been invited to join ${siteName}`} title="You've been invited">
    <P>
      You've been invited to join {siteName}. Press the button below to accept and set up your
      account.
    </P>
    <CTA href={confirmationUrl}>Accept invitation</CTA>
    <Note>If you weren't expecting this invitation, you can safely ignore this email.</Note>
  </EmailLayout>
);

export default InviteEmail;

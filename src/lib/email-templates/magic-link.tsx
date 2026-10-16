import * as React from "react";
import { Link } from "@react-email/components";
import { CTA, Code, EmailLayout, Note, P, brand } from "./layout.js";

interface MagicLinkEmailProps {
  siteName: string;
  confirmationUrl: string;
}

export const MagicLinkEmail = ({ siteName, confirmationUrl }: MagicLinkEmailProps) => (
  <EmailLayout preview={`Your sign-in link for ${siteName}`} title="Your sign-in link">
    <P>Press the button below to sign in to {siteName}. This link expires soon.</P>
    <CTA href={confirmationUrl}>Sign in</CTA>
    <Note>If you didn't ask for this link, you can safely ignore this email.</Note>
  </EmailLayout>
);

export default MagicLinkEmail;

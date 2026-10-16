import * as React from "react";
import { Link } from "@react-email/components";
import { CTA, Code, EmailLayout, Note, P, brand } from "./layout.js";

interface SignupEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
}

export const SignupEmail = ({ siteName, recipient, confirmationUrl }: SignupEmailProps) => (
  <EmailLayout preview={`Confirm your email for ${siteName}`} title="Confirm your email">
    <P>
      Thanks for joining {siteName}! Please confirm that{" "}
      <Link href={`mailto:${recipient}`} style={{ color: brand.primary }}>
        {recipient}
      </Link>{" "}
      is your email address.
    </P>
    <CTA href={confirmationUrl}>Confirm my email</CTA>
    <Note>If you didn't create an account, you can safely ignore this email.</Note>
  </EmailLayout>
);

export default SignupEmail;

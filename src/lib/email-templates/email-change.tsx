import * as React from "react";
import { Link } from "@react-email/components";
import { CTA, Code, EmailLayout, Note, P, brand } from "./layout.js";

interface EmailChangeEmailProps {
  siteName: string;
  oldEmail: string;
  newEmail: string;
  confirmationUrl: string;
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <EmailLayout preview={`Confirm your email change for ${siteName}`} title="Confirm your new email">
    <P>
      You asked to change your {siteName} email from{" "}
      <Link href={`mailto:${oldEmail}`} style={{ color: brand.primary }}>
        {oldEmail}
      </Link>{" "}
      to{" "}
      <Link href={`mailto:${newEmail}`} style={{ color: brand.primary }}>
        {newEmail}
      </Link>
      .
    </P>
    <CTA href={confirmationUrl}>Confirm change</CTA>
    <Note>If you didn't ask for this change, please secure your account right away.</Note>
  </EmailLayout>
);

export default EmailChangeEmail;

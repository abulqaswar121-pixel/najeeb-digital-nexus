import * as React from "react";
import { Link } from "@react-email/components";
import { CTA, Code, EmailLayout, Note, P, brand } from "./layout.js";

interface RecoveryEmailProps {
  siteName: string;
  confirmationUrl: string;
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <EmailLayout preview={`Reset your password for ${siteName}`} title="Reset your password">
    <P>
      We got a request to reset your {siteName} password. Press the button below to choose a new
      one.
    </P>
    <CTA href={confirmationUrl}>Choose a new password</CTA>
    <Note>If you didn't ask for this, ignore this email. Your password will stay the same.</Note>
  </EmailLayout>
);

export default RecoveryEmail;

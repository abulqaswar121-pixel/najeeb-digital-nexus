import * as React from "react";
import { Link } from "@react-email/components";
import { CTA, Code, EmailLayout, Note, P, brand } from "./layout.js";

interface ReauthenticationEmailProps {
  token: string;
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <EmailLayout preview="Your NDH Agency security code" title="Your security code">
    <P>Use this code to confirm it's you:</P>
    <Code>{token}</Code>
    <Note>This code expires soon. If you didn't ask for it, you can safely ignore this email.</Note>
  </EmailLayout>
);

export default ReauthenticationEmail;

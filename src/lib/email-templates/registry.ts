/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from "react";
import {
  welcomeTemplate,
  briefReceivedTemplate,
  teamBriefAlertTemplate,
  consultationReceivedTemplate,
  talentApplicationReceivedTemplate,
  talentApprovedTemplate,
  talentNotApprovedTemplate,
  paymentReceiptTemplate,
} from "./agency-emails.js";

export interface TemplateEntry {
  component: ComponentType<any>;
  subject: string | ((data: Record<string, any>) => string);
  displayName?: string;
  previewData?: Record<string, any>;
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string;
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  welcome: welcomeTemplate,
  "brief-received": briefReceivedTemplate,
  "team-brief-alert": teamBriefAlertTemplate,
  "consultation-received": consultationReceivedTemplate,
  "talent-application-received": talentApplicationReceivedTemplate,
  "talent-approved": talentApprovedTemplate,
  "talent-not-approved": talentNotApprovedTemplate,
  "payment-receipt": paymentReceiptTemplate,
};

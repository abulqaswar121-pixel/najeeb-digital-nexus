import { sendTemplateEmail } from './send-email'

// Server-only. Sends an app email but never lets an email problem break the
// main action (sign-up, brief, payment). Skips quietly when email is not
// configured (local dev, tests).
export async function notify(
  template: string,
  to: string,
  idempotencyKey: string,
  templateData: Record<string, unknown> = {},
): Promise<void> {
  if (!process.env['LOVABLE_API_KEY'] || process.env['VITEST']) return
  try {
    await sendTemplateEmail(template, to, { templateData, idempotencyKey })
  } catch (error) {
    console.error('[email] send failed', template, error)
  }
}

import crypto from "node:crypto";
import { env } from "./env.js";

export interface PaystackVerifyResult {
  verified: boolean;
  sandbox: boolean;
  status?: "success" | "failed" | "abandoned" | "pending";
  amountKobo?: number;
  currency?: string;
  reference?: string;
  error?: string;
}

/**
 * Verifies a Paystack transaction reference against Paystack's own API using
 * the SECRET key (server-only, never exposed to the client). This is the
 * actual fix for the previously-fake payment flow, which recorded "success"
 * transactions purely from client-supplied data with zero gateway
 * verification.
 *
 * If PAYSTACK_SECRET_KEY is not configured, this degrades to an explicit
 * "sandbox" result rather than silently pretending to verify -- callers must
 * check `sandbox` and label the resulting transaction accordingly.
 */
export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerifyResult> {
  if (!env.PAYSTACK_SECRET_KEY) {
    return { verified: false, sandbox: true, reference };
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
      },
    );

    const body = (await response.json()) as {
      status: boolean;
      data?: { status: string; amount: number; currency: string; reference: string };
      message?: string;
    };

    if (!response.ok || !body.status || !body.data) {
      return {
        verified: false,
        sandbox: false,
        reference,
        error: body.message || `Paystack verify request failed (${response.status})`,
      };
    }

    return {
      verified: body.data.status === "success",
      sandbox: false,
      status: body.data.status as PaystackVerifyResult["status"],
      amountKobo: body.data.amount,
      currency: body.data.currency,
      reference: body.data.reference,
    };
  } catch (error) {
    return {
      verified: false,
      sandbox: false,
      reference,
      error: error instanceof Error ? error.message : "Network error contacting Paystack",
    };
  }
}

/**
 * Validates the `x-paystack-signature` header on incoming webhook requests.
 * Paystack signs the raw request body with HMAC-SHA512 using your secret
 * key; this must be checked before trusting ANY webhook payload (otherwise
 * anyone can POST a fake "charge.success" event to mark a transaction paid).
 */
export function verifyPaystackWebhookSignature(rawBody: Buffer, signatureHeader?: string): boolean {
  if (!env.PAYSTACK_SECRET_KEY || !signatureHeader) return false;
  const expected = crypto
    .createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  return expected === signatureHeader;
}

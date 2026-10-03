import { Router } from "express";
import { requireAuth } from "../auth.js";
import { transactions, type TransactionRecord } from "../collections.js";
import { verifyPaystackTransaction, verifyPaystackWebhookSignature } from "../paystack.js";

export const paymentsRouter = Router();

// Called by the client after the Paystack Inline popup reports a completed
// charge. This is the fix for the previous flow, which recorded a "success"
// transaction purely because the client said so, with zero server-side
// verification against the actual gateway.
paymentsRouter.post("/verify", requireAuth, async (req, res) => {
  const body = req.body as {
    reference?: string;
    gateway?: "paystack" | "flutterwave" | "stripe";
    amount?: number;
    currency?: string;
    customerEmail?: string;
    customerName?: string;
    purpose?: string;
  };

  if (!body.reference || !body.amount || !body.customerEmail) {
    res.status(400).json({ error: "reference, amount, and customerEmail are required." });
    return;
  }

  const gateway = body.gateway || "paystack";
  let status: TransactionRecord["status"] = "success";
  let verifiedByGateway = false;

  if (gateway === "paystack") {
    const result = await verifyPaystackTransaction(body.reference);
    if (result.sandbox) {
      // No PAYSTACK_SECRET_KEY configured yet -- be honest that this was
      // never actually checked against Paystack, rather than silently
      // pretending it was verified.
      verifiedByGateway = false;
      status = "success"; // sandbox walkthroughs still "succeed" for demo purposes
    } else if (result.verified) {
      verifiedByGateway = true;
      status = "success";
    } else {
      verifiedByGateway = true; // we DID check, and it failed
      status = "failed";
    }
  }

  const tx: TransactionRecord = {
    id: `tx-${Date.now()}`,
    reference: body.reference,
    gateway,
    amount: body.amount,
    currency: body.currency || "NGN",
    customerEmail: body.customerEmail,
    customerName: body.customerName || "",
    purpose: body.purpose || "NDH Agency Milestone Payment",
    status,
    channel: "card",
    timestamp: new Date().toISOString(),
    verifiedByGateway,
    createdByUserId: req.ndhUser!.id,
  };

  transactions.insert(tx);
  res.status(status === "success" ? 201 : 402).json({ transaction: tx });
});

// Paystack webhook receiver. Requires the raw request body (mounted with
// express.raw() in server/index.ts) so the HMAC signature can be verified
// before trusting the payload. This has been written to the correct spec but
// NOT exercised against a live Paystack webhook in this sandbox -- it needs
// a public HTTPS URL registered in the Paystack dashboard once deployed.
paymentsRouter.post("/webhook", (req, res) => {
  const signature = req.headers["x-paystack-signature"] as string | undefined;
  const rawBody = req.body as Buffer;

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    res.status(401).json({ error: "Invalid webhook signature." });
    return;
  }

  let event: { event?: string; data?: { reference?: string; status?: string } };
  try {
    event = JSON.parse(rawBody.toString("utf-8"));
  } catch {
    res.status(400).json({ error: "Invalid JSON body." });
    return;
  }

  if (event.event === "charge.success" && event.data?.reference) {
    transactions.update(
      (t) => t.reference === event.data?.reference,
      (t) => ({ ...t, status: "success", verifiedByGateway: true }),
    );
  }

  res.status(200).json({ received: true });
});

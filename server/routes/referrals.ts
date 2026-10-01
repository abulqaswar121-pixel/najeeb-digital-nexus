import { Router } from "express";
import { requireAuth, requireRole } from "../auth.js";
import { referrals } from "../collections.js";
import type { ClientReferralRecord } from "../../src/types/ndh.js";

export const referralsRouter = Router();

referralsRouter.get("/", requireRole("super_admin"), (_req, res) => {
  res.json({ referrals: referrals.all() });
});

referralsRouter.get("/mine", requireAuth, (req, res) => {
  res.json({ referrals: referrals.filter((r) => r.referrerUserId === req.ndhUser!.id) });
});

referralsRouter.post("/", requireAuth, (req, res) => {
  const body = req.body as Omit<
    ClientReferralRecord,
    "id" | "registeredAt" | "status" | "cashbackEarnedNGN" | "cashbackEarnedUSD"
  >;

  const record: ClientReferralRecord = {
    ...body,
    id: `ref-${Date.now()}`,
    registeredAt: new Date().toISOString().split("T")[0] || "",
    status: "pending_payment",
    cashbackEarnedNGN: 0,
    cashbackEarnedUSD: 0,
  };

  referrals.insert(record);
  res.status(201).json({ referral: record });
});

// Strict referral validation: discount/cashback is only unlocked when the
// referred client's project is actually funded -- enforced here server-side,
// not just as client-side UI copy.
referralsRouter.post("/:id/fund", requireRole("super_admin", "finance_admin"), (req, res) => {
  const { id } = req.params;
  const { paidAmountNGN, paidAmountUSD } = req.body as {
    paidAmountNGN?: number;
    paidAmountUSD?: number;
  };

  const updated = referrals.update(
    (r) => r.id === id,
    (r) => ({
      ...r,
      status: "milestone_funded",
      fundedAmountNGN: paidAmountNGN ?? 0,
      fundedAmountUSD: paidAmountUSD ?? 0,
      cashbackEarnedNGN: Math.round((paidAmountNGN ?? 0) * 0.1),
      cashbackEarnedUSD: Math.round((paidAmountUSD ?? 0) * 0.1),
      fundedAt: new Date().toISOString().split("T")[0] || "",
    }),
  );

  if (!updated) {
    res.status(404).json({ error: "Referral not found." });
    return;
  }
  res.json({ referral: updated });
});

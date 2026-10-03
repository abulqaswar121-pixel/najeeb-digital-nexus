import { Router } from "express";
import { requireRole } from "../auth.js";
import { payoutBatches } from "../collections.js";

export const payoutsRouter = Router();

const APPROVER_ROLES = ["super_admin", "finance_admin"] as const;

payoutsRouter.get("/", requireRole(...APPROVER_ROLES), (_req, res) => {
  res.json({ payoutBatches: payoutBatches.all() });
});

// Real maker-checker: signing requires an authenticated finance/admin user,
// and a SECOND signature must come from a DIFFERENT user id than the first.
// Previously this was `const [dualApprovalStep, setDualApprovalStep] =
// useState(1)` -- a single logged-in user clicking a button twice in one
// session. That is no longer possible: the server rejects a second signature
// from the same user id.
payoutsRouter.post("/:id/sign", requireRole(...APPROVER_ROLES), (req, res) => {
  const { id } = req.params;
  const user = req.ndhUser!;
  const batch = payoutBatches.find((b) => b.id === id);

  if (!batch) {
    res.status(404).json({ error: "Payout batch not found." });
    return;
  }
  if (batch.disbursed) {
    res.status(409).json({ error: "This batch has already been disbursed." });
    return;
  }
  if (batch.approvals.some((a) => a.userId === user.id)) {
    res.status(409).json({
      error:
        "You have already signed this batch. A second, different authorized signer is required to execute disbursement.",
    });
    return;
  }

  const updated = payoutBatches.update(
    (b) => b.id === id,
    (b) => ({
      ...b,
      approvals: [
        ...b.approvals,
        {
          userId: user.id,
          userName: user.fullName,
          role: user.role,
          signedAt: new Date().toISOString(),
        },
      ],
    }),
  );

  res.json({ payoutBatch: updated });
});

payoutsRouter.post("/:id/disburse", requireRole(...APPROVER_ROLES), (req, res) => {
  const { id } = req.params;
  const batch = payoutBatches.find((b) => b.id === id);

  if (!batch) {
    res.status(404).json({ error: "Payout batch not found." });
    return;
  }
  if (batch.disbursed) {
    res.status(409).json({ error: "This batch has already been disbursed." });
    return;
  }

  const distinctSigners = new Set(batch.approvals.map((a) => a.userId));
  if (distinctSigners.size < 2) {
    res.status(409).json({
      error: `Disbursement requires 2 distinct authorized signatures; this batch has ${distinctSigners.size}.`,
    });
    return;
  }

  const updated = payoutBatches.update(
    (b) => b.id === id,
    (b) => ({ ...b, disbursed: true, disbursedAt: new Date().toISOString() }),
  );

  res.json({ payoutBatch: updated });
});

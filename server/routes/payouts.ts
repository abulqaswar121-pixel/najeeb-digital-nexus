import { Router } from "../http.js";
import { requireRole } from "../auth.js";
import { payoutBatches, bankTransfers, type BankTransferRecord } from "../collections.js";
import { listNigerianBanks, resolveBankAccount, sendBankTransfer } from "../paystack.js";

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

// ---------------------------------------------------------------------------
// Real Paystack bank transfers to PMs and talents.
// One admin requests (account name is checked with the bank), a DIFFERENT
// admin approves, and only then is the money sent from the Paystack balance.
// ---------------------------------------------------------------------------

payoutsRouter.get("/banks", requireRole(...APPROVER_ROLES), async (_req, res) => {
  try {
    res.json({ banks: await listNigerianBanks() });
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : "Could not load banks." });
  }
});

payoutsRouter.get("/transfers", requireRole(...APPROVER_ROLES), (_req, res) => {
  res.json({ transfers: bankTransfers.all() });
});

payoutsRouter.post("/transfers", requireRole(...APPROVER_ROLES), async (req, res) => {
  const body = req.body as {
    recipientName?: string;
    accountNumber?: string;
    bankCode?: string;
    bankName?: string;
    amountNGN?: number;
    reason?: string;
  };
  const amount = Number(body.amountNGN);
  if (!body.recipientName || !body.bankCode || !/^\d{10}$/.test(body.accountNumber || "")) {
    res.status(400).json({ error: "Name, bank and a 10-digit account number are required." });
    return;
  }
  if (!Number.isFinite(amount) || amount < 100) {
    res.status(400).json({ error: "Amount must be at least ₦100." });
    return;
  }
  let accountName: string;
  try {
    accountName = (await resolveBankAccount(body.accountNumber!, body.bankCode)).account_name;
  } catch (error) {
    res.status(400).json({
      error: `Could not confirm this bank account: ${error instanceof Error ? error.message : "unknown error"}`,
    });
    return;
  }
  const user = req.ndhUser!;
  const record: BankTransferRecord = {
    id: `trf-${Date.now()}`,
    reference: `ndh-payout-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    recipientName: body.recipientName,
    accountName,
    accountNumber: body.accountNumber!,
    bankCode: body.bankCode,
    bankName: body.bankName || "",
    amountNGN: Math.round(amount),
    reason: body.reason || "NDH Agency payout",
    requestedByUserId: user.id,
    requestedByName: user.fullName,
    requestedAt: new Date().toISOString(),
    status: "awaiting_approval",
  };
  bankTransfers.insert(record);
  res.status(201).json({ transfer: record });
});

payoutsRouter.post("/transfers/:id/approve", requireRole(...APPROVER_ROLES), async (req, res) => {
  const user = req.ndhUser!;
  const t = bankTransfers.find((x) => x.id === req.params["id"]);
  if (!t) {
    res.status(404).json({ error: "Transfer not found." });
    return;
  }
  if (t.status !== "awaiting_approval") {
    res.status(409).json({ error: "This transfer has already been handled." });
    return;
  }
  if (t.requestedByUserId === user.id) {
    res.status(409).json({ error: "A different admin must approve a transfer you requested." });
    return;
  }
  const approved = {
    approvedByUserId: user.id,
    approvedByName: user.fullName,
    approvedAt: new Date().toISOString(),
  };
  try {
    const result = await sendBankTransfer({
      name: t.accountName,
      accountNumber: t.accountNumber,
      bankCode: t.bankCode,
      amountKobo: t.amountNGN * 100,
      reason: t.reason,
      reference: t.reference,
    });
    const status: BankTransferRecord["status"] =
      result.status === "success" ? "success" : result.status === "otp" ? "otp_required" : "processing";
    const updated = bankTransfers.update(
      (x) => x.id === t.id,
      (x) => ({ ...x, ...approved, status, transferCode: result.transfer_code }),
    );
    res.json({ transfer: updated });
  } catch (error) {
    const updated = bankTransfers.update(
      (x) => x.id === t.id,
      (x) => ({
        ...x,
        ...approved,
        status: "failed",
        error: error instanceof Error ? error.message : "Transfer failed.",
      }),
    );
    res.status(502).json({ error: updated?.error, transfer: updated });
  }
});

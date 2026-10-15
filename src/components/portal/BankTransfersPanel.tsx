import React, { useEffect, useState } from "react";
import { dbService, type BankTransfer } from "../../lib/databaseStore";

const STATUS_LABEL: Record<BankTransfer["status"], string> = {
  awaiting_approval: "Waiting for 2nd admin",
  processing: "Sending",
  success: "Paid",
  failed: "Failed",
  otp_required: "Needs OTP (turn off OTP in Paystack)",
};

/** Real Paystack bank transfers to PMs and talents (two different admins required). */
export function BankTransfersPanel({ currentUserId }: { currentUserId?: string | undefined }) {
  const [banks, setBanks] = useState<{ name: string; code: string }[]>([]);
  const [transfers, setTransfers] = useState<BankTransfer[]>([]);
  const [form, setForm] = useState({
    recipientName: "",
    accountNumber: "",
    bankCode: "",
    amountNGN: "",
    reason: "NDH Agency payout",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = () =>
    dbService
      .listBankTransfers()
      .then(setTransfers)
      .catch(() => {});

  useEffect(() => {
    dbService
      .listBanks()
      .then(setBanks)
      .catch(() => setMessage("Could not load the bank list from Paystack."));
    refresh();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const bank = banks.find((b) => b.code === form.bankCode);
      const t = await dbService.requestBankTransfer({
        ...form,
        bankName: bank?.name || "",
        amountNGN: Number(form.amountNGN),
      });
      setMessage(`Account confirmed: ${t.accountName}. A second admin must now approve it.`);
      setForm({ ...form, recipientName: "", accountNumber: "", amountNGN: "" });
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not create the transfer.");
    } finally {
      setBusy(false);
    }
  };

  const approve = async (id: string) => {
    setMessage(null);
    try {
      await dbService.approveBankTransfer(id);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Transfer failed.");
    }
    refresh();
  };

  const input = "w-full rounded-xl bg-eco-dark border border-white/10 px-3 py-2 text-xs text-white";

  return (
    <div className="p-5 rounded-2xl bg-white/[0.04] border border-eco-cyan/20 space-y-4 text-xs">
      <div>
        <div className="font-bold text-white text-sm">
          Pay a PM or talent (Paystack bank transfer)
        </div>
        <p className="text-[var(--eco-on-dark-muted)] text-[11px] mt-1">
          Money is sent from your Paystack balance. One admin creates the payment, a different admin
          approves it.
        </p>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className={input}
          placeholder="Person's name"
          value={form.recipientName}
          onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
          required
        />
        <select
          className={input}
          value={form.bankCode}
          onChange={(e) => setForm({ ...form, bankCode: e.target.value })}
          required
        >
          <option value="">Choose bank</option>
          {banks.map((b) => (
            <option key={`${b.code}-${b.name}`} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>
        <input
          className={input}
          placeholder="10-digit account number"
          inputMode="numeric"
          maxLength={10}
          value={form.accountNumber}
          onChange={(e) => setForm({ ...form, accountNumber: e.target.value.replace(/\D/g, "") })}
          required
        />
        <input
          className={input}
          placeholder="Amount (₦)"
          inputMode="numeric"
          value={form.amountNGN}
          onChange={(e) => setForm({ ...form, amountNGN: e.target.value.replace(/\D/g, "") })}
          required
        />
        <input
          className={`${input} sm:col-span-2`}
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        <button
          type="submit"
          disabled={busy}
          className="sm:col-span-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold disabled:opacity-60"
        >
          {busy ? "Checking account…" : "Check account & create payment"}
        </button>
      </form>
      {message && <p className="text-eco-cyan text-[11px]">{message}</p>}

      <div className="space-y-2">
        {transfers.length === 0 && (
          <p className="text-[var(--eco-on-dark-muted)]">No bank payments yet.</p>
        )}
        {transfers.map((t) => (
          <div
            key={t.id}
            className="p-3 rounded-xl bg-eco-dark border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <div className="text-white font-bold">
                ₦{t.amountNGN.toLocaleString()} → {t.accountName}
              </div>
              <div className="text-[var(--eco-on-dark-muted)] text-[11px] break-words">
                {t.bankName} • {t.accountNumber} • {t.reason} • by {t.requestedByName}
                {t.approvedByName ? `, approved by ${t.approvedByName}` : ""}
              </div>
              {t.error && <div className="text-red-400 text-[11px]">{t.error}</div>}
            </div>
            {t.status === "awaiting_approval" && t.requestedByUserId !== currentUserId ? (
              <button
                onClick={() => approve(t.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold shrink-0"
              >
                Approve & send
              </button>
            ) : (
              <span className="font-mono text-[11px] text-eco-cyan shrink-0">
                {STATUS_LABEL[t.status]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

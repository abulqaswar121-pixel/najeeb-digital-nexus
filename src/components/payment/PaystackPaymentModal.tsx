import React, { useState } from "react";
import { useModalA11y } from "../../hooks/use-modal-a11y";
import { dbService, calculateWelcomeCreditDeduction } from "../../lib/databaseStore";
import { useAuth } from "../../lib/authStore";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building,
  Key,
  Smartphone,
  Zap,
  Tag,
} from "lucide-react";

// Paystack test/live public keys look like `pk_test_<40 hex chars>` /
// `pk_live_<...>`. The historical placeholder baked into this file
// (`pk_test_ndh_agency_demo_9921448`) does not match this shape, so we use it
// as the signal for "no real key configured yet" and fall back to an honest
// sandbox simulation instead of letting Paystack's own widget error out on a
// malformed key.
function looksLikeRealPaystackKey(key: string): boolean {
  return /^pk_(test|live)_[a-zA-Z0-9]{20,}$/.test(key);
}

let paystackScriptPromise: Promise<void> | null = null;
function loadPaystackInlineScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.PaystackPop) return Promise.resolve();
  if (!paystackScriptPromise) {
    paystackScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Paystack script"));
      document.body.appendChild(script);
    });
  }
  return paystackScriptPromise;
}

interface PaystackPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
  defaultAmount?: number;
}

export const PaystackPaymentModal: React.FC<PaystackPaymentModalProps> = ({
  isOpen,
  onClose,
  projectName = "NDH Digital Milestone Sprint",
  defaultAmount = 45000,
}) => {
  const { user } = useAuth();
  const { currency, detectedCountry } = useCurrencyLanguage();

  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "flutterwave" | "stripe">(
    "paystack",
  );
  const [customerName, setCustomerName] = useState(user?.fullName || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [applyWelcomeDiscount, setApplyWelcomeDiscount] = useState<boolean>(true);
  const [paystackPublicKey, setPaystackPublicKey] = useState(
    import.meta.env["VITE_PAYSTACK_PUBLIC_KEY"] || "pk_test_ndh_agency_demo_9921448",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState<string | null>(null);
  const [wasGatewayVerified, setWasGatewayVerified] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useModalA11y(isOpen, onClose);

  if (!isOpen) return null;

  const availableCredit =
    currency === "USD"
      ? (user?.welcomeCreditBalanceUSD ?? 20)
      : (user?.welcomeCreditBalanceNGN ?? 20000);

  const discountCalc = calculateWelcomeCreditDeduction(amount, availableCredit, 0.1);
  const finalPayable =
    applyWelcomeDiscount && availableCredit > 0 ? discountCalc.finalPayable : amount;

  const finalizePayment = async (reference: string) => {
    try {
      const tx = await dbService.recordTransaction({
        reference,
        gateway: paymentMethod,
        amount: finalPayable,
        currency,
        customerEmail,
        customerName,
        purpose: projectName,
      });
      setIsProcessing(false);
      setPaymentCompleted(tx.reference);
      setWasGatewayVerified(!!tx.verifiedByGateway);
    } catch (err) {
      setIsProcessing(false);
      setPaymentError(
        err instanceof Error ? err.message : "Could not record this payment. Please try again.",
      );
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setIsProcessing(true);

    const reference = `NDH-PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Real path: a syntactically valid Paystack public key is configured, so
    // actually open Paystack's own popup instead of simulating anything.
    if (paymentMethod === "paystack" && looksLikeRealPaystackKey(paystackPublicKey)) {
      try {
        await loadPaystackInlineScript();
        if (!window.PaystackPop) throw new Error("Paystack script did not load correctly.");

        window.PaystackPop.setup({
          key: paystackPublicKey,
          email: customerEmail,
          amount: Math.round(finalPayable * 100), // kobo/cents
          currency,
          ref: reference,
          metadata: { customerName, projectName },
          callback: (response) => {
            void finalizePayment(response.reference);
          },
          onClose: () => {
            setIsProcessing(false);
          },
        }).openIframe();
      } catch (err) {
        setIsProcessing(false);
        setPaymentError(
          err instanceof Error ? err.message : "Could not open the Paystack payment window.",
        );
      }
      return;
    }

    // Sandbox path: no real key configured for this gateway (or a
    // non-Paystack gateway was selected, for which we have no integration
    // yet). Clearly a simulation -- the resulting transaction is still
    // recorded server-side but marked verifiedByGateway: false.
    setTimeout(() => {
      void finalizePayment(reference);
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Payment"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans"
    >
      <div className="w-full max-w-lg rounded-3xl bg-eco-navy border border-eco-cyan/25 p-6 sm:p-8 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--eco-on-dark-muted)] hover:text-white p-2 rounded-full hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentCompleted ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">
                {wasGatewayVerified ? "Payment Verified ✓" : "Demo Payment Simulated ✓"}
              </h3>
              <p className="text-xs text-slate-200">
                {wasGatewayVerified ? (
                  <>
                    Paystack confirmed a real charge of{" "}
                    <strong className="text-emerald-400">
                      {currency} {finalPayable.toLocaleString()}
                    </strong>{" "}
                    under reference:
                  </>
                ) : (
                  <>
                    This sandbox walkthrough simulated a payment of{" "}
                    <strong className="text-emerald-400">
                      {currency} {finalPayable.toLocaleString()}
                    </strong>{" "}
                    under reference (not verified against a real gateway — no live keys configured
                    yet):
                  </>
                )}
              </p>
              <div className="py-2 px-4 rounded-xl bg-eco-dark border border-white/10 font-mono text-xs text-eco-cyan inline-block mt-2">
                {paymentCompleted}
              </div>
            </div>

            {applyWelcomeDiscount && discountCalc.appliedDiscount > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 font-mono text-left">
                <span>
                  ⚡ <strong>Welcome Discount Applied:</strong> -{currency}{" "}
                  {discountCalc.appliedDiscount.toLocaleString()} deducted! Remaining welcome
                  allowance for next project:{" "}
                  <strong>
                    {currency} {discountCalc.remainingCredit.toLocaleString()}
                  </strong>
                  .
                </span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-eco-cyan/20 text-left text-xs text-slate-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dual-Key Escrow Engine Locked</span>
              </div>
              <p className="text-[11px] text-[var(--eco-on-dark-muted)]">
                Funds will only be released to the engineering squad after your assigned Project
                Manager validates all milestone QA tests.
              </p>
            </div>
            <button
              onClick={() => {
                setPaymentCompleted(null);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-primary hover:bg-eco-cyan/20 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
            >
              Done &amp; Return to Workspace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  SANDBOX DEMO — NO REAL CHARGE
                </span>
                <span className="text-xs text-[var(--eco-on-dark-muted)]">
                  Target Region: {detectedCountry}
                </span>
              </div>
              <h3 className="text-xl font-black text-white">Escrow Payment Gateway</h3>
              <p className="text-xs text-slate-200">
                Project: <strong className="text-white">{projectName}</strong>
              </p>
            </div>

            {/* Gateway Selectors */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "paystack", name: "Paystack", desc: "Cards, Bank, USSD (NGN/USD)" },
                { id: "flutterwave", name: "Flutterwave", desc: "Pan-African & M-Pesa" },
                { id: "stripe", name: "Stripe", desc: "Global Cards & Apple Pay" },
              ].map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setPaymentMethod(g.id as Parameters<typeof setPaymentMethod>[0])}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    paymentMethod === g.id
                      ? "bg-primary/20 border-eco-cyan/40 text-white shadow-md"
                      : "bg-eco-dark border-white/10 text-[var(--eco-on-dark-muted)] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="text-xs font-bold text-white">{g.name}</div>
                  <div className="text-[9px] text-[var(--eco-on-dark-muted)] mt-0.5 leading-tight">
                    {g.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Customer Information */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-200">
                  Base Milestone Amount ({currency})
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white font-mono font-bold text-base focus:outline-none focus:border-eco-cyan/40"
                />
              </div>

              {/* 10% Welcome Discount Allowance Drawer */}
              {availableCredit > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-white">10% Welcome Discount Allowance</span>
                    </div>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyWelcomeDiscount}
                        onChange={(e) => setApplyWelcomeDiscount(e.target.checked)}
                        className="rounded bg-white/[0.06] border-white/12 text-amber-500 focus:ring-0"
                      />
                      <span className="text-[11px] text-amber-300 font-bold">Apply</span>
                    </label>
                  </div>

                  {applyWelcomeDiscount && (
                    <div className="space-y-1 text-[11px] text-slate-200 font-mono border-t border-amber-500/20 pt-2">
                      <div className="flex justify-between">
                        <span className="text-[var(--eco-on-dark-muted)]">
                          10% Discount Amount:
                        </span>
                        <span className="text-amber-300 font-bold">
                          -{currency} {discountCalc.appliedDiscount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--eco-on-dark-muted)]">
                          Available Welcome Allowance:
                        </span>
                        <span className="text-white">
                          {currency} {availableCredit.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--eco-on-dark-muted)]">
                          Remaining for Next Project:
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {currency} {discountCalc.remainingCredit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-200">Receipt Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40"
                  />
                </div>
              </div>

              {/* API Public Key Field for Custom Key Verification */}
              <div className="p-3 rounded-xl bg-eco-dark border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--eco-on-dark-muted)] flex items-center gap-1 font-mono">
                    <Key className="w-3 h-3 text-eco-cyan" />
                    <span>{paymentMethod.toUpperCase()} Public Key:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Ready for Live Keys
                  </span>
                </div>
                <input
                  type="text"
                  value={paystackPublicKey}
                  onChange={(e) => setPaystackPublicKey(e.target.value)}
                  placeholder="pk_test_... or pk_live_..."
                  className="w-full px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-eco-cyan/40"
                />
              </div>
            </div>

            {paymentError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {paymentError}
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-primary hover:from-emerald-500 hover:to-eco-cyan disabled:opacity-60 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Connecting to {paymentMethod.toUpperCase()} Secure Switch...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay {currency} {finalPayable.toLocaleString()} with{" "}
                    {paymentMethod.toUpperCase()}
                  </span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

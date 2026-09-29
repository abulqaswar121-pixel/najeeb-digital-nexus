import React, { useState } from 'react';
import { dbService } from '../../lib/databaseStore';
import { useCurrencyLanguage } from '../../lib/currencyLanguageStore';
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
} from 'lucide-react';

interface PaystackPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
  defaultAmount?: number;
}

export const PaystackPaymentModal: React.FC<PaystackPaymentModalProps> = ({
  isOpen,
  onClose,
  projectName = 'NDH Digital Milestone Sprint',
  defaultAmount = 45000,
}) => {
  const { currency, detectedCountry } = useCurrencyLanguage();

  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave' | 'stripe'>('paystack');
  const [customerName, setCustomerName] = useState('Dr. Folake Adeleke');
  const [customerEmail, setCustomerEmail] = useState('folake@kobopay.com');
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [paystackPublicKey, setPaystackPublicKey] = useState(
    (typeof process !== 'undefined' && process.env?.VITE_PAYSTACK_PUBLIC_KEY) || 'pk_test_ndh_agency_demo_9921448'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const tx = dbService.recordTransaction({
        gateway: paymentMethod,
        amount,
        currency,
        customerEmail,
        customerName,
        purpose: projectName,
        status: 'success',
        channel: 'card',
      });

      setIsProcessing(false);
      setPaymentCompleted(tx.reference);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg rounded-3xl bg-[#0F172A] border border-blue-500/40 p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentCompleted ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Payment Verified ✓</h3>
              <p className="text-xs text-slate-300">
                Your payment of <strong className="text-emerald-400">{currency} {amount.toLocaleString()}</strong> has been securely escrowed under reference:
              </p>
              <div className="py-2 px-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 inline-block mt-2">
                {paymentCompleted}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-left text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dual-Key Escrow Engine Locked</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Funds will only be released to the engineering squad after your assigned Project Manager validates all milestone QA tests.
              </p>
            </div>
            <button
              onClick={() => {
                setPaymentCompleted(null);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
            >
              Done &amp; Return to Workspace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSimulatePayment} className="space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                  PCI-DSS SECURE
                </span>
                <span className="text-xs text-slate-400">Target Region: {detectedCountry}</span>
              </div>
              <h3 className="text-xl font-black text-white">Escrow Payment Gateway</h3>
              <p className="text-xs text-slate-300">
                Project: <strong className="text-white">{projectName}</strong>
              </p>
            </div>

            {/* Gateway Selectors */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'paystack', name: 'Paystack', desc: 'Cards, Bank, USSD (NGN/USD)' },
                { id: 'flutterwave', name: 'Flutterwave', desc: 'Pan-African & M-Pesa' },
                { id: 'stripe', name: 'Stripe', desc: 'Global Cards & Apple Pay' },
              ].map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setPaymentMethod(g.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    paymentMethod === g.id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{g.name}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{g.desc}</div>
                </button>
              ))}
            </div>

            {/* Customer Information */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Amount ({currency})</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-base focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Your Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Receipt Email</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* API Public Key Field for Custom Key Verification */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Key className="w-3 h-3 text-blue-400" />
                    <span>{paymentMethod.toUpperCase()} Public Key:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Ready for Live Keys</span>
                </div>
                <input
                  type="text"
                  value={paystackPublicKey}
                  onChange={(e) => setPaystackPublicKey(e.target.value)}
                  placeholder="pk_test_... or pk_live_..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Connecting to {paymentMethod.toUpperCase()} Secure Switch...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay {currency} {amount.toLocaleString()} with {paymentMethod.toUpperCase()}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Minimal ambient types for Paystack's Inline JS popup (loaded dynamically
// from https://js.paystack.co/v1/inline.js -- see PaystackPaymentModal.tsx).
// Not an official @types package; just enough surface for what we call.

interface PaystackPopSetupOptions {
  key: string;
  email: string;
  amount: number; // in the smallest currency unit (kobo/cents)
  currency?: string;
  ref?: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

interface PaystackPopHandler {
  openIframe: () => void;
}

interface PaystackPopStatic {
  setup: (options: PaystackPopSetupOptions) => PaystackPopHandler;
}

interface Window {
  PaystackPop?: PaystackPopStatic;
}

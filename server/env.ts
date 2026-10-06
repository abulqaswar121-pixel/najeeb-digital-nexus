import crypto from "node:crypto";

// Centralized server-side environment config. Nothing in this file is ever
// bundled into client-side JS (this whole `server/` directory is a separate
// Node process, not part of the Vite/TanStack client build).

function warnOnce(key: string, message: string) {
  if (!(globalThis as Record<string, unknown>)[`__ndh_warned_${key}`]) {
    (globalThis as Record<string, unknown>)[`__ndh_warned_${key}`] = true;
    console.warn(message);
  }
}

// SESSION_SECRET signs the auth cookie. In dev, auto-generate one so the
// server runs out of the box, but warn loudly that this means sessions won't
// survive a server restart and that production MUST set a real secret.
let sessionSecret = process.env["SESSION_SECRET"];
if (!sessionSecret) {
  sessionSecret = crypto.randomBytes(32).toString("hex");
  warnOnce(
    "session_secret",
    "[ndh-server] SESSION_SECRET is not set — generated a random one for this " +
      "process only. All sessions will be invalidated on restart. Set a real " +
      "SESSION_SECRET in your environment before deploying anywhere real.",
  );
}

export const env = {
  PORT: Number(process.env["API_PORT"] || process.env["PORT"] || 8787),
  // Interface the API binds to. Defaults to 0.0.0.0 (unchanged behaviour).
  // The browser never talks to this process directly — it only ever calls
  // same-origin /api/*, which the Vite dev server proxies to localhost — so
  // set API_HOST=127.0.0.1 to keep the API off the public interface entirely.
  HOST: process.env["API_HOST"] || "0.0.0.0",
  SESSION_SECRET: sessionSecret,
  NODE_ENV: process.env["NODE_ENV"] || "development",
  // Paystack: PUBLIC key is also read client-side (VITE_PAYSTACK_PUBLIC_KEY);
  // the SECRET key must only ever exist here on the server.
  PAYSTACK_SECRET_KEY: process.env["PAYSTACK_SECRET_KEY"] || "",
  CLIENT_ORIGIN: process.env["CLIENT_ORIGIN"] || "http://localhost:5173",
};

if (!env.PAYSTACK_SECRET_KEY) {
  warnOnce(
    "paystack_secret",
    "[ndh-server] PAYSTACK_SECRET_KEY is not set — payment verification will " +
      "run in sandbox mode (transactions are recorded but never verified " +
      "against a real Paystack charge). Set this env var once real keys are " +
      "available.",
  );
}

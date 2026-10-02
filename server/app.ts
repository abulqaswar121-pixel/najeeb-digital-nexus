import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./env.js";
import { authRouter } from "./routes/auth.js";
import { talentsRouter } from "./routes/talents.js";
import { briefsRouter } from "./routes/briefs.js";
import { consultationsRouter } from "./routes/consultations.js";
import { talentApplicationsRouter } from "./routes/talentApplications.js";
import { transactionsRouter } from "./routes/transactions.js";
import { referralsRouter } from "./routes/referrals.js";
import { announcementRouter } from "./routes/announcement.js";
import { payoutsRouter } from "./routes/payouts.js";
import { projectsRouter } from "./routes/projects.js";
import { paymentsRouter } from "./routes/payments.js";
import { adminRouter } from "./routes/admin.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true, // required so the httpOnly session cookie is sent
    }),
  );
  app.use(cookieParser());

  // The Paystack webhook needs the RAW request body to verify its HMAC
  // signature, so it must be mounted with express.raw() before the global
  // express.json() parser would otherwise consume the body.
  app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "ndh-agency-api" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/talents", talentsRouter);
  app.use("/api/briefs", briefsRouter);
  app.use("/api/consultation-requests", consultationsRouter);
  app.use("/api/talent-applications", talentApplicationsRouter);
  app.use("/api/transactions", transactionsRouter);
  app.use("/api/referrals", referralsRouter);
  app.use("/api/announcement", announcementRouter);
  app.use("/api/payouts", payoutsRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/admin", adminRouter);

  app.use(
    (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error("[ndh-server] Unhandled error:", err);
      res.status(500).json({ error: "Internal server error" });
    },
  );

  return app;
}

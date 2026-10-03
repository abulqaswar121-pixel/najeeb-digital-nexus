import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./env.js";
import { mountOnExpress } from "./http.js";
import { MOUNTS } from "./routes.js";

// Local Node/Express host for the shared routes (used by tests and optional
// standalone runs). Production serves the same routes from the app itself
// via src/routes/api/$.ts.
export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(cookieParser());
  app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "ndh-agency-api" });
  });

  for (const m of MOUNTS) mountOnExpress(app, m.prefix, m.router);

  app.use(
    (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error("[ndh-server] Unhandled error:", err);
      res.status(500).json({ error: "Internal server error" });
    },
  );

  return app;
}

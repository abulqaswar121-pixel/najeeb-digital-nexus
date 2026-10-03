import type { Mount } from "./http.js";
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
import { caseStudiesRouter } from "./routes/caseStudies.js";
import { MiniRouter } from "./http.js";

// The Paystack webhook needs the raw body for HMAC verification, so it gets
// its own mount (listed first) with rawBody enabled.
const webhookRouter = new MiniRouter();
webhookRouter.routes = paymentsRouter.routes.filter((r) => r.path === "/webhook");
const paymentsJsonRouter = new MiniRouter();
paymentsJsonRouter.routes = paymentsRouter.routes.filter((r) => r.path !== "/webhook");

export const MOUNTS: Mount[] = [
  { prefix: "/api/payments/webhook", router: rewrite(webhookRouter, "/webhook"), rawBody: true },
  { prefix: "/api/auth", router: authRouter },
  { prefix: "/api/talents", router: talentsRouter },
  { prefix: "/api/briefs", router: briefsRouter },
  { prefix: "/api/consultation-requests", router: consultationsRouter },
  { prefix: "/api/talent-applications", router: talentApplicationsRouter },
  { prefix: "/api/transactions", router: transactionsRouter },
  { prefix: "/api/referrals", router: referralsRouter },
  { prefix: "/api/announcement", router: announcementRouter },
  { prefix: "/api/payouts", router: payoutsRouter },
  { prefix: "/api/projects", router: projectsRouter },
  { prefix: "/api/payments", router: paymentsJsonRouter },
  { prefix: "/api/admin", router: adminRouter },
  { prefix: "/api/case-studies", router: caseStudiesRouter },
];

function rewrite(r: MiniRouter, from: string) {
  const out = new MiniRouter();
  out.routes = r.routes.map((x) => ({ ...x, path: x.path === from ? "/" : x.path }));
  return out;
}

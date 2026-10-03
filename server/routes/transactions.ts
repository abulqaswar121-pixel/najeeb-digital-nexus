import { Router } from "../http.js";
import { requireAuth, requireRole } from "../auth.js";
import { transactions } from "../collections.js";

export const transactionsRouter = Router();

// Any authenticated user can see their own transaction history.
transactionsRouter.get("/me", requireAuth, (req, res) => {
  const user = req.ndhUser!;
  res.json({
    transactions: transactions.filter(
      (t) => t.createdByUserId === user.id || t.customerEmail === user.email,
    ),
  });
});

// Admin-only: full ledger, used by the Admin "Live Lead Pipeline" /
// reconciliation view.
transactionsRouter.get("/", requireRole("super_admin"), (_req, res) => {
  res.json({ transactions: transactions.all() });
});

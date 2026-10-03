import { Router } from "../http.js";
import { requireAuth, requireRole } from "../auth.js";
import { talents, toPublicTalent, talentUserLinks } from "../collections.js";

export const talentsRouter = Router();

// Public: safe fields only. This is the endpoint that replaces the previous
// direct `import { VETTED_TALENTS } from "mockData"` in client components --
// real names, hourly rates, earnings, and bank details never travel over
// this endpoint or sit in the client JS bundle at all anymore.
talentsRouter.get("/", (_req, res) => {
  res.json({ talents: talents.all().map(toPublicTalent) });
});

// PM/Admin only: full internal records, including real identity and rate
// data, for operational use (talent matching, payouts, etc).
talentsRouter.get("/internal", requireRole("project_manager", "super_admin"), (_req, res) => {
  res.json({ talents: talents.all() });
});

// A logged-in talent can see their own full profile (it's their own data).
talentsRouter.get("/me", requireAuth, (req, res) => {
  const user = req.ndhUser!;
  if (user.role !== "talent") {
    res.status(403).json({ error: "Only talent accounts have a talent profile." });
    return;
  }
  const talentId = Object.entries(talentUserLinks.get()).find(
    ([, userId]) => userId === user.id,
  )?.[0];
  const profile = talentId ? talents.find((t) => t.id === talentId) : undefined;
  if (!profile) {
    res.status(404).json({ error: "No talent profile linked to this account yet." });
    return;
  }
  res.json({ talent: profile });
});

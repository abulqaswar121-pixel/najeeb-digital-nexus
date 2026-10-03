import { Router } from "express";
import { requireRole } from "../auth.js";
import { announcement } from "../collections.js";

export const announcementRouter = Router();

announcementRouter.get("/", (_req, res) => {
  res.json({ announcement: announcement.get() });
});

announcementRouter.put("/", requireRole("super_admin"), (req, res) => {
  const { title, active } = req.body as { title?: string; active?: boolean };
  const updated = announcement.update((current) => ({
    ...current,
    ...(title !== undefined ? { title } : {}),
    ...(active !== undefined ? { active } : {}),
  }));
  res.json({ announcement: updated });
});

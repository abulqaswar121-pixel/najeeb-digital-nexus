import { Router } from "express";
import { requireRole } from "../auth.js";
import { consultationRequests, type ConsultationRequestRecord } from "../collections.js";

export const consultationsRouter = Router();

consultationsRouter.post("/", (req, res) => {
  const body = req.body as {
    fullName?: string;
    email?: string;
    preferredDate?: string;
    focusArea?: string;
  };

  if (!body.fullName || !body.email) {
    res.status(400).json({ error: "fullName and email are required." });
    return;
  }

  const record: ConsultationRequestRecord = {
    id: `consult-${Date.now()}`,
    fullName: body.fullName,
    email: body.email,
    preferredDate: body.preferredDate || "",
    focusArea: body.focusArea || "",
    status: "requested",
    createdAt: new Date().toISOString(),
  };

  consultationRequests.insert(record);
  res.status(201).json({ consultationRequest: record });
});

consultationsRouter.get("/", requireRole("project_manager", "super_admin"), (_req, res) => {
  res.json({ consultationRequests: consultationRequests.all() });
});

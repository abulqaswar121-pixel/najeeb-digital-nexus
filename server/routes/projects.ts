import { Router } from "express";
import { requireRole } from "../auth.js";
import { projectApprovals, type ProjectApprovalRecord } from "../collections.js";

export const projectsRouter = Router();

const CLIENT_ROLES = ["client_owner", "client_admin", "client_billing", "client_reviewer"] as const;

function getOrCreate(projectId: string, milestoneIndex: number): ProjectApprovalRecord {
  const existing = projectApprovals.find(
    (p) => p.projectId === projectId && p.milestoneIndex === milestoneIndex,
  );
  if (existing) return existing;
  return projectApprovals.insert(
    { projectId, milestoneIndex, qaApproved: false, milestoneApproved: false },
    "end",
  );
}

projectsRouter.get("/:projectId/milestones/:milestoneIndex/approval", (req, res) => {
  const { projectId, milestoneIndex } = req.params;
  res.json({ approval: getOrCreate(projectId as string, Number(milestoneIndex)) });
});

// PM/Admin: QA gate. This now persists server-side instead of a local
// `useState` that reset on refresh and had no effect on anything else.
projectsRouter.post(
  "/:projectId/milestones/:milestoneIndex/qa-approve",
  requireRole("project_manager", "super_admin"),
  (req, res) => {
    const { projectId, milestoneIndex } = req.params;
    const user = req.ndhUser!;
    getOrCreate(projectId as string, Number(milestoneIndex));

    const updated = projectApprovals.update(
      (p) => p.projectId === projectId && p.milestoneIndex === Number(milestoneIndex),
      (p) => ({
        ...p,
        qaApproved: true,
        qaApprovedByUserId: user.id,
        qaApprovedByName: user.fullName,
        qaApprovedAt: new Date().toISOString(),
      }),
    );

    res.json({ approval: updated });
  },
);

// Client: milestone/escrow-release approval. Enforces the real dependency
// that previously didn't exist at all -- a client could "approve" a
// deliverable (and the UI implied releasing escrow) with zero connection to
// whether the PM had actually QA-approved it.
projectsRouter.post(
  "/:projectId/milestones/:milestoneIndex/client-approve",
  requireRole(...CLIENT_ROLES, "super_admin"),
  (req, res) => {
    const { projectId, milestoneIndex } = req.params;
    const user = req.ndhUser!;
    const current = getOrCreate(projectId as string, Number(milestoneIndex));

    if (!current.qaApproved) {
      res.status(409).json({
        error:
          "This milestone has not passed PM QA review yet -- it cannot be client-approved until QA sign-off is recorded.",
      });
      return;
    }

    const updated = projectApprovals.update(
      (p) => p.projectId === projectId && p.milestoneIndex === Number(milestoneIndex),
      (p) => ({
        ...p,
        milestoneApproved: true,
        milestoneApprovedByUserId: user.id,
        milestoneApprovedByName: user.fullName,
        milestoneApprovedAt: new Date().toISOString(),
      }),
    );

    res.json({ approval: updated });
  },
);

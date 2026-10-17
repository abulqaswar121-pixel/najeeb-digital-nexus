import { Router } from "../http.js";
import { requireAuth, requireRole } from "../auth.js";
import {
  briefs,
  projectApprovals,
  projectMessages,
  projectMilestones,
  type ProjectApprovalRecord,
} from "../collections.js";
import type { UserRecord } from "../collections.js";

export const projectsRouter = Router();

const CLIENT_ROLES = ["client_owner", "client_admin", "client_billing", "client_reviewer"] as const;
const STAFF_ROLES = ["project_manager", "super_admin"] as const;

// A project here is a client brief. Staff (PM/admin) can open any project;
// a client can only open a project they themselves submitted (matched by
// their account or by the email on the brief).
function canAccessProject(user: UserRecord, briefId: string): boolean {
  if ((STAFF_ROLES as readonly string[]).includes(user.role)) return true;
  const brief = briefs.find((b) => b.id === briefId);
  if (!brief) return false;
  return (
    brief.submittedByUserId === user.id ||
    brief.clientEmail.toLowerCase() === user.email.toLowerCase()
  );
}

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

    // Keep the milestone's own status in step so both portals show it.
    const msList = projectMilestones.filter((m) => m.briefId === projectId);
    const ms = msList[Number(milestoneIndex)];
    if (ms && ms.status !== "approved") {
      projectMilestones.update((m) => m.id === ms.id, (m) => ({ ...m, status: "qa_ready" }));
    }

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

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

    const msList = projectMilestones.filter((m) => m.briefId === projectId);
    const ms = msList[Number(milestoneIndex)];
    if (ms) {
      projectMilestones.update((m) => m.id === ms.id, (m) => ({ ...m, status: "approved" }));
    }

    res.json({ approval: updated });
  },
);

// ---------------------------------------------------------------------------
// PM <-> client chat, one thread per project (brief). Both sides must be
// logged in; a client can only ever read/write their own project's thread.
// ---------------------------------------------------------------------------
projectsRouter.get("/:projectId/messages", requireAuth, (req, res) => {
  const { projectId } = req.params;
  const user = req.ndhUser!;
  if (!canAccessProject(user, projectId as string)) {
    res.status(403).json({ error: "You can only view messages for your own project." });
    return;
  }
  const messages = projectMessages
    .filter((m) => m.briefId === projectId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  res.json({ messages });
});

projectsRouter.post("/:projectId/messages", requireAuth, (req, res) => {
  const { projectId } = req.params;
  const user = req.ndhUser!;
  if (!canAccessProject(user, projectId as string)) {
    res.status(403).json({ error: "You can only message your own project." });
    return;
  }
  const { text } = (req.body ?? {}) as { text?: string };
  const clean = (text || "").trim();
  if (!clean) {
    res.status(400).json({ error: "Type a message first." });
    return;
  }
  const isStaff = (STAFF_ROLES as readonly string[]).includes(user.role);
  const message = projectMessages.insert(
    {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      briefId: projectId as string,
      senderUserId: user.id,
      senderName: user.fullName,
      senderRole: isStaff ? "pm" : "client",
      text: clean.slice(0, 2000),
      createdAt: new Date().toISOString(),
    },
    "end",
  );
  res.status(201).json({ message });
});

// ---------------------------------------------------------------------------
// Milestones: the PM creates them; the client sees them and approves each
// one after QA (approvals live in the routes above).
// ---------------------------------------------------------------------------
projectsRouter.get("/:projectId/milestones", requireAuth, (req, res) => {
  const { projectId } = req.params;
  const user = req.ndhUser!;
  if (!canAccessProject(user, projectId as string)) {
    res.status(403).json({ error: "You can only view milestones for your own project." });
    return;
  }
  res.json({ milestones: projectMilestones.filter((m) => m.briefId === projectId) });
});

projectsRouter.post("/:projectId/milestones", requireRole(...STAFF_ROLES), (req, res) => {
  const { projectId } = req.params;
  const user = req.ndhUser!;
  const brief = briefs.find((b) => b.id === projectId);
  if (!brief) {
    res.status(404).json({ error: "Project not found." });
    return;
  }
  const body = (req.body ?? {}) as {
    title?: string;
    description?: string;
    amount?: string;
    currency?: string;
    dueDate?: string;
  };
  if (!body.title || !body.title.trim()) {
    res.status(400).json({ error: "Give the milestone a short title." });
    return;
  }
  const milestone = projectMilestones.insert(
    {
      id: `ms-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      briefId: brief.id,
      title: body.title.trim().slice(0, 120),
      description: (body.description || "").trim().slice(0, 1000),
      amount: (body.amount || "").trim().slice(0, 40),
      currency: (body.currency || brief.currency || "NGN").trim().slice(0, 8),
      dueDate: (body.dueDate || "").trim().slice(0, 40),
      status: "planned",
      createdAt: new Date().toISOString(),
      createdByName: user.fullName,
    },
    "end",
  );
  // The project is genuinely underway once it has milestones.
  if (brief.status === "submitted" || brief.status === "pm_assigned") {
    briefs.update((b) => b.id === brief.id, (b) => ({ ...b, status: "in_progress" as const }));
  }
  res.status(201).json({ milestone });
});

// All QA/client approval states for one project, so both portals can show
// each milestone's real status without fetching them one by one.
projectsRouter.get("/:projectId/approvals", requireAuth, (req, res) => {
  const { projectId } = req.params;
  const user = req.ndhUser!;
  if (!canAccessProject(user, projectId as string)) {
    res.status(403).json({ error: "You can only view approvals for your own project." });
    return;
  }
  res.json({ approvals: projectApprovals.filter((p) => p.projectId === projectId) });
});

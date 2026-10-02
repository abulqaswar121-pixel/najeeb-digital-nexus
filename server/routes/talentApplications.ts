import { Router } from "express";
import { requireRole, hashPassword, generateTemporaryPassword, toPublicUser } from "../auth.js";
import {
  talentApplications,
  talents,
  talentUserLinks,
  users,
  type TalentApplicationRecord,
  type UserRecord,
} from "../collections.js";
import type { ServiceDepartment, TalentProfile } from "../../src/types/ndh.js";

export const talentApplicationsRouter = Router();

const REVIEW_ROLES = ["super_admin", "talent_admin"] as const;

talentApplicationsRouter.post("/", (req, res) => {
  const body = req.body as Omit<TalentApplicationRecord, "id" | "status" | "submittedAt"> & {
    primaryDepartment?: ServiceDepartment;
  };

  if (!body.fullName || !body.email || !body.primaryDepartment) {
    res.status(400).json({ error: "fullName, email, and primaryDepartment are required." });
    return;
  }

  const record: TalentApplicationRecord = {
    ...body,
    primaryDepartment: body.primaryDepartment,
    id: `app-${Date.now()}`,
    status: "pending_review",
    submittedAt: new Date().toISOString(),
  } as TalentApplicationRecord;

  talentApplications.insert(record);
  res.status(201).json({ talentApplication: record });
});

talentApplicationsRouter.get("/", requireRole("super_admin"), (_req, res) => {
  res.json({ talentApplications: talentApplications.all() });
});

// Approving a talent application used to just flip a local boolean in the
// browser ("Approved & Credentials Issued ✓") without anything actually
// being created. This now really does what that label claimed: it creates a
// real login (bcrypt-hashed, random temporary password -- there's no email
// service in this build, so the temporary password is returned once in this
// response for the admin to relay to the candidate directly) and a real
// internal talent profile, then links the two together.
talentApplicationsRouter.post("/:id/approve", requireRole(...REVIEW_ROLES), async (req, res) => {
  const application = talentApplications.find((a) => a.id === req.params["id"]);
  if (!application) {
    res.status(404).json({ error: "Talent application not found." });
    return;
  }
  if (application.status === "accepted") {
    res.status(409).json({ error: "This application has already been approved." });
    return;
  }
  if (application.status === "rejected") {
    res
      .status(409)
      .json({ error: "This application was already rejected and cannot be approved." });
    return;
  }
  if (users.find((u) => u.email.toLowerCase() === application.email.toLowerCase())) {
    res.status(409).json({ error: "An account with this candidate's email already exists." });
    return;
  }

  const temporaryPassword = generateTemporaryPassword();
  const talentId = `tal-${Date.now()}`;
  const userId = `user-talent-${Date.now()}`;

  const rateMatch = application.hourlyRateExpectation.match(/\d+(\.\d+)?/);
  const hourlyRateInternalUSD = rateMatch ? Number(rateMatch[0]) : 0;

  const newUser: UserRecord = {
    id: userId,
    fullName: application.fullName,
    email: application.email,
    passwordHash: await hashPassword(temporaryPassword),
    role: "talent",
    roleTitle: `${application.experienceLevel} Talent — ${application.primaryDepartment}`,
    avatarUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    ...(application.phone ? { phone: application.phone } : {}),
    country: application.country,
  };
  users.insert(newUser, "end");

  const newTalent: TalentProfile = {
    id: talentId,
    pseudonym: `${application.primaryDepartment.slice(0, 4).toUpperCase()}-${talentId.slice(-4)}`,
    fullName: application.fullName,
    department: application.primaryDepartment,
    tier: application.experienceLevel,
    rank: "Bronze Prodigy",
    location: application.country,
    timezone: "Africa/Lagos",
    skills: [],
    tools: [],
    completedProjects: 0,
    onTimeDeliveryRate: 100,
    qualityScore: 0,
    qaPercentageScore: 0,
    activeTasks: 0,
    hourlyRateInternalUSD,
    totalEarnedUSD: 0,
    totalEarnedNGN: 0,
    bonusMultiplier: 1,
    academyGraduate: false,
    verificationStatus: "onboarding",
    ndaSigned: false,
    avatarUrl: newUser.avatarUrl,
    bio: application.bioNotes || "Newly approved talent -- profile pending first assignment.",
  };
  talents.insert(newTalent, "end");
  talentUserLinks.update((links) => ({ ...links, [talentId]: userId }));

  talentApplications.update(
    (a) => a.id === application.id,
    (a) => ({
      ...a,
      status: "accepted",
      reviewedAt: new Date().toISOString(),
      reviewedByUserId: req.ndhUser!.id,
      approvedUserId: userId,
      approvedTalentId: talentId,
    }),
  );

  res.json({
    user: toPublicUser(newUser),
    talentProfile: newTalent,
    temporaryPassword,
  });
});

talentApplicationsRouter.post("/:id/reject", requireRole(...REVIEW_ROLES), (req, res) => {
  const application = talentApplications.find((a) => a.id === req.params["id"]);
  if (!application) {
    res.status(404).json({ error: "Talent application not found." });
    return;
  }
  if (application.status === "accepted" || application.status === "rejected") {
    res.status(409).json({ error: "This application has already been reviewed." });
    return;
  }

  const { reason } = req.body as { reason?: string };
  const updated = talentApplications.update(
    (a) => a.id === application.id,
    (a) => ({
      ...a,
      status: "rejected",
      reviewedAt: new Date().toISOString(),
      reviewedByUserId: req.ndhUser!.id,
      ...(reason ? { rejectionReason: reason } : {}),
    }),
  );

  res.json({ talentApplication: updated });
});

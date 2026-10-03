// @vitest-environment node
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { DEMO_ACCOUNT_PASSWORD } from "../collections.js";

const app = createApp();

async function loginAsSuperAdmin() {
  const agent = request.agent(app);
  await agent
    .post("/api/auth/login")
    .send({ email: "najeeb@ndh.com.ng", password: DEMO_ACCOUNT_PASSWORD });
  return agent;
}

describe("Talent application approval really creates a working account (regression test for the previous fake 'Approved ✓' local-only state)", () => {
  it("approve creates a real login + talent profile, and the temp password actually logs in", async () => {
    const admin = await loginAsSuperAdmin();

    const submission = await request(app).post("/api/talent-applications").send({
      fullName: "Test Candidate",
      email: "test.candidate@example.com",
      phone: "+234 800 000 0000",
      country: "Nigeria",
      primaryDepartment: "web_app_development",
      experienceLevel: "Senior",
      portfolioUrl: "https://example.com/portfolio",
      hourlyRateExpectation: "$40/hr",
      availableHoursPerWeek: 30,
      bioNotes: "Test bio",
    });
    expect(submission.status).toBe(201);
    const appId = submission.body.talentApplication.id;

    const approval = await admin.post(`/api/talent-applications/${appId}/approve`);
    expect(approval.status).toBe(200);
    expect(approval.body.user.role).toBe("talent");
    expect(approval.body.user.email).toBe("test.candidate@example.com");
    expect(approval.body.talentProfile.hourlyRateInternalUSD).toBe(40);
    expect(typeof approval.body.temporaryPassword).toBe("string");
    expect(approval.body.temporaryPassword.length).toBeGreaterThan(6);

    // The temporary password must actually work, not just be decorative.
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "test.candidate@example.com", password: approval.body.temporaryPassword });
    expect(login.status).toBe(200);
    expect(login.body.user.role).toBe("talent");

    // Can't approve the same application twice.
    const secondApproval = await admin.post(`/api/talent-applications/${appId}/approve`);
    expect(secondApproval.status).toBe(409);
  });

  it("reject marks the application rejected and blocks a later approval", async () => {
    const admin = await loginAsSuperAdmin();

    const submission = await request(app).post("/api/talent-applications").send({
      fullName: "Rejected Candidate",
      email: "rejected.candidate@example.com",
      phone: "",
      country: "Nigeria",
      primaryDepartment: "brand_identity",
      experienceLevel: "Junior",
      portfolioUrl: "https://example.com/portfolio2",
      hourlyRateExpectation: "$10/hr",
      availableHoursPerWeek: 10,
      bioNotes: "",
    });
    const appId = submission.body.talentApplication.id;

    const rejection = await admin
      .post(`/api/talent-applications/${appId}/reject`)
      .send({ reason: "Not a fit right now" });
    expect(rejection.status).toBe(200);
    expect(rejection.body.talentApplication.status).toBe("rejected");

    const approvalAfterRejection = await admin.post(`/api/talent-applications/${appId}/approve`);
    expect(approvalAfterRejection.status).toBe(409);
  });

  it("a non-reviewer role cannot approve applications", async () => {
    const talentAgent = request.agent(app);
    await talentAgent
      .post("/api/auth/login")
      .send({ email: "alpha.dev@network.ndh.com.ng", password: DEMO_ACCOUNT_PASSWORD });

    const res = await talentAgent.post("/api/talent-applications/app-does-not-exist/approve");
    expect(res.status).toBe(403);
  });
});

describe("Staff invite really creates a working account (regression test for the previous fake 'Invitation Sent!' local-only state)", () => {
  it("super_admin can invite a PM and the temp password actually logs in", async () => {
    const admin = await loginAsSuperAdmin();

    const invite = await admin.post("/api/admin/invite-staff").send({
      fullName: "New PM",
      email: "new.pm@agency.ndh.com.ng",
      role: "project_manager",
    });
    expect(invite.status).toBe(201);
    expect(invite.body.user.role).toBe("project_manager");
    expect(typeof invite.body.temporaryPassword).toBe("string");

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "new.pm@agency.ndh.com.ng", password: invite.body.temporaryPassword });
    expect(login.status).toBe(200);
    expect(login.body.user.role).toBe("project_manager");
  });

  it("cannot invite a duplicate email, and cannot invite super_admin through this endpoint", async () => {
    const admin = await loginAsSuperAdmin();

    const duplicate = await admin
      .post("/api/admin/invite-staff")
      .send({ fullName: "Someone", email: "najeeb@ndh.com.ng", role: "project_manager" });
    expect(duplicate.status).toBe(409);

    const escalation = await admin
      .post("/api/admin/invite-staff")
      .send({ fullName: "Sneaky", email: "sneaky@example.com", role: "super_admin" });
    expect(escalation.status).toBe(400);
  });

  it("a non-super_admin cannot invite staff", async () => {
    const pmAgent = request.agent(app);
    await pmAgent
      .post("/api/auth/login")
      .send({ email: "tariq.pm@agency.ndh.com.ng", password: DEMO_ACCOUNT_PASSWORD });

    const res = await pmAgent
      .post("/api/admin/invite-staff")
      .send({ fullName: "Someone", email: "someone@example.com", role: "project_manager" });
    expect(res.status).toBe(403);
  });
});

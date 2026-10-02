// @vitest-environment node
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { DEMO_ACCOUNT_PASSWORD } from "../collections.js";

const app = createApp();

async function loginAgent(email: string, password: string = DEMO_ACCOUNT_PASSWORD) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password });
  return agent;
}

// Regression coverage for the bug a real user hit in production: a brand-new
// client who self-registers must see their OWN (empty) project/brief state,
// never a hardcoded sample company's data, and must never see another
// client's briefs either.
describe("Client-facing brief/data scoping (regression test)", () => {
  it("a brand-new real client sees zero briefs via /briefs/mine until they submit one", async () => {
    const email = `new-client-${Date.now()}@example.com`;
    const register = await request(app).post("/api/auth/register").send({
      fullName: "Ataurrahman Najeeb",
      email,
      password: "SuperSecret123!",
      organizationName: "Najeeb Test Ventures",
    });
    expect(register.status).toBe(201);
    expect(register.body.user.isDemoAccount).toBeFalsy();
    expect(register.body.user.organizationId).not.toBe("org-kobopay");

    const agent = request.agent(app);
    await agent.post("/api/auth/login").send({ email, password: "SuperSecret123!" });

    const mine = await agent.get("/api/briefs/mine");
    expect(mine.status).toBe(200);
    expect(mine.body.briefs).toEqual([]);

    // Submitting their own brief makes it show up ...
    const brief = await agent.post("/api/briefs").send({
      organizationName: "Najeeb Test Ventures",
      department: "web_app_development",
      scopeTier: "starter",
      budgetAmount: "₦75,000",
      currency: "NGN",
      timelineWeeks: "1 - 2 Weeks",
      clientEmail: email,
      briefDetails: "My first real project.",
    });
    expect(brief.status).toBe(201);
    // ... genuinely unassigned, never a fabricated named PM.
    expect(brief.body.brief.assignedPM).toBe("Unassigned");

    const mineAfter = await agent.get("/api/briefs/mine");
    expect(mineAfter.body.briefs).toHaveLength(1);
    expect(mineAfter.body.briefs[0].organizationName).toBe("Najeeb Test Ventures");
  });

  it("a client can never see another client's briefs via /briefs/mine", async () => {
    const emailA = `client-a-${Date.now()}@example.com`;
    const emailB = `client-b-${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      fullName: "Client A",
      email: emailA,
      password: "SuperSecret123!",
      organizationName: "Org A",
    });
    await request(app).post("/api/auth/register").send({
      fullName: "Client B",
      email: emailB,
      password: "SuperSecret123!",
      organizationName: "Org B",
    });

    const agentA = request.agent(app);
    await agentA.post("/api/auth/login").send({ email: emailA, password: "SuperSecret123!" });
    await agentA.post("/api/briefs").send({
      organizationName: "Org A",
      department: "web_app_development",
      scopeTier: "starter",
      budgetAmount: "₦50,000",
      currency: "NGN",
      timelineWeeks: "1 Week",
      clientEmail: emailA,
      briefDetails: "Org A's confidential brief.",
    });

    const agentB = request.agent(app);
    await agentB.post("/api/auth/login").send({ email: emailB, password: "SuperSecret123!" });
    const briefsForB = await agentB.get("/api/briefs/mine");
    expect(briefsForB.status).toBe(200);
    expect(briefsForB.body.briefs).toEqual([]);
  });

  it("a PM can claim an unassigned brief, replacing the placeholder with their real name", async () => {
    const email = `claim-test-${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      fullName: "Claim Test Client",
      email,
      password: "SuperSecret123!",
      organizationName: "Claim Test Org",
    });
    const clientAgent = request.agent(app);
    await clientAgent.post("/api/auth/login").send({ email, password: "SuperSecret123!" });
    const briefRes = await clientAgent.post("/api/briefs").send({
      organizationName: "Claim Test Org",
      department: "web_app_development",
      scopeTier: "starter",
      budgetAmount: "₦50,000",
      currency: "NGN",
      timelineWeeks: "1 Week",
      clientEmail: email,
      briefDetails: "Needs a PM.",
    });
    const briefId = briefRes.body.brief.id;

    const pm = await loginAgent("tariq.pm@agency.ndh.com.ng");
    const assignRes = await pm.patch(`/api/briefs/${briefId}/assign`);
    expect(assignRes.status).toBe(200);
    expect(assignRes.body.brief.assignedPM).toBe("Tariq Al-Najeeb");
    expect(assignRes.body.brief.status).toBe("pm_assigned");

    const mineAfter = await clientAgent.get("/api/briefs/mine");
    expect(mineAfter.body.briefs[0].assignedPM).toBe("Tariq Al-Najeeb");
  });

  it("the seeded demo client's own referrals are only returned to her via /referrals/mine", async () => {
    const folake = await loginAgent("folake@kobopay.com");
    const mine = await folake.get("/api/referrals/mine");
    expect(mine.status).toBe(200);
    expect(mine.body.referrals.length).toBeGreaterThan(0);
    expect(
      mine.body.referrals.every(
        (r: { referrerUserId: string }) => r.referrerUserId === "user-client-folake",
      ),
    ).toBe(true);

    // A brand-new client has never referred anyone.
    const email = `no-referrals-${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      fullName: "No Referrals Yet",
      email,
      password: "SuperSecret123!",
      organizationName: "Fresh Org",
    });
    const newClient = request.agent(app);
    await newClient.post("/api/auth/login").send({ email, password: "SuperSecret123!" });
    const theirs = await newClient.get("/api/referrals/mine");
    expect(theirs.body.referrals).toEqual([]);
  });
});

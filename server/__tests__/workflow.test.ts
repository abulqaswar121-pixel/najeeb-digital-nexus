// @vitest-environment node
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { DEMO_ACCOUNT_PASSWORD } from "../collections.js";

const app = createApp();

async function loginAgent(email: string) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send({ email, password: DEMO_ACCOUNT_PASSWORD });
  return agent;
}

describe("Lead-generation funnel reaches operations (regression test)", () => {
  it("a brief submitted publicly is immediately visible to PM/Admin, invisible to clients", async () => {
    const createRes = await request(app).post("/api/briefs").send({
      organizationName: "Regression Test Co",
      department: "web_app_development",
      scopeTier: "growth",
      budgetAmount: "$10,000",
      currency: "USD",
      timelineWeeks: "4 Weeks",
      clientEmail: "regression@test.com",
      briefDetails: "Regression test brief",
    });
    expect(createRes.status).toBe(201);

    const pm = await loginAgent("tariq.pm@agency.ndh.com.ng");
    const pmBriefs = await pm.get("/api/briefs");
    expect(pmBriefs.status).toBe(200);
    expect(
      pmBriefs.body.briefs.some(
        (b: { organizationName: string }) => b.organizationName === "Regression Test Co",
      ),
    ).toBe(true);

    const client = await loginAgent("folake@kobopay.com");
    const clientBriefs = await client.get("/api/briefs");
    expect(clientBriefs.status).toBe(403);
  });
});

describe("Payout dual-approval is a real maker-checker control", () => {
  it("rejects a second signature from the same user; requires a different signer to disburse", async () => {
    const admin = await loginAgent("najeeb@ndh.com.ng");
    const finance = await loginAgent("amina.finance@ndh.com.ng");

    const first = await admin.post("/api/payouts/batch-2026-10-01/sign");
    expect(first.status).toBe(200);
    expect(first.body.payoutBatch.approvals).toHaveLength(1);

    // Same user signing again must be rejected -- this is the actual fix for
    // the "one person clicks a button twice" finding.
    const sameUserAgain = await admin.post("/api/payouts/batch-2026-10-01/sign");
    expect(sameUserAgain.status).toBe(409);

    // Disbursing with only 1 signature must be rejected.
    const earlyDisburse = await admin.post("/api/payouts/batch-2026-10-01/disburse");
    expect(earlyDisburse.status).toBe(409);

    const second = await finance.post("/api/payouts/batch-2026-10-01/sign");
    expect(second.status).toBe(200);
    expect(second.body.payoutBatch.approvals).toHaveLength(2);

    const disburse = await finance.post("/api/payouts/batch-2026-10-01/disburse");
    expect(disburse.status).toBe(200);
    expect(disburse.body.payoutBatch.disbursed).toBe(true);
  });
});

describe("PM <-> client project chat and milestones", () => {
  it("PM and the owning client can chat; another client cannot read or write the thread", async () => {
    // Create a brief owned by the demo client account.
    const createRes = await request(app).post("/api/briefs").send({
      organizationName: "Chat Test Co",
      department: "web_app_development",
      scopeTier: "starter",
      clientEmail: "folake@kobopay.com",
      briefDetails: "Chat test brief",
    });
    expect(createRes.status).toBe(201);
    const briefId = createRes.body.brief.id as string;

    const pm = await loginAgent("tariq.pm@agency.ndh.com.ng");
    const client = await loginAgent("folake@kobopay.com");

    // PM creates a milestone; the client cannot.
    const ms = await pm
      .post(`/api/projects/${briefId}/milestones`)
      .send({ title: "Design & logo", amount: "500000", currency: "NGN", dueDate: "2 weeks" });
    expect(ms.status).toBe(201);
    const forbiddenMs = await client
      .post(`/api/projects/${briefId}/milestones`)
      .send({ title: "Sneaky" });
    expect(forbiddenMs.status).toBe(403);

    // Both sides can send and read messages.
    const pmMsg = await pm
      .post(`/api/projects/${briefId}/messages`)
      .send({ text: "Hello, I am your PM." });
    expect(pmMsg.status).toBe(201);
    const clientMsg = await client
      .post(`/api/projects/${briefId}/messages`)
      .send({ text: "Hi, thanks!" });
    expect(clientMsg.status).toBe(201);

    const thread = await client.get(`/api/projects/${briefId}/messages`);
    expect(thread.status).toBe(200);
    expect(thread.body.messages).toHaveLength(2);

    const msList = await client.get(`/api/projects/${briefId}/milestones`);
    expect(msList.status).toBe(200);
    expect(msList.body.milestones).toHaveLength(1);
    expect(msList.body.milestones[0].title).toBe("Design & logo");

    // A different client (finance admin is staff; use a fresh non-owner
    // client account) must be blocked from the thread.
    const outsider = request.agent(app);
    await outsider.post("/api/auth/register").send({
      fullName: "Outsider Client",
      email: "outsider@example.com",
      password: "OutsiderPass2026!",
      organizationName: "Outsider Ltd",
    });
    const blockedRead = await outsider.get(`/api/projects/${briefId}/messages`);
    expect(blockedRead.status).toBe(403);
    const blockedWrite = await outsider
      .post(`/api/projects/${briefId}/messages`)
      .send({ text: "should not work" });
    expect(blockedWrite.status).toBe(403);

    // Signed-out visitors are blocked too.
    const anon = await request(app).get(`/api/projects/${briefId}/messages`);
    expect(anon.status).toBe(401);
  });
});

describe("QA gate -> client milestone approval ordering is enforced server-side", () => {
  it("a client cannot approve a milestone before the PM has QA-approved it", async () => {
    const client = await loginAgent("folake@kobopay.com");
    const tooEarly = await client.post(
      "/api/projects/proj-workflow-test/milestones/1/client-approve",
    );
    expect(tooEarly.status).toBe(409);

    const pm = await loginAgent("tariq.pm@agency.ndh.com.ng");
    const qaApprove = await pm.post("/api/projects/proj-workflow-test/milestones/1/qa-approve");
    expect(qaApprove.status).toBe(200);
    expect(qaApprove.body.approval.qaApproved).toBe(true);

    const nowOk = await client.post("/api/projects/proj-workflow-test/milestones/1/client-approve");
    expect(nowOk.status).toBe(200);
    expect(nowOk.body.approval.milestoneApproved).toBe(true);
  });
});

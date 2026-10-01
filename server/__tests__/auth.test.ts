// @vitest-environment node
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { DEMO_ACCOUNT_PASSWORD } from "../collections.js";

const app = createApp();

describe("Authentication", () => {
  it("rejects an unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "whatever" });
    expect(res.status).toBe(401);
  });

  it("rejects a correct email with a wrong password (no email-guessing bypass)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "najeeb@ndh.com.ng", password: "totally-wrong" });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/incorrect password/i);
  });

  it("accepts the correct email + demo password and sets a session cookie", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "najeeb@ndh.com.ng", password: DEMO_ACCOUNT_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("super_admin");
    expect(res.headers["set-cookie"]?.[0]).toMatch(/ndh_session=.+HttpOnly/);
  });

  it("a forged/garbage session cookie is rejected, not trusted", async () => {
    const res = await request(app)
      .get("/api/talents/internal")
      .set("Cookie", "ndh_session=totally.forged.garbage");
    expect(res.status).toBe(401);
  });

  it("unauthenticated requests to a protected route get 401, not data", async () => {
    const res = await request(app).get("/api/talents/internal");
    expect(res.status).toBe(401);
  });

  it("GET /api/auth/me reflects the logged-in session via cookie", async () => {
    const agent = request.agent(app);
    await agent
      .post("/api/auth/login")
      .send({ email: "folake@kobopay.com", password: DEMO_ACCOUNT_PASSWORD });
    const me = await agent.get("/api/auth/me");
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe("folake@kobopay.com");
  });

  it("logout clears the session so a follow-up /me call is unauthenticated", async () => {
    const agent = request.agent(app);
    await agent
      .post("/api/auth/login")
      .send({ email: "folake@kobopay.com", password: DEMO_ACCOUNT_PASSWORD });
    await agent.post("/api/auth/logout");
    const me = await agent.get("/api/auth/me");
    expect(me.status).toBe(401);
  });
});

describe("Talent data confidentiality (regression test for the confirmed bundle-leak finding)", () => {
  it("the public talents endpoint never includes identity or financial fields", async () => {
    const res = await request(app).get("/api/talents");
    expect(res.status).toBe(200);
    const serialized = JSON.stringify(res.body);
    expect(serialized).not.toMatch(/fullName/);
    expect(serialized).not.toMatch(/hourlyRateInternalUSD/);
    expect(serialized).not.toMatch(/bankDetails/);
    expect(res.body.talents[0].pseudonym).toBeTruthy();
  });

  it("only project_manager/super_admin roles can reach the internal talent endpoint", async () => {
    const pmAgent = request.agent(app);
    await pmAgent
      .post("/api/auth/login")
      .send({ email: "tariq.pm@agency.ndh.com.ng", password: DEMO_ACCOUNT_PASSWORD });
    const pmRes = await pmAgent.get("/api/talents/internal");
    expect(pmRes.status).toBe(200);
    expect(pmRes.body.talents[0].fullName).toBeTruthy();

    const talentAgent = request.agent(app);
    await talentAgent
      .post("/api/auth/login")
      .send({ email: "alpha.dev@network.ndh.com.ng", password: DEMO_ACCOUNT_PASSWORD });
    const talentRes = await talentAgent.get("/api/talents/internal");
    expect(talentRes.status).toBe(403);
  });
});

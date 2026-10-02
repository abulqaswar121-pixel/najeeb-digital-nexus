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

describe("Case studies API (regression test for the previous static-only, no-admin-path data)", () => {
  it("is publicly readable with real seeded content (not an empty/fake list)", async () => {
    const res = await request(app).get("/api/case-studies");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.caseStudies)).toBe(true);
    expect(res.body.caseStudies.length).toBeGreaterThan(0);
    expect(
      res.body.caseStudies.some((c: { clientName: string }) => c.clientName === "Hague Export"),
    ).toBe(true);
  });

  it("rejects create/update/delete from an anonymous or non-admin caller", async () => {
    const anon = await request(app).post("/api/case-studies").send({
      title: "Should Not Be Created",
      clientName: "Nobody",
      department: "web_app_development",
    });
    expect(anon.status).toBe(401);

    const talent = await loginAgent("alpha.dev@network.ndh.com.ng");
    const talentCreate = await talent.post("/api/case-studies").send({
      title: "Should Not Be Created Either",
      clientName: "Nobody",
      department: "web_app_development",
    });
    expect(talentCreate.status).toBe(403);
  });

  it("lets a super_admin create, edit, and delete a case study end to end", async () => {
    const admin = await loginAgent("najeeb@ndh.com.ng");

    const createRes = await admin.post("/api/case-studies").send({
      title: "Regression Test Case Study",
      clientName: "Regression Test Co",
      industry: "Testing",
      department: "web_app_development",
      location: "Nigeria",
      heroImage: "/case-studies/regression-test.jpg",
      summary: "A test case study.",
      challenge: "Testing challenge.",
      insight: "Testing insight.",
      strategy: "Testing strategy.",
      process: "Testing process.",
      solution: "Testing solution.",
      techStack: ["Testing"],
      measurableOutcomes: [],
      featured: false,
    });
    expect(createRes.status).toBe(201);
    const id = createRes.body.caseStudy.id;
    expect(id).toBeTruthy();

    const listAfterCreate = await request(app).get("/api/case-studies");
    expect(listAfterCreate.body.caseStudies.some((c: { id: string }) => c.id === id)).toBe(true);

    const updateRes = await admin
      .put(`/api/case-studies/${id}`)
      .send({ title: "Updated Regression Test Case Study", featured: true });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.caseStudy.title).toBe("Updated Regression Test Case Study");
    expect(updateRes.body.caseStudy.featured).toBe(true);
    // Fields not sent in the update must survive untouched.
    expect(updateRes.body.caseStudy.clientName).toBe("Regression Test Co");

    const deleteRes = await admin.delete(`/api/case-studies/${id}`);
    expect(deleteRes.status).toBe(204);

    const listAfterDelete = await request(app).get("/api/case-studies");
    expect(listAfterDelete.body.caseStudies.some((c: { id: string }) => c.id === id)).toBe(false);

    const deleteAgain = await admin.delete(`/api/case-studies/${id}`);
    expect(deleteAgain.status).toBe(404);
  });
});

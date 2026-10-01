import { describe, it, expect, beforeEach } from "vitest";
import { dbService, subscribeToDatabase, calculateWelcomeCreditDeduction } from "../databaseStore";

describe("calculateWelcomeCreditDeduction", () => {
  it("applies the full discount when enough credit is available", () => {
    const result = calculateWelcomeCreditDeduction(100000, 50000, 0.1);
    expect(result.nominalDiscount).toBe(10000);
    expect(result.appliedDiscount).toBe(10000);
    expect(result.finalPayable).toBe(90000);
    expect(result.remainingCredit).toBe(40000);
  });

  it("caps the discount at the available credit balance", () => {
    const result = calculateWelcomeCreditDeduction(100000, 5000, 0.1);
    expect(result.nominalDiscount).toBe(10000);
    expect(result.appliedDiscount).toBe(5000); // capped by available credit
    expect(result.finalPayable).toBe(95000);
    expect(result.remainingCredit).toBe(0);
  });

  it("never produces a negative payable or negative remaining credit", () => {
    const result = calculateWelcomeCreditDeduction(1000, -500, 0.1);
    expect(result.appliedDiscount).toBeGreaterThanOrEqual(0);
    expect(result.finalPayable).toBeGreaterThanOrEqual(0);
    expect(result.remainingCredit).toBeGreaterThanOrEqual(0);
  });
});

describe("dbService brief pipeline (regression test for the disconnected-funnel finding)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("createBrief() immediately shows up in getBriefs()", () => {
    const before = dbService.getBriefs().length;
    dbService.createBrief({
      projectName: "Test Project",
      organizationName: "Test Org",
      department: "web_app_development",
      scopeTier: "growth",
      budgetAmount: "$10,000",
      currency: "USD",
      timelineWeeks: "4 Weeks",
      clientEmail: "client@example.com",
      briefDetails: "A test brief",
    });
    expect(dbService.getBriefs().length).toBe(before + 1);
    expect(dbService.getBriefs()[0]?.organizationName).toBe("Test Org");
    expect(dbService.getBriefs()[0]?.status).toBe("submitted");
  });

  it("notifies subscribers when a brief is created (so PM/Admin portals can react live)", () => {
    let notified = false;
    const unsubscribe = subscribeToDatabase(() => {
      notified = true;
    });

    dbService.createBrief({
      projectName: "Reactive Test",
      organizationName: "Reactive Org",
      department: "brand_strategy",
      scopeTier: "starter",
      budgetAmount: "$5,000",
      currency: "USD",
      timelineWeeks: "2 Weeks",
      clientEmail: "reactive@example.com",
      briefDetails: "Reactive test brief",
    });

    expect(notified).toBe(true);
    unsubscribe();
  });

  it("createConsultationRequest() shows up in getConsultationRequests()", () => {
    const before = dbService.getConsultationRequests().length;
    dbService.createConsultationRequest({
      fullName: "Jane Tester",
      email: "jane@example.com",
      preferredDate: "2026-10-05",
      focusArea: "AI Automation",
    });
    expect(dbService.getConsultationRequests().length).toBe(before + 1);
    expect(dbService.getConsultationRequests()[0]?.status).toBe("requested");
  });
});

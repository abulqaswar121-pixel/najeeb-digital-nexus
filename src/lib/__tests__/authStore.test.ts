import { describe, it, expect, beforeEach } from "vitest";
import { loginWithCredentials, logoutUser, getAuthUser, DEMO_ACCOUNT_PASSWORD } from "../authStore";

describe("authStore.loginWithCredentials", () => {
  beforeEach(() => {
    logoutUser();
    window.localStorage.clear();
  });

  it("rejects an unknown email", () => {
    const result = loginWithCredentials("nobody@example.com", "whatever");
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/no account found/i);
    expect(getAuthUser()).toBeNull();
  });

  it("rejects a known email with the wrong password", () => {
    const result = loginWithCredentials("folake@kobopay.com", "wrong-password");
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/incorrect password/i);
    expect(getAuthUser()).toBeNull();
  });

  it("rejects a known email by itself (guessing an email is not enough)", () => {
    // Regression test: the email-guessing login bypass that was fixed must
    // never come back. Supplying any random string as the password must not
    // succeed just because the email matches a seeded demo account.
    const result = loginWithCredentials("folake@kobopay.com", "admin");
    expect(result.success).toBe(false);
  });

  it("accepts a known email with the correct demo password", () => {
    const result = loginWithCredentials("folake@kobopay.com", DEMO_ACCOUNT_PASSWORD);
    expect(result.success).toBe(true);
    expect(result.user?.email).toBe("folake@kobopay.com");
    expect(getAuthUser()?.email).toBe("folake@kobopay.com");
  });

  it("logout clears the current session", () => {
    loginWithCredentials("folake@kobopay.com", DEMO_ACCOUNT_PASSWORD);
    expect(getAuthUser()).not.toBeNull();
    logoutUser();
    expect(getAuthUser()).toBeNull();
    expect(window.localStorage.getItem("ndh_auth_session")).toBeNull();
  });
});

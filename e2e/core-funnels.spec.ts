import { test, expect } from "@playwright/test";

// These tests exercise the core "does the business actually receive this
// submission" funnels identified in AUDIT_REPORT.md. They could not be
// executed inside the agent sandbox (no system package access to install
// Playwright's browser binaries) -- run `npx playwright install` once on a
// normal machine/CI runner, then `npm run test:e2e`.

test.describe("Public lead-generation funnel reaches operations", () => {
  test("a submitted project brief appears live in the PM portal's triage tab", async ({ page }) => {
    await page.goto("/");

    // Open the brief wizard from the primary header CTA.
    await page
      .getByRole("button", { name: /get started/i })
      .first()
      .click();
    await expect(page.getByText("NDH Agency • Request a Tailored Proposal")).toBeVisible();

    // Step through the wizard to the contact details step and submit.
    // (Selectors are intentionally resilient/text-based since there is no
    // routing yet to deep-link into wizard steps.)
    const nextButton = page.getByRole("button", { name: /next|continue/i });
    while (await nextButton.isVisible().catch(() => false)) {
      await nextButton.click();
    }

    await page.getByPlaceholder(/company/i).fill("Playwright Test Co");
    await page.getByPlaceholder(/email/i).first().fill("qa@playwright-test.example");
    await page.getByRole("button", { name: /submit|request a tailored proposal/i }).click();

    // Close the wizard, log in as the demo PM account, and confirm the live
    // brief we just submitted shows up (not just the hardcoded sample leads).
    await page
      .getByRole("button", { name: /sign in/i })
      .first()
      .click();
    await page.getByRole("button", { name: "Project Manager" }).click();
    await page.getByRole("button", { name: /^sign in$/i }).click();

    await page.getByRole("button", { name: /triage/i }).click();
    await expect(page.getByText("Live Inbound Submissions")).toBeVisible();
    await expect(page.getByText("Playwright Test Co")).toBeVisible();
  });
});

test.describe("Authentication", () => {
  test("logging in with a correct demo account reaches its own portal", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: /sign in/i })
      .first()
      .click();
    await page.getByRole("button", { name: "Super Admin" }).click();
    await page.getByRole("button", { name: /^sign in$/i }).click();
    await expect(page.getByText(/command center|platform telemetry/i)).toBeVisible();
  });

  test("a known email with a wrong password is rejected (no email-guessing bypass)", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: /sign in/i })
      .first()
      .click();
    await page.getByPlaceholder(/folake@kobopay.com/i).fill("najeeb@ndh.com.ng");
    await page.getByPlaceholder(/•{3,}/).fill("not-the-real-password");
    await page.getByRole("button", { name: /^sign in$/i }).click();
    await expect(page.getByText(/incorrect password/i)).toBeVisible();
  });
});

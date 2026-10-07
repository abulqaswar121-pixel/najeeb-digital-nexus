import { test, expect } from "@playwright/test";

// These tests exercise the core "does the business actually receive this
// submission" funnels identified in AUDIT_REPORT.md. Locally they need
// `npx playwright install` once; CI runs them on ubuntu-latest.

/**
 * Opens the header sign-in modal. The dev server hydrates after first paint, so
 * the click is retried until the form is on screen — and skipped when the modal
 * is already open, since the header button then sits under the overlay.
 */
async function openSignIn(page: import("@playwright/test").Page) {
  const dialog = page.getByRole("dialog", { name: /sign in/i });
  await expect(async () => {
    if (!(await dialog.isVisible())) {
      await page
        .getByRole("button", { name: /^sign in$/i })
        .first()
        .click();
    }
    await expect(dialog.getByPlaceholder(/you@company\.com/i)).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 20_000 });
  return dialog;
}

/** Signs in through the header modal with a seeded demo account. */
async function signInAs(page: import("@playwright/test").Page, email: string) {
  const dialog = await openSignIn(page);
  await dialog.getByPlaceholder(/you@company\.com/i).fill(email);
  await dialog.getByPlaceholder(/•+/).fill("NDHDemo2026!");
  await dialog.getByRole("button", { name: /sign in to workspace/i }).click();

  // The modal closes on success; a rejected attempt renders the server's
  // message in a red panel. Fail with that text instead of a bare timeout.
  const errorPanel = dialog.locator(".text-red-300").first();
  await expect(async () => {
    const settled = !(await dialog.isVisible()) || (await errorPanel.count()) > 0;
    expect(settled, "sign-in settled (modal closed, or rejected)").toBe(true);
  }).toPass({ timeout: 30_000 });

  if (await errorPanel.count()) {
    throw new Error(`sign-in failed for ${email}: ${(await errorPanel.textContent())?.trim()}`);
  }
}

test.describe("Public lead-generation funnel reaches operations", () => {
  test("a submitted project brief appears live in the PM portal's triage tab", async ({ page }) => {
    await page.goto("/");

    // Open the brief wizard from the primary header CTA. The dev server
    // hydrates after first paint, so retry the click until the dialog is up.
    const wizard = page.getByRole("dialog", { name: /project brief wizard/i });
    await expect(async () => {
      await page
        .getByRole("button", { name: /start a project/i })
        .first()
        .click();
      await expect(wizard).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 20_000 });
    await expect(page.getByText("NDH Agency • Request a Tailored Proposal")).toBeVisible();

    // Step 1 — pick the department the brief is for, then advance. The wizard
    // grid renders the full department name from SERVICE_DEPARTMENTS.
    await wizard.getByText("Website & Full-Stack Web Development", { exact: true }).first().click();
    await wizard.getByRole("button", { name: /next: scope & budget/i }).click();

    // Step 2 — the objective is a required field before the wizard advances.
    await wizard
      .getByPlaceholder(/describe what you want to build/i)
      .fill("Acceptance run: replace a legacy intake form with a scoped client portal.");
    await wizard.getByRole("button", { name: /next: organization details/i }).click();

    // Step 3 — organization + authorized contact, then submit the brief.
    await wizard.getByPlaceholder(/kobopay global limited/i).fill("Playwright Test Co");
    await wizard.getByPlaceholder(/folake adeleke \(cpo\)/i).fill("QA Harness (Automation)");
    await wizard.getByPlaceholder(/folake@company\.com/i).fill("qa@playwright-test.example");
    await wizard.getByRole("button", { name: /submit brief & dispatch pm triage/i }).click();
    await expect(wizard.getByText(/brief successfully received/i)).toBeVisible({ timeout: 15_000 });

    // Close the wizard so the header chrome is clickable again.
    await wizard.getByRole("button", { name: /close & return/i }).click();
    await expect(wizard).toBeHidden();

    await signInAs(page, "tariq.pm@agency.ndh.com.ng");

    // The portal is a lazy chunk: wait for the tab itself rather than assuming
    // it is on screen the moment the session cookie lands.
    const triageTab = page.getByRole("button", { name: /triage/i });
    await expect(triageTab).toBeVisible({ timeout: 45_000 });
    await triageTab.click();
    await expect(page.getByText("Live Inbound Submissions")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Playwright Test Co")).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("Authentication", () => {
  test("logging in with a correct demo account reaches its own portal", async ({ page }) => {
    await page.goto("/");
    await signInAs(page, "najeeb@ndh.com.ng");
    await expect(page.getByText(/platform telemetry/i).first()).toBeVisible({ timeout: 45_000 });
  });

  test("a known email with a wrong password is rejected (no email-guessing bypass)", async ({
    page,
  }) => {
    await page.goto("/");
    const dialog = await openSignIn(page);

    await dialog.getByPlaceholder(/you@company\.com/i).fill("najeeb@ndh.com.ng");
    await dialog.getByPlaceholder(/•+/).fill("not-the-real-password");
    await dialog.getByRole("button", { name: /sign in to workspace/i }).click();
    await expect(page.getByText(/incorrect password/i)).toBeVisible({ timeout: 15_000 });
  });
});

import { defineConfig, devices } from "@playwright/test";

// NOTE: this sandbox cannot `npx playwright install --with-deps` (no apt
// access), so these e2e tests are written and wired into CI but have not
// been executed in this environment. Run `npx playwright install` once on a
// machine/CI runner with normal internet access before running `npm run
// test:e2e`.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run build && npm run preview -- --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env["CI"],
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

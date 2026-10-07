import { defineConfig, devices } from "@playwright/test";

// Locally, run `npx playwright install` once before `npm run test:e2e`. The
// CI job (see .github/workflows/ci.yml) installs the browser with
// `--with-deps` on ubuntu-latest and runs the same command.
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
  // Two coordinated servers, mirroring production: the SSR/static frontend
  // (Vite preview, with its `/api` proxy) plus the Express API on 8787 that
  // the proxy forwards to. Without the second entry every data-backed spec
  // (logins, portals, case studies) would fail against a dead API.
  webServer: [
    {
      command: "npm run server:dev",
      url: "http://localhost:8787/api/health",
      reuseExistingServer: !process.env["CI"],
      timeout: 60_000,
    },
    {
      command: "npm run build && npm run preview -- --port 4173",
      url: "http://localhost:4173",
      reuseExistingServer: !process.env["CI"],
      timeout: 180_000,
    },
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

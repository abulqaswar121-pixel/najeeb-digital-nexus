import { defineConfig, devices } from "@playwright/test";

// Locally, run `npx playwright install` once before `npm run test:e2e`; the
// suite boots the dev server itself and reuses one that is already running.
// CI (see .github/workflows/ci.yml) installs the browser with `--with-deps`
// on ubuntu-latest and runs the same command.
export default defineConfig({
  testDir: "./e2e",
  // The suite runs against the dev server, which compiles route chunks on
  // demand: a first render of a heavy portal can take tens of seconds under
  // parallel workers, so the default 30s per test is not enough headroom.
  timeout: 120_000,
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  // `list` so CI logs (and the failure digest the workflow posts on the PR)
  // carry the assertion text; `html` for the uploaded report.
  reporter: process.env["CI"] ? [["list"], ["html"]] : "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    // `npm run dev` boots both halves: the Vite SSR dev server on 3000 and the
    // Express API on 8787 that its `/api` proxy targets. The production build
    // targets Cloudflare Workers (`vite preview` cannot serve it), so the
    // acceptance suite runs against the dev server rather than a preview.
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env["CI"],
    timeout: 180_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

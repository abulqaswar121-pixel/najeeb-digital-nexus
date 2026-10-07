import { test, expect } from "@playwright/test";

/**
 * Acceptance tests for the "Precision Gateway" brand/ecosystem alignment.
 *
 * Like `core-funnels.spec.ts`, these cannot run inside the agent sandbox (no
 * system package access to install Playwright's browser binaries). Run
 * `npx playwright install` once on a machine/CI runner with normal internet
 * access, then `npm run test:e2e`.
 *
 * They cover the criteria that can only be verified in a real layout engine —
 * above all the 360px "zero horizontal scrollbar" requirement, which cannot be
 * checked with SSR HTML or a static CSS audit because it depends on computed
 * flex/truncation behaviour.
 */

const DEMO_PASSWORD = "NDHDemo2026!";

const PORTALS = [
  { path: "/portal/admin", email: "najeeb@ndh.com.ng" },
  { path: "/portal/client", email: "folake@kobopay.com" },
  { path: "/portal/pm", email: "tariq.pm@agency.ndh.com.ng" },
  { path: "/portal/talent", email: "alpha.dev@network.ndh.com.ng" },
];

const PUBLIC_PAGES = ["/", "/services", "/case-studies", "/about", "/contact", "/talent-network"];

/** Asserts the document does not scroll sideways at the current viewport. */
async function expectNoHorizontalScroll(page: import("@playwright/test").Page, label: string) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    scrollWidth,
    `${label}: horizontal overflow (${scrollWidth} > ${clientWidth})`,
  ).toBeLessThanOrEqual(clientWidth);
}

test.describe("Mobile layout at 360px has zero horizontal scrolling", () => {
  test.use({ viewport: { width: 360, height: 780 } });

  for (const path of PUBLIC_PAGES) {
    test(`public page ${path} fits the viewport`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page, path);
    });
  }

  test("the mobile drawer holds only agency destinations", async ({ page }) => {
    await page.goto("/");

    const header = page.locator("header");
    const drawerNav = header.locator("nav[aria-label='Mobile navigation']");
    await expect(async () => {
      await page.getByRole("button", { name: /toggle navigation menu/i }).click();
      await expect(drawerNav).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 20_000 });

    // The retired ecosystem switcher must not resurface in the drawer.
    await expect(header.locator(".gw-menu-panel")).toHaveCount(0);
    await expect(header.getByRole("button", { name: /ecosystem/i })).toHaveCount(0);

    await expectNoHorizontalScroll(page, "/ with the drawer open");
  });

  for (const { path, email } of PORTALS) {
    test(`portal ${path} header fits the viewport`, async ({ page }) => {
      // `page.request` shares the browser context's cookie jar, so logging in
      // through the API gives us the same httpOnly session cookie the UI sets.
      const res = await page.request.post("/api/auth/login", {
        data: { email, password: DEMO_PASSWORD },
      });
      expect(res.ok(), `login for ${email}`).toBeTruthy();

      await page.goto(path);
      // Portals are lazy + auth-gated, so wait for the real header to replace
      // the loading fallback. The chunk is compiled on demand by the dev
      // server, so allow a generous window and only match a displayed lockup
      // (the header renders a mobile and a desktop one).
      await expect(page.locator("header .ndh-family-sector:visible").first()).toBeVisible({
        timeout: 30_000,
      });
      await expectNoHorizontalScroll(page, path);
    });
  }
});

test.describe("Open Gateway master mark + agency sector badge", () => {
  test("renders in the header and footer of a public page", async ({ page }) => {
    await page.goto("/");

    // The header renders a small (mobile) and a medium (desktop) lockup; only
    // one is displayed at a given viewport.
    await expect(page.locator("header .ndh-family-symbol:visible").first()).toBeVisible();
    await expect(page.locator("footer .ndh-family-symbol:visible").first()).toBeVisible();

    // The sector badge is what distinguishes the agency from its siblings.
    await expect(page.locator("header .ndh-family-sector:visible").first()).toBeVisible();
    await expect(page.locator("footer .ndh-family-sector:visible").first()).toBeVisible();

    // The master mark must load the real gateway artwork, not a placeholder.
    const tile = page.locator("header .ndh-family-tile img:visible").first();
    await expect(tile).toHaveAttribute("src", /ndh-logo-gateway-cropped/);
    expect(await tile.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  });

  test("renders in every portal header", async ({ page }) => {
    for (const { path, email } of PORTALS) {
      await page.request.post("/api/auth/login", {
        data: { email, password: DEMO_PASSWORD },
      });
      await page.goto(path);
      await expect(
        page.locator("header .ndh-family-sector:visible").first(),
        `sector badge in ${path}`,
      ).toBeVisible({ timeout: 30_000 });
    }
  });

  test("header lockup carries the wordmark, sub-label and bureau badge", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".ndh-brand-wordmark").first()).toContainText("NAJEEB DIGITAL HUB");
    await expect(page.locator(".ndh-brand-sublabel").first()).toContainText(/NDH Agency/i);
    await expect(page.locator(".ndh-brand-badge").first()).toContainText(/Managed Digital Bureau/i);
  });
});

test.describe("Agency header isolation (ecosystem lives in the footer)", () => {
  const AGENCY_LINKS = [
    "Services",
    "Case Studies",
    "How It Works",
    "Talent Network",
    "Insights",
    "Contact",
  ];

  test("carries exactly the six agency destinations plus the CTA", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");

    for (const label of AGENCY_LINKS) {
      await expect(
        header.getByRole("button", { name: label, exact: true }).first(),
        `header destination ${label}`,
      ).toBeVisible();
    }

    await expect(header.getByRole("button", { name: /start a project/i })).toBeVisible();
  });

  test("never renders a sibling, parent or ecosystem promotion", async ({ page }) => {
    for (const path of ["/", "/services", "/case-studies", "/contact"]) {
      await page.goto(path);
      const header = page.locator("header");

      await expect(header.locator(".gw-menu-panel"), `switcher on ${path}`).toHaveCount(0);
      await expect(header.locator(".ndh-academy-promo"), `academy card on ${path}`).toHaveCount(0);

      const hrefs = await header
        .locator("a")
        .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
      for (const href of hrefs) {
        expect(href, `sibling link in header on ${path}: ${href}`).not.toMatch(
          /academy\.ndh\.com\.ng|estore\.ndh\.com\.ng|venture\.ndh\.com\.ng|^https?:\/\/ndh\.com\.ng/,
        );
      }

      const text = (await header.innerText()).toLowerCase();
      expect(text, `ecosystem copy in header on ${path}`).not.toMatch(
        /ecosystem|ndh academy|ndh estore|ndh agricapital|school\s?desk|ndh travel|ndh ihospital/,
      );
    }
  });

  test("keeps the header 100% agency-focused in the 360px drawer too", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/");

    const drawer = page.locator("nav[aria-label='Mobile navigation']");
    await expect(async () => {
      await page.getByRole("button", { name: /toggle navigation menu/i }).click();
      await expect(drawer).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 20_000 });
    for (const label of AGENCY_LINKS) {
      await expect(drawer.getByRole("button", { name: label, exact: true }).first()).toBeVisible();
    }
    await expect(drawer.getByText(/academy|estore|ecosystem/i)).toHaveCount(0);
  });
});

test.describe("Footer stays agency-only", () => {
  test("carries no sibling, parent-gateway or Academy promotion", async ({ page }) => {
    for (const path of ["/", "/services", "/about", "/process"]) {
      await page.goto(path);
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();

      // The retired ecosystem blocks must not come back, anywhere on the page.
      await expect(page.locator(".ndh-academy-promo"), `academy promo on ${path}`).toHaveCount(0);
      await expect(
        page.getByRole("region", { name: /the ndh family of businesses/i }),
        `family directory on ${path}`,
      ).toHaveCount(0);
      await expect(footer.getByText(/parent gateway/i)).toHaveCount(0);

      const text = (await footer.innerText()).toLowerCase();
      expect(text, `ecosystem copy in footer on ${path}`).not.toMatch(
        /ecosystem directory|our businesses|coming soon: ndh|explore ndh academy|ndh agricapital|ndh estore|ndh schooldesk/,
      );

      const hrefs = await footer
        .locator("a")
        .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
      for (const href of hrefs) {
        expect(href, `sibling/gateway link in footer on ${path}: ${href}`).not.toMatch(
          /academy\.ndh\.com\.ng|estore\.ndh\.com\.ng|venture\.ndh\.com\.ng|ndhventure|^https?:\/\/ndh\.com\.ng/,
        );
      }
    }
  });

  test("still renders the agency's own directory, contact and guarantees", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");

    await expect(footer).toHaveClass(/band-dark/);
    await expect(footer.getByText(/hello@ndh\.com\.ng/).first()).toBeVisible();
    await expect(footer.getByText(/Dual-Key Escrow Guarantee/i).first()).toBeVisible();
    await expect(footer.getByText(/privacy policy/i).first()).toBeVisible();
  });
});

test.describe("Master typography stack", () => {
  test("Space Grotesk and DM Sans are loaded and applied", async ({ page }) => {
    await page.goto("/");

    const loaded = await page.evaluate(async () => {
      // `document.fonts.ready` only resolves for faces already requested, so
      // pull the two families in explicitly before checking them.
      await Promise.all([
        document.fonts.load('600 16px "Space Grotesk"'),
        document.fonts.load('400 16px "DM Sans"'),
      ]);
      await document.fonts.ready;
      return {
        display: document.fonts.check('600 16px "Space Grotesk"'),
        body: document.fonts.check('400 16px "DM Sans"'),
      };
    });
    expect(loaded.display, "Space Grotesk available").toBeTruthy();
    expect(loaded.body, "DM Sans available").toBeTruthy();

    const headingFont = await page
      .locator("h1")
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(headingFont).toContain("Space Grotesk");

    const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(bodyFont).toContain("DM Sans");
  });
});

test.describe("Redesigned internal pages share the Academy rhythm", () => {
  const PAGES = [
    "/services",
    "/case-studies",
    "/about",
    "/process",
    "/talent-network",
    "/insights",
    "/contact",
  ];

  for (const path of PAGES) {
    test(`${path} renders a navy hero over a porcelain body`, async ({ page }) => {
      await page.goto(path);

      // Deep-navy page hero with ambient glow, porcelain body below it.
      await expect(page.locator("section.gw-page-hero")).toBeVisible();
      await expect(page.locator(".gw-page-body")).toBeVisible();

      const backgroundColor = await page
        .locator(".gw-page-body")
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(backgroundColor, `porcelain body on ${path}`).toBe("rgb(241, 244, 250)");
    });
  }
});

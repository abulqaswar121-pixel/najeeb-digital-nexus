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

  test("the ecosystem switcher opens as a sheet without overflowing", async ({ page }) => {
    await page.goto("/");

    // Below 768px the switcher lives in the drawer, so open that first.
    await page.getByRole("button", { name: /toggle navigation menu/i }).click();
    await page.getByRole("button", { name: /ndh ecosystem menu/i }).click();

    const panel = page.locator(".gw-menu-panel");
    await expect(panel).toBeVisible();

    const box = await panel.boundingBox();
    expect(box, "panel must be laid out").not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(360);

    await expectNoHorizontalScroll(page, "/ with switcher open");
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
      // the loading fallback.
      await page.locator("header .ndh-family-sector").first().waitFor({ timeout: 15_000 });
      await expectNoHorizontalScroll(page, path);
    });
  }
});

test.describe("Open Gateway master mark + agency sector badge", () => {
  test("renders in the header and footer of a public page", async ({ page }) => {
    await page.goto("/");

    const header = page.locator("header .ndh-family-symbol");
    await expect(header.first()).toBeVisible();

    const footer = page.locator("footer .ndh-family-symbol");
    await expect(footer.first()).toBeVisible();

    // The sector badge is what distinguishes the agency from its siblings.
    await expect(page.locator("header .ndh-family-sector").first()).toBeVisible();
    await expect(page.locator("footer .ndh-family-sector").first()).toBeVisible();

    // The master mark must load the real gateway artwork, not a placeholder.
    const tile = page.locator("header .ndh-family-tile img").first();
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
        page.locator("header .ndh-family-sector").first(),
        `sector badge in ${path}`,
      ).toBeVisible({ timeout: 15_000 });
    }
  });

  test("header lockup carries the wordmark, sub-label and bureau badge", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".ndh-brand-wordmark").first()).toContainText("NAJEEB DIGITAL HUB");
    await expect(page.locator(".ndh-brand-sublabel").first()).toContainText(/NDH Agency/i);
    await expect(page.locator(".ndh-brand-badge").first()).toContainText(/Managed Digital Bureau/i);
  });
});

test.describe("Precision Gateway ecosystem switcher", () => {
  test("lists the family with the right destinations and statuses", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /ndh ecosystem menu/i }).click();

    const panel = page.locator(".gw-menu-panel");
    await expect(panel).toBeVisible();

    // The agency is the current destination, so it is marked rather than linked.
    await expect(panel.locator(".gw-menu-item.is-here")).toContainText("NDH Agency");

    // Live siblings link to their own subdomains/deployments.
    const academy = panel.locator(".gw-menu-item", { hasText: "NDH Academy" });
    await expect(academy).toHaveAttribute("href", "https://academy.ndh.com.ng");

    const estore = panel.locator(".gw-menu-item", { hasText: "NDH eStore" });
    await expect(estore).toHaveAttribute("href", "https://estore.ndh.com.ng");

    // Coming-soon siblings are not actionable.
    const schoolDesk = panel.locator(".gw-menu-item.is-soon", { hasText: "NDH SchoolDesk" });
    await expect(schoolDesk).toBeVisible();
    await expect(schoolDesk).toContainText(/Coming Soon/i);

    // The parent gateway is reachable from the panel.
    await expect(panel.locator(".gw-menu-all")).toHaveAttribute("href", "https://ndh.com.ng");
  });

  test("closes on Escape and on outside click", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /ndh ecosystem menu/i });
    const panel = page.locator(".gw-menu-panel");

    await trigger.click();
    await expect(panel).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();

    await trigger.click();
    await expect(panel).toBeVisible();
    await page.locator("footer").click({ position: { x: 5, y: 5 } });
    await expect(panel).toBeHidden();
  });
});

test.describe("Footer ecosystem cross-references", () => {
  test("Academy cross-promotion card is present on every page", async ({ page }) => {
    for (const path of ["/", "/services", "/about"]) {
      await page.goto(path);
      const card = page.locator(".ndh-academy-promo");
      await expect(card, `academy card on ${path}`).toBeVisible();
      await expect(card).toContainText(/Looking to build your skills or train your team/i);
      await expect(card.getByRole("link", { name: /explore ndh academy/i })).toHaveAttribute(
        "href",
        "https://academy.ndh.com.ng",
      );
    }
  });

  test("sibling directory links every non-coming subsidiary", async ({ page }) => {
    await page.goto("/");
    const band = page.getByRole("region", { name: /the ndh family of businesses/i });
    await expect(band).toBeVisible();
    await expect(band.getByRole("link", { name: /parent gateway/i })).toHaveAttribute(
      "href",
      "https://ndh.com.ng",
    );
    for (const domain of ["academy.ndh.com.ng", "estore.ndh.com.ng"]) {
      await expect(band, `sibling ${domain}`).toContainText(domain);
    }
    await expect(band).toContainText(/Coming Soon/i);
  });
});

test.describe("Master typography stack", () => {
  test("Space Grotesk and DM Sans are loaded and applied", async ({ page }) => {
    await page.goto("/");

    const loaded = await page.evaluate(async () => {
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

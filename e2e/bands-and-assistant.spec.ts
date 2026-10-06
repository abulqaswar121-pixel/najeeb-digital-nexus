import { test, expect } from "@playwright/test";

/**
 * Acceptance tests for the alternating band rhythm and the unified floating AI
 * assistant.
 *
 * These assert *computed* layout and colour values, which is the only way to
 * verify the criteria that SSR HTML and static CSS inspection cannot:
 *   - no horizontal scrollbar at 360px,
 *   - the launcher's real box/position and that it clears the viewport edge,
 *   - measured contrast ratios inside the light bands.
 *
 * Run `npx playwright install` once on a machine with normal internet access,
 * then `npm run test:e2e`.
 */

/** Parses `rgb(...)` / `rgba(...)` into sRGB channels. */
function parseRgb(value: string): [number, number, number] | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1]!
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  if (parts.length < 3) return null;
  return [parts[0]!, parts[1]!, parts[2]!];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrastRatio(fg: string, bg: string): number | null {
  const a = parseRgb(fg);
  const b = parseRgb(bg);
  if (!a || !b) return null;
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

test.describe("Alternating band rhythm on the homepage", () => {
  test("bands alternate dark / white / porcelain / white / porcelain", async ({ page }) => {
    await page.goto("/");

    const bands = await page.$$eval("section.gw-band", (els) =>
      els.map((el) => {
        const cs = getComputedStyle(el);
        const kind = el.classList.contains("gw-band-hero")
          ? "hero"
          : el.classList.contains("gw-band-white")
            ? "white"
            : el.classList.contains("gw-band-porcelain")
              ? "porcelain"
              : "unknown";
        return { kind, background: cs.backgroundColor, backgroundImage: cs.backgroundImage };
      }),
    );

    expect(bands.map((b) => b.kind)).toEqual(["hero", "white", "porcelain", "white", "porcelain"]);

    // The hero band must actually be dark, and the light bands actually light.
    const heroLum = relativeLuminance(parseRgb(bands[0]!.background) ?? [0, 0, 0]);
    expect(heroLum, "hero band is dark").toBeLessThan(0.2);

    for (const band of bands.slice(1)) {
      const lum = relativeLuminance(parseRgb(band.background) ?? [0, 0, 0]);
      expect(lum, `${band.kind} band is light`).toBeGreaterThan(0.8);
    }

    // White and porcelain must be distinguishable from each other.
    expect(bands[1]!.background).not.toBe(bands[2]!.background);
  });

  test("body text inside light bands meets WCAG AA (>= 4.5:1)", async ({ page }) => {
    await page.goto("/");

    const results = await page.$$eval(".gw-band-white, .gw-band-porcelain", (bands) => {
      // Walk up to the nearest ancestor that actually paints a background.
      const effectiveBg = (el: Element): string => {
        let node: Element | null = el;
        while (node && node !== document.documentElement) {
          const cs = getComputedStyle(node);
          const parsed = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
          if (parsed) {
            const parts = parsed[1]!.split(/[\s,/]+/).filter(Boolean);
            const alpha = parts[3];
            if (alpha === undefined || Number(alpha) > 0.85) return cs.backgroundColor;
          }
          if (cs.backgroundImage && cs.backgroundImage !== "none") return "rgb(255, 255, 255)";
          node = node.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };

      const out: { text: string; color: string; bg: string; tag: string }[] = [];
      for (const band of bands) {
        // Skip photo plates: their overlay text is intentionally light-on-dark.
        const nodes = band.querySelectorAll<HTMLElement>(
          "h1, h2, h3, h4, p, span, button, a, li, div",
        );
        for (const node of nodes) {
          if (node.closest(".gw-photo-plate")) continue;
          const direct = [...node.childNodes].some(
            (n) => n.nodeType === 3 && n.textContent?.trim(),
          );
          if (!direct) continue; // only measure elements with their own text
          out.push({
            text: (node.textContent ?? "").trim().slice(0, 40),
            tag: node.tagName.toLowerCase(),
            color: getComputedStyle(node).color,
            bg: effectiveBg(node),
          });
        }
      }
      return out;
    });

    expect(results.length, "measured a meaningful sample of text nodes").toBeGreaterThan(20);

    const failures = results
      .map((r) => ({ ...r, ratio: contrastRatio(r.color, r.bg) }))
      .filter((r) => r.ratio !== null && r.ratio < 4.5);

    expect(failures, `low-contrast text: ${JSON.stringify(failures.slice(0, 8), null, 1)}`).toEqual(
      [],
    );
  });

  test("photography keeps light overlay captions legible", async ({ page }) => {
    await page.goto("/");
    const plate = page.locator(".gw-photo-plate").first();
    await expect(plate).toBeVisible();

    const heading = plate.locator("h3").first();
    const color = await heading.evaluate((el) => getComputedStyle(el).color);
    // Overlay text must stay light, not be inverted to near-black by the band.
    const lum = relativeLuminance(parseRgb(color) ?? [0, 0, 0]);
    expect(lum, `overlay caption colour ${color}`).toBeGreaterThan(0.6);
  });
});

test.describe("Floating AI assistant launcher", () => {
  test("is a 62px circular button pinned 20px from the bottom-right", async ({ page }) => {
    await page.goto("/");
    const launcher = page.locator(".ai-assistant-launcher");
    await expect(launcher).toBeVisible();

    const box = await launcher.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box!.width)).toBe(62);
    expect(Math.round(box!.height)).toBe(62);

    const pos = await launcher.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        position: cs.position,
        right: cs.right,
        bottom: cs.bottom,
        z: cs.zIndex,
        radius: cs.borderRadius,
      };
    });
    expect(pos.position).toBe("fixed");
    expect(pos.right).toBe("20px");
    expect(pos.bottom).toBe("20px");
    expect(Number(pos.z)).toBe(70);
    // Circular: border-radius resolves to half the box.
    expect(parseFloat(pos.radius)).toBeGreaterThanOrEqual(31);
  });

  test("avatar loads sharply and the orbit ring + status dot are present", async ({ page }) => {
    await page.goto("/");

    const avatar = page.locator(".ai-assistant-avatar");
    await expect(avatar).toBeVisible();
    const img = await avatar.evaluate((el) => {
      const i = el as HTMLImageElement;
      const cs = getComputedStyle(el);
      return {
        natural: i.naturalWidth,
        rendered: el.getBoundingClientRect().width,
        objectFit: cs.objectFit,
        objectPosition: cs.objectPosition,
        radius: cs.borderRadius,
      };
    });
    expect(img.natural, "source artwork is high resolution").toBeGreaterThanOrEqual(512);
    // Rendered at ~54px from an 816px source => crisp, not upscaled.
    expect(img.natural / Math.max(img.rendered, 1)).toBeGreaterThan(4);
    expect(img.objectFit).toBe("cover");
    expect(img.objectPosition.replace(/\s/g, "")).toBe("50%9%");

    await expect(page.locator(".ai-assistant-orbit")).toBeVisible();
    await expect(page.locator(".ai-assistant-status")).toBeVisible();

    const orbit = await page.locator(".ai-assistant-orbit").evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        animation: cs.animationName,
        duration: cs.animationDuration,
        radius: cs.borderRadius,
      };
    });
    expect(orbit.animation).toContain("ai-assistant-orbit");
    expect(orbit.duration).toBe("7s");
    expect(parseFloat(orbit.radius)).toBeGreaterThanOrEqual(50);
  });

  test("micro-greeting pill shows, opens the drawer, and can be dismissed", async ({ page }) => {
    await page.goto("/");
    const pill = page.locator(".ai-assistant-greeting");
    await expect(pill).toBeVisible();
    await expect(pill).toContainText(/Need a quote or technical team/i);

    await pill.getByRole("button", { name: /^ask$/i }).click();
    await expect(page.getByRole("dialog", { name: /ndh sentinel ai assistant/i })).toBeVisible();
    // The launcher yields to the open drawer.
    await expect(page.locator(".ai-assistant-launcher")).toHaveCount(0);
  });

  test("dismissing the greeting keeps the launcher", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /dismiss ai assistant greeting/i }).click();
    await expect(page.locator(".ai-assistant-greeting")).toHaveCount(0);
    await expect(page.locator(".ai-assistant-launcher")).toBeVisible();
  });

  test("drawer offers the five agency quick actions", async ({ page }) => {
    await page.goto("/");
    await page.locator(".ai-assistant-launcher").click();
    const dialog = page.getByRole("dialog", { name: /ndh sentinel ai assistant/i });

    for (const label of [
      "Submit a Project Brief",
      "Estimate Delivery Timeline",
      "Explore Case Studies",
      "Book a Strategy Consultation",
      "Ask about NDH Academy & Courses",
    ]) {
      await expect(dialog.getByRole("button", { name: label }), label).toBeVisible();
    }
  });
});

test.describe("Mobile 360px: no horizontal scroll, launcher clear of the viewport", () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test("the banded homepage does not scroll sideways", async ({ page }) => {
    await page.goto("/");
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test("launcher and greeting pill stay fully inside the viewport", async ({ page }) => {
    await page.goto("/");

    for (const selector of [".ai-assistant-launcher", ".ai-assistant-greeting"]) {
      const box = await page.locator(selector).boundingBox();
      expect(box, `${selector} is laid out`).not.toBeNull();
      expect(box!.x, `${selector} left edge`).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width, `${selector} right edge`).toBeLessThanOrEqual(360);
      expect(box!.y + box!.height, `${selector} bottom edge`).toBeLessThanOrEqual(780);
    }
  });

  test("light bands do not overflow the viewport either", async ({ page }) => {
    await page.goto("/");
    const overflowing = await page.$$eval(".gw-band", (els) =>
      els
        .map((el) => ({ cls: el.className, right: el.getBoundingClientRect().right }))
        .filter((b) => b.right > window.innerWidth + 1),
    );
    expect(overflowing, `bands overflowing: ${JSON.stringify(overflowing)}`).toEqual([]);
  });

  test("no element anywhere causes sideways overflow", async ({ page }) => {
    await page.goto("/");
    const offenders = await page.evaluate(() => {
      const limit = document.documentElement.clientWidth;
      return [...document.querySelectorAll<HTMLElement>("*")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > limit + 1 && getComputedStyle(el).position !== "fixed";
        })
        .slice(0, 10)
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 80),
          right: Math.round(el.getBoundingClientRect().right),
        }));
    });
    expect(
      offenders,
      `elements past the right edge: ${JSON.stringify(offenders, null, 1)}`,
    ).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { AgencySectorMark } from "../AgencySectorMark";
import { BrandLogo } from "../BrandLogo";
import { NdhFamilySymbol } from "../NdhFamilySymbol";
import { FamilyMenu } from "../../layout/FamilyMenu";
import { AcademyCrossPromo } from "../../layout/AcademyCrossPromo";
import { FamilyFooterLinks } from "../../layout/FamilyFooterLinks";
import {
  COMING_SUBSIDIARY_COUNT,
  LIVE_SUBSIDIARY_COUNT,
  SUBSIDIARIES,
  getSubsidiary,
  siblingSubsidiaries,
  subsidiaryHref,
} from "@/lib/ecosystem";

/**
 * DOM-level coverage for the "Precision Gateway" brand/ecosystem alignment.
 *
 * The portal headers are lazy + auth-gated, so SSR never emits them and the
 * e2e suite can't run in this sandbox (no browser binaries). These tests give
 * real rendered-DOM evidence that the Open Gateway mark and its sector badge
 * exist, and that the switcher/footer expose the correct family destinations.
 */

describe("Open Gateway master mark", () => {
  it("renders the gateway tile and nothing else when no sector icon is given", () => {
    const { container } = render(<NdhFamilySymbol />);
    expect(container.querySelector(".ndh-family-tile img")).not.toBeNull();
    expect(container.querySelector(".ndh-family-sector")).toBeNull();
  });

  it("integrates the sector icon into the lower corner when provided", () => {
    const { container } = render(<AgencySectorMark />);
    const sector = container.querySelector(".ndh-family-sector");
    expect(sector).not.toBeNull();
    // The agency's sector icon is lucide's BriefcaseBusiness.
    expect(sector!.querySelector("svg.lucide-briefcase-business")).not.toBeNull();
  });

  it("applies the requested size variant class", () => {
    const { container } = render(<AgencySectorMark size="lg" />);
    expect(container.querySelector(".ndh-family-symbol--lg")).not.toBeNull();
  });

  it("is decorative (aria-hidden) so screen readers get the text lockup instead", () => {
    const { container } = render(<AgencySectorMark />);
    expect(container.querySelector(".ndh-family-symbol")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Header brand lockup", () => {
  it("carries the wordmark, sub-label and bureau micro-badge", () => {
    const { container } = render(<BrandLogo size="md" />);
    expect(container.querySelector(".ndh-brand-wordmark")).toHaveTextContent("NAJEEB DIGITAL HUB");
    expect(container.querySelector(".ndh-brand-sublabel")).toHaveTextContent(/NDH Agency/i);
    expect(container.querySelector(".ndh-brand-badge")).toHaveTextContent(
      /Managed Digital Bureau/i,
    );
  });

  it("renders the Open Gateway mark with the agency sector badge", () => {
    const { container } = render(<BrandLogo size="sm" />);
    expect(
      container.querySelector(".ndh-family-sector svg.lucide-briefcase-business"),
    ).not.toBeNull();
  });

  it("can drop the micro-badge for tight headers", () => {
    const { container } = render(<BrandLogo size="sm" compactBadge />);
    expect(container.querySelector(".ndh-brand-badge")).toBeNull();
    // The mark itself must survive — only the badge is dropped.
    expect(container.querySelector(".ndh-family-sector")).not.toBeNull();
  });

  it("lets the wordmark truncate so it cannot force horizontal overflow", () => {
    const { container } = render(<BrandLogo size="sm" className="min-w-0" />);
    expect(container.querySelector(".ndh-brand-wordmark")?.className).toContain("truncate");
    expect(container.querySelector(".ndh-agency-brand")?.className).toContain("min-w-0");
  });
});

describe("Ecosystem data invariants", () => {
  it("describes the whole family exactly once", () => {
    expect(SUBSIDIARIES).toHaveLength(7);
    expect(LIVE_SUBSIDIARY_COUNT).toBe(4);
    expect(COMING_SUBSIDIARY_COUNT).toBe(3);
  });

  it("treats the agency as the current destination", () => {
    expect(getSubsidiary("agency").domain).toBe("agency.ndh.com.ng");
    expect(siblingSubsidiaries().some((s) => s.id === "agency")).toBe(false);
  });

  it("never produces a clickable destination for a coming-soon business", () => {
    for (const s of SUBSIDIARIES.filter((x) => x.state === "coming")) {
      expect(subsidiaryHref(s)).toBe("");
    }
  });

  it("points Academy and eStore at their own subdomains", () => {
    expect(getSubsidiary("academy").href).toBe("https://academy.ndh.com.ng");
    expect(getSubsidiary("estore").href).toBe("https://estore.ndh.com.ng");
  });

  it("throws on an unknown subsidiary rather than rendering a dead link", () => {
    // @ts-expect-error deliberately invalid id
    expect(() => getSubsidiary("nope")).toThrow(/Unknown NDH subsidiary/);
  });
});

describe("Precision Gateway switcher", () => {
  it("server-renders closed and needs no browser API until opened", () => {
    render(<FamilyMenu />);
    const trigger = screen.getByRole("button", { name: /ndh ecosystem menu/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.querySelector(".gw-menu-panel")).toBeNull();
  });

  it("opens to show the family directory, then closes on Escape", () => {
    render(<FamilyMenu />);
    const trigger = screen.getByRole("button", { name: /ndh ecosystem menu/i });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const panel = document.querySelector(".gw-menu-panel")!;
    expect(panel).not.toBeNull();
    expect(within(panel as HTMLElement).getByText("The NDH Family")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.querySelector(".gw-menu-panel")).toBeNull();
  });

  it("marks the agency as current instead of linking to itself", () => {
    render(<FamilyMenu />);
    fireEvent.click(screen.getByRole("button", { name: /ndh ecosystem menu/i }));

    const here = document.querySelector(".gw-menu-item.is-here")!;
    expect(here).not.toBeNull();
    expect(here.textContent).toContain("NDH Agency");
    expect(here.textContent).toContain("Current");
  });

  it("links live siblings to their real destinations", () => {
    render(<FamilyMenu />);
    fireEvent.click(screen.getByRole("button", { name: /ndh ecosystem menu/i }));

    const items = [...document.querySelectorAll<HTMLAnchorElement>("a.gw-menu-item")];
    const hrefs = items.map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("https://academy.ndh.com.ng");
    expect(hrefs).toContain("https://estore.ndh.com.ng");
    // Every rendered anchor must have a real destination.
    for (const href of hrefs) expect(href).toBeTruthy();
  });

  it("renders coming-soon siblings as non-actionable with a status label", () => {
    render(<FamilyMenu />);
    fireEvent.click(screen.getByRole("button", { name: /ndh ecosystem menu/i }));

    const soon = [...document.querySelectorAll(".gw-menu-item.is-soon")];
    expect(soon).toHaveLength(COMING_SUBSIDIARY_COUNT);
    for (const el of soon) {
      expect(el.tagName).toBe("SPAN"); // not an <a>: nowhere to go yet
      expect(el.textContent).toContain("Coming Soon");
    }
  });

  it("offers a route back up to the parent gateway", () => {
    render(<FamilyMenu />);
    fireEvent.click(screen.getByRole("button", { name: /ndh ecosystem menu/i }));

    const all = document.querySelector<HTMLAnchorElement>(".gw-menu-all");
    expect(all).not.toBeNull();
    expect(all!.getAttribute("href")).toBe("https://ndh.com.ng");
  });

  it("reuses the agency's own language store rather than a second i18n system", () => {
    render(<FamilyMenu />);
    fireEvent.click(screen.getByRole("button", { name: /ndh ecosystem menu/i }));

    const langButtons = [
      ...document.querySelectorAll<HTMLButtonElement>(".gw-menu-lang-list button"),
    ];
    expect(langButtons.length).toBeGreaterThan(0);
    expect(langButtons.filter((b) => b.getAttribute("aria-pressed") === "true")).toHaveLength(1);
  });
});

describe("Footer ecosystem cross-references", () => {
  it("carries the Academy cross-promotion with the required copy and destination", () => {
    const { container } = render(<AcademyCrossPromo />);
    expect(container.querySelector(".ndh-academy-promo")).not.toBeNull();
    expect(container.textContent).toContain("Looking to build your skills or train your team?");
    const link = screen.getByRole("link", { name: /explore ndh academy/i });
    expect(link).toHaveAttribute("href", "https://academy.ndh.com.ng");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("shows the Academy's own sector badge, not the agency's", () => {
    const { container } = render(<AcademyCrossPromo />);
    expect(container.querySelector(".ndh-family-sector svg.lucide-book-open")).not.toBeNull();
  });

  it("links the parent gateway and every available sibling", () => {
    const { container } = render(<FamilyFooterLinks />);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("https://ndh.com.ng");
    expect(hrefs).toContain("https://academy.ndh.com.ng");
    expect(hrefs).toContain("https://estore.ndh.com.ng");
    // Coming-soon siblings are named but never linked.
    expect(container.textContent).toContain("Coming Soon");
    expect(container.textContent).toContain("NDH SchoolDesk");
    expect(hrefs).not.toContain("");
  });
});

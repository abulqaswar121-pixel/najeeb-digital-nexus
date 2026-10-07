import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { AIAssistantWidget } from "@/components/ai/AIAssistantWidget";
import { HomepagePreview } from "@/components/directions/views/HomepagePreview";

/**
 * Coverage for the two parent-ecosystem alignments:
 *   1. the alternating light/dark band rhythm on the agency homepage, and
 *   2. the unified floating AI assistant launcher with the official avatar.
 *
 * These are rendered-DOM assertions. Layout-dependent criteria (no horizontal
 * scroll at 360px, the orbit ring's visual rotation) still need a real browser
 * — see e2e/brand-ecosystem.spec.ts.
 */

/* ------------------------------------------------------------------ *
 * 1. Academy contrast rhythm — deep navy → porcelain → white → …
 * ------------------------------------------------------------------ */

function bandSequence(container: HTMLElement): string[] {
  return [...container.querySelectorAll("section.gw-band")].map((el) => {
    if (el.classList.contains("gw-band-hero")) return "hero";
    if (el.classList.contains("gw-band-white")) return "white";
    if (el.classList.contains("gw-band-porcelain")) return "porcelain";
    return "unknown";
  });
}

describe("Homepage Academy contrast rhythm", () => {
  const renderHome = () =>
    render(<HomepagePreview onOpenBriefWizard={() => {}} onSelectScreen={() => {}} />);

  it("runs navy hero → white → porcelain → white → porcelain → white", () => {
    const { container } = renderHome();
    expect(bandSequence(container)).toEqual([
      "hero",
      "white",
      "porcelain",
      "white",
      "porcelain",
      "white",
    ]);
  });

  it("never places two light bands of the same tone adjacent to each other", () => {
    const { container } = renderHome();
    const bands = bandSequence(container);
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i], `band ${i} repeats band ${i - 1}`).not.toBe(bands[i - 1]);
    }
  });

  it("closes on the deep-navy anchor band, not a light one", () => {
    const { container } = renderHome();
    const anchor = container.querySelector(".gw-band-anchor");
    expect(anchor).not.toBeNull();
    expect(anchor!.classList.contains("band-dark")).toBe(true);
    // The anchor must not be counted as a light band by the rhythm above.
    expect(bandSequence(container)).not.toContain("unknown");
  });

  it("drops hardcoded dark canvases from every light band", () => {
    const { container } = renderHome();
    for (const band of container.querySelectorAll(".gw-band-white, .gw-band-porcelain")) {
      // The band supplies the surface; a leftover hex canvas would fight it.
      expect(band.className).not.toMatch(/bg-\[#0[0-9A-Fa-f]{6}\]/);
    }
  });

  it("carries the animated bureau pill, gradient headline and stat counters in the hero", () => {
    const { container } = renderHome();
    const hero = container.querySelector(".gw-band-hero")!;
    expect(hero).not.toBeNull();

    const pill = hero.querySelector(".gw-eyebrow");
    expect(pill).not.toBeNull();
    expect(pill!.querySelector(".gw-eyebrow-dot")).not.toBeNull();
    expect(pill!.textContent).toMatch(/Managed Digital Bureau of Najeeb Digital Hub/i);

    // The gradient highlight span sits inside the h1.
    expect(hero.querySelector("h1 .text-gradient-brand")).not.toBeNull();
    expect(hero.querySelectorAll("h1").length).toBe(1);

    // Four high-contrast stat counters, each with a value, label and sub-line.
    const stats = container.querySelectorAll("#hero-stats > div");
    expect(stats.length).toBe(4);
    for (const stat of stats) {
      expect(stat.querySelector(".font-mono.font-black")).not.toBeNull();
    }
  });

  it("keeps the estimator deep-linkable (the hero pill scrolls to #estimator)", () => {
    const { container } = renderHome();
    const estimator = container.querySelector("#estimator");
    expect(estimator).not.toBeNull();
    expect(estimator!.classList.contains("gw-band-porcelain")).toBe(true);
  });

  it("keeps the case-study band present even before the API responds", () => {
    // Case-study content is fetched (see the e2e suite for the loaded state);
    // the band, its headline and the navy photo plate treatment are static.
    const { container } = renderHome();
    const band = container.querySelector("#case-studies")!;
    expect(band).not.toBeNull();
    expect(band.classList.contains("gw-band-white")).toBe(true);
    expect(band.textContent).toContain("Verified work");
  });

  it("keeps the estimator deep-linkable (the hero pill scrolls to #estimator)", () => {
    const { container } = renderHome();
    const estimator = container.querySelector("#estimator");
    expect(estimator).not.toBeNull();
    expect(estimator!.classList.contains("gw-band-porcelain")).toBe(true);
  });
});

/* ------------------------------------------------------------------ *
 * 1b. The Academy layout primitives
 * ------------------------------------------------------------------ */

describe("Continuous services marquee", () => {
  const renderHome = () =>
    render(<HomepagePreview onOpenBriefWizard={() => {}} onSelectScreen={() => {}} />);

  it("streams all 16 departments twice for a seamless loop", () => {
    const { container } = renderHome();
    const tracks = container.querySelectorAll(".gw-marquee-track");
    expect(tracks.length).toBeGreaterThanOrEqual(2);

    // The 16-department ticker is the first one, doubled for the loop.
    const departmentItems = tracks[0]!.querySelectorAll(".gw-marquee-item");
    expect(departmentItems.length).toBe(32);
    for (const label of [
      "UI/UX Design",
      "AI Automation",
      "Web App Development",
      "Cloud DevOps",
      "Cybersecurity",
    ]) {
      expect(tracks[0]!.textContent).toContain(label);
    }
    // Each item carries its category icon.
    expect(tracks[0]!.querySelectorAll("svg").length).toBe(32);
  });

  it("sits directly beneath the hero band", () => {
    const { container } = renderHome();
    const hero = container.querySelector(".gw-band-hero")!;
    const next = hero.nextElementSibling;
    expect(next!.querySelector(".gw-marquee-track")).not.toBeNull();
  });
});

describe("4-step delivery arc", () => {
  const renderHome = () =>
    render(<HomepagePreview onOpenBriefWizard={() => {}} onSelectScreen={() => {}} />);

  it("numbers the four steps 01 → 04 with the locked titles", () => {
    const { container } = renderHome();
    const numerals = [...container.querySelectorAll(".gw-step-numeral")].map((el) =>
      el.textContent?.trim(),
    );
    expect(numerals).toEqual(["01", "02", "03", "04"]);

    for (const title of ["Brief & Scope", "Dedicated PM", "Sprint & Escrow", "Production Launch"]) {
      expect(container.textContent).toContain(title);
    }
  });

  it("gives every step a tinted icon pill on an elevated card", () => {
    const { container } = renderHome();
    const arc = container.querySelector("#delivery-arc")!;
    const cards = arc.querySelectorAll(".gw-card");
    expect(cards.length).toBe(4);
    for (const card of cards) {
      expect(card.querySelector(".gw-icon-pill")).not.toBeNull();
    }
  });
});

describe("16 department showcase", () => {
  const renderHome = () =>
    render(<HomepagePreview onOpenBriefWizard={() => {}} onSelectScreen={() => {}} />);

  it("renders all 16 departments as elevated white cards with icon pills", () => {
    const { container } = renderHome();
    const showcase = container.querySelector("#departments")!;
    const cards = showcase.querySelectorAll("article.gw-card");
    expect(cards.length).toBe(16);

    for (const card of cards) {
      expect(card.querySelector(".gw-icon-pill")).not.toBeNull();
      // Active capacity badge.
      expect(card.textContent).toMatch(/\d+ active/i);
      // Interactive hover state requested by the design spec.
      expect(card.classList.contains("gw-card-hover")).toBe(true);
    }
  });

  it("keeps two-line scope summaries, not the raw long descriptions", () => {
    const { container } = renderHome();
    const showcase = container.querySelector("#departments")!;
    const summaries = showcase.querySelectorAll("p.line-clamp-2");
    expect(summaries.length).toBe(16);
  });
});

describe("Verified case studies & client feedback", () => {
  const renderHome = () =>
    render(<HomepagePreview onOpenBriefWizard={() => {}} onSelectScreen={() => {}} />);

  it("gives the feedback block its verified-feedback framing and a route to the dossiers", () => {
    const { container } = renderHome();
    const band = container.querySelector("#case-studies")!;
    // Copy that only makes sense once real, approval-recorded quotes exist.
    expect(band.textContent).toContain("Verified feedback");
    expect(band.textContent).toContain("Read the full case-study dossiers");
  });

  it("renders fetched dossiers and client quotes once the API responds (e2e covers the loaded DOM)", async () => {
    // In jsdom the case-study store resolves to [] because there is no backend,
    // so this asserts the empty-but-honest state rather than a fabricated one.
    const { container } = renderHome();
    const figures = container.querySelectorAll("#case-studies figure");
    const spotlight = container.querySelector("#case-studies article");
    expect(figures.length + (spotlight ? 1 : 0)).toBe(0);
  });
});

/* ------------------------------------------------------------------ *
 * 2. Unified floating AI assistant
 * ------------------------------------------------------------------ */

describe("Floating AI assistant launcher", () => {
  const renderWidget = () => {
    const onOpenBriefWizard = vi.fn();
    const onNavigateScreen = vi.fn();
    const utils = render(
      <AIAssistantWidget
        onOpenBriefWizard={onOpenBriefWizard}
        onNavigateScreen={onNavigateScreen}
      />,
    );
    return { ...utils, onOpenBriefWizard, onNavigateScreen };
  };

  it("renders the circular launcher with the official avatar, orbit ring and status dot", () => {
    const { container } = renderWidget();
    const launcher = container.querySelector(".ai-assistant-launcher");
    expect(launcher).not.toBeNull();
    expect(launcher!.tagName).toBe("BUTTON");

    const avatar = container.querySelector<HTMLImageElement>(".ai-assistant-avatar");
    expect(avatar).not.toBeNull();
    expect(avatar!.getAttribute("src")).toMatch(/ndh-ai-assistant/);
    // Decorative, so the button's accessible name carries the meaning instead.
    expect(avatar!.getAttribute("alt")).toBe("");

    expect(container.querySelector(".ai-assistant-orbit")).not.toBeNull();
    expect(container.querySelector(".ai-assistant-status")).not.toBeNull();
  });

  it("exposes an accessible name and collapsed state on the launcher", () => {
    renderWidget();
    const button = screen.getByRole("button", { name: /open the ndh ai assistant/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("shows the micro-greeting pill and lets the user dismiss it", () => {
    const { container } = renderWidget();
    const greeting = container.querySelector(".ai-assistant-greeting");
    expect(greeting).not.toBeNull();
    expect(greeting!.textContent).toContain("Need a quote or technical team?");

    fireEvent.click(screen.getByRole("button", { name: /dismiss ai assistant greeting/i }));
    expect(container.querySelector(".ai-assistant-greeting")).toBeNull();
    // Dismissing the pill must not remove the launcher itself.
    expect(container.querySelector(".ai-assistant-launcher")).not.toBeNull();
  });

  it("opens the drawer from the pill's Ask shortcut", () => {
    renderWidget();
    fireEvent.click(screen.getByRole("button", { name: /^ask$/i }));
    expect(screen.getByRole("dialog", { name: /ndh sentinel ai assistant/i })).toBeInTheDocument();
  });

  it("opens the drawer and hides the launcher while open", () => {
    const { container } = renderWidget();
    fireEvent.click(screen.getByRole("button", { name: /open the ndh ai assistant/i }));
    expect(container.querySelector(".ai-assistant-launcher")).toBeNull();
    expect(container.querySelector(".ai-assistant-greeting")).toBeNull();
  });
});

describe("Agency quick-action chips", () => {
  const openDrawer = () => {
    const onOpenBriefWizard = vi.fn();
    const onNavigateScreen = vi.fn();
    render(
      <AIAssistantWidget
        onOpenBriefWizard={onOpenBriefWizard}
        onNavigateScreen={onNavigateScreen}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /open the ndh ai assistant/i }));
    return { onOpenBriefWizard, onNavigateScreen };
  };

  it("offers all five requested quick actions", () => {
    openDrawer();
    for (const label of [
      "Submit a Project Brief",
      "Estimate Delivery Timeline",
      "Explore Case Studies",
      "Book a Strategy Consultation",
      "Ask about NDH Academy & Courses",
    ]) {
      expect(screen.getByRole("button", { name: label }), label).toBeInTheDocument();
    }
  });

  it("wires 'Submit a Project Brief' to the real brief wizard", () => {
    const { onOpenBriefWizard } = openDrawer();
    fireEvent.click(screen.getByRole("button", { name: "Submit a Project Brief" }));
    expect(onOpenBriefWizard).toHaveBeenCalledTimes(1);
  });

  it("wires 'Explore Case Studies' to the case-study view", () => {
    const { onNavigateScreen } = openDrawer();
    fireEvent.click(screen.getByRole("button", { name: "Explore Case Studies" }));
    expect(onNavigateScreen).toHaveBeenCalledWith("case-study");
  });

  it("wires 'Book a Strategy Consultation' to the contact/consultation view", () => {
    const { onNavigateScreen } = openDrawer();
    fireEvent.click(screen.getByRole("button", { name: "Book a Strategy Consultation" }));
    expect(onNavigateScreen).toHaveBeenCalledWith("contact");
  });

  it("keeps the two legacy explainers reachable as follow-ups rather than orphaned", () => {
    openDrawer();
    const input = screen.getByPlaceholderText(/message|ask|type/i);
    fireEvent.change(input, { target: { value: "something unmatched xyz" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    // The canned reply is produced on a timer in the widget.
    const dialog = screen.getByRole("dialog", { name: /ndh sentinel ai assistant/i });
    return vi.waitFor(
      () => {
        expect(
          within(dialog).getByRole("button", { name: "Recommend Service" }),
        ).toBeInTheDocument();
        expect(
          within(dialog).getByRole("button", { name: "Privacy & PM Model" }),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});

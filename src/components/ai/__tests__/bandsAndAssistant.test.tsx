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
 * 1. Alternating band rhythm
 * ------------------------------------------------------------------ */

function bandSequence(container: HTMLElement): string[] {
  return [...container.querySelectorAll("section[data-band]")].map(
    (el) => el.getAttribute("data-band") ?? "unknown",
  );
}

describe("Homepage band rhythm (Executive Bureau)", () => {
  const renderHome = () =>
    render(<HomepagePreview onOpenBriefWizard={() => {}} onSelectScreen={() => {}} />);

  it("alternates dark hero -> porcelain services -> white estimator -> dark case study", () => {
    const { container } = renderHome();
    expect(bandSequence(container)).toEqual(["hero", "porcelain", "white", "dark"]);
  });

  it("never places two bands of the same tone adjacent to each other", () => {
    const { container } = renderHome();
    const bands = bandSequence(container);
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i], `band ${i} repeats band ${i - 1}`).not.toBe(bands[i - 1]);
    }
  });

  it("keeps the estimator deep-linkable on a white band", () => {
    const { container } = renderHome();
    const estimator = container.querySelector("#estimator");
    expect(estimator).not.toBeNull();
    expect(estimator!.getAttribute("data-band")).toBe("white");
  });

  it("shows six department cards with photography inside the light services band", () => {
    const { container } = renderHome();
    const cards = container.querySelectorAll('[data-testid="department-card"]');
    expect(cards.length).toBe(6);
    for (const card of cards) {
      expect(card.closest('[data-band="porcelain"]')).not.toBeNull();
      expect(card.querySelector("img")).not.toBeNull();
      expect(card.querySelector("h3")?.textContent?.trim()).toBeTruthy();
    }
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

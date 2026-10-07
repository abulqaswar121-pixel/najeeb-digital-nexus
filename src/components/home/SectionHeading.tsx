import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  /** Render for a navy band instead of the porcelain canvas. */
  onDark?: boolean;
}

/**
 * SectionHeading — the Academy heading block: an accent eyebrow pill, a
 * Space Grotesk display title (with an optional gradient highlight passed in
 * by the caller) and a muted supporting paragraph.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  onDark = false,
}: Props) {
  return (
    <div
      className={`max-w-3xl space-y-4 ${align === "center" ? "mx-auto text-center" : "text-left"}`}
    >
      {eyebrow && <div className="gw-eyebrow">{eyebrow}</div>}
      <h2
        className={`font-display text-3xl font-black tracking-tight sm:text-4xl ${
          onDark ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base leading-relaxed sm:text-lg ${
            onDark ? "text-[var(--eco-on-dark-muted)]" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

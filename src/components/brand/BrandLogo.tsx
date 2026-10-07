import React from "react";
import { AgencySectorMark } from "./AgencySectorMark";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Hide the "MANAGED DIGITAL BUREAU" micro-badge (used in tight portal headers). */
  compactBadge?: boolean;
  /** Render the lockup as a link back to the agency home. */
  asLink?: boolean;
}

/**
 * NDH Agency brand lockup — identical anatomy to the Academy lockup.
 *
 *  - the Open Gateway master mark (`NdhFamilySymbol`) carrying the agency's
 *    `BriefcaseBusiness` sector badge in its lower-right corner,
 *  - top line: **NAJEEB DIGITAL HUB** in Space Grotesk, bold, tracking-tight,
 *  - bottom line: **NDH Agency** in the sector accent (Electric Cyan on navy,
 *    ecosystem cobalt on the porcelain/white header) plus the micro-badge
 *    reading "MANAGED DIGITAL BUREAU".
 *
 * The wordmark colour is token-driven rather than hardcoded white: on the
 * porcelain header it is ecosystem ink (#101b40) and inside any `.band-dark`
 * scope (hero band, footer anchor, portals) it flips to white — the Academy
 * behaviour, where the same lockup sits on both surfaces.
 *
 * Every text node can shrink (`min-w-0` + `truncate`) so the lockup can never
 * force horizontal scrolling on a 360px viewport; the micro-badge is dropped
 * below `sm` for the same reason.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  className = "",
  compactBadge = false,
  asLink = false,
}) => {
  const wordmarkSizes = {
    sm: "text-[12.5px] sm:text-[13.5px]",
    md: "text-sm sm:text-base",
    lg: "text-lg sm:text-xl",
  };

  const subLabelSizes = {
    sm: "text-[8px]",
    md: "text-[9px]",
    lg: "text-[10px]",
  };

  const lockup = (
    <>
      {/* Open Gateway master mark + agency sector badge */}
      <AgencySectorMark
        size={size}
        className="shrink-0 transition-transform duration-300 group-hover:scale-[1.04]"
      />

      {/* Wordmark stack — NAJEEB DIGITAL HUB over NDH Agency */}
      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span
          className={`ndh-brand-wordmark truncate font-bold tracking-tight ${wordmarkSizes[size]}`}
        >
          NAJEEB DIGITAL HUB
        </span>

        <span className="mt-1 flex min-w-0 items-center gap-1.5">
          <span
            className={`ndh-brand-sublabel shrink-0 font-semibold uppercase ${subLabelSizes[size]}`}
          >
            NDH Agency
          </span>

          {!compactBadge && (
            <span
              className={`ndh-brand-badge hidden shrink-0 items-center rounded-full px-1.5 py-[1px] font-mono font-bold uppercase sm:inline-flex ${subLabelSizes[size]}`}
            >
              Managed Digital Bureau
            </span>
          )}
        </span>
      </span>
    </>
  );

  const classes = `ndh-agency-brand group flex min-w-0 select-none items-center gap-2.5 ${className}`;

  if (asLink) {
    return (
      <a
        href="/"
        className={classes}
        aria-label="Najeeb Digital Hub — NDH Agency home"
        onClick={(e) => {
          // Full navigation keeps the router's route resolution authoritative
          // while still giving the lockup a real, crawlable href.
          if (window.location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        {lockup}
      </a>
    );
  }

  return <div className={classes}>{lockup}</div>;
};

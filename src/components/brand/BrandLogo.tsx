import React from "react";
import { AgencySectorMark } from "./AgencySectorMark";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Hide the "MANAGED DIGITAL BUREAU" micro-badge (used in tight portal headers). */
  compactBadge?: boolean;
}

/**
 * NDH Agency header lockup.
 *
 * Aligned with the parent "Precision Gateway" identity:
 *  - the Open Gateway master mark (`NdhFamilySymbol`) carrying the agency's
 *    `BriefcaseBusiness` sector badge in its lower-right corner,
 *  - the "NAJEEB DIGITAL HUB" wordmark in Space Grotesk, tracking-tight,
 *  - an "NDH AGENCY" sub-label plus an Electric Cyan micro-badge reading
 *    "MANAGED DIGITAL BUREAU".
 *
 * Every text node is allowed to shrink (`min-w-0` + `truncate`) so the lockup
 * can never force horizontal scrolling on a 360px viewport; the micro-badge is
 * dropped below `sm` for the same reason.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  className = "",
  compactBadge = false,
}) => {
  const wordmarkSizes = {
    sm: "text-[13px] sm:text-sm",
    md: "text-sm sm:text-base",
    lg: "text-lg sm:text-xl",
  };

  const subLabelSizes = {
    sm: "text-[8px]",
    md: "text-[9px]",
    lg: "text-[10px]",
  };

  return (
    <div
      className={`ndh-agency-brand group flex min-w-0 select-none items-center gap-2.5 ${className}`}
    >
      {/* Open Gateway master mark + agency sector badge */}
      <AgencySectorMark
        size={size}
        className="shrink-0 transition-transform duration-300 group-hover:scale-[1.04]"
      />

      {/* Wordmark stack */}
      <div className="flex min-w-0 flex-col justify-center leading-none">
        <span
          className={`ndh-brand-wordmark truncate font-semibold tracking-tight text-white ${wordmarkSizes[size]}`}
        >
          NAJEEB DIGITAL HUB
        </span>

        <span className="mt-1 flex min-w-0 items-center gap-1.5">
          <span
            className={`ndh-brand-sublabel shrink-0 font-semibold uppercase text-eco-electric ${subLabelSizes[size]}`}
          >
            NDH Agency
          </span>

          {!compactBadge && (
            <span
              className={`ndh-brand-badge hidden shrink-0 items-center rounded-full border border-eco-electric/35 bg-eco-electric/10 px-1.5 py-[1px] font-mono font-bold uppercase tracking-[0.14em] text-eco-electric sm:inline-flex ${subLabelSizes[size]}`}
            >
              Managed Digital Bureau
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

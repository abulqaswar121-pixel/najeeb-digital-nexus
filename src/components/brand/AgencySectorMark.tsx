import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import { NdhFamilySymbol } from "./NdhFamilySymbol";

interface AgencySectorMarkProps {
  /** Tile size variant — maps to the `.ndh-family-symbol--*` CSS rules. */
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * The Open Gateway master mark carrying NDH Agency's sector badge.
 *
 * Per the master visual system, every NDH destination renders the same Open
 * Gateway tile and differentiates itself with a sector icon integrated into the
 * tile's lower-right corner. The agency's sector icon is `BriefcaseBusiness`.
 * This is the single place that pairing is defined, so the header, footer and
 * all four portal headers stay identical.
 */
export const AgencySectorMark: React.FC<AgencySectorMarkProps> = ({
  size = "sm",
  className = "",
}) => (
  <NdhFamilySymbol
    SectorIcon={BriefcaseBusiness}
    className={`ndh-family-symbol--${size}${className ? ` ${className}` : ""}`}
  />
);

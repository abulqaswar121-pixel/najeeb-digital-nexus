import type { ComponentType, SVGProps } from "react";
import gatewayLogo from "@/assets/ndh-logo-gateway-cropped.png";

type SectorIcon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Shared Open Gateway identity; a sector icon integrates into the lower corner.
 *
 * Ported verbatim from the parent gateway (`ndh.com.ng`) so the master mark is
 * pixel-identical across the family. NDH Agency passes `BriefcaseBusiness` as
 * its sector icon.
 */
export function NdhFamilySymbol({
  className = "",
  SectorIcon,
}: {
  className?: string;
  SectorIcon?: SectorIcon;
}) {
  return (
    <span className={`ndh-family-symbol${className ? ` ${className}` : ""}`} aria-hidden="true">
      <span className="ndh-family-tile">
        <img src={gatewayLogo} alt="" width={684} height={679} />
      </span>
      {SectorIcon ? (
        <span className="ndh-family-sector">
          <SectorIcon strokeWidth={2} />
        </span>
      ) : null}
    </span>
  );
}

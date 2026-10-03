import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = "md", className = "" }) => {
  // Icon box sizes are taller than wide to match the real brand mark's
  // vertical hexagon silhouette (the previous geometric SVG placeholder was
  // a perfect square -- this mark isn't).
  const iconSizes = {
    sm: "w-6 h-8",
    md: "w-8 h-10",
    lg: "w-10 h-12",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`flex min-w-0 items-center gap-2.5 select-none group ${className}`}>
      {/* Real NDH brand mark (supplied by the agency, not AI-generated
          placeholder geometry) */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center`}
      >
        <img
          src="/images/ndh-logo-mark.png"
          alt="NDH Agency"
          className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(109,40,217,0.45)]"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex min-w-0 flex-col">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`whitespace-nowrap font-black tracking-tight text-white ${textSizes[size]} group-hover:text-blue-400 transition-colors`}
          >
            NDH<span className="font-light text-blue-400 ml-1">AGENCY</span>
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300 uppercase tracking-wider font-mono">
            GLOBAL
          </span>
        </div>
      </div>
    </div>
  );
};

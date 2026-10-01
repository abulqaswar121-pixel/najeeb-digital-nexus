import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showSubtitle = true,
  className = "",
}) => {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`flex min-w-0 items-center gap-2.5 select-none group ${className}`}>
      {/* 3D Geometric Nexus Diamond Emblem */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}
      >
        {/* Glowing Ambient Halo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 rounded-2xl blur-[6px] opacity-75 group-hover:opacity-100 transition-opacity" />

        {/* Crisp Geometric Prism Mark */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0E1A] p-0.5 border border-white/20 shadow-xl overflow-hidden flex items-center justify-center">
          {/* Glass Inner Reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none" />

          {/* Precision SVG Nexus Emblem */}
          <svg viewBox="0 0 40 40" className="w-6 h-6 text-white" fill="none">
            <defs>
              <linearGradient id="ndhGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="ndhGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            {/* Left Pillar */}
            <path d="M10 30V10L17 10V30H10Z" fill="url(#ndhGradient1)" rx="2" />
            {/* Diagonal Ribbon */}
            <path d="M15 10L27 30H22L10 10H15Z" fill="url(#ndhGradient2)" opacity="0.9" />
            {/* Right Pillar */}
            <path d="M23 30V10L30 10V30H23Z" fill="url(#ndhGradient1)" rx="2" />
            {/* Precision Nexus Node */}
            <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
            <circle cx="20" cy="20" r="1.5" fill="#3B82F6" />
          </svg>
        </div>
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
        {showSubtitle && (
          <p className="text-[10px] text-slate-400 tracking-wide font-medium -mt-0.5">
            Part of Najeeb Digital Hub
          </p>
        )}
      </div>
    </div>
  );
};

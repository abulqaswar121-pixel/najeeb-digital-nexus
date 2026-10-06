import React from "react";
import { ArrowRight, Award, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { NdhFamilySymbol } from "../brand/NdhFamilySymbol";
import { getSubsidiary } from "@/lib/ecosystem";

const ACADEMY_URL = "https://academy.ndh.com.ng";

/**
 * Prominent cross-promotion for the sibling subsidiary NDH Academy.
 *
 * The two destinations are separate businesses on separate subdomains with
 * their own accounts and curricula, so this card is a signpost rather than a
 * route into the agency app. It carries the Academy's Open Gateway tile with
 * the education sector badge so the family relationship is visually explicit.
 */
export const AcademyCrossPromo: React.FC = () => {
  const academy = getSubsidiary("academy");
  const AcademyIcon = academy.icon;

  return (
    <section
      aria-label="NDH Academy"
      className="ndh-academy-promo relative overflow-hidden rounded-3xl border border-eco-glow/25 bg-eco-navy"
    >
      {/* Atmospheric iris glow (spec: #8A2BE2 at low opacity) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-eco-glow/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-eco-electric/10 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <NdhFamilySymbol SectorIcon={AcademyIcon} className="ndh-family-symbol--lg shrink-0" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">
                Looking to build your skills or train your team?
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                <Award className="h-3 w-3" />
                Live
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
              Explore <span className="font-semibold text-white">NDH Academy</span> —{" "}
              {academy.tagline} It runs on its own platform at{" "}
              <span className="font-mono text-eco-cyan">{academy.domain}</span>, entirely separate
              from agency client accounts.
            </p>

            <ul className="mt-4 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
              <li className="flex items-center gap-2 text-[11px] text-slate-300">
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-eco-electric" />
                <span className="truncate">60 practical courses</span>
              </li>
              <li className="flex items-center gap-2 text-[11px] text-slate-300">
                <GraduationCap className="h-3.5 w-3.5 shrink-0 text-eco-electric" />
                <span className="truncate">6 specialized schools</span>
              </li>
              <li className="flex items-center gap-2 text-[11px] text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-eco-electric" />
                <span className="truncate">Verifiable certificates</span>
              </li>
            </ul>
          </div>
        </div>

        <a
          href={ACADEMY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-eco-electric to-eco-cyan px-6 py-3 text-xs font-bold text-[#04121f] shadow-lg shadow-eco-electric/25 transition-all hover:brightness-110 active:scale-95"
        >
          <span className="whitespace-nowrap">Explore NDH Academy</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
};

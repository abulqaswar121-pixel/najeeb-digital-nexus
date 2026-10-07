import React from "react";
import { ArrowRight, Award, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { NdhFamilySymbol } from "../brand/NdhFamilySymbol";
import { getSubsidiary } from "@/lib/ecosystem";

const ACADEMY_URL = "https://academy.ndh.com.ng";

/**
 * Cross-promotion for the sibling subsidiary NDH Academy, rendered ONLY inside
 * the footer band (never in the top navigation).
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
      className="ndh-academy-promo border-border bg-surface/40 relative overflow-hidden rounded-2xl border"
    >
      {/* Atmospheric glow (iris on navy) */}
      <div
        aria-hidden="true"
        className="bg-eco-glow/20 pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-eco-electric/10 pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full blur-3xl"
      />

      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <NdhFamilySymbol SectorIcon={AcademyIcon} className="ndh-family-symbol--lg shrink-0" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-foreground font-display text-base font-bold tracking-tight sm:text-lg">
                Looking to build your skills or train your team?
              </h2>
              <span className="border-success/35 text-success inline-flex items-center gap-1 rounded-full border bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase">
                <Award className="h-3 w-3" />
                Live
              </span>
            </div>

            <p className="text-muted-foreground mt-2 max-w-2xl text-xs leading-relaxed sm:text-sm">
              Explore <span className="text-foreground font-semibold">NDH Academy</span> —{" "}
              {academy.tagline} It runs on its own platform at{" "}
              <span className="text-brand-soft font-mono">{academy.domain}</span>, entirely separate
              from agency client accounts.
            </p>

            <ul className="mt-4 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
              <li className="text-muted-foreground flex items-center gap-2 text-[11px]">
                <BookOpen className="text-brand-soft h-3.5 w-3.5 shrink-0" />
                <span className="truncate">60 practical courses</span>
              </li>
              <li className="text-muted-foreground flex items-center gap-2 text-[11px]">
                <GraduationCap className="text-brand-soft h-3.5 w-3.5 shrink-0" />
                <span className="truncate">6 specialized schools</span>
              </li>
              <li className="text-muted-foreground flex items-center gap-2 text-[11px]">
                <ShieldCheck className="text-brand-soft h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Verifiable certificates</span>
              </li>
            </ul>
          </div>
        </div>

        <a
          href={ACADEMY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="from-eco-electric to-eco-cyan text-eco-dark inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3 text-xs font-extrabold shadow-lg transition-all hover:brightness-110 active:scale-95"
        >
          <span className="whitespace-nowrap">Explore NDH Academy</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
};

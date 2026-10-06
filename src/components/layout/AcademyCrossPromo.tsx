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
      className="ndh-academy-promo rounded-3xl bg-gradient-to-r from-eco-glow to-eco-electric p-px"
    >
      <div className="flex flex-col items-start justify-between gap-8 rounded-[23px] bg-eco-dark px-6 py-10 sm:px-10 md:flex-row md:items-center">
        <div className="flex min-w-0 items-center gap-5 sm:gap-6">
          <NdhFamilySymbol SectorIcon={AcademyIcon} className="ndh-family-symbol--lg shrink-0" />
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              Upskill with NDH Academy
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
              {academy.tagline} It runs on its own platform at{" "}
              <span className="text-slate-200">{academy.domain}</span>.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-eco-electric" /> 60 courses
              </li>
              <li className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-eco-electric" /> 6 schools
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-eco-electric" /> Verifiable certificates
              </li>
            </ul>
          </div>
        </div>

        <a
          href={ACADEMY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl bg-eco-electric px-8 py-4 text-sm font-bold text-eco-dark shadow-lg shadow-eco-electric/20 transition-all hover:brightness-110"
        >
          Explore Academy
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

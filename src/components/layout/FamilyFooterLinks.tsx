import React from "react";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { NdhFamilySymbol } from "../brand/NdhFamilySymbol";
import {
  CURRENT_SUBSIDIARY,
  SUBSIDIARIES,
  launchStateLabel,
  siblingSubsidiaries,
  subsidiaryHref,
} from "@/lib/ecosystem";
import { PARENT_GATEWAY_HREF } from "./FamilyMenu";

/**
 * Shared ecosystem footer band, mirroring the parent gateway's `FamilyFooter`.
 *
 * NDH Agency is an autonomous sibling destination; this band states that
 * relationship explicitly and links every other member of the family with its
 * launch status, so a visitor can always navigate back up to the parent
 * gateway or across to a sibling subdomain.
 */
export const FamilyFooterLinks: React.FC = () => {
  const siblings = siblingSubsidiaries();
  const available = siblings.filter((item) => item.state !== "coming");
  const coming = siblings.filter((item) => item.state === "coming");

  return (
    <section
      aria-label="The NDH family of businesses"
      className="rounded-3xl border border-white/10 bg-eco-navy/70 p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        {/* Parent gateway relationship */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <NdhFamilySymbol className="ndh-family-symbol--md shrink-0" />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold tracking-tight text-white">
                NAJEEB DIGITAL HUB
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Parent Gateway
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-prose text-xs leading-relaxed text-slate-300">
            NDH Agency is an autonomous digital bureau within the Najeeb Digital Hub family. The
            parent gateway at <span className="text-white">ndh.com.ng</span> is the ecosystem
            directory for all {SUBSIDIARIES.length} destinations.
          </p>

          <a
            href={PARENT_GATEWAY_HREF}
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-eco-electric/35 bg-eco-electric/10 px-4 py-2.5 text-xs font-bold text-eco-electric transition-colors hover:bg-eco-electric/20"
          >
            <Globe2 className="h-3.5 w-3.5 shrink-0" />
            <span>Visit the parent gateway</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>

        {/* Sibling directory */}
        <div className="min-w-0">
          <p className="mb-3 font-display text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Our businesses
          </p>

          <ul className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
            {available.map((item) => {
              const Icon = item.icon;
              const isCurrent = item.id === CURRENT_SUBSIDIARY;
              return (
                <li key={item.id} className="min-w-0">
                  <a
                    href={subsidiaryHref(item)}
                    rel="noreferrer"
                    className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-eco-cyan/25 hover:bg-white/[0.06]"
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border tone-${item.accent}`}
                      style={{
                        borderColor: "color-mix(in oklab, var(--tone) 24%, transparent)",
                        background: "color-mix(in oklab, var(--tone) 12%, transparent)",
                        color: "var(--tone)",
                      }}
                      aria-hidden="true"
                    >
                      <Icon size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-white">
                        {item.name}
                      </span>
                      <span className="block truncate font-mono text-[10px] text-slate-400">
                        {item.domain}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={13}
                      aria-hidden="true"
                      className="shrink-0 text-slate-500 transition-colors group-hover:text-eco-electric"
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {coming.length > 0 && (
            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-500">
                {launchStateLabel("coming")}:
              </span>{" "}
              {coming.map((item) => item.name).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

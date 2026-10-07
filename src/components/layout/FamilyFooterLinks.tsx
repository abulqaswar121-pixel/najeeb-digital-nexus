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
 * `FamilyFooter` — the shared ecosystem band, and the ONLY place sibling
 * cross-links and the parent-gateway directory are allowed to live.
 *
 * NDH Agency is an autonomous sibling destination inside the Najeeb Digital
 * Hub family: this band states that relationship, links the parent gateway at
 * ndh.com.ng, and names every other member of the family with its launch
 * status, so a visitor can always navigate up to the parent or across to a
 * sibling subdomain without the agency's own header ever carrying ecosystem
 * promotion.
 *
 * Rendered inside the footer's `.band-dark` scope, so every colour below is a
 * semantic token that resolves to its on-navy value.
 */
export const FamilyFooter: React.FC = () => {
  const siblings = siblingSubsidiaries();
  const available = siblings.filter((item) => item.state !== "coming");
  const coming = siblings.filter((item) => item.state === "coming");

  return (
    <section
      aria-label="The NDH family of businesses"
      className="border-border bg-surface/40 rounded-2xl border p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        {/* Parent gateway relationship */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <NdhFamilySymbol className="ndh-family-symbol--md shrink-0" />
            <div className="min-w-0">
              <p className="text-foreground truncate font-display text-sm font-bold tracking-tight">
                NAJEEB DIGITAL HUB
              </p>
              <p className="text-muted-foreground text-[10px] font-bold tracking-[0.22em] uppercase">
                Parent Gateway
              </p>
            </div>
          </div>

          <p className="text-muted-foreground mt-4 max-w-prose text-xs leading-relaxed">
            NDH Agency is an autonomous digital bureau within the Najeeb Digital Hub family. The
            parent gateway at <span className="text-foreground font-semibold">ndh.com.ng</span> is
            the ecosystem directory for all {SUBSIDIARIES.length} destinations.
          </p>

          <a
            href={PARENT_GATEWAY_HREF}
            rel="noreferrer"
            className="border-brand-subtle/60 bg-brand-subtle text-brand-soft hover:text-foreground mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors"
          >
            <Globe2 className="h-3.5 w-3.5 shrink-0" />
            <span>Visit the parent gateway</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>

        {/* Sibling directory */}
        <div className="min-w-0">
          <p className="text-brand-soft mb-3 font-display text-[10.5px] font-bold tracking-[0.12em] uppercase">
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
                    aria-current={isCurrent ? "page" : undefined}
                    className="group border-border hover:border-brand-subtle flex min-w-0 items-center gap-2.5 rounded-xl border bg-white/[0.04] px-3 py-2.5 transition-colors hover:bg-white/[0.08]"
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border tone-${item.accent}`}
                      style={{
                        borderColor: "color-mix(in oklab, var(--tone) 32%, transparent)",
                        background: "color-mix(in oklab, var(--tone) 14%, transparent)",
                        color: "var(--tone)",
                      }}
                      aria-hidden="true"
                    >
                      <Icon size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-foreground block truncate text-xs font-semibold">
                        {item.name}
                        {isCurrent && (
                          <span className="text-brand-soft ml-1.5 font-mono text-[9px] font-bold uppercase">
                            Here
                          </span>
                        )}
                      </span>
                      <span className="text-muted-foreground block truncate font-mono text-[10px]">
                        {item.domain}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={13}
                      aria-hidden="true"
                      className="text-muted-foreground group-hover:text-brand-soft shrink-0 transition-colors"
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {coming.length > 0 && (
            <p className="text-muted-foreground mt-4 text-[11px] leading-relaxed">
              <span className="text-muted-foreground/70 font-semibold tracking-wider uppercase">
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

/** Backwards-compatible alias — the band's original component name. */
export const FamilyFooterLinks = FamilyFooter;

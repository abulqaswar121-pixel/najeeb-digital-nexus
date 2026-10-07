import React from "react";
import { ArrowRight, Users } from "lucide-react";

import type { DepartmentCardData } from "../../data/agencyDepartments";

interface Props {
  dept: DepartmentCardData;
  /** Formatted "from" price in the visitor's selected currency. */
  fromPrice?: string;
  /** Currency code shown next to the from-price. */
  currency?: string;
  onOpen: (dept: DepartmentCardData) => void;
}

/**
 * 16 Department Showcase card — an elevated pure-white card on the porcelain
 * canvas: tinted icon pill (`h-11 w-11 rounded-xl` in the brand-subtle tint),
 * clear service title, a two-line practical scope summary, and a live capacity
 * badge, with the Academy hover state (`-translate-y-0.5` + primary border).
 */
export const DepartmentCard: React.FC<Props> = ({ dept, fromPrice, currency, onOpen }) => {
  const Icon = dept.icon;
  const { record, scope, shortName } = dept;

  return (
    <article className="gw-card gw-card-hover group">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="gw-icon-pill transition-transform duration-300 group-hover:scale-105">
            <Icon aria-hidden="true" />
          </div>
          <span className="gw-chip gw-chip-live font-mono">
            <Users className="h-3 w-3" aria-hidden="true" />
            {record.activeTalentsCount} active
          </span>
        </div>

        <div className="mt-4 min-w-0">
          <h3 className="text-foreground text-sm font-bold tracking-tight">{record.name}</h3>
          <p className="text-muted-foreground mt-1.5 line-clamp-2 text-xs leading-relaxed">
            {scope}
          </p>
        </div>

        <div className="border-border mt-4 flex items-center justify-between gap-3 border-t pt-3.5">
          <span className="min-w-0">
            <span className="text-muted-foreground block font-mono text-[10px] tracking-wider uppercase">
              {record.averageTurnaroundDays}-day SLA · from
            </span>
            <span className="text-foreground block truncate font-mono text-xs font-bold">
              {fromPrice ?? `$${record.startingBudgetUSD}`}
              {currency ? ` ${currency}` : ""}
            </span>
          </span>
          <button
            type="button"
            onClick={() => onOpen(dept)}
            aria-label={`Explore ${record.name}`}
            className="border-border text-foreground hover:bg-brand-subtle hover:border-primary/50 hover:text-brand-soft inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-bold transition-colors"
          >
            Explore
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <span className="sr-only">{shortName}</span>
    </article>
  );
};

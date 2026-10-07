import React from "react";
import { Building2 } from "lucide-react";

import { DEPARTMENT_MARQUEE } from "../../data/agencyDepartments";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";

/**
 * Continuous services marquee — the animated infinite-scroll ticker that sits
 * directly beneath the hero band, streaming all 16 service departments with
 * their category icons. Pauses on hover and collapses to a static row under
 * the OS "reduce motion" preference (see the global guard in styles.css).
 */
export const ServicesMarquee: React.FC = () => {
  const items = [...DEPARTMENT_MARQUEE, ...DEPARTMENT_MARQUEE];

  return (
    <div
      aria-label="16 service departments"
      className="border-border bg-surface-raised overflow-hidden border-b py-3.5"
    >
      <div className="gw-marquee gw-marquee-fast">
        <div className="gw-marquee-track">
          {items.map((dept, i) => {
            const Icon = dept.icon;
            return (
              <span key={`${dept.id}-${i}`} className="gw-marquee-item">
                <Icon aria-hidden="true" />
                <span className="text-foreground/80 font-bold tracking-wide">{dept.label}</span>
                <span className="gw-marquee-dot" aria-hidden="true">
                  •
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Real, verifiable NDH client names — never invented partnerships. */
const CLIENT_NAMES = [
  "Apex Agri-Capital",
  "Miftah al-Arabiyyah",
  "Inheritance of Shadows",
  "Najeeb Academy",
  "SchoolDesk",
  "NDH eStore",
  "Hague Export",
  "Markazussalaf",
  "Taskzone",
  "Suregrade",
];

/**
 * Client marquee — the same ticker treatment for the 10 real, verifiable NDH
 * clients (the names that also appear as published case studies or completed
 * engagements).
 */
export const ClientsMarquee: React.FC = () => {
  const { t } = useCurrencyLanguage();
  const names = [...CLIENT_NAMES, ...CLIENT_NAMES];

  return (
    <section aria-label={t("marquee_heading")} className="gw-band gw-band-white gw-band-tight">
      <div className="mx-auto mb-2.5 max-w-7xl px-4 text-center">
        <span className="text-muted-foreground font-mono text-[10.5px] tracking-[0.18em] uppercase">
          {t("marquee_heading")}
        </span>
      </div>
      <div className="gw-marquee gw-marquee-slow">
        <div className="gw-marquee-track">
          {names.map((name, i) => (
            <span key={`${name}-${i}`} className="gw-marquee-item">
              <Building2 aria-hidden="true" />
              <span className="text-foreground/80 font-bold">{name}</span>
              <span className="gw-marquee-dot" aria-hidden="true">
                •
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

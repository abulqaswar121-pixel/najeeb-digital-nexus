import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, ChevronDown, Languages } from "lucide-react";
import {
  CURRENT_SUBSIDIARY,
  ECOSYSTEM_CATEGORIES,
  SUBSIDIARIES,
  launchStateLabel,
  subsidiaryHref,
  type Subsidiary,
} from "@/lib/ecosystem";
import { useCurrencyLanguage, type SupportedLanguage } from "@/lib/currencyLanguageStore";

export type FamilyMenuLink = { label: string; href: string };
export type FamilyMenuAction = { label: string; href: string };

/** Canonical parent gateway — the ecosystem directory for the whole family. */
export const PARENT_GATEWAY_HREF = "https://ndh.com.ng";

/**
 * The Precision Gateway ecosystem switcher.
 *
 * Ported from the parent gateway (`ndh.com.ng`) so the family directory looks
 * and behaves identically across subsidiaries. It holds the NDH family list
 * (grouped by sector, each with its live/preview/coming status), the "on this
 * site" page links, the language switcher and optional call-to-actions, so the
 * header itself only needs a brand, this trigger and one CTA.
 *
 * It server-renders closed and needs no browser API until it is opened, and it
 * becomes the full menu on small screens.
 *
 * NOTE ON THE PARENT PORT: the gateway resolves its copy through an i18n
 * dictionary and `usePreferences`. NDH Agency already ships its own
 * `useCurrencyLanguage` store (en/fr/ar) wired into the navbar, so the language
 * section binds to that instead of importing a second, competing i18n system.
 * Family names and taglines come from `lib/ecosystem` as owner-confirmed
 * English copy.
 */
export function FamilyMenu({
  links = [],
  action,
  cta,
}: {
  /** Page links shown in the "on this site" column. */
  links?: FamilyMenuLink[];
  /** Optional primary CTA shown in the panel footer. */
  cta?: FamilyMenuAction;
  /** Optional secondary button in the panel footer. */
  action?: FamilyMenuAction;
}) {
  const { language, setLanguage, languages } = useCurrencyLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const groups = ECOSYSTEM_CATEGORIES.map((category) => ({
    category,
    items: SUBSIDIARIES.filter((subsidiary) => subsidiary.categories[0] === category.id),
  })).filter((group) => group.items.length > 0);

  function close() {
    setOpen(false);
  }

  function hrefFor(subsidiary: Subsidiary) {
    if (subsidiary.state === "coming") return "";
    return subsidiaryHref(subsidiary);
  }

  return (
    <div className="gw-menu" ref={rootRef}>
      <button
        type="button"
        className="gw-menu-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="NDH ecosystem menu"
        onClick={() => setOpen((value) => !value)}
      >
        Ecosystem
        <ChevronDown size={14} aria-hidden="true" className={open ? "is-open" : undefined} />
      </button>

      {open && (
        <div
          className="gw-menu-panel"
          id={panelId}
          role="group"
          aria-label="NDH ecosystem directory"
        >
          <div className="gw-menu-grid">
            <section className="gw-menu-families">
              <p className="gw-menu-title">The NDH Family</p>
              <p className="gw-menu-lead">
                One hub, {SUBSIDIARIES.length} destinations. Switch to a sibling business below.
              </p>
              <div className="gw-menu-groups">
                {groups.map(({ category, items }) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div className="gw-menu-group" key={category.id}>
                      <p className={`gw-menu-group-title tone-${category.tone}`}>
                        <CategoryIcon size={13} aria-hidden="true" />
                        {category.name}
                      </p>
                      <ul>
                        {items.map((subsidiary) => {
                          const Icon = subsidiary.icon;
                          const isCurrent = subsidiary.id === CURRENT_SUBSIDIARY;
                          // The subsidiary we already are has nowhere to go; the
                          // gateway treats it as a link, but for the agency the
                          // honest state is "you are here".
                          const href = isCurrent ? "" : hrefFor(subsidiary);
                          const inner = (
                            <>
                              <span
                                className={`gw-menu-icon tone-${subsidiary.accent}`}
                                aria-hidden="true"
                              >
                                <Icon size={15} />
                              </span>
                              <span className="gw-menu-copy">
                                <strong>{subsidiary.name}</strong>
                                <small>{subsidiary.tagline}</small>
                              </span>
                              {isCurrent ? (
                                <span className="gw-menu-item-state is-current">Current</span>
                              ) : href ? (
                                <ArrowUpRight
                                  size={15}
                                  aria-hidden="true"
                                  className="gw-menu-item-arrow"
                                />
                              ) : (
                                <span className="gw-menu-item-state">
                                  {launchStateLabel(subsidiary.state)}
                                </span>
                              )}
                            </>
                          );

                          return (
                            <li key={subsidiary.id}>
                              {href ? (
                                subsidiary.external ? (
                                  <a
                                    className="gw-menu-item"
                                    href={href}
                                    rel="noreferrer"
                                    onClick={close}
                                  >
                                    {inner}
                                  </a>
                                ) : (
                                  <Link className="gw-menu-item" to={href as never} onClick={close}>
                                    {inner}
                                  </Link>
                                )
                              ) : (
                                <span
                                  className={`gw-menu-item${isCurrent ? " is-here" : " is-soon"}`}
                                  aria-disabled="true"
                                  aria-current={isCurrent ? "true" : undefined}
                                >
                                  {inner}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="gw-menu-side">
              {links.length > 0 ? (
                <>
                  <p className="gw-menu-title">On this site</p>
                  <ul className="gw-menu-links">
                    {links.map((link) => (
                      <li key={link.href}>
                        {link.href.startsWith("/") ? (
                          <Link to={link.href as never} onClick={close}>
                            {link.label}
                          </Link>
                        ) : (
                          <a href={link.href} rel="noreferrer" onClick={close}>
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <div className="gw-menu-lang">
                <p className="gw-menu-title">
                  <Languages size={13} aria-hidden="true" /> Language
                </p>
                <div className="gw-menu-lang-list">
                  {(Object.keys(languages) as SupportedLanguage[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      className={code === language ? "is-active" : undefined}
                      aria-pressed={code === language}
                      onClick={() => setLanguage(code)}
                    >
                      {languages[code]?.nativeName ?? code}
                      {code === language ? <Check size={13} aria-hidden="true" /> : null}
                    </button>
                  ))}
                </div>
              </div>

              <a
                className="gw-menu-all"
                href={PARENT_GATEWAY_HREF}
                rel="noreferrer"
                onClick={close}
              >
                Open the parent gateway
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </section>
          </div>

          {(cta || action) && (
            <div className="gw-menu-foot">
              {cta ? (
                cta.href.startsWith("/") ? (
                  <Link className="gw-menu-cta" to={cta.href as never} onClick={close}>
                    {cta.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                ) : (
                  <a className="gw-menu-cta" href={cta.href} rel="noreferrer" onClick={close}>
                    {cta.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )
              ) : (
                <span />
              )}
              {action ? (
                action.href.startsWith("/") ? (
                  <Link className="gw-menu-action" to={action.href as never} onClick={close}>
                    {action.label}
                  </Link>
                ) : (
                  <a className="gw-menu-action" href={action.href} rel="noreferrer" onClick={close}>
                    {action.label}
                  </a>
                )
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

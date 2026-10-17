/**
 * Google Translate integration.
 *
 * The site keeps its own hand-written translations for the nav and homepage,
 * and lets Google Translate cover everything else (portals, pop-ups, long
 * pages) the moment the visitor switches language. The Google widget itself
 * stays invisible — the header's language picker drives it.
 */

export type GoogleLanguage = "en" | "fr" | "ar";

const SCRIPT_ID = "ndh-google-translate-script";
const CONTAINER_ID = "ndh-google-translate-element";
const RELOAD_FLAG = "ndh_gt_reloaded";

let loadPromise: Promise<void> | null = null;

const setCookie = (value: string) => {
  const host = window.location.hostname;
  const base = `googtrans=${value}; path=/`;
  document.cookie = base;
  // Also set on the parent domain so subdomains share the choice.
  const parts = host.split(".");
  if (parts.length > 2) {
    document.cookie = `${base}; domain=.${parts.slice(-2).join(".")}`;
  }
};

const clearCookie = () => {
  const host = window.location.hostname;
  document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const parts = host.split(".");
  if (parts.length > 2) {
    document.cookie = `googtrans=; path=/; domain=.${parts.slice(-2).join(".")}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

const isTranslated = () => document.documentElement.classList.contains("translated-ltr") ||
  document.documentElement.classList.contains("translated-rtl");

/** Load the hidden Google widget exactly once. */
const ensureWidget = (): Promise<void> => {
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve) => {
    if (document.getElementById(SCRIPT_ID)) {
      resolve();
      return;
    }
    const container = document.createElement("div");
    container.id = CONTAINER_ID;
    container.style.display = "none";
    container.setAttribute("aria-hidden", "true");
    document.body.appendChild(container);

    (window as unknown as Record<string, unknown>)["googleTranslateElementInit"] = () => {
      const w = window as unknown as Record<string, any>;
      if (w["google"]?.translate?.TranslateElement) {
        new w["google"].translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr,ar",
            autoDisplay: false,
          },
          CONTAINER_ID,
        );
      }
      resolve();
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src =
      "https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
  return loadPromise;
};

/** Try to flip the widget's hidden language dropdown without a reload. */
const driveCombo = (lang: GoogleLanguage): boolean => {
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo) return false;
  const target = lang === "en" ? "" : lang;
  if (combo.value === target) return true;
  combo.value = target;
  combo.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
};

/**
 * Switch the whole page to the given language through Google Translate.
 * English restores the original text. Falls back to a single soft reload
 * when the widget is not ready yet (first switch on a slow connection).
 */
export const applyGoogleTranslate = (lang: GoogleLanguage) => {
  if (typeof window === "undefined") return;

  if (lang === "en") {
    clearCookie();
    if (isTranslated()) {
      // Google only restores original text reliably through a reload.
      if (!sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
      }
    }
    return;
  }

  sessionStorage.removeItem(RELOAD_FLAG);
  setCookie(`/en/${lang}`);

  void ensureWidget().then(() => {
    // The combo can take a moment to appear after the script loads.
    let attempts = 0;
    const tryDrive = () => {
      attempts += 1;
      if (driveCombo(lang)) return;
      if (attempts < 20) {
        window.setTimeout(tryDrive, 250);
      } else if (!sessionStorage.getItem(RELOAD_FLAG)) {
        // Widget never appeared (blocked network etc.) — one soft reload
        // lets Google pick the language up from the cookie instead.
        sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
      }
    };
    tryDrive();
  });
};

/**
 * Re-apply the visitor's saved language after page load, so a choice made
 * on one page survives navigation to the next.
 */
export const restoreGoogleTranslate = (lang: GoogleLanguage) => {
  if (typeof window === "undefined" || lang === "en") return;
  if (isTranslated()) return;
  applyGoogleTranslate(lang);
};

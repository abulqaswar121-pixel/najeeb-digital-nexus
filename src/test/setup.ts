import "@testing-library/jest-dom/vitest";

// jsdom implements neither `scrollIntoView` nor a usable `scrollTo`, and both
// are called by real components (the AI assistant scrolls its transcript on
// open; view navigation smooth-scrolls to the top). They are pure side effects
// with no bearing on assertions, so no-op them instead of letting component
// tests crash.
//
// IMPORTANT: this setup file is shared with the server integration tests, which
// declare `// @vitest-environment node`. There are no DOM globals there, so
// every shim has to be feature-detected — referencing `Element` unguarded
// raises a ReferenceError and fails the whole server suite at import time.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {
    /* no-op outside a real browser */
  };
}

if (typeof window !== "undefined") {
  // jsdom does define scrollTo, but it only emits a "not implemented" error,
  // so replace it outright to keep test output clean.
  window.scrollTo = (() => {
    /* no-op outside a real browser */
  }) as unknown as typeof window.scrollTo;
}

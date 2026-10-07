/**
 * The set of top-level destinations the SPA-style shell can render.
 *
 * Lives on its own so the retired `AppNavbar` (replaced by `AgencyHeader`)
 * can be deleted without breaking the many views that import the union.
 */
export type MainNavView =
  | "homepage"
  | "services"
  | "case-study"
  | "about"
  | "process"
  | "talent-network"
  | "insights"
  | "contact"
  | "client-dashboard"
  | "pm-dashboard"
  | "talent-dashboard"
  | "admin-command"
  | "journey"
  | "mobile-view"
  | "privacy-policy"
  | "terms-of-service"
  | "refund-policy";

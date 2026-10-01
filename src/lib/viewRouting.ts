import { useNavigate } from "@tanstack/react-router";
import { MainNavView } from "../components/layout/AppNavbar";

// Maps the app's existing "view name" navigation API (MainNavView) to real
// URLs now that each of these is a real TanStack route instead of a branch
// inside one giant client-side switch. Keeping this as a translation layer
// (rather than rewriting every page component's navigation calls) lets the
// ~15 existing public-page/portal/modal components keep calling
// `onSelectView("about")` exactly as before -- only the root wiring changed.
export const VIEW_PATHS: Record<MainNavView, string> = {
  homepage: "/",
  services: "/services",
  "case-study": "/case-studies",
  about: "/about",
  process: "/process",
  "talent-network": "/talent-network",
  insights: "/insights",
  contact: "/contact",
  "client-dashboard": "/portal/client",
  "pm-dashboard": "/portal/pm",
  "talent-dashboard": "/portal/talent",
  "admin-command": "/portal/admin",
  journey: "/journey",
  "mobile-view": "/mobile-preview",
  "privacy-policy": "/privacy-policy",
  "terms-of-service": "/terms-of-service",
  "refund-policy": "/refund-policy",
};

export function useViewNavigate() {
  const navigate = useNavigate();
  return (view: MainNavView) => {
    void navigate({ to: VIEW_PATHS[view] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

export const PORTAL_VIEWS: MainNavView[] = [
  "client-dashboard",
  "pm-dashboard",
  "talent-dashboard",
  "admin-command",
];

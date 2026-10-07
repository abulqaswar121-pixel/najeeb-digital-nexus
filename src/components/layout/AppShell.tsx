import React, { createContext, useContext, useState } from "react";
import { MainNavView } from "./navViews";
import { AgencyHeader } from "./AgencyHeader";
import { AppFooter } from "./AppFooter";
import { AppInstallBanner } from "../ui/AppInstallBanner";
import { AIAssistantWidget } from "../ai/AIAssistantWidget";
import { AuthModal } from "../auth/AuthModal";
import { InteractiveBriefModal } from "../directions/modals/InteractiveBriefModal";
import { TalentApplicationModal } from "../public/TalentApplicationModal";
import { PaystackPaymentModal } from "../payment/PaystackPaymentModal";
import { useViewNavigate, PORTAL_VIEWS } from "../../lib/viewRouting";

// The shared "chrome" around every real route (navbar, footer, announcement
// bar, install banner, AI widget, and the global modals) -- previously this
// all lived once inside the single catch-all route alongside every page's
// content. Now that each page is its own route, this is the one place that
// chrome is defined, and each route only needs to render its own page
// content inside <AppShell>.
interface AppShellContextValue {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
  onOpenTalentModal: () => void;
  onOpenPaymentModal: () => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell(): AppShellContextValue {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("useAppShell must be used within <AppShell>");
  return ctx;
}

interface AppShellProps {
  currentView: MainNavView;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentView, children }) => {
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTalentModalOpen, setIsTalentModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const onSelectView = useViewNavigate();

  const isPortalView = PORTAL_VIEWS.includes(currentView);

  const contextValue: AppShellContextValue = {
    onSelectView,
    onOpenBriefWizard: () => setIsBriefModalOpen(true),
    onOpenTalentModal: () => setIsTalentModalOpen(true),
    onOpenPaymentModal: () => setIsPaymentModalOpen(true),
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen w-full max-w-full flex-col overflow-x-hidden font-sans antialiased">
      {/* Accessibility: skip-to-content link, visually hidden until focused
          via keyboard, so keyboard/screen-reader users don't have to tab
          through the announcement bar + full navbar on every page. */}
      <a
        href="#main-content"
        className="bg-primary sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-xl"
      >
        Skip to main content
      </a>

      {/* No announcement/promo strip above the header: the Academy rhythm puts
          the offer pill inside the deep-navy hero band instead, and the header
          stays 100% agency-focused. */}
      {!isPortalView && (
        <AgencyHeader
          currentView={currentView}
          onSelectView={onSelectView}
          onOpenBriefWizard={() => setIsBriefModalOpen(true)}
        />
      )}

      <main id="main-content" className="flex-1">
        <AppShellContext.Provider value={contextValue}>{children}</AppShellContext.Provider>
      </main>

      {!isPortalView && (
        <AppFooter
          onSelectView={onSelectView}
          onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          onOpenTalentModal={() => setIsTalentModalOpen(true)}
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        />
      )}

      {!isPortalView && <AppInstallBanner />}

      <AIAssistantWidget
        onOpenBriefWizard={() => setIsBriefModalOpen(true)}
        onNavigateScreen={(screen) => onSelectView(screen as MainNavView)}
      />

      <AuthModal onNavigatePortal={(portal) => onSelectView(portal as MainNavView)} />

      <InteractiveBriefModal isOpen={isBriefModalOpen} onClose={() => setIsBriefModalOpen(false)} />

      <TalentApplicationModal
        isOpen={isTalentModalOpen}
        onClose={() => setIsTalentModalOpen(false)}
      />

      <PaystackPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
};

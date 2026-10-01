import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { AppNavbar, MainNavView } from "../components/layout/AppNavbar";
import { AppFooter } from "../components/layout/AppFooter";
import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { AppInstallBanner } from "../components/ui/AppInstallBanner";
import { HomepagePreview } from "../components/directions/views/HomepagePreview";
import { ServicesPreview } from "../components/directions/views/ServicesPreview";
import { CaseStudyPreview } from "../components/directions/views/CaseStudyPreview";
import { AboutView } from "../components/public/AboutView";
import { ProcessView } from "../components/public/ProcessView";
import { TalentNetworkView } from "../components/public/TalentNetworkView";
import { InsightsView } from "../components/public/InsightsView";
import { ContactView } from "../components/public/ContactView";
import { ClientPortal } from "../components/portal/ClientPortal";
import { PMPortal } from "../components/portal/PMPortal";
import { TalentPortal } from "../components/portal/TalentPortal";
import { AdminPortal } from "../components/portal/AdminPortal";
import { MobileSimulatorPreview } from "../components/directions/views/MobileSimulatorPreview";
import { InteractiveJourneyWalkthrough } from "../components/journey/InteractiveJourneyWalkthrough";
import { AIAssistantWidget } from "../components/ai/AIAssistantWidget";
import { AuthModal } from "../components/auth/AuthModal";
import { InteractiveBriefModal } from "../components/directions/modals/InteractiveBriefModal";
import { TalentApplicationModal } from "../components/public/TalentApplicationModal";
import { PaystackPaymentModal } from "../components/payment/PaystackPaymentModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NDH Agency | Digital Products, Brands & Growth Systems" },
      {
        name: "description",
        content:
          "NDH Agency builds premium software, brand systems, automation, and growth experiences for ambitious organizations.",
      },
      { property: "og:title", content: "NDH Agency | Digital Products, Brands & Growth Systems" },
      {
        property: "og:description",
        content:
          "Premium digital delivery with dedicated project leadership and vetted specialist teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NDHAgencyMainApp,
});

function NDHAgencyMainApp() {
  const [currentView, setCurrentView] = useState<MainNavView>("homepage");
  const [isBriefModalOpen, setIsBriefModalOpen] = useState<boolean>(false);
  const [isTalentModalOpen, setIsTalentModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  const isPortalView = [
    "client-dashboard",
    "pm-dashboard",
    "talent-dashboard",
    "admin-command",
  ].includes(currentView);

  const handleNavigate = (view: MainNavView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#070A14] text-[#F1F5F9] flex flex-col font-sans antialiased selection:bg-blue-600/30 selection:text-white">
      {/* 1. BROADCAST ANNOUNCEMENT BAR (Public Pages Only) */}
      {!isPortalView && (
        <AnnouncementBar
          onActionClick={() => {
            handleNavigate("homepage");
            setTimeout(() => {
              const el = document.getElementById("estimator");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        />
      )}

      {/* 2. PUBLIC TOP NAVIGATION */}
      {!isPortalView && (
        <AppNavbar
          currentView={currentView}
          onSelectView={handleNavigate}
          onOpenBriefWizard={() => setIsBriefModalOpen(true)}
        />
      )}

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1">
        {/* Public Marketing Views */}
        {currentView === "homepage" && (
          <HomepagePreview
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
            onSelectScreen={(s) => handleNavigate(s as MainNavView)}
          />
        )}

        {currentView === "services" && (
          <ServicesPreview onOpenBriefWizard={() => setIsBriefModalOpen(true)} />
        )}

        {currentView === "case-study" && (
          <CaseStudyPreview onOpenBriefWizard={() => setIsBriefModalOpen(true)} />
        )}

        {currentView === "about" && (
          <AboutView
            onSelectView={handleNavigate}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === "process" && (
          <ProcessView
            onSelectView={handleNavigate}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === "talent-network" && (
          <TalentNetworkView
            onSelectView={handleNavigate}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === "insights" && (
          <InsightsView
            onSelectView={handleNavigate}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === "contact" && (
          <ContactView
            onSelectView={handleNavigate}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {/* 4. STANDALONE ROLE-BASED PORTALS (Stand completely on their own) */}
        {currentView === "client-dashboard" && (
          <ClientPortal
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
            onBackToAgency={() => handleNavigate("homepage")}
          />
        )}

        {currentView === "pm-dashboard" && (
          <PMPortal onBackToAgency={() => handleNavigate("homepage")} />
        )}

        {currentView === "talent-dashboard" && (
          <TalentPortal onBackToAgency={() => handleNavigate("homepage")} />
        )}

        {currentView === "admin-command" && (
          <AdminPortal onBackToAgency={() => handleNavigate("homepage")} />
        )}

        {currentView === "journey" && (
          <InteractiveJourneyWalkthrough
            onNavigateScreen={(s) => handleNavigate(s as MainNavView)}
          />
        )}

        {currentView === "mobile-view" && (
          <MobileSimulatorPreview
            direction="direction-a"
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}
      </main>

      {/* 5. PUBLIC FOOTER */}
      {!isPortalView && (
        <AppFooter
          onSelectView={handleNavigate}
          onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          onOpenTalentModal={() => setIsTalentModalOpen(true)}
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        />
      )}

      {/* 6. PWA / App Installation Pill */}
      {!isPortalView && <AppInstallBanner />}

      {/* 7. Floating AI Customer Service / Support Assistant (NDH Sentinel) */}
      <AIAssistantWidget
        onOpenBriefWizard={() => setIsBriefModalOpen(true)}
        onNavigateScreen={(screen) => handleNavigate(screen as MainNavView)}
      />

      {/* 8. Authentication & Role Switcher Modal */}
      <AuthModal onNavigatePortal={(portal) => handleNavigate(portal as MainNavView)} />

      {/* 9. Interactive Proposal Scoping Wizard */}
      <InteractiveBriefModal isOpen={isBriefModalOpen} onClose={() => setIsBriefModalOpen(false)} />

      {/* 12. Talent Application Portal Modal */}
      <TalentApplicationModal
        isOpen={isTalentModalOpen}
        onClose={() => setIsTalentModalOpen(false)}
      />

      {/* 13. Paystack / Flutterwave Escrow Payment Modal */}
      <PaystackPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}

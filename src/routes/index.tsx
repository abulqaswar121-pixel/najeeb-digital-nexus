import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { AppNavbar, MainNavView } from '../components/layout/AppNavbar';
import { AppFooter } from '../components/layout/AppFooter';
import { HomepagePreview } from '../components/directions/views/HomepagePreview';
import { ServicesPreview } from '../components/directions/views/ServicesPreview';
import { CaseStudyPreview } from '../components/directions/views/CaseStudyPreview';
import { AboutView } from '../components/public/AboutView';
import { ProcessView } from '../components/public/ProcessView';
import { TalentNetworkView } from '../components/public/TalentNetworkView';
import { InsightsView } from '../components/public/InsightsView';
import { ContactView } from '../components/public/ContactView';
import { ClientPortal } from '../components/portal/ClientPortal';
import { PMPortal } from '../components/portal/PMPortal';
import { TalentPortal } from '../components/portal/TalentPortal';
import { AdminPortal } from '../components/portal/AdminPortal';
import { MobileSimulatorPreview } from '../components/directions/views/MobileSimulatorPreview';
import { InteractiveJourneyWalkthrough } from '../components/journey/InteractiveJourneyWalkthrough';
import { AIAssistantWidget } from '../components/ai/AIAssistantWidget';
import { AuthModal } from '../components/auth/AuthModal';
import { CreateAccountModal } from '../components/auth/CreateAccountModal';
import { InteractiveBriefModal } from '../components/directions/modals/InteractiveBriefModal';
import { ArchitecturalBlueprintModal } from '../components/directions/modals/ArchitecturalBlueprintModal';

export const Route = createFileRoute('/')({
  component: NDHAgencyMainApp,
});

function NDHAgencyMainApp() {
  const [currentView, setCurrentView] = useState<MainNavView>('homepage');
  const [isBriefModalOpen, setIsBriefModalOpen] = useState<boolean>(false);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F1F5F9] flex flex-col font-sans antialiased selection:bg-blue-600/30 selection:text-white">
      {/* Production Navigation Bar */}
      <AppNavbar
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBriefWizard={() => setIsBriefModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'homepage' && (
          <HomepagePreview
            direction="direction-a"
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
            onSelectScreen={(s) => {
              setCurrentView(s as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'services' && (
          <ServicesPreview
            direction="direction-a"
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === 'case-study' && (
          <CaseStudyPreview
            direction="direction-a"
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            onSelectView={(v) => setCurrentView(v)}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === 'process' && (
          <ProcessView
            onSelectView={(v) => setCurrentView(v)}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === 'talent-network' && (
          <TalentNetworkView
            onSelectView={(v) => setCurrentView(v)}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === 'insights' && (
          <InsightsView
            onSelectView={(v) => setCurrentView(v)}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === 'contact' && (
          <ContactView
            onSelectView={(v) => setCurrentView(v)}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentView === 'client-dashboard' && (
          <ClientPortal onOpenBriefWizard={() => setIsBriefModalOpen(true)} />
        )}

        {currentView === 'pm-dashboard' && <PMPortal />}

        {currentView === 'talent-dashboard' && <TalentPortal />}

        {currentView === 'admin-command' && <AdminPortal />}

        {currentView === 'journey' && (
          <InteractiveJourneyWalkthrough
            onNavigateScreen={(s) => {
              setCurrentView(s as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'mobile-view' && (
          <MobileSimulatorPreview
            direction="direction-a"
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}
      </main>

      {/* Production Footer with Academy Cross-Link */}
      <AppFooter
        onSelectView={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBriefWizard={() => setIsBriefModalOpen(true)}
      />

      {/* Floating AI Customer Service / Support Assistant (NDH Sentinel) */}
      <AIAssistantWidget
        onOpenBriefWizard={() => setIsBriefModalOpen(true)}
        onNavigateScreen={(screen) => {
          setCurrentView(screen as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Authentication & Role Switcher Modal */}
      <AuthModal
        onNavigatePortal={(portal) => {
          setCurrentView(portal as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Create Custom Test Account Modal */}
      <CreateAccountModal
        onNavigatePortal={(portal) => {
          setCurrentView(portal as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Proposal Scoping Wizard */}
      <InteractiveBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
      />

      {/* Architecture Blueprint Modal */}
      <ArchitecturalBlueprintModal
        isOpen={isBlueprintModalOpen}
        onClose={() => setIsBlueprintModalOpen(false)}
      />
    </div>
  );
}

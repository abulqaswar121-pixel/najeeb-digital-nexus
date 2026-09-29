import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { DesignDirectionId } from '../types/ndh';
import { DirectionNavbar, ScreenView } from '../components/directions/DirectionNavbar';
import { HomepagePreview } from '../components/directions/views/HomepagePreview';
import { ServicesPreview } from '../components/directions/views/ServicesPreview';
import { CaseStudyPreview } from '../components/directions/views/CaseStudyPreview';
import { ClientDashboardPreview } from '../components/directions/views/ClientDashboardPreview';
import { PMDashboardPreview } from '../components/directions/views/PMDashboardPreview';
import { TalentDashboardPreview } from '../components/directions/views/TalentDashboardPreview';
import { AdminCommandPreview } from '../components/directions/views/AdminCommandPreview';
import { MobileSimulatorPreview } from '../components/directions/views/MobileSimulatorPreview';
import { InteractiveJourneyWalkthrough } from '../components/journey/InteractiveJourneyWalkthrough';
import { InteractiveBriefModal } from '../components/directions/modals/InteractiveBriefModal';
import { DirectionSelectionModal } from '../components/directions/modals/DirectionSelectionModal';
import { ArchitecturalBlueprintModal } from '../components/directions/modals/ArchitecturalBlueprintModal';

export const Route = createFileRoute('/')({
  component: NDHAgencyStudio,
});

function NDHAgencyStudio() {
  const [currentDirection, setCurrentDirection] = useState<DesignDirectionId>('direction-a');
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('homepage');
  const [isBriefModalOpen, setIsBriefModalOpen] = useState<boolean>(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState<boolean>(false);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-primary/20">
      {/* Top Interactive Switchboard Bar */}
      <DirectionNavbar
        currentDirection={currentDirection}
        onSelectDirection={(dir) => setCurrentDirection(dir)}
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
        onOpenBlueprint={() => setIsBlueprintModalOpen(true)}
        onOpenSelectionModal={() => setIsSelectionModalOpen(true)}
        onOpenBriefWizard={() => setIsBriefModalOpen(true)}
      />

      {/* Screen Views */}
      <main className="flex-1">
        {currentScreen === 'homepage' && (
          <HomepagePreview
            direction={currentDirection}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
            onSelectScreen={(s) => setCurrentScreen(s)}
          />
        )}

        {currentScreen === 'services' && (
          <ServicesPreview
            direction={currentDirection}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentScreen === 'case-study' && (
          <CaseStudyPreview
            direction={currentDirection}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentScreen === 'client-dashboard' && (
          <ClientDashboardPreview
            direction={currentDirection}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}

        {currentScreen === 'pm-dashboard' && (
          <PMDashboardPreview direction={currentDirection} />
        )}

        {currentScreen === 'talent-dashboard' && (
          <TalentDashboardPreview direction={currentDirection} />
        )}

        {currentScreen === 'admin-command' && (
          <AdminCommandPreview direction={currentDirection} />
        )}

        {currentScreen === 'journey' && (
          <InteractiveJourneyWalkthrough
            onNavigateScreen={(s) => setCurrentScreen(s as any)}
          />
        )}

        {currentScreen === 'mobile-view' && (
          <MobileSimulatorPreview
            direction={currentDirection}
            onOpenBriefWizard={() => setIsBriefModalOpen(true)}
          />
        )}
      </main>

      {/* Interactive Modal Dialogs */}
      <InteractiveBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
      />

      <DirectionSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        currentDirection={currentDirection}
        onSelectDirection={(dir) => setCurrentDirection(dir)}
      />

      <ArchitecturalBlueprintModal
        isOpen={isBlueprintModalOpen}
        onClose={() => setIsBlueprintModalOpen(false)}
      />
    </div>
  );
}

import React from 'react';
import { DesignDirectionId } from '../../types/ndh';
import { DIRECTION_CONFIGS } from './DirectionStyles';
import {
  Layers,
  Sparkles,
  LayoutGrid,
  FileText,
  UserCheck,
  Briefcase,
  Terminal,
  Smartphone,
  BookOpen,
  CheckCircle2,
  Sliders,
  SendHorizontal,
  GitBranch,
} from 'lucide-react';

export type ScreenView =
  | 'homepage'
  | 'services'
  | 'case-study'
  | 'client-dashboard'
  | 'pm-dashboard'
  | 'talent-dashboard'
  | 'admin-command'
  | 'mobile-view'
  | 'journey';

interface DirectionNavbarProps {
  currentDirection: DesignDirectionId;
  onSelectDirection: (dir: DesignDirectionId) => void;
  currentScreen: ScreenView;
  onSelectScreen: (screen: ScreenView) => void;
  onOpenBlueprint: () => void;
  onOpenSelectionModal: () => void;
  onOpenBriefWizard: () => void;
}

export const DirectionNavbar: React.FC<DirectionNavbarProps> = ({
  currentDirection,
  onSelectDirection,
  currentScreen,
  onSelectScreen,
  onOpenBlueprint,
  onOpenSelectionModal,
  onOpenBriefWizard,
}) => {
  const activeConfig = DIRECTION_CONFIGS[currentDirection];

  const screens: { id: ScreenView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'homepage', label: 'Agency Homepage', icon: <Layers className="w-4 h-4" /> },
    { id: 'services', label: '10 Core Services', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'case-study', label: 'Flagship Case Study', icon: <FileText className="w-4 h-4" />, badge: 'Live ROI' },
    { id: 'client-dashboard', label: 'Client Workspace', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'pm-dashboard', label: 'PM Operations', icon: <Briefcase className="w-4 h-4" />, badge: 'Ops' },
    { id: 'talent-dashboard', label: 'Talent Workforce', icon: <Terminal className="w-4 h-4" />, badge: 'Private' },
    { id: 'admin-command', label: 'Admin Centre', icon: <Sliders className="w-4 h-4" />, badge: 'Super/Fin' },
    { id: 'journey', label: '13-Stage Journey Demo', icon: <GitBranch className="w-4 h-4" />, badge: 'End-to-End' },
    { id: 'mobile-view', label: 'Mobile Simulator', icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-xl shadow-sm transition-colors">
      {/* Top Banner: Direction Switcher & Strategic Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary font-semibold tracking-wide uppercase text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Interactive Direction Studio</span>
          </div>
          <span className="text-muted-foreground hidden md:inline">|</span>
          <span className="text-muted-foreground hidden lg:inline">
            Active: <strong className="text-foreground">{activeConfig.name}</strong> ({activeConfig.codename})
          </span>
        </div>

        {/* Direction Switcher Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
          <button
            onClick={() => onSelectDirection('direction-a')}
            className={`px-3 py-1.5 rounded-md font-medium text-xs transition-all flex items-center gap-1.5 ${
              currentDirection === 'direction-a'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-300"></span>
            <span>Dir A: Sovereign Neo-Precision</span>
          </button>

          <button
            onClick={() => onSelectDirection('direction-b')}
            className={`px-3 py-1.5 rounded-md font-medium text-xs transition-all flex items-center gap-1.5 ${
              currentDirection === 'direction-b'
                ? 'bg-[#C2410C] text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-300"></span>
            <span>Dir B: Pan-African Vanguard</span>
          </button>

          <button
            onClick={() => onSelectDirection('direction-c')}
            className={`px-3 py-1.5 rounded-md font-medium text-xs transition-all flex items-center gap-1.5 ${
              currentDirection === 'direction-c'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
            <span>Dir C: Hyper-Systemic Kinetic</span>
          </button>
        </div>

        {/* Action Buttons: Blueprint, Decision Selector, Brief Wizard */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBlueprint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-xs transition-colors border border-border"
            title="View Product Map, Permission Matrix, Data Model, Demo Plan & Suggestions"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Architecture Blueprints</span>
          </button>

          <button
            onClick={onOpenBriefWizard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/90 hover:bg-primary text-primary-foreground font-medium text-xs transition-colors shadow-sm"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Test Brief Wizard</span>
          </button>

          <button
            onClick={onOpenSelectionModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Select / Blend Direction</span>
          </button>
        </div>
      </div>

      {/* Screen View Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          {screens.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectScreen(s.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
                {s.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-mono ${
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/15 text-muted-foreground'
                    }`}
                  >
                    {s.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

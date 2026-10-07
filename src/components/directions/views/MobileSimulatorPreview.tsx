import React, { useState } from "react";
import { DesignDirectionId, ServiceDepartment } from "../../../types/ndh";
import { DIRECTION_CONFIGS } from "../DirectionStyles";
import { SERVICE_DEPARTMENTS, ACTIVE_PROJECTS } from "../../../data/mockData";
import {
  Smartphone,
  Menu,
  X,
  Layers,
  LayoutGrid,
  FileText,
  UserCheck,
  Briefcase,
  Terminal,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Award,
  ExternalLink,
  Lock,
} from "lucide-react";

interface MobileSimulatorPreviewProps {
  direction: DesignDirectionId;
  onOpenBriefWizard: () => void;
}

export const MobileSimulatorPreview: React.FC<MobileSimulatorPreviewProps> = ({
  direction,
  onOpenBriefWizard,
}) => {
  const config = DIRECTION_CONFIGS[direction];
  const [mobileScreen, setMobileScreen] = useState<
    "home" | "services" | "client" | "pm" | "talent"
  >("home");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <div className={`min-h-screen ${config.containerBg} py-8 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Simulator Info Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Interactive Mobile Viewport Simulator</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold text-foreground`}>
            Mobile Ergonomics & Touch-Optimized Views
          </h1>
          <p className={`text-xs sm:text-sm ${config.subtext} max-w-xl mx-auto`}>
            Test how client executives, project managers, and mobile visitors navigate NDH Agency on
            high-density iOS & Android screens.
          </p>

          {/* Quick Screen Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: "home", label: "Mobile Home" },
              { id: "services", label: "Mobile Services" },
              { id: "client", label: "Mobile Client Hub" },
              { id: "pm", label: "Mobile PM Ops" },
              { id: "talent", label: "Mobile Talent View" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMobileScreen(tab.id as Parameters<typeof setMobileScreen>[0]);
                  setMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  mobileScreen === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Device Frame */}
        <div className="relative mx-auto w-[375px] h-[720px] rounded-[48px] bg-black p-3 shadow-2xl border-4 border-zinc-700 ring-1 ring-white/10 flex flex-col justify-between overflow-hidden">
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 ml-16"></div>
          </div>

          {/* Inner Mobile Screen Content */}
          <div
            className={`w-full h-full rounded-[38px] ${config.containerBg} overflow-y-auto no-scrollbar pt-8 pb-16 flex flex-col justify-between text-xs`}
          >
            {/* Mobile Header Bar */}
            <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-40">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">
                  N
                </div>
                <span className="font-bold text-xs text-foreground">NDH Agency</span>
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-md text-foreground hover:bg-muted"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Drawer Menu if open */}
            {menuOpen ? (
              <div className="p-6 space-y-4 animate-fadeIn">
                <div className="text-xs font-semibold text-muted-foreground uppercase">
                  Navigation Menu
                </div>
                <div className="space-y-2">
                  {[
                    { id: "home", label: "Agency Homepage" },
                    { id: "services", label: "16 Core Departments" },
                    { id: "client", label: "Client Workspace" },
                    { id: "pm", label: "PM Command Portal" },
                    { id: "talent", label: "Talent Workforce" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMobileScreen(item.id as Parameters<typeof setMobileScreen>[0]);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left py-2 px-3 rounded-lg bg-card hover:bg-muted text-xs font-medium text-foreground flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenBriefWizard();
                    }}
                    className={`w-full py-2.5 rounded-lg text-xs font-semibold ${config.accentBtn}`}
                  >
                    Request a Proposal
                  </button>
                </div>
              </div>
            ) : (
              /* Mobile Screen Content */
              <div className="p-4 space-y-4">
                {/* 1. Mobile Home */}
                {mobileScreen === "home" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono">
                        Managed Services
                      </span>
                      <h2 className="text-lg font-bold text-foreground leading-tight">
                        Sovereign Digital Products for Global African Leaders.
                      </h2>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Dedicated PMs, vetted top 1% talents, guaranteed SLAs.
                      </p>
                    </div>

                    <button
                      onClick={onOpenBriefWizard}
                      className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${config.accentBtn}`}
                    >
                      <span>Build Custom Proposal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="p-3.5 rounded-xl bg-card border border-border space-y-2">
                      <div className="font-bold text-xs text-foreground">
                        Featured Impact: KoboPay
                      </div>
                      <div className="text-lg font-bold font-mono text-emerald-400">
                        74% Less Drop-Off
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        P95 transaction confirmation down to 280ms.
                      </p>
                    </div>

                    {/* Academy Cross-Link */}
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[11px] text-foreground">
                          Learn on NDH Academy
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Skill building & talent certification
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-primary" />
                    </div>
                  </div>
                )}

                {/* 2. Mobile Services */}
                {mobileScreen === "services" && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-foreground">16 Managed Departments</h3>
                    {SERVICE_DEPARTMENTS.slice(0, 4).map((d) => (
                      <div
                        key={d.id}
                        className="p-3 rounded-xl bg-card border border-border space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-foreground">{d.name}</span>
                          <span className="text-[10px] font-mono text-primary">
                            ${d.startingBudgetUSD}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                          {d.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Mobile Client Hub */}
                {mobileScreen === "client" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                      <div className="text-[10px] text-muted-foreground">Active Client Org</div>
                      <div className="font-bold text-xs text-foreground">KoboPay Global Inc.</div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        Milestone 2 Awaiting Sign-Off
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-background border border-border space-y-2">
                      <div className="font-semibold text-xs text-foreground">
                        Pending Approval: $11,000 USD
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        React 19 Frontend + Biometric KYC package
                      </p>
                      <button
                        className={`w-full py-1.5 rounded-lg text-xs font-semibold ${config.accentBtn}`}
                      >
                        Sign-off Milestone
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Mobile PM Ops */}
                {mobileScreen === "pm" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                      <div className="text-[10px] text-muted-foreground">PM Command: Tariq</div>
                      <div className="font-bold text-xs text-foreground">3 Sprints Active</div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        Agency Margin: 60.0%
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-background border border-border space-y-1">
                      <div className="text-[10px] text-muted-foreground">Lead Inbox:</div>
                      <div className="font-bold text-xs text-foreground">
                        Savannah Health (Score: 94)
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        $25,000 - $50,000 Clinical Lab Portal
                      </p>
                    </div>
                  </div>
                )}

                {/* 5. Mobile Talent View */}
                {mobileScreen === "talent" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                      <div className="text-[10px] text-muted-foreground">
                        Talent: Architect-Alpha
                      </div>
                      <div className="font-bold text-xs text-foreground">
                        Elite Tier Squad Leader
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        Rating: 4.98 / 5.0
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <Lock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Confidential Isolation</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        PM buffer active. Client identity and financial margins protected.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Bottom Bar Navigation */}
            <div className="px-4 py-2 border-t border-border/40 bg-background/95 flex items-center justify-around text-muted-foreground">
              <button
                onClick={() => setMobileScreen("home")}
                className={`flex flex-col items-center gap-0.5 ${mobileScreen === "home" ? "text-primary" : ""}`}
              >
                <Layers className="w-4 h-4" />
                <span className="text-[9px]">Home</span>
              </button>
              <button
                onClick={() => setMobileScreen("services")}
                className={`flex flex-col items-center gap-0.5 ${mobileScreen === "services" ? "text-primary" : ""}`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-[9px]">Services</span>
              </button>
              <button
                onClick={() => setMobileScreen("client")}
                className={`flex flex-col items-center gap-0.5 ${mobileScreen === "client" ? "text-primary" : ""}`}
              >
                <UserCheck className="w-4 h-4" />
                <span className="text-[9px]">Client</span>
              </button>
              <button
                onClick={() => setMobileScreen("pm")}
                className={`flex flex-col items-center gap-0.5 ${mobileScreen === "pm" ? "text-primary" : ""}`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="text-[9px]">PM</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

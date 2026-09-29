import React, { useState } from 'react';
import { DesignDirectionId, ServiceDepartment, ServiceDepartmentInfo } from '../../../types/ndh';
import { DIRECTION_CONFIGS } from '../DirectionStyles';
import { SERVICE_DEPARTMENTS, CASE_STUDIES } from '../../../data/mockData';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Award,
  Lock,
  Users,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface HomepagePreviewProps {
  direction: DesignDirectionId;
  onOpenBriefWizard: () => void;
  onSelectScreen: (screen: any) => void;
}

export const HomepagePreview: React.FC<HomepagePreviewProps> = ({
  direction,
  onOpenBriefWizard,
  onSelectScreen,
}) => {
  const config = DIRECTION_CONFIGS[direction];
  const [selectedDept, setSelectedDept] = useState<ServiceDepartment>('web_app_development');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

  const currentDeptInfo: ServiceDepartmentInfo =
    SERVICE_DEPARTMENTS.find((d) => d.id === selectedDept) || SERVICE_DEPARTMENTS[0]!;
  const featuredCases = CASE_STUDIES.filter((c) => c.featured);

  return (
    <div className={`min-h-screen ${config.containerBg} transition-colors duration-300 font-sans`}>
      {/* Direction Spec Indicator Bar */}
      <div className="border-b border-border/40 bg-muted/30 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={config.badgeStyle}>{config.badge}</span>
            <span className="font-medium text-foreground">{config.name}</span>
            <span className={config.subtext}>— {config.tagline}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className={config.subtext}>Palette: {config.paletteDescription.split(',')[0]}</span>
            <button
              onClick={() => setCurrency(currency === 'USD' ? 'NGN' : 'USD')}
              className="px-2 py-0.5 rounded bg-background border border-border font-mono text-xs hover:border-primary transition-colors"
            >
              Currency: {currency} (Click to toggle)
            </button>
          </div>
        </div>
      </div>

      {/* Main Agency Header / Nav */}
      <nav className={`sticky top-0 z-40 ${config.navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-lg tracking-wider">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-foreground">NDH Agency</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-primary/10 text-primary font-mono uppercase">
                  Nexus
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-none">Part of Najeeb Digital Hub</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <button onClick={() => onSelectScreen('services')} className="hover:text-foreground transition-colors">
              Services & Capabilities
            </button>
            <button onClick={() => onSelectScreen('case-study')} className="hover:text-foreground transition-colors">
              Work & Case Studies
            </button>
            <button onClick={() => onSelectScreen('pm-dashboard')} className="hover:text-foreground transition-colors">
              How We Work (Managed PM)
            </button>
            <button onClick={() => onSelectScreen('talent-dashboard')} className="hover:text-foreground transition-colors">
              Vetted Talent Network
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onSelectScreen('client-dashboard')}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:bg-muted text-foreground transition-colors"
            >
              Client Login
            </button>
            <button onClick={onOpenBriefWizard} className={`px-4 py-2 rounded-md text-xs ${config.accentBtn}`}>
              Request a Proposal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Managed Digital Services Bureau • Not an Open Freelance Marketplace</span>
              </div>

              {/* Dynamic Hero Title according to direction */}
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl ${config.typographyHeading} leading-[1.1] text-foreground`}>
                {direction === 'direction-a' && (
                  <>
                    Engineering Sovereign Digital Products with <span className={config.accentText}>Algorithmic Precision.</span>
                  </>
                )}
                {direction === 'direction-b' && (
                  <>
                    Pan-African Creative Mastery. <span className={config.accentText}>Engineered for Global Impact.</span>
                  </>
                )}
                {direction === 'direction-c' && (
                  <>
                    The High-Throughput <span className={config.accentText}>Operating System</span> for Digital Services.
                  </>
                )}
              </h1>

              <p className={`text-base sm:text-lg ${config.subtext} max-w-2xl leading-relaxed`}>
                NDH Agency pairs venture-backed startups, sovereign institutions, and global diaspora enterprises with dedicated project managers and vetted top 1% African tech & creative talents. Zero communication friction. Guaranteed SLAs. Complete privacy.
              </p>

              {/* Action Buttons & Value Props */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenBriefWizard}
                  className={`px-6 py-3.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${config.accentBtn}`}
                >
                  <span>Build Tailored Scope & Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectScreen('case-study')}
                  className="px-5 py-3.5 rounded-lg text-sm font-medium border border-border bg-card hover:bg-muted text-foreground transition-all flex items-center gap-2"
                >
                  <span>Explore Verified Case Studies</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Live Telemetry / Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border/50">
                <div>
                  <div className={`text-2xl sm:text-3xl ${config.statValue}`}>99.4%</div>
                  <div className={`text-xs ${config.subtext}`}>On-Time SLA Delivery</div>
                </div>
                <div>
                  <div className={`text-2xl sm:text-3xl ${config.statValue}`}>140+</div>
                  <div className={`text-xs ${config.subtext}`}>Vetted Tier Talents</div>
                </div>
                <div>
                  <div className={`text-2xl sm:text-3xl ${config.statValue}`}>$42M+</div>
                  <div className={`text-xs ${config.subtext}`}>Client Impact Volume</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual / Live HUD Preview Card */}
            <div className="lg:col-span-5">
              <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-5 shadow-2xl`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
                      Live Delivery Orchestrator
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px]">
                    SLA: 99.9%
                  </span>
                </div>

                {/* Operating Model Sandbox */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-background/80 border border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                        C
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Client Enterprise (Lagos / London)</div>
                        <div className="text-[11px] text-muted-foreground">Scope: FinTech Edge Web App</div>
                      </div>
                    </div>
                    <span className="text-emerald-500 font-mono text-[11px]">Protected</span>
                  </div>

                  <div className="flex justify-center text-primary py-0.5">
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      <span>NDH Project Manager Buffer & QA Gate</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-background/80 border border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                        T
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Internal Vetted Squad (Architect-Alpha)</div>
                        <div className="text-[11px] text-muted-foreground">Elite Tier • TanStack/Cloudflare</div>
                      </div>
                    </div>
                    <span className="text-blue-400 font-mono text-[11px]">Active Sprint</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Milestone 2 QA Gate:</span>
                    <span className="text-emerald-400 font-mono font-medium">Passed (Score: 4.95/5.0)</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border/40">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Private identity isolation enforced: Client and talent cannot exchange direct contact or raw margins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Core Service Departments Selector */}
      <section className="py-16 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-primary">Department Capabilities</span>
              <h2 className={`text-2xl sm:text-3xl ${config.typographyHeading} text-foreground mt-1`}>
                Ten Specialized Managed Departments
              </h2>
              <p className={`text-sm ${config.subtext} mt-1 max-w-xl`}>
                Select a department below to explore capabilities, deliverables, turnaround SLAs, and starting proposal estimates.
              </p>
            </div>

            <button
              onClick={() => onSelectScreen('services')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 self-start md:self-auto"
            >
              <span>View Full Services Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Department Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {SERVICE_DEPARTMENTS.map((dept) => {
              const isSelected = selectedDept === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card border-border hover:border-border/80 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {dept.name}
                </button>
              );
            })}
          </div>

          {/* Selected Department Showcase Card */}
          <div className={`p-8 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-6 shadow-xl`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className={config.badgeStyle}>{currentDeptInfo.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    Avg Turnaround: {currentDeptInfo.averageTurnaroundDays} Days
                  </span>
                </div>

                <h3 className={`text-xl sm:text-2xl ${config.typographyHeading} text-foreground`}>
                  {currentDeptInfo.tagline}
                </h3>

                <p className={`text-sm ${config.subtext} leading-relaxed`}>{currentDeptInfo.description}</p>

                {/* Capabilities Grid */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-foreground">Core Capabilities:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {currentDeptInfo.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground mr-1">Stack:</span>
                  {currentDeptInfo.techStack.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-muted text-[11px] font-mono text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Side: Lead Info & Starting Estimate */}
              <div className="lg:col-span-5 space-y-5 lg:border-l lg:border-border/60 lg:pl-8">
                <div className="p-4 rounded-xl bg-background/60 border border-border/50 space-y-2">
                  <div className="text-[11px] text-muted-foreground">Department Lead:</div>
                  <div className="font-semibold text-foreground text-sm">{currentDeptInfo.leadName}</div>
                  <div className="text-xs text-primary">{currentDeptInfo.leadTitle}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{currentDeptInfo.activeTalentsCount} Vetted Talents in Pool</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background/60 border border-border/50 space-y-2">
                  <div className="text-[11px] text-muted-foreground">Estimated Starting Investment:</div>
                  <div className={`text-2xl ${config.statValue}`}>
                    {currency === 'USD'
                      ? `$${currentDeptInfo.startingBudgetUSD.toLocaleString()} USD`
                      : `₦${currentDeptInfo.startingBudgetNGN.toLocaleString()} NGN`}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Custom tailored scope generated via proposal after discovery triage.
                  </p>
                </div>

                <button
                  onClick={onOpenBriefWizard}
                  className={`w-full py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 ${config.accentBtn}`}
                >
                  <span>Request Proposal for {currentDeptInfo.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Studies Section */}
      <section className="py-16 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-primary">Proven Commercial Impact</span>
              <h2 className={`text-2xl sm:text-3xl ${config.typographyHeading} text-foreground mt-1`}>
                Flagship Case Studies & Measurable ROI
              </h2>
              <p className={`text-sm ${config.subtext} mt-1 max-w-xl`}>
                Explore audited transformation records across fintech, agri-supply chains, luxury commerce, and sovereign portals.
              </p>
            </div>

            <button
              onClick={() => onSelectScreen('case-study')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All 6 Case Studies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCases.map((cs) => (
              <div
                key={cs.id}
                onClick={() => onSelectScreen('case-study')}
                className={`group cursor-pointer rounded-2xl overflow-hidden ${config.cardBg} border ${config.cardBorder} hover:border-primary/50 transition-all shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={cs.heroImage}
                      alt={cs.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                        {cs.industry}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="text-xs text-muted-foreground">{cs.location} • {cs.year}</div>
                    <h3 className={`text-base font-bold text-foreground group-hover:${config.accentText} transition-colors line-clamp-2`}>
                      {cs.title}
                    </h3>
                    <p className={`text-xs ${config.subtext} line-clamp-3 leading-relaxed`}>{cs.challenge}</p>
                  </div>
                </div>

                {/* Primary Metric Banner */}
                <div className="p-6 pt-0 border-t border-border/40 mt-4">
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <div className={`text-xl ${config.statValue}`}>{cs.measurableOutcomes[0]?.metric}</div>
                      <div className="text-[10px] text-muted-foreground">{cs.measurableOutcomes[0]?.label}</div>
                    </div>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Story</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discrete NDH Academy Bridge Footer Cross-Link */}
      <footer className={`${config.footerBg} py-12 text-xs`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Academy Cross-Link Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Looking to build your skills? Explore NDH Academy.
                </h4>
                <p className="text-xs text-muted-foreground">
                  NDH Academy trains and certifies elite tech talents across Africa. Decoupled codebase & separate platform.
                </p>
              </div>
            </div>
            <a
              href="https://academy.ndh.com.ng"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 shrink-0 hover:bg-primary/90 transition-colors"
            >
              <span>Visit academy.ndh.com.ng</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4 border-t border-border/40">
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">NDH Agency</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Managed digital services bureau engineered for sovereign enterprises, high-growth scale-ups, and international diaspora leaders.
              </p>
              <div className="text-[11px] text-muted-foreground">Part of Najeeb Digital Hub Ecosystem</div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-foreground uppercase tracking-wider text-[11px]">Core Services</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>Web & App Development</li>
                <li>Product & UI/UX Design</li>
                <li>AI Solutions & Automation</li>
                <li>Brand Strategy & Identity</li>
                <li>Growth & E-commerce</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-foreground uppercase tracking-wider text-[11px]">Operations & Security</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>Dedicated Project Managers</li>
                <li>Confidential Talent Privacy</li>
                <li>Multi-Currency Billing (NGN/USD)</li>
                <li>NDPR & Privacy Compliance</li>
                <li>SLA Assurance & QA Gates</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-foreground uppercase tracking-wider text-[11px]">Portals & Access</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <button onClick={() => onSelectScreen('client-dashboard')} className="hover:text-foreground">
                    Client Workspace
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectScreen('pm-dashboard')} className="hover:text-foreground">
                    Project Manager Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectScreen('talent-dashboard')} className="hover:text-foreground">
                    Talent Workforce Network
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectScreen('admin-command')} className="hover:text-foreground">
                    Admin Command Centre
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/30 text-[11px] text-muted-foreground">
            <div>© 2026 NDH Agency (agency.ndh.com.ng). All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Engagement</span>
              <span>Security Audits</span>
              <span>ISO 27001 / NDPR Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

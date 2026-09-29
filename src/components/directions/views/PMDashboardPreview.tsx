import React, { useState } from 'react';
import { DesignDirectionId, ServiceDepartment } from '../../../types/ndh';
import { DIRECTION_CONFIGS } from '../DirectionStyles';
import { ACTIVE_PROJECTS, INCOMING_LEADS, VETTED_TALENTS, SERVICE_DEPARTMENTS } from '../../../data/mockData';
import {
  Briefcase,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Filter,
  DollarSign,
  TrendingUp,
  FileCheck,
  Search,
  Lock,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

interface PMDashboardPreviewProps {
  direction: DesignDirectionId;
}

export const PMDashboardPreview: React.FC<PMDashboardPreviewProps> = ({ direction }) => {
  const config = DIRECTION_CONFIGS[direction];
  const [activeTab, setActiveTab] = useState<'triage' | 'projects' | 'talent_matching' | 'qa_gates'>('projects');
  const [selectedTaskDept, setSelectedTaskDept] = useState<ServiceDepartment>('web_app_development');
  const [talentInvited, setTalentInvited] = useState<string | null>(null);
  const [qaApproved, setQaApproved] = useState<boolean>(false);

  const activeProject = ACTIVE_PROJECTS[0];
  const availableTalents = VETTED_TALENTS.filter((t) => t.department === selectedTaskDept);

  return (
    <div className={`min-h-screen ${config.containerBg} py-8 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* PM Ops Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Operations Command: Tariq Al-Najeeb</h1>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-mono text-[10px] border border-blue-500/20">
                  Principal Project Manager
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                3 Active Sprints • 2 Pending QA Sign-offs • 99.4% Team On-Time SLA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-background border border-border text-xs flex items-center gap-3">
              <div>
                <span className="text-[10px] text-muted-foreground block">Agency Margin Guard:</span>
                <span className="font-mono font-bold text-emerald-400">60.0% Protected</span>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Active Squads:</span>
                <span className="font-mono font-bold text-foreground">8 Talents Assigned</span>
              </div>
            </div>
          </div>
        </div>

        {/* PM Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'projects', label: 'Active Sprints & Margin Health', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'triage', label: 'Brief Triage & Scope Builder', icon: <FileCheck className="w-4 h-4" />, badge: '3 Leads' },
            { id: 'talent_matching', label: 'Intelligent Talent Allocator', icon: <Users className="w-4 h-4" /> },
            { id: 'qa_gates', label: 'QA Approval & Revision Gates', icon: <CheckCircle2 className="w-4 h-4" />, badge: '1 Gate' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black font-mono text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Active Sprints & Financial Margin Overview */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-2`}>
                <div className="text-xs text-muted-foreground">Client Revenue Under Management</div>
                <div className={`text-2xl ${config.statValue}`}>$88,500 USD</div>
                <div className="text-xs text-muted-foreground font-mono">₦132,750,000 NGN across 3 projects</div>
              </div>

              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-2`}>
                <div className="text-xs text-muted-foreground">Talent Cost Allocation</div>
                <div className="text-2xl font-bold font-mono text-foreground">$34,500 USD</div>
                <div className="text-xs text-emerald-500 font-mono">Gross Agency Margin: $54,000 (61.0%)</div>
              </div>

              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-2`}>
                <div className="text-xs text-muted-foreground">Delivery Health Index</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">98.5% Healthy</div>
                <div className="text-xs text-muted-foreground">0 Critical Blockers • 1 Scope Clarification</div>
              </div>
            </div>

            {/* Projects Table with PM Controls */}
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-4`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="font-bold text-sm text-foreground">Managed Client Sprints</h3>
                <span className="text-xs text-muted-foreground font-mono">Confidential Financial Controls Active</span>
              </div>

              <div className="space-y-4">
                {ACTIVE_PROJECTS.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-xl bg-background border border-border space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-primary font-bold">{proj.code}</span>
                          <span className="font-bold text-sm text-foreground">{proj.title}</span>
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-mono text-[10px]">
                            {proj.department.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Client: <strong>{proj.organizationName}</strong> • Target: {proj.targetEndDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-foreground">
                            Client: ${proj.totalClientBudgetUSD.toLocaleString()} | Margin: {proj.grossMarginPercentage}%
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Talent Payout Cap: ${proj.totalTalentCostUSD.toLocaleString()} USD
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Milestone Status */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Sprint Progress:</span>
                        <span className="font-mono text-primary font-semibold">{proj.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${proj.progressPercentage}%` }}></div>
                      </div>
                    </div>

                    {/* Quick PM Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Lock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Client cannot see talent identities or internal margin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('talent_matching')}
                          className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80"
                        >
                          Manage Squad Talents
                        </button>
                        <button
                          onClick={() => setActiveTab('qa_gates')}
                          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
                        >
                          Review QA Deliverables
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Brief Triage & Scope Builder */}
        {activeTab === 'triage' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-4`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="font-bold text-sm text-foreground">Incoming Brief Qualification & Scope Builder</h3>
                <span className="text-xs text-muted-foreground">Automated Lead Scoring Engine</span>
              </div>

              <div className="space-y-4">
                {INCOMING_LEADS.map((lead) => (
                  <div key={lead.id} className="p-5 rounded-xl bg-background border border-border space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{lead.companyName}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px]">
                          Score: {lead.score}/100
                        </span>
                        {lead.ndaRequested && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-mono text-[10px]">
                            NDA Requested
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">Source: {lead.source}</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{lead.projectOverview}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Department:</span>
                        <span className="font-semibold text-foreground uppercase">{lead.department.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Budget Range:</span>
                        <span className="font-semibold text-foreground font-mono">{lead.budgetRange}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Timeline:</span>
                        <span className="font-semibold text-foreground">{lead.timeline}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Contact:</span>
                        <span className="font-semibold text-foreground">{lead.contactName} ({lead.country})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/40">
                      <span className="text-xs text-muted-foreground">Auto-assigned PM: Tariq Al-Najeeb</span>
                      <button className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${config.accentBtn}`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Draft Formal Proposal & Milestone Schedule</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Intelligent Talent Matching Engine */}
        {activeTab === 'talent_matching' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-6 shadow-xl`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
                <div>
                  <h3 className="font-bold text-base text-foreground">Talent Allocation Engine</h3>
                  <p className="text-xs text-muted-foreground">
                    Matches vetted talents based on skills, tier, delivery rating, and conflict rules.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Filter by Skill Dept:</span>
                  <select
                    value={selectedTaskDept}
                    onChange={(e) => setSelectedTaskDept(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground font-medium focus:outline-none focus:border-primary"
                  >
                    {SERVICE_DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Matched Talents List */}
              <div className="space-y-4">
                {availableTalents.map((talent) => (
                  <div
                    key={talent.id}
                    className="p-5 rounded-xl bg-background border border-border flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{talent.pseudonym}</span>
                        <span className="text-xs text-muted-foreground font-mono">({talent.fullName} - Confidential)</span>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px] font-bold">
                          {talent.tier} Tier
                        </span>
                        {talent.academyGraduate && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-mono text-[10px] flex items-center gap-1 border border-amber-500/20">
                            <Sparkles className="w-3 h-3" />
                            <span>NDH Academy Verified</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">{talent.bio}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {talent.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right text-xs">
                        <div className="font-mono font-bold text-emerald-400">{talent.qualityScore} / 5.0 Rating</div>
                        <div className="text-[10px] text-muted-foreground">{talent.onTimeDeliveryRate}% On-Time SLA</div>
                        <div className="text-[10px] text-muted-foreground font-mono">${talent.hourlyRateInternalUSD}/hr internal</div>
                      </div>

                      <button
                        onClick={() => setTalentInvited(talent.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                          talentInvited === talent.id
                            ? 'bg-emerald-600 text-white cursor-default'
                            : config.accentBtn
                        }`}
                      >
                        {talentInvited === talent.id ? 'Invitation Dispatched ✓' : 'Dispatch Private Task Invite'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: QA Approval & Revision Gates */}
        {activeTab === 'qa_gates' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-6 shadow-xl`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-primary">QA Evaluation Gate</span>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    Milestone 2 Deliverables Submitted by Architect-Alpha
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Project: KoboPay Global Web App • Sprint Version: v2.0
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 font-mono text-xs font-semibold">
                    Pending PM Approval
                  </span>
                </div>
              </div>

              {/* Deliverable Review Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-foreground">QA Inspection Checklist:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    'TypeScript strict type check: 0 errors',
                    'Biometric KYC integration latency < 300ms',
                    'Zero direct client identity leaks in code comments',
                    'Automated integration test coverage > 85%',
                  ].map((check, i) => (
                    <div key={i} className="p-3 rounded-lg bg-background border border-border flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-foreground">{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h5 className="font-bold text-sm text-foreground">Authorize QA Gate Pass</h5>
                  <p className="text-xs text-muted-foreground">
                    Approving this gate marks the deliverable as verified and presents it to KoboPay in their Client Portal.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-medium hover:bg-muted">
                    Request Talent Revision
                  </button>
                  <button
                    onClick={() => setQaApproved(true)}
                    disabled={qaApproved}
                    className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                      qaApproved ? 'bg-emerald-600 text-white cursor-default' : config.accentBtn
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{qaApproved ? 'QA Approved & Sent to Client Portal ✓' : 'Approve QA & Publish to Client'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

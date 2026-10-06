import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/authStore";
import { AgencySectorMark } from "../brand/AgencySectorMark";
import {
  dbService,
  useBriefs,
  useConsultationRequests,
  useInternalTalents,
} from "../../lib/databaseStore";
import { ServiceDepartment } from "../../types/ndh";
import { ACTIVE_PROJECTS, INCOMING_LEADS, SERVICE_DEPARTMENTS } from "../../data/mockData";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  FileCheck,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { PortalNavDropdown } from "./PortalNavDropdown";

export const PMPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "projects" | "triage" | "talent_matching" | "qa_gates"
  >("projects");
  const [selectedTaskDept, setSelectedTaskDept] =
    useState<ServiceDepartment>("web_app_development");
  const [talentInvited, setTalentInvited] = useState<string | null>(null);
  // Server-persisted QA gate state for KoboPay project proj-001, milestone 2
  // (previously local-only `useState` that reset on refresh and had no
  // effect on the Client Portal at all).
  const QA_PROJECT_ID = "proj-001";
  const QA_MILESTONE_INDEX = 2;
  const [qaApproved, setQaApproved] = useState<boolean>(false);
  const [qaError, setQaError] = useState<string | null>(null);
  useEffect(() => {
    dbService
      .getMilestoneApproval(QA_PROJECT_ID, QA_MILESTONE_INDEX)
      .then((approval) => setQaApproved(approval.qaApproved))
      .catch(() => undefined);
  }, []);

  const internalTalents = useInternalTalents();
  const availableTalents = internalTalents.filter((t) => t.department === selectedTaskDept);

  // Real briefs submitted through the public "Start Your Project" wizard and
  // real consultation requests from the Contact page. These used to be
  // invisible here -- the triage tab only ever showed the hardcoded sample
  // leads below, so genuine prospect submissions never reached a PM.
  const liveBriefs = useBriefs();
  const liveConsultRequests = useConsultationRequests();
  const [claimingBriefId, setClaimingBriefId] = useState<string | null>(null);

  const pmNavTabs = [
    {
      id: "projects",
      label: "Active Sprints & Margin Health",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "triage",
      label: "Brief Triage & Scope Builder",
      icon: <FileCheck className="w-4 h-4" />,
      badge: "3 Leads",
    },
    {
      id: "talent_matching",
      label: "Intelligent Talent Allocator",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "qa_gates",
      label: "QA Approval & Revision Gates",
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: "1 Gate",
    },
  ];

  return (
    <div className="bg-[#070A14] text-[#F1F5F9] min-h-screen font-sans flex flex-col">
      {/* Standalone PM Operations Top Bar */}
      <header className="sticky top-0 z-40 flex w-full max-w-full items-center justify-between gap-3 overflow-x-clip border-b border-white/10 bg-eco-navy/95 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* Open Gateway master mark + agency sector badge */}
            <AgencySectorMark size="sm" className="shrink-0" />
            <span className="truncate font-display text-sm font-semibold text-white sm:text-base">
              Project Manager Operations Command
            </span>
            <span className="hidden shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-bold min-[420px]:inline-block bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              INTERNAL DISPATCH
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 sm:flex">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="max-w-[16ch] truncate">Lead PM: {user?.fullName || "PM"}</span>
          </div>

          <PortalNavDropdown
            tabs={pmNavTabs}
            activeTab={activeTab}
            onSelect={(id) => setActiveTab(id as typeof activeTab)}
          />
        </div>
      </header>

      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* PM Ops Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Operations Command: {user?.fullName || "PM"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/20">
                    Principal Project Manager
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  3 Active Sprints • 2 Pending QA Sign-offs • 99.4% Team On-Time SLA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block">Agency Margin Guard:</span>
                  <span className="font-mono font-bold text-emerald-400">60.0% Protected</span>
                </div>
                <div className="w-px h-6 bg-slate-800"></div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Active Squads:</span>
                  <span className="font-mono font-bold text-white">8 Talents Assigned</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab 1: Active Sprints */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-2">
                  <span className="text-xs text-slate-400">Client Revenue Under Management</span>
                  <div className="text-2xl font-bold font-mono text-white">$88,500 USD</div>
                  <div className="text-xs text-slate-400 font-mono">
                    ₦132,750,000 NGN across 3 projects
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-2">
                  <span className="text-xs text-slate-400">Talent Cost Allocation</span>
                  <div className="text-2xl font-bold font-mono text-white">$34,500 USD</div>
                  <div className="text-xs text-emerald-400 font-mono">
                    Gross Agency Margin: $54,000 (61.0%)
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-2">
                  <span className="text-xs text-slate-400">Delivery Health Index</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">98.5% Healthy</div>
                  <div className="text-xs text-slate-400">
                    0 Critical Blockers • 1 Scope Clarification
                  </div>
                </div>
              </div>

              {/* Projects Table with PM Controls */}
              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white">Managed Client Sprints</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Confidential Financial Controls Active
                  </span>
                </div>

                <div className="space-y-4">
                  {ACTIVE_PROJECTS.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-blue-400 font-bold">
                              {proj.code}
                            </span>
                            <span className="font-bold text-sm text-white">{proj.title}</span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                              {proj.department.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-0.5">
                            Client: <strong>{proj.organizationName}</strong> • Target:{" "}
                            {proj.targetEndDate}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-mono font-bold text-white">
                              Client: ${proj.totalClientBudgetUSD.toLocaleString()} | Margin:{" "}
                              {proj.grossMarginPercentage}%
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Talent Payout Cap: ${proj.totalTalentCostUSD.toLocaleString()} USD
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar & Milestone Status */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Sprint Progress:</span>
                          <span className="font-mono text-blue-400 font-semibold">
                            {proj.progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${proj.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Quick PM Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Client cannot see talent identities or internal margin</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveTab("talent_matching")}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                          >
                            Manage Squad Talents
                          </button>
                          <button
                            onClick={() => setActiveTab("qa_gates")}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
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
          {activeTab === "triage" && (
            <div className="space-y-6">
              {/* Live submissions from the public "Start Your Project" wizard and
                  Contact page consultation form. These previously never appeared
                  anywhere in the PM/Admin tooling -- a real prospect's brief would
                  vanish silently. They now surface here in real time. */}
              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    Live Inbound Submissions
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      {liveBriefs.length + liveConsultRequests.length} TOTAL
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Real visitor activity, this browser
                  </span>
                </div>

                {liveBriefs.length === 0 && liveConsultRequests.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No live briefs or consultation requests yet. Submit the "Start Your Project"
                    wizard or the Contact page form from the public site to see it appear here
                    instantly.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {liveBriefs.map((brief) => (
                      <div
                        key={brief.id}
                        className="p-5 rounded-xl bg-slate-900/80 border border-emerald-800/50 space-y-3 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">
                              {brief.organizationName}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                              Live Brief
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                              {brief.status.replace("_", " ")}
                            </span>
                          </div>
                          <span className="text-slate-400 font-mono">
                            {new Date(brief.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-slate-300 leading-relaxed">{brief.briefDetails}</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-[11px]">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Department:</span>
                            <span className="font-semibold text-white uppercase">
                              {brief.department.replace("_", " ")}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Scope Tier:</span>
                            <span className="font-semibold text-emerald-400 font-mono capitalize">
                              {brief.scopeTier} — {brief.budgetAmount} {brief.currency}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Timeline:</span>
                            <span className="font-semibold text-white">{brief.timelineWeeks}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Contact:</span>
                            <span className="font-semibold text-white">
                              {brief.clientEmail}
                              {brief.clientPhone ? ` (${brief.clientPhone})` : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                          <span className="text-slate-400">
                            Assigned PM:{" "}
                            <strong
                              className={
                                brief.assignedPM === "Unassigned"
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }
                            >
                              {brief.assignedPM}
                            </strong>
                          </span>
                          <button
                            onClick={async () => {
                              setClaimingBriefId(brief.id);
                              try {
                                await dbService.assignBrief(brief.id);
                              } catch {
                                // Transient network/role error -- the button
                                // simply stays clickable so the PM can retry.
                              } finally {
                                setClaimingBriefId(null);
                              }
                            }}
                            disabled={
                              brief.assignedPM !== "Unassigned" || claimingBriefId === brief.id
                            }
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-1.5 shadow-md transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                              {brief.assignedPM !== "Unassigned"
                                ? brief.assignedPM === user?.fullName
                                  ? "Claimed by You"
                                  : `Claimed by ${brief.assignedPM}`
                                : claimingBriefId === brief.id
                                  ? "Claiming..."
                                  : "Claim This Brief & Start Proposal"}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {liveConsultRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-5 rounded-xl bg-slate-900/80 border border-blue-800/50 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{req.fullName}</span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold uppercase">
                              Consultation Request
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                              {req.status}
                            </span>
                          </div>
                          <span className="text-slate-400 font-mono">
                            {new Date(req.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-300">
                          {req.email} • Preferred date {req.preferredDate} • Focus: {req.focusArea}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white">
                    Incoming Brief Qualification & Scope Builder
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold uppercase">
                    Sample Data — Demo Leads
                  </span>
                </div>

                <div className="space-y-4">
                  {INCOMING_LEADS.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{lead.companyName}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                            Score: {lead.score}/100
                          </span>
                          {lead.ndaRequested && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                              NDA Requested
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 font-mono">Source: {lead.source}</span>
                      </div>

                      <p className="text-slate-300 leading-relaxed">{lead.projectOverview}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-[11px]">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Department:</span>
                          <span className="font-semibold text-white uppercase">
                            {lead.department.replace("_", " ")}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Budget Range:</span>
                          <span className="font-semibold text-emerald-400 font-mono">
                            {lead.budgetRange}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Timeline:</span>
                          <span className="font-semibold text-white">{lead.timeline}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Contact:</span>
                          <span className="font-semibold text-white">
                            {lead.contactName} ({lead.country})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <span className="text-slate-400">
                          Auto-assigned PM: {user?.fullName || "You"}
                        </span>
                        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md">
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
          {activeTab === "talent_matching" && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-base text-white">Talent Allocation Engine</h3>
                    <p className="text-xs text-slate-400">
                      Matches vetted talents based on skills, tier, delivery rating, and conflict
                      rules.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Filter by Skill Dept:</span>
                    <select
                      value={selectedTaskDept}
                      onChange={(e) =>
                        setSelectedTaskDept(
                          e.target.value as Parameters<typeof setSelectedTaskDept>[0],
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-medium focus:outline-none focus:border-blue-500"
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
                      className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{talent.pseudonym}</span>
                          <span className="text-slate-500 font-mono">
                            ({talent.fullName} - Confidential)
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-mono text-[10px] font-bold border border-blue-800/60">
                            {talent.tier} Tier
                          </span>
                          {talent.academyGraduate && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] flex items-center gap-1 border border-amber-500/20">
                              <Sparkles className="w-3 h-3" />
                              <span>NDH Academy Verified</span>
                            </span>
                          )}
                        </div>

                        <p className="text-slate-300">{talent.bio}</p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {talent.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-300 border border-slate-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right text-xs">
                          <div className="font-mono font-bold text-emerald-400">
                            {talent.qualityScore} / 5.0 Rating
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {talent.onTimeDeliveryRate}% On-Time SLA
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ${talent.hourlyRateInternalUSD}/hr internal
                          </div>
                        </div>

                        <button
                          onClick={() => setTalentInvited(talent.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                            talentInvited === talent.id
                              ? "bg-emerald-600 text-white cursor-default"
                              : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
                          }`}
                        >
                          {talentInvited === talent.id
                            ? "Invitation Dispatched ✓"
                            : "Dispatch Private Task Invite"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: QA Approval & Revision Gates */}
          {activeTab === "qa_gates" && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
                      QA Evaluation Gate
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      Milestone 2 Deliverables Submitted by Architect-Alpha
                    </h3>
                    <p className="text-xs text-slate-400">
                      Project: KoboPay Global Web App • Sprint Version: v2.0
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-semibold">
                      Pending PM Approval
                    </span>
                  </div>
                </div>

                {/* Deliverable Review Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white">
                    QA Inspection Checklist:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      "TypeScript strict type check: 0 errors",
                      "Biometric KYC integration latency < 300ms (P95: 275ms)",
                      "Zero direct client identity leaks in code comments",
                      "Automated integration test coverage > 85%",
                    ].map((check, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200">{check}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-800/40 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-white">Authorize QA Gate Pass</h5>
                    <p className="text-xs text-slate-400">
                      Approving this gate marks the deliverable as verified and presents it to
                      KoboPay in their Client Portal.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-medium hover:bg-slate-800">
                      Request Talent Revision
                    </button>
                    <button
                      onClick={async () => {
                        setQaError(null);
                        try {
                          const approval = await dbService.approveQaGate(
                            QA_PROJECT_ID,
                            QA_MILESTONE_INDEX,
                          );
                          setQaApproved(approval.qaApproved);
                        } catch (err) {
                          setQaError(err instanceof Error ? err.message : "Could not approve QA.");
                        }
                      }}
                      disabled={qaApproved}
                      className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg ${
                        qaApproved
                          ? "bg-emerald-600 text-white cursor-default"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {qaApproved
                          ? "QA Approved & Sent to Client Portal ✓"
                          : "Approve QA & Publish to Client"}
                      </span>
                    </button>
                  </div>
                  {qaError && <p className="text-xs text-red-400 w-full">{qaError}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dedicated Standalone PM Operations System Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#090D1A] px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-[11px]">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>NDH PM Operational Command Active</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-400">
              Active Sprints: <strong className="text-slate-200">12 Projects</strong> • Margin
              Health: <strong className="text-emerald-400">61.8% Avg</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Sovereign Bureau Isolation Protocol Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

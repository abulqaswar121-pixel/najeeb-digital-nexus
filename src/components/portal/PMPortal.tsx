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
import { SERVICE_DEPARTMENTS } from "../../data/mockData";
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
      label: "Projects",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "triage",
      label: "New requests",
      icon: <FileCheck className="w-4 h-4" />,
    },
    {
      id: "talent_matching",
      label: "Find talent",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "qa_gates",
      label: "Check work",
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: "1 Gate",
    },
  ];

  return (
    <div className="ndh-portal-light bg-eco-dark text-slate-100 min-h-screen font-sans flex flex-col">
      {/* Standalone PM Operations Top Bar */}
      <header className="sticky top-0 z-40 flex w-full max-w-full items-center justify-between gap-3 overflow-x-clip border-b border-white/10 bg-eco-navy/95 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* Open Gateway master mark + agency sector badge */}
            <AgencySectorMark size="sm" className="shrink-0" />
            <span className="truncate font-display text-sm font-semibold text-white sm:text-base">
              Project Manager
            </span>
            <span className="hidden shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-bold min-[420px]:inline-block bg-eco-glow/15 text-eco-glow border border-eco-glow/25">
              STAFF
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200 sm:flex">
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-eco-navy/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-eco-cyan/10 border border-eco-cyan/25 flex items-center justify-center text-eco-cyan font-bold text-xl">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Welcome, {user?.fullName || "PM"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded bg-eco-cyan/10 text-eco-cyan font-mono text-[10px] font-bold border border-eco-cyan/25">
                    Project Manager
                  </span>
                </div>
                <p className="text-xs text-[var(--eco-on-dark-muted)] mt-1">
                  {liveBriefs.length} project requests
                </p>
              </div>
            </div>
          </div>

          {/* Tab 1: Real projects from client requests */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "All requests", value: liveBriefs.length },
                  {
                    label: "Waiting for a PM",
                    value: liveBriefs.filter((b) => b.status === "submitted").length,
                  },
                  {
                    label: "In progress",
                    value: liveBriefs.filter(
                      (b) => b.status !== "submitted" && b.status !== "completed",
                    ).length,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-5 rounded-2xl bg-eco-navy/80 border border-white/10"
                  >
                    <span className="text-xs text-[var(--eco-on-dark-muted)]">{stat.label}</span>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-2xl bg-eco-navy/80 border border-white/10 space-y-3">
                <h3 className="font-bold text-sm text-white">Projects</h3>
                {liveBriefs.length === 0 ? (
                  <p className="text-xs text-[var(--eco-on-dark-muted)]">
                    No projects yet. New client requests will show here.
                  </p>
                ) : (
                  <ul className="divide-y divide-white/10">
                    {liveBriefs.map((brief) => (
                      <li
                        key={brief.id}
                        className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-white break-words">
                            {brief.projectName}
                          </p>
                          <p className="text-[var(--eco-on-dark-muted)] break-words">
                            {brief.organizationName} • {brief.timelineWeeks}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-white capitalize">
                          {brief.status.replace(/_/g, " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Brief Review & Scope Builder */}
          {activeTab === "triage" && (
            <div className="space-y-6">
              {/* Live submissions from the public "Start Your Project" wizard and
                  Contact page consultation form. These previously never appeared
                  anywhere in the PM/Admin tooling -- a real prospect's brief would
                  vanish silently. They now surface here in real time. */}
              <div className="p-6 rounded-2xl bg-eco-navy/80 border border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    Live Inbound Submissions
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      {liveBriefs.length + liveConsultRequests.length} TOTAL
                    </span>
                  </h3>
                  <span className="text-xs text-[var(--eco-on-dark-muted)] font-mono">
                    Real visitor activity, this browser
                  </span>
                </div>

                {liveBriefs.length === 0 && liveConsultRequests.length === 0 ? (
                  <p className="text-xs text-[var(--eco-on-dark-muted)] italic">
                    No live briefs or consultation requests yet. Submit the "Start Your Project"
                    wizard or the Contact page form from the public site to see it appear here
                    instantly.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {liveBriefs.map((brief) => (
                      <div
                        key={brief.id}
                        className="p-5 rounded-xl bg-white/[0.06] border border-emerald-800/50 space-y-3 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">
                              {brief.organizationName}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                              Live Brief
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/[0.08] text-slate-200 font-mono text-[10px] uppercase">
                              {brief.status.replace("_", " ")}
                            </span>
                          </div>
                          <span className="text-[var(--eco-on-dark-muted)] font-mono">
                            {new Date(brief.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-slate-200 leading-relaxed">{brief.briefDetails}</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-[11px]">
                          <div>
                            <span className="text-[var(--eco-on-dark-muted)] block text-[10px]">
                              Department:
                            </span>
                            <span className="font-semibold text-white uppercase">
                              {brief.department.replace("_", " ")}
                            </span>
                          </div>
                          <div>
                            <span className="text-[var(--eco-on-dark-muted)] block text-[10px]">
                              Scope Tier:
                            </span>
                            <span className="font-semibold text-emerald-400 font-mono capitalize">
                              {brief.scopeTier} — {brief.budgetAmount} {brief.currency}
                            </span>
                          </div>
                          <div>
                            <span className="text-[var(--eco-on-dark-muted)] block text-[10px]">
                              Timeline:
                            </span>
                            <span className="font-semibold text-white">{brief.timelineWeeks}</span>
                          </div>
                          <div>
                            <span className="text-[var(--eco-on-dark-muted)] block text-[10px]">
                              Contact:
                            </span>
                            <span className="font-semibold text-white">
                              {brief.clientEmail}
                              {brief.clientPhone ? ` (${brief.clientPhone})` : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <span className="text-[var(--eco-on-dark-muted)]">
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
                            className="px-4 py-2 rounded-xl bg-primary hover:bg-eco-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-1.5 shadow-md transition-colors"
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
                        className="p-5 rounded-xl bg-white/[0.06] border border-white/10 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{req.fullName}</span>
                            <span className="px-2 py-0.5 rounded bg-eco-cyan/10 text-eco-cyan font-mono text-[10px] font-bold uppercase">
                              Consultation Request
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/[0.08] text-slate-200 font-mono text-[10px] uppercase">
                              {req.status}
                            </span>
                          </div>
                          <span className="text-[var(--eco-on-dark-muted)] font-mono">
                            {new Date(req.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-200">
                          {req.email} • Preferred date {req.preferredDate} • Focus: {req.focusArea}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Intelligent Talent Matching Engine */}
          {activeTab === "talent_matching" && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-eco-navy/90 border border-white/10 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-bold text-base text-white">Talent Allocation Engine</h3>
                    <p className="text-xs text-[var(--eco-on-dark-muted)]">
                      Matches vetted talents based on skills, tier, delivery rating, and conflict
                      rules.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--eco-on-dark-muted)]">
                      Filter by Skill Dept:
                    </span>
                    <select
                      value={selectedTaskDept}
                      onChange={(e) =>
                        setSelectedTaskDept(
                          e.target.value as Parameters<typeof setSelectedTaskDept>[0],
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white font-medium focus:outline-none focus:border-eco-cyan/40"
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
                      className="p-5 rounded-xl bg-white/[0.06] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{talent.pseudonym}</span>
                          <span className="text-[var(--eco-on-dark-muted)] font-mono">
                            ({talent.fullName} - Confidential)
                          </span>
                          <span className="px-2 py-0.5 rounded bg-eco-dark text-eco-cyan font-mono text-[10px] font-bold border border-eco-cyan/20">
                            {talent.tier} Tier
                          </span>
                          {talent.academyGraduate && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] flex items-center gap-1 border border-amber-500/20">
                              <Sparkles className="w-3 h-3" />
                              <span>NDH Academy Verified</span>
                            </span>
                          )}
                        </div>

                        <p className="text-slate-200">{talent.bio}</p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {talent.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-eco-dark text-[10px] font-mono text-slate-200 border border-white/10"
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
                          <div className="text-[10px] text-[var(--eco-on-dark-muted)]">
                            {talent.onTimeDeliveryRate}% On-Time SLA
                          </div>
                          <div className="text-[10px] text-[var(--eco-on-dark-muted)] font-mono">
                            ${talent.hourlyRateInternalUSD}/hr internal
                          </div>
                        </div>

                        <button
                          onClick={() => setTalentInvited(talent.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                            talentInvited === talent.id
                              ? "bg-emerald-600 text-white cursor-default"
                              : "bg-primary hover:bg-eco-cyan/20 text-white shadow-md shadow-cyan-500/30"
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
              <div className="p-6 sm:p-8 rounded-3xl bg-eco-navy/90 border border-white/10 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-eco-cyan">
                      QA Evaluation Gate
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      Milestone 2 Deliverables Submitted by Architect-Alpha
                    </h3>
                    <p className="text-xs text-[var(--eco-on-dark-muted)]">
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
                        className="p-3.5 rounded-xl bg-white/[0.06] border border-white/10 flex items-center gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200">{check}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 rounded-2xl bg-eco-dark/30 border border-eco-cyan/20 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-white">Authorize QA Gate Pass</h5>
                    <p className="text-xs text-[var(--eco-on-dark-muted)]">
                      Approving this gate marks the deliverable as verified and presents it to
                      KoboPay in their Client Portal.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 rounded-xl border border-white/12 bg-white/[0.06] text-slate-200 text-xs font-medium hover:bg-white/[0.08]">
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
      <footer className="mt-auto border-t border-white/10 bg-eco-dark px-4 sm:px-6 lg:px-8 py-4 text-xs text-[var(--eco-on-dark-muted)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>NDH Agency · Project manager workspace</span>
          <span>Need help? hello@ndh.com.ng</span>
        </div>
      </footer>
    </div>
  );
};

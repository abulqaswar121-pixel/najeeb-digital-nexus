import React, { useState } from "react";
import { useAuth } from "../../lib/authStore";
import { AgencySectorMark } from "../brand/AgencySectorMark";
import { useMyTalentProfile } from "../../lib/databaseStore";
import { TALENT_RANK_CONFIGS, calculateRevenueSplit } from "../../data/mockData";
import { TalentRank } from "../../types/ndh";
import {
  Terminal,
  CheckCircle2,
  Upload,
  DollarSign,
  Award,
  Lock,
  FileCode,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  Clock,
  Building,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { PortalNavDropdown } from "./PortalNavDropdown";

interface TalentPortalProps {
  onSwitchToPM?: () => void;
}

export const TalentPortal: React.FC<TalentPortalProps> = ({ onSwitchToPM }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "tasks" | "ranks" | "deliverables" | "earnings" | "hybrid_pm" | "academy"
  >("tasks");
  const [deliverableUploaded, setDeliverableUploaded] = useState<boolean>(false);
  const [talentMessageInput, setTalentMessageInput] = useState<string>("");
  const [calcBudget, setCalcBudget] = useState<number>(1000000); // ₦1,000,000 example

  // Fetches the profile linked to the logged-in talent account from the
  // server (server/routes/talents.ts `GET /api/talents/me`) instead of
  // always hardcoding the first entry of a client-bundled array regardless
  // of who actually logged in.
  const talent = useMyTalentProfile();
  const currentRankConfig = TALENT_RANK_CONFIGS[talent?.rank || "Diamond Principal"];

  const [pmChat, setPmChat] = useState<
    { sender: string; time: string; text: string; isTalent: boolean }[]
  >([
    {
      sender: "Your Assigned PM",
      time: "09:30 AM",
      text: "Hello Architect-Alpha! Please ensure the Milestone 2 edge bundle is deployed to staging with the updated biometric KYC latency optimizations.",
      isTalent: false,
    },
    {
      sender: `${user?.fullName || "Architect-Alpha"} (You)`,
      time: "10:05 AM",
      text: "On it Tariq. P95 latency is down to 275ms on Cloudflare Workers edge nodes. Submitting v2.0 deliverable bundle for QA now.",
      isTalent: true,
    },
  ]);

  const handleSendMessage = () => {
    if (!talentMessageInput.trim()) return;
    setPmChat([
      ...pmChat,
      {
        sender: `${user?.fullName || "Architect-Alpha"} (You)`,
        time: "Just now",
        text: talentMessageInput,
        isTalent: true,
      },
    ]);
    setTalentMessageInput("");
  };

  if (!talent) {
    return (
      <div className="bg-[#070A14] text-[#F1F5F9] min-h-screen font-sans flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-sm text-slate-400">Loading your talent profile…</p>
        <p className="text-xs text-slate-500 max-w-md">
          If this doesn't load, this account may not have a linked talent profile on the server yet
          (only the demo "Architect-Alpha" account is currently linked).
        </p>
      </div>
    );
  }

  const splitPreview = calculateRevenueSplit(
    calcBudget,
    Math.round(calcBudget / 1500),
    talent.isDualRolePM,
  );

  const talentNavTabs = [
    {
      id: "tasks",
      label: "My Sprint Tasks",
      icon: <FileCode className="w-4 h-4" />,
      badge: "2 Active",
    },
    {
      id: "ranks",
      label: "Talent Ranks & Bonus Ladder",
      icon: <Award className="w-4 h-4" />,
      badge: "Diamond (1.15x)",
    },
    {
      id: "deliverables",
      label: "Submit Deliverables & Code",
      icon: <Upload className="w-4 h-4" />,
    },
    {
      id: "earnings",
      label: "Payout Ledger & Split Model",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: "hybrid_pm",
      label: "Dual-Role (PM + Talent)",
      icon: <Zap className="w-4 h-4" />,
      badge: "Active",
    },
    {
      id: "academy",
      label: "NDH Academy Bridge",
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-[#070A14] text-[#F1F5F9] min-h-screen font-sans flex flex-col">
      {/* Standalone Talent Workspace Top Bar */}
      <header className="sticky top-0 z-40 flex w-full max-w-full items-center justify-between gap-3 overflow-x-clip border-b border-white/10 bg-eco-navy/95 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* Open Gateway master mark + agency sector badge */}
            <AgencySectorMark size="sm" className="shrink-0" />
            <span className="truncate font-display text-sm font-semibold text-white sm:text-base">
              Talent Private Workspace
            </span>
            <span className="hidden shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-bold min-[420px]:inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CONFIDENTIAL BENCH
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {talent.isDualRolePM && onSwitchToPM && (
            <button
              onClick={onSwitchToPM}
              className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600/20 px-3 py-1.5 text-xs font-bold text-indigo-300 transition-all hover:bg-indigo-600 hover:text-white md:flex"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Switch to PM Lead View</span>
            </button>
          )}
          <div className="hidden min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 sm:flex">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="max-w-[16ch] truncate">ID: {talent.pseudonym}</span>
          </div>

          <PortalNavDropdown
            tabs={talentNavTabs}
            activeTab={activeTab}
            onSelect={(id) => setActiveTab(id as typeof activeTab)}
          />
        </div>
      </header>

      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Talent Header Profile & Current Rank Badge */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative">
                <img
                  src={talent.avatarUrl}
                  alt={talent.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-cyan-500 rounded-full text-black">
                  <Star className="w-3.5 h-3.5 fill-black" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {talent.fullName} ({talent.pseudonym})
                  </h1>
                  {/* Talent Rank Badge */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border bg-gradient-to-r flex items-center gap-1.5 ${currentRankConfig.badgeColor}`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>
                      Level {currentRankConfig.level}: {talent.rank}
                    </span>
                    <span className="bg-black/40 px-1.5 py-0.2 rounded text-[10px] font-mono">
                      +{currentRankConfig.bonusRatePercentage}% Task Bonus
                    </span>
                  </div>

                  {talent.isDualRolePM && (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-indigo-400" />
                      Appointed PM-Lead (Dual-Role)
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1.5 flex flex-wrap items-center gap-2">
                  <span>
                    Department:{" "}
                    <strong className="text-slate-200">
                      {talent.department.replace("_", " ").toUpperCase()}
                    </strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>
                    Assigned PM: <strong className="text-blue-400">Your PM</strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>
                    QA Delivery Rate:{" "}
                    <strong className="text-emerald-400">{talent.onTimeDeliveryRate}%</strong>
                  </span>
                </p>
              </div>
            </div>

            {/* Performance Stats Cards */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  {talent.qaPercentageScore}%
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                    QA Quality Score
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {talent.qualityScore} / 5.0 Rating
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                  {talent.completedProjects}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                    Tasks Delivered
                  </span>
                  <span className="font-mono font-bold text-white">Diamond Tier</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                    Total Earned
                  </span>
                  <span className="font-mono font-bold text-white">
                    ${talent.totalEarnedUSD.toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice Banner */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>NDH Managed Privacy Buffer:</strong> You execute pure technical tickets and
                coordinate strictly with your Project Manager. Client contact details and agency
                commercial margins are kept fully isolated.
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-slate-900 font-mono text-[10px] text-slate-300 border border-slate-800 shrink-0">
              Anonymized Isolation: 100% Active
            </span>
          </div>

          {/* TAB 1: SPRINT TASKS */}
          {activeTab === "tasks" && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-blue-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      Active Milestone Task Allocations
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tasks assigned by your PM with funded escrow guarantee
                    </p>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Escrow Locked • Risk Free
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Task 1 */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs hover:border-slate-700 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-blue-400 font-bold">
                            TASK-NDH-89-02
                          </span>
                          <span className="font-bold text-sm text-white">
                            React 19 Frontend & Edge Biometric KYC Settlement
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                            Milestone 2
                          </span>
                        </div>
                        <p className="text-slate-400 mt-1">
                          Scope: Sub-300ms verification state machine, Cloudflare Workers routing,
                          100% strict TypeScript.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-mono font-bold text-emerald-400">
                          ₦3,300,000 NGN ($2,200 USD)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Includes +15% Diamond Rank Bonus
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Status:{" "}
                          <strong>
                            Artifacts submitted — PM QA review in progress (Score: 99.4%)
                          </strong>
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab("deliverables")}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-bold transition-all"
                      >
                        Upload Code Patch →
                      </button>
                    </div>
                  </div>

                  {/* Task 2 */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs hover:border-slate-700 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-blue-400 font-bold">
                            TASK-NDH-91-01
                          </span>
                          <span className="font-bold text-sm text-white">
                            PostgreSQL Read-Replica Cluster & Idempotency Queues
                          </span>
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px]">
                            Milestone 1
                          </span>
                        </div>
                        <p className="text-slate-400 mt-1">
                          Scope: Redis distributed locking, SHA-256 idempotency cache, connection
                          pool tuning.
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-mono font-bold text-emerald-400">
                          ₦1,950,000 NGN ($1,300 USD)
                        </div>
                        <div className="text-[10px] text-slate-400">Due: Oct 08, 2026</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Status: In Active Sprint Execution</span>
                      </div>
                      <button
                        onClick={() => setActiveTab("deliverables")}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all"
                      >
                        Submit Staging Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PM Internal Chat */}
              <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-blue-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="font-bold text-sm text-white">
                      Direct Channel: Your Assigned PM
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">End-to-End Encrypted</span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 text-xs">
                  {pmChat.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl max-w-xl ${
                        msg.isTalent
                          ? "ml-auto bg-blue-600 text-white shadow-md"
                          : "bg-slate-900 border border-slate-800 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 mb-1">
                        <span className="font-bold">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={talentMessageInput}
                    onChange={(e) => setTalentMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Message your Project Manager (Tariq)..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TALENT RANKS & BONUS LADDER */}
          {activeTab === "ranks" && (
            <div className="space-y-8">
              {/* Rank Overview Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-cyan-500/30 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                      Current Performance Standing
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                      <span>{talent.rank} (Level 4)</span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                        Top 2% Talent Network
                      </span>
                    </h2>
                    <p className="text-sm text-slate-300 mt-2 max-w-2xl">
                      Ranked based on <strong>34 completed projects</strong>, a{" "}
                      <strong>99.6% QA score</strong>, and a{" "}
                      <strong>99.4% on-time delivery rate</strong>. You receive an automatic{" "}
                      <strong>+15% bonus multiplier</strong> on all assigned task payouts.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/40 border border-cyan-500/30 text-center shrink-0">
                    <div className="text-3xl font-mono font-extrabold text-cyan-400">1.15x</div>
                    <div className="text-xs font-bold text-slate-300 mt-1">Payout Multiplier</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      +15% Added to Every Task
                    </div>
                  </div>
                </div>

                {/* Progress to Next Milestone */}
                <div className="space-y-2 pt-4 border-t border-slate-700/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">
                      Tier Mastery: Sovereign Principal Rank
                    </span>
                    <span className="text-cyan-400 font-mono font-bold">
                      Max Rank Achieved (100%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full w-full" />
                  </div>
                </div>
              </div>

              {/* 4 Talent Ranks Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white">
                    The 4 NDH Talent Performance Tiers
                  </h3>
                  <span className="text-xs text-slate-400">
                    Objective criteria automatically verified via PM QA gates
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(Object.keys(TALENT_RANK_CONFIGS) as TalentRank[]).map((r) => {
                    const cfg = TALENT_RANK_CONFIGS[r];
                    const isCurrent = talent.rank === r;

                    return (
                      <div
                        key={r}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isCurrent
                            ? "bg-[#0F172A] border-cyan-400/80 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50"
                            : "bg-slate-900/80 border-slate-800"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-slate-400">
                              LEVEL {cfg.level}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                                Current Rank ✓
                              </span>
                            )}
                          </div>

                          <div className="font-bold text-white text-base">{cfg.rank}</div>

                          <div className="space-y-1.5 text-xs text-slate-300 font-mono border-t border-b border-slate-800 py-3">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Min Projects:</span>
                              <strong className="text-white">{cfg.minProjects}+ Tasks</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Min QA Score:</span>
                              <strong className="text-emerald-400">{cfg.minQAScore}%</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Task Bonus:</span>
                              <strong className="text-cyan-400">
                                +{cfg.bonusRatePercentage}% (1.
                                {cfg.bonusRatePercentage < 10
                                  ? `0${cfg.bonusRatePercentage}`
                                  : cfg.bonusRatePercentage}
                                x)
                              </strong>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Rank Perks:
                            </span>
                            {cfg.perks.map((p: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-start gap-1.5 text-xs text-slate-300"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                <span className="leading-tight text-[11px]">{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMIT DELIVERABLES */}
          {activeTab === "deliverables" && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
                <div>
                  <h3 className="font-bold text-lg text-white">
                    Deliverable Vault & PM QA Submission
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Uploaded artifacts undergo automated linting and PM QA scoring before milestone
                    escrow disbursement.
                  </p>
                </div>

                <div className="p-8 rounded-2xl bg-slate-900/80 border-2 border-dashed border-blue-600/40 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-sm text-white font-bold">
                      Upload Production Code Bundles, Git Release Tags, or Figma Design Links
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Supported: .zip archives, Git patch commits, Loom walkthrough URLs, Figma
                      tokens (Max 5GB)
                    </div>
                  </div>

                  <button
                    onClick={() => setDeliverableUploaded(true)}
                    className={`px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${
                      deliverableUploaded
                        ? "bg-emerald-600 text-white cursor-default shadow-emerald-600/30"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                    }`}
                  >
                    {deliverableUploaded
                      ? "v2.0 Deliverable Bundle Submitted to PM QA ✓"
                      : "Submit v2.0 Production Release for PM QA"}
                  </button>
                </div>

                {/* Submission Log */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Recent Milestone Submissions:
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-mono font-bold text-white">
                          v2.0-rc3 Release Candidate
                        </span>
                        <span className="text-slate-400 block sm:inline sm:ml-2">
                          — Biometric KYC edge latency &lt;275ms, 100% test coverage
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      PM QA Score: 99.4% Approved
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EARNINGS, PROFIT-SPLIT & 14-DAY PAYROLL */}
          {activeTab === "earnings" && (
            <div className="space-y-8">
              {/* Top Earnings Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold">
                    Total Lifetime Earnings
                  </span>
                  <div className="text-2xl font-bold font-mono text-white">
                    ${talent.totalEarnedUSD.toLocaleString()} USD
                  </div>
                  <div className="text-xs text-emerald-400 font-mono">
                    ₦{talent.totalEarnedNGN.toLocaleString()} NGN settled
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold">
                    Next Bi-Weekly Payout (Oct 15, 2026)
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    ₦5,250,000 NGN
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    $3,500 USD (Includes 1.15x Diamond Bonus)
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold">
                    Direct Deposit Bank Account
                  </span>
                  <div className="font-bold text-white text-sm">
                    {talent.bankDetails?.bankName || "Access Bank PLC"}
                  </div>
                  <div className="text-xs text-blue-400 font-mono">
                    Acct: {talent.bankDetails?.accountNumber || "0129849201"} (NIBSS Verified)
                  </div>
                </div>
              </div>

              {/* Task-Based Profit Share Explanation & Interactive Simulator */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white">
                      How Task-Based Milestone Payout Protects Everyone
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Zero salary overhead risk: Every payout is backed 100% by client escrow
                      deposits before work begins.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-300 font-mono text-xs font-bold border border-blue-500/30 shrink-0">
                    Escrow Model: 45% Admin / 15% PM / 40% Talent
                  </span>
                </div>

                {/* Breakdown Explanation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Building className="w-4 h-4" />
                      <span>1. Admin / Owner (45%)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      Covers client acquisition, legal escrow liability, server infrastructure,
                      platform R&D, and agency treasury net profits.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold">
                      <Briefcase className="w-4 h-4" />
                      <span>2. Project Manager (15%)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      Compensates the PM for client communication, brief triage, milestone
                      structuring, QA inspection, and dispute-free delivery.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Terminal className="w-4 h-4" />
                      <span>3. Talent Execution Pool (40%)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      Directly distributed to the vetted engineers/designers who build the sprint
                      deliverables, enhanced by rank bonus multipliers.
                    </p>
                  </div>
                </div>

                {/* Interactive Revenue Split Calculator */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="text-xs font-bold text-white">
                      Simulate Client Milestone Deposit:
                    </label>
                    <div className="flex items-center gap-2">
                      {[500000, 1000000, 2500000, 5000000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setCalcBudget(amt)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                            calcBudget === amt
                              ? "bg-blue-600 text-white"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          ₦{(amt / 1000).toLocaleString()}k
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-center">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <span className="text-[10px] text-amber-300 uppercase block font-bold">
                        Admin Profit (45%)
                      </span>
                      <strong className="text-amber-400 text-sm">
                        ₦{splitPreview.adminMarginNGN.toLocaleString()}
                      </strong>
                      <div className="text-[10px] text-slate-400">
                        (${splitPreview.adminMarginUSD.toLocaleString()} USD)
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <span className="text-[10px] text-indigo-300 uppercase block font-bold">
                        PM Management (15%)
                      </span>
                      <strong className="text-indigo-400 text-sm">
                        ₦{splitPreview.pmFeeNGN.toLocaleString()}
                      </strong>
                      <div className="text-[10px] text-slate-400">
                        (${splitPreview.pmFeeUSD.toLocaleString()} USD)
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] text-emerald-300 uppercase block font-bold">
                        Talent Pool (40%)
                      </span>
                      <strong className="text-emerald-400 text-sm">
                        ₦{splitPreview.talentPoolNGN.toLocaleString()}
                      </strong>
                      <div className="text-[10px] text-slate-400">
                        (${splitPreview.talentPoolUSD.toLocaleString()} USD)
                      </div>
                    </div>
                  </div>

                  {talent.isDualRolePM && (
                    <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs flex items-center justify-between text-indigo-200">
                      <span>
                        ⚡ <strong>Dual PM-Talent Bonus:</strong> On projects you both manage and
                        code, you receive PM (15%) + Talent (40%) ={" "}
                        <strong>55% total payout</strong> (₦
                        {(splitPreview.pmFeeNGN + splitPreview.talentPoolNGN).toLocaleString()})!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DUAL-ROLE (HYBRID PM + TALENT) */}
          {activeTab === "hybrid_pm" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Hybrid PM-Lead Dual Capability Active
                    </h3>
                    <p className="text-xs text-slate-400">
                      Appointed by Admin to oversee technical sprints while contributing elite
                      codebase architecture.
                    </p>
                  </div>
                </div>

                {onSwitchToPM && (
                  <button
                    onClick={onSwitchToPM}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Launch PM Command Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    <span>When Acting Strictly as PM Lead:</span>
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    You coordinate other squad members, score deliverables against QA rubrics, and
                    unlock milestone completions. You earn the{" "}
                    <strong>15% PM Management Fee</strong> on the total client budget.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>When Managing & Personally Coding:</span>
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    On high-speed solo projects or specialized micro-sprints, you receive both the{" "}
                    <strong>15% PM fee + 40% Talent pool = 55% combined payout</strong>, while the
                    Admin/NDH treasury retains the 45% platform margin.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: NDH ACADEMY BRIDGE */}
          {activeTab === "academy" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      NDH Academy Verified Talent Bridge
                    </h3>
                    <p className="text-xs text-slate-400">
                      Certified Full-Stack Master • Verified Alumni Badge Active
                    </p>
                  </div>
                </div>

                <span
                  className="px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-default"
                  title="NDH Academy is still in development"
                >
                  <span>Advanced Academy Modules — Launching Soon</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-semibold text-white">Decoupled Architecture:</div>
                  <p className="text-slate-400 leading-relaxed">
                    NDH Academy and NDH Agency operate as separate codebases and databases. Your
                    verified credential is cryptographic proof of capability without leaking student
                    LMS records into agency client projects.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-semibold text-white">Elite Tier Progression:</div>
                  <p className="text-slate-400 leading-relaxed">
                    Graduating advanced system design modules qualifies talents for higher internal
                    hourly rates ($75+/hr) and priority sprint allocation for sovereign enterprise
                    projects.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Standalone Talent Workspace System Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#090D1A] px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Talent Privacy Shield Active</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-400">
              Assigned PM: <strong className="text-slate-200">Your PM</strong> • Next Payout:{" "}
              <strong className="text-emerald-400">Oct 15, 2026</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Automated NIBSS / Wise Direct Deposit</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

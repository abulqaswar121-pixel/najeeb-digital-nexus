import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Terminal,
  Sparkles,
  ArrowRight,
  Send,
  Building,
} from "lucide-react";
import { MainNavView } from "../layout/AppNavbar";

interface TalentNetworkViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const TalentNetworkView: React.FC<TalentNetworkViewProps> = ({
  onSelectView,
  onOpenBriefWizard,
}) => {
  const [applicantRole, setApplicantRole] = useState("Full-Stack Engineer");
  const [submitted, setSubmitted] = useState(false);

  const tiers = [
    {
      tier: "Tier 1: NDH Academy Resident",
      desc: "Top 5% graduates of NDH Academy intensive programs. Mentored under senior architects on internal sandbox sprints.",
      badge: "Academy Certified",
    },
    {
      tier: "Tier 2: Senior Specialist",
      desc: "3–6 years proven commercial experience. Specialists in React, Flutter, Go, Kubernetes, and enterprise UI systems.",
      badge: "Production Verified",
    },
    {
      tier: "Tier 3: Lead Systems Architect",
      desc: "7+ years leading mission-critical fintech cores, distributed microservices, and multi-cloud infrastructure.",
      badge: "Staff Architect",
    },
    {
      tier: "Tier 4: Principal Technical Fellow",
      desc: "Industry veterans who have scaled platforms to 5M+ daily active users across Africa, Europe, and the US.",
      badge: "Principal Fellow",
    },
    {
      tier: "Tier 5: Advisory Partner",
      desc: "Executive domain consultants specializing in Central Bank regulatory frameworks, NDPR/GDPR, and venture strategy.",
      badge: "Strategic Advisory",
    },
  ];

  return (
    <div className="bg-[#090D1A] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>The NDH Sovereign Talent Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Top 3% of African Digital Talent. Zero Marketplace Chaos.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Our curated talent bench is rigorously tested, certified by NDH Academy standards, and
            deployed through dedicated PM orchestrators. We protect our talent with prompt NIBSS
            payouts and protect clients with guaranteed SLAs.
          </p>
        </div>

        {/* 5-Tier Talent Hierarchy */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Talent Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              The 5-Tier Capability Matrix
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl hover:border-blue-500/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {t.badge}
                  </span>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-bold text-base text-white">{t.tier}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NDH Academy Upskilling Bridge */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Decoupled Talent Pipeline</span>
            </div>
            <h3 className="text-2xl font-bold text-white">NDH Academy Certification Bridge</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              While NDH Agency operates exclusively as a managed enterprise bureau, our talent
              pipeline will be continuously enriched by high-caliber alumni from NDH Academy — a
              sister training platform that is currently in development and not yet live.
            </p>
          </div>

          <span className="px-6 py-3.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs flex items-center gap-2 shrink-0">
            <span>NDH Academy — Launching Soon</span>
          </span>
        </div>

        {/* Apply to Join the Talent Network */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Join the Bench
            </span>
            <h3 className="text-2xl font-bold text-white">Apply to Join the Vetted Network</h3>
            <p className="text-xs text-slate-300">
              Pass our coding benchmark, technical interview, and background verification.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-white">Application Received</h4>
              <p className="text-xs text-slate-300">
                Our Talent Operations Team will review your portfolio and send you the technical
                benchmark test.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Babatunde Okafor"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. babatunde@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">
                  Primary Specialization
                </label>
                <select
                  value={applicantRole}
                  onChange={(e) => setApplicantRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option>Full-Stack Engineer (React / Node / Go)</option>
                  <option>Mobile Engineer (Flutter / Swift / Kotlin)</option>
                  <option>UI/UX & Product Design Systems</option>
                  <option>DevOps & Cloud Site Reliability Engineer</option>
                  <option>AI Engineer & Python Pipeline Specialist</option>
                  <option>Cybersecurity & NDPR Compliance Auditor</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">
                  GitHub / Portfolio / LinkedIn URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/your-username"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Submit Application to Talent Board</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

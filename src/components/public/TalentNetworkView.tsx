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
import { MainNavView } from "../layout/navViews";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";

interface TalentNetworkViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const TalentNetworkView: React.FC<TalentNetworkViewProps> = ({
  onSelectView,
  onOpenBriefWizard,
}) => {
  const { t } = useCurrencyLanguage();
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
    <div className="min-h-screen font-sans">
      {/* Page hero — deep navy band */}
      <section className="gw-page-hero relative overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" aria-hidden="true" />
        <div
          className="gw-glow-cyan top-0 left-1/3 h-[280px] w-[560px] -translate-x-1/2"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
          <span className="gw-eyebrow">
            <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
            {t("talent_badge")}
          </span>

          <h1 className="font-display max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            {t("talent_title")}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed">{t("talent_desc")}</p>
        </div>
      </section>

      {/* Porcelain body — elevated white cards */}
      <div className="gw-page-body">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
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
          <div className="gw-card flex flex-col items-center justify-between gap-8 p-8 sm:p-10 md:flex-row">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Decoupled Talent Pipeline</span>
              </div>
              <h3 className="text-2xl font-bold text-white">NDH Academy Certification Bridge</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                While NDH Agency operates exclusively as a managed enterprise bureau, our talent
                pipeline is continuously enriched by high-caliber alumni from NDH Academy — a sister
                training platform at{" "}
                <span className="text-emerald-400 font-semibold">academy.ndh.com.ng</span>.
              </p>
            </div>

            <a
              href="https://academy.ndh.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-slate-800 text-emerald-300 border border-emerald-700/50 font-bold text-xs flex items-center gap-2 shrink-0 hover:bg-slate-700 transition-colors"
            >
              <span>Visit academy.ndh.com.ng</span>
            </a>
          </div>

          {/* Apply to Join the Talent Network */}
          <div className="gw-card mx-auto max-w-3xl space-y-6 p-8 sm:p-10">
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
    </div>
  );
};

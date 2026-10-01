import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { MainNavView } from "../layout/AppNavbar";
import { dbService } from "../../lib/databaseStore";

interface ContactViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  const [consultSubmitted, setConsultSubmitted] = useState<boolean>(false);
  const [consultName, setConsultName] = useState("");
  const [consultEmail, setConsultEmail] = useState("");
  const [consultDate, setConsultDate] = useState("2026-10-02");
  const [consultTopic, setConsultTopic] = useState("Full-Stack Web/App Re-Architecture");

  const [consultError, setConsultError] = useState<string | null>(null);
  const [isSubmittingConsult, setIsSubmittingConsult] = useState(false);

  const handleBookConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultError(null);
    setIsSubmittingConsult(true);
    try {
      await dbService.createConsultationRequest({
        fullName: consultName,
        email: consultEmail,
        preferredDate: consultDate,
        focusArea: consultTopic,
      });
      setConsultSubmitted(true);
    } catch {
      setConsultError("Could not submit your request right now. Please try again shortly.");
    } finally {
      setIsSubmittingConsult(false);
    }
  };

  return (
    <div className="bg-[#090D1A] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Engage NDH Agency Operations</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Initiate a Project or Schedule an Executive Consultation.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Connect directly with our Principal Project Managers and Department Leads in Lagos,
            Abuja, or London.
          </p>
        </div>

        {/* 2-Column Grid: Consultation Form / Hubs & Contact Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Consultation Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                Direct Discovery
              </span>
              <h3 className="text-2xl font-bold text-white">
                Book an Executive Discovery Consultation
              </h3>
              <p className="text-xs text-slate-300">
                A 30-minute technical discovery session with a dedicated Project Manager and Lead
                Architect.
              </p>
            </div>

            {consultSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 space-y-2 text-xs">
                <h4 className="font-bold text-sm text-white">
                  Request Received — Logged with Operations
                </h4>
                <p className="text-slate-200">
                  Your discovery session request has been logged for{" "}
                  <strong className="text-white">{consultEmail}</strong> on your preferred date of{" "}
                  <strong className="text-white">{consultDate}</strong>. A Principal PM will review
                  it and follow up by email with a confirmed time and calendar invite within 1
                  business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookConsult} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold text-[11px] uppercase">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Dr. Folake Adeleke"
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-bold text-[11px] uppercase">
                      Work Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="folake@company.com"
                      value={consultEmail}
                      onChange={(e) => setConsultEmail(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold text-[11px] uppercase">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={consultDate}
                      onChange={(e) => setConsultDate(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-bold text-[11px] uppercase">
                      Primary Focus Area
                    </label>
                    <select
                      value={consultTopic}
                      onChange={(e) => setConsultTopic(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option>Full-Stack Web / Cloud Architecture</option>
                      <option>Cross-Platform Mobile App (Flutter/iOS)</option>
                      <option>Enterprise Brand Identity & Design System</option>
                      <option>Pan-African FinTech / Compliance Audit</option>
                      <option>AI Automation & Data Intelligence</option>
                    </select>
                  </div>
                </div>

                {consultError && <p className="text-xs text-red-400">{consultError}</p>}
                <button
                  type="submit"
                  disabled={isSubmittingConsult}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>
                    {isSubmittingConsult ? "Submitting..." : "Confirm Executive Consultation"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Mutual Non-Disclosure Protected</span>
              </span>
              <button
                onClick={onOpenBriefWizard}
                className="text-blue-400 hover:text-blue-300 font-bold underline"
              >
                Or Build Custom Proposal Scope →
              </button>
            </div>
          </div>

          {/* Hubs & Office Telemetry */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white">Direct Operational Hubs</h3>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>Lagos Operational Bureau (HQ)</span>
                  </div>
                  <p className="text-slate-300">
                    NDH Tower, 14B Karimu Kotun St, Victoria Island, Lagos, Nigeria
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1 font-mono">
                    Tel: +234 1 800 634 634 • lagos@agency.ndh.com.ng
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>Abuja Public Sector Division</span>
                  </div>
                  <p className="text-slate-300">
                    Nexus Suite 402, Transcorp Hilton Boulevard, Maitama, Abuja
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1 font-mono">
                    abuja@agency.ndh.com.ng
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>London Global Partnerships</span>
                  </div>
                  <p className="text-slate-300">
                    Level 18, 40 Bank Street, Canary Wharf, London E14 5NR
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1 font-mono">
                    london@agency.ndh.com.ng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

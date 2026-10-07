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
import { MainNavView } from "../layout/navViews";
import { dbService } from "../../lib/databaseStore";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";

interface ContactViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  const { t } = useCurrencyLanguage();
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
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {t("contact_badge")}
          </span>

          <h1 className="font-display max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            {t("contact_title")}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed">{t("contact_desc")}</p>
        </div>
      </section>

      {/* Porcelain body — elevated white cards */}
      <div className="gw-page-body">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          {/* 2-Column Grid: Consultation Form / Hubs & Contact Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Consultation Form */}
            <div className="gw-card lg:col-span-7 space-y-6 p-8">
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
                    <strong className="text-white">{consultDate}</strong>. A Principal PM will
                    review it and follow up by email with a confirmed time and calendar invite
                    within 1 business day.
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

            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="gw-card space-y-6 p-8">
                <h3 className="text-lg font-bold text-white">Get in Touch</h3>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span>Nigeria · Worldwide</span>
                    </div>
                    <p className="text-slate-300">
                      Marmaron Nufawa, Western Bye Pass, Sokoto, Nigeria
                    </p>
                    <p className="text-slate-400 text-[11px] pt-1">
                      Based in Nigeria, working with clients worldwide — remote-first, no branch
                      offices.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>WhatsApp / Phone</span>
                    </div>
                    <a
                      href="https://wa.me/2349029932794"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 font-mono hover:text-emerald-300"
                    >
                      +234 902 993 2794
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>Email</span>
                    </div>
                    <a
                      href="mailto:hello@ndh.com.ng"
                      className="text-blue-300 font-mono block hover:text-blue-200"
                    >
                      hello@ndh.com.ng
                    </a>
                    <a
                      href="mailto:abunnajeeh7@gmail.com"
                      className="text-blue-300 font-mono block hover:text-blue-200"
                    >
                      abunnajeeh7@gmail.com
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Building className="w-4 h-4 text-indigo-400" />
                      <span>Social</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <a
                        href="https://www.facebook.com/share/1Be6HN8zjS/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-300 hover:text-indigo-200"
                      >
                        Facebook
                      </a>
                      <a
                        href="https://www.instagram.com/njb_digital_hub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-300 hover:text-indigo-200"
                      >
                        Instagram
                      </a>
                    </div>
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

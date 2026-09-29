import React, { useState } from 'react';
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
} from 'lucide-react';
import { MainNavView } from '../layout/AppNavbar';

interface ContactViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  const [consultSubmitted, setConsultSubmitted] = useState<boolean>(false);
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultDate, setConsultDate] = useState('2026-10-02');
  const [consultTopic, setConsultTopic] = useState('Full-Stack Web/App Re-Architecture');

  const handleBookConsult = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultSubmitted(true);
  };

  return (
    <div className="bg-[#080C14] text-[#F1F5F9] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
            <Mail className="w-3.5 h-3.5" />
            <span>Engage NDH Agency Operations</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Initiate a Project or Schedule an Executive Consultation.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Connect directly with our Principal Project Managers and Department Leads in Lagos, Abuja, or London.
          </p>
        </div>

        {/* 2-Column Grid: Consultation Form / Hubs & Contact Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Consultation Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400">Direct Discovery</span>
              <h3 className="text-2xl font-bold text-white">Book an Executive Discovery Consultation</h3>
              <p className="text-xs text-slate-400">
                A 30-minute technical discovery session with a dedicated Project Manager and Lead Architect.
              </p>
            </div>

            {consultSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 space-y-2 text-xs">
                <h4 className="font-bold text-sm">Consultation Scheduled Successfully!</h4>
                <p>
                  Calendar invite and Google Meet link dispatched to <strong>{consultEmail}</strong>. Principal PM Tariq Al-Najeeb is assigned to your session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookConsult} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Dr. Folake Adeleke"
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Work Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="folake@company.com"
                      value={consultEmail}
                      onChange={(e) => setConsultEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Preferred Date</label>
                    <input
                      type="date"
                      value={consultDate}
                      onChange={(e) => setConsultDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Core Focus Area</label>
                    <select
                      value={consultTopic}
                      onChange={(e) => setConsultTopic(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option>Full-Stack Web/App Re-Architecture</option>
                      <option>Product & UI/UX Design System</option>
                      <option>AI Solutions & Agentic Automation</option>
                      <option>Brand Identity & Global Positioning</option>
                      <option>Headless E-commerce & Multi-Currency</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Consultation Booking</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenBriefWizard}
                    className="text-blue-400 hover:underline text-xs flex items-center gap-1"
                  >
                    <span>Or Build Full Proposal Brief</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Office Hubs & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0F172A]/80 border border-blue-900/40 space-y-5 shadow-xl text-xs">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                Executive Operating Hubs
              </h3>

              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Lagos Engineering Hub (Headquarters)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] pl-6">
                    Victoria Island, Lagos State, Nigeria
                  </p>
                  <p className="text-slate-500 text-[10px] pl-6">Primary engineering squads & PM operations</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Abuja Public Sector & Sovereign Hub</span>
                  </div>
                  <p className="text-slate-400 text-[11px] pl-6">
                    Maitama District, Abuja FCT, Nigeria
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>London Diaspora & International Desk</span>
                  </div>
                  <p className="text-slate-400 text-[11px] pl-6">
                    Canary Wharf, London, United Kingdom
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>partnerships@agency.ndh.com.ng</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>+234 (1) 888-NDH-CORP / +44 20 7946 0920</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import {
  ShieldCheck,
  Building,
  Users,
  Award,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
  MapPin,
} from "lucide-react";
import { MainNavView } from "../layout/AppNavbar";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";

interface AboutViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  const { t } = useCurrencyLanguage();
  return (
    <div className="bg-[#090D1A] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{t("about_badge")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            {t("about_title")}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            NDH Agency was founded on an unapologetic belief: Africa possesses world-class creative
            and engineering talent, but international enterprises and scale-ups need institutional
            project management, guaranteed SLAs, and zero communication friction.
          </p>
        </div>

        {/* Operating Model: Managed Bureau vs Freelance Marketplace */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-8 shadow-2xl">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Core Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Why NDH Is a Managed Bureau, Not a Freelancer Marketplace
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open freelance bidding creates unpredictable quality, communication breakdowns, and
              administrative nightmares. NDH Agency replaces chaotic bidding with an engineering
              operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-4">
              <div className="font-bold text-sm text-red-400">
                Traditional Freelance Marketplaces (The Problem)
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>
                    Clients must sift through dozens of untested bids and manage individual
                    freelancers.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>
                    Direct communication leads to scope creep, missed deadlines, and lost IP
                    ownership.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>
                    Zero formal QA gates; clients are forced to test raw code or unrefined designs
                    themselves.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-4">
              <div className="font-bold text-sm text-emerald-400">
                NDH Managed Bureau (The Solution)
              </div>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Clients contract NDH Agency with guaranteed SLAs, milestone escrow, and fixed
                    deliverables.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Dedicated internal Project Managers handle talent allocation, daily standups,
                    and scope controls.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Strict QA Gates: No deliverable is ever shown to a client until PM code audits
                    and latency tests pass.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Where We Work */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Where We Work
            </span>
            <h2 className="text-2xl font-bold text-white">Nigeria · Worldwide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-white text-sm">Sokoto, Nigeria</h4>
              </div>
              <p className="text-xs text-slate-300">
                Marmaron Nufawa, Western Bye Pass, Sokoto, Nigeria
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">
                Based in Nigeria, working with clients worldwide
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-white text-sm">Worldwide, Remote-First</h4>
              </div>
              <p className="text-xs text-slate-300">
                No branch offices — every engagement is run remotely by a dedicated project manager,
                reachable by WhatsApp and email.
              </p>
              <div className="text-[11px] text-blue-400 font-mono">
                WhatsApp: +234 902 993 2794 · hello@ndh.com.ng
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
import { MainNavView } from "../layout/navViews";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";

interface AboutViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  const { t } = useCurrencyLanguage();
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
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t("about_badge")}
          </span>

          <h1 className="font-display max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("about_title")}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed sm:text-lg">
            NDH Agency was founded on an unapologetic belief: Africa possesses world-class creative
            and engineering talent, but international enterprises and scale-ups need institutional
            project management, guaranteed SLAs, and zero communication friction.
          </p>
        </div>
      </section>

      {/* Porcelain body — elevated white cards */}
      <div className="gw-page-body">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          {/* Operating Model: Managed Bureau vs Freelance Marketplace */}
          <div className="gw-card space-y-8 p-8 sm:p-10">
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
              <div className="bg-surface-raised border-border space-y-4 rounded-xl border p-6">
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

              <div className="border-border space-y-4 rounded-xl border bg-emerald-400/10 p-6">
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
          <div className="gw-card space-y-6 p-8">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                Where We Work
              </span>
              <h2 className="text-2xl font-bold text-white">Nigeria · Worldwide</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-raised border-border space-y-2 rounded-xl border p-6">
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

              <div className="bg-surface-raised border-border space-y-2 rounded-xl border p-6">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <h4 className="font-bold text-white text-sm">Worldwide, Remote-First</h4>
                </div>
                <p className="text-xs text-slate-300">
                  No branch offices — every engagement is run remotely by a dedicated project
                  manager, reachable by WhatsApp and email.
                </p>
                <div className="text-[11px] text-blue-400 font-mono">
                  WhatsApp: +234 902 993 2794 · hello@ndh.com.ng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import {
  Award,
  ShieldCheck,
  Lock,
  Globe,
  Layers,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Heart,
  CreditCard,
  UserPlus,
  FileCheck,
  User,
  ArrowRight,
} from "lucide-react";
import { MainNavView } from "./AppNavbar";
import { BrandLogo } from "../brand/BrandLogo";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";
import { useAuth, openAuthModal } from "../../lib/authStore";

interface AppFooterProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
  onOpenTalentModal?: () => void;
  onOpenPaymentModal?: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  onSelectView,
  onOpenBriefWizard,
  onOpenTalentModal,
  onOpenPaymentModal,
}) => {
  const { user } = useAuth();
  const { currency } = useCurrencyLanguage();
  const [academyNotifyRequested, setAcademyNotifyRequested] = React.useState(false);

  const handleClientPortalClick = () => {
    if (user) {
      onSelectView("client-dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      openAuthModal("login");
    }
  };

  return (
    <footer className="bg-[#05070D] border-t border-slate-800/80 py-16 text-xs font-sans text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Discrete NDH Academy Cross-Link Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Looking for Tech Education &amp; Training? NDH Academy is on the way.
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono font-medium">
                  Launching Soon
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                NDH Academy will train African developers, product designers, and AI engineers as an
                independent platform with its own curriculum. It isn&apos;t live yet, so
                there&apos;s no site to visit — join the waitlist and we&apos;ll let you know the
                moment it opens.
              </p>
            </div>
          </div>

          {academyNotifyRequested ? (
            <div className="px-6 py-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-bold text-xs flex items-center gap-2 shrink-0">
              <span>You&apos;re on the list — we&apos;ll notify you at launch.</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAcademyNotifyRequested(true)}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <span>Notify Me at Launch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-4 border-t border-slate-850">
          {/* Col 1: Brand & Parent Hub */}
          <div className="space-y-4">
            <BrandLogo size="md" showSubtitle={true} />
            <p className="text-xs text-slate-300 leading-relaxed">
              We design and build world-class digital systems, mobile apps, and brand strategies
              that help modern businesses scale with certainty.
            </p>
            <div className="space-y-2 text-slate-300 text-xs pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Marmaron Nufawa, Western Bye Pass, Sokoto, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href="https://wa.me/2349029932794" className="hover:text-white">
                  +234 902 993 2794 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href="mailto:hello@ndh.com.ng" className="hover:text-white">
                  hello@ndh.com.ng
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href="mailto:abunnajeeh7@gmail.com" className="hover:text-white">
                  abunnajeeh7@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://www.facebook.com/share/1Be6HN8zjS/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                  aria-label="NDH on Facebook"
                >
                  Facebook
                </a>
                <span className="text-slate-700">•</span>
                <a
                  href="https://www.instagram.com/njb_digital_hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                  aria-label="NDH on Instagram"
                >
                  Instagram
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Nigeria · Worldwide — prices shown in {currency}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col gap-2">
              {onOpenTalentModal && (
                <button
                  onClick={onOpenTalentModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-blue-600/30 border border-emerald-500/40 text-emerald-300 hover:text-white hover:border-emerald-400 text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Apply as Vetted Talent</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                    Join Squad
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Managed Departments */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Popular Departments
            </div>
            <ul className="space-y-1.5 text-slate-300 text-xs">
              <li>
                <button
                  onClick={() => onSelectView("services")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Web &amp; Full-Stack Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("services")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Mobile Apps (iOS &amp; Android)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("services")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  UI/UX &amp; Product Design Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("services")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Brand Strategy &amp; Visual Identity
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("services")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  AI Agents &amp; Workflow Automation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("services")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  FinTech &amp; Payment Gateways
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("services")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Rapid No-Code MVPs (Starters &amp; Startups)
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onSelectView("services")}
                  className="text-blue-400 hover:text-blue-300 text-left font-bold transition-colors"
                >
                  View All 16 Departments →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Why Choose Us */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Why Choose NDH
            </div>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <button
                  onClick={() => onSelectView("about")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Managed Bureau vs Freelancers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("process")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Guaranteed On-Time Delivery SLAs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("talent-network")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Top 3% Vetted African Talent
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("case-study")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Client Success Stories &amp; ROI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("insights")}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Tech Blog &amp; Case Dossiers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Client & Governance */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Client &amp; Governance
            </div>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li>
                <button
                  onClick={handleClientPortalClick}
                  className="hover:text-blue-400 flex items-center justify-between w-full transition-colors font-medium text-white"
                >
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Client Portal</span>
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                    {user ? "Active" : "Sign In"}
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("process")}
                  className="hover:text-blue-400 text-left transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dual-Key Escrow Guarantee</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("about")}
                  className="hover:text-blue-400 text-left transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Standard Enterprise NDA</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("contact")}
                  className="hover:text-blue-400 text-left transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Book Consultation Call</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Compliance Badges */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="space-y-1">
            <div>
              © 2026 NDH Agency (agency.ndh.com.ng). Part of Najeeb Digital Hub. All rights
              reserved.
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <button
                onClick={() => onSelectView("privacy-policy")}
                className="hover:text-blue-400 underline underline-offset-2"
              >
                Privacy Policy
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => onSelectView("terms-of-service")}
                className="hover:text-blue-400 underline underline-offset-2"
              >
                Terms of Service
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => onSelectView("refund-policy")}
                className="hover:text-blue-400 underline underline-offset-2"
              >
                Refund Policy
              </button>
            </div>
            <div className="text-[10px] text-slate-500">
              Contact details above (address, WhatsApp, email, social links) are real. Case study
              photography is illustrative, not literal client screenshots. Any demo/sample
              organization accounts elsewhere on this site are clearly labeled as such.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NDA-Protected Client Engagements</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Enterprise-Grade Security Practices</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Paystack &amp; Flutterwave Payment Rails</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

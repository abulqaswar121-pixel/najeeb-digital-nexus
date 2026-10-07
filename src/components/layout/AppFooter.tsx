import React from "react";
import {
  ShieldCheck,
  Lock,
  Globe,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  UserPlus,
  FileCheck,
  User,
} from "lucide-react";
import { MainNavView } from "./navViews";
import { BrandLogo } from "../brand/BrandLogo";
import { AcademyCrossPromo } from "./AcademyCrossPromo";
import { FamilyFooterLinks } from "./FamilyFooterLinks";
import { useCurrencyLanguage } from "../../lib/currencyLanguageStore";
import { useAuth, openAuthModal } from "../../lib/authStore";

interface AppFooterProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
  onOpenTalentModal?: () => void;
  onOpenPaymentModal?: () => void;
  /**
   * On the home page the Academy cross-promotion is intentionally omitted: the
   * home page already runs a full Academy cross-promotion section inside its
   * own "The NDH Family" anchor band, so repeating the card here would double
   * it. Every other page gets it in the footer.
   */
}

/**
 * Deep-navy footer anchor — the Academy `FamilyFooter` treatment.
 *
 * STRICT ECOSYSTEM ISOLATION: this footer is the *only* place the NDH family
 * directory lives. The sibling directory (`FamilyFooterLinks`), the parent
 * gateway link and (off the home page) the Academy cross-promotion all sit
 * here, never in the top navigation.
 *
 * The whole footer renders inside the shared `.band-dark` token scope, so any
 * token-driven child (cards, chips, headings) flips to its on-navy value.
 */
export const AppFooter: React.FC<AppFooterProps> = ({
  onSelectView,
  onOpenBriefWizard,
  onOpenTalentModal,
}) => {
  const { user } = useAuth();
  const { currency } = useCurrencyLanguage();

  const handleClientPortalClick = () => {
    if (user) {
      onSelectView("client-dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      openAuthModal("login");
    }
  };

  return (
    <footer className="band-dark border-border/60 border-t py-16 font-sans text-xs">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* The NDH family directory — parent gateway, siblings, launch status */}
        <FamilyFooterLinks />

        {/* Academy cross-promotion — sibling promotion lives in the footer on
            every page (the top navigation stays 100% agency-focused). */}
        <AcademyCrossPromo />

        {/* 4-Column Directory Grid */}
        <div className="border-border/60 grid min-w-0 grid-cols-1 gap-10 border-t pt-10 md:grid-cols-2 xl:grid-cols-4">
          {/* Col 1: Brand & contact */}
          <div className="space-y-4">
            <BrandLogo size="md" />
            <p className="text-muted-foreground text-xs leading-relaxed">
              We design and build world-class digital systems, mobile apps, and brand strategies
              that help modern businesses scale with certainty.
            </p>
            <div className="text-muted-foreground space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="text-brand-soft h-3.5 w-3.5 shrink-0" />
                <span>Marmaron Nufawa, Western Bye Pass, Sokoto, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-brand-soft h-3.5 w-3.5 shrink-0" />
                <a href="https://wa.me/2349029932794" className="hover:text-foreground">
                  +234 902 993 2794 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-brand-soft h-3.5 w-3.5 shrink-0" />
                <a href="mailto:hello@ndh.com.ng" className="hover:text-foreground">
                  hello@ndh.com.ng
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-brand-soft h-3.5 w-3.5 shrink-0" />
                <a href="mailto:abunnajeeh7@gmail.com" className="hover:text-foreground">
                  abunnajeeh7@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://www.facebook.com/share/1Be6HN8zjS/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                  aria-label="NDH on Facebook"
                >
                  Facebook
                </a>
                <span className="text-muted-foreground/40">•</span>
                <a
                  href="https://www.instagram.com/njb_digital_hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                  aria-label="NDH on Instagram"
                >
                  Instagram
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Globe className="text-success h-3.5 w-3.5 shrink-0" />
                <span>Nigeria · Worldwide — prices shown in {currency}</span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={onOpenBriefWizard}
                className="border-brand-subtle/60 bg-brand-subtle text-brand-soft hover:text-foreground flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors"
              >
                <span>Start a project brief</span>
                <span className="font-mono text-[10px]">Free scope</span>
              </button>
              {onOpenTalentModal && (
                <button
                  onClick={onOpenTalentModal}
                  className="border-success/40 text-success flex items-center justify-between rounded-xl border bg-emerald-400/10 px-4 py-2.5 text-xs font-bold transition-colors hover:border-emerald-400/60"
                >
                  <span className="flex items-center gap-1.5">
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Apply as Vetted Talent</span>
                  </span>
                  <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 font-mono text-[10px]">
                    Join Squad
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Managed departments */}
          <div className="space-y-3">
            <div className="text-foreground text-xs font-bold tracking-wider uppercase">
              Popular Departments
            </div>
            <ul className="text-muted-foreground space-y-1.5 text-xs">
              {[
                "Web & Full-Stack Development",
                "Mobile Apps (iOS & Android)",
                "UI/UX & Product Design Systems",
                "Brand Strategy & Visual Identity",
                "AI Agents & Workflow Automation",
                "FinTech & Payment Gateways",
                "Rapid No-Code MVPs",
              ].map((label) => (
                <li key={label}>
                  <button
                    onClick={() => onSelectView("services")}
                    className="hover:text-foreground text-left transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li className="pt-1">
                <button
                  onClick={() => onSelectView("services")}
                  className="text-brand-soft hover:text-foreground text-left font-bold transition-colors"
                >
                  View All 16 Departments →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Why choose NDH */}
          <div className="space-y-3">
            <div className="text-foreground text-xs font-bold tracking-wider uppercase">
              Why Choose NDH
            </div>
            <ul className="text-muted-foreground space-y-2 text-xs">
              {[
                { view: "about" as MainNavView, label: "Managed Bureau vs Freelancers" },
                { view: "process" as MainNavView, label: "Guaranteed On-Time Delivery SLAs" },
                { view: "talent-network" as MainNavView, label: "Top 3% Vetted African Talent" },
                { view: "case-study" as MainNavView, label: "Client Success Stories & ROI" },
                { view: "insights" as MainNavView, label: "Insights & Case Dossiers" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onSelectView(item.view)}
                    className="hover:text-foreground text-left transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Client & governance */}
          <div className="space-y-3">
            <div className="text-foreground text-xs font-bold tracking-wider uppercase">
              Client &amp; Governance
            </div>
            <ul className="text-muted-foreground space-y-2 text-xs">
              <li>
                <button
                  onClick={handleClientPortalClick}
                  className="hover:text-foreground flex w-full items-center justify-between font-medium transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <User className="text-brand-soft h-3.5 w-3.5" />
                    <span>Client Portal</span>
                  </span>
                  <span className="text-brand-soft bg-brand-subtle rounded px-2 py-0.5 font-mono text-[10px]">
                    {user ? "Active" : "Sign In"}
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("process")}
                  className="hover:text-foreground flex items-center gap-1.5 text-left transition-colors"
                >
                  <FileCheck className="text-success h-3.5 w-3.5" />
                  <span>Dual-Key Escrow Guarantee</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView("contact")}
                  className="hover:text-foreground flex items-center gap-1.5 text-left transition-colors"
                >
                  <Phone className="text-brand-soft h-3.5 w-3.5" />
                  <span>Book Consultation Call</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar — legal, staff access, trust cues */}
        <div className="border-border/60 text-muted-foreground flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row">
          <div className="space-y-1">
            <div>
              © {new Date().getFullYear()} NDH Agency (agency.ndh.com.ng). Part of Najeeb Digital
              Hub. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <button
                onClick={() => onSelectView("privacy-policy")}
                className="hover:text-foreground underline underline-offset-2"
              >
                Privacy Policy
              </button>
              <span className="text-muted-foreground/40">•</span>
              <button
                onClick={() => onSelectView("terms-of-service")}
                className="hover:text-foreground underline underline-offset-2"
              >
                Terms of Service
              </button>
              <span className="text-muted-foreground/40">•</span>
              <button
                onClick={() => onSelectView("refund-policy")}
                className="hover:text-foreground underline underline-offset-2"
              >
                Refund Policy
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px]">
              <span className="text-muted-foreground/70">Staff &amp; Partner Access:</span>
              <button
                onClick={() => openAuthModal("login", "admin")}
                className="hover:text-foreground underline underline-offset-2"
              >
                Admin
              </button>
              <span className="text-muted-foreground/40">•</span>
              <button
                onClick={() => openAuthModal("login", "pm")}
                className="hover:text-foreground underline underline-offset-2"
              >
                Project Manager
              </button>
              <span className="text-muted-foreground/40">•</span>
              <button
                onClick={() => openAuthModal("login", "talent")}
                className="hover:text-foreground underline underline-offset-2"
              >
                Talent
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="text-success h-4 w-4" />
              <span>NDA-Protected Client Engagements</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="text-brand-soft h-4 w-4" />
              <span>Enterprise-Grade Security Practices</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="text-gold h-4 w-4" />
              <span>Paystack &amp; Flutterwave Payment Rails</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

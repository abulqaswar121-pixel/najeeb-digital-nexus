import React, { useState } from "react";
import { useModalA11y } from "../../hooks/use-modal-a11y";
import { dbService } from "../../lib/databaseStore";
import { ServiceDepartment } from "../../types/ndh";
import { SERVICE_DEPARTMENTS } from "../../data/mockData";
import {
  X,
  Award,
  CheckCircle2,
  Sparkles,
  Send,
  Upload,
  Globe,
  DollarSign,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

interface TalentApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TalentApplicationModal: React.FC<TalentApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [department, setDepartment] = useState<ServiceDepartment>("web_app_development");
  const [experienceLevel, setExperienceLevel] = useState<
    "Junior" | "Intermediate" | "Senior" | "Lead" | "Elite"
  >("Senior");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubOrBehance, setGithubOrBehance] = useState("");
  const [hourlyRate, setHourlyRate] = useState("₦15,000 / hr ($25/hr)");
  const [hoursPerWeek, setHoursPerWeek] = useState(25);
  const [bioNotes, setBioNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useModalA11y(isOpen, onClose);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !portfolioUrl) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await dbService.submitTalentApplication({
        fullName,
        email,
        phone,
        country,
        primaryDepartment: department,
        experienceLevel,
        portfolioUrl,
        ...(githubOrBehance ? { githubOrBehance } : {}),
        hourlyRateExpectation: hourlyRate,
        availableHoursPerWeek: hoursPerWeek,
        bioNotes,
      });
      setIsSubmitted(true);
    } catch {
      setSubmitError("Could not submit your application right now. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Talent application"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans overflow-y-auto"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-eco-navy border border-eco-cyan/25 p-6 sm:p-8 shadow-2xl relative space-y-6 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--eco-on-dark-muted)] hover:text-white p-2 rounded-full hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-10 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Application Received!</h3>
              <p className="text-xs text-slate-200 max-w-md mx-auto leading-relaxed">
                Thank you for applying to the <strong>NDH Vetted Talent Network</strong>. Our talent
                management squad will review your portfolio and initiate technical vetting within 48
                business hours.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 max-w-sm mx-auto text-xs text-left space-y-1 font-mono text-[var(--eco-on-dark-muted)]">
              <div>
                Candidate: <span className="text-white font-bold">{fullName}</span>
              </div>
              <div>
                Department: <span className="text-eco-cyan font-bold">{department}</span>
              </div>
              <div>
                Status: <span className="text-emerald-400 font-bold">Vetting Queue Active ✓</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-eco-cyan/20 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
            >
              Return to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-eco-dark text-eco-cyan text-[10px] font-mono font-bold border border-white/10">
                <Sparkles className="w-3 h-3 text-eco-cyan" />
                <span>JOIN TOP 3% AFRICAN TALENT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Apply to the NDH Talent Squad
              </h2>
              <p className="text-xs text-slate-200">
                Work on high-impact enterprise projects with guaranteed prompt escrow payments in
                NGN/USD and dedicated PM protection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oluwaseun Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. seun@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Phone / WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="e.g. +234 812 345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Country / Base</label>
                <input
                  type="text"
                  placeholder="e.g. Nigeria / UK / Ghana / Remote"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Primary Discipline *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as ServiceDepartment)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40"
                >
                  {SERVICE_DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Seniority Level *</label>
                <select
                  value={experienceLevel}
                  onChange={(e) =>
                    setExperienceLevel(e.target.value as Parameters<typeof setExperienceLevel>[0])
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40"
                >
                  <option value="Junior">Junior (1-2 yrs)</option>
                  <option value="Intermediate">Intermediate (3-4 yrs)</option>
                  <option value="Senior">Senior (5-7 yrs)</option>
                  <option value="Lead">Lead / Architect (8+ yrs)</option>
                  <option value="Elite">Elite Specialist</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Portfolio / Live URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://myportfolio.com or Figma link"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">GitHub / Behance / Dribbble</label>
                <input
                  type="url"
                  placeholder="https://github.com/yourhandle"
                  value={githubOrBehance}
                  onChange={(e) => setGithubOrBehance(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-200">Brief Overview of Your Superpowers</label>
              <textarea
                rows={3}
                placeholder="Tell us about the most complex system, brand, or campaign you've engineered..."
                value={bioNotes}
                onChange={(e) => setBioNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-eco-dark border border-white/10 text-white focus:outline-none focus:border-eco-cyan/40 resize-none"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-eco-cyan/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NDA Protected • 100% Talent Margin Confidentiality</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-eco-cyan/20 disabled:opacity-60 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>{isSubmitting ? "Submitting..." : "Submit Application"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {submitError && <p className="text-xs text-red-400 text-right">{submitError}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

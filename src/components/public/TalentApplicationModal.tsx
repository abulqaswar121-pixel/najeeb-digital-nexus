import React, { useState } from 'react';
import { dbService } from '../../lib/databaseStore';
import { ServiceDepartment } from '../../types/ndh';
import { SERVICE_DEPARTMENTS } from '../../data/mockData';
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
} from 'lucide-react';

interface TalentApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TalentApplicationModal: React.FC<TalentApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [department, setDepartment] = useState<ServiceDepartment>('web_app_development');
  const [experienceLevel, setExperienceLevel] = useState<'Junior' | 'Intermediate' | 'Senior' | 'Lead' | 'Elite'>('Senior');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubOrBehance, setGithubOrBehance] = useState('');
  const [hourlyRate, setHourlyRate] = useState('₦15,000 / hr ($25/hr)');
  const [hoursPerWeek, setHoursPerWeek] = useState(25);
  const [bioNotes, setBioNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !portfolioUrl) return;

    dbService.submitTalentApplication({
      fullName,
      email,
      phone,
      country,
      primaryDepartment: department,
      experienceLevel,
      portfolioUrl,
      githubOrBehance,
      hourlyRateExpectation: hourlyRate,
      availableHoursPerWeek: hoursPerWeek,
      bioNotes,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0F172A] border border-blue-500/40 p-6 sm:p-8 shadow-2xl relative space-y-6 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
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
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for applying to the <strong>NDH Vetted Talent Network</strong>. Our talent management squad will review your portfolio and initiate technical vetting within 48 business hours.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm mx-auto text-xs text-left space-y-1 font-mono text-slate-400">
              <div>Candidate: <span className="text-white font-bold">{fullName}</span></div>
              <div>Department: <span className="text-blue-400 font-bold">{department}</span></div>
              <div>Status: <span className="text-emerald-400 font-bold">Vetting Queue Active ✓</span></div>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
            >
              Return to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-mono font-bold border border-blue-800">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>JOIN TOP 3% AFRICAN TALENT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Apply to the NDH Talent Squad
              </h2>
              <p className="text-xs text-slate-300">
                Work on high-impact enterprise projects with guaranteed prompt escrow payments in NGN/USD and dedicated PM protection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oluwaseun Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. seun@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Phone / WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="e.g. +234 812 345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Country / Base</label>
                <input
                  type="text"
                  placeholder="e.g. Nigeria / UK / Ghana / Remote"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Primary Discipline *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as ServiceDepartment)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  {SERVICE_DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Seniority Level *</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Junior">Junior (1-2 yrs)</option>
                  <option value="Intermediate">Intermediate (3-4 yrs)</option>
                  <option value="Senior">Senior (5-7 yrs)</option>
                  <option value="Lead">Lead / Architect (8+ yrs)</option>
                  <option value="Elite">Elite Specialist</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Portfolio / Live URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://myportfolio.com or Figma link"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">GitHub / Behance / Dribbble</label>
                <input
                  type="url"
                  placeholder="https://github.com/yourhandle"
                  value={githubOrBehance}
                  onChange={(e) => setGithubOrBehance(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-300">Brief Overview of Your Superpowers</label>
              <textarea
                rows={3}
                placeholder="Tell us about the most complex system, brand, or campaign you've engineered..."
                value={bioNotes}
                onChange={(e) => setBioNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NDA Protected • 100% Talent Margin Confidentiality</span>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>Submit Application</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

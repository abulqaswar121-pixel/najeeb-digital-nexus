import React from "react";
import { useModalA11y } from "../../../hooks/use-modal-a11y";
import { ServiceDepartmentInfo } from "../../../types/ndh";
import { useCurrencyLanguage } from "../../../lib/currencyLanguageStore";
import {
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Code2,
  Check,
  User,
  Zap,
} from "lucide-react";

interface ServiceDetailModalProps {
  dept: ServiceDepartmentInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBriefWizard: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  dept,
  isOpen,
  onClose,
  onOpenBriefWizard,
}) => {
  const { currency, getRegionalPricing } = useCurrencyLanguage();

  useModalA11y(isOpen, onClose);

  if (!isOpen || !dept) return null;

  const starterPlan = getRegionalPricing(dept.id, "starter");
  const growthPlan = getRegionalPricing(dept.id, "growth");
  const enterprisePlan = getRegionalPricing(dept.id, "enterprise");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Service details"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans overflow-y-auto"
    >
      <div className="w-full max-w-3xl rounded-3xl bg-[#0F172A] border border-blue-500/40 shadow-2xl relative space-y-6 my-8 overflow-hidden">
        {/* Visual Cover Banner */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-950">
          <img
            src={dept.coverImage}
            alt={dept.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                {dept.category.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/90 text-emerald-400 text-xs font-mono font-bold backdrop-blur-md border border-emerald-500/30 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{dept.averageTurnaroundDays}d Avg Delivery</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
              {dept.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 pt-0 space-y-6">
          <p className="text-sm text-slate-200 leading-relaxed">{dept.description}</p>

          {/* 3 Accessible Tiers Calibrated to User's Country */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Transparent Pricing ({currency})
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">
                No hidden charges • 100% Escrow Protected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Starter MVP</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                    Starter Plan
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {starterPlan.price}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  {starterPlan.starterDesc}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-600/50 space-y-2 relative shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Growth Scale</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    Most Popular
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-blue-400">
                  {growthPlan.price}
                </div>
                <div className="text-[11px] text-slate-300 leading-tight">
                  Complete Custom Build + QA
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Enterprise</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                    Dedicated PM
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-indigo-400">
                  {enterprisePlan.price}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  High concurrency &amp; 24/7 SLA
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities & Tech Stack Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                What's Included:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {dept.capabilities.map((cap, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Engineered Tech Stacks:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dept.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">Assigned Department Lead:</div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>{dept.leadName}</span>
                  <span className="text-slate-400 font-normal">({dept.leadTitle})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Dedicated PM Included • Zero Risk IP Escrow</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenBriefWizard();
                }}
                className="w-1/2 sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <span>Start This Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

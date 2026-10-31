import React from "react";
import { useModalA11y } from "../../../hooks/use-modal-a11y";
import { ServiceDepartmentInfo } from "../../../types/ndh";
import {
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  User,
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

  useModalA11y(isOpen, onClose);

  if (!isOpen || !dept) return null;


  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Service details"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans"
    >
      <div className="w-full max-w-3xl max-h-[calc(100dvh-2rem)] rounded-3xl bg-eco-navy border border-eco-cyan/25 shadow-2xl relative space-y-6 overflow-y-auto overscroll-contain">
        {/* Visual Cover Banner */}
        <div className="relative h-60 w-full overflow-hidden bg-eco-dark">
          <img
            src={dept.coverImage}
            alt={dept.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-eco-navy via-[#0F172A]/50 to-transparent" />

          <button
            onClick={onClose}
            aria-label="Close service details"
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                {dept.category.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.06] text-emerald-400 text-xs font-mono font-bold backdrop-blur-md border border-emerald-500/30 flex items-center gap-1">
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

          {/* Scope tiers — tailored during project discovery, never fixed-price */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">Engagement Scope</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {["Fast MVP", "Full Production System", "Enterprise Scale"].map((tier) => (
                <div key={tier} className="rounded-2xl border border-white/10 bg-eco-dark p-4 font-bold text-white">{tier}</div>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-[var(--eco-on-dark-muted)]">Every engagement is scoped to your requirements, delivery milestones, and operating environment.</p>
          </div>

          {/* Capabilities & Tech Stack Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                What's Included:
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
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
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Engineered Tech Stacks:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dept.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-eco-dark border border-white/10 text-xs font-mono text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-eco-dark border border-white/10 space-y-1">
                <div className="text-[11px] text-[var(--eco-on-dark-muted)]">
                  Department Capacity:
                </div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-eco-cyan" />
                  <span>{dept.activeTalentsCount} Active Vetted Talents</span>
                  <span className="text-[var(--eco-on-dark-muted)] font-normal">
                    (~{dept.averageTurnaroundDays}-day avg. turnaround)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Custom Scope • Milestone-Based Delivery</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.08] text-slate-200 text-xs font-bold border border-white/12 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenBriefWizard();
                }}
                className="w-1/2 sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary via-eco-glow to-eco-dark hover:from-eco-cyan hover:to-eco-glow text-white font-bold text-xs shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <span>Scope This Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

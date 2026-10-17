import React from "react";
import { ClipboardList, GitBranch, ShieldCheck, UserCheck, type LucideIcon } from "lucide-react";

export interface DeliveryStep {
  num: string;
  title: string;
  text: string;
  icon: LucideIcon;
}

/**
 * The agency's 4-step delivery arc — the Academy's numbered card grid, with
 * large faint numerals (01 … 04) and one tinted icon pill per step.
 */
export const DELIVERY_STEPS: DeliveryStep[] = [
  {
    num: "01",
    title: "Tell Us Your Idea",
    text: "We turn your idea into a clear plan with a fixed price before any work starts.",
    icon: ClipboardList,
  },
  {
    num: "02",
    title: "Meet Your Manager",
    text: "You get one project manager and checked experts picked for your project.",
    icon: UserCheck,
  },
  {
    num: "03",
    title: "We Build In Steps",
    text: "You see progress every week. You only pay for each step after you approve it.",
    icon: ShieldCheck,
  },
  {
    num: "04",
    title: "Launch & Support",
    text: "We put it live, hand everything over to you, and stay to help after launch.",
    icon: GitBranch,
  },
];

interface Props {
  /** Optional per-step click handler (used to jump to the full process page). */
  onStepClick?: (step: DeliveryStep) => void;
}

/** Numbered card grid for the delivery arc. */
export const DeliveryArc: React.FC<Props> = ({ onStepClick }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {DELIVERY_STEPS.map((step) => {
      const Icon = step.icon;
      return (
        <div
          key={step.num}
          role={onStepClick ? "button" : undefined}
          tabIndex={onStepClick ? 0 : undefined}
          onClick={onStepClick ? () => onStepClick(step) : undefined}
          onKeyDown={
            onStepClick
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onStepClick(step);
                  }
                }
              : undefined
          }
          className={`gw-card gw-card-hover relative p-6 ${onStepClick ? "cursor-pointer" : ""}`}
        >
          <div className="text-muted-foreground/35 absolute top-4 right-5">
            <span className="gw-step-numeral">{step.num}</span>
          </div>
          <div className="gw-icon-pill">
            <Icon aria-hidden="true" />
          </div>
          <h3 className="text-foreground mt-4 text-base font-bold">{step.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{step.text}</p>
        </div>
      );
    })}
  </div>
);

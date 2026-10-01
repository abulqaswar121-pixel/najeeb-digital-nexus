import React, { useState } from "react";
import { useModalA11y } from "../../../hooks/use-modal-a11y";
import { ServiceDepartment, ServiceDepartmentInfo } from "../../../types/ndh";
import { SERVICE_DEPARTMENTS } from "../../../data/mockData";
import { dbService } from "../../../lib/databaseStore";
import { useCurrencyLanguage } from "../../../lib/currencyLanguageStore";
import { X, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Globe } from "lucide-react";

interface InteractiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveBriefModal: React.FC<InteractiveBriefModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currency, detectedCountry, getRegionalPricing } = useCurrencyLanguage();

  const [step, setStep] = useState<number>(1);
  const [selectedDept, setSelectedDept] = useState<ServiceDepartment>("web_app_development");
  const [scopeTier, setScopeTier] = useState<"starter" | "growth" | "enterprise">("growth");
  const [timeline, setTimeline] = useState<string>("2 - 4 Weeks");
  const [companyName, setCompanyName] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [projectOverview, setProjectOverview] = useState<string>("");
  const [ndaRequested, setNdaRequested] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useModalA11y(isOpen, onClose);

  if (!isOpen) return null;

  const currentDept: ServiceDepartmentInfo =
    SERVICE_DEPARTMENTS.find((d) => d.id === selectedDept) || SERVICE_DEPARTMENTS[0]!;

  const pricingEstimate = getRegionalPricing(selectedDept, scopeTier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dbService.createBrief({
      projectName: companyName ? `${companyName} Digital Project` : `${currentDept.name} Project`,
      organizationName: companyName || "Client Organization",
      department: selectedDept,
      scopeTier,
      budgetAmount: pricingEstimate.price,
      currency,
      timelineWeeks: timeline,
      clientEmail: contactEmail || "client@example.com",
      clientPhone: contactPhone,
      briefDetails: projectOverview || `Scope: ${pricingEstimate.starterDesc}`,
    });

    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project brief wizard"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans"
    >
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">
              N
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                NDH Agency • Request a Tailored Proposal
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Step {step} of 3 • Tailored Scoping Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Submission Success View */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-foreground">
                Brief Successfully Received & Scored
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Your brief has been logged in the NDH Operations Command center with an AI Quality
                Score of 96/100.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border text-left space-y-2 text-xs max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Department:</span>
                <span className="font-semibold text-foreground">{currentDept.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned PM Lead:</span>
                <span className="font-semibold text-foreground">{currentDept.leadName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mutual NDA Status:</span>
                <span className="font-semibold text-emerald-500 font-mono">
                  {ndaRequested ? "Mutual NDA Draft Attached" : "Standard Confidentiality"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proposal Delivery SLA:</span>
                <span className="font-semibold text-primary font-mono">Within 24 Hours</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
            >
              Close & Return to Direction Studio
            </button>
          </div>
        ) : (
          /* Multi-Step Wizard Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Step 1: Select Department */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-base text-foreground">
                    Select Primary Service Department
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Choose the core discipline required. Our PMs can combine multiple departments
                    into a unified sprint.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                  {SERVICE_DEPARTMENTS.map((dept) => {
                    const isSelected = selectedDept === dept.id;
                    return (
                      <div
                        key={dept.id}
                        onClick={() => setSelectedDept(dept.id)}
                        className={`p-3.5 rounded-xl cursor-pointer border transition-all text-xs space-y-1 ${
                          isSelected
                            ? "bg-primary/10 border-primary ring-1 ring-primary/40"
                            : "bg-background border-border hover:border-border/80"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-foreground">
                          <span>{dept.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {dept.tagline}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/90"
                  >
                    <span>Next: Scope & Budget</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Scope, Budget & Timeline */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-base text-foreground">
                    Project Scope, Budget & Timeline
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Selected Department:{" "}
                    <strong className="text-foreground">{currentDept.name}</strong>
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Project Objective & Overview *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe what you want to build, key objectives, existing tech stack or challenges..."
                      value={projectOverview}
                      onChange={(e) => setProjectOverview(e.target.value)}
                      className="w-full p-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Desired Timeline
                      </label>
                      <select
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                      >
                        <option>Rapid Launch (3 - 7 Days)</option>
                        <option>Standard Sprint (2 - 4 Weeks)</option>
                        <option>Comprehensive Build (4 - 8 Weeks)</option>
                        <option>Enterprise Architecture (8 - 12 Weeks)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Scope Tier ({currency} • {detectedCountry})
                      </label>
                      <select
                        value={scopeTier}
                        onChange={(e) =>
                          setScopeTier(e.target.value as Parameters<typeof setScopeTier>[0])
                        }
                        className="w-full p-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="starter">
                          Starter MVP ({getRegionalPricing(selectedDept, "starter").price})
                        </option>
                        <option value="growth">
                          Growth Build ({getRegionalPricing(selectedDept, "growth").price})
                        </option>
                        <option value="enterprise">
                          Enterprise Dedicated (
                          {getRegionalPricing(selectedDept, "enterprise").price})
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <div>
                        <span className="font-semibold text-foreground block">
                          Execute Mutual Non-Disclosure Agreement (NDA)
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          NDH Agency binds all internal staff under strict IP confidentiality
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={ndaRequested}
                      onChange={(e) => setNdaRequested(e.target.checked)}
                      className="w-4 h-4 text-primary rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/90"
                  >
                    <span>Next: Organization Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Organization & Contact Info */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-base text-foreground">
                    Organization & Authorized Contact
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Where should we send the proposal and milestone roadmap?
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Company / Organization Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., KoboPay Global Limited"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Your Full Name & Role *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Folake Adeleke (CPO)"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-foreground block mb-1">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="folake@company.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Submit Brief & Dispatch PM Triage</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

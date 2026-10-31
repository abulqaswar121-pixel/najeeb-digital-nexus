import React, { useState } from "react";
import { useModalA11y } from "../../../hooks/use-modal-a11y";
import { ServiceDepartment, ServiceDepartmentInfo } from "../../../types/ndh";
import { SERVICE_DEPARTMENTS } from "../../../data/mockData";
import { dbService } from "../../../lib/databaseStore";
import { useAuth, registerClientAccount, loginWithCredentials } from "../../../lib/authStore";
import { useCurrencyLanguage } from "../../../lib/currencyLanguageStore";
import { X, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Globe } from "lucide-react";

interface InteractiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPortal?: () => void;
}

export const InteractiveBriefModal: React.FC<InteractiveBriefModalProps> = ({
  isOpen,
  onClose,
  onOpenPortal,
}) => {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [accountError, setAccountError] = useState<string | null>(null);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const { currency } = useCurrencyLanguage();

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
  const [submittedAssignedPM, setSubmittedAssignedPM] = useState<string>("Unassigned");

  useModalA11y(isOpen, onClose);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentDept: ServiceDepartmentInfo =
    SERVICE_DEPARTMENTS.find((d) => d.id === selectedDept) || SERVICE_DEPARTMENTS[0]!;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const createdBrief = await dbService.createBrief({
        projectName: companyName ? `${companyName} Digital Project` : `${currentDept.name} Project`,
        organizationName: companyName || "Client Organization",
        department: selectedDept,
        scopeTier,
        budgetAmount: "Custom scope to be determined",
        currency,
        timelineWeeks: timeline,
        clientEmail: contactEmail,
        ...(contactPhone ? { clientPhone: contactPhone } : {}),
        briefDetails: projectOverview || `Requested scope tier: ${scopeTier}. Final scope and investment to be agreed during discovery.`,
      });
      setSubmittedAssignedPM(createdBrief.assignedPM || "Unassigned");
      setSubmitted(true);
    } catch {
      setSubmitError("Could not submit your brief right now. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const finishAndOpenPortal = () => {
    onClose();
    setSubmitted(false);
    setStep(1);
    onOpenPortal?.();
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    if (password.length < 8) {
      setAccountError("Your password needs at least 8 characters.");
      return;
    }
    setCreatingAccount(true);
    const result = await registerClientAccount({
      fullName: contactName || companyName || "Client",
      email: contactEmail,
      password,
      organizationName: companyName || contactName || "My Business",
      ...(contactPhone ? { phone: contactPhone } : {}),
    });
    if (!result.success) {
      // The email may already have an account — try signing in instead.
      const login = await loginWithCredentials(contactEmail, password);
      setCreatingAccount(false);
      if (!login.success) {
        setAccountError(
          "This email already has an account. Enter its password, or sign in from the top menu.",
        );
        return;
      }
    }
    setCreatingAccount(false);
    finishAndOpenPortal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project brief wizard"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans"
    >
      <div className="relative w-full min-w-0 max-w-2xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto overflow-x-hidden overscroll-contain bg-card border border-border rounded-2xl shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">
              N
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Start a project</h3>
              <p className="text-[10px] text-muted-foreground">Step {step} of 3</p>
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
              <h4 className="text-xl font-bold text-foreground">We got your project request</h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                A project manager will review it and reply within 24 hours.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border text-left space-y-2 text-xs max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-semibold text-foreground">{currentDept.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project manager:</span>
                <span className="font-semibold text-foreground">
                  {submittedAssignedPM === "Unassigned" ? "Not yet assigned" : submittedAssignedPM}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Privacy:</span>
                <span className="font-semibold text-emerald-500 font-mono">
                  {ndaRequested ? "NDA included" : "Kept private"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next step:</span>
                <span className="font-semibold text-primary">Custom scope review</span>
              </div>
            </div>

            {user ? (
              <button
                onClick={finishAndOpenPortal}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
              >
                Open my portal
              </button>
            ) : (
              <form
                onSubmit={handleCreateAccount}
                className="max-w-md mx-auto text-left space-y-3 p-4 rounded-xl border border-border bg-background"
              >
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Last step: create your account
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Track your project, pay, and chat with your project manager in your portal.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground break-all">
                  Email: <span className="font-semibold text-foreground">{contactEmail}</span>
                </p>
                <label className="block text-xs font-semibold text-foreground">
                  Choose a password
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    placeholder="At least 8 characters"
                  />
                </label>
                {accountError && <p className="text-xs text-destructive">{accountError}</p>}
                <button
                  type="submit"
                  disabled={creatingAccount}
                  className="w-full px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 disabled:opacity-60"
                >
                  {creatingAccount ? "Creating your account..." : "Create account & open my portal"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full text-xs text-muted-foreground underline"
                >
                  Not now
                </button>
              </form>
            )}
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
                        Project Scope
                      </label>
                      <select
                        value={scopeTier}
                        onChange={(e) =>
                          setScopeTier(e.target.value as Parameters<typeof setScopeTier>[0])
                        }
                        className="w-full p-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="starter">
                          Fast MVP
                        </option>
                        <option value="growth">
                          Full Production System
                        </option>
                        <option value="enterprise">
                          Enterprise Scale
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
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {isSubmitting ? "Submitting..." : "Submit Brief & Dispatch PM Review"}
                    </span>
                  </button>
                </div>
                {submitError && <p className="text-xs text-red-500 text-right">{submitError}</p>}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

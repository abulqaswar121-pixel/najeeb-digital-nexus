import { ServiceDepartment, TalentProfile, UserSession, UserRole } from "../types/ndh";
import { api } from "./apiClient";
import { useEffect, useState, useCallback } from "react";

// ============================================================================
// This module used to BE the "database" (an in-memory + localStorage
// wrapper with zero server involvement). It is now a thin client for the
// real backend in server/ -- every mutating call goes over the network to a
// role-gated API endpoint, and the server is the actual source of truth.
// ============================================================================

export function calculateWelcomeCreditDeduction(
  invoiceAmount: number,
  availableCredit: number,
  discountPercentage: number = 0.1,
): {
  nominalDiscount: number;
  appliedDiscount: number;
  finalPayable: number;
  remainingCredit: number;
} {
  const nominalDiscount = Math.round(invoiceAmount * discountPercentage);
  const appliedDiscount = Math.min(nominalDiscount, Math.max(0, availableCredit));
  const finalPayable = Math.max(0, invoiceAmount - appliedDiscount);
  const remainingCredit = Math.max(0, availableCredit - appliedDiscount);

  return { nominalDiscount, appliedDiscount, finalPayable, remainingCredit };
}

export interface DatabaseProjectBrief {
  id: string;
  projectName: string;
  organizationName: string;
  department: ServiceDepartment;
  scopeTier: "starter" | "growth" | "enterprise";
  budgetAmount: string;
  currency: string;
  timelineWeeks: string;
  clientEmail: string;
  clientPhone?: string;
  briefDetails: string;
  status: "submitted" | "under_review" | "pm_assigned" | "in_progress" | "completed";
  assignedPM: string;
  createdAt: string;
}

export interface DatabaseConsultationRequest {
  id: string;
  fullName: string;
  email: string;
  preferredDate: string;
  focusArea: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface DatabaseTalentApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  primaryDepartment: ServiceDepartment;
  experienceLevel: "Junior" | "Intermediate" | "Senior" | "Lead" | "Elite";
  portfolioUrl: string;
  githubOrBehance?: string;
  hourlyRateExpectation: string;
  availableHoursPerWeek: number;
  bioNotes: string;
  status: "pending_review" | "technical_interview" | "accepted" | "rejected";
  submittedAt: string;
}

export interface DatabasePaymentTransaction {
  id: string;
  reference: string;
  gateway: "paystack" | "flutterwave" | "stripe";
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  purpose: string;
  status: "success" | "pending" | "failed";
  channel: "card" | "bank_transfer" | "ussd" | "apple_pay";
  timestamp: string;
  verifiedByGateway?: boolean;
}

export interface DatabaseAnnouncement {
  id: string;
  title: string;
  badge: string;
  actionText: string;
  actionLink: string;
  active: boolean;
}

export interface ClientReferralRecordLite {
  id: string;
  referrerUserId: string;
  referrerName: string;
  referredUserName: string;
  referredUserEmail: string;
  registeredAt: string;
  status: "pending_payment" | "milestone_funded" | "credited";
  referredProjectTitle?: string;
  fundedAmountNGN?: number;
  fundedAmountUSD?: number;
  discountAppliedNGN: number;
  discountAppliedUSD: number;
  cashbackEarnedNGN: number;
  cashbackEarnedUSD: number;
  fundedAt?: string;
}

// ----------------------------------------------------------------------------
// Lightweight pub/sub + polling so components reflect server-side changes
// without needing a full WebSocket layer. A mutation anywhere notifies
// same-tab subscribers instantly; polling catches changes made by other
// users/tabs/devices. This is an honest "near-real-time", not instant push.
// ----------------------------------------------------------------------------
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const POLL_INTERVAL_MS = 8000;

function useApiList<T>(path: string): T[] {
  const [items, setItems] = useState<T[]>([]);

  const refetch = useCallback(() => {
    api
      .get<Record<string, T[]>>(path)
      .then((body) => {
        const values = Object.values(body)[0];
        setItems(Array.isArray(values) ? values : []);
      })
      .catch(() => setItems([]));
  }, [path]);

  useEffect(() => {
    refetch();
    const unsubscribe = subscribe(refetch);
    const interval = setInterval(refetch, POLL_INTERVAL_MS);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [refetch]);

  return items;
}

export function useBriefs(): DatabaseProjectBrief[] {
  return useApiList<DatabaseProjectBrief>("/briefs");
}

// Client-facing: only the logged-in client's own submitted briefs, never
// anyone else's project data. This is what ClientPortal.tsx uses so a new
// client sees their own (possibly empty) project state instead of a
// hardcoded sample company's data.
export function useMyBriefs(): DatabaseProjectBrief[] {
  return useApiList<DatabaseProjectBrief>("/briefs/mine");
}

export function useConsultationRequests(): DatabaseConsultationRequest[] {
  return useApiList<DatabaseConsultationRequest>("/consultation-requests");
}

export function useTalentApplications(): DatabaseTalentApplication[] {
  return useApiList<DatabaseTalentApplication>("/talent-applications");
}

export function useTransactions(): DatabasePaymentTransaction[] {
  return useApiList<DatabasePaymentTransaction>("/transactions");
}

export function useReferrals(): ClientReferralRecordLite[] {
  return useApiList<ClientReferralRecordLite>("/referrals");
}

// Client-facing: only referrals the logged-in user personally generated.
export function useMyReferrals(): ClientReferralRecordLite[] {
  return useApiList<ClientReferralRecordLite>("/referrals/mine");
}

// Client-facing: only the logged-in user's own payment/escrow history.
export function useMyTransactions(): DatabasePaymentTransaction[] {
  return useApiList<DatabasePaymentTransaction>("/transactions/me");
}

// PM/Admin-only: full internal talent records (real names, rates, bank
// details). This replaces the previous direct `import { VETTED_TALENTS }`
// from mockData.ts, which shipped that data in the public client bundle to
// every anonymous visitor regardless of login state -- the single strongest
// finding from the architecture audit. That data now never leaves the
// server except in response to an authenticated, role-checked request.
export function useInternalTalents(): TalentProfile[] {
  return useApiList<TalentProfile>("/talents/internal");
}

// Public-safe talent directory (pseudonym, tier, skills -- no identity or
// financial fields). Usable from public pages without authentication.
export interface PublicTalentProfile {
  id: string;
  pseudonym: string;
  department: ServiceDepartment;
  tier: string;
  rank: string;
  location: string;
  timezone: string;
  skills: string[];
  tools: string[];
  completedProjects: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  qaPercentageScore: number;
  activeTasks: number;
  academyGraduate: boolean;
  academyBadgeTitle?: string;
  academyCohort?: string;
  verificationStatus: string;
  avatarUrl: string;
  bio: string;
}

export function usePublicTalents(): PublicTalentProfile[] {
  return useApiList<PublicTalentProfile>("/talents");
}

// A logged-in talent's own full profile.
export function useMyTalentProfile(): TalentProfile | null {
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  useEffect(() => {
    api
      .get<{ talent: TalentProfile }>("/talents/me")
      .then((body) => setProfile(body.talent))
      .catch(() => setProfile(null));
  }, []);
  return profile;
}

export function useAnnouncement(): DatabaseAnnouncement | null {
  const [announcement, setAnnouncement] = useState<DatabaseAnnouncement | null>(null);
  const refetch = useCallback(() => {
    api
      .get<{ announcement: DatabaseAnnouncement }>("/announcement")
      .then((body) => setAnnouncement(body.announcement))
      .catch(() => setAnnouncement(null));
  }, []);
  useEffect(() => {
    refetch();
    return subscribe(refetch);
  }, [refetch]);
  return announcement;
}

// ----------------------------------------------------------------------------
// Mutating calls. All of these hit the real backend; dbService is kept as a
// single object purely so call sites didn't all need renaming during this
// migration away from the old localStorage implementation.
// ----------------------------------------------------------------------------
export const dbService = {
  async createBrief(
    data: Omit<DatabaseProjectBrief, "id" | "status" | "assignedPM" | "createdAt">,
  ): Promise<DatabaseProjectBrief> {
    const { brief } = await api.post<{ brief: DatabaseProjectBrief }>("/briefs", data);
    notify();
    return brief;
  },

  // A PM genuinely claiming a brief (replacing the old hardcoded
  // "Auto-assigned PM: Tariq Al-Najeeb" that was stamped on every brief
  // regardless of whether any human PM had looked at it).
  async assignBrief(id: string): Promise<DatabaseProjectBrief> {
    const { brief } = await api.patch<{ brief: DatabaseProjectBrief }>(`/briefs/${id}/assign`);
    notify();
    return brief;
  },

  async createConsultationRequest(
    data: Omit<DatabaseConsultationRequest, "id" | "status" | "createdAt">,
  ): Promise<DatabaseConsultationRequest> {
    const { consultationRequest } = await api.post<{
      consultationRequest: DatabaseConsultationRequest;
    }>("/consultation-requests", data);
    notify();
    return consultationRequest;
  },

  async submitTalentApplication(
    data: Omit<DatabaseTalentApplication, "id" | "status" | "submittedAt">,
  ): Promise<DatabaseTalentApplication> {
    const { talentApplication } = await api.post<{
      talentApplication: DatabaseTalentApplication;
    }>("/talent-applications", data);
    notify();
    return talentApplication;
  },

  // Really creates a login + internal talent profile on the server and
  // returns the one-time temporary password generated for it (there is no
  // outbound email service wired up, so the admin relays this directly to
  // the candidate). Replaces the previous local-only "Approved ✓" state that
  // created nothing.
  async approveTalentApplication(id: string): Promise<{
    user: UserSession;
    talentProfile: TalentProfile;
    temporaryPassword: string;
  }> {
    const result = await api.post<{
      user: UserSession;
      talentProfile: TalentProfile;
      temporaryPassword: string;
    }>(`/talent-applications/${id}/approve`);
    notify();
    return result;
  },

  async rejectTalentApplication(id: string, reason?: string): Promise<DatabaseTalentApplication> {
    const { talentApplication } = await api.post<{ talentApplication: DatabaseTalentApplication }>(
      `/talent-applications/${id}/reject`,
      reason ? { reason } : {},
    );
    notify();
    return talentApplication;
  },

  // Really creates a login for a new internal staff member (PM, ops admin,
  // etc.) and returns its one-time temporary password, for the same reason
  // as above. Replaces the previous "Invite Sent!" UI that created nothing.
  async inviteStaffMember(data: {
    fullName: string;
    email: string;
    role?: UserRole;
  }): Promise<{ user: UserSession; temporaryPassword: string }> {
    const result = await api.post<{ user: UserSession; temporaryPassword: string }>(
      "/admin/invite-staff",
      data,
    );
    notify();
    return result;
  },

  async recordTransaction(data: {
    reference: string;
    gateway: "paystack" | "flutterwave" | "stripe";
    amount: number;
    currency: string;
    customerEmail: string;
    customerName: string;
    purpose: string;
  }): Promise<DatabasePaymentTransaction> {
    const { transaction } = await api.post<{ transaction: DatabasePaymentTransaction }>(
      "/payments/verify",
      data,
    );
    notify();
    return transaction;
  },

  async fundReferral(
    referralId: string,
    paidAmountNGN: number,
    paidAmountUSD: number,
  ): Promise<ClientReferralRecordLite> {
    const { referral } = await api.post<{ referral: ClientReferralRecordLite }>(
      `/referrals/${referralId}/fund`,
      { paidAmountNGN, paidAmountUSD },
    );
    notify();
    return referral;
  },

  async updateAnnouncement(data: { title?: string; active?: boolean }): Promise<void> {
    await api.put("/announcement", data);
    notify();
  },

  async getPayoutBatch(id: string): Promise<PayoutBatch> {
    const { payoutBatches } = await api.get<{ payoutBatches: PayoutBatch[] }>("/payouts");
    const batch = payoutBatches.find((b) => b.id === id);
    if (!batch) throw new Error("Payout batch not found");
    return batch;
  },

  async signPayoutBatch(id: string): Promise<PayoutBatch> {
    const { payoutBatch } = await api.post<{ payoutBatch: PayoutBatch }>(`/payouts/${id}/sign`);
    notify();
    return payoutBatch;
  },

  async disbursePayoutBatch(id: string): Promise<PayoutBatch> {
    const { payoutBatch } = await api.post<{ payoutBatch: PayoutBatch }>(`/payouts/${id}/disburse`);
    notify();
    return payoutBatch;
  },

  async getMilestoneApproval(
    projectId: string,
    milestoneIndex: number,
  ): Promise<MilestoneApproval> {
    const { approval } = await api.get<{ approval: MilestoneApproval }>(
      `/projects/${projectId}/milestones/${milestoneIndex}/approval`,
    );
    return approval;
  },

  async approveQaGate(projectId: string, milestoneIndex: number): Promise<MilestoneApproval> {
    const { approval } = await api.post<{ approval: MilestoneApproval }>(
      `/projects/${projectId}/milestones/${milestoneIndex}/qa-approve`,
    );
    notify();
    return approval;
  },

  async approveMilestoneAsClient(
    projectId: string,
    milestoneIndex: number,
  ): Promise<MilestoneApproval> {
    const { approval } = await api.post<{ approval: MilestoneApproval }>(
      `/projects/${projectId}/milestones/${milestoneIndex}/client-approve`,
    );
    notify();
    return approval;
  },
};

export interface PayoutBatch {
  id: string;
  label: string;
  totalNGN: number;
  approvals: { userId: string; userName: string; role: string; signedAt: string }[];
  disbursed: boolean;
  disbursedAt?: string;
}

export interface MilestoneApproval {
  projectId: string;
  milestoneIndex: number;
  qaApproved: boolean;
  qaApprovedByUserId?: string;
  qaApprovedByName?: string;
  qaApprovedAt?: string;
  milestoneApproved: boolean;
  milestoneApprovedByUserId?: string;
  milestoneApprovedByName?: string;
  milestoneApprovedAt?: string;
}

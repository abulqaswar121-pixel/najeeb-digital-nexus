import { useState, useEffect } from "react";

export interface JourneyState {
  currentStep: number;
  // Stage 1: Brief Submission
  leadSubmitted: boolean;
  leadId: string;
  leadScore: number;
  leadData: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    department: string;
    budget: string;
    overview: string;
    ndaRequested: boolean;
  };

  // Stage 2: Lead Qualification
  leadQualified: boolean;
  assignedPM: string;

  // Stage 3: Proposal Builder
  proposalDrafted: boolean;
  proposalAmountUSD: number;
  proposalAmountNGN: number;
  proposalSentToClient: boolean;

  // Stage 4: Client Review & Deposit
  clientChangeRequested: boolean;
  clientAcceptedProposal: boolean;
  depositPaid: boolean;
  depositTransactionRef: string;

  // Stage 5: Project & Talent Invitation
  projectCreated: boolean;
  projectCode: string;
  invitedTalentId: string;
  invitedTalentPseudonym: string;

  // Stage 6: Talent Acceptance & Work
  talentAcceptedInvite: boolean;
  talentStartedWork: boolean;

  // Stage 7: QA Evaluation & Revision
  deliverableV1Submitted: boolean;
  qaRevisionRequested: boolean;
  qaNotes: string;

  // Stage 8: Deliverable v2.0
  deliverableV2Submitted: boolean;
  latencyBenchmarkMs: number;

  // Stage 9: PM QA Sign-Off
  pmQaApproved: boolean;
  publishedToClientPortal: boolean;

  // Stage 10: Client Milestone Approval
  clientMilestoneApproved: boolean;
  finalInvoiceGenerated: boolean;
  clientReceiptAvailable: boolean;

  // Stage 11: Finance Dual-Approval & Payout
  talentEarningsApproved: boolean;
  payoutBatchNumber: string;
  makerApproved: boolean;
  checkerApproved: boolean;
  payoutDisbursed: boolean;

  // Stage 12: Case Study Nomination & Publication
  caseStudyNominated: boolean;
  clientPublicationConsent: boolean;
  caseStudyPublishedLive: boolean;

  // Stage 13: Academy Bridge
  academyCrossLinkVisited: boolean;
}

export const INITIAL_JOURNEY_STATE: JourneyState = {
  currentStep: 1,
  leadSubmitted: false,
  leadId: "lead-2026-901",
  leadScore: 96,
  leadData: {
    companyName: "Savannah Health Technologies",
    contactName: "Dr. Chinedu Eze",
    contactEmail: "chinedu@savannahhealth.io",
    department: "web_app_development",
    budget: "$35,000 - $50,000 USD",
    overview:
      "High-speed clinical lab reporting platform with sub-300ms verification and NDPR compliance.",
    ndaRequested: true,
  },

  leadQualified: false,
  assignedPM: "NDH PM Team",

  proposalDrafted: false,
  proposalAmountUSD: 42000,
  proposalAmountNGN: 63000000,
  proposalSentToClient: false,

  clientChangeRequested: false,
  clientAcceptedProposal: false,
  depositPaid: false,
  depositTransactionRef: "PSTK-TXN-2026-99482",

  projectCreated: false,
  projectCode: "NDH-2026-104",
  invitedTalentId: "tal-001",
  // Pseudonym only -- this walkthrough's own narrative (step 13) claims
  // "Zero Data Leakage Certified" for talent anonymization, so it should not
  // itself display a talent's real name next to their pseudonym.
  invitedTalentPseudonym: "Architect-Alpha",

  talentAcceptedInvite: false,
  talentStartedWork: false,

  deliverableV1Submitted: false,
  qaRevisionRequested: false,
  qaNotes:
    "Please optimize edge bundle latency and ensure zero client identity leakage in API responses.",

  deliverableV2Submitted: false,
  latencyBenchmarkMs: 275,

  pmQaApproved: false,
  publishedToClientPortal: false,

  clientMilestoneApproved: false,
  finalInvoiceGenerated: false,
  clientReceiptAvailable: false,

  talentEarningsApproved: false,
  payoutBatchNumber: "NDH-PAY-2026-W40",
  makerApproved: false,
  checkerApproved: false,
  payoutDisbursed: false,

  caseStudyNominated: false,
  clientPublicationConsent: false,
  caseStudyPublishedLive: false,

  academyCrossLinkVisited: false,
};

let globalState: JourneyState = { ...INITIAL_JOURNEY_STATE };
const listeners = new Set<(state: JourneyState) => void>();

export const getJourneyState = (): JourneyState => globalState;

export const setJourneyState = (
  updater: Partial<JourneyState> | ((prev: JourneyState) => JourneyState),
) => {
  if (typeof updater === "function") {
    globalState = updater(globalState);
  } else {
    globalState = { ...globalState, ...updater };
  }
  listeners.forEach((l) => l(globalState));
};

export const resetJourneyState = () => {
  globalState = { ...INITIAL_JOURNEY_STATE };
  listeners.forEach((l) => l(globalState));
};

export const useJourneyState = () => {
  const [state, setState] = useState<JourneyState>(globalState);

  useEffect(() => {
    const handler = (newState: JourneyState) => setState(newState);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return {
    state,
    updateState: setJourneyState,
    resetState: resetJourneyState,
  };
};

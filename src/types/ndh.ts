export type DesignDirectionId = 'direction-a' | 'direction-b' | 'direction-c' | 'hybrid_blend';

export type UserRole =
  | 'super_admin'
  | 'ops_admin'
  | 'dept_lead'
  | 'finance_admin'
  | 'content_admin'
  | 'talent_admin'
  | 'support_admin'
  | 'project_manager'
  | 'talent'
  | 'client_owner'
  | 'client_admin'
  | 'client_billing'
  | 'client_reviewer'
  | 'client_viewer';

export type TalentTier = 'Junior' | 'Intermediate' | 'Senior' | 'Lead' | 'Elite';

export type ServiceDepartment =
  | 'brand_strategy'
  | 'ui_ux_design'
  | 'web_app_development'
  | 'ecommerce'
  | 'content_copywriting'
  | 'digital_marketing'
  | 'social_media'
  | 'video_media'
  | 'data_business'
  | 'ai_automation';

export interface ServiceDepartmentInfo {
  id: ServiceDepartment;
  name: string;
  tagline: string;
  description: string;
  leadName: string;
  leadTitle: string;
  activeTalentsCount: number;
  averageTurnaroundDays: number;
  capabilities: string[];
  deliverables: string[];
  techStack: string[];
  startingBudgetUSD: number;
  startingBudgetNGN: number;
  iconName: string;
}

export interface ClientOrganization {
  id: string;
  name: string;
  legalEntity: string;
  country: string;
  city: string;
  industry: string;
  tier: 'Growth' | 'Enterprise' | 'Global Sovereign';
  billingCurrency: 'USD' | 'NGN' | 'GBP';
  activeProjectsCount: number;
  totalSpentUSD: number;
  totalSpentNGN: number;
  primaryContact: {
    name: string;
    role: string;
    email: string;
    avatarUrl: string;
  };
  teamMembersCount: number;
  ndaSigned: boolean;
  ndaSignedDate?: string;
  avatar: string;
}

export interface TalentProfile {
  id: string;
  pseudonym: string;
  fullName: string;
  department: ServiceDepartment;
  tier: TalentTier;
  location: string;
  timezone: string;
  skills: string[];
  tools: string[];
  completedProjects: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  activeTasks: number;
  hourlyRateInternalUSD: number;
  totalEarnedUSD: number;
  totalEarnedNGN: number;
  academyGraduate: boolean;
  academyBadgeTitle?: string;
  academyCohort?: string;
  verificationStatus: 'verified' | 'vetting_stage_3' | 'onboarding';
  ndaSigned: boolean;
  avatarUrl: string;
  bio: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  isAnonymized: boolean;
  industry: string;
  department: ServiceDepartment;
  year: string;
  location: string;
  projectDuration: string;
  heroImage: string;
  galleryImages: string[];
  challenge: string;
  insight: string;
  strategy: string;
  process: string;
  solution: string;
  measurableOutcomes: {
    metric: string;
    label: string;
    evidenceNote: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    title: string;
    company: string;
    verifiedNDH: boolean;
  };
  techStack: string[];
  featured: boolean;
  status: 'published' | 'review' | 'scheduled' | 'confidential_preview';
  clientApprovalRecorded: boolean;
  publishedDate: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  department: ServiceDepartment;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'in_qa' | 'in_client_review' | 'approved' | 'revision_requested';
  clientCostUSD: number;
  clientCostNGN: number;
  talentAllocationUSD: number;
  assignedTalentId: string;
  assignedTalentPseudonym: string;
  qaScore?: number;
  deliverableFileCount: number;
  latestDeliverableVersion?: string;
}

export interface DeliverableFile {
  id: string;
  milestoneId: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  version: string;
  uploadedAt: string;
  uploadedByPseudonym: string;
  qaApprovedByPM: boolean;
  clientApproved: boolean;
  downloadUrl: string;
  watermarkPreview: boolean;
  revisionNotes?: string;
}

export interface Project {
  id: string;
  code: string;
  title: string;
  organizationId: string;
  organizationName: string;
  department: ServiceDepartment;
  assignedPMId: string;
  assignedPMName: string;
  assignedPMAvatar: string;
  status: 'triage' | 'proposal_review' | 'active_sprint' | 'qa_review' | 'client_review' | 'completed' | 'on_hold';
  healthScore: 'healthy' | 'needs_attention' | 'at_risk';
  healthReason?: string;
  progressPercentage: number;
  startDate: string;
  targetEndDate: string;
  totalClientBudgetUSD: number;
  totalClientBudgetNGN: number;
  totalTalentCostUSD: number;
  grossMarginPercentage: number;
  currency: 'USD' | 'NGN' | 'GBP';
  milestones: ProjectMilestone[];
  unreadClientMessagesCount: number;
  unreadTalentMessagesCount: number;
  ndaStatus: 'executed' | 'pending';
  lastActivity: string;
}

export interface Lead {
  id: string;
  createdAt: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  country: string;
  department: ServiceDepartment;
  budgetRange: string;
  timeline: string;
  projectOverview: string;
  ndaRequested: boolean;
  score: number;
  qualificationStage: 'inbox' | 'qualified' | 'proposal_drafted' | 'negotiation' | 'converted' | 'archived';
  assignedPMId?: string;
  assignedPMName?: string;
  source: 'Organic Search' | 'NDH Academy Referral' | 'Executive Network' | 'Clutch' | 'Direct';
}

export interface FinancialInvoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectTitle: string;
  organizationName: string;
  amountUSD: number;
  amountNGN: number;
  currency: 'USD' | 'NGN' | 'GBP';
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'reconciled';
  dueDate: string;
  paidDate?: string;
  paymentGateway: 'Paystack' | 'Flutterwave' | 'Stripe' | 'Direct Wire (Escrow)';
  milestoneTitle: string;
}

export interface TalentPayoutBatch {
  id: string;
  batchNumber: string;
  weekEnding: string;
  totalAmountUSD: number;
  totalAmountNGN: number;
  talentsCount: number;
  status: 'draft' | 'pending_dual_approval' | 'approved' | 'disbursed';
  primaryApproverName: string;
  secondaryApproverName?: string;
  payoutMethod: 'Nigerian Bank Settlement (NIBSS)' | 'Wise International' | 'Crypto (USDC)';
  auditHash: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  ipAddress: string;
  location: string;
  severity: 'low' | 'medium' | 'critical';
}

export interface UserSession {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  organizationId?: string;
  organizationName?: string;
  avatarUrl: string;
  isDemoAccount: boolean;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
  structuredData?: any;
}

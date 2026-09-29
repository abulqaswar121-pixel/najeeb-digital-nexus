import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Layers,
  ShieldCheck,
  Database,
  Sparkles,
  GitBranch,
  Lightbulb,
  CheckCircle2,
  Lock,
  DollarSign,
  Users,
  Briefcase,
  Terminal,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface ArchitecturalBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitecturalBlueprintModal: React.FC<ArchitecturalBlueprintModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'map' | 'permissions' | 'datamodel' | 'directions' | 'demo_plan' | 'suggestions'>('map');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-5xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">NDH Agency • Enterprise Architectural Blueprint</h2>
              <p className="text-xs text-muted-foreground">Complete Product Architecture & Governance Specifications</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-6 py-2.5 border-b border-border bg-background flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar text-xs">
          {[
            { id: 'map', label: 'A. Product Map', icon: <Layers className="w-4 h-4" /> },
            { id: 'permissions', label: 'B. Permission Matrix', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'datamodel', label: 'C. PostgreSQL Data Model', icon: <Database className="w-4 h-4" /> },
            { id: 'directions', label: 'D. Three Design Directions', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'demo_plan', label: 'E. Clickable Demo Plan', icon: <GitBranch className="w-4 h-4" /> },
            { id: 'suggestions', label: 'F. Strategic Suggested Additions', icon: <Lightbulb className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-foreground flex-1">
          {/* SECTION A: PRODUCT MAP */}
          {activeSection === 'map' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">A. Master Product Map & Domain Architecture</h3>
                <p className="text-muted-foreground leading-relaxed">
                  NDH Agency is engineered as a high-integrity <strong>Managed Digital Services Bureau</strong>. Clients contract NDH Agency; NDH assigns vetted talents; dedicated Project Managers control scope, QA, and communication. Clients and talents never communicate directly or access confidential pricing margins.
                </p>
              </div>

              {/* Domain & Deployment Boundaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="flex items-center gap-2 font-bold text-primary">
                    <Layers className="w-4 h-4" />
                    <span>NDH Agency (agency.ndh.com.ng)</span>
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Public Marketing, Services Showcase & Flagship Case Studies</li>
                    <li>• Client Operations Workspace (Multi-Org, Milestones, Invoices, PM Chat)</li>
                    <li>• PM Operations Command (Lead Triage, Talent Matcher, QA Gates)</li>
                    <li>• Talent Private Network (Sprint Tasks, Deliverables, Earnings Ledger)</li>
                    <li>• Super/Ops/Finance/Content Admin Command Center</li>
                    <li>• Footer Cross-Link: <em>"Looking to build your skills? Explore NDH Academy."</em></li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-500">
                    <BookOpen className="w-4 h-4" />
                    <span>NDH Academy (academy.ndh.com.ng)</span>
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Independent Codebase, Separate Database & Separate Product</li>
                    <li>• Courses, Cohorts, Certifications, Student LMS, Exams</li>
                    <li>• Footer Cross-Link: <em>"Need a professional team? Work with NDH Agency."</em></li>
                    <li>• Clean Decoupled Integration Contract: Cryptographic Graduate Verification Badge</li>
                    <li>• Zero Student LMS Data Leakage into Agency Client Accounts</li>
                  </ul>
                </div>
              </div>

              {/* 10 Core Service Departments */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                <h4 className="font-bold text-sm text-foreground">Ten Core Service Departments:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-background border border-border">1. Brand Strategy & Identity</div>
                  <div className="p-2 rounded bg-background border border-border">2. Product & UI/UX Design</div>
                  <div className="p-2 rounded bg-background border border-border">3. Web & App Development</div>
                  <div className="p-2 rounded bg-background border border-border">4. AI Solutions & Automation</div>
                  <div className="p-2 rounded bg-background border border-border">5. E-commerce & Funnels</div>
                  <div className="p-2 rounded bg-background border border-border">6. Digital Marketing & Growth</div>
                  <div className="p-2 rounded bg-background border border-border">7. Content Writing & Copy</div>
                  <div className="p-2 rounded bg-background border border-border">8. Social Media & Community</div>
                  <div className="p-2 rounded bg-background border border-border">9. Video, Motion & 3D</div>
                  <div className="p-2 rounded bg-background border border-border">10. Data, Research & Support</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION B: PERMISSION MATRIX */}
          {activeSection === 'permissions' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">B. Enterprise Role-Based Access Control (RBAC) Matrix</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every operation is enforced server-side. Strict privacy boundaries isolate talent identities from clients and hide financial margins from talents.
                </p>
              </div>

              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead className="bg-muted text-foreground font-semibold">
                    <tr>
                      <th className="p-2.5 border-b border-border">Role</th>
                      <th className="p-2.5 border-b border-border">Client Identity</th>
                      <th className="p-2.5 border-b border-border">Talent Identity</th>
                      <th className="p-2.5 border-b border-border">Client Revenue</th>
                      <th className="p-2.5 border-b border-border">Talent Pay</th>
                      <th className="p-2.5 border-b border-border">Margin %</th>
                      <th className="p-2.5 border-b border-border">Direct Chat Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-2.5 font-bold text-primary">Super Admin</td>
                      <td className="p-2.5 text-emerald-500">Full Access</td>
                      <td className="p-2.5 text-emerald-500">Full Access</td>
                      <td className="p-2.5 text-emerald-500">Full Access</td>
                      <td className="p-2.5 text-emerald-500">Full Access</td>
                      <td className="p-2.5 text-emerald-500">Visible</td>
                      <td className="p-2.5">Global System Audits</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-primary">Finance Admin</td>
                      <td className="p-2.5 text-emerald-500">Billing View</td>
                      <td className="p-2.5 text-emerald-500">Payout Ledger</td>
                      <td className="p-2.5 text-emerald-500">Invoices/Receipts</td>
                      <td className="p-2.5 text-emerald-500">Payout Batches</td>
                      <td className="p-2.5 text-emerald-500">Visible</td>
                      <td className="p-2.5">Internal Finance Channels</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-blue-400">Project Manager</td>
                      <td className="p-2.5 text-emerald-500">Full Client Org</td>
                      <td className="p-2.5 text-emerald-500">Vetted Pool (Full)</td>
                      <td className="p-2.5 text-emerald-500">Project Scope</td>
                      <td className="p-2.5 text-emerald-500">Talent Budget</td>
                      <td className="p-2.5 text-emerald-500">Visible</td>
                      <td className="p-2.5 text-blue-400">Client Chat + Talent Chat (Separate)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-500">Client Owner/Admin</td>
                      <td className="p-2.5 text-emerald-500">Own Org Data</td>
                      <td className="p-2.5 text-red-500 font-bold">REDACTED / Anonymized</td>
                      <td className="p-2.5 text-emerald-500">Own Invoices</td>
                      <td className="p-2.5 text-red-500 font-bold">HIDDEN</td>
                      <td className="p-2.5 text-red-500 font-bold">HIDDEN</td>
                      <td className="p-2.5 text-emerald-500">Assigned PM Only</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-purple-400">Talent (All Tiers)</td>
                      <td className="p-2.5 text-red-500 font-bold">REDACTED / Code Only</td>
                      <td className="p-2.5 text-emerald-500">Own Profile</td>
                      <td className="p-2.5 text-red-500 font-bold">HIDDEN</td>
                      <td className="p-2.5 text-emerald-500">Own Fixed Pay</td>
                      <td className="p-2.5 text-red-500 font-bold">HIDDEN</td>
                      <td className="p-2.5 text-purple-400">Assigned PM Only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION C: DATA MODEL */}
          {activeSection === 'datamodel' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">C. PostgreSQL Data Model & Relational Schema</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Engineered with PostgreSQL versioned migrations, Zod runtime validation, foreign keys, and cryptographic audit records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="font-bold text-primary">Table: `organizations`</div>
                  <pre className="text-muted-foreground text-[10px] overflow-x-auto">
{`id UUID PRIMARY KEY,
name VARCHAR(255) NOT NULL,
legal_entity VARCHAR(255),
country VARCHAR(100),
tier VARCHAR(50) DEFAULT 'Growth',
billing_currency VARCHAR(10) DEFAULT 'USD',
nda_signed BOOLEAN DEFAULT false,
nda_signed_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT now()`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="font-bold text-primary">Table: `projects`</div>
                  <pre className="text-muted-foreground text-[10px] overflow-x-auto">
{`id UUID PRIMARY KEY,
code VARCHAR(50) UNIQUE NOT NULL,
organization_id UUID REFERENCES organizations(id),
department_id VARCHAR(50) NOT NULL,
assigned_pm_id UUID REFERENCES users(id),
status VARCHAR(50) NOT NULL,
client_budget_usd NUMERIC(12,2),
client_budget_ngn NUMERIC(15,2),
talent_cost_cap_usd NUMERIC(12,2),
gross_margin_pct NUMERIC(5,2),
health_score VARCHAR(20) DEFAULT 'healthy',
created_at TIMESTAMPTZ DEFAULT now()`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="font-bold text-primary">Table: `milestones`</div>
                  <pre className="text-muted-foreground text-[10px] overflow-x-auto">
{`id UUID PRIMARY KEY,
project_id UUID REFERENCES projects(id),
title VARCHAR(255) NOT NULL,
client_cost_usd NUMERIC(12,2),
talent_allocation_usd NUMERIC(12,2),
assigned_talent_id UUID REFERENCES talents(id),
status VARCHAR(50) NOT NULL,
qa_approved_by_pm BOOLEAN DEFAULT false,
client_approved BOOLEAN DEFAULT false,
due_date DATE NOT NULL`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="font-bold text-primary">Table: `finance_payout_batches`</div>
                  <pre className="text-muted-foreground text-[10px] overflow-x-auto">
{`id UUID PRIMARY KEY,
batch_number VARCHAR(50) UNIQUE NOT NULL,
week_ending DATE NOT NULL,
total_usd NUMERIC(12,2) NOT NULL,
total_ngn NUMERIC(15,2) NOT NULL,
maker_approver_id UUID REFERENCES users(id),
checker_approver_id UUID REFERENCES users(id),
status VARCHAR(50) DEFAULT 'draft',
audit_hash VARCHAR(255) NOT NULL`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* SECTION D: THREE DESIGN DIRECTIONS */}
          {activeSection === 'directions' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">D. Comparative Design Directions Evaluation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Three genuinely different visual languages crafted for distinct market contexts and client personas.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-blue-400">Direction A: Sovereign Neo-Precision (Architectural Tech-Elegance)</h4>
                    <span className="font-mono text-[10px] bg-blue-950 px-2 py-0.5 rounded text-blue-300">Obsidian / Sapphire HUD</span>
                  </div>
                  <p className="text-muted-foreground">
                    Commands instant authority with global CTOs, venture scale-ups, and fintechs. High-density telemetry ribbons, cryptographic verification badges, and dark slate canvases.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-400">Direction B: Pan-African Vanguard & Luxury (Editorial Modern Warmth)</h4>
                    <span className="font-mono text-[10px] bg-amber-950 px-2 py-0.5 rounded text-amber-300">Warm Alabaster / Terracotta</span>
                  </div>
                  <p className="text-muted-foreground">
                    Celebrates African creative excellence, bespoke typography (editorial serif titles), and human craft storytelling. Perfect for luxury commerce, conglomerates, and sovereign public institutions.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-400">Direction C: Hyper-Systemic Kinetic (Modular Linear Speed)</h4>
                    <span className="font-mono text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">Stark Zinc / Bento Grid</span>
                  </div>
                  <p className="text-muted-foreground">
                    High-throughput operating system inspired by modern engineering tools (Linear, Raycast). Keyboard shortcuts, zero friction, and high operational velocity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION E: CLICKABLE DEMO PLAN */}
          {activeSection === 'demo_plan' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">E. Thirteen-Stage Clickable Demo Journey</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The primary end-to-end journey that proves the entire operating system lifecycle from visitor brief to case study publication:
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  '1. Visitor explores work, selects service department, and submits structured brief with budget & NDA request.',
                  '2. Ops Admin receives brief in Lead Inbox, evaluates AI quality score (94+), and routes to department PM.',
                  '3. PM generates formal scope proposal with milestone breakdown, currencies (USD/NGN), and NDA terms.',
                  '4. Client reviews proposal in Client Portal, requests minor scope revision, accepts, and funds deposit invoice.',
                  '5. PM converts approved proposal into active sprint project and privately shortlists vetted talents based on skills & tier.',
                  '6. Talent receives private task invite (with anonymized project code), accepts, and starts sprint work.',
                  '7. Talent submits deliverable v1.0 and logs notes; PM runs QA evaluation and requests a refinement.',
                  '8. Talent submits deliverable v2.0 with latency benchmarks (<300ms) and type-safe verification.',
                  '9. PM approves QA Gate and formally presents deliverable package into Client Workspace.',
                  '10. Client reviews deliverable package, executes formal milestone sign-off, and receives settlement receipt.',
                  '11. Finance Admin reviews talent earnings ledger, executes Dual-Approval (Maker/Checker), and queues NIBSS payout batch.',
                  '12. Content Admin nominates project for Case Study, obtains client publication consent, and publishes to public work gallery.',
                  '13. Visitor navigates to NDH Academy via discreet footer cross-link without mixing agency data with academy LMS.',
                ].map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-background border border-border flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION F: SUGGESTIONS */}
          {activeSection === 'suggestions' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">F. Strategic Value Suggestions for NDH Platform</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Categorized into Essential safeguards, High-Value operational accelerations, and Future horizon opportunities:
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                  <h4 className="font-bold text-primary">1. Essential Safeguards (Must-Have for Production)</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>PII & Margin Firewall:</strong> Automated regex and NLP filter on all in-app chat payloads that strips email addresses, phone numbers, and raw rate mentions.</li>
                    <li>• <strong>Dual-Approval Payout Thresholds:</strong> Mandatory two-signature requirement for payout batches over ₦10,000,000 / $10,000.</li>
                    <li>• <strong>Watermarked File Previews:</strong> Automatic rasterized watermarks on unapproved draft deliverables until client milestone funding clears.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-emerald-400">2. High-Value Operational Accelerations</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Algorithmic Talent Fit Ranker:</strong> Multi-factor scoring weighting skills, past delivery timeliness, tier rating, and timezone overlap.</li>
                    <li>• <strong>Client Re-Order & Retainer Subscriptions:</strong> One-click recurring sprint retainers with pre-authorized card billing via Paystack / Stripe.</li>
                    <li>• <strong>Automated Milestone Escrow Reconciliation:</strong> Live webhook updates connecting Paystack / Flutterwave virtual accounts to milestone unlocks.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <h4 className="font-bold text-amber-400">3. Future Horizon Opportunities</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>NDH Sovereign Multi-Region Cloud:</strong> Private cloud nodes in Lagos, London, and Johannesburg for sub-20ms edge delivery.</li>
                    <li>• <strong>Cryptographic Talent Credential Ledger:</strong> Verifiable soulbound tokens proving completed NDH Agency enterprise sprints without breaching NDAs.</li>
                    <li>• <strong>AI-Assisted Brief Decomposition:</strong> Automatically drafts initial user stories, milestone estimates, and test cases for PM review.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/40 flex items-center justify-between shrink-0">
          <span className="text-xs text-muted-foreground">NDH Agency Architecture Specification v1.0 • Ready for Production Development</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};

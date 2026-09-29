import React, { useState } from 'react';
import { DesignDirectionId } from '../../../types/ndh';
import { DIRECTION_CONFIGS } from '../DirectionStyles';
import {
  SECURITY_AUDIT_LOGS,
  SERVICE_DEPARTMENTS,
} from '../../../data/mockData';
import {
  Sliders,
  ShieldAlert,
  Link2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface AdminCommandPreviewProps {
  direction: DesignDirectionId;
}

export const AdminCommandPreview: React.FC<AdminCommandPreviewProps> = ({ direction }) => {
  const config = DIRECTION_CONFIGS[direction];
  const [adminRole, setAdminRole] = useState<'super_admin' | 'ops_admin' | 'finance_admin' | 'cms_links'>('super_admin');
  const [dualApprovalSigned, setDualApprovalSigned] = useState<boolean>(false);
  const [caseStudyPublished, setCaseStudyPublished] = useState<boolean>(false);

  return (
    <div className={`min-h-screen ${config.containerBg} py-8 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Command Header & Role Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-bold text-lg">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">NDH Agency Command Nexus</h1>
                <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-mono text-[10px] font-bold border border-red-500/20">
                  Role: {adminRole.replace('_', ' ').toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px]">
                  Encrypted Session
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Multi-Tenant Governance • Dual-Approval Financial Safeguards • Immutable Audit Logs
              </p>
            </div>
          </div>

          {/* Admin Role Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-background p-1.5 rounded-xl border border-border">
            {[
              { id: 'super_admin', label: 'Super Admin' },
              { id: 'ops_admin', label: 'Ops Command' },
              { id: 'finance_admin', label: 'Finance & Payouts' },
              { id: 'cms_links', label: 'CMS & Deep Links' },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setAdminRole(role.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  adminRole === role.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Super Admin View */}
        {adminRole === 'super_admin' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-1`}>
                <div className="text-xs text-muted-foreground">Platform GMV (Q3 2026)</div>
                <div className={`text-2xl ${config.statValue}`}>$188,500 USD</div>
                <div className="text-[10px] text-emerald-400 font-mono">+34% vs Q2 2026</div>
              </div>

              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-1`}>
                <div className="text-xs text-muted-foreground">Active Vetted Talent Pool</div>
                <div className="text-2xl font-bold font-mono text-foreground">140 Talents</div>
                <div className="text-[10px] text-muted-foreground">10 Specialized Departments</div>
              </div>

              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-1`}>
                <div className="text-xs text-muted-foreground">Average Agency Gross Margin</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">61.2%</div>
                <div className="text-[10px] text-muted-foreground">Confidential from talents & clients</div>
              </div>

              <div className={`p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-1`}>
                <div className="text-xs text-muted-foreground">NDH Academy Decoupled Bridge</div>
                <div className="text-2xl font-bold font-mono text-primary">Connected</div>
                <div className="text-[10px] text-emerald-400 font-mono">Zero Database Leakage Verified</div>
              </div>
            </div>

            {/* Security Audit Log Stream */}
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-4`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Immutable Security Audit Trail</h3>
                </div>
                <span className="text-xs font-mono text-muted-foreground">Real-Time Event Stream</span>
              </div>

              <div className="space-y-3">
                {SECURITY_AUDIT_LOGS.map((log) => {
                  const parts = log.timestamp.split('T');
                  const timePart = parts[1] ? parts[1].replace('Z', '') : log.timestamp;
                  return (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-background border border-border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-primary">{log.actorName}</span>
                          <span className="px-1.5 py-0.2 rounded bg-muted text-[10px] font-mono text-muted-foreground uppercase">
                            {log.actorRole}
                          </span>
                          {log.severity === 'critical' && (
                            <span className="px-1.5 py-0.2 rounded bg-red-500/10 text-red-500 font-mono text-[10px] font-bold">
                              Security Boundary Trigger
                            </span>
                          )}
                        </div>
                        <p className="text-foreground">{log.action}</p>
                      </div>

                      <div className="text-right text-[11px] font-mono text-muted-foreground shrink-0">
                        <div>{timePart} UTC</div>
                        <div>{log.location}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. Operations Admin View */}
        {adminRole === 'ops_admin' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-6`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="font-bold text-base text-foreground">Department Capacity & Workload Allocation</h3>
                <span className="text-xs text-muted-foreground">10 Managed Service Hubs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICE_DEPARTMENTS.slice(0, 6).map((dept) => (
                  <div key={dept.id} className="p-4 rounded-xl bg-background border border-border space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{dept.name}</span>
                      <span className="text-primary font-mono text-[11px]">{dept.activeTalentsCount} Talents</span>
                    </div>
                    <div className="text-muted-foreground">Lead: {dept.leadName} ({dept.leadTitle})</div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40">
                      <span className="text-muted-foreground">SLA Turnaround:</span>
                      <span className="font-mono text-emerald-400 font-bold">{dept.averageTurnaroundDays} Days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Finance Admin View & Dual-Approval */}
        {adminRole === 'finance_admin' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-6 shadow-xl`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-500">Maker / Checker Safeguard</span>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    Talent Payout Batch: NDH-PAY-2026-W40
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    11 Talents • Weekly Scheduled Disbursement via Nigerian Inter-Bank Settlement System (NIBSS)
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl ${config.statValue}`}>$24,600 USD</div>
                  <div className="text-xs text-muted-foreground font-mono">₦36,900,000 NGN Batch Total</div>
                </div>
              </div>

              {/* Dual-Approval Sign-off Box */}
              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground text-sm">Dual-Approval Protocol Required</h4>
                    <p className="text-muted-foreground">
                      Financial compliance policy requires two distinct authorized signatures before releasing talent payout batches over ₦10,000,000.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-background border border-border flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">Maker Signature:</div>
                      <div className="text-muted-foreground">Amina Yusuf (Finance Admin)</div>
                    </div>
                    <span className="text-emerald-500 font-mono text-xs">Signed ✓</span>
                  </div>

                  <div className="p-3 rounded-lg bg-background border border-border flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">Checker Signature:</div>
                      <div className="text-muted-foreground">
                        {dualApprovalSigned ? 'Najeeb Al-Hassan (Managing Director)' : 'Awaiting 2nd Approval'}
                      </div>
                    </div>
                    <span className={`font-mono text-xs ${dualApprovalSigned ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {dualApprovalSigned ? 'Approved ✓' : 'Pending Sign'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setDualApprovalSigned(true)}
                    disabled={dualApprovalSigned}
                    className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      dualApprovalSigned ? 'bg-emerald-600 text-white cursor-default' : config.accentBtn
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{dualApprovalSigned ? 'Batch Approved & Transmitted to NIBSS ✓' : 'Execute Dual-Approval Sign-off'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. CMS & Deep Links View */}
        {adminRole === 'cms_links' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-6`}>
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="font-bold text-base text-foreground">Case Study CMS & Link Management</h3>
                <span className="text-xs text-muted-foreground">Publication Approval Chain</span>
              </div>

              {/* Case Study Nomination & Publishing Gate */}
              <div className="p-5 rounded-xl bg-background border border-border space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-primary font-mono text-[10px] uppercase font-bold">New Nomination</span>
                    <h4 className="font-bold text-sm text-foreground mt-0.5">
                      Apex Logistics: Autonomous Dispatch & Freight Tracking System
                    </h4>
                    <p className="text-muted-foreground">
                      Client approval recorded • Confidentiality anonymization verified
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-mono text-[10px]">
                    Draft Review
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <span className="text-muted-foreground">Canonical URL: https://agency.ndh.com.ng/work/apex-logistics</span>
                  <button
                    onClick={() => setCaseStudyPublished(true)}
                    disabled={caseStudyPublished}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                      caseStudyPublished ? 'bg-emerald-600 text-white cursor-default' : config.accentBtn
                    }`}
                  >
                    {caseStudyPublished ? 'Case Study Published Live ✓' : 'Approve & Publish Case Study'}
                  </button>
                </div>
              </div>

              {/* Cross-Link Bridge Specification */}
              <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Link2 className="w-4 h-4 text-primary" />
                  <span>NDH Academy Cross-Domain Bridge Spec</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Agency footer: <code className="text-foreground">"Looking to build your skills? Explore NDH Academy."</code> (https://academy.ndh.com.ng)
                  <br />
                  Academy footer: <code className="text-foreground">"Need a professional team? Work with NDH Agency."</code> (https://agency.ndh.com.ng)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

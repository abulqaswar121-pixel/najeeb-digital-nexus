import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import {
  SECURITY_AUDIT_LOGS,
  SERVICE_DEPARTMENTS,
  ACTIVE_PROJECTS,
} from '../../data/mockData';
import {
  Sliders,
  ShieldAlert,
  Link2,
  CheckCircle2,
  Lock,
  DollarSign,
  Layers,
  Users,
  Award,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { user } = useAuth();
  const [adminRole, setAdminRole] = useState<'super_admin' | 'ops_admin' | 'finance_admin' | 'cms_links'>('super_admin');
  const [dualApprovalSigned, setDualApprovalSigned] = useState<boolean>(false);
  const [caseStudyPublished, setCaseStudyPublished] = useState<boolean>(false);

  return (
    <div className="bg-[#080C14] text-[#F1F5F9] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Command Header & Role Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-xl">
              <Sliders className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">NDH Command Nexus</h1>
                <span className="px-2.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono text-[10px] font-bold border border-red-500/20">
                  {user?.roleTitle || 'Super Admin'}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                  Encrypted Session
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Multi-Tenant Governance • Dual-Approval Financial Safeguards • Immutable Audit Logs
              </p>
            </div>
          </div>

          {/* Admin Sub-Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
            {[
              { id: 'super_admin', label: 'Super Admin' },
              { id: 'ops_admin', label: 'Ops Command' },
              { id: 'finance_admin', label: 'Finance & Payouts' },
              { id: 'cms_links', label: 'CMS & Deep Links' },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setAdminRole(role.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                  adminRole === role.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
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
              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                <span className="text-xs text-slate-400">Platform GMV (Q3 2026)</span>
                <div className="text-2xl font-bold font-mono text-white">$188,500 USD</div>
                <div className="text-[10px] text-emerald-400 font-mono">+34% vs Q2 2026</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                <span className="text-xs text-slate-400">Active Vetted Talent Pool</span>
                <div className="text-2xl font-bold font-mono text-white">140 Talents</div>
                <div className="text-[10px] text-slate-400">10 Specialized Departments</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                <span className="text-xs text-slate-400">Average Gross Margin</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">61.2%</div>
                <div className="text-[10px] text-slate-400">Confidential from talents & clients</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-blue-900/40 space-y-1">
                <span className="text-xs text-slate-400">NDH Academy Decoupled Bridge</span>
                <div className="text-2xl font-bold font-mono text-blue-400">Connected</div>
                <div className="text-[10px] text-emerald-400 font-mono">Zero Database Leakage Verified</div>
              </div>
            </div>

            {/* Security Audit Log Stream */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-sm text-white">Immutable Security Audit Trail</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Real-Time Event Stream</span>
              </div>

              <div className="space-y-3">
                {SECURITY_AUDIT_LOGS.map((log) => {
                  const parts = log.timestamp.split('T');
                  const timePart = parts[1] ? parts[1].replace('Z', '') : log.timestamp;
                  return (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-blue-400">{log.actorName}</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                            {log.actorRole}
                          </span>
                          {log.severity === 'critical' && (
                            <span className="px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 font-mono text-[10px] font-bold">
                              Security Boundary Trigger
                            </span>
                          )}
                        </div>
                        <p className="text-slate-200">{log.action}</p>
                      </div>

                      <div className="text-right text-[11px] font-mono text-slate-500 shrink-0">
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
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">Department Capacity & Workload Allocation</h3>
                <span className="text-xs text-slate-400">10 Managed Service Hubs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICE_DEPARTMENTS.slice(0, 6).map((dept) => (
                  <div key={dept.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{dept.name}</span>
                      <span className="text-blue-400 font-mono text-[11px]">{dept.activeTalentsCount} Talents</span>
                    </div>
                    <div className="text-slate-400">Lead: {dept.leadName} ({dept.leadTitle})</div>
                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
                      <span className="text-slate-400">SLA Turnaround:</span>
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
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Maker / Checker Safeguard</span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    Talent Payout Batch: NDH-PAY-2026-W40
                  </h3>
                  <p className="text-xs text-slate-400">
                    11 Talents • Weekly Scheduled Disbursement via Nigerian Inter-Bank Settlement System (NIBSS)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-emerald-400">$24,600 USD</div>
                  <div className="text-xs text-slate-400 font-mono">₦36,900,000 NGN Batch Total</div>
                </div>
              </div>

              {/* Dual-Approval Sign-off Box */}
              <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">Dual-Approval Protocol Required</h4>
                    <p className="text-slate-300">
                      Financial compliance policy requires two distinct authorized signatures before releasing talent payout batches over ₦10,000,000.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Maker Signature:</div>
                      <div className="text-slate-400">Amina Yusuf (Finance Admin)</div>
                    </div>
                    <span className="text-emerald-400 font-mono text-xs">Signed ✓</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Checker Signature:</div>
                      <div className="text-slate-400">
                        {dualApprovalSigned ? 'Najeeb Al-Hassan (Managing Director)' : 'Awaiting 2nd Approval'}
                      </div>
                    </div>
                    <span className={`font-mono text-xs ${dualApprovalSigned ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {dualApprovalSigned ? 'Approved ✓' : 'Pending Sign'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setDualApprovalSigned(true)}
                    disabled={dualApprovalSigned}
                    className={`px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg ${
                      dualApprovalSigned
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
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
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/90 border border-blue-900/40 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white">Case Study CMS & Link Management</h3>
                <span className="text-xs text-slate-400">Publication Approval Chain</span>
              </div>

              {/* Case Study Nomination & Publishing Gate */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-blue-400 font-mono text-[10px] uppercase font-bold">New Nomination</span>
                    <h4 className="font-bold text-sm text-white mt-0.5">
                      Apex Logistics: Autonomous Dispatch & Freight Tracking System
                    </h4>
                    <p className="text-slate-400">
                      Client approval recorded • Confidentiality anonymization verified
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                    Draft Review
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-slate-400 font-mono">Canonical URL: https://agency.ndh.com.ng/work/apex-logistics</span>
                  <button
                    onClick={() => setCaseStudyPublished(true)}
                    disabled={caseStudyPublished}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                      caseStudyPublished ? 'bg-emerald-600 text-white cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {caseStudyPublished ? 'Case Study Published Live ✓' : 'Approve & Publish Case Study'}
                  </button>
                </div>
              </div>

              {/* Cross-Link Bridge Specification */}
              <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-800/40 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Link2 className="w-4 h-4 text-blue-400" />
                  <span>NDH Academy Cross-Domain Bridge Spec</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Agency footer: <code className="text-white">"Looking to build your skills? Explore NDH Academy."</code> (https://academy.ndh.com.ng)
                  <br />
                  Academy footer: <code className="text-white">"Need a professional team? Work with NDH Agency."</code> (https://agency.ndh.com.ng)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

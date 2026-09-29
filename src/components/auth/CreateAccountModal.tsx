import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import { UserRole } from '../../types/ndh';
import {
  X,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building,
  Briefcase,
  Terminal,
} from 'lucide-react';

interface CreateAccountModalProps {
  onNavigatePortal: (portal: string) => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ onNavigatePortal }) => {
  const { isCreateOpen, closeCreateAccountModal, createCustomTestUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('client_owner');
  const [organizationName, setOrganizationName] = useState('');
  const [department, setDepartment] = useState('web_app_development');
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isCreateOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    createCustomTestUser({
      fullName,
      email,
      role,
      organizationName: role.startsWith('client') ? organizationName || 'Venture Technologies Ltd.' : undefined,
    });

    closeCreateAccountModal();

    if (role === 'client_owner' || role === 'client_admin' || role === 'client_billing') {
      onNavigatePortal('client-dashboard');
    } else if (role === 'project_manager') {
      onNavigatePortal('pm-dashboard');
    } else if (role === 'talent') {
      onNavigatePortal('talent-dashboard');
    } else {
      onNavigatePortal('admin-command');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-lg bg-[#0A0E17] border border-blue-900/60 rounded-3xl shadow-2xl overflow-hidden my-8 text-xs text-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Create Test Session Account</h3>
              <p className="text-[11px] text-slate-400">
                Generate a custom account to preview client, PM, talent, or admin operations
              </p>
            </div>
          </div>

          <button
            onClick={closeCreateAccountModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Select Account Type / Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="client_owner">Client Organization Owner (Briefs, Milestones, Invoices)</option>
              <option value="project_manager">Project Manager (Operations Command, Talent Allocator, QA)</option>
              <option value="talent">Vetted Talent (Sprint Tasks, Deliverables, Earnings)</option>
              <option value="finance_admin">Finance Admin (Payout Batches, Dual-Approval)</option>
              <option value="super_admin">Super Admin (Platform Governance & System Telemetry)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Adaeze Nwosu"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Work Email Address *</label>
              <input
                type="email"
                required
                placeholder="adaeze@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {role.startsWith('client') && (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Company / Organization Legal Entity</label>
              <input
                type="text"
                placeholder="e.g., Savannah Health Technologies PLC"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant preview sandbox session with isolated state.</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={closeCreateAccountModal}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Initialize Test Account & Launch Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

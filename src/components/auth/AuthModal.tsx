import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import { UserRole } from '../../types/ndh';
import {
  X,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  Building,
  Briefcase,
  Terminal,
  ArrowRight,
  Sparkles,
  KeyRound,
  UserPlus,
} from 'lucide-react';

interface AuthModalProps {
  onNavigatePortal: (portal: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNavigatePortal }) => {
  const {
    isAuthOpen,
    closeAuthModal,
    switchDemoRole,
    user,
    demoUsers,
    openCreateAccountModal,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('client_owner');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isAuthOpen) return null;

  const handleRoleSelectAndLogin = (role: UserRole) => {
    switchDemoRole(role);
    closeAuthModal();

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

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleRoleSelectAndLogin(selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-[#0A0E17] border border-blue-900/60 rounded-3xl shadow-2xl overflow-hidden my-8 text-xs text-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">NDH Agency • Secure Unified Portal Access</h3>
              <p className="text-[11px] text-slate-400">
                Single sign-on for Client Organizations, Project Managers, Talents & Admins
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Instant Preview Role Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>One-Click Demo Account Testing</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Pre-loaded with verified data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoUsers.map((du) => {
                const isCurrent = user?.role === du.role;
                return (
                  <button
                    key={du.id}
                    onClick={() => handleRoleSelectAndLogin(du.role)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      isCurrent
                        ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-400'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <img
                      src={du.avatarUrl}
                      alt={du.fullName}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-700 mt-0.5"
                    />
                    <div className="truncate flex-1">
                      <div className="font-semibold text-white truncate text-xs">{du.fullName}</div>
                      <div className="text-[10px] text-blue-400 truncate">{du.roleTitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-800"></div>
            <span className="absolute px-3 bg-[#0A0E17] text-[10px] font-mono text-slate-500 uppercase">
              Or Custom Sign In
            </span>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleStandardLogin} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Select Portal Access Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="client_owner">Client Workspace (Organization Owner)</option>
                <option value="project_manager">Project Manager Command Portal</option>
                <option value="talent">Vetted Talent Workforce Network</option>
                <option value="super_admin">Super Admin / Platform Executive</option>
                <option value="finance_admin">Finance Admin & Dual-Approval Lead</option>
                <option value="ops_admin">Operations & AI Systems Admin</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Work Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600"
                />
                <span>Remember this workstation</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  closeAuthModal();
                  openCreateAccountModal();
                }}
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>Create New Test Account</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Authenticate & Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Privacy footer */}
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-[10px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Sessions are encrypted and scoped strictly by role permissions. Client-talent communication isolation is enforced at the edge.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

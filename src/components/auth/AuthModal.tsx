import React, { useState } from 'react';
import { useAuth } from '../../lib/authStore';
import { BrandLogo } from '../brand/BrandLogo';
import {
  X,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Gift,
} from 'lucide-react';

interface AuthModalProps {
  onNavigatePortal: (portal: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNavigatePortal }) => {
  const { isAuthModalOpen, initialAuthTab, closeAuthModal, login, register, user } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialAuthTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    const result = login(email, password);
    if (result.success && result.user) {
      setSuccessMessage(`Welcome back, ${result.user.fullName}!`);
      setTimeout(() => {
        closeAuthModal();
        if (result.user?.role === 'super_admin') {
          onNavigatePortal('admin-command');
        } else if (result.user?.role === 'project_manager') {
          onNavigatePortal('pm-dashboard');
        } else if (result.user?.role === 'talent') {
          onNavigatePortal('talent-dashboard');
        } else {
          onNavigatePortal('client-dashboard');
        }
      }, 700);
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !orgName) {
      setErrorMessage('Please provide your full name, email, and company/project name.');
      return;
    }

    const result = register({
      fullName,
      email,
      password,
      organizationName: orgName,
      phone,
      referralCodeUsed: referralCode,
    });

    if (result.success) {
      setSuccessMessage(`Account created for ${result.user.fullName}!`);
      setTimeout(() => {
        closeAuthModal();
        onNavigatePortal('client-dashboard');
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-md rounded-3xl bg-[#0F172A] border border-blue-500/40 p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size="md" showSubtitle={false} />
          </div>
          <h2 className="text-xl font-black text-white">
            {activeTab === 'login' ? 'Sign In to Workspace' : 'Create Client Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {activeTab === 'login'
              ? 'Access your proposals, active milestones, and PM direct channel'
              : 'Start your project with milestone escrow protection and dedicated PMs'}
          </p>
        </div>

        {/* Tabs: Sign In vs Create Account */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. folake@kobopay.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-300">Password</label>
                <button type="button" className="text-[10px] text-blue-400 hover:underline">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Credentials Helper */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <div className="font-bold text-slate-300">Test Account Credentials:</div>
              <div className="flex justify-between font-mono text-[10px]">
                <span>Client: folake@kobopay.com</span>
                <span className="text-slate-500">Any Pass</span>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span>Admin: najeeb@ndh.com.ng</span>
                <span className="text-slate-500">Any Pass</span>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span>PM: tariq.pm@agency.ndh.com.ng</span>
                <span className="text-slate-500">Any Pass</span>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Your Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tolu Adeyemi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Company / Project Name *</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Health Systems"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="tolu@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Phone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+234 812 345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-400 flex items-center justify-between">
                <span>Referral Code (Optional)</span>
                <span className="text-[10px] text-emerald-400 font-mono">Get ₦50k / $50 Discount</span>
              </label>
              <div className="relative">
                <Gift className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="text"
                  placeholder="e.g. FOLAKE-NDH-2026"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <span>Create Client Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-bit Encrypted • NDPR &amp; ISO 27001 Certified Security</span>
        </div>
      </div>
    </div>
  );
};

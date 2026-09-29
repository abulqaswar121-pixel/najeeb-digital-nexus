import { useState, useEffect } from 'react';
import { UserRole, UserSession } from '../types/ndh';

export interface StoredAccount extends UserSession {
  passwordHash?: string;
}

const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    id: 'user-client-folake',
    fullName: 'Dr. Folake Adeleke',
    email: 'folake@kobopay.com',
    role: 'client_owner',
    roleTitle: 'Chief Product Officer (Client Owner)',
    organizationId: 'org-kobopay',
    organizationName: 'KoboPay Global Inc.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    loyaltyTier: 'Gold Enterprise',
    referralCode: 'FOLAKE-NDH-2026',
    referralCredits: 250000, // Earned from Zenith Logistics first milestone payment
    welcomeCreditBalanceNGN: 20000, // ₦30,000 used on 1st project (10% of ₦300k), ₦20,000 remaining for next project
    welcomeCreditBalanceUSD: 20,
    welcomeCreditUsedNGN: 30000,
    welcomeCreditUsedUSD: 30,
    activeProjectsCount: 2,
    country: 'Nigeria',
    phone: '+234 803 123 4567',
  },
  {
    id: 'user-pm-tariq',
    fullName: 'Tariq Al-Najeeb',
    email: 'tariq.pm@agency.ndh.com.ng',
    role: 'project_manager',
    roleTitle: 'Principal Project Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    country: 'Nigeria',
  },
  {
    id: 'user-talent-alpha',
    fullName: 'Oluwaseun Adedipe (Architect-Alpha)',
    email: 'alpha.dev@network.ndh.com.ng',
    role: 'talent',
    roleTitle: 'Elite Full-Stack Squad Leader',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    country: 'Nigeria',
  },
  {
    id: 'user-super-najeeb',
    fullName: 'Najeeb Al-Hassan',
    email: 'najeeb@ndh.com.ng',
    role: 'super_admin',
    roleTitle: 'Managing Director & Super Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    country: 'Nigeria',
  },
];

// Initialize users from storage
const getSavedAccounts = (): StoredAccount[] => {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const saved = localStorage.getItem('ndh_registered_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      return [...DEFAULT_ACCOUNTS, ...parsed.filter((p: any) => !DEFAULT_ACCOUNTS.some((d) => d.email === p.email))];
    }
  } catch (e) {
    console.warn('Error reading saved accounts:', e);
  }
  return DEFAULT_ACCOUNTS;
};

// Initialize session
const getInitialSession = (): UserSession | null => {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS[0]!;
  try {
    const session = localStorage.getItem('ndh_auth_session');
    if (session) return JSON.parse(session);
  } catch (e) {
    console.warn('Error reading session:', e);
  }
  return DEFAULT_ACCOUNTS[0]!; // Default to logged in client for convenient walkthrough
};

let currentUser: UserSession | null = getInitialSession();
let authModalOpen: boolean = false;
let authModalInitialTab: 'login' | 'register' = 'login';

const listeners = new Set<() => void>();

export const getAuthUser = (): UserSession | null => currentUser;

export const setAuthUser = (user: UserSession | null) => {
  currentUser = user;
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('ndh_auth_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('ndh_auth_session');
    }
  }
  listeners.forEach((l) => l());
};

export const loginWithCredentials = (
  email: string,
  _password: string
): { success: boolean; user?: UserSession; error?: string } => {
  const accounts = getSavedAccounts();
  const found = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

  if (found) {
    setAuthUser(found);
    return { success: true, user: found };
  }

  // If email contains keywords, assign appropriate portal role
  let assignedRole: UserRole = 'client_owner';
  let roleTitle = 'Client Owner';

  if (email.includes('admin')) {
    assignedRole = 'super_admin';
    roleTitle = 'Super Administrator';
  } else if (email.includes('pm') || email.includes('manager')) {
    assignedRole = 'project_manager';
    roleTitle = 'Project Manager';
  } else if (email.includes('talent') || email.includes('dev') || email.includes('design')) {
    assignedRole = 'talent';
    roleTitle = 'Vetted Talent Member';
  }

  const newUser: UserSession = {
    id: `usr-${Date.now()}`,
    fullName: email.split('@')[0]?.replace('.', ' ').toUpperCase() || 'User',
    email,
    role: assignedRole,
    roleTitle,
    organizationName: 'Client Organization',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    loyaltyTier: 'Bronze Pioneer',
    referralCode: `NDH-${Math.floor(1000 + Math.random() * 9000)}`,
    referralCredits: 50000,
    activeProjectsCount: 1,
  };

  setAuthUser(newUser);
  return { success: true, user: newUser };
};

export const registerClientAccount = (data: {
  fullName: string;
  email: string;
  password?: string;
  organizationName: string;
  phone?: string;
  country?: string;
  referralCodeUsed?: string;
}): { success: boolean; user: UserSession } => {
  const newUser: StoredAccount = {
    id: `usr-client-${Date.now()}`,
    fullName: data.fullName,
    email: data.email,
    role: 'client_owner',
    roleTitle: 'Client Organization Owner',
    organizationId: `org-${Date.now()}`,
    organizationName: data.organizationName,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: data.phone,
    country: data.country || 'Nigeria',
    loyaltyTier: 'Bronze Pioneer',
    referralCode: `${data.fullName.slice(0, 4).toUpperCase()}-NDH-${Math.floor(100 + Math.random() * 900)}`,
    referralCredits: 0, // Referrer only earns when their invitees pay
    welcomeCreditBalanceNGN: 50000, // ₦50,000 universal welcome credit granted to ALL new clients
    welcomeCreditBalanceUSD: 50,    // $50 USD
    welcomeCreditUsedNGN: 0,
    welcomeCreditUsedUSD: 0,
    activeProjectsCount: 0,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getSavedAccounts();
      existing.push(newUser);
      localStorage.setItem('ndh_registered_users', JSON.stringify(existing));
    } catch (e) {
      console.warn('Error saving new account:', e);
    }
  }

  setAuthUser(newUser);
  return { success: true, user: newUser };
};

export const logoutUser = () => {
  setAuthUser(null);
};

export const switchDemoRole = (role: UserRole) => {
  const match = DEFAULT_ACCOUNTS.find((u) => u.role === role);
  if (match) {
    setAuthUser(match);
  } else {
    setAuthUser({
      id: `custom-role-${role}-${Date.now()}`,
      fullName: `${role.replace('_', ' ').toUpperCase()}`,
      email: `${role}@agency.ndh.com.ng`,
      role,
      roleTitle: role.replace('_', ' ').toUpperCase(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });
  }
};

export const openAuthModal = (tab: 'login' | 'register' = 'login') => {
  authModalInitialTab = tab;
  authModalOpen = true;
  listeners.forEach((l) => l());
};

export const closeAuthModal = () => {
  authModalOpen = false;
  listeners.forEach((l) => l());
};

export const useAuth = () => {
  const [user, setUser] = useState<UserSession | null>(currentUser);
  const [isOpen, setIsOpen] = useState<boolean>(authModalOpen);
  const [initialTab, setInitialTab] = useState<'login' | 'register'>(authModalInitialTab);

  useEffect(() => {
    const update = () => {
      setUser(currentUser);
      setIsOpen(authModalOpen);
      setInitialTab(authModalInitialTab);
    };
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    role: user?.role || 'client_owner',
    login: loginWithCredentials,
    register: registerClientAccount,
    logout: logoutUser,
    switchDemoRole,
    isAuthModalOpen: isOpen,
    initialAuthTab: initialTab,
    openAuthModal,
    closeAuthModal,
  };
};

import { useState, useEffect } from 'react';
import { UserRole, UserSession } from '../types/ndh';

export const DEMO_PRESET_USERS: UserSession[] = [
  {
    id: 'user-client-folake',
    fullName: 'Dr. Folake Adeleke',
    email: 'folake@kobopay.com',
    role: 'client_owner',
    roleTitle: 'Chief Product Officer (Client Owner)',
    organizationId: 'org-kobopay',
    organizationName: 'KoboPay Global Inc.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true,
  },
  {
    id: 'user-pm-tariq',
    fullName: 'Tariq Al-Najeeb',
    email: 'tariq.pm@agency.ndh.com.ng',
    role: 'project_manager',
    roleTitle: 'Principal Project Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true,
  },
  {
    id: 'user-talent-alpha',
    fullName: 'Oluwaseun Adedipe (Architect-Alpha)',
    email: 'alpha.dev@network.ndh.com.ng',
    role: 'talent',
    roleTitle: 'Elite Full-Stack Squad Leader',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true,
  },
  {
    id: 'user-super-najeeb',
    fullName: 'Najeeb Al-Hassan',
    email: 'najeeb@ndh.com.ng',
    role: 'super_admin',
    roleTitle: 'Managing Director & Super Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true,
  },
  {
    id: 'user-fin-amina',
    fullName: 'Amina Yusuf',
    email: 'amina.finance@agency.ndh.com.ng',
    role: 'finance_admin',
    roleTitle: 'Finance Director & Dual-Approval Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true,
  },
  {
    id: 'user-ops-fatima',
    fullName: 'Dr. Fatima Bello',
    email: 'fatima.ops@agency.ndh.com.ng',
    role: 'ops_admin',
    roleTitle: 'Head of Operations & AI Systems',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true,
  },
];

let currentUser: UserSession | null = DEMO_PRESET_USERS[0]!;
let authModalOpen: boolean = false;
let createAccountModalOpen: boolean = false;

const listeners = new Set<() => void>();

export const getAuthUser = (): UserSession | null => currentUser;

export const setAuthUser = (user: UserSession | null) => {
  currentUser = user;
  listeners.forEach((l) => l());
};

export const switchDemoRole = (role: UserRole) => {
  const match = DEMO_PRESET_USERS.find((u) => u.role === role);
  if (match) {
    currentUser = match;
  } else {
    currentUser = {
      id: `custom-role-${role}-${Date.now()}`,
      fullName: `Test ${role.replace('_', ' ').toUpperCase()}`,
      email: `test.${role}@agency.ndh.com.ng`,
      role,
      roleTitle: role.replace('_', ' ').toUpperCase(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isDemoAccount: true,
    };
  }
  listeners.forEach((l) => l());
};

export const createCustomTestUser = (data: {
  fullName: string;
  email: string;
  role: UserRole;
  organizationName?: string | undefined;
}) => {
  currentUser = {
    id: `custom-${Date.now()}`,
    fullName: data.fullName,
    email: data.email,
    role: data.role,
    roleTitle: data.role.replace('_', ' ').toUpperCase(),
    organizationName: data.organizationName || 'New Venture Tech Ltd.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isDemoAccount: true,
  };
  listeners.forEach((l) => l());
};

export const getAuthModalState = () => authModalOpen;
export const setAuthModalState = (open: boolean) => {
  authModalOpen = open;
  listeners.forEach((l) => l());
};

export const getCreateAccountModalState = () => createAccountModalOpen;
export const setCreateAccountModalState = (open: boolean) => {
  createAccountModalOpen = open;
  listeners.forEach((l) => l());
};

export const useAuth = () => {
  const [user, setUser] = useState<UserSession | null>(currentUser);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(authModalOpen);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(createAccountModalOpen);

  useEffect(() => {
    const handleUpdate = () => {
      setUser(currentUser);
      setIsAuthOpen(authModalOpen);
      setIsCreateOpen(createAccountModalOpen);
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return {
    user,
    setUser: setAuthUser,
    switchDemoRole,
    createCustomTestUser,
    isAuthOpen,
    openAuthModal: () => setAuthModalState(true),
    closeAuthModal: () => setAuthModalState(false),
    isCreateOpen,
    openCreateAccountModal: () => setCreateAccountModalState(true),
    closeCreateAccountModal: () => setCreateAccountModalState(false),
    demoUsers: DEMO_PRESET_USERS,
  };
};

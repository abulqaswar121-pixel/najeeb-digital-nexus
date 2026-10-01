import { useState, useEffect } from "react";
import { UserSession } from "../types/ndh";

export interface StoredAccount extends UserSession {
  password?: string;
}

// Shared sandbox password for every pre-seeded demo account. This is a
// PREVIEW/DEMO environment only — nothing here is a real authentication
// backend. Real deployments must replace this entire module with a proper
// server-side auth provider (hashed passwords, sessions/JWT, MFA, etc).
export const DEMO_ACCOUNT_PASSWORD = "NDHDemo2026!";

const SYSTEM_ACCOUNTS: StoredAccount[] = [
  {
    id: "user-client-folake",
    fullName: "Dr. Folake Adeleke",
    email: "folake@kobopay.com",
    password: DEMO_ACCOUNT_PASSWORD,
    role: "client_owner",
    roleTitle: "Chief Product Officer (Client Owner)",
    organizationId: "org-kobopay",
    organizationName: "KoboPay Global Inc.",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    loyaltyTier: "Gold Enterprise",
    referralCode: "FOLAKE-NDH-2026",
    referralCredits: 250000,
    welcomeCreditBalanceNGN: 20000,
    welcomeCreditBalanceUSD: 20,
    welcomeCreditUsedNGN: 30000,
    welcomeCreditUsedUSD: 30,
    activeProjectsCount: 2,
    country: "Nigeria",
    phone: "+234 803 123 4567",
  },
  {
    id: "user-pm-tariq",
    fullName: "Tariq Al-Najeeb",
    email: "tariq.pm@agency.ndh.com.ng",
    password: DEMO_ACCOUNT_PASSWORD,
    role: "project_manager",
    roleTitle: "Principal Project Manager",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    country: "Nigeria",
  },
  {
    id: "user-talent-alpha",
    fullName: "Oluwaseun Adedipe (Architect-Alpha)",
    email: "alpha.dev@network.ndh.com.ng",
    password: DEMO_ACCOUNT_PASSWORD,
    role: "talent",
    roleTitle: "Elite Full-Stack Squad Leader",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    country: "Nigeria",
  },
  {
    id: "user-super-najeeb",
    fullName: "Najeeb Al-Hassan",
    email: "najeeb@ndh.com.ng",
    password: DEMO_ACCOUNT_PASSWORD,
    role: "super_admin",
    roleTitle: "Managing Director & Super Admin",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    country: "Nigeria",
  },
];

// Initialize users from storage
const getSavedAccounts = (): StoredAccount[] => {
  if (typeof window === "undefined") return SYSTEM_ACCOUNTS;
  try {
    const saved = localStorage.getItem("ndh_registered_users");
    if (saved) {
      const parsed = JSON.parse(saved);
      return [
        ...SYSTEM_ACCOUNTS,
        ...parsed.filter((p: StoredAccount) => !SYSTEM_ACCOUNTS.some((d) => d.email === p.email)),
      ];
    }
  } catch (e) {
    console.warn("Error reading saved accounts:", e);
  }
  return SYSTEM_ACCOUNTS;
};

// Initialize session: strictly null by default unless the user has actively logged in!
const getInitialSession = (): UserSession | null => {
  if (typeof window === "undefined") return null;
  try {
    const session = localStorage.getItem("ndh_auth_session");
    if (session) return JSON.parse(session);
  } catch (e) {
    console.warn("Error reading session:", e);
  }
  return null; // Guest visitors are not logged in
};

let currentUser: UserSession | null = getInitialSession();
let authModalOpen: boolean = false;
let authModalInitialTab: "login" | "register" = "login";

const listeners = new Set<() => void>();

export const getAuthUser = (): UserSession | null => currentUser;

export const setAuthUser = (user: UserSession | null) => {
  currentUser = user;
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("ndh_auth_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("ndh_auth_session");
    }
  }
  listeners.forEach((l) => l());
};

export const loginWithCredentials = (
  email: string,
  password: string,
): { success: boolean; user?: UserSession; error?: string } => {
  const accounts = getSavedAccounts();
  const found = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());

  if (!found) {
    return {
      success: false,
      error:
        "No account found with that email. Try one of the demo accounts below, or create a new client account.",
    };
  }

  // IMPORTANT: this checks the password against the account's stored demo
  // password. There is no real server-side auth here (this is a client-only
  // preview), but role access is now gated by a correct password match
  // instead of being guessable from the email address.
  if (found.password && found.password !== password) {
    return { success: false, error: "Incorrect password for this account." };
  }

  setAuthUser(found);
  return { success: true, user: found };
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
    email: data.email.trim(),
    ...(data.password ? { password: data.password } : {}),
    role: "client_owner",
    roleTitle: "Client Organization Owner",
    organizationId: `org-${Date.now()}`,
    organizationName: data.organizationName,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    ...(data.phone ? { phone: data.phone } : {}),
    country: data.country || "Nigeria",
    loyaltyTier: "Bronze Pioneer",
    referralCode: `${data.fullName.slice(0, 4).toUpperCase()}-NDH-${Math.floor(100 + Math.random() * 900)}`,
    referralCredits: 0,
    welcomeCreditBalanceNGN: 50000, // ₦50,000 Welcome discount pool for all new clients
    welcomeCreditBalanceUSD: 50,
    welcomeCreditUsedNGN: 0,
    welcomeCreditUsedUSD: 0,
    activeProjectsCount: 0,
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getSavedAccounts();
      existing.push(newUser);
      localStorage.setItem("ndh_registered_users", JSON.stringify(existing));
    } catch (e) {
      console.warn("Error saving new account:", e);
    }
  }

  setAuthUser(newUser);
  return { success: true, user: newUser };
};

export const logoutUser = () => {
  setAuthUser(null);
};

export const openAuthModal = (tab: "login" | "register" = "login") => {
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
  const [initialTab, setInitialTab] = useState<"login" | "register">(authModalInitialTab);

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
    role: user?.role || "client_owner",
    login: loginWithCredentials,
    register: registerClientAccount,
    logout: logoutUser,
    isAuthModalOpen: isOpen,
    initialAuthTab: initialTab,
    openAuthModal,
    closeAuthModal,
  };
};

import { useState, useEffect } from "react";
import { UserSession } from "../types/ndh";
import { api, ApiError } from "./apiClient";

// Shared sandbox password shown in the UI so visitors can try any demo role.
// The server verifies it with real bcrypt hashing (see server/collections.ts
// and server/auth.ts) -- this constant is just for the "autofill demo
// credentials" convenience buttons in AuthModal, it is not itself a secret.
export const DEMO_ACCOUNT_PASSWORD = "NDHDemo2026!";

let currentUser: UserSession | null = null;
let sessionLoaded = false; // true once the initial GET /api/auth/me resolves
let authModalOpen = false;
let authModalInitialTab: "login" | "register" = "login";

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const getAuthUser = (): UserSession | null => currentUser;

async function restoreSession() {
  try {
    const { user } = await api.get<{ user: UserSession }>("/auth/me");
    currentUser = user;
  } catch {
    currentUser = null; // not logged in -- this is the normal guest state
  } finally {
    sessionLoaded = true;
    notify();
  }
}

if (typeof window !== "undefined") {
  void restoreSession();
}

export const loginWithCredentials = async (
  email: string,
  password: string,
): Promise<{ success: boolean; user?: UserSession; error?: string }> => {
  try {
    const { user } = await api.post<{ user: UserSession }>("/auth/login", { email, password });
    currentUser = user;
    notify();
    return { success: true, user };
  } catch (e) {
    const message = e instanceof ApiError ? e.message : "Unable to reach the server.";
    return { success: false, error: message };
  }
};

export const registerClientAccount = async (data: {
  fullName: string;
  email: string;
  password?: string;
  organizationName: string;
  phone?: string;
  country?: string;
  referralCodeUsed?: string;
}): Promise<{ success: boolean; user?: UserSession; error?: string }> => {
  try {
    const { user } = await api.post<{ user: UserSession }>("/auth/register", data);
    currentUser = user;
    notify();
    return { success: true, user };
  } catch (e) {
    const message = e instanceof ApiError ? e.message : "Unable to reach the server.";
    return { success: false, error: message };
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    currentUser = null;
    notify();
  }
};

export const openAuthModal = (tab: "login" | "register" = "login") => {
  authModalInitialTab = tab;
  authModalOpen = true;
  notify();
};

export const closeAuthModal = () => {
  authModalOpen = false;
  notify();
};

export const useAuth = () => {
  const [user, setUser] = useState<UserSession | null>(currentUser);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(!sessionLoaded);
  const [isOpen, setIsOpen] = useState<boolean>(authModalOpen);
  const [initialTab, setInitialTab] = useState<"login" | "register">(authModalInitialTab);

  useEffect(() => {
    const update = () => {
      setUser(currentUser);
      setIsSessionLoading(!sessionLoaded);
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
    isSessionLoading,
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

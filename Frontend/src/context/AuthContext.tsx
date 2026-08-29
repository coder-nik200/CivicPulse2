"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authApi } from "@/lib/api-client";

export type UserRole = "citizen" | "authority" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isCitizen: boolean;
  isAuthority: boolean;
  isAdmin: boolean;

  login: (email: string, password: string) => Promise<void>;

  signup: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: UserRole,
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // Load current authenticated user
  // ---------------------------------------------

  const refreshUser = async () => {
    try {
      const data = await authApi.me();

      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // ---------------------------------------------
  // Check session when application starts
  // ---------------------------------------------

  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      try {
        const data = await authApi.me();

        if (!active) return;

        if (data?.success && data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      active = false;
    };
  }, []);

  // ---------------------------------------------
  // Login
  // ---------------------------------------------

  const login = async (email: string, password: string): Promise<void> => {
    const cleanEmail = email.trim().toLowerCase();

    const data = await authApi.login({
      email: cleanEmail,
      password,
    });

    if (!data?.success || !data?.user) {
      throw new Error(data?.message || "Login failed");
    }

    setUser(data.user);
  };

  // ---------------------------------------------
  // Signup
  // ---------------------------------------------

  const signup = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role: UserRole = "citizen",
  ): Promise<void> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone?.trim();

    if (!cleanName) {
      throw new Error("Name is required");
    }

    if (!cleanEmail) {
      throw new Error("Email is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    if (password.length < 6) {
      throw new Error("Password must contain at least 6 characters");
    }

    if (!["citizen", "authority"].includes(role)) {
      throw new Error("Invalid account type");
    }

    try {
      const data = await authApi.signup({
        name: cleanName,
        email: cleanEmail,
        password,
        phone: cleanPhone || undefined,
        role,
      });

      if (!data?.success || !data?.user) {
        throw new Error(data?.message || "Unable to create account");
      }

      // Backend automatically creates the cookie.
      // Store returned user in React state.
      setUser(data.user);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Unable to create account");
    }
  };

  // ---------------------------------------------
  // Logout
  // ---------------------------------------------

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  // ---------------------------------------------
  // Role helpers
  // ---------------------------------------------

  const isAuthenticated = user !== null;

  const isCitizen = user?.role === "citizen";

  const isAuthority = user?.role === "authority";

  const isAdmin = user?.role === "admin";

  // ---------------------------------------------
  // Provider
  // ---------------------------------------------

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        isAuthenticated,
        isCitizen,
        isAuthority,
        isAdmin,

        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------
// useAuth hook
// ---------------------------------------------

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}

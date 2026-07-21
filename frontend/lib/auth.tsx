"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function navigateWithPrefix(path: string) {
  if (typeof window === "undefined") return;
  const current = window.location.pathname;
  const match = current.match(/^(\/proxy\/\d+)/);
  const prefix = match ? match[1] : "";
  window.location.href = prefix + path;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("athena_token");
    if (stored) setToken(stored);
    setLoaded(true);
  }, []);

  function login(newToken: string) {
    localStorage.setItem("athena_token", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("athena_token");
    setToken(null);
    navigateWithPrefix("/login");
  }

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

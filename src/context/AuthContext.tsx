"use client";

import { api } from "@/lib/axios";
import { sessionStore } from "@/lib/sessionStorage";
import { isTokenExpired } from "@/lib/utils";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  role: "customer" | "admin" | string;
  wishlistCount: [];
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (data: { user: User; accessToken: string }) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (data: { user: User; accessToken: string }) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    if (typeof window !== "undefined") {
      sessionStore.set("user", data.user);
      sessionStore.set("accessToken", data.accessToken);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    if (typeof window !== "undefined") sessionStore.clear();
  };

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") return;

      const storedUser = sessionStore.get<User | null>("user");
      const storedToken = sessionStore.get<string | null>("accessToken");

      if (storedUser && storedToken && !isTokenExpired(storedToken)) {
        setUser(storedUser);
        setAccessToken(storedToken);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/refresh");
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
        sessionStore.set("user", res.data.user);
        sessionStore.set("accessToken", res.data.accessToken);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

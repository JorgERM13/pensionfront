import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  tenant_id: number;
  tenant_nombre: string;
  tenant_tipo: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u));
      }
    }
    setCargando(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/login", { email, password });
    setToken(res.token);
    setUser(res.user);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
    }
  };

  const register = async (data: any) => {
    const res = await api.post("/register", data);
    setToken(res.token);
    setUser(res.user);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
    }
  };

  const logout = () => {
    api.post("/logout").catch(() => {});
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
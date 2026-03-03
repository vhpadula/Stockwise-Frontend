"use client";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Load token from localStorage on client only

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("access");
      if (storedToken) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(storedToken);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/api/users/token/", { email, password });
    const accessToken = res.data.access;
    const refreshToken = res.data.refresh;
    setToken(accessToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("access", accessToken);
      localStorage.setItem("refresh", refreshToken);
    }
    setLoading(false);
  };
  const logout = () => {
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

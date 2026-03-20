"use client";

import { useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/store/auth";
import { User } from "@/types/user";
import { setAccessToken, setRefreshToken, getRefreshToken } from "@/lib/api/client";
import * as authApi from "@/lib/api/auth";
import * as usersApi from "@/lib/api/users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }
      try {
        const tokens = await authApi.refreshSession();
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        const me = await usersApi.getMe();
        setUser(me);
      } catch {
        setAccessToken(null);
        setRefreshToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authApi.login({ email, password });
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    const me = await usersApi.getMe();
    setUser(me);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await usersApi.getMe();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

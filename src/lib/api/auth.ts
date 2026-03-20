import { apiFetch, setAccessToken, setRefreshToken } from "./client";
import { AuthTokens, LoginRequest, RegisterRequest, EmailVerificationRequest, VerifyCodeRequest } from "@/types/auth";

export async function login(data: LoginRequest): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/auth/login", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export async function logout(): Promise<void> {
  await apiFetch<void>("/auth/logout", { method: "POST" }).catch(() => {});
  setAccessToken(null);
  setRefreshToken(null);
}

export async function sendVerificationEmail(data: EmailVerificationRequest): Promise<void> {
  return apiFetch<void>("/auth/email/send-code", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export async function verifyEmailCode(data: VerifyCodeRequest): Promise<void> {
  return apiFetch<void>("/auth/email/verify", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export async function register(data: RegisterRequest): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/auth/register", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export async function checkEmailDuplicate(email: string): Promise<{ available: boolean }> {
  return apiFetch<{ available: boolean }>("/auth/email/check", {
    method: "POST",
    body: { email },
    skipAuth: true,
  });
}

export async function forgotPassword(email: string): Promise<void> {
  return apiFetch<void>("/auth/password/forgot", {
    method: "POST",
    body: { email },
    skipAuth: true,
  });
}

export async function refreshSession(): Promise<AuthTokens> {
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  if (!refreshToken) throw new Error("No refresh token");
  return apiFetch<AuthTokens>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    skipAuth: true,
  });
}

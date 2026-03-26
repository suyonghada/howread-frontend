import { ApiError, ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";
const REFRESH_TOKEN_KEY = "refreshToken";

// Access token stored in memory (XSS protection)
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setRefreshToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// Concurrent refresh lock
let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError("UNAUTHORIZED", "No refresh token", 401);

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const json: ApiResponse<{ accessToken: string; refreshToken: string }> = await res.json();

  if (!json.success || !json.data) {
    setRefreshToken(null);
    throw new ApiError(
      json.error?.code ?? "UNAUTHORIZED",
      json.error?.message ?? "Token refresh failed",
      res.status
    );
  }

  setAccessToken(json.data.accessToken);
  if (json.data.refreshToken) {
    setRefreshToken(json.data.refreshToken);
  }
  return json.data.accessToken;
}

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = doRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

export interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, skipAuth = false, headers: extraHeaders, ...rest } = options;

  const buildHeaders = (token: string | null): HeadersInit => {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
      ...(extraHeaders as Record<string, string>),
    };
    if (token && !skipAuth) h["Authorization"] = `Bearer ${token}`;
    return h;
  };

  const executeRequest = async (token: string | null): Promise<Response> => {
    return fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: buildHeaders(token),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let res = await executeRequest(accessToken);

  // Attempt token refresh on 401
  if (res.status === 401 && !skipAuth) {
    try {
      const newToken = await refreshAccessToken();
      res = await executeRequest(newToken);
    } catch {
      throw new ApiError("UNAUTHORIZED", "Session expired. Please log in again.", 401);
    }
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success || json.error) {
    throw new ApiError(
      json.error?.code ?? "UNKNOWN_ERROR",
      json.error?.message ?? "An unexpected error occurred",
      res.status
    );
  }

  return json.data as T;
}

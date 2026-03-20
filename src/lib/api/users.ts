import { apiFetch } from "./client";
import { User, UpdateNicknameRequest, UpdatePasswordRequest } from "@/types/user";

export async function getMe(): Promise<User> {
  return apiFetch<User>("/users/me");
}

export async function updateNickname(data: UpdateNicknameRequest): Promise<User> {
  return apiFetch<User>("/users/me/nickname", {
    method: "PATCH",
    body: data,
  });
}

export async function updatePassword(data: UpdatePasswordRequest): Promise<void> {
  return apiFetch<void>("/users/me/password", {
    method: "PATCH",
    body: data,
  });
}

export async function uploadProfileImage(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("image", file);

  // Cannot use apiFetch for FormData (Content-Type must not be set manually)
  const { getAccessToken } = await import("./client");
  const token = getAccessToken();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

  const res = await fetch(`${BASE_URL}/users/me/profile-image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message ?? "Upload failed");
  }
  return json.data;
}

export async function deleteAccount(): Promise<void> {
  return apiFetch<void>("/users/me", { method: "DELETE" });
}

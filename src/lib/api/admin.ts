import { apiFetch } from "./client";

export interface AdminUser {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>("/admin/users");
}

export async function changeUserRole(
  userId: number,
  role: "ADMIN" | "MEMBER"
): Promise<void> {
  return apiFetch<void>(`/admin/users/${userId}/role`, {
    method: "PUT",
    body: { role },
  });
}

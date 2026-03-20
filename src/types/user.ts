export interface User {
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  createdAt: string;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNickname, updatePassword, uploadProfileImage, deleteAccount } from "@/lib/api/users";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export function useProfile() {
  const { refreshUser, logout } = useAuth();
  const queryClient = useQueryClient();

  const updateNicknameMutation = useMutation({
    mutationFn: (nickname: string) => updateNickname({ nickname }),
    onSuccess: () => {
      refreshUser();
      toast.success("닉네임이 변경되었습니다");
    },
    onError: () => toast.error("닉네임 변경에 실패했습니다"),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      updatePassword({ currentPassword, newPassword }),
    onSuccess: () => toast.success("비밀번호가 변경되었습니다"),
    onError: () => toast.error("비밀번호 변경에 실패했습니다"),
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: async () => {
      await refreshUser();
      toast.success("프로필 이미지가 변경되었습니다");
    },
    onError: () => toast.error("이미지 업로드에 실패했습니다"),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await logout();
      queryClient.clear();
      toast.success("회원탈퇴가 완료되었습니다");
    },
    onError: () => toast.error("회원탈퇴에 실패했습니다"),
  });

  return {
    updateNicknameMutation,
    updatePasswordMutation,
    uploadImageMutation,
    deleteAccountMutation,
  };
}

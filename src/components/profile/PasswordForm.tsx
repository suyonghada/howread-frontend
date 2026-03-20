"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema, UpdatePasswordFormData } from "@/lib/validations/auth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordForm() {
  const { updatePasswordMutation } = useProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: UpdatePasswordFormData) => {
    await updatePasswordMutation.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="currentPassword">현재 비밀번호</Label>
        <Input id="currentPassword" type="password" {...register("currentPassword")} />
        {errors.currentPassword && (
          <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="newPassword">새 비밀번호</Label>
        <Input id="newPassword" type="password" {...register("newPassword")} />
        {errors.newPassword && (
          <p className="text-xs text-destructive">{errors.newPassword.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
        <Input id="confirmNewPassword" type="password" {...register("confirmNewPassword")} />
        {errors.confirmNewPassword && (
          <p className="text-xs text-destructive">{errors.confirmNewPassword.message}</p>
        )}
      </div>
      <Button type="submit" size="sm" disabled={isSubmitting || updatePasswordMutation.isPending}>
        비밀번호 변경
      </Button>
    </form>
  );
}

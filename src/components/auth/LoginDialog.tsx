"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { ApiError } from "@/types/api";

interface LoginDialogProps {
  onClose: () => void;
}

export function LoginDialog({ onClose }: LoginDialogProps) {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("로그인 되었습니다");
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("로그인에 실패했습니다");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="dialog-email">이메일</Label>
        <Input
          id="dialog-email"
          type="email"
          placeholder="email@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="dialog-password">비밀번호</Label>
        <Input
          id="dialog-password"
          type="password"
          placeholder="비밀번호"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "로그인 중..." : "로그인"}
      </Button>
      <div className="text-center text-sm">
        <Link
          href="/auth/forgot-password"
          className="text-muted-foreground hover:underline"
          onClick={onClose}
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>
      <div className="text-center text-sm">
        계정이 없으신가요?{" "}
        <Link href="/auth/register" className="font-medium hover:underline" onClick={onClose}>
          회원가입
        </Link>
      </div>
    </form>
  );
}

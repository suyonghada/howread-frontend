"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, resetPasswordSchema, ForgotPasswordFormData, ResetPasswordFormData } from "@/lib/validations/auth";
import { forgotPassword, resetPassword } from "@/lib/api/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

type Step = "email" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onEmailSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setStep("reset");
    } catch {
      toast.error("비밀번호 재설정 이메일 발송에 실패했습니다");
    }
  };

  const onResetSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword({ email: submittedEmail, code: data.code, newPassword: data.newPassword });
      setStep("done");
    } catch {
      toast.error("비밀번호 재설정에 실패했습니다. 코드를 확인해주세요.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>비밀번호 재설정</CardTitle>
          <CardDescription>
            {step === "email" && "가입한 이메일 주소를 입력하면 인증 코드를 보내드립니다"}
            {step === "reset" && "이메일로 발송된 6자리 코드를 입력하세요"}
            {step === "done" && "비밀번호가 변경되었습니다"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...emailForm.register("email")}
                />
                {emailForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{emailForm.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={emailForm.formState.isSubmitting}>
                {emailForm.formState.isSubmitting ? "발송 중..." : "인증 코드 보내기"}
              </Button>
              <Link href="/auth/login" className={buttonVariants({ variant: "ghost", className: "w-full" })}>
                로그인으로 돌아가기
              </Link>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="code">인증 코드</Label>
                <Input
                  id="code"
                  placeholder="6자리 코드"
                  maxLength={6}
                  {...resetForm.register("code")}
                />
                {resetForm.formState.errors.code && (
                  <p className="text-xs text-destructive">{resetForm.formState.errors.code.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="8자 이상, 영문+숫자"
                  {...resetForm.register("newPassword")}
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  {...resetForm.register("confirmNewPassword")}
                />
                {resetForm.formState.errors.confirmNewPassword && (
                  <p className="text-xs text-destructive">{resetForm.formState.errors.confirmNewPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={resetForm.formState.isSubmitting}>
                {resetForm.formState.isSubmitting ? "변경 중..." : "비밀번호 변경"}
              </Button>
            </form>
          )}

          {step === "done" && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요.
              </p>
              <Link href="/auth/login" className={buttonVariants({ className: "w-full" })}>
                로그인하기
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

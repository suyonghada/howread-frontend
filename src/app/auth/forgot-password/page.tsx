"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/lib/validations/auth";
import { forgotPassword } from "@/lib/api/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setSent(true);
    } catch {
      toast.error("비밀번호 재설정 이메일 발송에 실패했습니다");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>비밀번호 재설정</CardTitle>
          <CardDescription>
            {sent
              ? "이메일을 확인하세요"
              : "가입한 이메일 주소를 입력하면 재설정 링크를 보내드립니다"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                비밀번호 재설정 링크가 이메일로 발송되었습니다.
                이메일을 확인하고 링크를 클릭해주세요.
              </p>
              <Link href="/auth/login" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                로그인으로 돌아가기
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "발송 중..." : "재설정 이메일 보내기"}
              </Button>
              <Link href="/auth/login" className={buttonVariants({ variant: "ghost", className: "w-full" })}>
                로그인으로 돌아가기
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

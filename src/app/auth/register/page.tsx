"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, verifyCodeSchema, registerSchema, EmailFormData, VerifyCodeFormData, RegisterFormData } from "@/lib/validations/auth";
import { sendVerificationEmail, verifyEmailCode, register as registerUser, checkEmailDuplicate } from "@/lib/api/auth";
import { setAccessToken, setRefreshToken } from "@/lib/api/client";
import { getMe } from "@/lib/api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/types/api";
import { CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "@/store/auth";

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const router = useRouter();
  const { refreshUser } = useAuth();

  // Step 1: Email
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  // Step 2: Code
  const codeForm = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
  });

  // Step 3: Register
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "" },
  });

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      // Check duplicate
      const available = await checkEmailDuplicate(data.email);
      if (!available) {
        emailForm.setError("email", { message: "이미 사용 중인 이메일입니다" });
        return;
      }
      await sendVerificationEmail({ email: data.email });
      setVerifiedEmail(data.email);
      registerForm.setValue("email", data.email);
      setStep(2);
      toast.success("인증 코드가 발송되었습니다. 이메일을 확인해주세요.");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("이메일 발송에 실패했습니다");
      }
    }
  };

  const handleCodeSubmit = async (data: VerifyCodeFormData) => {
    try {
      await verifyEmailCode({ email: verifiedEmail, code: data.code });
      setStep(3);
      toast.success("이메일 인증이 완료되었습니다");
    } catch (err) {
      if (err instanceof ApiError) {
        codeForm.setError("code", { message: err.message });
      } else {
        toast.error("인증 코드 확인에 실패했습니다");
      }
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    try {
      const tokens = await registerUser({
        email: data.email,
        password: data.password,
        });
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      await refreshUser();
      toast.success("회원가입이 완료되었습니다!");
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("회원가입에 실패했습니다");
      }
    }
  };

  const steps = [
    { num: 1, label: "이메일 인증" },
    { num: 2, label: "코드 확인" },
    { num: 3, label: "정보 입력" },
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>
            {step === 1 && "이메일을 입력하고 인증 코드를 받으세요"}
            {step === 2 && `${verifiedEmail}로 발송된 코드를 입력하세요`}
            {step === 3 && "비밀번호를 설정하세요"}
          </CardDescription>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 pt-2">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {step > s.num ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : step === s.num ? (
                    <Circle className="h-5 w-5 text-primary fill-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={`text-xs ${step === s.num ? "font-semibold" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="h-px w-6 bg-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
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
              <Button
                type="submit"
                className="w-full"
                disabled={emailForm.formState.isSubmitting}
              >
                {emailForm.formState.isSubmitting ? "발송 중..." : "인증 코드 받기"}
              </Button>
            </form>
          )}

          {/* Step 2: Code */}
          {step === 2 && (
            <form onSubmit={codeForm.handleSubmit(handleCodeSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="code">인증 코드</Label>
                <Input
                  id="code"
                  placeholder="6자리 코드"
                  maxLength={6}
                  {...codeForm.register("code")}
                />
                {codeForm.formState.errors.code && (
                  <p className="text-xs text-destructive">{codeForm.formState.errors.code.message}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={codeForm.formState.isSubmitting}
                >
                  {codeForm.formState.isSubmitting ? "확인 중..." : "확인"}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Register */}
          {step === 3 && (
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label>이메일</Label>
                <Input value={verifiedEmail} disabled />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="8자 이상, 영문+숫자"
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호 재입력"
                  {...registerForm.register("confirmPassword")}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting ? "가입 중..." : "회원가입 완료"}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className="font-medium hover:underline">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export const emailSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
});

export const verifyCodeSchema = z.object({
  code: z.string().length(6, "6자리 코드를 입력해주세요"),
});

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다")
      .regex(/[A-Za-z]/, "영문자를 포함해야 합니다")
      .regex(/[0-9]/, "숫자를 포함해야 합니다"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요"),
    newPassword: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다")
      .regex(/[A-Za-z]/, "영문자를 포함해야 합니다")
      .regex(/[0-9]/, "숫자를 포함해야 합니다"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmNewPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

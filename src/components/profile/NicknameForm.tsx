"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";

const schema = z.object({
  nickname: z.string().min(2, "2자 이상").max(20, "20자 이하"),
});
type FormData = z.infer<typeof schema>;

export function NicknameForm() {
  const { user } = useAuth();
  const { updateNicknameMutation } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nickname: user?.nickname ?? "" },
  });

  return (
    <form onSubmit={handleSubmit((d) => updateNicknameMutation.mutateAsync(d.nickname))} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="nickname">닉네임</Label>
        <Input id="nickname" {...register("nickname")} />
        {errors.nickname && (
          <p className="text-xs text-destructive">{errors.nickname.message}</p>
        )}
      </div>
      <Button type="submit" size="sm" disabled={isSubmitting || updateNicknameMutation.isPending}>
        변경
      </Button>
    </form>
  );
}

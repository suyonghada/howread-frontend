"use client";

import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/store/auth";

export function ProfileImageUpload() {
  const { user } = useAuth();
  const { uploadImageMutation } = useProfile();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImageMutation.mutate(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.profileImageUrl ?? undefined} />
          <AvatarFallback className="text-2xl">{user?.nickname?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground p-1 shadow-sm hover:bg-primary/90"
          aria-label="프로필 이미지 변경"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploadImageMutation.isPending}
      >
        {uploadImageMutation.isPending ? "업로드 중..." : "이미지 변경"}
      </Button>
    </div>
  );
}

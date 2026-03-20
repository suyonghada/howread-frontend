"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { likeReview, unlikeReview } from "@/lib/api/reviews";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";

interface LikeButtonProps {
  bookId: number;
  reviewId: number;
  isLiked: boolean;
  likeCount: number;
}

export function LikeButton({ bookId, reviewId, isLiked: initialLiked, likeCount: initialCount }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleToggle = async () => {
    if (!isAuthenticated) {
      toast.info("좋아요를 누르려면 로그인이 필요합니다");
      return;
    }
    if (isPending) return;

    // Optimistic update
    setIsLiked((prev) => !prev);
    setCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsPending(true);

    try {
      if (isLiked) {
        await unlikeReview(bookId, reviewId);
      } else {
        await likeReview(bookId, reviewId);
      }
    } catch {
      // Revert on failure
      setIsLiked((prev) => !prev);
      setCount((prev) => (isLiked ? prev + 1 : prev - 1));
      toast.error("좋아요 처리 중 오류가 발생했습니다");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={cn("gap-1 h-8 px-2", isLiked && "text-red-500")}
    >
      <Heart className={cn("h-4 w-4", isLiked && "fill-red-500")} />
      <span className="text-xs">{count}</span>
    </Button>
  );
}

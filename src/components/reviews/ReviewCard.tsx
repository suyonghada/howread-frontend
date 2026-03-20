"use client";

import { Review } from "@/types/review";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { LikeButton } from "./LikeButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ReviewCardProps {
  review: Review;
  bookId: number;
  isOwner?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
}

export function ReviewCard({ review, bookId, isOwner = false, onEdit, onDelete }: ReviewCardProps) {
  if (review.isBlurred) {
    return (
      <div className="relative border rounded-lg p-4 overflow-hidden">
        <div className="blur-sm select-none pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">회원 리뷰</p>
              <p className="text-xs text-muted-foreground">방금 전</p>
            </div>
          </div>
          <p className="text-sm">로그인 후 리뷰를 확인하세요. 이 리뷰의 내용은 회원만 볼 수 있습니다.</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
          <Link href="/auth/login" className={buttonVariants({ size: "sm" })}>
            로그인하고 리뷰 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{review.userId}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">{formatRelativeTime(review.createdAt)}</p>
          </div>
        </div>
        {isOwner && (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(review)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete?.(review.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm whitespace-pre-wrap mb-3">{review.content}</p>
      <LikeButton
        bookId={bookId}
        reviewId={review.id}
        isLiked={review.isLikedByMe}
        likeCount={review.likeCount}
      />
    </div>
  );
}

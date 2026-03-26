"use client";

import { useState } from "react";
import { Review } from "@/types/review";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { LikeButton } from "./LikeButton";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginDialog } from "@/components/auth/LoginDialog";

interface ReviewCardProps {
  review: Review;
  bookId: number;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
}

export function ReviewCard({ review, bookId, onEdit, onDelete }: ReviewCardProps) {
  const [loginOpen, setLoginOpen] = useState(false);

  if (review.isBlurred) {
    return (
      <>
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
            <Button size="sm" onClick={() => setLoginOpen(true)}>
              로그인하고 리뷰 보기
            </Button>
          </div>
        </div>

        <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>로그인</DialogTitle>
            </DialogHeader>
            <LoginDialog onClose={() => setLoginOpen(false)} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={review.profileImageUrl ?? undefined} alt={review.nickname ?? undefined} />
            <AvatarFallback>
              {review.nickname ? review.nickname.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{review.nickname ?? "알 수 없음"}</p>
            <p className="text-xs text-muted-foreground">{formatRelativeTime(review.createdAt)}</p>
          </div>
        </div>
        {review.isOwner && (
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

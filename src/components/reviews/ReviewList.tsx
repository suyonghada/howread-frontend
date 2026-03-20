"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, createReview, updateReview, deleteReview } from "@/lib/api/reviews";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { Review, ReviewSortType } from "@/types/review";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SORT_OPTIONS: { label: string; value: ReviewSortType }[] = [
  { label: "좋아요순", value: "LIKES_DESC" },
  { label: "최신순", value: "NEWEST" },
  { label: "오래된순", value: "OLDEST" },
];

interface ReviewListProps {
  bookId: number;
}

export function ReviewList({ bookId }: ReviewListProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [sort, setSort] = useState<ReviewSortType>("LIKES_DESC");
  const [page, setPage] = useState(0);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", bookId, sort, page],
    queryFn: () => getReviews(bookId, { sort, page, size: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => createReview(bookId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
      toast.success("리뷰가 작성되었습니다");
    },
    onError: () => toast.error("리뷰 작성에 실패했습니다"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      updateReview(bookId, id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
      setEditingReview(null);
      toast.success("리뷰가 수정되었습니다");
    },
    onError: () => toast.error("리뷰 수정에 실패했습니다"),
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => deleteReview(bookId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
      toast.success("리뷰가 삭제되었습니다");
    },
    onError: () => toast.error("리뷰 삭제에 실패했습니다"),
  });

  const reviews = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.totalCount / 10) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          리뷰 {data?.totalCount !== undefined && `(${data.totalCount})`}
        </h2>
        <div className="flex gap-1">
          {SORT_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={sort === opt.value ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setSort(opt.value);
                setPage(0);
              }}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {isAuthenticated && (
        <div className="border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">리뷰 작성</p>
          <ReviewForm onSubmit={async (content) => { await createMutation.mutateAsync(content); }} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                bookId={bookId}
                onEdit={setEditingReview}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
            {reviews.length === 0 && (
              <p className="text-center py-8 text-muted-foreground text-sm">
                아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(0, p - 1)); }}
                    aria-disabled={page === 0}
                    className={page === 0 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4 py-2 text-sm">
                    {page + 1} / {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages - 1, p + 1)); }}
                    aria-disabled={page >= totalPages - 1}
                    className={page >= totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <Dialog open={!!editingReview} onOpenChange={(open) => !open && setEditingReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>리뷰 수정</DialogTitle>
          </DialogHeader>
          {editingReview && (
            <ReviewForm
              initialContent={editingReview.content}
              isEdit
              onSubmit={async (content) => {
                await updateMutation.mutateAsync({ id: editingReview.id, content });
              }}
              onCancel={() => setEditingReview(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

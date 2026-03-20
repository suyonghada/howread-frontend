"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/auth";
import { getMyReviews } from "@/lib/api/reviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import { NicknameForm } from "@/components/profile/NicknameForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProfilePage() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteAccountMutation } = useProfile();
  const router = useRouter();

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["my-reviews", page],
    queryFn: () => getMyReviews({ page, size: 10 }),
  });

  const handleDeleteAccount = async () => {
    await deleteAccountMutation.mutateAsync();
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">마이 페이지</h1>

      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">내 정보</TabsTrigger>
          <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">프로필 이미지</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileImageUpload />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">닉네임 변경</CardTitle>
            </CardHeader>
            <CardContent>
              <NicknameForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">비밀번호 변경</CardTitle>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-destructive">회원탈퇴</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
              </p>
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                회원탈퇴
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          {reviewsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {reviewsData?.data.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    bookId={review.bookId}
                  />
                ))}
                {reviewsData?.data.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground text-sm">
                    작성한 리뷰가 없습니다
                  </p>
                )}
              </div>

              {(reviewsData?.hasNext || page > 0) && (
                <Pagination className="mt-4">
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
                        {page + 1}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); if (reviewsData?.hasNext) setPage((p) => p + 1); }}
                        aria-disabled={!reviewsData?.hasNext}
                        className={!reviewsData?.hasNext ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </TabsContent>

      </Tabs>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회원탈퇴 확인</DialogTitle>
            <DialogDescription>
              정말로 탈퇴하시겠습니까? 모든 데이터가 삭제되며 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending ? "탈퇴 중..." : "탈퇴하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

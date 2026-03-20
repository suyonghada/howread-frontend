"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getBook } from "@/lib/api/books";
import { useRating } from "@/hooks/useRating";
import { useAuth } from "@/store/auth";
import { StarRating } from "@/components/books/StarRating";
import { ReviewList } from "@/components/reviews/ReviewList";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BookOpen, Star } from "lucide-react";
import { toast } from "sonner";
import { formatDate, getHighResAladinThumbnail } from "@/lib/utils";

interface BookDetailPageProps {
  params: Promise<{ bookId: string }>;
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { bookId } = use(params);
  const id = parseInt(bookId, 10);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBook(id),
    enabled: !!id,
  });

  const { myRating, upsertMutation } = useRating(id);

  const handleRatingChange = async (score: number) => {
    if (!isAuthenticated) {
      toast.info("평점을 남기려면 로그인이 필요합니다");
      return;
    }
    try {
      await upsertMutation.mutateAsync(score);
      toast.success(`${score}점을 부여했습니다`);
    } catch {
      toast.error("평점 저장에 실패했습니다");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8 mb-8">
          <Skeleton className="w-48 h-72 rounded-lg shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-3">
        <p className="text-muted-foreground">도서 정보를 불러오지 못했습니다</p>
        <Button variant="outline" onClick={() => router.back()}>뒤로 가기</Button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">도서를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Book Info */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="relative w-40 h-60 shrink-0 mx-auto sm:mx-0">
          {book.thumbnailUrl ? (
            <Image
              src={getHighResAladinThumbnail(book.thumbnailUrl) ?? book.thumbnailUrl}
              alt={book.title}
              fill
              className="object-cover rounded-lg shadow-md"
              sizes="160px"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted rounded-lg">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-muted-foreground">
            {book.author} · {book.publisher}
          </p>
          {book.publishedDate && (
            <p className="text-sm text-muted-foreground">
              출판일: {formatDate(book.publishedDate)}
            </p>
          )}

          {/* Rating Summary */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-lg">{book.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({book.ratingCount}명 평가)
            </span>
          </div>

          {/* My Rating */}
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isAuthenticated ? "내 평점" : "평점 (로그인 필요)"}
            </p>
            <StarRating
              value={myRating?.rating ?? 0}
              onChange={handleRatingChange}
              readonly={!isAuthenticated}
              size="lg"
            />
          </div>

          {book.description && (
            <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
              {book.description}
            </p>
          )}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Reviews */}
      <ReviewList bookId={id} />
    </div>
  );
}

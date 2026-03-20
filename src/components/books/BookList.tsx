"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBooks, BookListParams } from "@/lib/api/books";
import { BookCard } from "./BookCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CursorPage } from "@/types/api";
import { Book } from "@/types/book";

interface BookListProps {
  params?: BookListParams;
}

export function BookList({ params = {} }: BookListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["books", params],
    queryFn: ({ pageParam }) =>
      getBooks({ ...params, cursor: pageParam, size: 20 }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const el = bottomRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[2/3] rounded-md" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-muted-foreground">도서 목록을 불러오지 못했습니다</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>다시 시도</Button>
      </div>
    );
  }

  const books = data?.pages.flatMap((p) => (p as CursorPage<Book>).data) ?? [];

  if (books.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>등록된 도서가 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      <div ref={bottomRef} className="h-8 mt-4" />

      {isFetchingNextPage && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] rounded-md" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

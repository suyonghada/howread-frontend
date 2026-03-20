import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getBooks, getBook, BookListParams } from "@/lib/api/books";

export function useBookList(params: BookListParams = {}) {
  return useInfiniteQuery({
    queryKey: ["books", params],
    queryFn: ({ pageParam }) =>
      getBooks({ ...params, cursor: pageParam, size: 20 }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useBook(bookId: number) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBook(bookId),
    enabled: !!bookId,
  });
}

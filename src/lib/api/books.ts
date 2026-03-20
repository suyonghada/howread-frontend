import { apiFetch } from "./client";
import { Book, BookSearchResponse, RegisterBookRequest } from "@/types/book";
import { CursorPage, Page } from "@/types/api";

export interface BookListParams {
  query?: string;
  author?: string;
  isbn?: string;
  cursor?: number;
  size?: number;
}

export async function searchBooks(query: string): Promise<BookSearchResponse[]> {
  return apiFetch<BookSearchResponse[]>(`/books/search?query=${encodeURIComponent(query)}`, {
    skipAuth: true,
  });
}

export async function getBooks(params: BookListParams = {}): Promise<CursorPage<Book>> {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set("query", params.query);
  if (params.author) searchParams.set("author", params.author);
  if (params.isbn) searchParams.set("isbn", params.isbn);
  if (params.cursor !== undefined) searchParams.set("cursor", String(params.cursor));
  if (params.size) searchParams.set("size", String(params.size));

  const qs = searchParams.toString();
  return apiFetch<CursorPage<Book>>(`/books${qs ? `?${qs}` : ""}`, { skipAuth: true });
}

export async function getBook(bookId: number): Promise<Book> {
  return apiFetch<Book>(`/books/${bookId}`, { skipAuth: true });
}

export async function registerBook(data: RegisterBookRequest): Promise<Book> {
  return apiFetch<Book>("/books", {
    method: "POST",
    body: data,
  });
}

export async function getRecentBooks(size = 8): Promise<Book[]> {
  const result = await apiFetch<CursorPage<Book>>(`/books?size=${size}`, { skipAuth: true });
  return result.data;
}

import { apiFetch } from "./client";
import { Rating, UpsertRatingRequest } from "@/types/rating";

export async function getMyRating(bookId: number): Promise<Rating | null> {
  try {
    return await apiFetch<Rating>(`/books/${bookId}/ratings/me`);
  } catch {
    return null;
  }
}

export async function upsertRating(bookId: number, data: UpsertRatingRequest): Promise<Rating> {
  return apiFetch<Rating>(`/books/${bookId}/ratings`, {
    method: "POST",
    body: data,
  });
}

export async function deleteRating(bookId: number): Promise<void> {
  return apiFetch<void>(`/books/${bookId}/ratings`, {
    method: "DELETE",
  });
}

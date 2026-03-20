import { apiFetch } from "./client";
import { Review, ReviewSortType, CreateReviewRequest, UpdateReviewRequest, ReviewPage } from "@/types/review";

export interface ReviewListParams {
  sort?: ReviewSortType;
  page?: number;
  size?: number;
}

export async function getReviews(bookId: number, params: ReviewListParams = {}): Promise<ReviewPage> {
  const searchParams = new URLSearchParams();
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));

  const qs = searchParams.toString();
  return apiFetch<ReviewPage>(`/books/${bookId}/reviews${qs ? `?${qs}` : ""}`);
}

export async function createReview(bookId: number, data: CreateReviewRequest): Promise<Review> {
  return apiFetch<Review>(`/books/${bookId}/reviews`, {
    method: "POST",
    body: data,
  });
}

export async function updateReview(
  bookId: number,
  reviewId: number,
  data: UpdateReviewRequest
): Promise<Review> {
  return apiFetch<Review>(`/books/${bookId}/reviews/${reviewId}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteReview(bookId: number, reviewId: number): Promise<void> {
  return apiFetch<void>(`/books/${bookId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

export async function likeReview(bookId: number, reviewId: number): Promise<void> {
  return apiFetch<void>(`/books/${bookId}/reviews/${reviewId}/like`, {
    method: "POST",
  });
}

export async function unlikeReview(bookId: number, reviewId: number): Promise<void> {
  return apiFetch<void>(`/books/${bookId}/reviews/${reviewId}/like`, {
    method: "DELETE",
  });
}

export async function getMyReviews(params: { page?: number; size?: number } = {}): Promise<ReviewPage> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  const qs = searchParams.toString();
  return apiFetch<ReviewPage>(`/users/me/reviews${qs ? `?${qs}` : ""}`);
}

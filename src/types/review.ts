export interface Review {
  id: number;
  bookId: number;
  userId: number;
  content: string;
  likeCount: number;
  isLikedByMe: boolean;
  isBlurred: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPage {
  data: Review[];
  page: number;
  size: number;
  totalCount: number;
  hasNext: boolean;
}

export type ReviewSortType = "LIKES_DESC" | "NEWEST" | "OLDEST";

export interface CreateReviewRequest {
  content: string;
}

export interface UpdateReviewRequest {
  content: string;
}

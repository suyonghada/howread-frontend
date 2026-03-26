export interface Review {
  id: number;
  bookId: number;
  userId: number;
  nickname: string | null;
  profileImageUrl: string | null;
  content: string;
  likeCount: number;
  isLikedByMe: boolean;
  isOwner: boolean;
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

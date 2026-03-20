export interface Review {
  id: number;
  bookId: number;
  userId: number;
  userNickname: string;
  userProfileImageUrl: string | null;
  content: string;
  likeCount: number;
  isLiked: boolean;
  isBlurred: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ReviewSortType = "LIKES_DESC" | "NEWEST" | "OLDEST";

export interface CreateReviewRequest {
  content: string;
}

export interface UpdateReviewRequest {
  content: string;
}

export interface Rating {
  id: number;
  bookId: number;
  userId: number;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertRatingRequest {
  score: number;
}

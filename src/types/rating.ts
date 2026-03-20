export interface Rating {
  id: number;
  bookId: number;
  userId: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertRatingRequest {
  rating: number;
}

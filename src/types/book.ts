export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  description: string;
  thumbnailUrl: string | null;
  averageRating: number;
  ratingCount: number;
}

export interface BookSearchResponse {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  thumbnailUrl: string;
  description: string;
}

export interface RegisterBookRequest {
  isbn: string;
}

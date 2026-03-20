export interface Book {
  id: number;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  coverImageUrl: string | null;
  averageRating: number;
  ratingCount: number;
  reviewCount: number;
  createdAt: string;
}

export interface KakaoBook {
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  datetime: string;
  contents: string;
  thumbnail: string;
}

export interface BookSearchResult {
  books: KakaoBook[];
  isEnd: boolean;
}

export interface RegisterBookRequest {
  isbn: string;
}

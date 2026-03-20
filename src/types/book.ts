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

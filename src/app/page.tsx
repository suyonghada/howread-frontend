import { BookSearchBar } from "@/components/books/BookSearchBar";
import { BookList } from "@/components/books/BookList";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">당신의 독서 이야기를 나누세요</h1>
        <p className="text-muted-foreground text-lg mb-8">
          책을 검색하고, 평점을 남기고, 리뷰를 공유해보세요
        </p>
        <div className="flex justify-center">
          <BookSearchBar />
        </div>
      </section>

      {/* Recent Books */}
      <section>
        <h2 className="text-xl font-semibold mb-4">최근 등록된 도서</h2>
        <BookList />
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { BookList } from "@/components/books/BookList";
import { AddBookDialog } from "@/components/books/AddBookDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function BooksPage() {
  const [titleQuery, setTitleQuery] = useState("");
  const [authorQuery, setAuthorQuery] = useState("");
  const [isbnQuery, setIsbnQuery] = useState("");
  const [activeParams, setActiveParams] = useState<{
    query?: string;
    author?: string;
    isbn?: string;
  }>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveParams({
      query: titleQuery || undefined,
      author: authorQuery || undefined,
      isbn: isbnQuery || undefined,
    });
  };

  const handleReset = () => {
    setTitleQuery("");
    setAuthorQuery("");
    setIsbnQuery("");
    setActiveParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">도서 목록</h1>
        <AddBookDialog />
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6 items-end">
        <div className="space-y-1">
          <Label htmlFor="title-search" className="text-xs">제목</Label>
          <Input
            id="title-search"
            value={titleQuery}
            onChange={(e) => setTitleQuery(e.target.value)}
            placeholder="제목 검색..."
            className="w-48"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="author-search" className="text-xs">저자</Label>
          <Input
            id="author-search"
            value={authorQuery}
            onChange={(e) => setAuthorQuery(e.target.value)}
            placeholder="저자 검색..."
            className="w-48"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="isbn-search" className="text-xs">ISBN</Label>
          <Input
            id="isbn-search"
            value={isbnQuery}
            onChange={(e) => setIsbnQuery(e.target.value)}
            placeholder="ISBN..."
            className="w-40"
          />
        </div>
        <Button type="submit" size="sm" className="gap-1">
          <Search className="h-4 w-4" />
          검색
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleReset}>
          초기화
        </Button>
      </form>

      <BookList params={activeParams} />
    </div>
  );
}

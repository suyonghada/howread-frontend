"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { searchBooks, registerBook } from "@/lib/api/books";
import { BookSearchResponse } from "@/types/book";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce } from "@/lib/utils";
import { ApiError } from "@/types/api";

export function BookSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookSearchResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [registeringIsbn, setRegisteringIsbn] = useState<string | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useRef(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      setIsSearching(true);
      try {
        const data = await searchBooks(q);
        setResults(data ?? []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    doSearch(query);
  }, [query, doSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRegisterAndView = async (book: BookSearchResponse) => {
    setRegisteringIsbn(book.isbn);
    try {
      const registered = await registerBook({ isbn: book.isbn });
      setIsOpen(false);
      router.push(`/books/${registered.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.code === "BOOK_ALREADY_EXISTS") {
        // Try to search for existing book
        toast.info("이미 등록된 도서입니다. 도서 페이지로 이동합니다.");
      } else {
        toast.error("도서 등록에 실패했습니다");
      }
    } finally {
      setRegisteringIsbn(null);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="책 제목, 저자, ISBN으로 검색..."
          className="pl-9 pr-10"
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((book) => (
            <div
              key={book.isbn}
              className="flex items-start gap-3 p-3 hover:bg-muted border-b last:border-b-0"
            >
              {book.thumbnailUrl && (
                <Image
                  src={book.thumbnailUrl}
                  alt={book.title}
                  width={40}
                  height={56}
                  className="object-cover rounded shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRegisterAndView(book)}
                disabled={registeringIsbn === book.isbn}
                className="shrink-0"
              >
                {registeringIsbn === book.isbn ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "보기"
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {isOpen && !isSearching && query && results.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
}

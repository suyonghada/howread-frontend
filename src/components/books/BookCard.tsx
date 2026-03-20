import Link from "next/link";
import Image from "next/image";
import { Book } from "@/types/book";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
        <div className="relative aspect-[2/3] bg-muted">
          {book.coverImageUrl ? (
            <Image
              src={book.coverImageUrl}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
            {book.authors.join(", ")}
          </p>
          <div className="flex items-center gap-1">
            <StarRating value={book.averageRating} readonly size="sm" />
            <span className="text-xs text-muted-foreground">({book.ratingCount})</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

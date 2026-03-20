import Link from "next/link";
import Image from "next/image";
import { Book } from "@/types/book";
import { StarRating } from "./StarRating";
import { BookOpen } from "lucide-react";
import { getHighResAladinThumbnail } from "@/lib/utils";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="overflow-hidden rounded-lg border hover:shadow-md transition-shadow h-full">
        <div className="relative aspect-[2/3] bg-muted">
          {book.thumbnailUrl ? (
            <Image
              src={getHighResAladinThumbnail(book.thumbnailUrl) ?? book.thumbnailUrl}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 20vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="p-2">
          <h3 className="font-medium text-xs line-clamp-2 mb-0.5">{book.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{book.author}</p>
          <div className="flex items-center gap-1">
            <StarRating value={book.averageRating} readonly size="sm" />
            <span className="text-xs text-muted-foreground">({book.ratingCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

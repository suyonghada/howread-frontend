"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (score: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClass = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const display = hovered > 0 ? hovered : value;

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="평점">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          aria-label={`${star}점`}
        >
          <Star
            className={cn(
              sizeClass[size],
              display >= star
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}

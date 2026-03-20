"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewFormProps {
  initialContent?: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

export function ReviewForm({ initialContent = "", onSubmit, onCancel, isEdit = false }: ReviewFormProps) {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      await onSubmit(content);
      if (!isEdit) setContent("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="이 책에 대한 리뷰를 작성해주세요..."
        className="min-h-24 resize-none"
        maxLength={2000}
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{content.length}/2000</span>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              취소
            </Button>
          )}
          <Button type="submit" size="sm" disabled={isLoading || !content.trim()}>
            {isLoading ? "저장 중..." : isEdit ? "수정" : "리뷰 작성"}
          </Button>
        </div>
      </div>
    </form>
  );
}

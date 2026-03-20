"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookSearchBar } from "./BookSearchBar";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export function AddBookDialog() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!isAuthenticated) {
      toast.error("도서를 등록하려면 로그인이 필요합니다");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button className={buttonVariants({ size: "sm" })} onClick={handleOpen}>
        <Plus className="h-4 w-4 mr-1" />
        새 도서 추가
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>새 도서 추가</DialogTitle>
            <DialogDescription>
              카카오 도서 검색으로 책을 찾아 등록하세요
            </DialogDescription>
          </DialogHeader>
          <BookSearchBar onRegisterSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

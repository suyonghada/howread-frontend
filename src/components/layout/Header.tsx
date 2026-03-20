"use client";

import Link from "next/link";
import { useAuth } from "@/store/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("로그아웃 되었습니다");
    } catch {
      toast.error("로그아웃 중 오류가 발생했습니다");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <BookOpen className="h-5 w-5" />
          HowRead
        </Link>

        <nav className="flex items-center gap-4 ml-4">
          <Link href="/books" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            도서 목록
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/profile">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user?.profileImageUrl ?? undefined} alt={user?.nickname} />
                  <AvatarFallback>{user?.nickname?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                로그인
              </Link>
              <Link href="/auth/register" className={buttonVariants({ size: "sm" })}>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

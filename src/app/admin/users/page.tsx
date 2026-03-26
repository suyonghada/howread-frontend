"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { getAdminUsers, changeUserRole, AdminUser } from "@/lib/api/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
    enabled: user?.role === "ADMIN",
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: "ADMIN" | "MEMBER" }) =>
      changeUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("권한이 변경되었습니다");
    },
    onError: () => toast.error("권한 변경에 실패했습니다"),
  });

  if (authLoading || user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">사용자 관리</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {users?.map((u: AdminUser) => (
            <div
              key={u.id}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={u.profileImageUrl ?? undefined} alt={u.nickname} />
                  <AvatarFallback>{u.nickname.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{u.nickname}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                  {u.role}
                </Badge>
                {u.role === "MEMBER" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={roleMutation.isPending}
                    onClick={() => roleMutation.mutate({ userId: u.id, role: "ADMIN" })}
                  >
                    관리자 지정
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={roleMutation.isPending || u.email === user?.email}
                    onClick={() => roleMutation.mutate({ userId: u.id, role: "MEMBER" })}
                  >
                    권한 해제
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

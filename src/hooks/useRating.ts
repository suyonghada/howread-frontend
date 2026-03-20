import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyRating, upsertRating, deleteRating } from "@/lib/api/ratings";
import { useAuth } from "@/store/auth";

export function useRating(bookId: number) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: myRating } = useQuery({
    queryKey: ["rating", bookId, "me"],
    queryFn: () => getMyRating(bookId),
    enabled: isAuthenticated,
  });

  const upsertMutation = useMutation({
    mutationFn: (score: number) => upsertRating(bookId, { rating: score }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rating", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRating(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rating", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });

  return { myRating, upsertMutation, deleteMutation };
}

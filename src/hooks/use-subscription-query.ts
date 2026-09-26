"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { SubscriptionApiError, subscriptionRequest } from "@/lib/subscription-api";

export function useSubscriptionQuery<T>(key: readonly unknown[], path: string, enabled = true) {
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? "";
  const query = useQuery({
    queryKey: ["subscription", session?.user.id, ...key],
    queryFn: ({ signal }) => subscriptionRequest<T>(path, token, { signal }),
    enabled: enabled && status === "authenticated" && Boolean(token),
    staleTime: 30_000,
    retry: (count, error) => !(error instanceof SubscriptionApiError && error.status < 500) && count < 1,
  });
  const authError = status === "unauthenticated" || (status === "authenticated" && !token)
    ? new SubscriptionApiError("Please sign in to view subscription data.", 401) : null;
  return { ...query, error: authError ?? query.error, isPending: status === "loading" || (!authError && query.isPending) };
}

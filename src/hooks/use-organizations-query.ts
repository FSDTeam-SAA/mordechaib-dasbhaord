"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { SubscriptionApiError, subscriptionRequest } from "@/lib/subscription-api";

export function useOrganizationsQuery<T>(path: string) {
  const { data: session, status } = useSession();
  const token = session?.accessToken ?? "";
  const query = useQuery({
    queryKey: ["organizations", session?.user.id, path],
    queryFn: ({ signal }) => subscriptionRequest<T>(path, token, { signal }),
    enabled: status === "authenticated" && Boolean(token),
    staleTime: 0,
    retry: (count, error) => !(error instanceof SubscriptionApiError && error.status < 500) && count < 1,
  });
  const authError = status === "unauthenticated" || (status === "authenticated" && !token)
    ? new SubscriptionApiError("Please sign in to view organizations.", 401) : null;
  return { ...query, error: authError ?? query.error, isPending: status === "loading" || (!authError && query.isPending) };
}

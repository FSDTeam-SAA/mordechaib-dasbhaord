"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSubscriptionQuery } from "@/hooks/use-subscription-query";
import { subscriptionRequest, type ApiPlan, type BillingCycle, type PlanInput } from "@/lib/subscription-api";

function usePlanState() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("month");
  const { data: session } = useSession();
  const client = useQueryClient();
  const query = useSubscriptionQuery<ApiPlan[]>(["plans", billingCycle], `/subscription-plans/admin?billingCycle=${billingCycle}`);
  const mutation = useMutation({
    mutationFn: ({ id, body }: { id?: string; body: PlanInput }) => subscriptionRequest<ApiPlan>(
      id ? `/subscription-plans/${encodeURIComponent(id)}` : "/subscription-plans",
      session?.accessToken ?? "", { method: id ? "PATCH" : "POST", body },
    ),
    onSuccess: () => client.invalidateQueries({ queryKey: ["subscription", session?.user.id] }),
  });
  return { plans: query.data ?? [], query, billingCycle, setBillingCycle, savePlan: mutation.mutateAsync, saving: mutation.isPending };
}
const PlanContext = createContext<ReturnType<typeof usePlanState> | null>(null);
export function PlanProvider({ children }: { children: ReactNode }) {
  const value = usePlanState();
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
export function usePlans() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("PlanProvider is required");
  return context;
}

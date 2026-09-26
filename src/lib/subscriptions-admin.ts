import type { BillingCycle, PlanType } from "./subscription-api";

export const subscriptionStatuses = {
  ACTIVE: "Active", TRIALING: "Trialing", PAST_DUE: "Past due", CANCELED: "Canceled", INCOMPLETE: "Incomplete",
} as const;
export type SubscriptionStatus = keyof typeof subscriptionStatuses;
export type SubscriptionFilters = { search: string; planType: PlanType | ""; status: SubscriptionStatus | ""; page: number; limit: number };
export function subscriptionsPath(filters: SubscriptionFilters) {
  const params = new URLSearchParams({ page: String(filters.page), limit: String(filters.limit) });
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.planType) params.set("planType", filters.planType);
  if (filters.status) params.set("status", filters.status);
  return `/subscriptions-admin?${params}`;
}
export type PurchasedSubscription = {
  id: string; organizationId: string; organizationName: string;
  planId: string; planType: PlanType | null; planName: string;
  mrrUsd: number; billingInterval: BillingCycle | null; nextRenewal: string | null;
  status: SubscriptionStatus; pausedUntil: string | null;
};
export type PurchasedSubscriptions = { items: PurchasedSubscription[]; page: number; limit: number; total: number; totalPages: number };
export type SubscriptionDetails = {
  id: string;
  organization: { id: string; name: string; emailAddress: string | null; phoneNumber: string | null; status: string; address: { street?: string; city?: string; state?: string; postalCode?: string } | null } | null;
  plan: { id: string; planType: PlanType; name: string } | null;
  billingCycle: BillingCycle | null; mrrUsd: number; status: SubscriptionStatus;
  currentPeriodStart: string | null; nextRenewal: string | null; pausedUntil: string | null; cancelAtPeriodEnd: boolean;
  activeAddons: { category: string; addonProductId: string; tierIndex: number; label: string; quantity: number; priceUsd: number }[];
  stripeCustomerId: string | null; stripeSubscriptionId: string | null; createdAt: string; updatedAt: string;
};
export function subscriptionDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}
export const billingLabel = (cycle?: string | null) => cycle === "month" ? "Monthly" : cycle === "year" ? "Annually" : "—";
export function paginationPages(current: number, total: number) {
  return [...new Set([1, current - 1, current, current + 1, total])].filter(page => page > 0 && page <= total).sort((a, b) => a - b);
}

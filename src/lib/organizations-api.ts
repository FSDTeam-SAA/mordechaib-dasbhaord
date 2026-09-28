import { subscriptionRequest } from "./subscription-api";
import { subscriptionDate } from "./subscriptions-admin";

export type OrganizationStatus = "ACTIVE" | "SUSPENDED";
export type OrganizationSubscription = {
  status?: string; billingInterval?: "month" | "year" | null; nextRenewal?: string | null;
  plan?: { id?: string; planType?: string; name?: string } | null;
};
export type OrganizationItem = {
  id: string; name: string; businessSize?: string | null; joinedAt?: string | null;
  status: OrganizationStatus; owner?: { name?: string; email?: string } | null;
  memberCount: number; subscription?: OrganizationSubscription | null;
};
export type OrganizationsPage = {
  items: OrganizationItem[]; page: number; limit: number; total: number; totalPages: number;
  summary: { totalOrganizations: number; activeOrganizations: number; suspendedOrganizations: number };
};
export type OrganizationDetailsData = {
  organization: {
    id: string; name: string; status: OrganizationStatus; logoUrl?: string | null;
    website?: string | null; industry?: string | null; emailAddress?: string | null;
    phoneNumber?: string | null; businessSize?: string | null; language?: string;
    businessHours?: { start?: string; end?: string } | null;
    address?: { city?: string; street?: string; state?: string; postalCode?: string } | null;
    createdAt?: string | null;
  };
  owner?: { name?: string; email?: string } | null;
  memberCount: number; subscription?: OrganizationSubscription | null;
  connectedTools: { items: { provider: string; label: string; connected: boolean }[] };
};
export const organizationStatuses = { ACTIVE: "Active", SUSPENDED: "Suspended" } as const;
export const organizationPlans = { STARTER: "Starter", GROWTH: "Growth", ENTERPRISE: "Enterprise", CUSTOM: "Custom" } as const;
export function organizationsPath(filters: { page: number; limit: number; search: string; plan: string; status: string }) {
  const params = new URLSearchParams({ page: String(filters.page), limit: String(filters.limit) });
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.plan !== "all") params.set("planType", filters.plan);
  if (filters.status !== "all") params.set("status", filters.status);
  return `/organizations-admin?${params}`;
}
export const organizationDetailPath = (id: string) => `/organizations-admin/${encodeURIComponent(id)}`;
export const updateOrganizationStatus = (id: string, status: OrganizationStatus, token: string) =>
  subscriptionRequest<OrganizationDetailsData>(`${organizationDetailPath(id)}/status`, token, { method: "PATCH", body: { status } });
export function businessSizeLabel(value?: string | null) {
  const labels: Record<string, string> = { SOLO: "1 employee", TWO_TO_TEN: "2-10 employees", ELEVEN_TO_FIFTY: "11-50 employees", FIFTY_ONE_TO_ONE_HUNDRED: "51-100 employees", ONE_HUNDRED_ONE_TO_FIVE_HUNDRED: "101-500 employees", FIVE_HUNDRED_PLUS: "500+ employees" };
  return value ? labels[value] ?? value : "—";
}
export function organizationRow(item: OrganizationItem) {
  return { id: item.id, name: item.name, owner: item.owner?.name || "—", employees: businessSizeLabel(item.businessSize),
    joined: subscriptionDate(item.joinedAt), plan: item.subscription?.plan?.name || "—",
    planType: item.subscription?.plan?.planType ?? "", status: organizationStatuses[item.status] };
}
